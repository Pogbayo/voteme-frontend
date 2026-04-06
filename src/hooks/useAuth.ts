import { useAuthStore } from '../stores/authStore'
import { useOrganizationMember } from './useOrganizationMember'

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
  const { memberShip } = useOrganizationMember()

  const isOrgAdmin = memberShip?.role === 1 || memberShip?.role === 2

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
    isOrgAdmin,
  }
}
