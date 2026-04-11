<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-lg">
      <!-- Card -->
      <UiCard variant="gradient" padding="lg" rounded="2xl">
        <!-- Alert Icon -->
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 rounded-full bg-accent-500/10 flex items-center justify-center">
            <ExclamationTriangleIcon class="w-10 h-10 text-accent-500" aria-hidden="true" />
          </div>
        </div>

        <!-- Title -->
        <h1
          class="text-2xl font-bold text-white text-center mb-2"
          role="alert"
          aria-live="assertive"
        >
          Acesso Restrito
        </h1>

        <!-- Description -->
        <p class="text-slate-400 text-center mb-6">
          Você não tem permissão para acessar esta página.
          <template v-if="requiredRoleNames.length > 0">
            É necessário um dos perfis abaixo para continuar:
          </template>
        </p>

        <!-- Required Roles -->
        <div v-if="requiredRoleNames.length > 0" class="mb-6">
          <p class="text-sm text-slate-500 text-center mb-3">
            Perfis necessários:
          </p>
          <div class="flex flex-wrap justify-center gap-2" role="list" aria-label="Perfis necessários">
            <span
              v-for="roleName in requiredRoleNames"
              :key="roleName"
              class="px-4 py-2 rounded-full text-sm font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20"
              role="listitem"
            >
              {{ roleName }}
            </span>
          </div>
        </div>

        <!-- Your Roles -->
        <div v-if="userRoleNames.length > 0" class="mb-6">
          <p class="text-sm text-slate-500 text-center mb-3">
            Seu perfil atual:
          </p>
          <div class="flex flex-wrap justify-center gap-2" role="list" aria-label="Seus perfis">
            <span
              v-for="roleName in userRoleNames"
              :key="roleName"
              class="px-4 py-2 rounded-full text-sm font-semibold bg-secondary-500/10 text-secondary-400 border border-secondary-500/20"
              role="listitem"
            >
              {{ roleName }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <UiButton
            variant="primary"
            size="md"
            full-width
            @click="handleUpgrade"
            aria-label="Solicitar upgrade de perfil"
          >
            <ArrowUpCircleIcon class="w-5 h-5" aria-hidden="true" />
            Solicitar Upgrade
          </UiButton>

          <UiButton
            variant="ghost"
            size="md"
            full-width
            @click="handleBack"
            aria-label="Voltar ao dashboard"
          >
            <ArrowLeftIcon class="w-5 h-5" aria-hidden="true" />
            Voltar ao Dashboard
          </UiButton>
        </div>

        <!-- Help Text -->
        <p class="text-xs text-slate-600 text-center mt-6">
          Precisa de ajuda? Entre em contato com o suporte.
        </p>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Role } from '~/utils/role-constants'
import { ExclamationTriangleIcon, ArrowUpCircleIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Acesso Restrito | FitPulse',
})

const route = useRoute()
const router = useRouter()
const { hasAnyRole, roles } = useRoles()

// Parse required roles from query params
const requiredRolesRaw = (route.query.required as string) || ''
const requiredRoles = requiredRolesRaw ? (requiredRolesRaw.split(',').filter(Boolean) as Role[]) : []

// Role name mapping (slug → legível)
const ROLE_NAMES: Record<string, string> = {
  user: 'Usuário Final',
  personal_trainer: 'Personal Trainer',
  superadmin: 'Administrador',
}

const requiredRoleNames = requiredRoles.map(slug => ROLE_NAMES[slug] || slug)

// User's current role names
const userRoleNames = roles.value.map(slug => ROLE_NAMES[slug] || slug)

// Audit log
console.warn(
  '[access-denied] Página acessada:',
  `roles_atuais: [${roles.value.join(', ') || 'nenhum'}]`,
  `roles_requeridos: [${requiredRoles.join(', ') || 'não especificado'}]`,
  `rota_original: ${route.query.redirect || 'não informada'}`
)

const handleUpgrade = () => {
  // Placeholder: redirect para rota de upgrade
  // Quando o PRD de Monetização for criado, apontar para /upgrade ou /billing
  router.push('/dashboard')
}

const handleBack = () => {
  // Tenta voltar à rota original se o usuário tiver permissão
  const redirectPath = route.query.redirect as string
  if (redirectPath) {
    // Se usuário ganhou permissão, vai para redirect
    // Senão, vai para dashboard
    if (hasAnyRole(requiredRoles)) {
      router.push(redirectPath)
    } else {
      router.push('/dashboard')
    }
  } else {
    router.push('/dashboard')
  }
}
</script>
