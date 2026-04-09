<template>
  <div class="w-full" ref="rootRef">
    <!-- Label -->
    <label v-if="label" :for="id" class="block text-sm font-medium text-slate-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>

    <!-- Select Trigger -->
    <div class="relative">
      <button
        :id="id"
        type="button"
        :disabled="disabled"
        :aria-expanded="isOpen"
        :aria-haspopup="searchable ? 'listbox' : undefined"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
        :class="triggerClasses"
        @click="toggle"
        @keydown.down.prevent="openAndFocusFirst"
        @keydown.up.prevent="openAndFocusLast"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
        @keydown.escape="close"
      >
        <span class="truncate" :class="modelValue !== undefined && modelValue !== '' ? 'text-white' : 'text-dark-400'">
          {{ selectedLabel || placeholder || 'Selecione uma opção' }}
        </span>
        <svg class="w-5 h-5 text-dark-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Dropdown -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="isOpen"
          role="listbox"
          :aria-multiselectable="false"
          class="absolute z-50 mt-2 w-full glass rounded-xl border border-dark-700 shadow-card-lg overflow-hidden"
        >
          <!-- Search Input -->
          <div v-if="searchable" class="p-2 border-b border-dark-700">
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Buscar..."
              class="w-full bg-dark-800/50 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
              @keydown.escape="close"
              @keydown.down.prevent="focusNext"
              @keydown.up.prevent="focusPrev"
              @keydown.enter.prevent="selectFocused"
            />
          </div>

          <!-- Options List -->
          <ul class="max-h-60 overflow-y-auto py-1" role="list">
            <template v-for="(option, index) in filteredOptions" :key="getOptionKey(option, index)">
              <!-- Group Label -->
              <li
                v-if="option.group && isNewGroup(option, index)"
                class="px-4 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                role="presentation"
              >
                {{ option.group }}
              </li>
              <!-- Option -->
              <li
                :ref="el => setOptionRef(el, index)"
                role="option"
                :aria-selected="isSelected(option)"
                :class="[
                  'px-4 py-2.5 cursor-pointer transition-colors duration-150',
                  option.disabled
                    ? 'text-dark-500 cursor-not-allowed'
                    : isSelected(option)
                      ? 'bg-primary-500/20 text-primary-400'
                      : focusedIndex === index
                        ? 'bg-dark-700/70 text-white'
                        : 'text-slate-300 hover:bg-dark-700/50'
                ]"
                @click="!option.disabled && select(option)"
                @mouseenter="focusedIndex = index"
              >
                <div class="flex items-center justify-between">
                  <span>{{ option.label }}</span>
                  <svg
                    v-if="isSelected(option)"
                    class="w-4 h-4 text-primary-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </li>
            </template>

            <!-- No Results -->
            <li v-if="filteredOptions.length === 0" class="px-4 py-3 text-sm text-slate-500 text-center">
              Nenhuma opção encontrada
            </li>
          </ul>
        </div>
      </Transition>
    </div>

    <!-- Helper Text -->
    <p v-if="hint && !error" :id="`${id}-hint`" class="mt-2 text-sm text-slate-500">
      {{ hint }}
    </p>

    <!-- Error Message -->
    <p v-if="error" :id="`${id}-error`" role="alert" class="mt-2 text-sm text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import type { SelectOption } from '~/types'

interface Props {
  modelValue?: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  searchable?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  label: undefined,
  placeholder: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  searchable: true,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const id = `select-${Math.random().toString(36).substring(2, 9)}`
const isOpen = ref(false)
const searchQuery = ref('')
const focusedIndex = ref(0)
const rootRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const optionRefs = ref<(HTMLElement | null)[]>([])

// Click outside to close
onClickOutside(rootRef, () => close())

// Computed
const selectedLabel = computed(() => {
  const selected = props.options.find(o => o.value === props.modelValue)
  return selected?.label || ''
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(o => o.label.toLowerCase().includes(query))
})

const triggerClasses = computed(() => {
  const classes: string[] = [
    'w-full flex items-center justify-between gap-2 bg-dark-800/50 border rounded-xl px-4 text-left transition-all duration-200 focus:outline-none focus:ring-2',
  ]

  if (props.error) {
    classes.push('border-red-500 focus:border-red-500 focus:ring-red-500/20')
  } else {
    classes.push('border-dark-600 focus:border-primary-500 focus:ring-primary-500/20')
  }

  if (props.disabled) {
    classes.push('opacity-50 cursor-not-allowed')
  } else {
    classes.push('cursor-pointer hover:border-dark-500')
  }

  switch (props.size) {
    case 'sm':
      classes.push('py-2 text-sm')
      break
    case 'lg':
      classes.push('py-4 text-lg')
      break
    default:
      classes.push('py-3 text-base')
  }

  return classes.join(' ')
})

// Methods
function toggle() {
  if (props.disabled) return
  isOpen.value ? close() : open()
}

function open() {
  isOpen.value = true
  focusedIndex.value = findOptionIndex(props.modelValue)
  searchQuery.value = ''
  nextTick(() => {
    if (props.searchable && searchInputRef.value) {
      searchInputRef.value.focus()
    }
  })
}

function close() {
  isOpen.value = false
  searchQuery.value = ''
  focusedIndex.value = 0
}

function select(option: SelectOption) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  close()
}

function isSelected(option: SelectOption) {
  return option.value === props.modelValue
}

function openAndFocusFirst() {
  open()
  focusedIndex.value = 0
  nextTick(() => focusVisible(focusedIndex.value))
}

function openAndFocusLast() {
  open()
  focusedIndex.value = Math.max(filteredOptions.value.length - 1, 0)
  nextTick(() => focusVisible(focusedIndex.value))
}

function focusNext() {
  focusedIndex.value = Math.min(focusedIndex.value + 1, filteredOptions.value.length - 1)
  focusVisible(focusedIndex.value)
}

function focusPrev() {
  focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
  focusVisible(focusedIndex.value)
}

function selectFocused() {
  const option = filteredOptions.value[focusedIndex.value]
  if (option && !option.disabled) {
    select(option)
  }
}

function focusVisible(index: number) {
  nextTick(() => {
    const el = optionRefs.value[index]
    if (el) {
      el.scrollIntoView({ block: 'nearest' })
    }
  })
}

function setOptionRef(el: Element | ComponentPublicInstance | null, index: number) {
  optionRefs.value[index] = el as HTMLElement | null
}

function findOptionIndex(value: string | number | undefined): number {
  if (value === undefined) return 0
  const idx = props.options.findIndex(o => o.value === value)
  return idx >= 0 ? idx : 0
}

function isNewGroup(option: SelectOption, index: number): boolean {
  if (!option.group) return false
  if (index === 0) return true
  const prev = filteredOptions.value[index - 1]
  return prev?.group !== option.group
}

function getOptionKey(option: SelectOption, index: number): string {
  return `${option.group ?? ''}-${option.value}-${index}`
}

// Reset option refs when options change
watch(filteredOptions, () => {
  optionRefs.value = []
  focusedIndex.value = 0
})
</script>
