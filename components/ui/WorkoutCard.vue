<template>
  <UiCard
    :hoverable="hoverable"
    padding="md"
    rounded="xl"
    class="workout-card cursor-pointer"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between gap-4">
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Header -->
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-base font-semibold text-white truncate">{{ title }}</h3>
          <UiBadge :variant="statusVariant" size="sm">
            {{ statusLabel }}
          </UiBadge>
        </div>

        <!-- Description -->
        <p v-if="description" class="text-sm text-slate-400 mt-1 line-clamp-2">
          {{ description }}
        </p>

        <!-- Meta Info -->
        <div class="flex items-center gap-4 mt-3 text-sm text-slate-400">
          <div class="flex items-center gap-1.5">
            <QueueListIcon class="w-4 h-4" />
            <span>{{ exerciseCount }} exercícios</span>
          </div>
          <div class="flex items-center gap-1.5">
            <ClockIcon class="w-4 h-4" />
            <span>{{ estimatedDuration }} min</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="progress !== undefined" class="mt-4">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: Math.min(Math.max(progress, 0), 100) + '%' }"
            />
          </div>
          <p class="text-xs text-slate-500 mt-1">{{ Math.round(progress) }}% concluído</p>
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
import { QueueListIcon, ClockIcon } from '@heroicons/vue/24/outline'

interface Props {
  title: string
  description?: string
  exerciseCount: number
  estimatedDuration: number
  status: 'planned' | 'in_progress' | 'completed' | 'scheduled'
  progress?: number
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  progress: undefined,
  hoverable: true,
})

defineEmits<{
  click: []
}>()

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    planned: 'Planejado',
    in_progress: 'Em progresso',
    completed: 'Concluído',
    scheduled: 'Agendado',
  }
  return labels[props.status] || props.status
})

const statusVariant = computed(() => {
  const variants: Record<string, 'primary' | 'accent' | 'secondary' | 'default'> = {
    planned: 'primary',
    in_progress: 'accent',
    completed: 'secondary',
    scheduled: 'default',
  }
  return variants[props.status] || 'default'
})
</script>
