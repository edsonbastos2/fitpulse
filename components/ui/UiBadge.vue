<template>
  <span
    :class="badgeClasses"
    class="inline-flex items-center gap-1.5 font-medium rounded-full"
    :role="role"
    :aria-label="ariaLabel"
  >
    <slot name="icon" />
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  pill?: boolean
  outline?: boolean
  /** Semantic role: 'status' for informative, 'img' for icon-like, null for generic */
  role?: string | null
  /** Accessible label for screen readers */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'sm',
  pill: false,
  outline: false,
  role: null,
  ariaLabel: undefined,
})

const badgeClasses = computed(() => {
  const classes: string[] = []

  // Base styles
  if (props.outline) {
    classes.push('border bg-transparent')
  } else {
    classes.push('bg-opacity-20')
  }

  // Variant
  switch (props.variant) {
    case 'primary':
      classes.push(
        props.outline
          ? 'border-primary-500 text-primary-400'
          : 'bg-primary-500/20 text-primary-400'
      )
      break
    case 'secondary':
      classes.push(
        props.outline
          ? 'border-secondary-500 text-secondary-400'
          : 'bg-secondary-500/20 text-secondary-400'
      )
      break
    case 'success':
      classes.push(
        props.outline
          ? 'border-green-500 text-green-400'
          : 'bg-green-500/20 text-green-400'
      )
      break
    case 'warning':
      classes.push(
        props.outline
          ? 'border-yellow-500 text-yellow-400'
          : 'bg-yellow-500/20 text-yellow-400'
      )
      break
    case 'danger':
      classes.push(
        props.outline
          ? 'border-red-500 text-red-400'
          : 'bg-red-500/20 text-red-400'
      )
      break
    case 'gradient':
      classes.push('bg-gradient-primary text-white')
      break
    default:
      classes.push(
        props.outline
          ? 'border-dark-500 text-slate-400'
          : 'bg-dark-600 text-slate-300'
      )
  }

  // Size
  switch (props.size) {
    case 'sm':
      classes.push('px-2 py-0.5 text-xs')
      break
    case 'lg':
      classes.push('px-4 py-1.5 text-sm')
      break
  }

  // Pill
  if (props.pill || props.size === 'sm') {
    classes.push('rounded-full')
  } else {
    classes.push('rounded-lg')
  }

  return classes.join(' ')
})
</script>
