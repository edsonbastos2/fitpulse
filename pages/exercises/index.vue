<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-display font-bold text-white">
        Catálogo de Exercícios
      </h1>
      <p class="text-slate-400 mt-1">
        Explore nossa biblioteca completa de exercícios com instruções detalhadas
      </p>
    </div>

    <div class="flex gap-6">
      <!-- Desktop Sidebar Filters -->
      <ExerciseFilters
        :filters="filters"
        :mobile-open="isDrawerOpen"
        @update:filters="handleFilterChange"
        @update:mobile-open="isDrawerOpen = $event"
        @clear="handleClearFilters"
      />

      <!-- Main Content -->
      <main class="flex-1 min-w-0">
        <!-- Controls Bar -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div class="flex-1 w-full">
            <ExerciseSearchBar
              v-model="searchTerm"
              placeholder="Buscar exercício..."
            />
          </div>
          <ExerciseSortSelect
            v-model="sortValue"
          />
        </div>

        <!-- Loading State -->
        <ExerciseSkeletonGrid
          v-if="isLoading && exercises.length === 0"
          :count="9"
        />

        <!-- Empty State -->
        <ExerciseEmptyState
          v-else-if="!isLoading && exercises.length === 0"
          message="Nenhum exercício encontrado"
          suggestion="Tente ajustar seus filtros ou termos de busca"
          :show-clear-button="hasActiveFilters"
          @clear-filters="handleClearFilters"
        />

        <!-- Exercise Grid -->
        <ExerciseGrid
          v-else
          :exercises="exercises"
          :muscle-group-map="muscleGroupMap"
          :equipment-map="equipmentMap"
        />

        <!-- Pagination -->
        <ExercisePagination
          v-if="!isLoading && totalExercises > perPage"
          :current-page="currentPage"
          :total-exercises="totalExercises"
          :per-page="perPage"
          @load-more="handleLoadMore"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExerciseFilters, MuscleGroup, Equipment } from '~/types'

definePageMeta({
  layout: 'authenticated',
  middleware: ['auth', 'role-guard'],
  requiredRoles: ['user', 'personal_trainer', 'superadmin'],
})

useHead({
  title: 'Catálogo de Exercícios | FitPulse',
})

const {
  exercises,
  totalExercises,
  currentPage,
  perPage,
  isLoading,
  error,
  fetchExercisesPaginated,
  fetchMuscleGroups,
  fetchEquipment,
} = useExercises()

// Filter state
const filters = ref<ExerciseFilters>({})
const searchTerm = ref('')
const sortValue = ref('name_asc')
const isDrawerOpen = ref(false)

// Maps for resolving UUIDs to names
const muscleGroupMap = ref<Record<string, string>>({})
const equipmentMap = ref<Record<string, string>>({})

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchTerm, (newValue) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.value = { ...filters.value, search: newValue || undefined, page: 1 }
    applyFilters()
  }, 300)
})

// Watch sort value
watch(sortValue, (newValue) => {
  filters.value = { ...filters.value, sort: newValue as ExerciseFilters['sort'], page: 1 }
  applyFilters()
})

const hasActiveFilters = computed(() => {
  return !!(
    filters.value.search ||
    filters.value.difficulty ||
    filters.value.muscleGroup ||
    filters.value.equipment ||
    filters.value.type
  )
})

const applyFilters = async () => {
  await fetchExercisesPaginated(filters.value)
}

const handleFilterChange = (updatedFilters: ExerciseFilters) => {
  filters.value = { ...updatedFilters, page: 1 }
  applyFilters()
}

const handleClearFilters = () => {
  filters.value = {}
  searchTerm.value = ''
  sortValue.value = 'name_asc'
  applyFilters()
}

const handleLoadMore = () => {
  filters.value = { ...filters.value, page: currentPage.value + 1 }
  applyFilters()
}

// Load initial data
onMounted(async () => {
  // Fetch muscle groups and equipment for maps
  const [groups, equips] = await Promise.all([
    fetchMuscleGroups(),
    fetchEquipment(),
  ])

  if (groups) {
    (groups as MuscleGroup[]).forEach((mg) => {
      muscleGroupMap.value[mg.id] = mg.name_pt
    })
  }

  if (equips) {
    (equips as Equipment[]).forEach((eq) => {
      equipmentMap.value[eq.id] = eq.name_pt
    })
  }

  // Fetch initial exercises
  await applyFilters()
})

// Handle error
if (error.value) {
  console.error('[exercises page] Error loading exercises:', error.value)
}
</script>
