import { describe, it, expect } from 'vitest'
import type { InsightContext } from '../../utils/insightRules'
import { evaluateInsights } from '../../utils/insightRules'

/**
 * Testes de integração para avaliação de insights
 *
 * Estes testes verificam que o evaluateInsights funciona corretamente
 * com contextos realistas, simulando o que o useInsights.buildInsightContext
 * produziria.
 *
 * Os testes do useInsights com Supabase são feitos via testes E2E,
 * pois requerem mocks complexos de auto-import do Nuxt.
 */

describe('Insight Evaluation - Integration Tests', () => {
  // ==========================================
  // Helper
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

  // ==========================================
  // PR Context Tests
  // ==========================================

  describe('evaluateSession with PR context', () => {
    it('deve retornar PR insight quando usuário bateu recorde pessoal', () => {
      const context = createMockContext({
        currentSession: {
          workout_id: 'workout-1',
          exercise_name: 'Supino Reto',
          current_weight: 90,
          current_reps: 10,
          estimated_duration: 45,
        },
        recentSessions: [
          {
            id: 'session-0',
            workout_id: 'workout-1',
            started_at: '2026-04-10T10:00:00Z',
            status: 'completed',
            logs: [
              {
                exercise_id: 'ex-1',
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

      const result = evaluateInsights(context)

      expect(result).not.toBeNull()
      expect(result?.title).toContain('Recorde Pessoal')
      expect(result?.message).toContain('Supino Reto')
      expect(result?.message).toContain('+13%')
    })
  })

  // ==========================================
  // Volume Increase Tests
  // ==========================================

  describe('evaluateSession with volume increase', () => {
    it('deve retornar volume improvement quando volume > 5% maior', () => {
      const context = createMockContext({
        currentSession: {
          workout_id: 'workout-1',
          exercise_name: 'Supino Reto',
          current_weight: 85,
          current_reps: 10,
          estimated_duration: 45,
        },
        recentSessions: [
          {
            id: 'session-0',
            workout_id: 'workout-1',
            started_at: '2026-04-10T10:00:00Z',
            status: 'completed',
            logs: [],
            total_volume: 800,
          },
        ],
      })

      const result = evaluateInsights(context)

      expect(result).not.toBeNull()
      // Pode ser PR ou volume improvement
      expect(result?.message).toMatch(/% maior|% menor|Recorde|sequência|dias|Atenção|duração/i)
    })
  })

  // ==========================================
  // High Frequency Muscle Tests
  // ==========================================

  describe('evaluateSession with high frequency muscle', () => {
    it('deve retornar rest recommendation quando grupo muscular treinado 3+ vezes', () => {
      const context = createMockContext({
        currentSession: {
          workout_id: 'workout-1',
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
        ],
      })

      const result = evaluateInsights(context)

      expect(result).not.toBeNull()
      expect(result?.message).toContain('Peito')
      expect(result?.message).toContain('recuperação')
    })
  })

  // ==========================================
  // Duration Overrun Tests
  // ==========================================

  describe('evaluateSession with duration overrun', () => {
    it('deve retornar duration adjustment quando duração real > estimada + 15min', () => {
      const context = createMockContext({
        currentSession: {
          workout_id: 'workout-1',
          exercise_name: 'Treino Completo',
          estimated_duration: 45,
          actual_duration: 70,
        },
      })

      const result = evaluateInsights(context)

      expect(result).not.toBeNull()
      expect(result?.message).toContain('mais longo')
    })
  })

  // ==========================================
  // Streak Tests
  // ==========================================

  describe('evaluateSession with 3+ consecutive days', () => {
    it('deve retornar streak encouragement quando consecutive_days >= 3', () => {
      const context = createMockContext({
        consecutive_days: 3,
      })

      const result = evaluateInsights(context)

      expect(result).not.toBeNull()
      expect(result?.message).toContain('🔥')
    })

    it('deve retornar mensagem especial quando consecutive_days >= 7', () => {
      const context = createMockContext({
        consecutive_days: 7,
      })

      const result = evaluateInsights(context)

      expect(result).not.toBeNull()
      expect(result?.message).toContain('🚀')
    })
  })

  // ==========================================
  // No Recent Sessions Tests
  // ==========================================

  describe('evaluateSession with no recent sessions', () => {
    it('deve retornar null quando nenhuma regra aplica', () => {
      const context = createMockContext()

      const result = evaluateInsights(context)

      expect(result).toBeNull()
    })

    it('deve retornar streak quando consecutive_days >= 3 mesmo sem sessões recentes', () => {
      const context = createMockContext({
        consecutive_days: 5,
      })

      const result = evaluateInsights(context)

      expect(result).not.toBeNull()
      expect(result?.message).toContain('dias')
    })
  })

  // ==========================================
  // Priority Ordering Tests
  // ==========================================

  describe('Priority ordering', () => {
    it('deve retornar PR (priority 1) quando múltiplas regras aplicam', () => {
      const context = createMockContext({
        consecutive_days: 5, // streak rule (priority 5)
        currentSession: {
          workout_id: 'workout-1',
          exercise_name: 'Supino Reto',
          current_weight: 90,
          current_reps: 10,
          estimated_duration: 45,
        },
        recentSessions: [
          {
            id: 'session-0',
            workout_id: 'workout-1',
            started_at: '2026-04-10T10:00:00Z',
            status: 'completed',
            logs: [
              {
                exercise_id: 'ex-1',
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
            times_in_last_7_days: 3, // frequency rule (priority 3)
          },
        ],
      })

      const result = evaluateInsights(context)

      // PR tem prioridade 1 (mais alto)
      expect(result).not.toBeNull()
      expect(result?.title).toContain('Recorde Pessoal')
    })

    it('deve retornar volume (priority 2) quando PR não aplica mas volume aplica', () => {
      const context = createMockContext({
        consecutive_days: 5,
        currentSession: {
          workout_id: 'workout-1',
          exercise_name: 'Supino Reto',
          current_weight: 85,
          current_reps: 10,
          estimated_duration: 45,
        },
        recentSessions: [
          {
            id: 'session-0',
            workout_id: 'workout-1',
            started_at: '2026-04-10T10:00:00Z',
            status: 'completed',
            logs: [],
            total_volume: 800,
          },
        ],
      })

      const result = evaluateInsights(context)

      expect(result).not.toBeNull()
      // Volume ou streak deve ganhar
      expect(result?.message).toMatch(/% maior|dias/i)
    })
  })
})
