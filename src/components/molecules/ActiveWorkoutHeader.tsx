import { AppBar, Toolbar, IconButton, Box, Typography, LinearProgress } from '@mui/material'
import { ArrowBack, Timer as TimerIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface ActiveWorkoutHeaderProps {
  workoutName: string
  progress: number
  completedCount: number
  totalExercises: number
  onClose: () => void
  onTimerClick: () => void
}

export const ActiveWorkoutHeader = ({
  workoutName,
  progress,
  completedCount,
  totalExercises,
  onClose,
  onTimerClick,
}: ActiveWorkoutHeaderProps) => {
  const { t } = useTranslation()

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ top: 0 }}>
      <Toolbar>
        <IconButton edge="start" onClick={onClose}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flex: 1, ml: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {workoutName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('workout.completedOf', { completed: completedCount, total: totalExercises })}
          </Typography>
        </Box>
        <IconButton onClick={onTimerClick}>
          <TimerIcon />
        </IconButton>
      </Toolbar>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 3,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          '& .MuiLinearProgress-bar': {
            bgcolor: 'secondary.main',
          },
        }}
      />
    </AppBar>
  )
}
