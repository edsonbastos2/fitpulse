export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/workouts', '/exercises', '/profile', '/settings', '/schedule', '/progress']

  const isProtectedRoute = protectedRoutes.some((route) => to.path.startsWith(route))

  if (isProtectedRoute && !user.value) {
    return navigateTo('/auth/login')
  }

  // Redirect logged-in users away from auth pages
  const authRoutes = ['/auth/login', '/auth/register']
  const isAuthRoute = authRoutes.includes(to.path)

  if (isAuthRoute && user.value) {
    return navigateTo('/dashboard')
  }

  // Load user roles when navigating to protected routes (only once per session)
  if (isProtectedRoute && user.value) {
    const { loadRoles, roles } = useRoles()
    if (roles.value.length === 0) {
      await loadRoles()
    }
  }
})
