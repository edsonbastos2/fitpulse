/**
 * Insight Rules - Regras para geração de insights personalizados
 *
 * Cada regra avalia o contexto do usuário e retorna uma mensagem de insight
 * ou null se a regra não se aplicar.
 *
 * Prioridade: PR (1) > volume (2) > frequência (3) > duração (4) > streak (5)
 */

// ==========================================
// Interfaces
// ==========================================

export interface InsightContext {
  /** Sessões recentes do usuário (últimos 7-30 dias) */
  recentSessions: {
    id: string
    workout_id: string
    started_at: string
    completed_at?: string
    status: 'completed' | 'skipped'
    logs: {
      exercise_id: string
      exercise_name: string
      set_number: number
      weight?: number
      reps?: number
      volume?: number // weight * reps
    }[]
    total_volume?: number
    duration_minutes?: number
  }[]
  /** Sessão atual/em andamento */
  currentSession?: {
    workout_id: string
    exercise_name: string
    current_weight?: number
    current_reps?: number
    estimated_duration: number
    actual_duration?: number
  }
  /** Grupos musculares treinados recentemente */
  muscleGroupHistory: {
    muscle_group: string
    last_trained: string
    times_in_last_7_days: number
  }[]
  /** Dias consecutivos de treino (streak atual) */
  consecutive_days: number
  /** Data da última sessão */
  last_session_date?: string
}

export interface InsightRule {
  /** Identificador único da regra */
  id: string
  /** Prioridade (menor = mais prioritário) */
  priority: number
  /** Título do insight */
  title: string
  /** Avalia o contexto e retorna a mensagem ou null */
  evaluate: (context: InsightContext) => string | null
}

// ==========================================
// Regras de Insight
// ==========================================

/**
 * Regra 1: Personal Record (PR)
 * Detecta quando o usuário superou seu recorde pessoal (peso × reps)
 */
export const prRule: InsightRule = {
  id: 'personal_record',
  priority: 1,
  title: '🏆 Recorde Pessoal!',
  evaluate: (context: InsightContext): string | null => {
    if (!context.currentSession) return null

    const { currentSession, recentSessions } = context

    // Calcula volume atual (peso × reps)
    const currentVolume =
      (currentSession.current_weight || 0) * (currentSession.current_reps || 0)
    if (currentVolume <= 0) return null

    // Encontra o melhor volume anterior para o mesmo exercício
    let bestPreviousVolume = 0
    for (const session of recentSessions) {
      for (const log of session.logs) {
        if (log.exercise_name === currentSession.exercise_name) {
          const logVolume = (log.weight || 0) * (log.reps || 0)
          if (logVolume > bestPreviousVolume) {
            bestPreviousVolume = logVolume
          }
        }
      }
    }

    // Se não há registros anteriores, não há PR para comparar
    if (bestPreviousVolume === 0) return null

    // Verifica se é um novo PR
    if (currentVolume > bestPreviousVolume) {
      const improvement = Math.round(
        ((currentVolume - bestPreviousVolume) / bestPreviousVolume) * 100
      )
      return `Novo recorde em ${currentSession.exercise_name}! Volume de ${currentVolume}kg (+${improvement}%)`
    }

    return null
  },
}

/**
 * Regra 2: Melhoria de Volume
 * Detecta quando o volume total da sessão atual superou a última sessão em > 5%
 */
export const volumeImprovementRule: InsightRule = {
  id: 'volume_improvement',
  priority: 2,
  title: '📈 Progresso de Volume',
  evaluate: (context: InsightContext): string | null => {
    const { recentSessions, currentSession } = context

    if (recentSessions.length < 1) return null

    // Pega o volume da última sessão completada
    const lastSession = recentSessions[recentSessions.length - 1]
    const lastVolume = lastSession.total_volume || 0
    if (lastVolume <= 0) return null

    // Estimativa do volume atual (soma dos logs da sessão atual se disponível)
    const currentVolume = currentSession
      ? (currentSession.current_weight || 0) * (currentSession.current_reps || 0)
      : 0
    if (currentVolume <= 0) return null

    // Verifica se houve melhoria > 5%
    const improvement = (currentVolume - lastVolume) / lastVolume
    if (improvement > 0.05) {
      return `Volume ${Math.round(improvement * 100)}% maior que a última sessão! Continue assim! 💪`
    }

    // Se o volume diminuiu
    if (improvement < -0.1) {
      return `Volume ${Math.round(Math.abs(improvement) * 100)}% menor que a última sessão. Que tal aumentar a intensidade?`
    }

    return null
  },
}

/**
 * Regra 3: Frequência de Grupo Muscular
 * Alerta quando um grupo muscular foi treinado 3+ vezes nos últimos 7 dias
 */
export const muscleFrequencyRule: InsightRule = {
  id: 'muscle_frequency',
  priority: 3,
  title: '⚠️ Frequência Muscular',
  evaluate: (context: InsightContext): string | null => {
    const { muscleGroupHistory, currentSession } = context

    if (!currentSession || !muscleGroupHistory) return null

    // Verifica se algum grupo muscular foi treinado 3+ vezes
    const overtrained = muscleGroupHistory.filter(
      (mg) => mg.times_in_last_7_days >= 3
    )

    if (overtrained.length > 0) {
      const groups = overtrained.map((mg) => mg.muscle_group).join(', ')
      return `Atenção: ${groups} foi treinado 3+ vezes esta semana. Considere dar tempo de recuperação adequado (48-72h).`
    }

    return null
  },
}

/**
 * Regra 4: Ajuste de Duração
 * Alerta quando a duração real excede a estimada em +15 minutos
 */
export const durationAdjustmentRule: InsightRule = {
  id: 'duration_adjustment',
  priority: 4,
  title: '⏱️ Ajuste de Duração',
  evaluate: (context: InsightContext): string | null => {
    const { currentSession } = context

    if (!currentSession) return null

    const { estimated_duration, actual_duration } = currentSession

    if (!actual_duration || !estimated_duration) return null

    const diff = actual_duration - estimated_duration

    if (diff > 15) {
      return `Seu treino está ${Math.round(diff)}min mais longo que o estimado (${estimated_duration}min). Que tal otimizar os descansos?`
    }

    if (diff < -10) {
      return `Seu treino está ${Math.round(Math.abs(diff))}min mais curto que o estimado. Considere adicionar mais séries ou exercícios.`
    }

    return null
  },
}

/**
 * Regra 5: Streak de Treinos
 * Encoraja quando o usuário tem 3+ dias consecutivos
 */
export const streakEncouragementRule: InsightRule = {
  id: 'streak_encouragement',
  priority: 5,
  title: '🔥 Sequência Ativa',
  evaluate: (context: InsightContext): string | null => {
    const { consecutive_days } = context

    if (consecutive_days >= 7) {
      return `Incrível! ${consecutive_days} dias seguidos de treino! Você está em uma sequência impressionante! 🚀`
    }

    if (consecutive_days >= 3) {
      return `${consecutive_days} dias consecutivos! Parabéns pela dedicação! Mantenha a consistência! 🔥`
    }

    return null
  },
}

// ==========================================
// Exportação de todas as regras
// ==========================================

export const allInsightRules: InsightRule[] = [
  prRule,
  volumeImprovementRule,
  muscleFrequencyRule,
  durationAdjustmentRule,
  streakEncouragementRule,
]

/**
 * Avalia todas as regras e retorna o insight de maior prioridade
 * (menor número de priority = mais prioritário)
 */
export function evaluateInsights(
  context: InsightContext
): { title: string; message: string } | null {
  const results = allInsightRules
    .map((rule) => {
      const message = rule.evaluate(context)
      return message ? { title: rule.title, message, priority: rule.priority } : null
    })
    .filter((r): r is { title: string; message: string; priority: number } => r !== null)

  if (results.length === 0) return null

  // Retorna o insight de maior prioridade (menor número)
  results.sort((a, b) => a.priority - b.priority)
  const top = results[0]
  return { title: top.title, message: top.message }
}
