import { useState } from 'react'
import { Box, Typography, IconButton, Card, CardContent, Collapse, Chip } from '@mui/material'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { useTranslation } from 'react-i18next'
import { Add, Delete, ExpandMore, ExpandLess, FitnessCenter, Edit } from '@mui/icons-material'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../services/db'
import { ExerciseItem } from './ExerciseItem'

interface WorkoutDayCardProps {
  workoutDayId: number
  name: string
  onDelete: () => void
  onStartWorkout: () => void
}

export const WorkoutDayCard = ({
  workoutDayId,
  name,
  onDelete,
  onStartWorkout,
}: WorkoutDayCardProps) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const [newExerciseName, setNewExerciseName] = useState('')
  const [addingExercise, setAddingExercise] = useState(false)

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(name)

  const exercises =
    useLiveQuery(
      () => db.exercises.where('workoutDayId').equals(workoutDayId).sortBy('order'),
      [workoutDayId]
    ) || []

  const logs = useLiveQuery(() => db.workoutLogs.toArray()) || []

  const getLastWorkoutDate = () => {
    if (exercises.length === 0 || logs.length === 0) return null

    const exerciseIds = new Set(exercises.map((e) => e.id))
    const dayLogs = logs.filter((l) => exerciseIds.has(l.exerciseId))

    if (dayLogs.length === 0) return null

    const dates = dayLogs.map((l) => new Date(l.date).getTime())
    return new Date(Math.max(...dates))
  }

  const lastDate = getLastWorkoutDate()
  let lastWorkoutText = ''

  if (lastDate) {
    const diffTime = Math.abs(new Date().getTime() - lastDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    lastWorkoutText = `${lastDate.toLocaleDateString()} (${diffDays} ${t('time.daysAgo')})`
  }
  const handleSaveTitle = async () => {
    if (titleValue.trim() && titleValue !== name) {
      await db.workoutDays.update(workoutDayId, { name: titleValue.trim() })
    }
    setEditingTitle(false)
  }

  const handleAddExercise = async () => {
    if (!newExerciseName.trim()) return

    const maxOrder = exercises.length > 0 ? Math.max(...exercises.map((e) => e.order)) : 0

    await db.exercises.add({
      workoutDayId,
      name: newExerciseName.trim(),
      order: maxOrder + 1,
      createdAt: new Date(),
    })

    setNewExerciseName('')
    setAddingExercise(false)
  }

  const handleDeleteExercise = async (exerciseId: number) => {
    const exercise = await db.exercises.get(exerciseId)
    if (!exercise) return

    // Track sets deletion
    const sets = await db.sets.where('exerciseId').equals(exerciseId).toArray()
    for (const set of sets) {
      if (set.supabaseId) {
        await db.deletedRecords.add({
          tableName: 'sets',
          supabaseId: set.supabaseId,
        })
      }
    }
    await db.sets.where('exerciseId').equals(exerciseId).delete()

    // Track exercise deletion
    if (exercise.supabaseId) {
      await db.deletedRecords.add({
        tableName: 'exercises',
        supabaseId: exercise.supabaseId,
      })
    }
    await db.exercises.delete(exerciseId)
  }

  return (
    <Card sx={{ bgcolor: 'background.paper', borderRadius: '12px', mb: 2 }}>
      <CardContent sx={{ pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <FitnessCenter color="primary" />

            {editingTitle ? (
              <Input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle()}
                autoFocus
                size="small"
                sx={{
                  flex: 1,
                  mr: 1,
                  '& .MuiInputBase-input': {
                    fontSize: '17px',
                    fontWeight: 700,
                  },
                }}
              />
            ) : (
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '17px' }}>
                {name}
              </Typography>
            )}

            {!editingTitle && (
              <Chip
                label={t('workout.exercisesCount', { count: exercises.length })}
                size="small"
                sx={{ ml: 1, height: '22px', fontSize: '13px' }}
              />
            )}

            <IconButton onClick={() => setExpanded(!expanded)} size="small">
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              onClick={() => {
                setTitleValue(name)
                setEditingTitle(!editingTitle)
              }}
              size="small"
              color="primary"
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton onClick={onDelete} size="small" color="error">
              <Delete />
            </IconButton>
          </Box>
        </Box>

        {exercises.length > 0 && !expanded && (
          <>
            {lastWorkoutText && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 1, textAlign: 'start' }}
              >
                {lastWorkoutText}
              </Typography>
            )}
            <Button fullWidth variant="contained" onClick={onStartWorkout} sx={{ mt: 0 }}>
              {t('workout.start')}
            </Button>
          </>
        )}

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            {exercises.map((exercise) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                onDelete={() => handleDeleteExercise(exercise.id!)}
              />
            ))}

            {addingExercise ? (
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Input
                  autoFocus
                  size="small"
                  placeholder={t('workout.exerciseName')}
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddExercise()}
                />
                <Button onClick={handleAddExercise} variant="contained">
                  {t('workout.add')}
                </Button>
                <Button
                  onClick={() => {
                    setAddingExercise(false)
                    setNewExerciseName('')
                  }}
                >
                  {t('workout.cancel')}
                </Button>
              </Box>
            ) : (
              <Button
                startIcon={<Add />}
                onClick={() => setAddingExercise(true)}
                sx={{ mt: 2 }}
                fullWidth
                variant="outlined"
              >
                {t('workout.addExercise')}
              </Button>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
