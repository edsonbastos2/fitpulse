<template>
  <NuxtLink
    :to="`/workouts/${workout.id}`"
    class="card card-hover p-5 block group"
  >
    <div class="flex items-start justify-between gap-4">
      <!-- Left: Info -->
      <div class="flex-1 min-w-0">
        <!-- Name + Badges -->
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <h3 class="text-base font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
            {{ workout.name }}
          </h3>
          <UiBadge v-if="workout.is_template" variant="gradient" size="sm">
            Template
          </UiBadge>
          <UiBadge :variant="typeBadgeVariant" size="sm">
            {{ typeLabel }}
          </UiBadge>
          <UiBadge variant="secondary" size="sm">
            {{ difficultyLabel }}
          </UiBadge>
        </div>

        <!-- Meta info -->
        <div class="flex items-center gap-4 text-sm text-slate-400">
          <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {{ exerciseCount }} exercícios
          </span>
          <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ workout.estimated_duration }} min
          </span>
          <span v-if="lastUsedLabel" class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ lastUsedLabel }}
          </span>
        </div>
      </div>

      <!-- Right: Arrow -->
      <div class="text-slate-500 group-hover:text-primary-400 transition-colors flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Workout } from '~/types'

interface Props {
  workout: Workout & { exerciseCount?: number; lastUsedAt?: string }
}

const props = defineProps<Props>()

// ==========================================
// Type label and badge variant
// ==========================================

const typeLabel = computed(() => {
  const labels: Record<string, string> = {
    strength: 'Força',
    cardio: 'Cardio',
    hiit: 'HIIT',
    flexibility: 'Flexibilidade',
    mixed: 'Misto',
  }
  return labels[props.workout.type] || props.workout.type
})

const typeBadgeVariant = computed(() => {
  const variants: Record<string, 'primary' | 'secondary' | 'accent' | 'default'> = {
    strength: 'primary',
    cardio: 'secondary',
    hiit: 'accent',
    flexibility: 'default',
    mixed: 'default',
  }
  return variants[props.workout.type] || 'default'
})

// ==========================================
// Difficulty label
// ==========================================

const difficultyLabel = computed(() => {
  const labels: Record<string, string> = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
  }
  return labels[props.workout.difficulty] || props.workout.difficulty
})

// ==========================================
// Exercise count
// ==========================================

const exerciseCount = computed(() => {
  return (props.workout as any).exerciseCount ?? 0
})

// ==========================================
// Last used label
// ==========================================

const lastUsedLabel = computed(() => {
  const lastUsed = (props.workout as any).lastUsedAt
  if (!lastUsed) return null

  const date = new Date(lastUsed)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias atrás`
  return date.toLocaleDateString('pt-BR')
})
</script>
