<template>
  <UiCard :hoverable="hoverable" padding="md" rounded="xl" class="exercise-card">
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
        <h3 class="text-base font-semibold text-white truncate">{{ name }}</h3>
        <p v-if="muscleGroup" class="text-sm text-slate-400 mt-0.5">{{ muscleGroup }}</p>
        <div class="flex items-center gap-2 mt-2 flex-wrap">
          <UiBadge v-if="equipment" variant="secondary" size="sm">
            <WrenchScrewdriverIcon class="w-3 h-3 mr-1" />
            {{ equipment }}
          </UiBadge>
          <UiBadge :variant="difficultyVariant" size="sm">
            {{ difficultyLabel }}
          </UiBadge>
        </div>
      </div>

      <!-- Actions Slot -->
      <div v-if="$slots.actions" class="flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { FireIcon, BoltIcon, SparklesIcon, WrenchScrewdriverIcon } from '@heroicons/vue/24/outline'

interface Props {
  name: string
  muscleGroup?: string
  equipment?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  muscleGroup: undefined,
  equipment: undefined,
  difficulty: 'easy',
  hoverable: false,
})

const difficultyLabel = computed(() => {
  const labels: Record<string, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' }
  return labels[props.difficulty] || 'Fácil'
})

const difficultyVariant = computed(() => {
  const variants: Record<string, 'secondary' | 'warning' | 'danger'> = {
    easy: 'secondary',
    medium: 'warning',
    hard: 'danger',
  }
  return variants[props.difficulty] || 'secondary'
})

const difficultyColor = computed(() => {
  const colors: Record<string, string> = {
    easy: 'bg-secondary-500/20 text-secondary-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    hard: 'bg-accent-500/20 text-accent-400',
  }
  return colors[props.difficulty] || colors.easy
})
</script>
