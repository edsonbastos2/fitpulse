import type { RouteLocationNormalized } from 'vue-router'
import type { Role } from '~/utils/role-constants'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  const { hasAnyRole, roles } = useRoles()

  const requiredRoles = to.meta.requiredRoles as Role[] | undefined

  if (!requiredRoles || requiredRoles.length === 0) {
    // Rota não exige role específico
    return
  }

  if (!hasAnyRole(requiredRoles)) {
    // Log de auditoria
    const user = useSupabaseUser()
    console.warn(
      '[role-guard] Acesso negado:',
      `user_id: ${user.value?.id ?? 'null'}`,
      `rota: ${to.fullPath}`,
      `roles_atuais: [${roles.value.join(', ') || 'nenhum'}]`,
      `roles_requeridos: [${requiredRoles.join(', ')}]`
    )

    return navigateTo({
      path: '/access-denied',
      query: {
        required: requiredRoles.join(','),
        redirect: to.fullPath,
      },
    })
  }
})
