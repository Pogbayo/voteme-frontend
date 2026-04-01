import { useElectionStore } from '../stores/electionStore'

export const useElection = () => {
  const elections = useElectionStore((state) => state.elections)
  const currentElection = useElectionStore((state) => state.currentElection)
  const electionResults = useElectionStore((state) => state.electionResults)
  const totalElectionCount = useElectionStore((state) => state.totalElectionCount)
  const isLoading = useElectionStore((state) => state.isLoading)
  const error = useElectionStore((state) => state.error)
  const getElection = useElectionStore((state) => state.getElection)
  const getOrganizationElections = useElectionStore((state) => state.getOrganizationElections)
  const createElection = useElectionStore((state) => state.createElection)
  const updateElection = useElectionStore((state) => state.updateElection)
  const deleteElection = useElectionStore((state) => state.deleteElection)
  const openElection = useElectionStore((state) => state.openElection)
  const getResults = useElectionStore((state) => state.getResults)
  const clearError = useElectionStore((state) => state.clearError)
  const clearCurrentElection = useElectionStore((state) => state.clearCurrentElection)

  return {
    elections,
    currentElection,
    electionResults,
    totalElectionCount,
    isLoading,
    error,
    getElection,
    getOrganizationElections,
    createElection,
    updateElection,
    deleteElection,
    openElection,
    getResults,
    clearError,
    clearCurrentElection,
  }
}