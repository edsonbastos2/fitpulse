<template>
  <div
    class="flex flex-col items-center justify-center py-20 px-4 text-center"
    role="status"
    aria-live="polite"
  >
    <!-- Icon -->
    <div
      class="w-20 h-20 rounded-full flex items-center justify-center mb-6"
      :class="isError ? 'bg-red-500/10' : 'bg-dark-700/50'"
    >
      <ExclamationTriangleIcon
        v-if="isError"
        class="w-10 h-10 text-red-400"
        aria-hidden="true"
      />
      <MagnifyingGlassIcon
        v-else
        class="w-10 h-10 text-slate-500"
        aria-hidden="true"
      />
    </div>

    <!-- Message -->
    <h3 class="text-xl font-semibold text-white mb-2">
      {{ displayTitle }}
    </h3>

    <!-- Suggestion / Error Details -->
    <p class="text-slate-400 mb-6 max-w-md">
      {{ displayMessage }}
    </p>

    <!-- Optional Actions -->
    <div class="flex flex-col sm:flex-row gap-3">
      <button
        v-if="isError && showRetry"
        type="button"
        class="btn-primary px-6"
        @click="emit('retry')"
      >
        Tentar novamente
      </button>

      <button
        v-if="showClearButton"
        type="button"
        class="btn-ghost px-6"
        @click="emit('clearFilters')"
      >
        {{ isError ? 'Limpar e tentar novamente' : 'Limpar Filtros' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface ErrorInfo {
  title: string
  message: string
}

interface Props {
  message?: string
  suggestion?: string
  showClearButton?: boolean
  /** Error object from fetch — when present, shows error state instead of empty state */
  error?: ErrorInfo | null
  /** Show retry button in error state */
  showRetry?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Nenhum exercício encontrado',
  suggestion: 'Tente ajustar seus filtros ou termos de busca',
  showClearButton: true,
  error: null,
  showRetry: true,
})

defineEmits<{
  'clearFilters': []
  'retry': []
}>()

const isError = computed(() => !!props.error)

const displayTitle = computed(() => {
  return props.error ? props.error.title : props.message
})

const displayMessage = computed(() => {
  return props.error ? props.error.message : props.suggestion
})
</script>
