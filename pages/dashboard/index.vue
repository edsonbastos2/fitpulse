<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-display font-bold text-white">
          Olá, {{ userName }}! 👋
        </h1>
        <p class="text-slate-400 mt-1">
          {{ greetingMessage }}
        </p>
      </div>

      <NuxtLink to="/workouts/create" class="btn-primary px-6 py-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <span>Novo Treino</span>
      </NuxtLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
            </svg>
          </div>
          <span class="badge badge-primary">+12%</span>
        </div>
        <p class="stat-value">{{ stats.weeklyWorkouts }}</p>
        <p class="stat-label">Treinos esta semana</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="badge badge-secondary">🔥</span>
        </div>
        <p class="stat-value">{{ stats.currentStreak }}</p>
        <p class="stat-label">Dias em sequência</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span class="badge badge-accent">{{ stats.totalCalories }} kcal</span>
        </div>
        <p class="stat-value">{{ formatNumber(stats.totalVolume) }}</p>
        <p class="stat-label">Volume total (kg)</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
          </div>
        </div>
        <p class="stat-value">{{ stats.totalWorkouts }}</p>
        <p class="stat-label">Treinos feitos</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Today's Workout -->
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-display font-bold text-white">Treino de Hoje</h2>
          <NuxtLink to="/schedule" class="text-sm text-primary-400 hover:text-primary-300">
            Ver agenda →
          </NuxtLink>
        </div>

        <div v-if="todayWorkout" class="card card-hover p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-white">{{ todayWorkout.name }}</h3>
              <p class="text-slate-400 text-sm mt-1">{{ todayWorkout.description }}</p>
            </div>
            <span class="badge badge-primary">{{ todayWorkout.type }}</span>
          </div>

          <div class="flex items-center gap-6 mb-6">
            <div class="flex items-center gap-2 text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ todayWorkout.duration }} min</span>
            </div>
            <div class="flex items-center gap-2 text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <span>{{ todayWorkout.exerciseCount }} exercícios</span>
            </div>
          </div>

          <!-- Exercise Preview -->
          <div class="space-y-3 mb-6">
            <div
              v-for="(exercise, index) in todayWorkout.exercises.slice(0, 3)"
              :key="exercise.id"
              class="flex items-center gap-4 p-3 rounded-xl bg-dark-700/50"
            >
              <div class="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-sm">
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <p class="font-medium text-white">{{ exercise.name }}</p>
                <p class="text-xs text-slate-400">{{ exercise.sets }} séries × {{ exercise.reps }} reps</p>
              </div>
            </div>
            <p v-if="todayWorkout.exercises.length > 3" class="text-sm text-slate-500 text-center">
              +{{ todayWorkout.exercises.length - 3 }} mais
            </p>
          </div>

          <NuxtLink
            :to="`/workouts/${todayWorkout.id}/start`"
            class="btn-primary w-full py-4"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Iniciar Treino</span>
          </NuxtLink>
        </div>

        <div v-else class="card p-8 text-center">
          <div class="w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-white mb-2">Nenhum treino hoje</h3>
          <p class="text-slate-400 mb-6">Que tal criar um novo treino ou escolher um recomendado?</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink to="/workouts/create" class="btn-primary">
              Criar Treino
            </NuxtLink>
            <NuxtLink to="/workouts/recommended" class="btn-ghost">
              Ver Recomendados
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Progress -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div>
          <h2 class="text-xl font-display font-bold text-white mb-4">Ações Rápidas</h2>
          <div class="space-y-3">
            <NuxtLink
              to="/workouts"
              class="card card-hover p-4 flex items-center gap-4"
            >
              <div class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-white">Meus Treinos</p>
                <p class="text-xs text-slate-400">{{ myWorkoutsCount }} treinos salvos</p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/exercises"
              class="card card-hover p-4 flex items-center gap-4"
            >
              <div class="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-white">Biblioteca de Exercícios</p>
                <p class="text-xs text-slate-400">500+ exercícios</p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/progress"
              class="card card-hover p-4 flex items-center gap-4"
            >
              <div class="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-white">Meu Progresso</p>
                <p class="text-xs text-slate-400">Acompanhe sua evolução</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Weekly Goal -->
        <div>
          <h2 class="text-xl font-display font-bold text-white mb-4">Meta Semanal</h2>
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-slate-400">Treinos</span>
              <span class="text-white font-medium">{{ stats.weeklyWorkouts }}/{{ weeklyGoal }}</span>
            </div>
            <div class="progress-bar mb-2">
              <div
                class="progress-fill"
                :style="{ width: `${Math.min((stats.weeklyWorkouts / weeklyGoal) * 100, 100)}%` }"
              ></div>
            </div>
            <p class="text-sm text-slate-500">
              {{ weeklyGoal - stats.weeklyWorkouts > 0
                ? `${weeklyGoal - stats.weeklyWorkouts} treinos para atingir a meta`
                : 'Meta atingida! 🎉'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-display font-bold text-white">Atividade Recente</h2>
        <NuxtLink to="/progress" class="text-sm text-primary-400 hover:text-primary-300">
          Ver histórico →
        </NuxtLink>
      </div>

      <div class="space-y-4">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="card p-4 flex items-center gap-4"
        >
          <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="getActivityColor(activity.type)">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-medium text-white">{{ activity.title }}</p>
            <p class="text-sm text-slate-400">{{ activity.description }}</p>
          </div>
          <span class="text-sm text-slate-500">{{ activity.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'authenticated',
  middleware: ['auth'],
})

const { user } = useSupabaseUser()

const userName = computed(() => {
  return user.value?.user_metadata?.name?.split(' ')[0] || 'Atleta'
})

const greetingMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia! Pronto para treinar?'
  if (hour < 18) return 'Boa tarde! Hora de suar!'
  return 'Boa noite! Bora treinar?'
})

const stats = reactive({
  weeklyWorkouts: 3,
  currentStreak: 7,
  totalVolume: 12500,
  totalWorkouts: 48,
  totalCalories: 8500,
})

const weeklyGoal = 5

const myWorkoutsCount = 12

const todayWorkout = ref({
  id: '1',
  name: 'Treino de Costas e Bíceps',
  description: 'Hipertrofia com foco em costas',
  type: 'strength',
  duration: 60,
  exerciseCount: 8,
  exercises: [
    { id: '1', name: 'Puxada Frontal', sets: 4, reps: 12 },
    { id: '2', name: 'Remada Curvada', sets: 4, reps: 10 },
    { id: '3', name: 'Pulldown', sets: 3, reps: 12 },
    { id: '4', name: 'Rosca Direta', sets: 3, reps: 12 },
    { id: '5', name: 'Rosca Alternada', sets: 3, reps: 10 },
  ],
})

const recentActivity = [
  {
    id: '1',
    type: 'workout',
    title: 'Treino de Peito Finalizado',
    description: '60 min • 450 kcal',
    time: 'Há 2 horas',
  },
  {
    id: '2',
    type: 'streak',
    title: 'Sequência de 7 dias! 🔥',
    description: 'Você está muito consistente',
    time: 'Ontem',
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Nova conquista desbloqueada',
    description: 'Primeiro PR no supino',
    time: 'Há 3 dias',
  },
]

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'workout':
      return 'bg-gradient-primary'
    case 'streak':
      return 'bg-gradient-secondary'
    case 'achievement':
      return 'bg-accent-500'
    default:
      return 'bg-dark-600'
  }
}
</script>
