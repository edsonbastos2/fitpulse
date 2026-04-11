// ==========================================
// Database Types (Supabase)
// ==========================================

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  slug: 'superadmin' | 'user' | 'personal_trainer'
  name: string
  description: string
  created_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  granted_at: string
  granted_by: string | null
}

export interface RolePermission {
  id: string
  role_id: string
  permission: string
}

export interface TrainerStudent {
  id: string
  trainer_id: string
  student_id: string
  created_at: string
  created_by: string | null
}

export interface UserProfile {
  id: string
  user_id: string
  level: 'beginner' | 'intermediate' | 'advanced'
  goals: ('weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general')[]
  restrictions: string[]
  experience_years: number
  workout_frequency: number // days per week
  preferred_duration: number // minutes
  equipment_available: string[]
  injuries?: string[]
  body_stats?: {
    weight?: number
    height?: number
    age?: number
    gender?: 'male' | 'female' | 'other'
  }
  roles?: Role[]
  active_role?: 'superadmin' | 'user' | 'personal_trainer'
  created_at: string
  updated_at: string
}

export interface MuscleGroup {
  id: string
  name: string
  name_pt: string
  category: 'primary' | 'secondary'
  image_url?: string
}

export interface Equipment {
  id: string
  name: string
  name_pt: string
  category: 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'kettlebell' | 'bands' | 'other'
}

export interface Exercise {
  id: string
  name: string
  name_pt: string
  description: string
  description_pt: string
  instructions: string[]
  instructions_pt: string[]
  video_url?: string
  image_url?: string
  difficulty: 'easy' | 'medium' | 'hard'
  primary_muscles: string[] // muscle group IDs
  secondary_muscles: string[] // muscle group IDs
  equipment_id?: string
  is_compound: boolean
  is_cardio: boolean
  calories_per_minute?: number
  created_at: string
}

export interface Workout {
  id: string
  user_id: string
  name: string
  description?: string
  type: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'mixed'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration: number // minutes
  is_template: boolean
  is_recommended: boolean
  created_at: string
  updated_at: string
}

export interface WorkoutExercise {
  id: string
  workout_id: string
  exercise_id: string
  order: number
  sets: number
  reps?: number
  duration?: number // seconds
  rest_period: number // seconds
  notes?: string
  rpe?: number // Rate of Perceived Exertion 1-10
}

export interface WorkoutSession {
  id: string
  user_id: string
  workout_id: string
  started_at: string
  completed_at?: string
  status: 'planned' | 'in_progress' | 'completed' | 'skipped'
  notes?: string
  rating?: number // 1-5
}

export interface WorkoutLog {
  id: string
  session_id: string
  workout_exercise_id: string
  set_number: number
  weight?: number
  reps?: number
  duration?: number
  rpe?: number
  completed: boolean
  notes?: string
  logged_at: string
}

export interface ScheduledWorkout {
  id: string
  user_id: string
  workout_id: string
  scheduled_date: string
  scheduled_time?: string
  status: 'scheduled' | 'completed' | 'skipped'
  reminder_enabled: boolean
  created_at: string
}

// ==========================================
// UI Types
// ==========================================

/** Alias de NavigationItem para consistência com a Tech Spec */
export type NavItem = NavigationItem

export interface NavigationItem {
  label: string
  icon: string
  to: string
  badge?: number | string
}

export interface StatCardData {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: string
  color?: 'primary' | 'secondary' | 'accent'
}

export interface TrendIndicator {
  direction: 'up' | 'down' | 'neutral'
  value?: number
  label?: string
}

export interface ChartDataset {
  label: string
  data: number[]
  borderColor?: string
  backgroundColor?: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
  group?: string
}

// ==========================================
// Recommendation Types
// ==========================================

export interface Recommendation {
  type: 'workout' | 'exercise' | 'tip' | 'challenge'
  priority: number
  reason: string
  data: Workout | Exercise | string
  expires_at?: string
}

export interface UserProgress {
  weekly_workouts: number
  monthly_workouts: number
  current_streak: number
  longest_streak: number
  total_workouts: number
  total_volume: number // kg lifted
  favorite_muscle_groups: string[]
  weak_muscle_groups: string[]
}

// ==========================================
// Form Types
// ==========================================

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ProfileForm {
  name: string
  level: UserProfile['level']
  goals: UserProfile['goals']
  experience_years: number
  workout_frequency: number
  preferred_duration: number
  equipment_available: string[]
  injuries: string[]
  body_stats: UserProfile['body_stats']
}

export interface WorkoutForm {
  name: string
  description: string
  type: Workout['type']
  exercises: {
    exercise_id: string
    sets: number
    reps?: number
    duration?: number
    rest_period: number
    notes?: string
  }[]
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// ==========================================
// Nuxt Route Meta Extension
// ==========================================

declare module '#app' {
  interface PageMeta {
    requiredRoles?: ('superadmin' | 'user' | 'personal_trainer')[]
    requiredPermissions?: string[]
  }
}

// ==========================================
// H3 Event Context Extension
// ==========================================

declare module 'h3' {
  interface H3EventContext {
    userRoles?: string[]
  }
}
