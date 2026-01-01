import { Card, CardContent, Typography } from '@mui/material'
import { Button } from '../atoms/Button'
import { useTranslation } from 'react-i18next'

interface ActiveTimerDisplayProps {
  remainingTime: number
  onStop: () => void
}

export const ActiveTimerDisplay = ({ remainingTime, onStop }: ActiveTimerDisplayProps) => {
  const { t } = useTranslation()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card
      sx={{
        m: 2,
        bgcolor: 'primary.main',
        color: 'white',
        borderRadius: '12px',
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          {formatTime(remainingTime)}
        </Typography>
        <Button onClick={onStop} sx={{ color: 'white' }}>
          {t('workout.stop')}
        </Button>
      </CardContent>
    </Card>
  )
}
