import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { Workout } from '~/types'

// Mock do localStorage ANTES de qualquer import
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

// Define no global antes dos imports do store
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true,
})

// Mock do import.meta.client
vi.mock('~/composables/useWorkouts', () => ({
  useWorkouts: vi.fn(() => ({
    fetchWorkout: vi.fn(),
    startSession: vi.fn(),
    logSet: vi.fn(),
    completeSession: vi.fn(),
  })),
}))

vi.mock('~/composables/useInsights', () => ({
  useInsights: vi.fn(() => null),
}))

describe('useSessionStore', () => {
  let sessionStore: ReturnType<typeof import('../../stores/session').useSessionStore>

  beforeEach(async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    localStorageMock.clear()
    vi.clearAllMocks()

    const { useSessionStore } = await import('../../stores/session')
    sessionStore = useSessionStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ==========================================
  // State Tests
  // ==========================================

  describe('state', () => {
    it('deve inicializar com estado vazio', () => {
      expect(sessionStore.sessionId).toBeNull()
      expect(sessionStore.startedAt).toBeNull()
      expect(sessionStore.workout).toBeNull()
      expect(sessionStore.exercises).toEqual([])
      expect(sessionStore.activeExerciseIndex).toBe(0)
      expect(sessionStore.timer).toEqual({
        remaining: 0,
        isRunning: false,
        totalDuration: 0,
      })
      expect(sessionStore.workoutId).toBeNull()
    })
  })

  // ==========================================
  // Getters Tests
  // ==========================================

  describe('totalVolume getter', () => {
    it('deve retornar 0 quando não há logs', () => {
      expect(sessionStore.totalVolume).toBe(0)
    })

    it('deve calcular volume total corretamente (peso x reps)', () => {
      sessionStore.exercises = [
        {
          workout_exercise_id: 'we1',
          exercise_id: 'ex1',
          exercise_name: 'Supino Reto',
          sets: 3,
          reps: 10,
          rest_period: 90,
          logs: [
            { session_id: 's1', workout_exercise_id: 'we1', set_number: 1, weight: 80, reps: 10, completed: true },
            { session_id: 's1', workout_exercise_id: 'we1', set_number: 2, weight: 80, reps: 10, completed: true },
            { session_id: 's1', workout_exercise_id: 'we1', set_number: 3, weight: 90, reps: 8, completed: true },
          ],
        },
      ]

      // 80*10 + 80*10 + 90*8 = 800 + 800 + 720 = 2320
      expect(sessionStore.totalVolume).toBe(2320)
    })

    it('deve ignorar sets nao completados', () => {
      sessionStore.exercises = [
        {
          workout_exercise_id: 'we1',
          exercise_id: 'ex1',
          exercise_name: 'Supino Reto',
          sets: 3,
          reps: 10,
          rest_period: 90,
          logs: [
            { session_id: 's1', workout_exercise_id: 'we1', set_number: 1, weight: 80, reps: 10, completed: true },
            { session_id: 's1', workout_exercise_id: 'we1', set_number: 2, weight: 80, reps: 8, completed: false },
          ],
        },
      ]

      expect(sessionStore.totalVolume).toBe(800) // apenas 80*10
    })
  })

  describe('completedSets getter', () => {
    it('deve retornar 0 quando nao ha logs', () => {
      expect(sessionStore.completedSets).toBe(0)
    })

    it('deve contar apenas sets com completed=true', () => {
      sessionStore.exercises = [
        {
          workout_exercise_id: 'we1',
          exercise_id: 'ex1',
          exercise_name: 'Supino Reto',
          sets: 3,
          reps: 10,
          rest_period: 90,
          logs: [
            { session_id: 's1', workout_exercise_id: 'we1', set_number: 1, weight: 80, reps: 10, completed: true },
            { session_id: 's1', workout_exercise_id: 'we1', set_number: 2, weight: 80, reps: 10, completed: true },
            { session_id: 's1', workout_exercise_id: 'we1', set_number: 3, weight: 80, reps: 8, completed: false },
          ],
        },
        {
          workout_exercise_id: 'we2',
          exercise_id: 'ex2',
          exercise_name: 'Agachamento',
          sets: 3,
          reps: 10,
          rest_period: 90,
          logs: [
            { session_id: 's1', workout_exercise_id: 'we2', set_number: 1, weight: 100, reps: 10, completed: true },
          ],
        },
      ]

      expect(sessionStore.completedSets).toBe(3)
    })
  })

  describe('sessionDuration getter', () => {
    it('deve retornar 0 quando startedAt e null', () => {
      expect(sessionStore.sessionDuration).toBe(0)
    })

    it('deve retornar milissegundos desde startedAt', () => {
      const now = new Date()
      sessionStore.startedAt = now.toISOString()

      const duration = sessionStore.sessionDuration
      expect(duration).toBeGreaterThanOrEqual(0)
      expect(duration).toBeLessThan(1000) // menos de 1 segundo apos criar
    })
  })

  describe('activeExercise getter', () => {
    it('deve retornar null quando nao ha exercicios', () => {
      expect(sessionStore.activeExercise).toBeNull()
    })

    it('deve retornar o exercicio no indice ativo', () => {
      sessionStore.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
        { workout_exercise_id: 'we2', exercise_id: 'ex2', exercise_name: 'Agachamento', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]

      expect(sessionStore.activeExercise?.exercise_name).toBe('Supino')

      sessionStore.activeExerciseIndex = 1
      expect(sessionStore.activeExercise?.exercise_name).toBe('Agachamento')
    })
  })

  describe('nextSetNumber getter', () => {
    it('deve retornar 1 quando nao ha logs', () => {
      sessionStore.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]

      expect(sessionStore.nextSetNumber).toBe(1)
    })

    it('deve retornar logs.length + 1', () => {
      sessionStore.exercises = [
        {
          workout_exercise_id: 'we1',
          exercise_id: 'ex1',
          exercise_name: 'Supino',
          sets: 3,
          reps: 10,
          rest_period: 60,
          logs: [
            { session_id: 's1', workout_exercise_id: 'we1', set_number: 1, weight: 80, reps: 10, completed: true },
            { session_id: 's1', workout_exercise_id: 'we1', set_number: 2, weight: 80, reps: 10, completed: true },
          ],
        },
      ]

      expect(sessionStore.nextSetNumber).toBe(3)
    })
  })

  // ==========================================
  // Actions Tests - Timer
  // ==========================================

  describe('startTimer', () => {
    it('deve configurar o timer corretamente', () => {
      sessionStore.startTimer(90)

      expect(sessionStore.timer.remaining).toBe(90)
      expect(sessionStore.timer.isRunning).toBe(true)
      expect(sessionStore.timer.totalDuration).toBe(90)
      expect(sessionStore.timer.startedAt).toBeDefined()
    })
  })

  describe('updateTimer', () => {
    it('deve atualizar remaining', () => {
      sessionStore.startTimer(90)
      sessionStore.updateTimer(60)

      expect(sessionStore.timer.remaining).toBe(60)
      expect(sessionStore.timer.isRunning).toBe(true)
    })

    it('deve parar o timer quando remaining <= 0', () => {
      sessionStore.startTimer(90)
      sessionStore.updateTimer(0)

      expect(sessionStore.timer.isRunning).toBe(false)
    })
  })

  describe('pauseTimer', () => {
    it('deve pausar o timer', () => {
      sessionStore.startTimer(90)
      sessionStore.pauseTimer()

      expect(sessionStore.timer.isRunning).toBe(false)
    })
  })

  describe('resetTimer', () => {
    it('deve resetar o timer completamente', () => {
      sessionStore.startTimer(90)
      sessionStore.resetTimer()

      expect(sessionStore.timer).toEqual({
        remaining: 0,
        isRunning: false,
        totalDuration: 0,
      })
    })
  })

  // ==========================================
  // Actions Tests - Exercises
  // ==========================================

  describe('setActiveExercise', () => {
    it('deve definir o indice do exercicio ativo', () => {
      sessionStore.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
        { workout_exercise_id: 'we2', exercise_id: 'ex2', exercise_name: 'Agachamento', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]

      sessionStore.setActiveExercise(1)
      expect(sessionStore.activeExerciseIndex).toBe(1)
    })

    it('deve ignorar indices invalidos', () => {
      sessionStore.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]

      sessionStore.setActiveExercise(5)
      expect(sessionStore.activeExerciseIndex).toBe(0) // nao mudou
    })
  })

  describe('nextExercise', () => {
    it('deve avancar para o proximo exercicio e retornar true', () => {
      sessionStore.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
        { workout_exercise_id: 'we2', exercise_id: 'ex2', exercise_name: 'Agachamento', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]

      const result = sessionStore.nextExercise()
      expect(result).toBe(true)
      expect(sessionStore.activeExerciseIndex).toBe(1)
    })

    it('deve retornar false quando ja esta no ultimo exercicio', () => {
      sessionStore.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]

      const result = sessionStore.nextExercise()
      expect(result).toBe(false)
    })
  })

  // ==========================================
  // Actions Tests - Reset
  // ==========================================

  describe('resetState', () => {
    it('deve resetar todo o estado da sessao', () => {
      // Popula o estado
      sessionStore.sessionId = 'session-1'
      sessionStore.startedAt = new Date().toISOString()
      sessionStore.workoutId = 'workout-1'
      sessionStore.workout = { id: 'workout-1', name: 'Teste' } as Workout
      sessionStore.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]
      sessionStore.activeExerciseIndex = 1
      sessionStore.startTimer(90)

      sessionStore.resetState()

      expect(sessionStore.sessionId).toBeNull()
      expect(sessionStore.startedAt).toBeNull()
      expect(sessionStore.workoutId).toBeNull()
      expect(sessionStore.workout).toBeNull()
      expect(sessionStore.exercises).toEqual([])
      expect(sessionStore.activeExerciseIndex).toBe(0)
      expect(sessionStore.timer).toEqual({
        remaining: 0,
        isRunning: false,
        totalDuration: 0,
      })
    })
  })

  // ==========================================
  // Actions Tests - Insights
  // ==========================================

  describe('generateInsight', () => {
    it('deve retornar null quando useInsights nao esta disponivel', async () => {
      const result = await sessionStore.generateInsight()
      expect(result).toBeNull()
    })
  })
})

describe('useSessionStore - Checkpoint (com mocks)', () => {
  beforeEach(async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('saveCheckpoint', () => {
    it('deve serializar e salvar no localStorage', async () => {
      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      store.sessionId = 'session-1'
      store.workoutId = 'workout-1'
      store.startedAt = '2026-04-14T10:00:00Z'
      store.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]
      store.activeExerciseIndex = 0

      store.saveCheckpoint()

      expect(localStorageMock.setItem).toHaveBeenCalled()
      const callArgs = localStorageMock.setItem.mock.calls[0]
      expect(callArgs[0]).toBe('fitpulse:session:checkpoint')

      const checkpoint = JSON.parse(callArgs[1])
      expect(checkpoint.sessionId).toBe('session-1')
      expect(checkpoint.workoutId).toBe('workout-1')
      expect(checkpoint.exercises).toHaveLength(1)
      expect(checkpoint.activeExerciseIndex).toBe(0)
    })

    it('nao deve salvar quando sessionId e null', async () => {
      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      store.saveCheckpoint()

      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('restoreCheckpoint', () => {
    it('deve retornar true quando checkpoint valido existe', async () => {
      const checkpoint = {
        sessionId: 'session-1',
        workoutId: 'workout-1',
        exercises: [
          { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
        ],
        activeExerciseIndex: 1,
        startedAt: '2026-04-14T10:00:00Z',
        savedAt: '2026-04-14T11:00:00Z',
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(checkpoint))

      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      const result = store.restoreCheckpoint()

      expect(result).toBe(true)
      expect(store.sessionId).toBe('session-1')
      expect(store.workoutId).toBe('workout-1')
      expect(store.exercises).toHaveLength(1)
      expect(store.activeExerciseIndex).toBe(1)
      expect(store.startedAt).toBe('2026-04-14T10:00:00Z')
    })

    it('deve retornar false quando nao ha checkpoint', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      const result = store.restoreCheckpoint()

      expect(result).toBe(false)
      expect(store.sessionId).toBeNull()
    })

    it('deve retornar false quando checkpoint e JSON invalido', async () => {
      localStorageMock.getItem.mockReturnValue('not-valid-json')

      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      const result = store.restoreCheckpoint()

      expect(result).toBe(false)
    })
  })

  describe('clearCheckpoint', () => {
    it('deve remover o checkpoint do localStorage', async () => {
      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      store.clearCheckpoint()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('fitpulse:session:checkpoint')
    })
  })
})

// ==========================================
// Integration Tests - Async Actions
// ==========================================

describe('useSessionStore - Async Actions (com mocks)', () => {
  const mockUseWorkouts = {
    fetchWorkout: vi.fn(),
    startSession: vi.fn(),
    logSet: vi.fn(),
    completeSession: vi.fn(),
  }

  beforeEach(async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    localStorageMock.clear()
    vi.clearAllMocks()

    // Re-mock do useWorkouts com implementações
    vi.doMock('~/composables/useWorkouts', () => ({
      useWorkouts: vi.fn(() => mockUseWorkouts),
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetModules()
  })

  describe('startSession', () => {
    it('deve inicializar exercises array a partir de workout data', async () => {
      const mockWorkout = { id: 'w1', name: 'Treino A', type: 'strength', difficulty: 'beginner' }
      const mockExercises = [
        { id: 'we1', exercise_id: 'ex1', sets: 3, reps: 10, rest_period: 60, exercises: { name_pt: 'Supino' } },
        { id: 'we2', exercise_id: 'ex2', sets: 4, reps: 8, rest_period: 90, exercises: { name_pt: 'Agachamento' } },
      ]
      const mockSession = { id: 's1', started_at: '2026-04-14T10:00:00Z' }

      mockUseWorkouts.fetchWorkout.mockResolvedValue({ workout: mockWorkout, exercises: mockExercises })
      mockUseWorkouts.startSession.mockResolvedValue({ data: mockSession, error: null })

      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      const result = await store.startSession('w1')

      expect(store.workoutId).toBe('w1')
      expect(store.sessionId).toBe('s1')
      expect(store.startedAt).toBe('2026-04-14T10:00:00Z')
      expect(store.workout).toEqual(mockWorkout)
      expect(store.activeExerciseIndex).toBe(0)
      expect(store.exercises).toHaveLength(2)
      expect(store.exercises[0].exercise_name).toBe('Supino')
      expect(store.exercises[0].sets).toBe(3)
      expect(store.exercises[1].exercise_name).toBe('Agachamento')
      expect(result.session).toBe(mockSession)
    })

    it('deve lançar erro quando fetchWorkout falha', async () => {
      mockUseWorkouts.fetchWorkout.mockResolvedValue(null)

      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      await expect(store.startSession('w1')).rejects.toThrow('Falha ao carregar dados do treino')
    })

    it('deve lançar erro quando startSession falha', async () => {
      mockUseWorkouts.fetchWorkout.mockResolvedValue({
        workout: { id: 'w1', name: 'Treino A' },
        exercises: [],
      })
      mockUseWorkouts.startSession.mockResolvedValue({ data: null, error: 'Erro DB' })

      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      await expect(store.startSession('w1')).rejects.toThrow('Erro DB')
    })
  })

  describe('logSet', () => {
    it('deve atualizar estado local e salvar checkpoint', async () => {
      mockUseWorkouts.logSet.mockResolvedValue({ data: { id: 'log1' }, error: null })

      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      // Popula exercicios
      store.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]
      store.sessionId = 's1'
      store.workoutId = 'w1'
      store.startedAt = '2026-04-14T10:00:00Z'

      const log = {
        session_id: 's1',
        workout_exercise_id: 'we1',
        set_number: 1,
        weight: 80,
        reps: 10,
        completed: true,
      }

      const result = await store.logSet(log)

      expect(store.exercises[0].logs).toHaveLength(1)
      expect(store.exercises[0].logs[0]).toEqual(log)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('deve lancar erro quando exercise nao existe', async () => {
      mockUseWorkouts.logSet.mockResolvedValue({ data: { id: 'log1' }, error: null })

      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      store.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]

      await expect(
        store.logSet({
          session_id: 's1',
          workout_exercise_id: 'we999',
          set_number: 1,
          completed: true,
        })
      ).rejects.toThrow('Exercício não encontrado na sessão')
    })

    it('deve lancar erro quando logSet do Supabase falha', async () => {
      mockUseWorkouts.logSet.mockResolvedValue({ data: null, error: 'Erro no DB' })

      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      store.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]

      await expect(
        store.logSet({
          session_id: 's1',
          workout_exercise_id: 'we1',
          set_number: 1,
          completed: true,
        })
      ).rejects.toThrow('Erro no DB')
    })
  })

  describe('completeSession', () => {
    it('deve chamar completeSession, limpar checkpoint e resetar estado', async () => {
      mockUseWorkouts.completeSession.mockResolvedValue({ data: { id: 's1', status: 'completed' }, error: null })

      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      store.sessionId = 's1'
      store.workoutId = 'w1'
      store.startedAt = '2026-04-14T10:00:00Z'
      store.exercises = [
        { workout_exercise_id: 'we1', exercise_id: 'ex1', exercise_name: 'Supino', sets: 3, reps: 10, rest_period: 60, logs: [] },
      ]

      const result = await store.completeSession(5)

      expect(mockUseWorkouts.completeSession).toHaveBeenCalledWith('s1', 5)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('fitpulse:session:checkpoint')
      expect(store.sessionId).toBeNull()
      expect(store.workout).toBeNull()
      expect(store.exercises).toEqual([])
      expect(result.data.status).toBe('completed')
    })

    it('deve lancar erro quando nao ha sessao ativa', async () => {
      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      await expect(store.completeSession()).rejects.toThrow('Nenhuma sessão ativa')
    })

    it('deve lancar erro quando completeSession falha', async () => {
      mockUseWorkouts.completeSession.mockResolvedValue({ data: null, error: 'Erro ao completar' })

      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      store.sessionId = 's1'

      await expect(store.completeSession()).rejects.toThrow('Erro ao completar')
    })
  })

  describe('generateInsight', () => {
    it('deve retornar null quando useInsights retorna null', async () => {
      const { useSessionStore } = await import('../../stores/session')
      const store = useSessionStore()

      const result = await store.generateInsight()
      expect(result).toBeNull()
    })
  })
})
