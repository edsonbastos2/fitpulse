<template>
  <div v-if="relatedExercises.length > 0" class="space-y-4">
    <h2 class="text-xl font-bold text-white">
      Exercícios Relacionados
    </h2>

    <div class="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div
        v-for="exercise in relatedExercises"
        :key="exercise.id"
        class="w-72 flex-shrink-0"
      >
        <ExerciseCard
          :exercise="exercise"
          :muscle-group-names="resolveMuscleNames(exercise)"
          :equipment-name="resolveEquipmentName(exercise)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Exercise } from '~/types'

interface Props {
  relatedExercises: Exercise[]
  muscleGroupMap?: Record<string, string>
  equipmentMap?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  muscleGroupMap: () => ({}),
  equipmentMap: () => ({}),
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
