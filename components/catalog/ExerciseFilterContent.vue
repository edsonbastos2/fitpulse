<template>
  <div class="space-y-4">
    <!-- Difficulty Section -->
    <section class="card-gradient rounded-xl p-4">
      <h3 class="text-sm font-semibold text-white mb-3">Dificuldade</h3>
      <div class="space-y-2">
        <label
          v-for="option in difficultyOptions"
          :key="option.value"
          class="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="radio"
            name="difficulty"
            :value="option.value"
            :checked="filters.difficulty === option.value"
            class="sr-only"
            @change="updateFilter('difficulty', option.value)"
          />
          <span
            class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
            :class="filters.difficulty === option.value
              ? 'border-primary-500 bg-primary-500'
              : 'border-dark-600 group-hover:border-slate-500'"
          >
            <span
              v-if="filters.difficulty === option.value"
              class="w-1.5 h-1.5 rounded-full bg-white"
            />
          </span>
          <span class="text-sm text-slate-300 group-hover:text-white transition-colors">
            {{ option.label }}
          </span>
        </label>
      </div>
    </section>

    <!-- Muscle Group Section -->
    <section class="card-gradient rounded-xl p-4">
      <h3 class="text-sm font-semibold text-white mb-3">Grupo Muscular</h3>
      <label class="sr-only" for="filter-muscle">Selecionar grupo muscular</label>
      <select
        id="filter-muscle"
        :value="filters.muscleGroup ?? ''"
        class="input w-full"
        @change="updateFilter('muscleGroup', ($event.target as HTMLSelectElement).value || undefined)"
      >
        <option value="">Todos</option>
        <option
          v-for="mg in muscleGroups"
          :key="mg.id"
          :value="mg.id"
        >
          {{ mg.name_pt }}
        </option>
      </select>
    </section>

    <!-- Equipment Section -->
    <section class="card-gradient rounded-xl p-4">
      <h3 class="text-sm font-semibold text-white mb-3">Equipamento</h3>
      <label class="sr-only" for="filter-equipment">Selecionar equipamento</label>
      <select
        id="filter-equipment"
        :value="filters.equipment ?? ''"
        class="input w-full"
        @change="updateFilter('equipment', ($event.target as HTMLSelectElement).value || undefined)"
      >
        <option value="">Todos</option>
        <option
          v-for="eq in equipment"
          :key="eq.id"
          :value="eq.id"
        >
          {{ eq.name_pt }}
        </option>
      </select>
    </section>

    <!-- Type Section -->
    <section class="card-gradient rounded-xl p-4">
      <h3 class="text-sm font-semibold text-white mb-3">Tipo</h3>
      <div class="space-y-2">
        <label
          v-for="option in typeOptions"
          :key="option.value"
          class="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="radio"
            name="type"
            :value="option.value"
            :checked="filters.type === option.value"
            class="sr-only"
            @change="updateFilter('type', option.value)"
          />
          <span
            class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
            :class="filters.type === option.value
              ? 'border-primary-500 bg-primary-500'
              : 'border-dark-600 group-hover:border-slate-500'"
          >
            <span
              v-if="filters.type === option.value"
              class="w-1.5 h-1.5 rounded-full bg-white"
            />
          </span>
          <span class="text-sm text-slate-300 group-hover:text-white transition-colors">
            {{ option.label }}
          </span>
        </label>
      </div>
    </section>

    <!-- Clear Button -->
    <button
      type="button"
      class="btn-ghost w-full py-2.5 text-sm"
      @click="$emit('clear')"
    >
      Limpar Filtros
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ExerciseFilters, MuscleGroup, Equipment } from '~/types'

interface Props {
  filters: ExerciseFilters
  muscleGroups: MuscleGroup[]
  equipment: Equipment[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update': [value: ExerciseFilters]
  'clear': []
}>()

const difficultyOptions = [
  { label: 'Todos', value: undefined },
  { label: 'Fácil', value: 'easy' as const },
  { label: 'Médio', value: 'medium' as const },
  { label: 'Difícil', value: 'hard' as const },
]

const typeOptions = [
  { label: 'Todos', value: undefined },
  { label: 'Composto', value: 'compound' as const },
  { label: 'Isolado', value: 'isolation' as const },
  { label: 'Cardio', value: 'cardio' as const },
]

const updateFilter = <K extends keyof ExerciseFilters>(key: K, value: ExerciseFilters[K]) => {
  // Para selects com valor vazio, usar undefined
  const emitValue = value === '' ? undefined : value
  emit('update', { ...props.filters, [key]: emitValue })
}
</script>
