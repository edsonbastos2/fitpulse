<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" :for="sliderId" class="block text-sm font-medium text-slate-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>

    <!-- Slider Container -->
    <div class="relative py-6">
      <!-- Tooltip(s) -->
      <div
        v-if="showTooltip"
        class="absolute bottom-full left-0 right-0 mb-2 pointer-events-none"
        :style="tooltipPositions"
      >
        <!-- Single mode tooltip -->
        <div
          v-if="!range"
          class="absolute -translate-x-1/2 bg-dark-800 border border-dark-700 text-white text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap"
          :style="{ left: singlePercent + '%' }"
        >
          {{ displayValue }}
        </div>
        <!-- Dual mode tooltips -->
        <template v-else>
          <div
            class="absolute -translate-x-1/2 bg-dark-800 border border-dark-700 text-white text-xs font-medium px-2 py-1 rounded-lg"
            :style="{ left: startPercent + '%' }"
          >
            {{ displayStart }}
          </div>
          <div
            class="absolute -translate-x-1/2 bg-dark-800 border border-dark-700 text-white text-xs font-medium px-2 py-1 rounded-lg"
            :style="{ left: endPercent + '%' }"
          >
            {{ displayEnd }}
          </div>
        </template>
      </div>

      <!-- Track Background -->
      <div class="relative h-2 bg-dark-700 rounded-full">
        <!-- Track Fill -->
        <div
          class="absolute h-full rounded-full bg-gradient-primary transition-all duration-100"
          :style="fillStyle"
        />
      </div>

      <!-- Single Handle -->
      <div
        v-if="!range"
        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        :style="{ left: singlePercent + '%' }"
      >
        <input
          :id="sliderId"
          ref="singleInputRef"
          type="range"
          :min="min"
          :max="max"
          :step="step"
          :value="internalSingle"
          :disabled="disabled"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="internalSingle"
          :aria-label="label || undefined"
          :aria-describedby="error ? `${sliderId}-error` : hint ? `${sliderId}-hint` : undefined"
          class="slider-input"
          @input="onSingleInput"
          @keydown.left.prevent="onArrowKey(-1)"
          @keydown.right.prevent="onArrowKey(1)"
          @keydown.down.prevent="onArrowKey(-1)"
          @keydown.up.prevent="onArrowKey(1)"
        />
        <div
          class="w-5 h-5 rounded-full bg-gradient-primary border-2 border-primary-400 shadow-glow cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95 focus-within:ring-2 focus-within:ring-primary-500/40"
          :style="{ pointerEvents: 'none' }"
        />
      </div>

      <!-- Dual Handles -->
      <template v-else>
        <!-- Start Handle -->
        <div
          class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          :style="{ left: startPercent + '%', zIndex: startZIndex }"
        >
          <input
            :id="sliderId"
            ref="startInputRef"
            type="range"
            :min="min"
            :max="max"
            :step="step"
            :value="internalStart"
            :disabled="disabled"
            :aria-valuemin="min"
            :aria-valuemax="max"
            :aria-valuenow="internalStart"
            :aria-label="(label || 'Início') + ' - início do intervalo'"
            class="slider-input"
            @input="onStartInput"
          />
          <div
            class="w-5 h-5 rounded-full bg-gradient-primary border-2 border-primary-400 shadow-glow cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95 focus-within:ring-2 focus-within:ring-primary-500/40"
            :style="{ pointerEvents: 'none' }"
          />
        </div>
        <!-- End Handle -->
        <div
          class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          :style="{ left: endPercent + '%', zIndex: endZIndex }"
        >
          <input
            ref="endInputRef"
            type="range"
            :min="min"
            :max="max"
            :step="step"
            :value="internalEnd"
            :disabled="disabled"
            :aria-valuemin="min"
            :aria-valuemax="max"
            :aria-valuenow="internalEnd"
            :aria-label="(label || 'Fim') + ' - fim do intervalo'"
            class="slider-input"
            @input="onEndInput"
          />
          <div
            class="w-5 h-5 rounded-full bg-gradient-primary border-2 border-primary-400 shadow-glow cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95 focus-within:ring-2 focus-within:ring-primary-500/40"
            :style="{ pointerEvents: 'none' }"
          />
        </div>
      </template>
    </div>

    <!-- Min/Max Labels -->
    <div class="flex justify-between text-xs text-slate-500">
      <span>{{ minLabel ?? min }}</span>
      <span>{{ maxLabel ?? max }}</span>
    </div>

    <!-- Helper Text -->
    <p v-if="hint && !error" :id="`${sliderId}-hint`" class="mt-2 text-sm text-slate-500">
      {{ hint }}
    </p>

    <!-- Error Message -->
    <p v-if="error" :id="`${sliderId}-error`" role="alert" class="mt-2 text-sm text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: number | [number, number]
  min?: number
  max?: number
  step?: number
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  /** If true, enables dual-handle range selection */
  range?: boolean
  showTooltip?: boolean
  minLabel?: string
  maxLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  min: 0,
  max: 100,
  step: 1,
  label: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  range: false,
  showTooltip: true,
  minLabel: undefined,
  maxLabel: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | [number, number]]
}>()

const sliderId = `rangeslider-${Math.random().toString(36).substring(2, 9)}`

// ==================== Single Mode ====================

const internalSingle = computed(() => {
  if (props.range) return props.min
  const val = props.modelValue as number
  return val !== undefined ? val : props.min
})

const singlePercent = computed(() => {
  return ((internalSingle.value - props.min) / (props.max - props.min)) * 100
})

const displayValue = computed(() => {
  return props.step >= 1 ? String(Math.round(internalSingle.value)) : internalSingle.value.toFixed(1)
})

function onSingleInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', val)
}

function onArrowKey(dir: number) {
  if (props.disabled || props.range) return
  const newVal = Math.min(props.max, Math.max(props.min, internalSingle.value + props.step * dir))
  emit('update:modelValue', newVal)
}

// ==================== Dual (Range) Mode ====================

const internalStart = computed(() => {
  if (!props.range) return props.min
  const val = props.modelValue as [number, number]
  return val ? val[0] : props.min
})

const internalEnd = computed(() => {
  if (!props.range) return props.max
  const val = props.modelValue as [number, number]
  return val ? val[1] : props.max
})

const startPercent = computed(() => {
  return ((internalStart.value - props.min) / (props.max - props.min)) * 100
})

const endPercent = computed(() => {
  return ((internalEnd.value - props.min) / (props.max - props.min)) * 100
})

const displayStart = computed(() => {
  return props.step >= 1 ? String(Math.round(internalStart.value)) : internalStart.value.toFixed(1)
})

const displayEnd = computed(() => {
  return props.step >= 1 ? String(Math.round(internalEnd.value)) : internalEnd.value.toFixed(1)
})

// Manage z-index so the handle being dragged is on top
const startZIndex = ref(2)
const endZIndex = ref(1)

function onStartInput(e: Event) {
  const val = Math.min(Number((e.target as HTMLInputElement).value), internalEnd.value)
  startZIndex.value = 3
  endZIndex.value = 1
  emit('update:modelValue', [val, internalEnd.value])
}

function onEndInput(e: Event) {
  const val = Math.max(Number((e.target as HTMLInputElement).value), internalStart.value)
  startZIndex.value = 1
  endZIndex.value = 3
  emit('update:modelValue', [internalStart.value, val])
}

// ==================== Fill Style ====================

const fillStyle = computed(() => {
  if (props.range) {
    return {
      left: startPercent.value + '%',
      width: (endPercent.value - startPercent.value) + '%',
    }
  }
  return {
    width: singlePercent.value + '%',
  }
})

const tooltipPositions = computed(() => {
  return { height: '28px' }
})

// Refs for potential focus management
const singleInputRef = ref<HTMLInputElement | null>(null)
const startInputRef = ref<HTMLInputElement | null>(null)
const endInputRef = ref<HTMLInputElement | null>(null)
</script>

<style scoped>
/* ============================================
   UiRangeSlider — Native range input styling
   ============================================ */

.slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2rem;
  margin: 0;
  cursor: pointer;
  opacity: 0;
  pointer-events: auto;
}

.slider-input:disabled {
  cursor: not-allowed;
}

/* Remove default focus outline — we show custom handle ring */
.slider-input:focus {
  outline: none;
}
</style>
