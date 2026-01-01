import { Box, Card, CardContent, Chip, Typography, IconButton } from '@mui/material'
import { Button } from '../atoms/Button'
import { Check, Add } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { ActiveSetItem } from '../molecules/ActiveSetItem'

interface ActiveExerciseCardProps {
  exercise: { id?: number; name: string }
  index: number
  sets: any[]
  isCompleted: boolean
  onToggleComplete: (id: number) => void
  onAddSet: (id: number) => void
  onUpdate: () => void
}

export const ActiveExerciseCard = ({
  exercise,
  index,
  sets,
  isCompleted,
  onToggleComplete,
  onAddSet,
  onUpdate,
}: ActiveExerciseCardProps) => {
  const { t } = useTranslation()

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: '12px',
        opacity: isCompleted ? 0.7 : 1,
        bgcolor: isCompleted ? 'rgba(48, 209, 88, 0.1)' : 'background.paper',
        border: isCompleted
          ? '1px solid rgba(48, 209, 88, 0.3)'
          : '0.5px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Chip
                label={`#${index + 1}`}
                size="small"
                sx={{ height: 22, fontSize: 12, fontWeight: 700 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '17px' }}>
                {exercise.name}
              </Typography>
            </Box>
            <Chip
              label={t('workout.exercisesCount', { count: sets.length })}
              size="small"
              color={sets.length > 0 ? 'primary' : 'default'}
              sx={{
                mt: 0.5,
                height: 24,
                fontWeight: 600,
                opacity: sets.length > 0 ? 1 : 0.7,
              }}
            />
          </Box>
          <IconButton
            onClick={() => onToggleComplete(exercise.id!)}
            sx={{
              bgcolor: isCompleted ? 'secondary.main' : 'transparent',
              color: isCompleted ? 'black' : 'text.secondary',
              '&:hover': {
                bgcolor: isCompleted ? 'secondary.dark' : 'rgba(48, 209, 88, 0.1)',
              },
            }}
          >
            <Check />
          </IconButton>
        </Box>

        {sets.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {sets.map((set) => (
              <ActiveSetItem key={set.id} set={set} onUpdate={onUpdate} />
            ))}
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          startIcon={<Add />}
          onClick={() => onAddSet(exercise.id!)}
        >
          {t('workout.addSet')}
        </Button>
      </CardContent>
    </Card>
  )
}
