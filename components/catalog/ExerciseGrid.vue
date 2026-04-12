<template>
  <div
    v-if="exercises.length > 0"
    class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4"
    role="list"
    aria-label="Lista de exercícios"
    aria-live="polite"
    :aria-busy="loading"
  >
    <div
      v-for="(exercise, index) in exercises"
      :key="exercise.id"
      class="animate-fade-in-up"
      :style="{ animationDelay: `${Math.min(index * 100, 500)}ms` }"
      role="listitem"
    >
      <ExerciseCardCompact
        :exercise="exercise"
        :muscle-group-names="resolveMuscleNames(exercise)"
        :equipment-name="resolveEquipmentName(exercise)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Exercise } from '~/types'

interface Props {
  exercises?: Exercise[]
  muscleGroupMap?: Record<string, string>
  equipmentMap?: Record<string, string>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  exercises: () => [],
  muscleGroupMap: () => ({}),
  equipmentMap: () => ({}),
  loading: false,
})

const resolveMuscleNames = (exercise: Exercise): string[] => {
  const muscleIds = exercise.primary_muscles ?? []
  return muscleIds
    .slice(0, 2)
    .map((id) => props.muscleGroupMap[id] || '')
    .filter(Boolean)
}

const resolveEquipmentName = (exercise: Exercise): string | undefined => {
  if (!exercise.equipment_id) return undefined
  return props.equipmentMap[exercise.equipment_id] || undefined
}
</script>
