<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- Equipment -->
    <div class="card p-4">
      <div class="flex items-center gap-2 mb-2">
        <WrenchScrewdriverIcon class="w-5 h-5 text-slate-500" />
        <span class="text-sm text-slate-400">Equipamento</span>
      </div>
      <p class="text-white font-medium">
        {{ equipmentName || 'Nenhum' }}
      </p>
    </div>

    <!-- Calories -->
    <div class="card p-4">
      <div class="flex items-center gap-2 mb-2">
        <FireIcon class="w-5 h-5 text-slate-500" />
        <span class="text-sm text-slate-400">Calorias</span>
      </div>
      <p class="text-white font-medium">
        {{ exercise.calories_per_minute ? `${exercise.calories_per_minute} kcal/min` : 'N/A' }}
      </p>
    </div>

    <!-- Difficulty -->
    <div class="card p-4">
      <div class="flex items-center gap-2 mb-2">
        <SparklesIcon class="w-5 h-5 text-slate-500" />
        <span class="text-sm text-slate-400">Dificuldade</span>
      </div>
      <p class="text-white font-medium">
        {{ difficultyLabel }}
      </p>
    </div>

    <!-- Type -->
    <div class="card p-4">
      <div class="flex items-center gap-2 mb-2">
        <BoltIcon class="w-5 h-5 text-slate-500" />
        <span class="text-sm text-slate-400">Tipo</span>
      </div>
      <p class="text-white font-medium">
        {{ typeLabel }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Exercise } from '~/types'
import { WrenchScrewdriverIcon, FireIcon, SparklesIcon, BoltIcon } from '@heroicons/vue/24/outline'

interface Props {
  exercise: Exercise
  equipmentMap?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  equipmentMap: () => ({}),
})

const equipmentName = computed(() => {
  if (!props.exercise.equipment_id) return undefined
  return props.equipmentMap[props.exercise.equipment_id] || undefined
})

const difficultyLabel = computed(() => {
  const labels: Record<string, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' }
  return labels[props.exercise.difficulty] || 'Fácil'
})

const typeLabel = computed(() => {
  if (props.exercise.is_compound) return 'Composto'
  if (props.exercise.is_cardio) return 'Cardio'
  return 'Isolado'
})
</script>
