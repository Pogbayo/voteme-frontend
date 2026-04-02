import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { organizationApi } from '../api/organizationApi'
import type { OrganizationDto, UpdateOrganizationDto, CreateOrganizationDto } from '../types/organization.types'

interface OrganizationState {
  userOrganizations: OrganizationDto[]
  currentOrganization: OrganizationDto | null
  isLoading: boolean
  error: string | null
  isUpdated: boolean
  isDeleted: boolean

  getUserOrganizations: () => Promise<void>
  createOrganization: (data: CreateOrganizationDto) => Promise<void>
  updateOrganization: (id: string, data: UpdateOrganizationDto) => Promise<void>
  deleteOrganization: (id: string) => Promise<void>
  setCurrentOrganization: (org: OrganizationDto | null) => void
  hydrateOrganization: () => Promise<void>
  clearError: () => void
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      userOrganizations: [],
      currentOrganization: null,
      isLoading: false,
      error: null,
      isUpdated: false,
      isDeleted: false,

      getUserOrganizations: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await organizationApi.getUserOrganizations()
          if (!response.data.success || !response.data.data)
            throw new Error(response.data.message)
          set({ userOrganizations: response.data.data, isLoading: false })

          // Hydrate current organization if stored
          get().hydrateOrganization()
        } catch (error: any) {
          set({ error: error.response?.data?.message ?? error.message, isLoading: false })
          throw error
        }
      },

      hydrateOrganization: async () => {
        const orgId = localStorage.getItem('currentOrganizationId')
        if (!orgId) return

        const state = get()
        const existing = state.userOrganizations.find((o) => o.id === orgId)
        if (existing) {
          set({ currentOrganization: existing })
        } else {
          try {
            const response = await organizationApi.getById(orgId)
            if (response.data.success && response.data.data) {
              set({ currentOrganization: response.data.data })
            }
          } catch {
            set({ currentOrganization: null })
          }
        }
      },
      
        setCurrentOrganization: (org) => {
          if (org === null) {
            localStorage.removeItem('currentOrganizationId')
          } else {
            localStorage.setItem('currentOrganizationId', org.id)
          }
          set({ currentOrganization: org })
        },

      createOrganization: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await organizationApi.create(data)
          if (!response.data.success)
            throw new Error(response.data.message)
          set((state) => ({
            isLoading: false,
            currentOrganization: response.data.data ?? null,
            userOrganizations: response.data.data
              ? [...state.userOrganizations, response.data.data]
              : state.userOrganizations,
            error: null,
            isUpdated: false,
            isDeleted: false,
          }))
        } catch (error: any) {
          set({ error: error.response?.data?.message ?? error.message, isLoading: false })
          throw error
        }
      },

      updateOrganization: async (id, data) => {
        set({ isLoading: true, error: null, isUpdated: false })
        try {
          const formData = new FormData()
          formData.append('name', data.name)
          if (data.description) formData.append('description', data.description)
          if (data.logo) formData.append('logo', data.logo)

          const response = await organizationApi.update(id, formData)
          if (!response.data.success)
            throw new Error(response.data.message)
          set((state) => ({
            userOrganizations: state.userOrganizations.map(o =>
              o.id === id ? { ...o, ...data } : o
            ),
            currentOrganization:
              state.currentOrganization?.id === id
                ? { ...state.currentOrganization, ...data }
                : state.currentOrganization,
            isLoading: false,
            isUpdated: true
          }))
        } catch (error: any) {
          set({ error: error.response?.data?.message ?? error.message, isLoading: false })
          throw error
        }
      },

      deleteOrganization: async (id) => {
        set({ isLoading: true, error: null, isDeleted: false })
        try {
          const response = await organizationApi.delete(id)
          if (!response.data.success)
            throw new Error(response.data.message)
          set((state) => ({
            userOrganizations: state.userOrganizations.filter(o => o.id !== id),
            currentOrganization:
              state.currentOrganization?.id === id ? null : state.currentOrganization,
            isLoading: false,
            isDeleted: true
          }))
          localStorage.removeItem('currentOrganizationId')
        } catch (error: any) {
          set({ error: error.response?.data?.message ?? error.message, isLoading: false })
          throw error
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'organization-storage',
      partialize: (state) => ({
        userOrganizations: state.userOrganizations
      }),
    }
  )
)