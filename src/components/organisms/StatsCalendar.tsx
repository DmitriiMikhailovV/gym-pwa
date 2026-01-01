import { Box, Typography, Card } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface StatsCalendarProps {
  month: number
  year: number
  completedDates: Set<string>
  onDayClick: (day: number) => void
}

export const StatsCalendar = ({ month, year, completedDates, onDayClick }: StatsCalendarProps) => {
  const { i18n } = useTranslation()

  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (m: number, y: number) => {
    return new Date(y, m, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(month, year)
  const firstDay = getFirstDayOfMonth(month, year)

  const monthName = new Date(year, month).toLocaleString(i18n.language, { month: 'long' })
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1)

  const isDayCompleted = (day: number) => {
    // Note: The key format must match what is generated in the parent component
    const dateKey = `${year}-${month}-${day}`
    return completedDates.has(dateKey)
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {capitalizedMonthName} {year}
      </Typography>
      <Card sx={{ bgcolor: 'background.paper', borderRadius: '12px', p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <Typography
              key={i}
              variant="caption"
              sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 11, fontWeight: 600 }}
            >
              {day}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, index) => (
            <Box key={`empty-${index}`} sx={{ aspectRatio: '1' }} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const isCompleted = isDayCompleted(day)
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear()

            return (
              <Box
                key={day}
                onClick={() => onDayClick(day)}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  fontSize: 14,
                  fontWeight: isToday ? 700 : 500,
                  bgcolor: isCompleted ? 'secondary.main' : 'transparent',
                  color: isCompleted ? 'black' : isToday ? 'primary.main' : 'text.primary',
                  border: isToday && !isCompleted ? '1px solid' : 'none',
                  borderColor: 'primary.main',
                  cursor: isCompleted ? 'pointer' : 'default',
                  '&:hover': isCompleted
                    ? {
                        opacity: 0.8,
                      }
                    : {},
                }}
              >
                {day}
              </Box>
            )
          })}
        </Box>
      </Card>
    </Box>
  )
}
