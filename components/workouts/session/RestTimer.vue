<template>
  <div class="rest-timer" role="timer" aria-label="Timer de descanso">
    <!-- Progress bar -->
    <div class="progress-bar w-full h-2 bg-dark-700 rounded-full overflow-hidden mb-6">
      <div
        class="progress-fill h-full bg-gradient-primary transition-all duration-1000"
        :style="{ width: `${progress}%` }"
        role="progressbar"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>

    <!-- Countdown display -->
    <div class="text-center mb-8">
      <p class="text-sm text-slate-400 mb-2 uppercase tracking-wide">
        Descanso
      </p>
      <p
        class="text-7xl sm:text-8xl font-bold font-display text-gradient"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ formattedTime }}
      </p>
    </div>

    <!-- Skip button -->
    <div class="flex justify-center">
      <button
        type="button"
        class="btn-primary min-w-[120px] min-h-[44px] px-6 py-3 text-base font-semibold"
        @click="handleSkip"
        aria-label="Pular descanso"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
        Pular Descanso
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useCountdownTimer } from '~/composables/useCountdownTimer'

const props = defineProps<{
  duration: number
}>()

const emit = defineEmits<{
  complete: []
  skip: []
}>()

const {
  remaining,
  isRunning,
  progress,
  start,
  skip: skipTimer,
} = useCountdownTimer({
  onComplete: () => {
    emit('complete')
  },
})

/** Formata o tempo restante em mm:ss */
const formattedTime = computed(() => {
  const minutes = Math.floor(remaining.value / 60)
  const seconds = remaining.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

/** Inicia o timer quando o componente é montado ou duration muda */
const handleStart = () => {
  if (props.duration > 0) {
    start(props.duration)
  }
}

/** Handler para botão de skip */
const handleSkip = () => {
  skipTimer()
  emit('skip')
}

// Inicia timer automaticamente no mount
onMounted(() => {
  handleStart()
})

// Reinicia timer se duration mudar
watch(() => props.duration, (newDuration) => {
  if (newDuration > 0) {
    handleStart()
  }
})
</script>
