import type { User, UserProfile } from '~/types'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const profile = useState<UserProfile | null>('user-profile', () => null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

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
      return data
    } catch (err: any) {
      error.value = err.message
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
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  // Sign out
  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) throw signOutError

    profile.value = null
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
  }
}
