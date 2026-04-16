<template>
  <div class="card p-8 text-center">
    <!-- Icon -->
    <div class="w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mx-auto mb-4">
      <svg
        class="w-8 h-8 text-slate-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-medium text-white mb-2">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-slate-400 mb-6">
      {{ description }}
    </p>

    <!-- CTA Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <NuxtLink
        :to="primaryAction.to"
        class="btn-primary"
      >
        {{ primaryAction.label }}
      </NuxtLink>
      <NuxtLink
        v-if="secondaryAction"
        :to="secondaryAction.to"
        class="btn-ghost"
      >
        {{ secondaryAction.label }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ActionConfig {
  label: string
  to: string
}

interface Props {
  title?: string
  description?: string
  primaryAction?: ActionConfig
  secondaryAction?: ActionConfig
}

withDefaults(defineProps<Props>(), {
  title: 'Nenhum treino encontrado',
  description: 'Comece criando seu primeiro treino ou explore nossos templates recomendados.',
  primaryAction: () => ({ label: 'Criar Treino', to: '/workouts/create' }),
  secondaryAction: () => ({ label: 'Ver Recomendados', to: '/workouts/recommended' }),
})
</script>
