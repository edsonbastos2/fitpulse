<template>
  <aside
    class="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-dark-800 bg-dark-900/50 backdrop-blur-sm"
    role="navigation"
    aria-label="Menu principal"
  >
    <!-- Logo -->
    <div class="p-6 border-b border-dark-800">
      <NuxtLink to="/" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Navegação">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        :class="{ 'nav-link-active': isActive(item.to) }"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <component :is="getIcon(item.icon)" class="w-5 h-5" aria-hidden="true" />
        <span>{{ item.label }}</span>
        <span v-if="item.badge" class="ml-auto badge badge-primary" aria-label="Notificação: {{ item.badge }}">
          {{ item.badge }}
        </span>
      </NuxtLink>
    </nav>

    <!-- User Section -->
    <div class="p-4 border-t border-dark-800">
      <div class="card p-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-bold"
            aria-hidden="true"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-white truncate">{{ userName }}</p>
            <p class="text-xs text-slate-400 truncate">{{ userEmail }}</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { NavItem } from '~/types'

interface Props {
  navItems: NavItem[]
}

defineProps<Props>()

const route = useRoute()
const user = useSupabaseUser()
const { getIcon } = useNavigationIcons()

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const userInitials = computed(() => {
  const name = (user.value?.user_metadata?.name as string) || 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const userName = computed(() => {
  return (user.value?.user_metadata?.name as string) || 'Usuário'
})

const userEmail = computed(() => {
  return (user.value?.user_metadata?.email as string) || ''
})
</script>
