<template>
  <div
    v-if="showSwitcher"
    class="role-switcher"
  >
    <p class="text-xs text-slate-400 mb-2 font-medium">
      Visualizando como:
    </p>
    <div
      role="radiogroup"
      :aria-label="'Alternar entre perfis de usuário'"
      class="flex flex-wrap gap-2"
    >
      <button
        v-for="roleOption in availableRoles"
        :key="roleOption.slug"
        type="button"
        role="radio"
        :aria-checked="isActive(roleOption.slug)"
        :aria-label="roleOption.name"
        :class="[
          'role-option-btn',
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
          'transition-all duration-200 cursor-pointer border',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900',
          isActive(roleOption.slug) ? getActiveClasses(roleOption.slug) : getInactiveClasses(roleOption.slug),
        ]"
        @click="handleRoleSelect(roleOption.slug)"
      >
        <span
          class="w-2 h-2 rounded-full flex-shrink-0"
          :class="getDotColor(roleOption.slug)"
        />
        <span>{{ roleOption.name }}</span>
        <CheckIcon
          v-if="isActive(roleOption.slug)"
          class="w-3.5 h-3.5 flex-shrink-0"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Role } from '~/utils/role-constants'
import { ROLES } from '~/utils/role-constants'
import { CheckIcon } from '@heroicons/vue/24/solid'

interface RoleOption {
  slug: Role
  name: string
  color: 'primary' | 'secondary' | 'accent'
}

// Mapeamento de roles para exibição
const ROLE_DISPLAY_MAP: Record<Role, RoleOption> = {
  [ROLES.USER]: {
    slug: ROLES.USER,
    name: 'Usuário',
    color: 'secondary', // verde
  },
  [ROLES.PERSONAL_TRAINER]: {
    slug: ROLES.PERSONAL_TRAINER,
    name: 'Personal Trainer',
    color: 'primary', // indigo
  },
  [ROLES.SUPERADMIN]: {
    slug: ROLES.SUPERADMIN,
    name: 'Admin',
    color: 'accent', // rose
  },
}

const { roles, activeRole, setActiveRole } = useRoles()

// Só exibe o switcher quando usuário tem mais de 1 role
const showSwitcher = computed(() => roles.value.length > 1)

const availableRoles = computed<RoleOption[]>(() =>
  roles.value
    .map((role) => ROLE_DISPLAY_MAP[role])
    .filter((option): option is RoleOption => option !== undefined)
)

const isActive = (role: Role): boolean => activeRole.value === role

const handleRoleSelect = (role: Role) => {
  if (!isActive(role)) {
    setActiveRole(role)
  }
}

// Classes visuais para role ativo
const getActiveClasses = (role: Role): string => {
  const colorMap: Record<Role, string> = {
    [ROLES.USER]: 'bg-secondary-500/20 border-secondary-500 text-secondary-400 focus:ring-secondary-500',
    [ROLES.PERSONAL_TRAINER]: 'bg-primary-500/20 border-primary-500 text-primary-400 focus:ring-primary-500',
    [ROLES.SUPERADMIN]: 'bg-accent-500/20 border-accent-500 text-accent-400 focus:ring-accent-500',
  }
  return colorMap[role] || colorMap[ROLES.USER]
}

// Classes visuais para role inativo
const getInactiveClasses = (role: Role): string => {
  const colorMap: Record<Role, string> = {
    [ROLES.USER]: 'bg-dark-800 border-dark-700 text-slate-400 hover:border-secondary-500/50 hover:text-secondary-400 focus:ring-secondary-500',
    [ROLES.PERSONAL_TRAINER]: 'bg-dark-800 border-dark-700 text-slate-400 hover:border-primary-500/50 hover:text-primary-400 focus:ring-primary-500',
    [ROLES.SUPERADMIN]: 'bg-dark-800 border-dark-700 text-slate-400 hover:border-accent-500/50 hover:text-accent-400 focus:ring-accent-500',
  }
  return colorMap[role] || colorMap[ROLES.USER]
}

// Cor do dot indicador
const getDotColor = (role: Role): string => {
  const colorMap: Record<Role, string> = {
    [ROLES.USER]: 'bg-secondary-500',
    [ROLES.PERSONAL_TRAINER]: 'bg-primary-500',
    [ROLES.SUPERADMIN]: 'bg-accent-500',
  }
  return colorMap[role] || colorMap[ROLES.USER]
}
</script>

<style scoped>
.role-switcher {
  padding: 0.75rem;
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 0.75rem;
}

.role-option-btn {
  user-select: none;
}

.role-option-btn[aria-checked='true'] {
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.15);
}
</style>
