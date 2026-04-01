import { useAuthStore } from '../stores/authStore'

export const useAuth = () => {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const logout = useAuthStore((state) => state.logout)
  const clearError = useAuthStore((state) => state.clearError)

  const hasRole = (role: string) => user?.roles?.includes(role) ?? false
  const isOrgAdmin = hasRole('OrgAdmin')
  const isSuperAdmin = hasRole('SuperAdmin')
  const isVoter = hasRole('Voter')

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    hasRole,
    isOrgAdmin,
    isSuperAdmin,
    isVoter,
  }
}