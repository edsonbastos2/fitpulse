<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-8">
      <div class="skeleton rounded-xl h-12 w-48" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="skeleton rounded-2xl aspect-video" />
        <div class="grid grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="skeleton rounded-xl h-24" />
        </div>
      </div>
      <div class="skeleton rounded-xl h-48" />
      <div class="skeleton rounded-xl h-64" />
    </div>

    <!-- Content -->
    <template v-else-if="exercise">
      <!-- Header -->
      <ExerciseDetailHeader
        :exercise="exercise"
        :muscle-group-map="muscleGroupMap"
        @go-back="router.push('/exercises')"
      />

      <!-- Media + Meta Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExerciseDetailMedia :exercise="exercise" />
        <ExerciseMeta
          :exercise="exercise"
          :equipment-map="equipmentMap"
        />
      </div>

      <!-- Muscle Map -->
      <ExerciseMuscleMap
        :primary-muscles="primaryMuscles"
        :secondary-muscles="secondaryMuscles"
      />

      <!-- Instructions -->
      <ExerciseInstructions :exercise="exercise" />

      <!-- Related Exercises -->
      <ExerciseRelatedList
        :related-exercises="relatedExercises"
        :muscle-group-map="muscleGroupMap"
        :equipment-map="equipmentMap"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Exercise, MuscleGroup, Equipment } from '~/types'

definePageMeta({
  layout: 'authenticated',
  middleware: ['auth', 'role-guard'],
  requiredRoles: ['user', 'personal_trainer', 'superadmin'],
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const {
  fetchExercise,
  fetchRelatedExercises,
  fetchMuscleGroups,
  fetchEquipment,
} = useExercises()

const exercise = ref<Exercise | null>(null)
const relatedExercises = ref<Exercise[]>([])
const isLoading = ref(true)

// Maps for resolving UUIDs to names
const muscleGroupMap = ref<Record<string, string>>({})
const equipmentMap = ref<Record<string, string>>({})

// Resolved muscle lists
const primaryMuscles = computed<MuscleGroup[]>(() => {
  if (!exercise.value) return []
  const ids = exercise.value.primary_muscles ?? []
  return ids.map((id) => ({ id, name_pt: muscleGroupMap.value[id] || id, name: id, category: 'primary' as const })).filter(m => m.name_pt !== m.id)
})

const secondaryMuscles = computed<MuscleGroup[]>(() => {
  if (!exercise.value) return []
  const ids = exercise.value.secondary_muscles ?? []
  return ids.map((id) => ({ id, name_pt: muscleGroupMap.value[id] || id, name: id, category: 'secondary' as const })).filter(m => m.name_pt !== m.id)
})

onMounted(async () => {
  const id = route.params.id as string
  if (!id) {
    router.replace('/exercises')
    return
  }

  isLoading.value = true

  try {
    // Fetch reference data (muscles & equipment) first to build maps
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

    // Fetch exercise details
    const data = await fetchExercise(id)
    
    if (!data) {
      toast.error('Exercício não encontrado')
      router.replace('/exercises')
      return
    }

    exercise.value = data as Exercise

    // Fetch related exercises
    const related = await fetchRelatedExercises(id, { limit: 4 })
    relatedExercises.value = related || []

    // Update page title
    useHead({
      title: `${exercise.value.name_pt} | Catálogo de Exercícios`,
    })
  } catch (err) {
    console.error('[exercise-details] Error loading exercise:', err)
    toast.error('Erro ao carregar exercício')
    router.replace('/exercises')
  } finally {
    isLoading.value = false
  }
})
</script>
