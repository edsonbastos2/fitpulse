/**
 * Session Store - Pinia store para gerenciar estado de sessão de treino em tempo real
 *
 * Gerencia: sessão ativa, lista de exercícios com logs, índice do exercício/set ativo,
 * timer de descanso, checkpoint localStorage, e resumo computado da sessão.
 */

import { defineStore } from 'pinia'
import type {
  Workout,
  WorkoutExercise,
  WorkoutSession,
  SetLogInput,
  ExerciseSessionState,
  TimerState,
  SessionCheckpoint,
} from '~/types'

// ==========================================
// State Interfaces
// ==========================================

export interface SessionState {
  /** ID da sessão ativa no Supabase */
  sessionId: string | null
  /** Timestamp de início da sessão */
  startedAt: string | null
  /** Workout sendo executado */
  workout: Workout | null
  /** Lista de exercícios com logs da sessão */
  exercises: ExerciseSessionState[]
  /** Índice do exercício ativo */
  activeExerciseIndex: number
  /** Estado do timer de descanso */
  timer: TimerState
  /** ID do workout (para checkpoint) */
  workoutId: string | null
}

// ==========================================
// Store Definition
// ==========================================

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    sessionId: null,
    startedAt: null,
    workout: null,
    exercises: [],
    activeExerciseIndex: 0,
    timer: {
      remaining: 0,
      isRunning: false,
      totalDuration: 0,
    },
    workoutId: null,
  }),

  // ==========================================
  // Getters
  // ==========================================

  getters: {
    /** Volume total da sessão: soma de (peso × reps) para todos os sets completados */
    totalVolume: (state): number => {
      let volume = 0
      for (const exercise of state.exercises) {
        for (const log of exercise.logs) {
          if (log.completed && log.weight && log.reps) {
            volume += log.weight * log.reps
          }
        }
      }
      return volume
    },

    /** Número de sets completados */
    completedSets: (state): number => {
      let count = 0
      for (const exercise of state.exercises) {
        for (const log of exercise.logs) {
          if (log.completed) count++
        }
      }
      return count
    },

    /** Duração da sessão em milissegundos desde startedAt */
    sessionDuration: (state): number => {
      if (!state.startedAt) return 0
      const start = new Date(state.startedAt).getTime()
      return Date.now() - start
    },

    /** Duração formatada em mm:ss */
    sessionDurationFormatted: (state): string => {
      const ms = Date.now() - (state.startedAt ? new Date(state.startedAt).getTime() : 0)
      const totalSeconds = Math.floor(ms / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    },

    /** Exercício ativo */
    activeExercise: (state): ExerciseSessionState | null => {
      return state.exercises[state.activeExerciseIndex] || null
    },

    /** Próximo set número para o exercício ativo */
    nextSetNumber: (state): number => {
      const exercise = state.exercises[state.activeExerciseIndex]
      if (!exercise) return 1
      return exercise.logs.length + 1
    },
  },

  // ==========================================
  // Actions
  // ==========================================

  actions: {
    /**
     * Inicia uma sessão de treino:
     * 1. Carrega dados do workout via useWorkouts.fetchWorkout()
     * 2. Cria sessão no DB via useWorkouts.startSession()
     * 3. Inicializa o estado dos exercícios
     */
    async startSession(workoutId: string) {
      const { useWorkouts } = await import('~/composables/useWorkouts')
      const workouts = useWorkouts()

      // Carrega dados do workout
      const workoutData = await workouts.fetchWorkout(workoutId)
      if (!workoutData || !workoutData.workout) {
        throw new Error('Falha ao carregar dados do treino')
      }

      const workout = workoutData.workout as Workout
      const exercises = (workoutData.exercises as WorkoutExercise[]) || []

      // Cria sessão no DB
      const sessionResult = await workouts.startSession(workoutId) as { error?: string; data?: WorkoutSession } | null
      if (!sessionResult || sessionResult.error || !sessionResult.data) {
        throw new Error(sessionResult?.error || 'Falha ao iniciar sessão')
      }

      const session = sessionResult.data as WorkoutSession

      // Inicializa estado
      this.workoutId = workoutId
      this.sessionId = session.id
      this.startedAt = session.started_at || new Date().toISOString()
      this.workout = workout
      this.activeExerciseIndex = 0

      // Inicializa exercícios com estado vazio de logs
      this.exercises = exercises.map((ex: WorkoutExercise) => {
        const exerciseData = ex as WorkoutExercise & { exercises?: { name?: string; name_pt?: string } }
        return {
          workout_exercise_id: ex.id || '',
          exercise_id: ex.exercise_id || '',
          exercise_name: exerciseData.exercises?.name || exerciseData.exercises?.name_pt || 'Exercício',
          sets: ex.sets || 3,
          reps: ex.reps,
          duration: ex.duration,
          rest_period: ex.rest_period || 60,
          logs: [],
        }
      })

      // Limpa checkpoint anterior
      this.clearCheckpoint()

      return { session, workout, exercises: this.exercises }
    },

    /**
     * Restaura sessão de um checkpoint salvo no localStorage
     * Retorna true se checkpoint foi encontrado e restaurado
     */
    restoreCheckpoint(): boolean {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false

      const stored = localStorage.getItem('fitpulse:session:checkpoint')
      if (!stored) return false

      try {
        const checkpoint: SessionCheckpoint = JSON.parse(stored)

        this.sessionId = checkpoint.sessionId
        this.workoutId = checkpoint.workoutId
        this.startedAt = checkpoint.startedAt
        this.exercises = checkpoint.exercises
        this.activeExerciseIndex = checkpoint.activeExerciseIndex

        return true
      } catch {
        return false
      }
    },

    /**
     * Salva estado atual no localStorage para recuperação
     */
    saveCheckpoint() {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return

      if (!this.sessionId || !this.workoutId || !this.startedAt) return

      const checkpoint: SessionCheckpoint = {
        sessionId: this.sessionId,
        workoutId: this.workoutId,
        exercises: this.exercises,
        activeExerciseIndex: this.activeExerciseIndex,
        startedAt: this.startedAt,
        savedAt: new Date().toISOString(),
      }

      try {
        localStorage.setItem('fitpulse:session:checkpoint', JSON.stringify(checkpoint))
      } catch {
        // Ignora erros de localStorage (ex: quota excedida)
      }
    },

    /**
     * Limpa o checkpoint do localStorage
     */
    clearCheckpoint() {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return

      try {
        localStorage.removeItem('fitpulse:session:checkpoint')
      } catch {
        // Ignora
      }
    },

    /**
     * Registra um set:
     * 1. Salva no Supabase via useWorkouts.logSet()
     * 2. Atualiza estado local
     * 3. Salva checkpoint
     */
    async logSet(log: SetLogInput) {
      const { useWorkouts } = await import('~/composables/useWorkouts')
      const workouts = useWorkouts()

      // Salva no Supabase
      const result = await workouts.logSet(log)
      if (result?.error) {
        throw new Error(result.error)
      }

      // Atualiza estado local
      const exerciseIndex = this.exercises.findIndex(
        (ex) => ex.workout_exercise_id === log.workout_exercise_id
      )
      if (exerciseIndex === -1) {
        throw new Error('Exercício não encontrado na sessão')
      }

      this.exercises[exerciseIndex].logs.push(log)

      // Salva checkpoint
      this.saveCheckpoint()

      return result
    },

    /**
     * Completa a sessão:
     * 1. Atualiza status no DB via useWorkouts.completeSession()
     * 2. Limpa checkpoint
     * 3. Reseta estado do store
     */
    async completeSession(rating?: number) {
      const { useWorkouts } = await import('~/composables/useWorkouts')
      const workouts = useWorkouts()

      if (!this.sessionId) {
        throw new Error('Nenhuma sessão ativa')
      }

      const result = await workouts.completeSession(this.sessionId, rating)
      if (result?.error) {
        throw new Error(result.error)
      }

      // Limpa checkpoint e reseta estado
      this.clearCheckpoint()
      this.resetState()

      return result
    },

    /**
     * Inicia o timer de descanso
     */
    startTimer(durationSeconds: number) {
      this.timer = {
        remaining: durationSeconds,
        isRunning: true,
        totalDuration: durationSeconds,
        startedAt: new Date().toISOString(),
      }
    },

    /**
     * Atualiza o tempo restante do timer
     */
    updateTimer(remaining: number) {
      this.timer.remaining = remaining
      if (remaining <= 0) {
        this.timer.isRunning = false
      }
    },

    /**
     * Pausa o timer
     */
    pauseTimer() {
      this.timer.isRunning = false
    },

    /**
     * Reseta o timer
     */
    resetTimer() {
      this.timer = {
        remaining: 0,
        isRunning: false,
        totalDuration: 0,
      }
    },

    /**
     * Define o exercício ativa
     */
    setActiveExercise(index: number) {
      if (index >= 0 && index < this.exercises.length) {
        this.activeExerciseIndex = index
      }
    },

    /**
     * Avança para o próximo exercício
     */
    nextExercise(): boolean {
      if (this.activeExerciseIndex < this.exercises.length - 1) {
        this.activeExerciseIndex++
        return true
      }
      return false
    },

    /**
     * Gera insight baseado na sessão atual
     * Retorna null até que o módulo de insights seja implementado
     */
    async generateInsight(): Promise<{ title: string; message: string } | null> {
      // TODO: Implementar quando o módulo de insights estiver disponível
      return null
    },

    /**
     * Reseta todo o estado da sessão
     */
    resetState() {
      this.sessionId = null
      this.startedAt = null
      this.workout = null
      this.exercises = []
      this.activeExerciseIndex = 0
      this.timer = {
        remaining: 0,
        isRunning: false,
        totalDuration: 0,
      }
      this.workoutId = null
    },
  },
})
