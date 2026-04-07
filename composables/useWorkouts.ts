import type { Workout, WorkoutExercise, WorkoutSession, WorkoutLog } from '~/types'

export const useWorkouts = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const workouts = useState<Workout[]>('workouts', () => [])
  const currentWorkout = useState<Workout | null>('current-workout', () => null)
  const workoutExercises = useState<WorkoutExercise[]>('workout-exercises', () => [])
  const sessions = useState<WorkoutSession[]>('sessions', () => [])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch user's workouts
  const fetchWorkouts = async (filters?: {
    type?: string
    difficulty?: string
    isTemplate?: boolean
  }) => {
    if (!user.value) return null

    isLoading.value = true
    error.value = null

    try {
      let query = supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }

      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty)
      }

      if (filters?.isTemplate !== undefined) {
        query = query.eq('is_template', filters.isTemplate)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      workouts.value = data as Workout[]
      return data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Fetch recommended workouts (public templates)
  const fetchRecommendedWorkouts = async (userLevel?: string) => {
    isLoading.value = true
    error.value = null

    try {
      let query = supabase
        .from('workouts')
        .select('*')
        .eq('is_recommended', true)
        .order('created_at', { ascending: false })
        .limit(10)

      if (userLevel) {
        query = query.eq('difficulty', userLevel)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      return data as Workout[]
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Fetch single workout with exercises
  const fetchWorkout = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single()

      if (workoutError) throw workoutError

      const { data: exercises, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select('*, exercises(*)')
        .eq('workout_id', id)
        .order('order_index')

      if (exercisesError) throw exercisesError

      currentWorkout.value = workout as Workout
      workoutExercises.value = exercises as WorkoutExercise[]

      return { workout, exercises }
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Create workout
  const createWorkout = async (workout: Partial<Workout>, exercises: Partial<WorkoutExercise>[]) => {
    if (!user.value) return { error: 'Not authenticated' }

    isLoading.value = true
    error.value = null

    try {
      // Create workout
      const { data: newWorkout, error: workoutError } = await supabase
        .from('workouts')
        .insert({ ...workout, user_id: user.value.id })
        .select()
        .single()

      if (workoutError) throw workoutError

      // Create workout exercises
      if (exercises.length > 0) {
        const exercisesToInsert = exercises.map((ex, index) => ({
          ...ex,
          workout_id: newWorkout.id,
          order_index: index,
        }))

        const { error: exercisesError } = await supabase
          .from('workout_exercises')
          .insert(exercisesToInsert)

        if (exercisesError) throw exercisesError
      }

      return { data: newWorkout, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  // Update workout
  const updateWorkout = async (id: string, updates: Partial<Workout>) => {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('workouts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  // Delete workout
  const deleteWorkout = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      workouts.value = workouts.value.filter((w) => w.id !== id)

      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  // Start workout session
  const startSession = async (workoutId: string) => {
    if (!user.value) return { error: 'Not authenticated' }

    try {
      const { data, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.value.id,
          workout_id: workoutId,
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (sessionError) throw sessionError

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    }
  }

  // Complete workout session
  const completeSession = async (sessionId: string, rating?: number) => {
    try {
      const { data, error: completeError } = await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          rating,
        })
        .eq('id', sessionId)
        .select()
        .single()

      if (completeError) throw completeError

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    }
  }

  // Log workout set
  const logSet = async (log: Partial<WorkoutLog>) => {
    try {
      const { data, error: logError } = await supabase
        .from('workout_logs')
        .insert(log)
        .select()
        .single()

      if (logError) throw logError

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    }
  }

  return {
    workouts,
    currentWorkout,
    workoutExercises,
    sessions,
    isLoading,
    error,
    fetchWorkouts,
    fetchRecommendedWorkouts,
    fetchWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    startSession,
    completeSession,
    logSet,
  }
}
