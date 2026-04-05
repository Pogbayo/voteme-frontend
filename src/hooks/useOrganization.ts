import { useOrganizationStore } from '../stores/organizationStore'

export const useOrganization = () => {
  const userOrganizations = useOrganizationStore((state) => state.userOrganizations)
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization)
  const isLoading = useOrganizationStore((state) => state.isLoading)
  const error = useOrganizationStore((state) => state.error)
  const isUpdated = useOrganizationStore((state) => state.isUpdated)
  const isDeleted = useOrganizationStore((state) => state.isDeleted)
  const getUserOrganizations = useOrganizationStore((state) => state.getUserOrganizations)
  const createOrganization = useOrganizationStore((state) => state.createOrganization)
  const updateOrganization = useOrganizationStore((state) => state.updateOrganization)
  const deleteOrganization = useOrganizationStore((state) => state.deleteOrganization)
  const setCurrentOrganization = useOrganizationStore((state) => state.setCurrentOrganization)
  const clearError = useOrganizationStore((state) => state.clearError)
  const totalVotes = useOrganizationStore((state) => state.totalVotes)
  const getOrganizationVotesCount = useOrganizationStore((state) => state.getOrganizationVotesCount)
  return {
    userOrganizations,
    currentOrganization,
    isLoading,
    totalVotes,
    error,
    isUpdated,
    isDeleted,
    getUserOrganizations,
    getOrganizationVotesCount,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    setCurrentOrganization,
    clearError,
  }
}