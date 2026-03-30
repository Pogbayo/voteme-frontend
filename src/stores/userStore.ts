import { create } from 'zustand'
import type { UpdateUserDto, UserDto } from '../types/user.types'
import { userApi } from '../api/userApi'

interface UserState {
  loading: boolean
  error: string | null
  user: UserDto | null
  users: UserDto[]
  getUser: (userId: string) => Promise<void>
  updateUser: (userId: string, dto: UpdateUserDto) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  getAllOrganizationUsers: (organizationId: string, page?: number, pageSize?: number) => Promise<void>
  clearError: () => void
}

export const useUserStore = create<UserState>((set) => ({
  loading: false,
  error: null,
  user: null,
  users: [],

  getUser: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await userApi.getById(userId)
      if (!response.data.success || !response.data) throw new Error(response.data.message)
      set({ user: response.data.data, loading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false })
      throw error
    }
  },

  updateUser: async (userId: string, dto: UpdateUserDto) => {
    set({ loading: true, error: null })
    try {
      const response = await userApi.update(userId, dto)
      if (!response.data.success) throw new Error(response.data.message)
      set({ user: response.data.data, loading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false })
      throw error
    }
  },

  deleteUser: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await userApi.delete(userId)
      if (!response.data.success) throw new Error(response.data.message)
      set((state) => ({
        users: state.users.filter(u => u.id !== userId),
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false })
      throw error
    }
  },

  getAllOrganizationUsers: async (organizationId: string, page = 1, pageSize = 20) => {
    set({ loading: true, error: null })
    try {
      const response = await userApi.getOrganizationUsers(organizationId, page, pageSize)
      if (!response.data.success || !response.data.data) throw new Error(response.data.message)
      set({ users: response.data.data || [], loading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, loading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))