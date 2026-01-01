import { Dialog, DialogContent, Typography, Box } from '@mui/material'
import { Button } from '../atoms/Button'
import { useTranslation } from 'react-i18next'

interface RestTimerDialogProps {
  open: boolean
  onClose: () => void
  timerSeconds: number
  onTimerSecondsChange: (seconds: number) => void
  onStartTimer: () => void
}

export const RestTimerDialog = ({
  open,
  onClose,
  timerSeconds,
  onTimerSecondsChange,
  onStartTimer,
}: RestTimerDialogProps) => {
  const { t } = useTranslation()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          {t('workout.restTimer')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {[30, 60, 90, 120, 180].map((sec) => (
            <Button
              key={sec}
              variant={timerSeconds === sec ? 'contained' : 'outlined'}
              onClick={() => onTimerSecondsChange(sec)}
              sx={{
                flex: '1 1 auto',
              }}
            >
              {sec < 60 ? `${sec}s` : `${sec / 60}m`}
            </Button>
          ))}
        </Box>
        <Button fullWidth variant="contained" size="large" onClick={onStartTimer}>
          {t('workout.startTimer')} {formatTime(timerSeconds)}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
