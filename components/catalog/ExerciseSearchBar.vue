<template>
  <div class="relative">
    <!-- Accessible Label -->
    <label
      :for="inputId"
      class="sr-only"
    >
      Buscar exercício
    </label>

    <!-- Search Input Wrapper -->
    <div class="relative">
      <!-- Magnifying Glass Icon -->
      <MagnifyingGlassIcon
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"
        aria-hidden="true"
      />

      <!-- Input -->
      <input
        :id="inputId"
        type="text"
        :value="internalValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input pl-10 pr-10 w-full"
        @input="handleInput"
      />

      <!-- Clear Button -->
      <button
        v-if="internalValue"
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 btn-icon p-1"
        aria-label="Limpar busca"
        @click="handleClear"
      >
        <XMarkIcon class="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useDebounceFn } from '@vueuse/core'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Buscar exercício...',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Unique ID for label association
const inputId = `exercise-search-${Math.random().toString(36).slice(2, 9)}`

// Internal state
const internalValue = ref(props.modelValue)

// Debounced emit function (300ms)
const debouncedEmit = useDebounceFn((value: string) => {
  emit('update:modelValue', value)
}, 300)

// Handle input changes
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  internalValue.value = target.value
  debouncedEmit(target.value)
}

// Handle clear button
const handleClear = () => {
  internalValue.value = ''
  emit('update:modelValue', '')
}

// Sync external modelValue changes back to internal state
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})
</script>
