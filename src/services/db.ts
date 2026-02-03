import Dexie, { Table } from 'dexie'

// Тренировочный день
export interface WorkoutDay {
  id?: number
  name: string
  createdAt: Date
  userId?: string
  supabaseId?: number
}

export interface Exercise {
  id?: number
  workoutDayId: number
  name: string
  order: number
  createdAt: Date
  supabaseId?: number
}

export interface ExerciseSet {
  id?: number
  exerciseId: number
  weight: number
  reps: number
  setNumber: number
  completedAt?: Date
  isCompleted?: boolean
  supabaseId?: number
}

export class GymTrackerDB extends Dexie {
  workoutDays!: Table<WorkoutDay>
  exercises!: Table<Exercise>
  sets!: Table<ExerciseSet>
  workoutLogs!: Table<WorkoutLog>
  deletedRecords!: Table<DeletedRecord>

  constructor() {
    super('GymTrackerDB')
    this.version(6).stores({
      workoutDays: '++id, name, userId, createdAt, supabaseId',
      exercises: '++id, workoutDayId, order, supabaseId',
      sets: '++id, exerciseId, completedAt, supabaseId',
      workoutLogs: '++id, exerciseId, date, supabaseId',
      deletedRecords: '++id, tableName, supabaseId',
    })
  }
}

export interface DeletedRecord {
  id?: number
  tableName: 'workout_days' | 'exercises' | 'sets' | 'workout_logs'
  supabaseId: number
}

export interface WorkoutLog {
  id?: number
  exerciseId: number
  weight: number
  reps: number
  setNumber: number
  date: Date
  userId: string
  supabaseId?: number
}

export const db = new GymTrackerDB()
