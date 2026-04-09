<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" :for="id" class="block text-sm font-medium text-slate-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>

    <!-- Date Picker Wrapper -->
    <div class="relative">
      <VueDatePicker
        :id="id"
        v-model="internalValue"
        :placeholder="placeholder || 'Selecione uma data'"
        :disabled="disabled"
        :dark="true"
        :format="formatFn"
        :locale="'pt-BR'"
        :clearable="!!modelValue && !disabled"
        :auto-apply="true"
        :teleport="true"
        :menu-class-name="'ui-datepicker-menu'"
        :input-class-name="dpInputClasses"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
        @closed="onClose"
      />
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
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

interface Props {
  modelValue?: string // ISO date string YYYY-MM-DD
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  /** If true, allows selecting a date range. Emits [start, end] ISO strings */
  range?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  label: undefined,
  placeholder: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  range: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | [string, string] | undefined]
}>()

const id = `datepicker-${Math.random().toString(36).substring(2, 9)}`

// Convert ISO string <-> Date for the datepicker
const internalValue = computed({
  get: () => {
    if (!props.modelValue) return props.range ? [null, null] : null
    if (props.range && Array.isArray(props.modelValue)) {
      const [start, end] = props.modelValue as [string, string]
      return [start ? new Date(start + 'T00:00:00') : null, end ? new Date(end + 'T00:00:00') : null]
    }
    return new Date((props.modelValue as string) + 'T00:00:00')
  },
  set: (val: Date | [Date, Date] | [Date | null, Date | null] | null) => {
    if (!val) {
      emit('update:modelValue', undefined)
      return
    }
    if (props.range && Array.isArray(val)) {
      const [s, e] = val
      const start = s ? formatDate(s) : undefined
      const end = e ? formatDate(e) : undefined
      emit('update:modelValue', [start, end] as [string, string])
    } else if (val instanceof Date) {
      emit('update:modelValue', formatDate(val))
    }
  },
})

/** Format Date → ISO YYYY-MM-DD */
function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Format Date for display in input (DD/MM/YYYY) */
function formatFn(date: Date | Date[]): string {
  if (!date) return ''
  if (Array.isArray(date)) {
    const parts = date.filter(Boolean).map((d) => formatDateDisplay(d))
    return parts.join(' – ')
  }
  return formatDateDisplay(date)
}

function formatDateDisplay(date: Date): string {
  if (!date || isNaN(date.getTime())) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/** Input classes matching UiInput style */
const dpInputClasses = computed(() => {
  const base = [
    'dp__input',
    'w-full bg-dark-800/50 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder:text-dark-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed',
  ]
  if (props.error) {
    base.push('dp__input_invalid')
  }
  return base.join(' ')
})

function onClose() {
  // Emit nothing — modelValue already synced via computed setter
}
</script>

<style>
/* ============================================
   UiDatePicker Dark Theme Overrides
   Scoped to .ui-datepicker-menu via :menu-class-name
   ============================================ */

.ui-datepicker-menu.dp__theme_dark {
  /* Background & surfaces */
  --dp-background-color: #1e293b; /* dark-800 */
  --dp-text-color: #f8fafc;
  --dp-hover-color: #334155; /* dark-700 */
  --dp-hover-text-color: #f8fafc;
  --dp-hover-icon-color: #94a3b8; /* dark-400 */

  /* Primary actions */
  --dp-primary-color: #6366f1; /* primary-500 */
  --dp-primary-text-color: #ffffff;
  --dp-primary-disabled-color: #4f46e5; /* primary-600 */

  /* Borders */
  --dp-border-color: #475569; /* dark-600 */
  --dp-border-color-hover: #64748b; /* dark-500 */
  --dp-border-color-focus: #6366f1; /* primary-500 */
  --dp-menu-border-color: #334155; /* dark-700 */

  /* Secondary / misc */
  --dp-secondary-color: #94a3b8; /* dark-400 */
  --dp-disabled-color: #475569; /* dark-600 */
  --dp-disabled-color-text: #94a3b8;

  /* Calendar specific */
  --dp-scroll-bar-background: #1e293b;
  --dp-scroll-bar-color: #475569;
  --dp-tooltip-color: #1e293b;
  --dp-highlight-color: rgba(99, 102, 241, 0.15);
  --dp-range-between-dates-background-color: rgba(99, 102, 241, 0.15);
  --dp-range-between-dates-text-color: #c7d2fe;
  --dp-range-between-border-color: rgba(99, 102, 241, 0.3);

  /* Layout */
  --dp-border-radius: 12px;
  --dp-cell-border-radius: 8px;
  --dp-font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --dp-font-size: 14px;
  --dp-menu-padding: 6px;
}

/* Error state styling for the datepicker input */
.dp__input_invalid {
  border-color: #ef4444 !important;
}

.dp__input_invalid:focus {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
}
</style>
