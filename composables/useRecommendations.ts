import type { Recommendation, UserProfile, Workout, Exercise } from '~/types'

export const useRecommendations = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const { profile } = useAuth()

  const recommendations = useState<Recommendation[]>('recommendations', () => [])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Generate personalized recommendations based on user profile
  const generateRecommendations = async () => {
    if (!user.value || !profile.value) return []

    isLoading.value = true
    error.value = null

    try {
      const userProfile = profile.value
      const recommendationsList: Recommendation[] = []

      // 1. Get user's workout history
      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('*, workouts(*)')
        .eq('user_id', user.value.id)
        .order('completed_at', { ascending: false })
        .limit(20)

      // 2. Get user's completed workouts
      const { data: completedWorkouts } = await supabase
        .from('workout_sessions')
        .select('workout_id')
        .eq('user_id', user.value.id)
        .eq('status', 'completed')

      const completedWorkoutIds = completedWorkouts?.map((s) => s.workout_id) || []

      // 3. Analyze muscle group balance
      const muscleBalance = analyzeMuscleBalance(sessions || [])
      const weakMuscles = muscleBalance.filter((m) => m.percentage < 15)

      // 4. Get recommended workouts based on profile
      let query = supabase
        .from('workouts')
        .select('*')
        .eq('is_recommended', true)
        .not('id', 'in', `(${completedWorkoutIds.join(',')})`)

      if (userProfile.level) {
        query = query.eq('difficulty', userProfile.level)
      }

      if (userProfile.goals?.length) {
        const typeMap: Record<string, string> = {
          muscle_gain: 'strength',
          weight_loss: 'hiit',
          endurance: 'cardio',
          flexibility: 'flexibility',
          general: 'mixed',
        }
        const workoutType = userProfile.goals
          .map((g) => typeMap[g])
          .find((t) => t)
        if (workoutType) {
          query = query.eq('type', workoutType)
        }
      }

      const { data: suggestedWorkouts } = await query.limit(5)

      if (suggestedWorkouts?.length) {
        suggestedWorkouts.forEach((workout, index) => {
          recommendationsList.push({
            type: 'workout',
            priority: index + 1,
            reason: getWorkoutReason(workout, weakMuscles, userProfile),
            data: workout as Workout,
          })
        })
      }

      // 5. Get exercises for weak muscle groups
      if (weakMuscles.length > 0) {
        const { data: exercises } = await supabase
          .from('exercises')
          .select('*')
          .contains('primary_muscles', [weakMuscles[0].muscleId])
          .eq('difficulty', getDifficultyForLevel(userProfile.level))
          .limit(3)

        if (exercises?.length) {
          exercises.forEach((exercise) => {
            recommendationsList.push({
              type: 'exercise',
              priority: 6,
              reason: `Fortaleça seus ${weakMuscles[0].muscleName} com este exercício`,
              data: exercise as Exercise,
            })
          })
        }
      }

      // 6. Add tips based on profile
      if (userProfile.goals?.includes('muscle_gain')) {
        recommendationsList.push({
          type: 'tip',
          priority: 10,
          reason: 'Dica para hipertrofia',
          data: 'Mantenha um déficit calórico de 200-300kcal para otimizar ganhos musculares.',
        })
      }

      if (userProfile.workout_frequency < 3) {
        recommendationsList.push({
          type: 'challenge',
          priority: 8,
          reason: 'Aumente sua frequência',
          data: 'Tente treinar pelo menos 3x por semana para resultados mais consistentes.',
        })
      }

      recommendations.value = recommendationsList
      return recommendationsList
    } catch (err: unknown) {
      error.value = (err as Error).message
      return []
    } finally {
      isLoading.value = false
    }
  }

  // Analyze which muscle groups have been worked
  const analyzeMuscleBalance = (
    _sessions: unknown[]
  ): { muscleId: string; muscleName: string; percentage: number }[] => {
    // This would analyze workout history to find imbalanced muscle groups
    // For now, return mock data
    return [
      { muscleId: '1', muscleName: 'peito', percentage: 30 },
      { muscleId: '2', muscleName: 'costas', percentage: 25 },
      { muscleId: '3', muscleName: 'pernas', percentage: 35 },
      { muscleId: '4', muscleName: 'ombros', percentage: 10 },
      { muscleId: '5', muscleName: 'bíceps', percentage: 5 },
      { muscleId: '6', muscleName: 'tríceps', percentage: 5 },
    ]
  }

  // Get reason for workout recommendation
  const getWorkoutReason = (
    workout: Workout,
    _weakMuscles: unknown[],
    userProfile: UserProfile
  ): string => {
    if (_weakMuscles.length > 0) {
      return `Ideal para fortalecer ${(_weakMuscles[0] as { muscleName: string }).muscleName}`
    }
    if (userProfile.goals?.includes('muscle_gain')) {
      return 'Perfeito para hipertrofia'
    }
    if (userProfile.goals?.includes('weight_loss')) {
      return 'Excelente para queimar calorias'
    }
    return 'Recomendado para o seu nível'
  }

  // Get difficulty based on user level
  const getDifficultyForLevel = (level?: string): string => {
    switch (level) {
      case 'beginner':
        return 'easy'
      case 'intermediate':
        return 'medium'
      case 'advanced':
        return 'hard'
      default:
        return 'medium'
    }
  }

  // Get adaptive workout plan
  const getAdaptivePlan = async () => {
    if (!profile.value) return null

    const { data: sessions } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.value?.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(10)

    // Calculate weekly frequency
    const weeklyFrequency = sessions?.length || 0

    // Adjust recommendations based on progress
    if (weeklyFrequency >= profile.value.workout_frequency) {
      return {
        type: 'maintain',
        message: 'Continue assim! Você está no caminho certo.',
        suggestedIncrease: false,
      }
    } else if (weeklyFrequency >= profile.value.workout_frequency - 1) {
      return {
        type: 'almost',
        message: 'Quase lá! Falta apenas 1 treino para atingir sua meta.',
        suggestedIncrease: false,
      }
    } else {
      return {
        type: 'increase',
        message: 'Que tal adicionar mais treinos esta semana?',
        suggestedIncrease: true,
      }
    }
  }

  return {
    recommendations,
    isLoading,
    error,
    generateRecommendations,
    getAdaptivePlan,
  }
}
