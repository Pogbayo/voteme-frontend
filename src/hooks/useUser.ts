import { useUserStore } from '../stores/userStore'

export const useUser = () => {
  const user = useUserStore((state) => state.user)
  const users = useUserStore((state) => state.users)
  const loading = useUserStore((state) => state.loading)
  const error = useUserStore((state) => state.error)
  const getUser = useUserStore((state) => state.getUser)
  const updateUser = useUserStore((state) => state.updateUser)
  const deleteUser = useUserStore((state) => state.deleteUser)
  const getAllOrganizationUsers = useUserStore((state) => state.getAllOrganizationUsers)
  const clearError = useUserStore((state) => state.clearError)

  return {
    user,
    users,
    loading,
    error,
    getUser,
    updateUser,
    deleteUser,
    getAllOrganizationUsers,
    clearError,
  }
}