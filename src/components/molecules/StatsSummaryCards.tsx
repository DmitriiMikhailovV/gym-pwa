import { Card, CardContent, Typography, Box } from '@mui/material'
import { TrendingUp, FitnessCenter, CalendarMonth } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface StatsSummaryCardsProps {
  totalVolume: number
  totalSets: number
  totalWorkouts: number
}

export const StatsSummaryCards = ({
  totalVolume,
  totalSets,
  totalWorkouts,
}: StatsSummaryCardsProps) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Box sx={{ flex: 1, display: 'flex' }}>
        <Card
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '12px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <CardContent
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TrendingUp color="primary" sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {(totalVolume / 1000).toFixed(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              {t('workout.tonsLifted')}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: 1, display: 'flex' }}>
        <Card
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '12px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <CardContent
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FitnessCenter color="secondary" sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {totalSets}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              {t('workout.totalSets')}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flex: 1, display: 'flex' }}>
        <Card
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '12px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <CardContent
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CalendarMonth color="error" sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {totalWorkouts}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              {t('workout.totalWorkouts')}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
