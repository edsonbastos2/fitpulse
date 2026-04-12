<template>
  <NuxtLink
    :to="`/exercises/${exercise.id}`"
    class="block exercise-card-compact-link"
    tabindex="0"
    :aria-label="`Ver detalhes de ${exercise.name_pt}`"
    role="listitem"
  >
    <div
      class="flex items-center gap-3 p-3 h-24 card card-hover exercise-card-compact"
    >
      <!-- Thumbnail/Icon -->
      <div
        class="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
        :class="difficultyColor"
      >
        <component :is="exerciseIcon" class="w-7 h-7" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Exercise Name -->
        <h3 class="text-sm font-semibold text-white line-clamp-2 leading-tight">
          {{ exercise.name_pt }}
        </h3>

        <!-- Badges Row -->
        <div class="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <!-- Difficulty Badge -->
          <UiBadge :variant="difficultyVariant" size="sm">
            {{ difficultyLabel }}
          </UiBadge>

          <!-- Muscle Group Badge (max 1 visible) -->
          <UiBadge
            v-if="muscleGroupNames.length > 0"
            variant="default"
            size="sm"
            outline
          >
            {{ muscleGroupNames[0] }}
          </UiBadge>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Exercise } from '~/types'
import {
  Dumbbell,
  HeartPulse,
  Target,
  Zap,
  Flame,
  Activity,
  BicepsFlexed,
  Footprints,
} from 'lucide-vue-next'

interface Props {
  exercise: Exercise
  muscleGroupNames?: string[]
  equipmentName?: string
}

const props = withDefaults(defineProps<Props>(), {
  muscleGroupNames: () => [],
  equipmentName: undefined,
})

/**
 * Map muscle group names to Lucide icons
 * Priority: muscle group > exercise type > default
 */
const exerciseIcon = computed(() => {
  // 1. Check primary muscle group first
  const primaryMuscle = props.muscleGroupNames[0]?.toLowerCase() || ''
  
  if (primaryMuscle.includes('peito') || primaryMuscle.includes('chest')) {
    return Target
  }
  if (primaryMuscle.includes('costa') || primaryMuscle.includes('back') || primaryMuscle.includes('dorsal')) {
    return BicepsFlexed
  }
  if (primaryMuscle.includes('bíceps') || primaryMuscle.includes('bicep') || primaryMuscle.includes('braço')) {
    return BicepsFlexed
  }
  if (primaryMuscle.includes('tríceps') || primaryMuscle.includes('tricep')) {
    return BicepsFlexed
  }
  if (primaryMuscle.includes('ombro') || primaryMuscle.includes('shoulder') || primaryMuscle.includes('deltóide')) {
    return Target
  }
  if (primaryMuscle.includes('perna') || primaryMuscle.includes('leg') || primaryMuscle.includes('quadríceps') || primaryMuscle.includes('femural')) {
    return Footprints
  }
  if (primaryMuscle.includes('glúteo') || primaryMuscle.includes('glute')) {
    return Footprints
  }
  if (primaryMuscle.includes('abdômen') || primaryMuscle.includes('abs') || primaryMuscle.includes('core')) {
    return Target
  }
  if (primaryMuscle.includes('panturrilha') || primaryMuscle.includes('calf')) {
    return Footprints
  }
  if (primaryMuscle.includes('antebraço') || primaryMuscle.includes('forearm')) {
    return BicepsFlexed
  }
  if (primaryMuscle.includes('trapézio') || primaryMuscle.includes('trap')) {
    return BicepsFlexed
  }

  // 2. Check exercise type
  if (props.exercise.is_cardio) {
    return props.exercise.difficulty === 'hard' ? Flame : HeartPulse
  }
  if (props.exercise.is_compound) {
    return props.exercise.difficulty === 'hard' ? Flame : Dumbbell
  }
  
  // 3. Fallback based on difficulty
  if (props.exercise.difficulty === 'hard') {
    return Flame
  }
  if (props.exercise.difficulty === 'medium') {
    return Zap
  }
  
  // Default
  return Activity
})

const difficultyLabel = computed(() => {
  const labels: Record<string, string> = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
  }
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

const difficultyColor = computed(() => {
  const colors: Record<string, string> = {
    easy: 'bg-secondary-500/20 text-secondary-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    hard: 'bg-accent-500/20 text-accent-400',
  }
  return colors[props.exercise.difficulty] || colors.easy
})
</script>

<style scoped>
.exercise-card-compact-link {
  text-decoration: none;
  color: inherit;
}

.exercise-card-compact-link:hover {
  text-decoration: none;
}

.exercise-card-compact-link:focus-visible {
  @apply ring-2 ring-primary-500 ring-offset-2 ring-offset-dark-900 rounded-xl;
}

.exercise-card-compact {
  @apply transition-all duration-200;
}
</style>
