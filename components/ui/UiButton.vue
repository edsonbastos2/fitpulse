<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    class="inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin"
      :class="iconSize"
      fill="none"
      viewBox="0 0 24 24"
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

    <!-- Icon Left -->
    <slot v-else-if="$slots.icon" name="icon" />

    <!-- Default Content -->
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const buttonClasses = computed(() => {
  const classes: string[] = []

  // Variant
  switch (props.variant) {
    case 'primary':
      classes.push(
        'bg-gradient-primary text-white',
        'hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]',
        'focus:ring-primary-500'
      )
      break
    case 'secondary':
      classes.push(
        'bg-secondary-500 text-white',
        'hover:shadow-glow-secondary hover:scale-[1.02] active:scale-[0.98]',
        'focus:ring-secondary-500'
      )
      break
    case 'ghost':
      classes.push(
        'bg-transparent text-slate-300 border border-dark-600',
        'hover:bg-dark-700 hover:border-dark-500 hover:text-white',
        'focus:ring-dark-500'
      )
      break
    case 'danger':
      classes.push(
        'bg-red-500 text-white',
        'hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98]',
        'focus:ring-red-500'
      )
      break
    case 'success':
      classes.push(
        'bg-green-500 text-white',
        'hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98]',
        'focus:ring-green-500'
      )
      break
  }

  // Size
  switch (props.size) {
    case 'sm':
      classes.push('px-4 py-2 text-sm')
      break
    case 'md':
      classes.push('px-6 py-3 text-base')
      break
    case 'lg':
      classes.push('px-8 py-4 text-lg')
      break
  }

  // Full width
  if (props.fullWidth) {
    classes.push('w-full')
  }

  return classes.join(' ')
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4'
    case 'md':
      return 'w-5 h-5'
    case 'lg':
      return 'w-6 h-6'
    default:
      return 'w-5 h-5'
  }
})
</script>
