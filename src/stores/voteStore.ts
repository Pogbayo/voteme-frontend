import { create } from 'zustand'
import { voteApi } from '../api/voteApi'

interface VoteState {
  isLoading: boolean
  error: string | null

  castVote: (candidateId: string, categoryId: string) => Promise<void>
  clearError: () => void
}

export const useVoteStore = create<VoteState>((set) => ({
  votedCategories: [],
  isLoading: false,
  error: null,

  castVote: async (candidateId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await voteApi.castVote(candidateId)
      if (!response.data.success)
        throw new Error(response.data.message)
      set(() => ({
        isLoading: false
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))