import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { useTranslation } from 'react-i18next'
import { db } from '../../services/db'

interface AddWorkoutDayDialogProps {
  open: boolean
  onClose: () => void
}

export const AddWorkoutDayDialog = ({ open, onClose }: AddWorkoutDayDialogProps) => {
  const { t } = useTranslation()
  const [name, setName] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) return

    await db.workoutDays.add({
      name: name.trim(),
      createdAt: new Date(),
    })

    setName('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{t('workout.workoutDayTitle')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Input
            autoFocus
            fullWidth
            label={t('workout.dayNameLabel')}
            placeholder={t('workout.dayNamePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ minWidth: 80 }}>
          {t('workout.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim()}
          sx={{ minWidth: 80 }}
        >
          {t('workout.create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
