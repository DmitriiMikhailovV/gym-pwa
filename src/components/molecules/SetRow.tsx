import { useState } from 'react'
import { TableRow, TableCell, Box, IconButton } from '@mui/material'
import { Input } from '../atoms/Input'
import { Delete } from '@mui/icons-material'
import { db } from '../../services/db'

interface SetRowProps {
  set: { id?: number; weight: number; reps: number; setNumber: number }
  onDelete: () => void
}

export const SetRow = ({ set, onDelete }: SetRowProps) => {
  const [editingWeight, setEditingWeight] = useState(false)
  const [editingReps, setEditingReps] = useState(false)
  const [weightValue, setWeightValue] = useState(set.weight.toString())
  const [repsValue, setRepsValue] = useState(set.reps.toString())

  const handleSaveWeight = async () => {
    const newWeight = parseFloat(weightValue)
    if (newWeight && newWeight > 0 && newWeight !== set.weight) {
      await db.sets.update(set.id!, { weight: newWeight })
    }
    setEditingWeight(false)
  }

  const handleSaveReps = async () => {
    const newReps = parseInt(repsValue)
    if (newReps && newReps > 0 && newReps !== set.reps) {
      await db.sets.update(set.id!, { reps: newReps })
    }
    setEditingReps(false)
  }

  return (
    <TableRow>
      <TableCell>{set.setNumber}</TableCell>
      <TableCell onClick={() => setEditingWeight(true)} sx={{ cursor: 'pointer' }}>
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
              '& .MuiFilledInput-root': {
                fontSize: '14px',
              },
              '& input': { padding: '4px 8px' },
            }}
          />
        ) : (
          <Box component="span" sx={{ '&:hover': { color: 'primary.main' } }}>
            {set.weight}
          </Box>
        )}
      </TableCell>
      <TableCell onClick={() => setEditingReps(true)} sx={{ cursor: 'pointer' }}>
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
              width: 60,
              '& .MuiFilledInput-root': {
                fontSize: '14px',
              },
              '& input': { padding: '4px 8px' },
            }}
          />
        ) : (
          <Box component="span" sx={{ '&:hover': { color: 'primary.main' } }}>
            {set.reps}
          </Box>
        )}
      </TableCell>
      <TableCell align="right">
        <IconButton size="small" onClick={onDelete} color="error">
          <Delete fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
