import { describe, it, expect } from 'vitest'
import type { InsightContext } from '../../utils/insightRules'
import {
  prRule,
  volumeImprovementRule,
  muscleFrequencyRule,
  durationAdjustmentRule,
  streakEncouragementRule,
  evaluateInsights,
} from '../../utils/insightRules'

// ==========================================
// Helpers para criar contextos mock
// ==========================================

function createMockContext(
  overrides: Partial<InsightContext> = {}
): InsightContext {
  return {
    recentSessions: [],
    muscleGroupHistory: [],
    consecutive_days: 0,
    ...overrides,
  }
}

function createCompletedSession(
  volume: number,
  durationMinutes: number
): InsightContext['recentSessions'][0] {
  return {
    id: `session_${Date.now()}`,
    workout_id: 'workout_1',
    started_at: new Date().toISOString(),
    status: 'completed',
    logs: [],
    total_volume: volume,
    duration_minutes: durationMinutes,
  }
}

// ==========================================
// PR Rule Tests
// ==========================================

describe('prRule', () => {
  it('deve retornar null quando não há sessão atual', () => {
    const context = createMockContext()
    const result = prRule.evaluate(context)
    expect(result).toBeNull()
  })

  it('deve retornar null quando não há sessões anteriores', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Supino Reto',
        current_weight: 80,
        current_reps: 10,
        estimated_duration: 45,
      },
    })
    const result = prRule.evaluate(context)
    expect(result).toBeNull()
  })

  it('deve retornar mensagem PR quando peso × reps excede máximo anterior', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Supino Reto',
        current_weight: 90,
        current_reps: 10,
        estimated_duration: 45,
      },
      recentSessions: [
        {
          id: 'session_1',
          workout_id: 'workout_1',
          started_at: '2026-04-10',
          status: 'completed',
          logs: [
            {
              exercise_id: 'ex_1',
              exercise_name: 'Supino Reto',
              set_number: 1,
              weight: 80,
              reps: 10,
              volume: 800,
            },
          ],
          total_volume: 800,
        },
      ],
    })

    // 90 × 10 = 900 > 80 × 10 = 800
    const result = prRule.evaluate(context)
    expect(result).not.toBeNull()
    expect(result).toContain('Novo recorde')
    expect(result).toContain('Supino Reto')
    expect(result).toContain('+13%') // (900-800)/800 = 12.5% → arredonda para 13%
  })

  it('deve retornar null quando não houve PR', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Supino Reto',
        current_weight: 70,
        current_reps: 10,
        estimated_duration: 45,
      },
      recentSessions: [
        {
          id: 'session_1',
          workout_id: 'workout_1',
          started_at: '2026-04-10',
          status: 'completed',
          logs: [
            {
              exercise_id: 'ex_1',
              exercise_name: 'Supino Reto',
              set_number: 1,
              weight: 80,
              reps: 10,
              volume: 800,
            },
          ],
          total_volume: 800,
        },
      ],
    })

    // 70 × 10 = 700 < 80 × 10 = 800
    const result = prRule.evaluate(context)
    expect(result).toBeNull()
  })
})

// ==========================================
// Volume Improvement Rule Tests
// ==========================================

describe('volumeImprovementRule', () => {
  it('deve retornar null quando não há sessões recentes', () => {
    const context = createMockContext()
    const result = volumeImprovementRule.evaluate(context)
    expect(result).toBeNull()
  })

  it('deve retornar mensagem de melhoria quando volume > 5% maior', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Supino Reto',
        current_weight: 85,
        current_reps: 10,
        estimated_duration: 45,
      },
      recentSessions: [
        createCompletedSession(800, 45), // última sessão: 800kg
      ],
    })

    // 85 × 10 = 850 > 800 × 1.05 = 840
    const result = volumeImprovementRule.evaluate(context)
    expect(result).not.toBeNull()
    expect(result).toContain('% maior')
  })

  it('deve retornar null quando volume similar (< 5% diferença)', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Supino Reto',
        current_weight: 81,
        current_reps: 10,
        estimated_duration: 45,
      },
      recentSessions: [
        createCompletedSession(800, 45),
      ],
    })

    // 81 × 10 = 810, melhoria de apenas 1.25% (< 5%)
    const result = volumeImprovementRule.evaluate(context)
    expect(result).toBeNull()
  })

  it('deve retornar mensagem quando volume diminuiu > 10%', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Supino Reto',
        current_weight: 70,
        current_reps: 10,
        estimated_duration: 45,
      },
      recentSessions: [
        createCompletedSession(800, 45),
      ],
    })

    // 70 × 10 = 700 < 800 (12.5% menor)
    const result = volumeImprovementRule.evaluate(context)
    expect(result).not.toBeNull()
    expect(result).toContain('% menor')
  })
})

// ==========================================
// Muscle Frequency Rule Tests
// ==========================================

describe('muscleFrequencyRule', () => {
  it('deve retornar null quando não há histórico muscular', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Supino Reto',
        current_weight: 80,
        current_reps: 10,
        estimated_duration: 45,
      },
    })
    const result = muscleFrequencyRule.evaluate(context)
    expect(result).toBeNull()
  })

  it('deve retornar alerta quando grupo muscular treinado 3+ vezes', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Supino Reto',
        current_weight: 80,
        current_reps: 10,
        estimated_duration: 45,
      },
      muscleGroupHistory: [
        {
          muscle_group: 'Peito',
          last_trained: '2026-04-13',
          times_in_last_7_days: 3,
        },
        {
          muscle_group: 'Pernas',
          last_trained: '2026-04-12',
          times_in_last_7_days: 1,
        },
      ],
    })

    const result = muscleFrequencyRule.evaluate(context)
    expect(result).not.toBeNull()
    expect(result).toContain('Peito')
    expect(result).toContain('3+')
    expect(result).toContain('recuperação')
  })

  it('deve retornar null quando frequência está normal', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Supino Reto',
        current_weight: 80,
        current_reps: 10,
        estimated_duration: 45,
      },
      muscleGroupHistory: [
        {
          muscle_group: 'Peito',
          last_trained: '2026-04-13',
          times_in_last_7_days: 2,
        },
      ],
    })

    const result = muscleFrequencyRule.evaluate(context)
    expect(result).toBeNull()
  })
})

// ==========================================
// Duration Adjustment Rule Tests
// ==========================================

describe('durationAdjustmentRule', () => {
  it('deve retornar null quando não há sessão atual', () => {
    const context = createMockContext()
    const result = durationAdjustmentRule.evaluate(context)
    expect(result).toBeNull()
  })

  it('deve retornar alerta quando duração real > estimada + 15min', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Treino Completo',
        estimated_duration: 45,
        actual_duration: 70, // 25min a mais
      },
    })

    const result = durationAdjustmentRule.evaluate(context)
    expect(result).not.toBeNull()
    expect(result).toContain('mais longo')
    expect(result).toContain('descansos')
  })

  it('deve retornar alerta quando duração real < estimada - 10min', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Treino Completo',
        estimated_duration: 60,
        actual_duration: 40, // 20min a menos
      },
    })

    const result = durationAdjustmentRule.evaluate(context)
    expect(result).not.toBeNull()
    expect(result).toContain('mais curto')
    expect(result).toContain('adicionar')
  })

  it('deve retornar null quando duração está dentro do esperado', () => {
    const context = createMockContext({
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Treino Completo',
        estimated_duration: 45,
        actual_duration: 47, // apenas 2min de diferença
      },
    })

    const result = durationAdjustmentRule.evaluate(context)
    expect(result).toBeNull()
  })
})

// ==========================================
// Streak Encouragement Rule Tests
// ==========================================

describe('streakEncouragementRule', () => {
  it('deve retornar null quando streak < 3 dias', () => {
    const context = createMockContext({ consecutive_days: 2 })
    const result = streakEncouragementRule.evaluate(context)
    expect(result).toBeNull()
  })

  it('deve retornar encorajamento quando streak >= 3 dias', () => {
    const context = createMockContext({ consecutive_days: 3 })
    const result = streakEncouragementRule.evaluate(context)
    expect(result).not.toBeNull()
    expect(result).toContain('3 dias')
    expect(result).toContain('🔥')
  })

  it('deve retornar mensagem especial quando streak >= 7 dias', () => {
    const context = createMockContext({ consecutive_days: 7 })
    const result = streakEncouragementRule.evaluate(context)
    expect(result).not.toBeNull()
    expect(result).toContain('7 dias')
    expect(result).toContain('🚀')
  })

  it('deve retornar mensagem correta para streak de 10 dias', () => {
    const context = createMockContext({ consecutive_days: 10 })
    const result = streakEncouragementRule.evaluate(context)
    expect(result).not.toBeNull()
    expect(result).toContain('10 dias')
  })
})

// ==========================================
// evaluateInsights Integration Tests
// ==========================================

describe('evaluateInsights', () => {
  it('deve retornar null quando nenhuma regra se aplica', () => {
    const context = createMockContext()
    const result = evaluateInsights(context)
    expect(result).toBeNull()
  })

  it('deve retornar exatamente 1 insight com contexto realista', () => {
    const context = createMockContext({
      consecutive_days: 3,
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Supino Reto',
        current_weight: 80,
        current_reps: 10,
        estimated_duration: 45,
      },
      recentSessions: [
        createCompletedSession(800, 45),
      ],
      muscleGroupHistory: [
        {
          muscle_group: 'Peito',
          last_trained: '2026-04-13',
          times_in_last_7_days: 1,
        },
      ],
    })

    const result = evaluateInsights(context)
    // Streak de 3 dias deve disparar
    expect(result).not.toBeNull()
    expect(result?.message).toContain('🔥')
  })

  it('deve respeitar ordenação de prioridade (PR > volume > frequência > duração > streak)', () => {
    // Cria contexto onde múltiplas regras se aplicam
    const context = createMockContext({
      consecutive_days: 5, // streak rule aplica
      currentSession: {
        workout_id: 'workout_1',
        exercise_name: 'Supino Reto',
        current_weight: 90,
        current_reps: 10,
        estimated_duration: 45,
      },
      recentSessions: [
        {
          id: 'session_1',
          workout_id: 'workout_1',
          started_at: '2026-04-10',
          status: 'completed',
          logs: [
            {
              exercise_id: 'ex_1',
              exercise_name: 'Supino Reto',
              set_number: 1,
              weight: 80,
              reps: 10,
              volume: 800,
            },
          ],
          total_volume: 800,
        },
      ],
      muscleGroupHistory: [
        {
          muscle_group: 'Peito',
          last_trained: '2026-04-13',
          times_in_last_7_days: 3, // frequency rule aplica
        },
      ],
    })

    // PR tem prioridade 1 (mais alto)
    const result = evaluateInsights(context)
    expect(result).not.toBeNull()
    expect(result?.title).toContain('Recorde Pessoal')
  })
})
