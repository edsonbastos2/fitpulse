<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" :for="id" class="block text-sm font-medium text-slate-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>

    <!-- Input Wrapper -->
    <div class="relative">
      <!-- Icon Left -->
      <div
        v-if="$slots.prefix"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"
      >
        <slot name="prefix" />
      </div>

      <!-- Input -->
      <input
        :id="id"
        v-model="model"
        :type="computedType"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        class="w-full bg-dark-800/50 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder:text-dark-400 transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >

      <!-- Icon Right (Password Toggle) -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
        @click="showPassword = !showPassword"
      >
        <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
      </button>

      <!-- Clear Button -->
      <button
        v-else-if="clearable && model"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
        @click="model = ''"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Helper Text -->
    <p v-if="hint && !error" class="mt-2 text-sm text-slate-500">
      {{ hint }}
    </p>

    <!-- Error Message -->
    <p v-if="error" class="mt-2 text-sm text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  autocomplete?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  size: 'md',
})

const slots = useSlots()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const id = `input-${Math.random().toString(36).substring(2, 9)}`
const showPassword = ref(false)

const computedType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const inputClasses = computed(() => {
  const classes: string[] = []

  if (props.error) {
    classes.push('border-red-500 focus:border-red-500 focus:ring-red-500/20')
  } else {
    classes.push('focus:border-primary-500 focus:ring-primary-500/20')
  }

  if (props.type === 'password') {
    classes.push('pr-12')
  } else if (props.clearable) {
    classes.push('pr-10')
  }

  if (slots.prefix) {
    classes.push('pl-12')
  }

  switch (props.size) {
    case 'sm':
      classes.push('px-3 py-2 text-sm')
      break
    case 'lg':
      classes.push('px-5 py-4 text-lg')
      break
  }

  return classes.join(' ')
})
</script>
