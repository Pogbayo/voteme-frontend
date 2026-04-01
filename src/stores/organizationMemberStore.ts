import { create } from 'zustand'
import { organizationMemberApi } from '../api/organizationMemberApi'
import type { JoinOrgDto, OrganizationMemberDto, PendingMemberDto } from '../types/member.types'
import { useOrganizationStore } from './organizationStore'

interface MemberState {
  members: OrganizationMemberDto[]
  pendingMembers: PendingMemberDto[]
  isLoading: boolean
  error: string | null
  isUpdated: boolean
  isDeleted: boolean

  getMembers: (organizationId: string, page?: number, pageSize?: number) => Promise<void>
  getPendingMembers: (organizationId: string) => Promise<void>
  approveMember: (organizationId: string, userId: string) => Promise<void>
  rejectMember: (organizationId: string, userId: string) => Promise<void>
  removeMember: (organizationId: string, userId: string) => Promise<void>
  promoteToAdmin: (organizationId: string, userId: string) => Promise<void>
  demoteFromAdmin: (organizationId: string, userId: string) => Promise<void>
  joinOrganization: (dto: JoinOrgDto) => Promise<void>
  leaveOrganization: (organizationId: string) => Promise<void>
  clearError: () => void
}

const getMembersAction = async (set: any, organizationId: string, page?: number, pageSize?: number) => {
  set({ isLoading: true, error: null })
  try {
    const response = await organizationMemberApi.getMembers(organizationId, page, pageSize)
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.message)
    set({ members: response.data.data, isLoading: false })
  } catch (error: any) {
    set({ error: error.response?.data?.message ?? error.message, isLoading: false })
    throw error
  }
}

const getPendingMembersAction = async (set: any, organizationId: string) => {
  set({ isLoading: true, error: null })
  try {
    const response = await organizationMemberApi.getPendingMembers(organizationId)
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.message)
    set({ pendingMembers: response.data.data, isLoading: false })
  } catch (error: any) {
    set({ error: error.response?.data?.message ?? error.message, isLoading: false })
    throw error
  }
}


export const useOrganizationMemberStore = create<MemberState>((set) => ({
  members: [],
  pendingMembers: [],
  isLoading: false,
  error: null,
  isUpdated: false,
  isDeleted: false,

  getMembers: async (organizationId, page, pageSize) => {
     await getMembersAction(set, organizationId, page, pageSize)
  },

  getPendingMembers: async (organizationId) => {
   await getPendingMembersAction(set,organizationId)
  },

approveMember: async (organizationId, userId) => {
  set({ isLoading: true, error: null, isUpdated: false })
  try {
    const response = await organizationMemberApi.approve(organizationId, userId)
    if (!response.data.success)
      throw new Error(response.data.message)
    set((state) => ({
      pendingMembers: state.pendingMembers.filter(m => m.userId !== userId),
      isLoading: false,
      isUpdated: true
    }))
      await getMembersAction(set, organizationId)
  } catch (error: any) {
    set({ error: error.response?.data?.message ?? error.message, isLoading: false })
    throw error
  }
},
 
rejectMember: async (organizationId, userId) => {
    set({ isLoading: true, error: null, isDeleted: false })
    try {
      const response = await organizationMemberApi.reject(organizationId, userId)
      if (!response.data.success)
        throw new Error(response.data.message)
      set((state) => ({
        pendingMembers: state.pendingMembers.filter(m => m.userId !== userId),
        isLoading: false,
        isDeleted: true
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  removeMember: async (organizationId, userId) => {
    set({ isLoading: true, error: null, isDeleted: false })
    try {
      const response = await organizationMemberApi.removeMember(organizationId, userId)
      if (!response.data.success)
        throw new Error(response.data.message)
      set((state) => ({
        members: state.members.filter(m => m.userId !== userId),
        isLoading: false,
        isDeleted: true
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  promoteToAdmin: async (organizationId, userId) => {
    set({ isLoading: true, error: null, isUpdated: false })
    try {
      const response = await organizationMemberApi.promoteToAdmin(organizationId, userId)
      if (!response.data.success)
        throw new Error(response.data.message)
      set((state) => ({
        members: state.members.map(m => m.userId === userId ? { ...m, role: 'admin' } : m), 
        isLoading: false,
        isUpdated: true
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  demoteFromAdmin: async (organizationId, userId) => {
    set({ isLoading: true, error: null, isUpdated: false })
    try {
      const response = await organizationMemberApi.demoteFromAdmin(organizationId, userId)
      if (!response.data.success)
        throw new Error(response.data.message)
      set((state) => ({
        members: state.members.map(m => m.userId === userId ? { ...m, role: 'member' } : m), // Adjust based on DTO
        isLoading: false,
        isUpdated: true
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  joinOrganization: async (dto:JoinOrgDto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await organizationMemberApi.join(dto)
      if (!response.data.success)
        throw new Error(response.data.message)
      set({ isLoading: false })
      await useOrganizationStore.getState().getUserOrganizations()
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  leaveOrganization: async (organizationId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await organizationMemberApi.leave(organizationId)
      if (!response.data.success)
        throw new Error(response.data.message)

      const orgStore = useOrganizationStore.getState()
      orgStore.deleteOrganization(organizationId)

      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))