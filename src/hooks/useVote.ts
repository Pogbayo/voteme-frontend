import { useVoteStore } from '../stores/voteStore'

export const useVote = () => {
  const isLoading = useVoteStore((state) => state.isLoading)
  const error = useVoteStore((state) => state.error)
  const castVote = useVoteStore((state) => state.castVote)
  const clearError = useVoteStore((state) => state.clearError)

  return {
    isLoading,
    error,
    castVote,
    clearError,
  }
}