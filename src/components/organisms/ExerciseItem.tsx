import { useState } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { Edit, Delete, Add } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Exercise } from '../../services/db'
import { SetRow } from '../molecules/SetRow'

interface ExerciseItemProps {
  exercise: Exercise
  onDelete: () => void
}

export const ExerciseItem = ({ exercise, onDelete }: ExerciseItemProps) => {
  const { t } = useTranslation()
  const [addingSet, setAddingSet] = useState(false)
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [exerciseName, setExerciseName] = useState(exercise.name)

  const sets =
    useLiveQuery(
      () => db.sets.where('exerciseId').equals(exercise.id!).sortBy('setNumber'),
      [exercise.id]
    ) || []

  const handleAddSet = async () => {
    const weightNum = parseFloat(weight)
    const repsNum = parseInt(reps)

    if (!weightNum || !repsNum || weightNum <= 0 || repsNum <= 0) return

    const maxSetNumber = sets.length > 0 ? Math.max(...sets.map((s) => s.setNumber)) : 0

    await db.sets.add({
      exerciseId: exercise.id!,
      weight: weightNum,
      reps: repsNum,
      setNumber: maxSetNumber + 1,
      completedAt: new Date(),
      isCompleted: false,
    })

    setWeight('')
    setReps('')
    setAddingSet(false)
  }

  const handleDeleteSet = async (setId: number) => {
    const set = await db.sets.get(setId)
    if (set && set.supabaseId) {
      await db.deletedRecords.add({
        tableName: 'sets',
        supabaseId: set.supabaseId,
      })
    }
    await db.sets.delete(setId)
  }

  const handleSaveExerciseName = async () => {
    if (exerciseName.trim() && exerciseName !== exercise.name) {
      await db.exercises.update(exercise.id!, { name: exerciseName.trim() })
    }
    setEditingName(false)
  }

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        bgcolor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '10px',
        border: '0.5px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        {editingName ? (
          <Input
            autoFocus
            size="small"
            fullWidth
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            onBlur={handleSaveExerciseName}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveExerciseName()}
            sx={{
              mr: 1,
              '& .MuiFilledInput-root': {
                fontSize: '15px',
              },
            }}
          />
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
            {exercise.name}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => setEditingName(!editingName)} color="primary">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onDelete} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {sets.length > 0 && (
        <Table size="small" sx={{ mb: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>{t('workout.set')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                {t('workout.weight')} ({t('workout.kg')})
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('workout.reps')}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sets.map((set) => (
              <SetRow key={set.id} set={set} onDelete={() => handleDeleteSet(set.id!)} />
            ))}
          </TableBody>
        </Table>
      )}

      {addingSet ? (
        <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
          <Input
            size="small"
            type="number"
            placeholder={t('workout.weight')}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            sx={{
              width: 100,
              '& .MuiFilledInput-root': {
                height: 36,
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiFilledInput-input': {
                textAlign: 'center',
                padding: 0,
              },
            }}
          />
          <Input
            size="small"
            type="number"
            placeholder={t('workout.reps')}
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSet()}
            sx={{
              width: 100,
              '& .MuiFilledInput-root': {
                height: 36,
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiFilledInput-input': {
                textAlign: 'center',
                padding: 0,
              },
            }}
          />
          <Button onClick={handleAddSet} variant="contained" size="small" sx={{ height: 36 }}>
            {t('workout.add')}
          </Button>
          <Button
            onClick={() => {
              setAddingSet(false)
              setWeight('')
              setReps('')
            }}
            size="small"
            sx={{ height: 36, minWidth: 36 }}
          >
            ✕
          </Button>
        </Box>
      ) : (
        <Button
          startIcon={<Add />}
          onClick={() => setAddingSet(true)}
          sx={{ mt: 1 }}
          variant="text"
        >
          {t('workout.addSet')}
        </Button>
      )}
    </Box>
  )
}
