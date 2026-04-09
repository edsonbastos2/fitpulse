<template>
  <UiCard padding="md" rounded="xl" :hoverable="hoverable">
    <div class="flex items-start gap-4">
      <!-- Icon -->
      <div
        class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        :class="iconBgColor"
      >
        <component :is="iconComponent" class="w-5 h-5" :class="iconColor" aria-hidden="true" />
      </div>

      <!-- Value & Label -->
      <div class="flex-1 min-w-0">
        <p class="stat-value text-2xl font-bold text-white font-display truncate">{{ value }}</p>
        <p class="text-sm text-slate-400 mt-0.5 truncate">{{ label }}</p>
      </div>

      <!-- Trend Indicator -->
      <div v-if="trend" class="flex-shrink-0 flex items-center gap-1">
        <component :is="trendIcon" class="w-4 h-4" :class="trendColor" aria-hidden="true" />
        <span v-if="trend.value !== undefined" class="text-sm font-medium" :class="trendColor">
          {{ trend.value > 0 ? '+' : '' }}{{ trend.value }}
        </span>
      </div>
    </div>

    <!-- Optional trend label -->
    <p v-if="trend?.label" class="text-xs text-slate-500 mt-2">{{ trend.label }}</p>
  </UiCard>
</template>

<script setup lang="ts">
import type { TrendIndicator } from '~/types'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  BoltIcon,
  UserGroupIcon,
  TrophyIcon,
} from '@heroicons/vue/24/outline'

interface Props {
  value: string | number
  label: string
  /** Icon name matching the iconMap below */
  icon?: string
  color?: 'primary' | 'secondary' | 'accent' | 'neutral'
  trend?: TrendIndicator
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'chart',
  color: 'primary',
  trend: undefined,
  hoverable: false,
})

// Icon map for common stat icons
const iconMap: Record<string, unknown> = {
  chart: ChartBarIcon,
  clock: ClockIcon,
  fire: FireIcon,
  bolt: BoltIcon,
  users: UserGroupIcon,
  trophy: TrophyIcon,
}

const iconComponent = computed(() => {
  return iconMap[props.icon] || ChartBarIcon
})

const iconBgColor = computed(() => {
  const colors: Record<string, string> = {
    primary: 'bg-primary-500/20 text-primary-400',
    secondary: 'bg-secondary-500/20 text-secondary-400',
    accent: 'bg-accent-500/20 text-accent-400',
    neutral: 'bg-dark-700 text-slate-400',
  }
  return colors[props.color] || colors.primary
})

const iconColor = computed(() => {
  const colors: Record<string, string> = {
    primary: 'text-primary-400',
    secondary: 'text-secondary-400',
    accent: 'text-accent-400',
    neutral: 'text-slate-400',
  }
  return colors[props.color] || colors.primary
})

const trendIcon = computed(() => {
  if (!props.trend) return MinusIcon
  switch (props.trend.direction) {
    case 'up':
      return ArrowTrendingUpIcon
    case 'down':
      return ArrowTrendingDownIcon
    default:
      return MinusIcon
  }
})

const trendColor = computed(() => {
  if (!props.trend) return 'text-slate-400'
  switch (props.trend.direction) {
    case 'up':
      return 'text-secondary-400'
    case 'down':
      return 'text-accent-400'
    default:
      return 'text-slate-400'
  }
})
</script>
