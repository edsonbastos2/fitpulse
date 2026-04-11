import type { UserProfile } from '~/types'
import { ROLES } from '~/utils/role-constants'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const profile = useState<UserProfile | null>('user-profile', () => null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch user roles from user_roles table
  const fetchRoles = async (): Promise<string[]> => {
    if (!user.value) return []

    const { data, error: fetchError } = await supabase
      .from('user_roles')
      .select('roles(slug)')
      .eq('user_id', user.value.id)

    if (fetchError) {
      console.error('useAuth: failed to fetch roles:', fetchError.message)
      return []
    }

    return (data ?? []).map((r: { roles: { slug: string } }) => r.roles.slug)
  }

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user.value) return null

    isLoading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.value.id)
        .single()

      if (fetchError) throw fetchError

      profile.value = data as UserProfile

      // Fetch and populate roles into the shared useRoles state
      const userRoles = await fetchRoles()
      const rolesState = useState<string[]>('user-roles', () => [])
      rolesState.value = userRoles

      // Set active role with priority: superadmin > personal_trainer > user
      const activeRoleState = useState<string>('active-role', () => ROLES.USER)
      if (userRoles.includes(ROLES.SUPERADMIN)) {
        activeRoleState.value = ROLES.SUPERADMIN
      } else if (userRoles.includes(ROLES.PERSONAL_TRAINER)) {
        activeRoleState.value = ROLES.PERSONAL_TRAINER
      } else if (userRoles.includes(ROLES.USER)) {
        activeRoleState.value = ROLES.USER
      }

      return data
    } catch (err: unknown) {
      error.value = (err as Error).message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user.value) return { data: null, error: 'Not authenticated' }

    isLoading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.value.id)
        .select()
        .single()

      if (updateError) throw updateError

      profile.value = data as UserProfile
      return { data, error: null }
    } catch (err: unknown) {
      error.value = (err as Error).message
      return { data: null, error: (err as Error).message }
    } finally {
      isLoading.value = false
    }
  }

  // Sign out
  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) throw signOutError

    profile.value = null
    
    // Clear roles state on logout
    const rolesState = useState<string[]>('user-roles', () => [])
    rolesState.value = []
    const activeRoleState = useState<string>('active-role', () => ROLES.USER)
    activeRoleState.value = ROLES.USER
    
    navigateTo('/')
  }

  return {
    user,
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    signOut,
    fetchRoles,
  }
}
