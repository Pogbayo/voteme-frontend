import { create } from 'zustand'
import { electionCategoryApi } from '../api/electionCategoryApi'
import { useElectionStore } from './electionStore'
import type {
  CreateElectionCategoryDto,
  ElectionCategoryDto,
  ElectionCategoryResultDto,
  UpdateElectionCategoryDto,
} from '../types/category.types'

interface ElectionCategoryState {
  loading: boolean
  error: string | null
  category: ElectionCategoryDto | null
  categories: ElectionCategoryDto[]
  isUpdated: boolean
  isDeleted: boolean
  electionCategoryResults: ElectionCategoryResultDto | null

  getElectionCategory: (electionCategoryId: string) => Promise<void>
  createElectionCategory: (dto: CreateElectionCategoryDto) => Promise<void>
  updateElectionCategory: (electionCategoryId: string, dto: UpdateElectionCategoryDto) => Promise<void>
  deleteElectionCategory: (electionCategoryId: string) => Promise<void>
  getElectionCategories: (electionId: string) => Promise<void>
  getElectionCategoryResults: (electionCategoryId: string) => Promise<void>
  clearError: () => void
}

export const useElectionCategoryStore = create<ElectionCategoryState>((set, get) => ({
  loading: false,
  error: null,
  category: null,
  isDeleted: false,
  isUpdated: false,
  categories: [],
  electionCategoryResults: null,

  getElectionCategory: async (electionCategoryId) => {
    set({ loading: true, error: null })
    try {
      const response = await electionCategoryApi.getById(electionCategoryId)
      if (!response.data.success || !response.data.data)
        throw new Error(response.data.message)
      set({ category: response.data.data, loading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false })
      throw error
    }
  },

  createElectionCategory: async (dto) => {
    set({ loading: true, error: null })
    try {
      const response = await electionCategoryApi.create(dto)
      if (!response.data.success || !response.data.data)
        throw new Error(response.data.message)

      const newCategory = response.data.data

      // ✅ Add to local categories list
      set((state) => ({
        categories: [...state.categories, newCategory],
        category: newCategory,
        loading: false,
      }))

      // ✅ Sync to election store — update elections list with new category
      useElectionStore.getState().syncCategoryAdded(newCategory.electionId, newCategory)

    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false })
      throw error
    }
  },

  updateElectionCategory: async (electionCategoryId, dto) => {
    set({ loading: true, error: null, isUpdated: false })
    try {
      const response = await electionCategoryApi.update(electionCategoryId, dto)
      if (!response.data.success)
        throw new Error(response.data.message)

      // ✅ Update in local list only — no election list sync needed
      // (count doesn't change, only name/description)
      set((state) => ({
        categories: state.categories.map(c =>
          c.id === electionCategoryId ? { ...c, ...dto } : c
        ),
        isUpdated: true,
        loading: false,
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false })
      throw error
    }
  },

  deleteElectionCategory: async (electionCategoryId) => {
    set({ loading: true, error: null, isDeleted: false })
    try {
      const response = await electionCategoryApi.delete(electionCategoryId)
      if (!response.data.success)
        throw new Error(response.data.message)

      // ✅ Find category before removing so we have the electionId
      const category = get().categories.find(c => c.id === electionCategoryId)

      // ✅ Remove from local list
      set((state) => ({
        categories: state.categories.filter(c => c.id !== electionCategoryId),
        isDeleted: true,
        loading: false,
      }))

      // ✅ Sync to election store — remove category from elections list
      if (category) {
        useElectionStore.getState().syncCategoryDeleted(category.electionId, electionCategoryId)
      }

    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false })
      throw error
    }
  },

  getElectionCategories: async (electionId) => {
    set({ loading: true, error: null })
    try {
      const response = await electionCategoryApi.getByElection(electionId)
      if (!response.data.success || !response.data.data)
        throw new Error(response.data.message)
      set({ categories: response.data.data, loading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false })
      throw error
    }
  },

  getElectionCategoryResults: async (electionCategoryId) => {
    set({ loading: true, error: null })
    try {
      const response = await electionCategoryApi.getElectionCategoryResults(electionCategoryId)
      if (!response.data.success || !response.data.data)
        throw new Error(response.data.message)
      set({ electionCategoryResults: response.data.data, loading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
