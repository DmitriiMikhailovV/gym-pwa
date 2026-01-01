import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../services/db'
import { useTranslation } from 'react-i18next'
import { StatsSummaryCards, StatsProgressList, StatsCalendar, DeleteDayDialog } from '../components'

export const StatisticsPage = () => {
  const { t } = useTranslation()
  const [selectedMonth] = useState(new Date().getMonth())
  const [selectedYear] = useState(new Date().getFullYear())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDayToDelete, setSelectedDayToDelete] = useState<number | null>(null)

  const exercises = useLiveQuery(() => db.exercises.toArray()) || []
  const logs = useLiveQuery(() => db.workoutLogs.toArray()) || []

  const totalVolume = logs.reduce((sum, log) => sum + log.weight * log.reps, 0)
  const totalSets = logs.length
  const totalWorkouts = new Set(
    logs.map((l) => {
      const d = new Date(l.date)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
  ).size

  const getExerciseStats = () => {
    const stats: Record<
      string,
      {
        name: string
        totalVolume: number
        maxWeight: number
        history: { date: string; volume: number; weight: number }[]
        lastImprovement?: number
      }
    > = {}

    exercises.forEach((ex) => {
      const name = ex.name.trim()
      const exLogs = logs.filter((l) => l.exerciseId === ex.id)

      if (exLogs.length === 0) return

      if (!stats[name]) {
        stats[name] = {
          name,
          totalVolume: 0,
          maxWeight: 0,
          history: [],
        }
      }

      const setsByDate: Record<string, typeof exLogs> = {}
      exLogs.forEach((l) => {
        const date = new Date(l.date).toISOString().split('T')[0]
        if (!setsByDate[date]) setsByDate[date] = []
        setsByDate[date].push(l)
      })

      Object.entries(setsByDate).forEach(([date, daySets]) => {
        const dayVolume = daySets.reduce((sum, s) => sum + s.weight * s.reps, 0)
        const dayMaxWeight = Math.max(...daySets.map((s) => s.weight))

        const existingIdx = stats[name].history.findIndex((h) => h.date === date)
        if (existingIdx >= 0) {
          stats[name].history[existingIdx].volume += dayVolume
          stats[name].history[existingIdx].weight = Math.max(
            stats[name].history[existingIdx].weight,
            dayMaxWeight
          )
        } else {
          stats[name].history.push({
            date,
            volume: dayVolume,
            weight: dayMaxWeight,
          })
        }

        stats[name].totalVolume += dayVolume
        stats[name].maxWeight = Math.max(stats[name].maxWeight, dayMaxWeight)
      })
    })

    Object.values(stats).forEach((stat) => {
      stat.history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      if (stat.history.length >= 2) {
        const last = stat.history[stat.history.length - 1]
        const prev = stat.history[stat.history.length - 2]
        if (prev.volume > 0) {
          stat.lastImprovement = ((last.volume - prev.volume) / prev.volume) * 100
        }
      }
    })

    return Object.values(stats)
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, 5)
  }

  const topExercises = getExerciseStats()

  const completedDates = new Set(
    logs.map((log) => {
      const date = new Date(log.date)
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    })
  )

  const isDayCompleted = (day: number) => {
    const dateKey = `${selectedYear}-${selectedMonth}-${day}`
    return completedDates.has(dateKey)
  }

  const handleDayClick = (day: number) => {
    if (isDayCompleted(day)) {
      setSelectedDayToDelete(day)
      setDeleteDialogOpen(true)
    }
  }

  const handleDeleteCallback = async () => {
    if (selectedDayToDelete === null) return

    const targetDateKey = `${selectedYear}-${selectedMonth}-${selectedDayToDelete}`

    const logsToDelete = logs.filter((l) => {
      const date = new Date(l.date)
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      return key === targetDateKey
    })

    await db.transaction('rw', db.workoutLogs, async () => {
      for (const log of logsToDelete) {
        await db.workoutLogs.delete(log.id!)
      }
    })

    setDeleteDialogOpen(false)
    setSelectedDayToDelete(null)
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, mt: 1, fontWeight: 800 }}>
        {t('headers.statistics')}
      </Typography>

      <StatsSummaryCards
        totalVolume={totalVolume}
        totalSets={totalSets}
        totalWorkouts={totalWorkouts}
      />

      <StatsProgressList exercises={topExercises} />

      <StatsCalendar
        month={selectedMonth}
        year={selectedYear}
        completedDates={completedDates}
        onDayClick={handleDayClick}
      />

      <DeleteDayDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteCallback}
      />
    </Box>
  )
}
