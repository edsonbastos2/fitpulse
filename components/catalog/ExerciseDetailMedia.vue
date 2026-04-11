<template>
  <div class="rounded-2xl overflow-hidden bg-gradient-primary relative aspect-video">
    <!-- Image -->
    <img
      v-if="exercise.image_url"
      :src="exercise.image_url"
      :alt="`Demonstração de ${exercise.name_pt}`"
      class="w-full h-full object-cover"
    />

    <!-- Video Player -->
    <video
      v-else-if="exercise.video_url"
      :src="exercise.video_url"
      controls
      class="w-full h-full object-cover"
      :poster="exercise.thumbnail_url || exercise.image_url || undefined"
    >
      Seu navegador não suporta o elemento de vídeo.
    </video>

    <!-- Fallback -->
    <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-white/80">
      <component :is="fallbackIcon" class="w-24 h-24 mb-4 opacity-50" />
      <p class="text-lg font-medium">
        {{ exercise.name_pt }}
      </p>
      <p class="text-sm opacity-75 mt-1">
        Sem mídia disponível
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Exercise } from '~/types'
import { BoltIcon, FireIcon, SparklesIcon } from '@heroicons/vue/24/outline'

interface Props {
  exercise: Exercise
}

const props = defineProps<Props>()

const fallbackIcon = computed(() => {
  if (props.exercise.is_cardio) return FireIcon
  if (props.exercise.is_compound) return BoltIcon
  return SparklesIcon
})
</script>
