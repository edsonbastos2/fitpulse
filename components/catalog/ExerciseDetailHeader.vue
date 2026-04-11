<template>
  <div class="space-y-4">
    <!-- Back Button -->
    <button
      type="button"
      class="btn-ghost flex items-center gap-2 -ml-2"
      @click="emit('goBack')"
    >
      <ArrowLeftIcon class="w-5 h-5" />
      Voltar ao Catálogo
    </button>

    <!-- Title & Badges -->
    <div>
      <h1 class="text-3xl font-display font-bold text-white mb-3">
        {{ exercise.name_pt }}
      </h1>

      <div class="flex flex-wrap gap-2">
        <!-- Difficulty Badge -->
        <UiBadge :variant="difficultyVariant" size="md">
          {{ difficultyLabel }}
        </UiBadge>

        <!-- Type Badges -->
        <UiBadge v-if="exercise.is_compound" variant="primary" size="md">
          Composto
        </UiBadge>
        <UiBadge v-if="exercise.is_cardio" variant="success" size="md">
          Cardio
        </UiBadge>

        <!-- Primary Muscle Badge -->
        <UiBadge v-if="primaryMuscleNames.length > 0" variant="accent" size="md">
          {{ primaryMuscleNames[0] }}
        </UiBadge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Exercise } from '~/types'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

interface Props {
  exercise: Exercise
  muscleGroupMap?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  muscleGroupMap: () => ({}),
})

const emit = defineEmits<{
  'goBack': []
}>()

const difficultyLabel = computed(() => {
  const labels: Record<string, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' }
  return labels[props.exercise.difficulty] || 'Fácil'
})

const difficultyVariant = computed(() => {
  const variants: Record<string, 'secondary' | 'warning' | 'danger'> = {
    easy: 'secondary',
    medium: 'warning',
    hard: 'danger',
  }
  return variants[props.exercise.difficulty] || 'secondary'
})

const primaryMuscleNames = computed(() => {
  const ids = props.exercise.primary_muscles ?? []
  return ids
    .slice(0, 2)
    .map((id) => props.muscleGroupMap[id] || '')
    .filter(Boolean)
})
</script>
