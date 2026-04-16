import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useCountdownTimer } from '~/composables/useCountdownTimer'

describe('useCountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Mock do AudioContext no window
    ;(window as any).AudioContext = vi.fn().mockImplementation(() => ({
      createOscillator: vi.fn(() => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        frequency: { value: 800 },
        type: 'sine',
      })),
      createGain: vi.fn(() => ({
        connect: vi.fn(),
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
      })),
      currentTime: 0,
      close: vi.fn(),
    }))
    ;(window as any).webkitAudioContext = (window as any).AudioContext
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    delete (window as any).AudioContext
    delete (window as any).webkitAudioContext
  })

  describe('start', () => {
    it('deve definir remaining=60, isRunning=true, total=60, progress=0 ao iniciar', () => {
      const { remaining, isRunning, total, progress, start } = useCountdownTimer()

      start(60)

      expect(remaining.value).toBe(60)
      expect(isRunning.value).toBe(true)
      expect(total.value).toBe(60)
      expect(progress.value).toBe(0)
    })

    it('deve definir progress=10 quando start(100) e avancar 10s', async () => {
      const { remaining, progress, start } = useCountdownTimer()

      start(100)
      vi.advanceTimersByTime(10000) // 10 segundos

      expect(remaining.value).toBe(90)
      expect(progress.value).toBe(10)
    })
  })

  describe('tick', () => {
    it('deve decrementar remaining a cada segundo', () => {
      const { remaining, start } = useCountdownTimer()

      start(30)
      vi.advanceTimersByTime(30000) // 30 segundos

      expect(remaining.value).toBe(0)
    })

    it('deve chamar onTick a cada segundo', () => {
      const onTick = vi.fn()
      const { start } = useCountdownTimer({ onTick })

      start(5)
      vi.advanceTimersByTime(5000)

      expect(onTick).toHaveBeenCalledTimes(5)
    })
  })

  describe('pause', () => {
    it('deve parar o countdown e preservar remaining', () => {
      const { remaining, isRunning, start, pause } = useCountdownTimer()

      start(60)
      vi.advanceTimersByTime(30000) // 30 segundos
      pause()

      expect(isRunning.value).toBe(false)
      expect(remaining.value).toBe(30)
    })

    it('deve parar o timer mesmo antes de avancar', () => {
      const { isRunning, start, pause } = useCountdownTimer()

      start(60)
      pause()

      expect(isRunning.value).toBe(false)
    })
  })

  describe('resume', () => {
    it('deve continuar countdown de onde parou', () => {
      const { remaining, isRunning, start, pause, resume } = useCountdownTimer()

      start(60)
      vi.advanceTimersByTime(30000) // 30 segundos
      pause()
      expect(remaining.value).toBe(30)

      resume()
      vi.advanceTimersByTime(15000) // +15 segundos

      expect(remaining.value).toBe(15)
      expect(isRunning.value).toBe(true)
    })

    it('nao deve fazer nada se timer ainda nao foi iniciado', () => {
      const { remaining, isRunning, resume } = useCountdownTimer()

      resume()

      expect(remaining.value).toBe(0)
      expect(isRunning.value).toBe(false)
    })

    it('nao deve fazer nada se timer ja estiver rodando', () => {
      const { isRunning, start, resume } = useCountdownTimer()

      start(60)
      // Nao deve criar intervalo adicional
      resume()

      expect(isRunning.value).toBe(true)
    })
  })

  describe('skip', () => {
    it('deve zerar remaining e parar o timer', () => {
      const { remaining, isRunning, start, skip } = useCountdownTimer()

      start(60)
      vi.advanceTimersByTime(10000)
      skip()

      expect(remaining.value).toBe(0)
      expect(isRunning.value).toBe(false)
    })

    it('deve funcionar mesmo sem timer iniciado', () => {
      const { remaining, isRunning, skip } = useCountdownTimer()

      skip()

      expect(remaining.value).toBe(0)
      expect(isRunning.value).toBe(false)
    })
  })

  describe('onComplete', () => {
    it('deve chamar onComplete quando remaining chega a 0', () => {
      const onComplete = vi.fn()
      const { start } = useCountdownTimer({ onComplete })

      start(5)
      vi.advanceTimersByTime(5000)

      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('nao deve chamar onComplete antes do tempo', () => {
      const onComplete = vi.fn()
      const { start } = useCountdownTimer({ onComplete })

      start(10)
      vi.advanceTimersByTime(5000)

      expect(onComplete).not.toHaveBeenCalled()
    })
  })

  describe('Web Audio API beep', () => {
    it('deve criar oscillator e tocar beep ao completar', () => {
      const { start } = useCountdownTimer({ audioEnabled: true })

      start(3)
      vi.advanceTimersByTime(3000)

      // AudioContext foi instanciado
      expect(window.AudioContext).toHaveBeenCalled()
    })

    it('nao deve tocar beep se audioEnabled=false', () => {
      const { start } = useCountdownTimer({ audioEnabled: false })

      start(3)
      vi.advanceTimersByTime(3000)

      // AudioContext nao foi chamado (audio desabilitado)
      expect(window.AudioContext).not.toHaveBeenCalled()
    })
  })

  describe('progress', () => {
    it('deve retornar 0 quando total=0', () => {
      const { progress } = useCountdownTimer()

      expect(progress.value).toBe(0)
    })

    it('deve calcular progresso corretamente', () => {
      const { progress, start } = useCountdownTimer()

      start(100)
      vi.advanceTimersByTime(50000) // 50 segundos

      expect(progress.value).toBe(50)
    })

    it('deve retornar 100 quando timer completa', () => {
      const { progress, start } = useCountdownTimer()

      start(10)
      vi.advanceTimersByTime(10000)

      expect(progress.value).toBe(100)
    })
  })
})
