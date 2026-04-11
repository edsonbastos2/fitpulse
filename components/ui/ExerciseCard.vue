<template>
  <NuxtLink
    :to="`/exercises/${effectiveExercise.id}`"
    class="block exercise-card-link"
  >
    <UiCard
      :hoverable="hoverable"
      padding="md"
      rounded="xl"
      class="exercise-card card-hover"
    >
      <div class="flex items-start gap-4">
        <!-- Muscle Icon -->
        <div
          class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          :class="difficultyColor"
        >
          <FireIcon v-if="difficulty === 'hard'" class="w-5 h-5" />
          <BoltIcon v-else-if="difficulty === 'medium'" class="w-5 h-5" />
          <SparklesIcon v-else class="w-5 h-5" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-semibold text-white truncate">
            {{ effectiveExercise.name_pt }}
          </h3>

          <!-- Equipment -->
          <p v-if="equipmentName" class="text-sm text-slate-400 mt-0.5">
            {{ equipmentName }}
          </p>

          <!-- Badges Row -->
          <div class="flex items-center gap-2 mt-2 flex-wrap">
            <!-- Difficulty Badge -->
            <UiBadge :variant="difficultyVariant" size="sm">
              {{ difficultyLabel }}
            </UiBadge>

            <!-- Compound Badge -->
            <UiBadge v-if="effectiveExercise.is_compound" variant="primary" size="sm">
              Composto
            </UiBadge>

            <!-- Cardio Badge -->
            <UiBadge v-if="effectiveExercise.is_cardio" variant="success" size="sm">
              Cardio
            </UiBadge>

            <!-- Muscle Group Badges (max 2) -->
            <UiBadge
              v-for="muscle in displayMuscles"
              :key="muscle"
              variant="default"
              size="sm"
              outline
            >
              {{ muscle }}
            </UiBadge>
          </div>
        </div>

        <!-- Actions Slot -->
        <div v-if="$slots.actions" class="flex-shrink-0">
          <slot name="actions" />
        </div>
      </div>
    </UiCard>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Exercise } from '~/types'
import { FireIcon, BoltIcon, SparklesIcon } from '@heroicons/vue/24/outline'

interface Props {
  /** Full exercise object (preferred) */
  exercise?: Exercise
  /** Legacy props for backward compatibility */
  name?: string
  muscleGroup?: string
  muscleGroupNames?: string[]
  equipment?: string
  equipmentName?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  exercise: undefined,
  name: '',
  muscleGroup: undefined,
  muscleGroupNames: () => [],
  equipment: undefined,
  equipmentName: undefined,
  difficulty: 'easy',
  hoverable: true,
})

// Use exercise object if provided, fallback to legacy props
const effectiveExercise = computed<Partial<Exercise>>(() => {
  if (props.exercise) {
    return props.exercise
  }
  // Legacy fallback
  return {
    id: '',
    name_pt: props.name,
    difficulty: props.difficulty,
    is_compound: false,
    is_cardio: false,
  }
})

const difficulty = computed(() => {
  return props.exercise?.difficulty ?? props.difficulty ?? 'easy'
})

const equipmentName = computed(() => {
  return props.equipmentName ?? props.equipment ?? undefined
})

const displayMuscles = computed(() => {
  const muscles = props.exercise
    ? props.muscleGroupNames
    : props.muscleGroupNames.length > 0
      ? props.muscleGroupNames
      : props.muscleGroup
        ? [props.muscleGroup]
        : []
  return muscles.slice(0, 2)
})

const difficultyLabel = computed(() => {
  const labels: Record<string, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' }
  return labels[difficulty.value] || 'Fácil'
})

const difficultyVariant = computed(() => {
  const variants: Record<string, 'secondary' | 'warning' | 'danger'> = {
    easy: 'secondary',
    medium: 'warning',
    hard: 'danger',
  }
  return variants[difficulty.value] || 'secondary'
})

const difficultyColor = computed(() => {
  const colors: Record<string, string> = {
    easy: 'bg-secondary-500/20 text-secondary-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    hard: 'bg-accent-500/20 text-accent-400',
  }
  return colors[difficulty.value] || colors.easy
})
</script>

<style scoped>
.exercise-card-link {
  text-decoration: none;
  color: inherit;
}

.exercise-card-link:hover {
  text-decoration: none;
}
</style>
