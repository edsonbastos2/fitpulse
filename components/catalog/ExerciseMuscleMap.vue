<template>
  <div class="card p-6">
    <h2 class="text-lg font-bold text-white mb-4">
      Músculos Trabalhados
    </h2>

    <!-- Primary Muscles -->
    <div v-if="primaryMuscles.length > 0" class="mb-4">
      <h3 class="text-sm font-medium text-slate-400 mb-2">
        Primários
      </h3>
      <div class="flex flex-wrap gap-2">
        <UiBadge
          v-for="muscle in primaryMuscles"
          :key="`primary-${muscle.id}`"
          variant="primary"
          size="md"
        >
          {{ muscle.name_pt }}
        </UiBadge>
      </div>
    </div>

    <!-- Secondary Muscles -->
    <div v-if="secondaryMuscles.length > 0">
      <h3 class="text-sm font-medium text-slate-400 mb-2">
        Secundários
      </h3>
      <div class="flex flex-wrap gap-2">
        <UiBadge
          v-for="muscle in secondaryMuscles"
          :key="`secondary-${muscle.id}`"
          variant="default"
          size="md"
          outline
        >
          {{ muscle.name_pt }}
        </UiBadge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MuscleGroup } from '~/types'

interface Props {
  primaryMuscles: MuscleGroup[]
  secondaryMuscles: MuscleGroup[]
}

defineProps<Props>()
</script>
