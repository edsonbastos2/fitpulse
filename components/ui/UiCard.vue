<template>
  <div :class="cardClasses" class="relative overflow-hidden">
    <!-- Gradient Border Effect (optional) -->
    <div
      v-if="gradient"
      class="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-secondary-500/20 pointer-events-none"
    />

    <!-- Content -->
    <div class="relative z-10">
      <!-- Header -->
      <div v-if="$slots.header || title" class="px-6 py-4 border-b border-dark-700">
        <slot name="header">
          <div class="flex items-center justify-between">
            <div>
              <h3 v-if="title" class="text-lg font-bold text-white">{{ title }}</h3>
              <p v-if="subtitle" class="text-sm text-slate-400 mt-1">{{ subtitle }}</p>
            </div>
            <slot name="header-actions" />
          </div>
        </slot>
      </div>

      <!-- Body -->
      <div :class="bodyClass">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="$slots.footer" class="px-6 py-4 border-t border-dark-700 bg-dark-800/50">
        <slot name="footer" />
      </div>
    </div>

    <!-- Glow Effect on Hover -->
    <div
      v-if="hoverable"
      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  variant?: 'default' | 'gradient' | 'bordered'
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  hoverable: false,
  padding: 'md',
  rounded: 'xl',
})

const cardClasses = computed(() => {
  const classes: string[] = ['bg-dark-800/80 backdrop-blur-sm border border-dark-700']

  // Variant
  switch (props.variant) {
    case 'gradient':
      classes.push('bg-gradient-to-br from-dark-800 to-dark-900')
      break
    case 'bordered':
      classes.push('bg-transparent border-dark-600')
      break
  }

  // Hoverable
  if (props.hoverable) {
    classes.push(
      'group transition-all duration-300',
      'hover:border-primary-500/30 hover:shadow-glow hover:-translate-y-1 cursor-pointer'
    )
  }

  // Rounded
  switch (props.rounded) {
    case 'none':
      classes.push('rounded-none')
      break
    case 'sm':
      classes.push('rounded-lg')
      break
    case 'md':
      classes.push('rounded-xl')
      break
    case 'lg':
      classes.push('rounded-2xl')
      break
    case 'xl':
      classes.push('rounded-3xl')
      break
    case '2xl':
      classes.push('rounded-4xl')
      break
  }

  return classes.join(' ')
})

const bodyClass = computed(() => {
  switch (props.padding) {
    case 'none':
      return ''
    case 'sm':
      return 'p-4'
    case 'md':
      return 'p-6'
    case 'lg':
      return 'p-8'
    default:
      return 'p-6'
  }
})
</script>
