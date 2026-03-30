import { create } from 'zustand';
import { electionCategoryApi } from '../api/electionCategoryApi';
import type { CreateElectionCategoryDto, ElectionCategoryDto, ElectionCategoryResultDto, UpdateElectionCategoryDto } from '../types/category.types';

interface ElectionCategoryState {
  loading: boolean;
  error: string | null;
  category: ElectionCategoryDto | null;
  categories: ElectionCategoryDto[];
  isUpdated: boolean;
  isDeleted: boolean;
  electionCategoryResults: ElectionCategoryResultDto | null;
  getElectionCategory: (electionCategoryId: string) => Promise<void>;
  createElectionCategory: (dto: CreateElectionCategoryDto) => Promise<void>;
  updateElectionCategory: (electionCategoryId: string, dto: UpdateElectionCategoryDto) => Promise<void>;
  deleteElectionCategory: (electionCategoryId: string) => Promise<void>;
  getElectionCategories: (electionId: string) => Promise<void>;
  getElectionCategoryResults: (electionCategoryId: string) => Promise<void>;
  clearError: () => void;
}

export const useElectionCategoryStore = create<ElectionCategoryState>((set) => ({
  loading: false,
  error: null,
  category: null,
  isDeleted: false,
  isUpdated: false,
  categories: [],
  electionCategoryResults: null,

  getElectionCategory: async (electionCategoryId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await electionCategoryApi.getById(electionCategoryId);
      if (!response.data.success || !response.data) throw new Error(response.data.message);
      set({ category: response.data.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false });
      throw error;
    }
  },

  createElectionCategory: async (dto: CreateElectionCategoryDto) => {
    set({ loading: true, error: null });
    try {
      const response = await electionCategoryApi.create(dto);
      if (!response.data.success) throw new Error(response.data.message);
      set({ category: response.data.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false });
      throw error;
    }
  },

  updateElectionCategory: async (electionCategoryId: string, dto: UpdateElectionCategoryDto) => {
    set({ loading: true, error: null });
    try {
      const response = await electionCategoryApi.update(electionCategoryId, dto);
      if (!response.data.success) throw new Error(response.data.message);
      set({ isUpdated: response.data.success, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false });
      throw error;
    }
  },

  deleteElectionCategory: async (electionCategoryId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await electionCategoryApi.delete(electionCategoryId);
      if (!response.data.success) throw new Error(response.data.message);
      set((state) => ({
        categories: state.categories.filter(c => c.id !== electionCategoryId),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false });
      throw error;
    }
  },

  getElectionCategories: async (electionId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await electionCategoryApi.getByElection(electionId);
      if (!response.data.success || !response.data) throw new Error(response.data.message);
      set({ categories: response.data.data ?? [], loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false });
      throw error;
    }
  },

  getElectionCategoryResults: async (electionCategoryId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await electionCategoryApi.getElectionCategoryResults(electionCategoryId);
      if (!response.data.success || !response.data) throw new Error(response.data.message);
      set({ electionCategoryResults: response.data.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));