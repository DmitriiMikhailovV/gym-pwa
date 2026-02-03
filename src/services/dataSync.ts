import { db, WorkoutDay, Exercise, ExerciseSet } from './db'
import { supabase } from './supabaseClient'

let isSyncRunning = false

async function deduplicateSets(exerciseId: number) {
  const sets = await db.sets.where('exerciseId').equals(exerciseId).toArray()
  const byNum: Record<number, ExerciseSet[]> = {}

  sets.forEach((s) => {
    if (!byNum[s.setNumber]) byNum[s.setNumber] = []
    byNum[s.setNumber].push(s)
  })

  for (const numStr in byNum) {
    const num = parseInt(numStr)
    const group = byNum[num]
    if (group.length > 1) {
      group.sort((a, b) => {
        const aHasId = a.supabaseId ? 1 : 0
        const bHasId = b.supabaseId ? 1 : 0
        if (aHasId !== bHasId) return bHasId - aHasId
        return (a.id || 0) - (b.id || 0)
      })

      const others = group.slice(1)

      for (const other of others) {
        if (other.id) await db.sets.delete(other.id)
      }
    }
  }
}

async function cleanupDuplicateExercises(dayId: number) {
  const exercises = await db.exercises.where('workoutDayId').equals(dayId).toArray()
  const byName: Record<string, Exercise[]> = {}

  exercises.forEach((e) => {
    const name = e.name.trim()
    if (!byName[name]) byName[name] = []
    byName[name].push(e)
  })

  for (const name of Object.keys(byName)) {
    const group = byName[name]
    if (group.length > 1) {
      console.log(`🧹 Merging duplicate exercise "${name}"...`)

      group.sort((a, b) => {
        const aHasId = a.supabaseId ? 1 : 0
        const bHasId = b.supabaseId ? 1 : 0
        if (aHasId !== bHasId) return bHasId - aHasId
        return (a.id || 0) - (b.id || 0)
      })

      const main = group[0]
      const others = group.slice(1)

      for (const other of others) {
        await db.sets.where('exerciseId').equals(other.id!).modify({ exerciseId: main.id! })
        if (other.id) await db.exercises.delete(other.id)
      }

      if (main.id) await deduplicateSets(main.id)
    }
  }
}

async function cleanupLocalDuplicates(userId: string) {
  await db.transaction('rw', db.workoutDays, db.exercises, db.sets, async () => {
    const days = await db.workoutDays.toArray()
    const validDays = days.filter(
      (d) => d.userId === userId || d.userId === 'offline-user' || !d.userId
    )

    const daysByName: Record<string, WorkoutDay[]> = {}
    validDays.forEach((d) => {
      const name = d.name.trim()
      if (!daysByName[name]) daysByName[name] = []
      daysByName[name].push(d)
    })

    for (const name of Object.keys(daysByName)) {
      const group = daysByName[name]

      if (group.length > 0) {
        let main = group[0]

        if (group.length > 1) {
          console.log(`🧹 Merging duplicate day "${name}"...`)
          group.sort((a, b) => {
            const aHasId = a.supabaseId ? 1 : 0
            const bHasId = b.supabaseId ? 1 : 0
            if (aHasId !== bHasId) return bHasId - aHasId
            return (a.id || 0) - (b.id || 0)
          })

          main = group[0]
          const others = group.slice(1)

          for (const other of others) {
            await db.exercises
              .where('workoutDayId')
              .equals(other.id!)
              .modify({ workoutDayId: main.id! })

            if (other.id) await db.workoutDays.delete(other.id)
          }
        }
        if (main.id) await cleanupDuplicateExercises(main.id)
      }
    }
  })
}

export async function syncWithSupabase(userId: string) {
  if (isSyncRunning) {
    console.log('⏳ Sync already in progress, skipping...')
    return
  }

  isSyncRunning = true
  try {
    console.log('🔄 Starting sync...')

    await cleanupLocalDuplicates(userId)

    const deletedRecords = await db.deletedRecords.toArray()
    if (deletedRecords.length > 0) {
      console.log(`🗑 Processing ${deletedRecords.length} deletions...`)
      for (const record of deletedRecords) {
        const { error } = await supabase.from(record.tableName).delete().eq('id', record.supabaseId)

        if (!error) {
          await db.deletedRecords.delete(record.id!)
        } else {
          console.error(`❌ Error deleting ${record.tableName} ${record.supabaseId}:`, error)
        }
      }
    }

    const { data: remoteDays, error: daysError } = await supabase
      .from('workout_days')
      .select('*')
      .eq('user_id', userId)

    if (daysError) throw daysError

    if (remoteDays) {
      for (const day of remoteDays) {
        const local = await db.workoutDays.where('supabaseId').equals(day.id).first()
        if (local) {
          await db.workoutDays.update(local.id!, {
            name: day.name,
            userId: userId,
          })
        } else {
          const duplicate = await db.workoutDays.where('name').equals(day.name).first()
          if (duplicate && !duplicate.supabaseId) {
            await db.workoutDays.update(duplicate.id!, {
              supabaseId: day.id,
              userId: userId,
            })
          } else {
            await db.workoutDays.add({
              name: day.name,
              createdAt: new Date(day.created_at),
              userId: userId,
              supabaseId: day.id,
            })
          }
        }
      }
    }

    const daysMap = new Map<number, number>()
    const allLocalDays = await db.workoutDays.toArray()
    allLocalDays.forEach((d) => {
      if (d.supabaseId) daysMap.set(d.supabaseId, d.id!)
    })

    const { data: remoteExercises } = await supabase.from('exercises').select('*')

    if (remoteExercises) {
      for (const ex of remoteExercises) {
        const localDayId = daysMap.get(ex.workout_day_id)
        if (!localDayId) continue

        const localEx = await db.exercises.where('supabaseId').equals(ex.id).first()
        if (!localEx) {
          // Проверка дубликатов по имени и workoutDayId
          const duplicate = await db.exercises
            .where('workoutDayId')
            .equals(localDayId)
            .filter((e) => e.name === ex.name)
            .first()

          if (duplicate && !duplicate.supabaseId) {
            await db.exercises.update(duplicate.id!, { supabaseId: ex.id })
          } else {
            await db.exercises.add({
              workoutDayId: localDayId,
              name: ex.name,
              order: ex.order,
              createdAt: new Date(ex.created_at),
              supabaseId: ex.id,
            })
          }
        }
      }
    }

    // Sets
    const exMap = new Map<number, number>()
    const allLocalEx = await db.exercises.toArray()
    allLocalEx.forEach((e) => {
      if (e.supabaseId) exMap.set(e.supabaseId, e.id!)
    })

    const { data: remoteSets } = await supabase.from('sets').select('*')
    if (remoteSets) {
      for (const s of remoteSets) {
        const localExId = exMap.get(s.exercise_id)
        if (!localExId) continue

        const localSet = await db.sets.where('supabaseId').equals(s.id).first()
        if (!localSet) {
          await db.sets.add({
            exerciseId: localExId,
            weight: s.weight,
            reps: s.reps,
            setNumber: s.set_number,
            completedAt: s.completed_at ? new Date(s.completed_at) : undefined,
            isCompleted: s.is_completed,
            supabaseId: s.id,
          })
        }
      }
    }

    const unsyncedDays = await db.workoutDays.filter((d) => !d.supabaseId).toArray()
    for (const day of unsyncedDays) {
      const { data } = await supabase
        .from('workout_days')
        .insert({
          user_id: userId,
          name: day.name,
          created_at: day.createdAt,
        })
        .select()
        .single()

      if (data) {
        await db.workoutDays.update(day.id!, { supabaseId: data.id })
      }
    }

    const unsyncedExercises = await db.exercises.filter((e) => !e.supabaseId).toArray()
    for (const ex of unsyncedExercises) {
      const parentDay = await db.workoutDays.get(ex.workoutDayId)
      if (parentDay && parentDay.supabaseId) {
        const { data } = await supabase
          .from('exercises')
          .insert({
            workout_day_id: parentDay.supabaseId,
            name: ex.name,
            order: ex.order,
            created_at: ex.createdAt,
          })
          .select()
          .single()

        if (data) {
          await db.exercises.update(ex.id!, { supabaseId: data.id })
        }
      }
    }

    const unsyncedSets = await db.sets.filter((s) => !s.supabaseId).toArray()
    for (const s of unsyncedSets) {
      const parentEx = await db.exercises.get(s.exerciseId)
      if (parentEx && parentEx.supabaseId) {
        const { data } = await supabase
          .from('sets')
          .insert({
            exercise_id: parentEx.supabaseId,
            weight: s.weight,
            reps: s.reps,
            set_number: s.setNumber,
            completed_at: s.completedAt,
            is_completed: s.isCompleted,
          })
          .select()
          .single()

        if (data) {
          await db.sets.update(s.id!, { supabaseId: data.id })
        }
      }
    }

    const existingSets = await db.sets.filter((s) => !!s.supabaseId).toArray()
    if (existingSets.length > 0) {
      const updates = []
      for (const s of existingSets) {
        const parentEx = await db.exercises.get(s.exerciseId)
        if (parentEx && parentEx.supabaseId) {
          updates.push({
            id: s.supabaseId,
            exercise_id: parentEx.supabaseId,
            weight: s.weight,
            reps: s.reps,
            set_number: s.setNumber,
            completed_at: s.completedAt,
            is_completed: s.isCompleted,
          })
        }
      }

      if (updates.length > 0) {
        const { error } = await supabase.from('sets').upsert(updates)
        if (error) console.error('❌ Error updating sets:', error)
      }
    }

    const { data: remoteLogs } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', userId)
    if (remoteLogs) {
      for (const l of remoteLogs) {
        const localExId = exMap.get(l.exercise_id)
        if (!localExId) continue

        const localLog = await db.workoutLogs.where('supabaseId').equals(l.id).first()
        if (!localLog) {
          await db.workoutLogs.add({
            exerciseId: localExId,
            weight: l.weight,
            reps: l.reps,
            setNumber: l.set_number,
            date: new Date(l.date),
            userId: userId,
            supabaseId: l.id,
          })
        }
      }
    }

    const unsyncedLogs = await db.workoutLogs.filter((l) => !l.supabaseId).toArray()
    for (const l of unsyncedLogs) {
      const parentEx = await db.exercises.get(l.exerciseId)
      if (parentEx && parentEx.supabaseId) {
        const { data } = await supabase
          .from('workout_logs')
          .insert({
            exercise_id: parentEx.supabaseId,
            weight: l.weight,
            reps: l.reps,
            set_number: l.setNumber,
            date: l.date,
            user_id: userId,
          })
          .select()
          .single()

        if (data) {
          await db.workoutLogs.update(l.id!, { supabaseId: data.id })
        }
      }
    }

    console.log('✅ Sync completed')
  } catch (error) {
    console.error('❌ Error syncing:', error)
  } finally {
    isSyncRunning = false
  }
}
