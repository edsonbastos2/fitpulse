import type { Role, Permission } from '~/utils/role-constants'
import { ROLES, ROLE_PERMISSIONS } from '~/utils/role-constants'

export const useRoles = () => {
  const user = useSupabaseUser()
  const roles = useState<Role[]>('user-roles', () => [])

  const hasRole = (role: Role): boolean => roles.value.includes(role)

  const hasAnyRole = (requiredRoles: Role[]): boolean =>
    requiredRoles.some((role) => roles.value.includes(role))

  const can = (permission: Permission): boolean => {
    return roles.value.some((role) =>
      ROLE_PERMISSIONS[role]?.includes(permission)
    )
  }

  const activeRole = useState<Role>('active-role', () => ROLES.USER)

  const setActiveRole = (role: Role) => {
    if (hasRole(role)) {
      activeRole.value = role
    }
  }

  // Helper: carrega roles do banco para o estado compartilhado
  const loadRoles = async (): Promise<Role[]> => {
    if (!user.value) {
      roles.value = []
      return []
    }

    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('user_roles')
      .select('roles(slug)')
      .eq('user_id', user.value.id)

    if (error) {
      console.error('useRoles: failed to load roles:', error.message)
      roles.value = []
      return []
    }

    const userRoles = (data ?? []).map((r: { roles: { slug: Role } }) => r.roles.slug)
    roles.value = userRoles

    // Definir activeRole: prioridade superadmin > personal_trainer > user
    if (userRoles.includes(ROLES.SUPERADMIN)) {
      activeRole.value = ROLES.SUPERADMIN
    } else if (userRoles.includes(ROLES.PERSONAL_TRAINER)) {
      activeRole.value = ROLES.PERSONAL_TRAINER
    } else if (userRoles.includes(ROLES.USER)) {
      activeRole.value = ROLES.USER
    }

    return userRoles
  }

  // Helper: limpar roles (logout)
  const clearRoles = () => {
    roles.value = []
    activeRole.value = ROLES.USER
  }

  return {
    roles,
    hasRole,
    hasAnyRole,
    can,
    activeRole,
    setActiveRole,
    loadRoles,
    clearRoles,
  }
}
