import { Box } from '@mui/material'
import { Button } from '../atoms/Button'
import { useTranslation } from 'react-i18next'

interface WorkoutControlBarProps {
  onFinish: () => void
  isFinishing: boolean
}

export const WorkoutControlBar = ({ onFinish, isFinishing }: WorkoutControlBarProps) => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        pb: 'calc(16px + env(safe-area-inset-bottom))',
        zIndex: 10,
        bgcolor: 'background.paper',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Button
        fullWidth
        variant="contained"
        color="error"
        size="large"
        onClick={onFinish}
        disabled={isFinishing}
      >
        {isFinishing ? 'Saving...' : t('workout.finish')}
      </Button>
    </Box>
  )
}
