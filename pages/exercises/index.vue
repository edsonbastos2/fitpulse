<template>
  <div class="space-y-6 animate-fade-in">
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
import type { ExerciseFilters, MuscleGroup, Equipment, ExerciseQueryParams } from '~/types'
import { useDebounceFn } from '@vueuse/core'

definePageMeta({
  layout: 'authenticated',
  middleware: ['auth', 'role-guard'],
  requiredRoles: ['user', 'personal_trainer', 'superadmin'],
})

useHead({
  title: 'Catálogo de Exercícios | FitPulse',
})

const route = useRoute()
const router = useRouter()

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

// Valid values for validation
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard']
const VALID_TYPES = ['compound', 'cardio', 'isolation']
const VALID_SORTS = ['name_asc', 'name_desc', 'difficulty']

const hasActiveFilters = computed(() => {
  return !!(
    filters.value.search ||
    filters.value.difficulty ||
    filters.value.muscleGroup ||
    filters.value.equipment ||
    filters.value.type
  )
})

// Flag to prevent URL update loop when restoring from URL
let isRestoringFromUrl = false

/**
 * Sync URL query params → filters state
 */
watch(
  () => route.query,
  (newQuery) => {
    const q = newQuery as ExerciseQueryParams
    const restoredFilters: ExerciseFilters = {}

    // Search
    if (q.search && typeof q.search === 'string' && q.search.trim()) {
      restoredFilters.search = q.search.trim()
      searchTerm.value = q.search.trim()
    }

    // Difficulty (validate)
    if (q.difficulty && typeof q.difficulty === 'string' && VALID_DIFFICULTIES.includes(q.difficulty)) {
      restoredFilters.difficulty = q.difficulty as ExerciseFilters['difficulty']
    }

    // Muscle group
    if (q.muscleGroup && typeof q.muscleGroup === 'string' && q.muscleGroup.trim()) {
      restoredFilters.muscleGroup = q.muscleGroup.trim()
    }

    // Equipment
    if (q.equipment && typeof q.equipment === 'string' && q.equipment.trim()) {
      restoredFilters.equipment = q.equipment.trim()
    }

    // Type (validate)
    if (q.type && typeof q.type === 'string' && VALID_TYPES.includes(q.type)) {
      restoredFilters.type = q.type as ExerciseFilters['type']
    }

    // Sort (validate)
    if (q.sort && typeof q.sort === 'string' && VALID_SORTS.includes(q.sort)) {
      restoredFilters.sort = q.sort as ExerciseFilters['sort']
      sortValue.value = q.sort
    }

    // Page (convert to number, validate > 0)
    if (q.page) {
      const pageNum = parseInt(q.page as string, 10)
      if (!isNaN(pageNum) && pageNum > 0) {
        restoredFilters.page = pageNum
      }
    }

    isRestoringFromUrl = true
    filters.value = restoredFilters
    isRestoringFromUrl = false

    // Fetch data with restored filters
    fetchExercisesPaginated(restoredFilters)
  },
  { deep: true, immediate: true }
)

/**
 * Sync filters state → URL query params (debounced)
 */
const updateUrlFromFilters = useDebounceFn(() => {
  if (isRestoringFromUrl) return

  const f = filters.value
  const query: Record<string, string> = {}

  if (f.search) query.search = f.search
  if (f.difficulty) query.difficulty = f.difficulty
  if (f.muscleGroup) query.muscleGroup = f.muscleGroup
  if (f.equipment) query.equipment = f.equipment
  if (f.type) query.type = f.type
  if (f.sort) query.sort = f.sort
  if (f.page && f.page > 1) query.page = String(f.page)

  router.replace({ query })
}, 300)

watch(filters, updateUrlFromFilters, { deep: true })

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

// Load initial data (muscle groups + equipment maps)
onMounted(async () => {
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
})

// Handle error
if (error.value) {
  console.error('[exercises page] Error loading exercises:', error.value)
}
</script>
