<template>
  <div :class="containerClasses">
    <label :for="selectId" class="text-sm text-slate-400 whitespace-nowrap">
      <ArrowsUpDownIcon class="w-4 h-4 inline-block mr-1 -mt-0.5" aria-hidden="true" />
      Ordenar por
    </label>

    <select
      :id="selectId"
      :value="modelValue"
      :class="selectClasses"
      aria-label="Ordenar exercícios por"
      @change="handleChange"
    >
      <option v-for="option in sortOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ArrowsUpDownIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue?: string
  /** When true, takes full width (mobile mode) */
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'name_asc',
  fullWidth: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectId = `sort-select-${Math.random().toString(36).slice(2, 9)}`

const sortOptions = [
  { label: 'Nome (A-Z)', value: 'name_asc' },
  { label: 'Nome (Z-A)', value: 'name_desc' },
  { label: 'Dificuldade (crescente)', value: 'difficulty' },
]

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

const containerClasses = computed(() =>
  props.fullWidth
    ? 'flex flex-col gap-2 w-full'
    : 'flex items-center gap-2'
)

const selectClasses = computed(() =>
  props.fullWidth
    ? 'input w-full'
    : 'input w-auto min-w-[160px]'
)
</script>
