<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Mobile Header -->
    <header class="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700">
      <div class="flex items-center justify-between px-4 h-16">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
            </svg>
          </div>
          <span class="font-display font-bold text-lg text-white">FitPulse</span>
        </NuxtLink>

        <button
          class="btn-icon"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <nav v-if="isMobileMenuOpen" class="px-4 py-4 space-y-2 border-t border-dark-700">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === item.to }"
            @click="isMobileMenuOpen = false"
          >
            <component :is="getIcon(item.icon)" class="w-5 h-5" />
            <span>{{ item.label }}</span>
            <span v-if="item.badge" class="ml-auto badge badge-primary">{{ item.badge }}</span>
          </NuxtLink>
        </nav>
      </Transition>
    </header>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-dark-800 bg-dark-900/50 backdrop-blur-sm">
      <!-- Logo -->
      <div class="p-6 border-b border-dark-800">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
            </svg>
          </div>
          <div>
            <span class="font-display font-bold text-xl text-white">FitPulse</span>
            <p class="text-xs text-slate-500">Seu app de treinos</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ 'nav-link-active': isActive(item.to) }"
        >
          <component :is="getIcon(item.icon)" class="w-5 h-5" />
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="ml-auto badge badge-primary">{{ item.badge }}</span>
        </NuxtLink>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-dark-800">
        <div class="card p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-bold">
              {{ userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-white truncate">{{ user?.name || 'Usuário' }}</p>
              <p class="text-xs text-slate-400 truncate">{{ user?.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
      <div class="container-app py-6 lg:py-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  CalendarIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const user = useSupabaseUser()

const isMobileMenuOpen = ref(false)

const navigation = computed(() => [
  { label: 'Dashboard', icon: 'home', to: '/dashboard' },
  { label: 'Treinos', icon: 'dumbbell', to: '/workouts' },
  { label: 'Exercícios', icon: 'exercises', to: '/exercises' },
  { label: 'Agenda', icon: 'calendar', to: '/schedule' },
  { label: 'Progresso', icon: 'chart', to: '/progress' },
  { label: 'Perfil', icon: 'user', to: '/profile' },
  { label: 'Configurações', icon: 'settings', to: '/settings' },
])

const userInitials = computed(() => {
  const name = (user.value?.user_metadata?.name as string) || 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const iconMap: Record<string, unknown> = {
  home: HomeIcon,
  dumbbell: WrenchScrewdriverIcon,
  exercises: WrenchScrewdriverIcon,
  calendar: CalendarIcon,
  chart: ChartBarIcon,
  user: UserIcon,
  settings: Cog6ToothIcon,
}

const getIcon = (name: string) => {
  return iconMap[name] || HomeIcon
}
</script>
