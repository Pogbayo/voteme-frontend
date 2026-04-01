import { create } from 'zustand'
import type {
  ElectionDto,
  CreateElectionDto,
  UpdateElectionDto,
  OpenElectionDto,
  ElectionResultDto,  
} from '../types/election.types'

import { electionApi } from '../api/electionApi'


interface ElectionState {
  elections: ElectionDto[]
  currentElection: ElectionDto | null
  electionResults: ElectionResultDto | null
  totalElectionCount: number
  isLoading: boolean
  error: string | null

  getElection: (id: string) => Promise<void>
  getOrganizationElections: (organizationId: string, page?: number, pageSize?: number) => Promise<void>
  createElection: (dto: CreateElectionDto) => Promise<void>
  updateElection: (id: string, dto: UpdateElectionDto) => Promise<void>
  deleteElection: (id: string) => Promise<void>
  openElection: (id: string, dto: OpenElectionDto) => Promise<void>
  getResults: (id: string) => Promise<void>
  clearError: () => void
  clearCurrentElection: () => void
}

export const useElectionStore = create<ElectionState>((set) => ({
  elections: [],
  currentElection: null,
  electionResults: null,
  totalElectionCount: 0,
  isLoading: false,
  error: null,

  getElection: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await electionApi.getById(id)
      if (!response.data.success || !response.data.data)
        throw new Error(response.data.message)
      set({ currentElection: response.data.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  getOrganizationElections: async (organizationId, page, pageSize) => {
    set({ isLoading: true, error: null })
    try {
      const response = await electionApi.getOrganizationElections(organizationId, page, pageSize)
      if (!response.data.success || !response.data.data)
        throw new Error(response.data.message)
      set({
        elections: response.data.data.items,
        totalElectionCount: response.data.data.totalCount,
        isLoading: false
      })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  createElection: async (dto) => {
    set({ isLoading: true, error: null })
    try {
          console.log('Creating election with DTO <electionStore.ts>:', dto);
      const response = await electionApi.create(dto)
      if (!response.data.success || !response.data.data)
        throw new Error(response.data.message)
      set((state) => ({
        elections: [response.data.data!, ...state.elections],
        isLoading: false
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  updateElection: async (id, dto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await electionApi.update(id, dto)
      if (!response.data.success)
        throw new Error(response.data.message)
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  deleteElection: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await electionApi.delete(id)
      if (!response.data.success)
        throw new Error(response.data.message)
      set((state) => ({
        elections: state.elections.filter(e => e.id !== id),
        isLoading: false
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  openElection: async (id, dto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await electionApi.open(id, dto)
      if (!response.data.success)
        throw new Error(response.data.message)
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  getResults: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await electionApi.getResults(id)
      if (!response.data.success || !response.data.data)
        throw new Error(response.data.message)
      set({ electionResults: response.data.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentElection: () => set({ currentElection: null }),
}))