<template>
  <header
    class="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700"
    role="banner"
  >
    <div class="flex items-center justify-between px-4 h-16">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <slot name="logo">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
            </div>
            <span class="font-display font-bold text-lg text-white">FitPulse</span>
          </NuxtLink>
        </slot>
      </div>

      <!-- Hamburger Toggle -->
      <button
        class="btn-icon"
        :aria-expanded="isOpen"
        :aria-label="isOpen ? 'Fechar menu' : 'Abrir menu'"
        @click="isOpen = !isOpen"
        @keydown.escape="isOpen = false"
      >
        <svg v-if="!isOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Drawer -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav
        v-if="isOpen"
        class="px-4 py-4 space-y-2 border-t border-dark-700"
        role="navigation"
        aria-label="Menu mobile"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ 'nav-link-active': isActive(item.to) }"
          :aria-current="isActive(item.to) ? 'page' : undefined"
          @click="isOpen = false"
        >
          <component :is="getIcon(item.icon)" class="w-5 h-5" aria-hidden="true" />
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="ml-auto badge badge-primary">{{ item.badge }}</span>
        </NuxtLink>

        <!-- Role Switcher -->
        <div class="py-2">
          <RoleSwitcher />
        </div>

        <!-- Custom slot for additional mobile nav items -->
        <slot name="mobile-actions" />
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import type { NavItem } from '~/types'

interface Props {
  navItems: NavItem[]
}

defineProps<Props>()

const route = useRoute()
const { getIcon } = useNavigationIcons()

const isOpen = ref(false)

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Close menu on Escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) {
      isOpen.value = false
    }
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => window.removeEventListener('keydown', handleEscape))
})
</script>
