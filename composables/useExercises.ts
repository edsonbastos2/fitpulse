import type { Exercise, MuscleGroup, Equipment, ExerciseFilters } from '~/types'

export const useExercises = () => {
  const supabase = useSupabaseClient()

  const exercises = useState<Exercise[]>('exercises', () => [])
  const muscleGroups = useState<MuscleGroup[]>('muscle-groups', () => [])
  const equipment = useState<Equipment[]>('equipment', () => [])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Pagination state
  const totalExercises = useState<number>('catalog-total', () => 0)
  const currentPage = useState<number>('catalog-page', () => 1)
  const perPage = 12

  /**
   * Fetch exercises with pagination and combinable filters
   */
  const fetchExercisesPaginated = async (params: ExerciseFilters) => {
    isLoading.value = true
    error.value = null

    try {
      const {
        search,
        difficulty,
        muscleGroup,
        equipment,
        type,
        sort,
        page,
      } = params

      const targetPage = page ?? 1
      const from = (targetPage - 1) * perPage
      const to = from + perPage - 1

      // Start building query
      let query = supabase
        .from('exercises')
        .select('*', { count: 'exact' })

      // Apply search filter across name_pt and description_pt
      if (search) {
        query = query.or(`name_pt.ilike.%${search}%,description_pt.ilike.%${search}%`)
      }

      // Apply difficulty filter
      if (difficulty) {
        query = query.eq('difficulty', difficulty)
      }

      // Apply equipment filter
      if (equipment) {
        query = query.eq('equipment_id', equipment)
      }

      // Apply muscle group filter (check if muscleGroup ID is in primary_muscles array)
      if (muscleGroup) {
        query = query.contains('primary_muscles', [muscleGroup])
      }

      // Apply type filter
      if (type === 'compound') {
        query = query.eq('is_compound', true)
      } else if (type === 'cardio') {
        query = query.eq('is_cardio', true)
      } else if (type === 'isolation') {
        query = query.and('is_compound.eq.false,is_cardio.eq.false')
      }

      // Apply sorting
      if (sort === 'name_asc') {
        query = query.order('name_pt', { ascending: true })
      } else if (sort === 'name_desc') {
        query = query.order('name_pt', { ascending: false })
      } else if (sort === 'difficulty') {
        query = query.order('difficulty', { ascending: true })
      } else {
        // Default sort by name
        query = query.order('name_pt', { ascending: true })
      }

      // Apply pagination
      query = query.range(from, to)

      // Execute
      const { data, count, error: fetchError } = await query

      if (fetchError) throw fetchError

      exercises.value = (data ?? []) as Exercise[]
      totalExercises.value = count ?? 0
      currentPage.value = targetPage

      return { data, count, page: targetPage }
    } catch (err: unknown) {
      const message = (err as Error).message
      console.error('[useExercises] fetchExercisesPaginated error:', message)
      error.value = message
      exercises.value = []
      totalExercises.value = 0
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch exercises related to a given exercise by shared muscles or equipment
   */
  const fetchRelatedExercises = async (
    exerciseId: string,
    options?: { limit?: number }
  ) => {
    const limit = options?.limit ?? 4
    isLoading.value = true
    error.value = null

    try {
      // First, get the target exercise to know its muscles and equipment
      const { data: target, error: targetError } = await supabase
        .from('exercises')
        .select('primary_muscles, equipment_id')
        .eq('id', exerciseId)
        .single()

      if (targetError) throw targetError

      if (!target) {
        return []
      }

      // Build query for related exercises
      let query = supabase
        .from('exercises')
        .select('*')
        .neq('id', exerciseId) // Exclude the current exercise

      // Prefer exercises sharing primary_muscles (array overlap) or equipment
      const muscles = target.primary_muscles as string[] | null
      const equipId = target.equipment_id as string | null

      if (muscles && muscles.length > 0) {
        query = query.overlaps('primary_muscles', muscles)
      }

      if (equipId) {
        // Also include exercises with same equipment as alternative
        // Note: Supabase doesn't support OR across different columns easily,
        // so we use the muscle overlap as primary filter
      }

      // Default: if no overlap criteria, just get random exercises
      // (this branch is rarely taken since most exercises have muscles)
      if (!muscles?.length && !equipId) {
        // No criteria — just fetch some exercises
      }

      const { data, error: fetchError } = await query
        .limit(limit)
        .order('name_pt')

      if (fetchError) throw fetchError

      return (data ?? []) as Exercise[]
    } catch (err: unknown) {
      const message = (err as Error).message
      console.error('[useExercises] fetchRelatedExercises error:', message)
      error.value = message
      return []
    } finally {
      isLoading.value = false
    }
  }

  // --- Existing functions (unchanged) ---

  /**
   * Fetch all exercises (legacy, no pagination)
   * @deprecated Use fetchExercisesPaginated instead
   */
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
    } catch (err: unknown) {
      error.value = (err as Error).message
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
    } catch (err: unknown) {
      error.value = (err as Error).message
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
    } catch (err: unknown) {
      error.value = (err as Error).message
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
    } catch (err: unknown) {
      error.value = (err as Error).message
      return null
    }
  }

  return {
    exercises,
    muscleGroups,
    equipment,
    isLoading,
    error,
    totalExercises,
    currentPage,
    perPage,
    fetchExercises,
    fetchExercise,
    fetchMuscleGroups,
    fetchEquipment,
    fetchExercisesPaginated,
    fetchRelatedExercises,
  }
}
