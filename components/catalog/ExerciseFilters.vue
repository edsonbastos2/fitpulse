<template>
  <!-- Desktop Sidebar -->
  <aside
    class="hidden lg:block w-64 flex-shrink-0"
    aria-label="Filtros de exercícios"
  >
    <div class="sticky top-6 space-y-4">
      <ExerciseFilterContent
        :filters="filters"
        :muscle-groups="muscleGroups"
        :equipment="equipmentList"
        @update="handleUpdate"
        @clear="handleClear"
      />
    </div>
  </aside>

  <!-- Mobile Toggle Button -->
  <button
    class="lg:hidden btn-ghost flex items-center gap-2"
    aria-label="Abrir filtros"
    @click="emit('update:mobileOpen', true)"
  >
    <FunnelIcon class="w-5 h-5" />
    <span>Filtros</span>
  </button>

  <!-- Mobile Drawer -->
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="mobileOpen"
        class="lg:hidden fixed inset-0 z-50 flex items-end"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
          @click="emit('update:mobileOpen', false)"
        />

        <!-- Drawer Content -->
        <div class="relative w-full max-h-[85vh] glass rounded-t-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-dark-700">
            <h2 class="text-lg font-bold text-white">Filtros</h2>
            <button
              class="btn-icon p-2"
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
</template>

<script setup lang="ts">
import type { ExerciseFilters, MuscleGroup, Equipment } from '~/types'
import { FunnelIcon, XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  filters?: ExerciseFilters
  mobileOpen?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:filters': [value: ExerciseFilters]
  'update:mobileOpen': [value: boolean]
  'clear': []
}>()

const { fetchMuscleGroups, fetchEquipment } = useExercises()

const muscleGroups = ref<MuscleGroup[]>([])
const equipmentList = ref<Equipment[]>([])

onMounted(async () => {
  const [groups, equips] = await Promise.all([
    fetchMuscleGroups(),
    fetchEquipment(),
  ])
  if (groups) muscleGroups.value = groups as MuscleGroup[]
  if (equips) equipmentList.value = equips as Equipment[]
})

const handleUpdate = (updatedFilters: ExerciseFilters) => {
  emit('update:filters', updatedFilters)
}

const handleClear = () => {
  emit('clear')
}
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
