<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-white">
        Instruções
      </h2>
      <span v-if="isEnglishFallback" class="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
        Disponível apenas em inglês
      </span>
    </div>

    <ol class="space-y-4">
      <li
        v-for="(step, index) in instructionsList"
        :key="index"
        class="flex gap-4 text-slate-300"
      >
        <span class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-sm">
          {{ index + 1 }}
        </span>
        <p class="pt-1.5 leading-relaxed">
          {{ step }}
        </p>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import type { Exercise } from '~/types'

interface Props {
  exercise: Exercise
}

const props = defineProps<Props>()

// Determine instruction source: prefer pt-BR, fallback to English
const instructionsList = computed(() => {
  if (props.exercise.instructions_pt && props.exercise.instructions_pt.length > 0) {
    return props.exercise.instructions_pt
  }
  return props.exercise.instructions || []
})

const isEnglishFallback = computed(() => {
  return !props.exercise.instructions_pt?.length && props.exercise.instructions?.length > 0
})
</script>
