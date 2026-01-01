import { useState, useEffect, useRef, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useTranslation } from 'react-i18next'
import { db } from '../services/db'
import { timerAudio } from '../utils/timerAudio'
import { syncWithSupabase } from '../services/dataSync'
import {
  requestNotificationPermission,
  checkServiceWorkerStatus,
  showLocalNotification,
} from '../utils/notifications'
import {
  subscribeToPushNotifications,
  scheduleServerNotification,
} from '../services/pushNotifications'

interface UseActiveWorkoutProps {
  workoutDayId: number
  userId: string
  onClose: () => void
}

export const useActiveWorkout = ({ workoutDayId, userId, onClose }: UseActiveWorkoutProps) => {
  const { t } = useTranslation()
  const [completedToday, setCompletedToday] = useState<Set<number>>(new Set())
  const [timerDialog, setTimerDialog] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(90)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [addSetDialog, setAddSetDialog] = useState<number | null>(null)
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [isFinishing, setIsFinishing] = useState(false)

  const workerRef = useRef<Worker | null>(null)

  const exercises =
    useLiveQuery(
      () => db.exercises.where('workoutDayId').equals(workoutDayId).sortBy('order'),
      [workoutDayId]
    ) || []

  const allSets = useLiveQuery(() => db.sets.toArray()) || []

  const handleTimerFinished = useCallback(
    async (shouldNotify = true) => {
      setRemainingTime(0)
      setIsTimerRunning(false)
      localStorage.removeItem('activeTimerEnd')

      if (shouldNotify) {
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 200])
        }

        if (document.visibilityState === 'visible') {
          await showLocalNotification(t('workout.timerFinished'), {
            title: t('workout.timerFinished'),
            body: t('workout.nextSet'),
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            vibrate: [200, 100, 200, 100, 200],
            tag: 'rest-timer-finished',
          })
        }

        timerAudio.playBeep()
        timerAudio.stopSilent()
      }
    },
    [t]
  )

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/timerWorker.ts', import.meta.url), {
      type: 'module',
    })

    workerRef.current.onmessage = (e: MessageEvent) => {
      const { type, remaining } = e.data

      if (type === 'FINISHED') {
        handleTimerFinished(true)
      } else if (type === 'TICK') {
        setRemainingTime(remaining)
      }
    }

    const saved = localStorage.getItem('activeTimerEnd')
    if (saved) {
      const endTime = parseInt(saved)
      const now = Date.now()
      if (now < endTime) {
        setIsTimerRunning(true)
        workerRef.current.postMessage({ type: 'START', payload: { endTime } })
        timerAudio.startSilent()
      } else {
        handleTimerFinished(false)
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [handleTimerFinished])

  useEffect(() => {
    const init = async () => {
      await requestNotificationPermission()
      await checkServiceWorkerStatus()
      await subscribeToPushNotifications()
    }
    init()
  }, [])

  const startTimer = (seconds: number) => {
    const endTime = Date.now() + seconds * 1000
    localStorage.setItem('activeTimerEnd', endTime.toString())

    setRemainingTime(seconds)
    setIsTimerRunning(true)
    setTimerDialog(false)

    if ('vibrate' in navigator) {
      navigator.vibrate(100)
    }

    workerRef.current?.postMessage({ type: 'START', payload: { endTime } })
    timerAudio.startSilent()

    scheduleServerNotification(seconds, t('workout.timerFinished'), t('workout.nextSet')).catch(
      console.error
    )
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    localStorage.removeItem('activeTimerEnd')
    setRemainingTime(0)

    workerRef.current?.postMessage({ type: 'STOP' })
    timerAudio.stopSilent()
  }

  const toggleExerciseComplete = async (exerciseId: number) => {
    const exerciseSets = allSets.filter((s) => s.exerciseId === exerciseId)

    if (exerciseSets.length > 0) {
      const allCompleted = exerciseSets.every((s) => s.isCompleted)
      const newStatus = !allCompleted

      await db.transaction('rw', db.sets, async () => {
        for (const set of exerciseSets) {
          await db.sets.update(set.id!, { isCompleted: newStatus })
        }
      })
      syncWithSupabase(userId)
    } else {
      const newCompleted = new Set(completedToday)
      if (newCompleted.has(exerciseId)) {
        newCompleted.delete(exerciseId)
      } else {
        newCompleted.add(exerciseId)
      }
      setCompletedToday(newCompleted)
    }
  }

  const isExerciseDone = (exerciseId: number) => {
    const sets = allSets.filter((s) => s.exerciseId === exerciseId)
    if (sets.length > 0) {
      return sets.every((s) => s.isCompleted)
    }
    return completedToday.has(exerciseId)
  }

  const handleAddSet = async () => {
    if (!addSetDialog) return
    const exerciseId = addSetDialog

    const weightNum = parseFloat(weight)
    const repsNum = parseInt(reps)

    if (!weightNum || !repsNum || weightNum <= 0 || repsNum <= 0) return

    const exerciseSets = allSets.filter((s) => s.exerciseId === exerciseId)
    const maxSetNumber =
      exerciseSets.length > 0 ? Math.max(...exerciseSets.map((s) => s.setNumber)) : 0

    await db.sets.add({
      exerciseId,
      weight: weightNum,
      reps: repsNum,
      setNumber: maxSetNumber + 1,
      completedAt: new Date(),
      isCompleted: true,
    })

    setWeight('')
    setReps('')
    setAddSetDialog(null)

    syncWithSupabase(userId)
    startTimer(timerSeconds)
  }

  const handleFinishWorkout = async () => {
    if (isFinishing) return
    setIsFinishing(true)
    try {
      const now = new Date()
      await db.transaction('rw', db.sets, db.workoutLogs, async () => {
        for (const ex of exercises) {
          const sets = allSets.filter((s) => s.exerciseId === ex.id && s.isCompleted)
          for (const s of sets) {
            await db.workoutLogs.add({
              exerciseId: s.exerciseId,
              weight: s.weight,
              reps: s.reps,
              setNumber: s.setNumber,
              date: now,
              userId: userId,
            })

            await db.sets.update(s.id!, { isCompleted: false })
          }
        }
      })

      await syncWithSupabase(userId)
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setIsFinishing(false)
    }
  }

  const getExerciseSets = (exerciseId: number) => {
    return allSets
      .filter((s) => s.exerciseId === exerciseId)
      .sort((a, b) => a.setNumber - b.setNumber)
  }

  return {
    exercises,
    completedToday,
    timerDialog,
    setTimerDialog,
    timerSeconds,
    setTimerSeconds,
    isTimerRunning,
    remainingTime,
    startTimer,
    stopTimer,
    addSetDialog,
    setAddSetDialog,
    weight,
    setWeight,
    reps,
    setReps,
    handleAddSet,
    toggleExerciseComplete,
    isExerciseDone,
    getExerciseSets,
    handleFinishWorkout,
    isFinishing,
    syncData: () => syncWithSupabase(userId),
  }
}
