import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  AppBar,
  Toolbar,
  Fab,
  CircularProgress,
} from '@mui/material'
import { FitnessCenter, Timeline, Person, Add, Logout } from '@mui/icons-material'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './services/db'
import { supabase, isSupabaseConfigured } from './services/supabaseClient'
import type { Session } from '@supabase/supabase-js'
import { syncWithSupabase } from './services/dataSync'
import { AuthPage, StatisticsPage, ProfilePage, ActiveWorkoutPage } from './pages'
import { AddWorkoutDayDialog, WorkoutDayCard } from './components'

export const App = () => {
  const { t } = useTranslation()
  const [session, setSession] = useState<Session | null>(null)
  const [value, setValue] = useState(0)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [activeWorkoutId, setActiveWorkoutId] = useState<number | null>(null)
  const [activeWorkoutName, setActiveWorkoutName] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSession({ user: { id: 'offline-user' } } as Session)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const updateSW = async () => {
      if ('serviceWorker' in navigator) {
        const r = await navigator.serviceWorker.getRegistration()
        if (r) {
          try {
            await r.update()
          } catch (e) {
            console.log('SW update failed', e)
          }
        }
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateSW()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    updateSW()
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    const runSync = async () => {
      if (session?.user?.id && isSupabaseConfigured && session.user.id !== 'offline-user') {
        setIsSyncing(true)
        try {
          await syncWithSupabase(session.user.id)
        } finally {
          setIsSyncing(false)
        }
      }
    }

    runSync()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        runSync()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [session])

  const workoutDays = useLiveQuery(() => db.workoutDays.reverse().toArray()) || []

  const handleDeleteWorkoutDay = async (id: number) => {
    const exercises = await db.exercises.where('workoutDayId').equals(id).toArray()

    for (const exercise of exercises) {
      await db.sets.where('exerciseId').equals(exercise.id!).delete()
    }

    await db.exercises.where('workoutDayId').equals(id).delete()

    await db.workoutDays.delete(id)
  }

  if (!session) {
    return <AuthPage />
  }

  if (activeWorkoutId !== null) {
    return (
      <ActiveWorkoutPage
        workoutDayId={activeWorkoutId}
        workoutDayName={activeWorkoutName}
        onClose={() => {
          setActiveWorkoutId(null)
          setActiveWorkoutName('')
        }}
        userId={session.user.id}
      />
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ top: 0 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ width: 48, display: 'flex', justifyContent: 'center' }}>
            {isSyncing && <CircularProgress size={20} color="secondary" thickness={5} />}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            GymTracker
          </Typography>
          <IconButton
            color="error"
            onClick={() => supabase.auth.signOut()}
            sx={{
              '&:hover': { bgcolor: 'rgba(255, 69, 58, 0.1)' },
            }}
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          py: 2,
          pb: 'calc(96px + env(safe-area-inset-bottom))',
        }}
      >
        {value === 0 && (
          <>
            <Typography variant="h4" sx={{ mb: 3, mt: 1, fontWeight: 800 }}>
              {t('headers.myWorkouts')}
            </Typography>

            {workoutDays.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 3,
                }}
              >
                <FitnessCenter
                  sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t('workout.noDays')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('workout.pressPlus')}
                </Typography>
              </Box>
            ) : (
              workoutDays.map((day) => (
                <WorkoutDayCard
                  key={day.id}
                  workoutDayId={day.id!}
                  name={day.name}
                  onDelete={() => handleDeleteWorkoutDay(day.id!)}
                  onStartWorkout={() => {
                    setActiveWorkoutId(day.id!)
                    setActiveWorkoutName(day.name)
                  }}
                />
              ))
            )}
          </>
        )}

        {value === 1 && <StatisticsPage />}
        {value === 2 && <ProfilePage />}
      </Container>

      {value === 0 && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 'calc(100px + env(safe-area-inset-bottom))',
            right: 20,
            zIndex: 2,
          }}
        >
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              boxShadow: '0 4px 16px rgba(10, 132, 255, 0.3)',
              width: 56,
              height: 56,
            }}
            onClick={() => setAddDialogOpen(true)}
          >
            <Add />
          </Fab>
        </Box>
      )}

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          bgcolor: 'background.paper',
          pb: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue)
          }}
          sx={{
            height: 'auto',
            pt: 1.5,
            pb: 1,
            bgcolor: 'background.paper',
          }}
        >
          <BottomNavigationAction label={t('tabs.workouts')} icon={<FitnessCenter />} />
          <BottomNavigationAction label={t('tabs.statistics')} icon={<Timeline />} />
          <BottomNavigationAction label={t('tabs.profile')} icon={<Person />} />
        </BottomNavigation>
      </Box>

      <AddWorkoutDayDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
    </Box>
  )
}
