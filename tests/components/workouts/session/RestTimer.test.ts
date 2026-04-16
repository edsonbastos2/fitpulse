import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { reactive, computed } from 'vue'
import RestTimer from '../../../../components/workouts/session/RestTimer.vue'

const mockState = reactive({
  remaining: 60,
  isRunning: true,
  total: 60,
  progress: 0,
})

vi.mock('~/composables/useCountdownTimer', () => {
  return {
    useCountdownTimer: vi.fn((options: any) => {
      // Se remaining for 0, chama onComplete imediatamente
      if (mockState.remaining === 0 && options?.onComplete) {
        setTimeout(() => options.onComplete(), 0)
      }

      return {
        remaining: computed(() => mockState.remaining),
        isRunning: computed(() => mockState.isRunning),
        total: computed(() => mockState.total),
        progress: computed(() => mockState.progress),
        start: vi.fn((duration: number) => {
          mockState.remaining = duration
          mockState.total = duration
          mockState.isRunning = true
          mockState.progress = 0
        }),
        pause: vi.fn(() => { mockState.isRunning = false }),
        resume: vi.fn(() => { mockState.isRunning = true }),
        skip: vi.fn(() => { mockState.remaining = 0; mockState.isRunning = false }),
      }
    }),
  }
})

describe('RestTimer.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    // Reset mock state
    mockState.remaining = 60
    mockState.isRunning = true
    mockState.total = 60
    mockState.progress = 0
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('renderização', () => {
    it('deve renderizar countdown em formato mm:ss', () => {
      mockState.remaining = 125 // 2:05
      const wrapper = mount(RestTimer, {
        props: { duration: 125 },
      })

      const timeDisplay = wrapper.find('[aria-live="polite"]')
      expect(timeDisplay.text()).toBe('02:05')
    })

    it('deve renderizar com duration=0 como 00:00', () => {
      mockState.remaining = 0
      const wrapper = mount(RestTimer, {
        props: { duration: 0 },
      })

      const timeDisplay = wrapper.find('[aria-live="polite"]')
      expect(timeDisplay.text()).toBe('00:00')
    })

    it('deve renderizar label "Descanso"', () => {
      const wrapper = mount(RestTimer, {
        props: { duration: 60 },
      })

      expect(wrapper.text()).toContain('Descanso')
    })
  })

  describe('progress bar', () => {
    it('deve renderizar progress bar com aria attributes', () => {
      const wrapper = mount(RestTimer, {
        props: { duration: 60 },
      })

      const progressBar = wrapper.find('[role="progressbar"]')
      expect(progressBar.exists()).toBe(true)
      expect(progressBar.attributes('aria-valuemin')).toBe('0')
      expect(progressBar.attributes('aria-valuemax')).toBe('100')
    })
  })

  describe('skip button', () => {
    it('deve renderizar botão de skip com tamanho mínimo 44x44px', () => {
      const wrapper = mount(RestTimer, {
        props: { duration: 60 },
      })

      const skipButton = wrapper.find('button[aria-label="Pular descanso"]')
      expect(skipButton.exists()).toBe(true)
      expect(skipButton.classes()).toContain('min-h-[44px]')
    })

    it('deve emitir "skip" quando botão de skip é clicado', async () => {
      const wrapper = mount(RestTimer, {
        props: { duration: 60 },
      })

      const skipButton = wrapper.find('button[aria-label="Pular descanso"]')
      await skipButton.trigger('click')

      expect(wrapper.emitted('skip')).toHaveLength(1)
    })
  })

  describe('evento complete', () => {
    it('deve emitir "complete" quando timer chega a zero', async () => {
      // Configura remaining para 0 para simular timer completado
      mockState.remaining = 0
      mockState.isRunning = false

      const wrapper = mount(RestTimer, {
        props: { duration: 60 },
      })

      // Aguarda o setTimeout do mock executar o onComplete
      await vi.advanceTimersByTimeAsync(100)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('complete')).toHaveLength(1)
    })
  })

  describe('acessibilidade', () => {
    it('deve ter role="timer" no elemento principal', () => {
      const wrapper = mount(RestTimer, {
        props: { duration: 60 },
      })

      const timerElement = wrapper.find('[role="timer"]')
      expect(timerElement.exists()).toBe(true)
    })

    it('deve ter aria-label no elemento principal', () => {
      const wrapper = mount(RestTimer, {
        props: { duration: 60 },
      })

      const timerElement = wrapper.find('[role="timer"]')
      expect(timerElement.attributes('aria-label')).toBe('Timer de descanso')
    })
  })
})
