import { useElectionCategoryStore } from '../stores/electionCategoryStore'

export const useElectionCategory = () => {
  const category = useElectionCategoryStore((state) => state.category)
  const categories = useElectionCategoryStore((state) => state.categories)
  const electionCategoryResults = useElectionCategoryStore((state) => state.electionCategoryResults)
  const loading = useElectionCategoryStore((state) => state.loading)
  const error = useElectionCategoryStore((state) => state.error)
  const isUpdated = useElectionCategoryStore((state) => state.isUpdated)
  const isDeleted = useElectionCategoryStore((state) => state.isDeleted)
  const getElectionCategory = useElectionCategoryStore((state) => state.getElectionCategory)
  const createElectionCategory = useElectionCategoryStore((state) => state.createElectionCategory)
  const updateElectionCategory = useElectionCategoryStore((state) => state.updateElectionCategory)
  const deleteElectionCategory = useElectionCategoryStore((state) => state.deleteElectionCategory)
  const getElectionCategories = useElectionCategoryStore((state) => state.getElectionCategories)
  const getElectionCategoryResults = useElectionCategoryStore((state) => state.getElectionCategoryResults)
  const clearError = useElectionCategoryStore((state) => state.clearError)

  return {
    category,
    categories,
    electionCategoryResults,
    loading,
    error,
    isUpdated,
    isDeleted,
    getElectionCategory,
    createElectionCategory,
    updateElectionCategory,
    deleteElectionCategory,
    getElectionCategories,
    getElectionCategoryResults,
    clearError,
  }
}