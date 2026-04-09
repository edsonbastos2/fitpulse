<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Mobile Navbar -->
    <LayoutNavbar :nav-items="navigation" />

    <!-- Desktop Sidebar -->
    <LayoutSidebar :nav-items="navigation" />

    <!-- Main Content -->
    <main class="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
      <div class="container-app py-6 lg:py-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NavItem } from '~/types'

const navigation = computed<NavItem[]>(() => [
  { label: 'Dashboard', icon: 'home', to: '/dashboard' },
  { label: 'Treinos', icon: 'dumbbell', to: '/workouts' },
  { label: 'Exercícios', icon: 'exercises', to: '/exercises' },
  { label: 'Agenda', icon: 'calendar', to: '/schedule' },
  { label: 'Progresso', icon: 'chart', to: '/progress' },
  { label: 'Perfil', icon: 'user', to: '/profile' },
  { label: 'Configurações', icon: 'settings', to: '/settings' },
])
</script>
