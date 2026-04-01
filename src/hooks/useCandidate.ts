import { useCandidateStore } from '../stores/candidateStore'

export const useCandidate = () => {
  const candidates = useCandidateStore((state) => state.candidates)
  const currentCandidate = useCandidateStore((state) => state.currentCandidate)
  const isLoading = useCandidateStore((state) => state.isLoading)
  const error = useCandidateStore((state) => state.error)
  const getCandidate = useCandidateStore((state) => state.getCandidate)
  const getCategoryCandidates = useCandidateStore((state) => state.getCategoryCandidates)
  const createCandidate = useCandidateStore((state) => state.createCandidate)
  const updateCandidate = useCandidateStore((state) => state.updateCandidate)
  const deleteCandidate = useCandidateStore((state) => state.deleteCandidate)
  const clearError = useCandidateStore((state) => state.clearError)

  return {
    candidates,
    currentCandidate,
    isLoading,
    error,
    getCandidate,
    getCategoryCandidates,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    clearError,
  }
}