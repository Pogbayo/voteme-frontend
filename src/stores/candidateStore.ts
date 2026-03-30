import { create } from 'zustand'
import { candidateApi } from '../api/candidateApi'
import type { CandidateDto, CreateCandidateDto, UpdateCandidateDto } from '../types/candidate.types'

interface CandidateState {
  candidates: CandidateDto[]
  currentCandidate: CandidateDto | null
  isLoading: boolean
  error: string | null

  getCandidate: (id: string) => Promise<void>
  getCategoryCandidates: (categoryId: string) => Promise<void>
  createCandidate: (dto: CreateCandidateDto) => Promise<void>
  updateCandidate: (id: string, dto: UpdateCandidateDto) => Promise<void>
  deleteCandidate: (id: string) => Promise<void>
  clearError: () => void
}

export const useCandidateStore = create<CandidateState>((set) => ({
  candidates: [],
  currentCandidate: null,
  isLoading: false,
  error: null,

  getCandidate: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await candidateApi.getById(id)
      if (!response.data.success || !response.data.data)
        throw new Error(response.data.message)
      set({ currentCandidate: response.data.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  getCategoryCandidates: async (categoryId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await candidateApi.getByCategory(categoryId)
      if (!response.data.success || !response.data.data)
        throw new Error(response.data.message)
      set({ candidates: response.data.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  createCandidate: async (dto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await candidateApi.create(dto)
      if (!response.data.success || !response.data.data)
        throw new Error(response.data.message)
      set((state) => ({
        candidates: [...state.candidates, response.data.data!],
        isLoading: false
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  updateCandidate: async (id, dto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await candidateApi.update(id, dto)
      if (!response.data.success)
        throw new Error(response.data.message)
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  deleteCandidate: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await candidateApi.delete(id)
      if (!response.data.success)
        throw new Error(response.data.message)
      set((state) => ({
        candidates: state.candidates.filter(c => c.id !== id),
        isLoading: false
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))