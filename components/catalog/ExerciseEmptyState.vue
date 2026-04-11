<template>
  <div
    class="flex flex-col items-center justify-center py-20 px-4 text-center"
    role="status"
    aria-live="polite"
  >
    <!-- Icon -->
    <div class="w-20 h-20 rounded-full bg-dark-700/50 flex items-center justify-center mb-6">
      <MagnifyingGlassIcon class="w-10 h-10 text-slate-500" aria-hidden="true" />
    </div>

    <!-- Message -->
    <h3 class="text-xl font-semibold text-white mb-2">
      {{ message }}
    </h3>

    <!-- Suggestion -->
    <p class="text-slate-400 mb-6 max-w-sm">
      {{ suggestion }}
    </p>

    <!-- Optional Action -->
    <button
      v-if="showClearButton"
      type="button"
      class="btn-ghost px-6"
      @click="emit('clearFilters')"
    >
      Limpar Filtros
    </button>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

interface Props {
  message?: string
  suggestion?: string
  showClearButton?: boolean
}

withDefaults(defineProps<Props>(), {
  message: 'Nenhum exercício encontrado',
  suggestion: 'Tente ajustar seus filtros ou termos de busca',
  showClearButton: true,
})

defineEmits<{
  'clearFilters': []
}>()
</script>
