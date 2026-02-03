import { useState } from 'react'
import { Box, Typography, Card, CardContent, Chip, IconButton, Collapse } from '@mui/material'
import { ExpandMore, ExpandLess, ArrowUpward, ArrowDownward } from '@mui/icons-material'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'

export interface ExerciseStatItem {
  name: string
  totalVolume: number
  maxWeight: number
  history: { date: string; volume: number; weight: number }[]
  lastImprovement?: number
}

interface StatsProgressListProps {
  exercises: ExerciseStatItem[]
}

export const StatsProgressList = ({ exercises }: StatsProgressListProps) => {
  const { t } = useTranslation()
  const [expandedChart, setExpandedChart] = useState<string | null>(null)

  if (exercises.length === 0) return null

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {t('stats.progress')}
      </Typography>
      {exercises.map((item) => (
        <Card
          key={item.name}
          sx={{ mb: 1.5, bgcolor: 'background.paper', borderRadius: '12px', overflow: 'visible' }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box
              onClick={() => setExpandedChart(expandedChart === item.name ? null : item.name)}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  {item.lastImprovement !== undefined && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: item.lastImprovement >= 0 ? 'success.main' : 'error.main',
                        bgcolor:
                          item.lastImprovement >= 0
                            ? 'rgba(48, 209, 88, 0.1)'
                            : 'rgba(255, 69, 58, 0.1)',
                        px: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {item.lastImprovement >= 0 ? (
                        <ArrowUpward sx={{ fontSize: 12 }} />
                      ) : (
                        <ArrowDownward sx={{ fontSize: 12 }} />
                      )}
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {Math.abs(item.lastImprovement).toFixed(1)}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={`${t('stats.max')}: ${item.maxWeight} ${t('workout.kg')}`}
                    size="small"
                    color="primary"
                    sx={{ height: 22, fontSize: 12 }}
                  />
                  <Chip
                    label={`${(item.totalVolume / 1000).toFixed(1)}t ${t('stats.total')}`}
                    size="small"
                    sx={{ height: 22, fontSize: 12 }}
                  />
                </Box>
              </Box>
              <IconButton size="small">
                {expandedChart === item.name ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>

            <Collapse in={expandedChart === item.name}>
              <Box sx={{ mt: 2, height: 200, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={item.history}>
                    <defs>
                      <linearGradient id={`colorVolume-${item.name}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) => {
                        const [, m, d] = val.split('-')
                        return `${parseInt(d)}.${parseInt(m)}`
                      }}
                      stroke="rgba(255,255,255,0.3)"
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1C1C1E',
                        borderRadius: '10px',
                        border: 'none',
                      }}
                      labelStyle={{ color: '#8E8E93' }}
                      formatter={(value: number | undefined) => [
                        `${value ?? 0} ${t('workout.kg')}`,
                        'Volume',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="#0A84FF"
                      fillOpacity={1}
                      fill={`url(#colorVolume-${item.name})`}
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', mt: 1 }}
                >
                  {t('stats.dynamics')}
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
