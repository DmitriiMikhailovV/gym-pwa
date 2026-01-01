import { Box } from '@mui/material'
import {
  ActiveWorkoutHeader,
  ActiveExerciseCard,
  RestTimerDialog,
  NewSetDialog,
  ActiveTimerDisplay,
  WorkoutControlBar,
} from '../components'
import { useActiveWorkout } from '../hooks/useActiveWorkout'

interface ActiveWorkoutProps {
  workoutDayId: number
  workoutDayName: string
  onClose: () => void
  userId: string
}

export const ActiveWorkoutPage = ({
  workoutDayId,
  workoutDayName,
  onClose,
  userId,
}: ActiveWorkoutProps) => {
  const {
    exercises,
    timerDialog,
    setTimerDialog,
    timerSeconds,
    setTimerSeconds,
    isTimerRunning,
    remainingTime,
    startTimer,
    stopTimer,
    addSetDialog,
    setAddSetDialog,
    weight,
    setWeight,
    reps,
    setReps,
    handleAddSet,
    toggleExerciseComplete,
    isExerciseDone,
    getExerciseSets,
    handleFinishWorkout,
    isFinishing,
    syncData,
  } = useActiveWorkout({ workoutDayId, userId, onClose })

  const totalExercises = exercises.length
  const completedCount = exercises.filter((e) => isExerciseDone(e.id!)).length
  const progress = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <ActiveWorkoutHeader
        workoutName={workoutDayName}
        progress={progress}
        completedCount={completedCount}
        totalExercises={totalExercises}
        onClose={onClose}
        onTimerClick={() => setTimerDialog(true)}
      />

      {isTimerRunning && <ActiveTimerDisplay remainingTime={remainingTime} onStop={stopTimer} />}

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          pt: 2,
          pb: 'calc(88px + env(safe-area-inset-bottom))',
        }}
      >
        {exercises.map((exercise, index) => {
          const sets = getExerciseSets(exercise.id!)
          const isCompleted = isExerciseDone(exercise.id!)

          return (
            <ActiveExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index}
              sets={sets}
              isCompleted={isCompleted}
              onToggleComplete={toggleExerciseComplete}
              onAddSet={(id) => setAddSetDialog(id)}
              onUpdate={syncData}
            />
          )
        })}
      </Box>

      <WorkoutControlBar onFinish={handleFinishWorkout} isFinishing={isFinishing} />

      <RestTimerDialog
        open={timerDialog}
        onClose={() => setTimerDialog(false)}
        timerSeconds={timerSeconds}
        onTimerSecondsChange={setTimerSeconds}
        onStartTimer={() => startTimer(timerSeconds)}
      />

      <NewSetDialog
        open={addSetDialog !== null}
        onClose={() => {
          setAddSetDialog(null)
          setWeight('')
          setReps('')
        }}
        weight={weight}
        reps={reps}
        onWeightChange={setWeight}
        onRepsChange={setReps}
        onSubmit={handleAddSet}
      />
    </Box>
  )
}
