<template>
  <div
    v-if="totalExercises > 0"
    class="flex flex-col items-center gap-4 py-8"
  >
    <p class="text-sm text-slate-400">
      Mostrando <span class="text-white font-medium">{{ shown }}</span> de
      <span class="text-white font-medium">{{ totalExercises }}</span> exercícios
    </p>

    <button
      type="button"
      class="btn-ghost px-8"
      :disabled="hasLoadedAll"
      @click="emit('loadMore')"
    >
      {{ hasLoadedAll ? 'Todos os exercícios carregados' : 'Carregar Mais' }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage?: number
  totalExercises?: number
  perPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalExercises: 0,
  perPage: 12,
})

const emit = defineEmits<{
  'loadMore': []
}>()

const shown = computed(() => Math.min(props.currentPage * props.perPage, props.totalExercises))
const hasLoadedAll = computed(() => shown.value >= props.totalExercises)
</script>
