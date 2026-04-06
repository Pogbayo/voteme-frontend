import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { organizationApi } from '../api/organizationApi'
import type { OrganizationDto, UpdateOrganizationDto, CreateOrganizationDto } from '../types/organization.types'
import { useAuthStore } from './authStore'

const getOrgStorageKey = (userId?: string | null) =>
  userId ? `currentOrganizationId:${userId}` : 'currentOrganizationId'

const getSavedOrganizationId = (userId?: string | null) => {
  if (!userId) return localStorage.getItem('currentOrganizationId')

  const scopedKey = getOrgStorageKey(userId)
  const scopedValue = localStorage.getItem(scopedKey)
  if (scopedValue) return scopedValue

  const legacyValue = localStorage.getItem('currentOrganizationId')
  if (legacyValue) {
    localStorage.setItem(scopedKey, legacyValue)
    localStorage.removeItem('currentOrganizationId')
    return legacyValue
  }

  return null
}

const saveOrganizationId = (organizationId: string, userId?: string | null) => {
  localStorage.setItem(getOrgStorageKey(userId), organizationId)
}

const clearSavedOrganizationId = (userId?: string | null) => {
  localStorage.removeItem(getOrgStorageKey(userId))
}

interface OrganizationState {
  userOrganizations: OrganizationDto[]
  currentOrganization: OrganizationDto | null
  isLoading: boolean
  error: string | null
  isUpdated: boolean
  isDeleted: boolean
  totalVotes: number | null
  getUserOrganizations: () => Promise<void>
  getOrganizationVotesCount : (organizationId: string) => Promise<void>
  createOrganization: (data: CreateOrganizationDto) => Promise<void>
  updateOrganization: (id: string, data: UpdateOrganizationDto) => Promise<void>
  deleteOrganization: (id: string) => Promise<void>
  setCurrentOrganization: (org: OrganizationDto | null) => void
  hydrateOrganization: () => Promise<void>
  resetOrganizationSession: () => void
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
      totalVotes: null,

      getUserOrganizations: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await organizationApi.getUserOrganizations()
          if (!response.data.success || !response.data.data)
            throw new Error(response.data.message)
          const organizations = response.data.data
          const userId = useAuthStore.getState().user?.userId
          const storedOrgId = getSavedOrganizationId(userId)
          const existingSelection = storedOrgId
            ? organizations.find((organization) => organization.id === storedOrgId) ?? null
            : null
          const nextOrganization =
            existingSelection ?? (organizations.length === 1 ? organizations[0] : null)

          set({
            userOrganizations: organizations,
            currentOrganization: nextOrganization,
            isLoading: false,
          })

          if (nextOrganization) {
            saveOrganizationId(nextOrganization.id, userId)
          } else {
            clearSavedOrganizationId(userId)
          }
        } catch (error: any) {
          set({ error: error.response?.data?.message ?? error.message, isLoading: false })
          throw error
        }
      },

      hydrateOrganization: async () => {
        const userId = useAuthStore.getState().user?.userId
        const orgId = getSavedOrganizationId(userId)
        const state = get()

        if (!orgId) {
          if (state.userOrganizations.length === 1) {
            const onlyOrganization = state.userOrganizations[0]
            saveOrganizationId(onlyOrganization.id, userId)
            set({ currentOrganization: onlyOrganization })
          } else {
            set({ currentOrganization: null })
          }
          return
        }

        const existing = state.userOrganizations.find((o) => o.id === orgId)
        if (existing) {
          set({ currentOrganization: existing })
        } else {
          clearSavedOrganizationId(userId)
          if (state.userOrganizations.length === 1) {
            const onlyOrganization = state.userOrganizations[0]
            saveOrganizationId(onlyOrganization.id, userId)
            set({ currentOrganization: onlyOrganization })
          } else {
            set({ currentOrganization: null })
          }
        }
      },
      
        setCurrentOrganization: (org) => {
          const userId = useAuthStore.getState().user?.userId
          if (org === null) {
            clearSavedOrganizationId(userId)
          } else {
            saveOrganizationId(org.id, userId)
          }
          set({ currentOrganization: org })
        },

      createOrganization: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await organizationApi.create(data)
          if (!response.data.success)
            throw new Error(response.data.message)
          const newOrganization = response.data.data ?? null
          const userId = useAuthStore.getState().user?.userId
          if (newOrganization) {
            saveOrganizationId(newOrganization.id, userId)
          }
          set((state) => ({
            isLoading: false,
            currentOrganization: newOrganization,
            userOrganizations: newOrganization
              ? [...state.userOrganizations, newOrganization]
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

      getOrganizationVotesCount: async (organizationId) => {
        set({ isLoading: true, error: null })  
        try {
          const response = await organizationApi.getOrganizationVotesCount(organizationId)
          if (!response.data.success || response.data.data === undefined)
            throw new Error(response.data.message)
           set({ totalVotes: response.data.data, isLoading: false })
        } catch (error: any) {
          set({ error: error.response?.data?.message ?? error.message, isLoading: false })
          throw error
        }
      },

      updateOrganization: async (id, data) => {
        set({ isLoading: true, error: null, isUpdated: false })
        try {
          const response = await organizationApi.update(id, data)
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
          const userId = useAuthStore.getState().user?.userId
          set((state) => {
            const remainingOrganizations = state.userOrganizations.filter(o => o.id !== id)
            const nextOrganization =
              state.currentOrganization?.id === id
                ? (remainingOrganizations.length === 1 ? remainingOrganizations[0] : null)
                : state.currentOrganization

            if (nextOrganization) {
              saveOrganizationId(nextOrganization.id, userId)
            } else if (state.currentOrganization?.id === id) {
              clearSavedOrganizationId(userId)
            }

            return {
              userOrganizations: remainingOrganizations,
              currentOrganization: nextOrganization,
              isLoading: false,
              isDeleted: true
            }
          })
        } catch (error: any) {
          set({ error: error.response?.data?.message ?? error.message, isLoading: false })
          throw error
        }
      },

      resetOrganizationSession: () => set({
        currentOrganization: null,
        userOrganizations: [],
        isLoading: false,
        error: null,
      }),

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
