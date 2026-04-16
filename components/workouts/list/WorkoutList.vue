<template>
  <div class="space-y-4">
    <WorkoutListItem
      v-for="workout in workouts"
      :key="workout.id"
      :workout="workout"
    />
  </div>
</template>

<script setup lang="ts">
import type { Workout } from '~/types'

interface Props {
  workouts: (Workout & { exerciseCount?: number; lastUsedAt?: string })[]
}

defineProps<Props>()
</script>
