import { Dialog, DialogContent, Typography, Box } from '@mui/material'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { useTranslation } from 'react-i18next'

interface NewSetDialogProps {
  open: boolean
  onClose: () => void
  weight: string
  reps: string
  onWeightChange: (value: string) => void
  onRepsChange: (value: string) => void
  onSubmit: () => void
}

export const NewSetDialog = ({
  open,
  onClose,
  weight,
  reps,
  onWeightChange,
  onRepsChange,
  onSubmit,
}: NewSetDialogProps) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          {t('workout.newSet')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Input
            fullWidth
            label={`${t('workout.weight')} (${t('workout.kg')})`}
            type="number"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
          />
          <Input
            fullWidth
            label={t('workout.reps')}
            type="number"
            value={reps}
            onChange={(e) => onRepsChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!weight || !reps}
          onClick={onSubmit}
        >
          {t('workout.addAndStart')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
