<template>
  <!-- Hidden on desktop (≥1024px) -->
  <div class="lg:hidden">
    <!-- Filter Chips Row -->
    <div
      class="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar"
      role="toolbar"
      aria-label="Filtros ativos"
    >
      <!-- Filters Button -->
      <button
        type="button"
        class="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-sm font-medium transition-all duration-200 bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
        aria-label="Abrir filtros"
        @click="emit('update:mobileOpen', true)"
      >
        <FunnelIcon class="w-4 h-4" />
        <span>Filtros</span>
        <span
          v-if="activeChipsCount > 0"
          class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs font-bold"
        >
          {{ activeChipsCount }}
        </span>
      </button>

      <!-- Active Filter Chips -->
      <button
        v-for="chip in activeChips"
        :key="chip.key"
        type="button"
        class="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-sm font-medium transition-all duration-200 bg-primary-500/20 text-primary-400 border border-primary-500/30 hover:bg-primary-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
        :aria-label="`Remover filtro: ${chip.label}`"
        @click="removeChip(chip.key)"
      >
        <span>{{ chip.label }}</span>
        <XMarkIcon class="w-3.5 h-3.5" />
      </button>

      <!-- Clear All Button (when multiple filters active) -->
      <button
        v-if="activeChipsCount > 1"
        type="button"
        class="flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 min-h-[44px] rounded-xl text-xs font-medium transition-all duration-200 text-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
        aria-label="Limpar todos os filtros"
        @click="emit('clear')"
      >
        Limpar tudo
      </button>
    </div>

    <!-- Mobile Drawer (Bottom Sheet) -->
    <Teleport to="body">
      <Transition name="drawer">
        <div
          v-if="mobileOpen"
          class="lg:hidden fixed inset-0 z-50 flex items-end"
          role="dialog"
          aria-modal="true"
          aria-label="Filtros de exercícios"
          @keydown="handleKeyDown"
        >
          <!-- Overlay -->
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
            @click="emit('update:mobileOpen', false)"
          />

          <!-- Drawer Content -->
          <div
            ref="drawerContentRef"
            class="relative w-full max-h-[85vh] glass rounded-t-2xl overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-dark-700">
              <h2 class="text-lg font-bold text-white">Filtros</h2>
              <button
                class="btn-icon p-2 min-w-[44px] min-h-[44px]"
                aria-label="Fechar filtros"
                @click="emit('update:mobileOpen', false)"
              >
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>

            <!-- Filter Content -->
            <div class="overflow-y-auto p-4 space-y-4" style="max-height: calc(85vh - 64px)">
              <ExerciseFilterContent
                :filters="filters"
                :muscle-groups="muscleGroups"
                :equipment="equipmentList"
                @update="handleUpdate"
                @clear="handleClear"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ExerciseFilters, MuscleGroup, Equipment } from '~/types'
import { FunnelIcon, XMarkIcon } from '@heroicons/vue/24/outline'

interface FilterChip {
  key: keyof ExerciseFilters
  label: string
}

interface Props {
  filters?: ExerciseFilters
  mobileOpen?: boolean
  muscleGroupMap?: Record<string, string>
  equipmentMap?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({}),
  mobileOpen: false,
  muscleGroupMap: () => ({}),
  equipmentMap: () => ({}),
})

const emit = defineEmits<{
  'update:filters': [value: ExerciseFilters]
  'update:mobileOpen': [value: boolean]
  'clear': []
}>()

const { fetchMuscleGroups, fetchEquipment } = useExercises()

const muscleGroups = ref<MuscleGroup[]>([])
const equipmentList = ref<Equipment[]>([])

// Focus trap refs
const previousFocus = ref<HTMLElement | null>(null)
const drawerContentRef = ref<HTMLElement | null>(null)

/**
 * Computed: Generate active filter chips from current filters
 */
const activeChips = computed<FilterChip[]>(() => {
  const chips: FilterChip[] = []
  const f = props.filters

  // Difficulty chip
  if (f.difficulty) {
    const labels: Record<string, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' }
    chips.push({ key: 'difficulty', label: labels[f.difficulty] || f.difficulty })
  }

  // Muscle group chip
  if (f.muscleGroup) {
    const label = props.muscleGroupMap[f.muscleGroup] || f.muscleGroup
    chips.push({ key: 'muscleGroup', label })
  }

  // Equipment chip
  if (f.equipment) {
    const label = props.equipmentMap[f.equipment] || f.equipment
    chips.push({ key: 'equipment', label })
  }

  // Type chip
  if (f.type) {
    const labels: Record<string, string> = {
      compound: 'Composto',
      isolation: 'Isolado',
      cardio: 'Cardio',
    }
    chips.push({ key: 'type', label: labels[f.type] || f.type })
  }

  return chips
})

const activeChipsCount = computed(() => activeChips.value.length)

/**
 * Remove a filter chip by key
 */
const removeChip = (key: keyof ExerciseFilters) => {
  const newFilters = { ...props.filters }
  delete newFilters[key]
  emit('update:filters', newFilters)
}

/**
 * Handle filter update from drawer content
 */
const handleUpdate = (updatedFilters: ExerciseFilters) => {
  emit('update:filters', updatedFilters)
}

/**
 * Handle clear from drawer content
 */
const handleClear = () => {
  emit('clear')
}

// Save focus before opening drawer
watch(() => props.mobileOpen, (isOpen) => {
  if (isOpen) {
    previousFocus.value = document.activeElement as HTMLElement

    setTimeout(() => {
      const firstFocusable = drawerContentRef.value?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      firstFocusable?.focus()
    }, 100)
  } else if (previousFocus.value) {
    previousFocus.value.focus()
  }
})

// Focus trap handler
const handleTabKey = (event: KeyboardEvent) => {
  if (!props.mobileOpen || !drawerContentRef.value) return

  const focusableElements = drawerContentRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const focusable = Array.from(focusableElements)
  if (focusable.length === 0) return

  const firstElement = focusable[0]
  const lastElement = focusable[focusable.length - 1]

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    }
  } else {
    if (document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }
}

// Keyboard handler (Escape + Tab)
const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.mobileOpen) return

  if (event.key === 'Escape') {
    event.preventDefault()
    emit('update:mobileOpen', false)
  }

  if (event.key === 'Tab') {
    handleTabKey(event)
  }
}

// Load reference data (muscle groups + equipment) for chip labels
onMounted(async () => {
  const [groups, equips] = await Promise.all([
    fetchMuscleGroups(),
    fetchEquipment(),
  ])
  if (groups) muscleGroups.value = groups as MuscleGroup[]
  if (equips) equipmentList.value = equips as Equipment[]
})
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
