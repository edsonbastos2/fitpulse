<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-busy="loading"
    :class="buttonClasses"
    class="inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    @click="$emit('click', $event)"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin"
      :class="iconSize"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Icon Content -->
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  /** Accessibility label — required for icon-only buttons */
  ariaLabel: string
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  /** Use square shape instead of circular */
  square?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  square: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const classes: string[] = []

  // Shape
  if (props.square) {
    classes.push('rounded-xl')
  } else {
    classes.push('rounded-full')
  }

  // Variant
  switch (props.variant) {
    case 'primary':
      classes.push(
        'bg-gradient-primary text-white',
        'hover:shadow-glow hover:scale-105 active:scale-95',
        'focus:ring-primary-500'
      )
      break
    case 'ghost':
      classes.push(
        'bg-dark-700/50 text-slate-300 border border-dark-600',
        'hover:bg-dark-600 hover:border-dark-500 hover:text-white',
        'focus:ring-primary-500'
      )
      break
  }

  // Size
  switch (props.size) {
    case 'sm':
      classes.push('w-7 h-7')
      break
    case 'md':
      classes.push('w-9 h-9')
      break
    case 'lg':
      classes.push('w-11 h-11')
      break
  }

  return classes.join(' ')
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-3.5 h-3.5'
    case 'md':
      return 'w-4 h-4'
    case 'lg':
      return 'w-5 h-5'
    default:
      return 'w-4 h-4'
  }
})
</script>
