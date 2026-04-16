<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-display font-bold text-white">
          Meus Treinos
        </h1>
        <p class="text-slate-400 mt-1">
          Gerencie seus treinos e templates
        </p>
      </div>

      <NuxtLink to="/workouts/create" class="btn-primary px-6 py-3 flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>Novo Treino</span>
      </NuxtLink>
    </div>

    <!-- Search + Filters -->
    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search Input -->
        <div class="flex-1">
          <label for="search" class="sr-only">Buscar treino</label>
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nome..."
              class="input pl-10"
            />
          </div>
        </div>

        <!-- Type Filter -->
        <div class="sm:w-44">
          <label for="type-filter" class="sr-only">Filtrar por tipo</label>
          <select
            id="type-filter"
            v-model="typeFilter"
            class="input"
          >
            <option value="">Todos os tipos</option>
            <option value="strength">Força</option>
            <option value="cardio">Cardio</option>
            <option value="hiit">HIIT</option>
            <option value="flexibility">Flexibilidade</option>
            <option value="mixed">Misto</option>
          </select>
        </div>

        <!-- Difficulty Filter -->
        <div class="sm:w-44">
          <label for="difficulty-filter" class="sr-only">Filtrar por dificuldade</label>
          <select
            id="difficulty-filter"
            v-model="difficultyFilter"
            class="input"
          >
            <option value="">Todas</option>
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
          </select>
        </div>

        <!-- Sort -->
        <div class="sm:w-48">
          <label for="sort" class="sr-only">Ordenar por</label>
          <select
            id="sort"
            v-model="sortBy"
            class="input"
          >
            <option value="created_date">Mais recentes</option>
            <option value="name">Nome (A-Z)</option>
            <option value="last_used">Último uso</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Results count -->
    <p class="text-sm text-slate-400">
      {{ filteredWorkouts.length }} treino{{ filteredWorkouts.length !== 1 ? 's' : '' }} encontrado{{ filteredWorkouts.length !== 1 ? 's' : '' }}
    </p>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card p-5 animate-pulse">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="h-5 bg-dark-600 rounded w-1/3 mb-3" />
            <div class="flex gap-2 mb-3">
              <div class="h-5 bg-dark-600 rounded-full w-16" />
              <div class="h-5 bg-dark-600 rounded-full w-20" />
            </div>
            <div class="h-4 bg-dark-700 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>

    <!-- Workout List or Empty State -->
    <template v-else>
      <WorkoutEmptyState
        v-if="filteredWorkouts.length === 0"
        :title="searchQuery || typeFilter || difficultyFilter ? 'Nenhum treino encontrado' : 'Nenhum treino ainda'"
        :description="searchQuery || typeFilter || difficultyFilter ? 'Tente ajustar seus filtros de busca.' : 'Comece criando seu primeiro treino ou explore nossos templates recomendados.'"
        :primary-action="searchQuery || typeFilter || difficultyFilter ? undefined : { label: 'Criar Treino', to: '/workouts/create' }"
        :secondary-action="searchQuery || typeFilter || difficultyFilter ? undefined : { label: 'Ver Recomendados', to: '/workouts/recommended' }"
      />
      <WorkoutList v-else :workouts="filteredWorkouts" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Workout } from '~/types'

definePageMeta({
  layout: 'authenticated',
  middleware: ['auth'],
})

const { useWorkouts } = await import('~/composables/useWorkouts')
const workoutsComposable = useWorkouts()

// ==========================================
// State
// ==========================================

const searchQuery = ref('')
const typeFilter = ref('')
const difficultyFilter = ref('')
const sortBy = ref<'created_date' | 'name' | 'last_used'>('created_date')

// ==========================================
// Data fetching
// ==========================================

onMounted(async () => {
  await workoutsComposable.fetchWorkouts()
})

// ==========================================
// Computed: filtered + sorted workouts
// ==========================================

const filteredWorkouts = computed(() => {
  let result = [...(workoutsComposable.workouts.value as (Workout & { exerciseCount?: number; lastUsedAt?: string })[])]

  // Search filter (case-insensitive)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((w) => w.name.toLowerCase().includes(query))
  }

  // Type filter
  if (typeFilter.value) {
    result = result.filter((w) => w.type === typeFilter.value)
  }

  // Difficulty filter
  if (difficultyFilter.value) {
    result = result.filter((w) => w.difficulty === difficultyFilter.value)
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name, 'pt-BR')
      case 'last_used': {
        const aDate = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0
        const bDate = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0
        return bDate - aDate
      }
      case 'created_date':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  return result
})

const isLoading = computed(() => workoutsComposable.isLoading.value)
</script>
