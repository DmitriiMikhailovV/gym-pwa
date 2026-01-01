import { useState } from 'react'
import { Box, Typography, Checkbox } from '@mui/material'
import { Input } from '../atoms/Input'
import { useTranslation } from 'react-i18next'
import { db } from '../../services/db'

interface ActiveSetItemProps {
  set: { id?: number; weight: number; reps: number; setNumber: number; isCompleted?: boolean }
  onUpdate: () => void
}

export const ActiveSetItem = ({ set, onUpdate }: ActiveSetItemProps) => {
  const { t } = useTranslation()
  const [editingWeight, setEditingWeight] = useState(false)
  const [editingReps, setEditingReps] = useState(false)
  const [weightValue, setWeightValue] = useState(set.weight.toString())
  const [repsValue, setRepsValue] = useState(set.reps.toString())

  const handleSaveWeight = async () => {
    const newWeight = parseFloat(weightValue)
    if (newWeight && newWeight > 0 && newWeight !== set.weight) {
      await db.sets.update(set.id!, { weight: newWeight })
      onUpdate()
    }
    setEditingWeight(false)
  }

  const handleSaveReps = async () => {
    const newReps = parseInt(repsValue)
    if (newReps && newReps > 0 && newReps !== set.reps) {
      await db.sets.update(set.id!, { reps: newReps })
      onUpdate()
    }
    setEditingReps(false)
  }

  const toggleCompleted = async () => {
    await db.sets.update(set.id!, { isCompleted: !set.isCompleted })
    onUpdate()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1,
        px: 1.5,
        mb: 1,
        bgcolor: set.isCompleted ? 'rgba(48, 209, 88, 0.1)' : 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        border: set.isCompleted ? '1px solid rgba(48, 209, 88, 0.2)' : '1px solid transparent',
        transition: 'all 0.2s ease',
        opacity: set.isCompleted ? 0.7 : 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={!!set.isCompleted}
          onChange={toggleCompleted}
          size="small"
          sx={{
            p: 0.5,
            mr: 1,
            color: 'text.secondary',
            '&.Mui-checked': {
              color: 'secondary.main',
            },
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textDecoration: set.isCompleted ? 'line-through' : 'none',
          }}
        >
          {t('workout.set')} {set.setNumber}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {editingWeight ? (
          <Input
            autoFocus
            size="small"
            type="number"
            value={weightValue}
            onChange={(e) => setWeightValue(e.target.value)}
            onBlur={handleSaveWeight}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveWeight()}
            sx={{
              width: 60,
              '& input': { textAlign: 'right', fontWeight: 600, padding: '4px 8px' },
            }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
              borderBottom: '1px dashed rgba(255,255,255,0.3)',
              textDecoration: set.isCompleted ? 'line-through' : 'none',
            }}
            onClick={() => setEditingWeight(true)}
          >
            {set.weight}
          </Typography>
        )}
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {t('workout.kg')} ×
        </Typography>

        {editingReps ? (
          <Input
            autoFocus
            size="small"
            type="number"
            value={repsValue}
            onChange={(e) => setRepsValue(e.target.value)}
            onBlur={handleSaveReps}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveReps()}
            sx={{
              width: 50,
              '& input': { textAlign: 'center', fontWeight: 600, padding: '4px 8px' },
            }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
              borderBottom: '1px dashed rgba(255,255,255,0.3)',
              textDecoration: set.isCompleted ? 'line-through' : 'none',
            }}
            onClick={() => setEditingReps(true)}
          >
            {set.reps}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
