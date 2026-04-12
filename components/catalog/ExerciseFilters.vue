<template>
  <!-- Desktop Sidebar ONLY (hidden on mobile) -->
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
</template>

<script setup lang="ts">
import type { ExerciseFilters, MuscleGroup, Equipment } from '~/types'

interface Props {
  filters?: ExerciseFilters
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({}),
})

const emit = defineEmits<{
  'update:filters': [value: ExerciseFilters]
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
