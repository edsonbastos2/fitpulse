/**
 * useCountdownTimer - Composable para gerenciar estado de timer de descanso
 *
 * Gerencia countdown com start, pause, resume, skip, progresso e beep de conclusão
 * via Web Audio API. Tick a cada 1 segundo.
 */

import { ref, computed, onUnmounted, type Ref, type ComputedRef } from 'vue'

export interface UseCountdownTimerOptions {
  onComplete?: () => void
  onTick?: (remaining: number) => void
  audioEnabled?: boolean
}

export interface UseCountdownTimerReturn {
  remaining: Ref<number>
  isRunning: Ref<boolean>
  total: Ref<number>
  start: (duration: number) => void
  pause: () => void
  resume: () => void
  skip: () => void
  progress: ComputedRef<number>
}

export const useCountdownTimer = (options: UseCountdownTimerOptions = {}): UseCountdownTimerReturn => {
  const {
    onComplete,
    onTick,
    audioEnabled = true,
  } = options

  const remaining = ref(0)
  const isRunning = ref(false)
  const total = ref(0)
  let intervalId: ReturnType<typeof setInterval> | null = null
  let audioContext: AudioContext | null = null

  /**
   * Toca um beep simples usando Web Audio API
   */
  const playBeep = () => {
    if (!audioEnabled) return

    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch {
      // Fallback silencioso se Web Audio API falhar
    }
  }

  /**
   * Para o intervalo do timer
   */
  const clearTimer = () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  /**
   * Inicia o timer com duração em segundos
   */
  const start = (duration: number) => {
    clearTimer()

    remaining.value = duration
    total.value = duration
    isRunning.value = true

    intervalId = setInterval(() => {
      if (remaining.value > 0) {
        remaining.value--
        onTick?.(remaining.value)
      }

      if (remaining.value <= 0) {
        clearTimer()
        isRunning.value = false
        playBeep()
        onComplete?.()
      }
    }, 1000)
  }

  /**
   * Pausa o timer
   */
  const pause = () => {
    clearTimer()
    isRunning.value = false
  }

  /**
   * Retoma o timer do ponto onde parou
   */
  const resume = () => {
    if (remaining.value <= 0 || isRunning.value) return

    isRunning.value = true

    intervalId = setInterval(() => {
      if (remaining.value > 0) {
        remaining.value--
        onTick?.(remaining.value)
      }

      if (remaining.value <= 0) {
        clearTimer()
        isRunning.value = false
        playBeep()
        onComplete?.()
      }
    }, 1000)
  }

  /**
   * Pula o timer, zerando o tempo
   */
  const skip = () => {
    clearTimer()
    remaining.value = 0
    isRunning.value = false
  }

  /**
   * Progresso do timer em porcentagem (0-100)
   */
  const progress = computed(() => {
    if (total.value === 0) return 0
    return Math.round(((total.value - remaining.value) / total.value) * 100)
  })

  // Cleanup ao desmontar
  onUnmounted(() => {
    clearTimer()
    if (audioContext) {
      audioContext.close()
      audioContext = null
    }
  })

  return {
    remaining,
    isRunning,
    total,
    start,
    pause,
    resume,
    skip,
    progress,
  }
}
