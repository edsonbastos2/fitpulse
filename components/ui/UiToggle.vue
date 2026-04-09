<template>
  <div class="flex items-center gap-3">
    <button
      :id="id"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="label || undefined"
      :aria-describedby="hint ? `${id}-hint` : undefined"
      :disabled="disabled"
      :class="trackClasses"
      type="button"
      @click="toggle"
      @keydown.space.prevent="toggle"
      @keydown.enter.prevent="toggle"
    >
      <span
        class="pointer-events-none block rounded-full bg-white shadow-card transition-transform duration-200"
        :class="thumbClasses"
      />
    </button>

    <!-- Label -->
    <label v-if="label" :for="id" :class="labelClasses">
      <slot>{{ label }}</slot>
    </label>
  </div>

  <!-- Helper Text -->
  <p v-if="hint" :id="`${id}-hint`" class="mt-1 text-xs text-slate-500">
    {{ hint }}
  </p>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  hint?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: undefined,
  hint: undefined,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const id = `toggle-${Math.random().toString(36).substring(2, 9)}`

const toggle = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}

const trackClasses = computed(() => {
  const classes: string[] = [
    'relative rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40',
  ]

  if (props.modelValue) {
    classes.push('bg-gradient-primary')
  } else {
    classes.push('bg-dark-600')
  }

  if (props.disabled) {
    classes.push('opacity-50 cursor-not-allowed')
  } else {
    classes.push('cursor-pointer hover:brightness-110')
  }

  switch (props.size) {
    case 'sm':
      classes.push('w-9 h-5')
      break
    case 'lg':
      classes.push('w-14 h-7')
      break
    default:
      classes.push('w-11 h-6')
  }

  return classes.join(' ')
})

const thumbClasses = computed(() => {
  const classes: string[] = []

  switch (props.size) {
    case 'sm':
      classes.push('w-4 h-4', props.modelValue ? 'translate-x-4' : 'translate-x-0.5')
      break
    case 'lg':
      classes.push('w-6 h-6', props.modelValue ? 'translate-x-7' : 'translate-x-0.5')
      break
    default:
      classes.push('w-5 h-5', props.modelValue ? 'translate-x-5' : 'translate-x-0.5')
  }

  return classes.join(' ')
})

const labelClasses = computed(() => {
  const classes = ['select-none']

  if (props.disabled) {
    classes.push('text-dark-500 cursor-not-allowed')
  } else {
    classes.push('text-slate-300 cursor-pointer')
  }

  switch (props.size) {
    case 'sm':
      classes.push('text-xs')
      break
    case 'lg':
      classes.push('text-base')
      break
    default:
      classes.push('text-sm')
  }

  return classes.join(' ')
})
</script>
