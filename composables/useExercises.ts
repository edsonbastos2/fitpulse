import type { Exercise, MuscleGroup, Equipment } from '~/types'

export const useExercises = () => {
  const supabase = useSupabaseClient()

  const exercises = useState<Exercise[]>('exercises', () => [])
  const muscleGroups = useState<MuscleGroup[]>('muscle-groups', () => [])
  const equipment = useState<Equipment[]>('equipment', () => [])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all exercises
  const fetchExercises = async (filters?: {
    difficulty?: string
    muscleGroup?: string
    equipment?: string
    search?: string
    isCardio?: boolean
  }) => {
    isLoading.value = true
    error.value = null

    try {
      let query = supabase
        .from('exercises')
        .select('*')
        .order('name')

      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty)
      }

      if (filters?.isCardio !== undefined) {
        query = query.eq('is_cardio', filters.isCardio)
      }

      if (filters?.equipment) {
        query = query.eq('equipment_id', filters.equipment)
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      exercises.value = data as Exercise[]
      return data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Fetch single exercise
  const fetchExercise = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      return data as Exercise
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Fetch muscle groups
  const fetchMuscleGroups = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('muscle_groups')
        .select('*')
        .order('name')

      if (fetchError) throw fetchError

      muscleGroups.value = data as MuscleGroup[]
      return data
    } catch (err: any) {
      error.value = err.message
      return null
    }
  }

  // Fetch equipment
  const fetchEquipment = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('equipment')
        .select('*')
        .order('name')

      if (fetchError) throw fetchError

      equipment.value = data as Equipment[]
      return data
    } catch (err: any) {
      error.value = err.message
      return null
    }
  }

  return {
    exercises,
    muscleGroups,
    equipment,
    isLoading,
    error,
    fetchExercises,
    fetchExercise,
    fetchMuscleGroups,
    fetchEquipment,
  }
}
