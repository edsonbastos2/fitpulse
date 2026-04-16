/**
 * useInsights - Composable para avaliação de insights de sessão de treino
 *
 * Avalia uma sessão completada contra 5 regras de insight,
 * buscando histórico recente do Supabase e construindo o InsightContext.
 * Retorna o insight de maior prioridade (menor número de priority wins).
 */

import type { InsightContext } from '~/utils/insightRules'
import { evaluateInsights } from '~/utils/insightRules'

export interface UseInsightsReturn {
  /** Avalia uma sessão e retorna o insight de maior prioridade */
  evaluateSession: (sessionId: string) => Promise<{ title: string; message: string } | null>
  /** Busca dados de sessão para contexto de insight */
  buildInsightContext: (sessionId: string) => Promise<InsightContext | null>
}

export const useInsights = (): UseInsightsReturn => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  /**
   * Constrói o InsightContext para uma sessão específica
   * Busca: sessão atual, logs da sessão, sessões recentes, frequência muscular semanal
   */
  const buildInsightContext = async (sessionId: string): Promise<InsightContext | null> => {
    if (!user.value) return null

    try {
      // 1. Busca a sessão atual com logs
      const { data: currentSession, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('*, workout_exercises(*, exercises(*)), workout_logs(*, exercises(*))')
        .eq('id', sessionId)
        .single()

      if (sessionError || !currentSession) {
        return null
      }

      // 2. Busca sessões recentes (últimas 10 completadas)
      const { fetchRecentSessions } = await import('~/composables/useWorkouts')
      const workouts = await import('~/composables/useWorkouts').then(m => m.useWorkouts())
      const recentSessions = await workouts.fetchRecentSessions(10)

      if (!recentSessions) {
        // Se falhar ao buscar recentes, continua com array vazio
        return buildMinimalContext(currentSession)
      }

      // 3. Computa frequência muscular semanal
      const weeklyFrequency = computeWeeklyMuscleFrequency(recentSessions)

      // 4. Calcula streak de dias consecutivos
      const consecutiveDays = computeConsecutiveDays(recentSessions)

      // 5. Constrói o contexto completo
      return {
        recentSessions,
        currentSession: buildCurrentSessionData(currentSession),
        muscleGroupHistory: weeklyFrequency,
        consecutive_days: consecutiveDays,
        last_session_date: recentSessions[0]?.started_at,
      }
    } catch {
      return null
    }
  }

  /**
   * Constrói um contexto mínimo quando dados completos não estão disponíveis
   */
  const buildMinimalContext = (currentSession: any): InsightContext => {
    return {
      recentSessions: [],
      currentSession: buildCurrentSessionData(currentSession),
      muscleGroupHistory: [],
      consecutive_days: 0,
    }
  }

  /**
   * Avalia uma sessão completada e retorna o insight de maior prioridade
   */
  const evaluateSession = async (
    sessionId: string
  ): Promise<{ title: string; message: string } | null> => {
    const context = await buildInsightContext(sessionId)

    if (!context) {
      return null
    }

    // Avalia todas as regras e retorna a de maior prioridade
    return evaluateInsights(context)
  }

  /**
   * Transforma dados brutos da sessão atual para formato do InsightContext
   */
  const buildCurrentSessionData = (session: any): InsightContext['currentSession'] => {
    const workoutExercises = session.workout_exercises || []
    const logs = session.workout_logs || []

    // Pega o primeiro exercício como referência (ou o mais recente)
    const lastLog = logs[logs.length - 1]
    const exerciseName = lastLog?.exercises?.name_pt || lastLog?.exercises?.name || 'Exercício'

    // Calcula duração real se disponível
    let actualDuration: number | undefined
    if (session.started_at && session.completed_at) {
      const start = new Date(session.started_at).getTime()
      const end = new Date(session.completed_at).getTime()
      actualDuration = Math.round((end - start) / (1000 * 60))
    }

    return {
      workout_id: session.workout_id,
      exercise_name: exerciseName,
      current_weight: lastLog?.weight || undefined,
      current_reps: lastLog?.reps || undefined,
      estimated_duration: session.estimated_duration || 45,
      actual_duration: actualDuration,
    }
  }

  /**
   * Computa frequência de grupos musculares nos últimos 7 dias
   */
  const computeWeeklyMuscleFrequency = (
    sessions: InsightContext['recentSessions']
  ): InsightContext['muscleGroupHistory'] => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Filtra sessões dos últimos 7 dias
    const recentInWeek = sessions.filter((s) => {
      const startedAt = new Date(s.started_at)
      return startedAt >= sevenDaysAgo
    })

    // Conta exercícios por sessão
    const muscleFrequencyMap: Record<string, number> = {}
    const muscleLastTrained: Record<string, string> = {}

    for (const session of recentInWeek) {
      const exercisedMuscles = new Set<string>()

      for (const log of session.logs) {
        // Usa exercise_name como proxy para grupo muscular
        // Em uma implementação completa, buscaria muscle_groups do exercício
        exercisedMuscles.add(log.exercise_name)
      }

      for (const muscle of exercisedMuscles) {
        muscleFrequencyMap[muscle] = (muscleFrequencyMap[muscle] || 0) + 1
        muscleLastTrained[muscle] = session.started_at
      }
    }

    return Object.keys(muscleFrequencyMap).map((muscle) => ({
      muscle_group: muscle,
      last_trained: muscleLastTrained[muscle],
      times_in_last_7_days: muscleFrequencyMap[muscle],
    }))
  }

  /**
   * Computa dias consecutivos de treino (streak atual)
   */
  const computeConsecutiveDays = (
    sessions: InsightContext['recentSessions']
  ): number => {
    if (sessions.length === 0) return 0

    // Ordena sessões por data (mais recente primeiro)
    const sorted = [...sessions].sort(
      (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    )

    let streak = 1
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let lastDate = new Date(sorted[0].started_at)
    lastDate.setHours(0, 0, 0, 0)

    // Verifica se a última sessão foi hoje ou ontem
    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays > 1) {
      // Se última sessão foi há mais de 1 dia, streak zerou
      return 0
    }

    // Conta dias consecutivos
    for (let i = 1; i < sorted.length; i++) {
      const currentDate = new Date(sorted[i].started_at)
      currentDate.setHours(0, 0, 0, 0)

      const diff = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diff === 1) {
        streak++
        lastDate = currentDate
      } else if (diff > 1) {
        // Gap de mais de 1 dia, streak quebrou
        break
      }
      // diff === 0 significa múltiplas sessões no mesmo dia, ignora
    }

    return streak
  }

  return {
    evaluateSession,
    buildInsightContext,
  }
}
