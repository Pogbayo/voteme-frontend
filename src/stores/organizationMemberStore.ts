import { create } from 'zustand'
import { organizationMemberApi } from '../api/organizationMemberApi'
import type { JoinOrgDto, OrganizationMemberDto, PendingMemberDto } from '../types/organizationMember.types'
import { useOrganizationStore } from './organizationStore'

const MEMBER_REQUEST_DEDUPE_MS = 2000
let lastPendingMembersRequestKey = ''
let lastPendingMembersRequestAt = 0
let lastMembersRequestKey = ''
let lastMembersRequestAt = 0
let lastMembershipRequestKey = ''
let lastMembershipRequestAt = 0

interface MemberState {
  members: OrganizationMemberDto[]
  pendingMembers: PendingMemberDto[]
  isLoading: boolean
  isMembersLoading: boolean
  isPendingMembersLoading: boolean
  actionLoadingUserId: string | null
  actionLoadingType: 'approve' | 'reject' | 'remove' | 'promote' | 'demote' | null
  error: string | null
  isUpdated: boolean
  isDeleted: boolean
  memberShip: OrganizationMemberDto | null
  getOrganizationMembership: (organizationId: string, userId: string) => Promise<void>
  clearMembers: () => void
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

const getMembersAction = async (
  set: any,
  organizationId: string,
  page?: number,
  pageSize?: number,
  force = false
) => {
  const requestKey = `${organizationId}:${page ?? 1}:${pageSize ?? 20}`
  const now = Date.now()

  if (
    !force &&
    requestKey === lastMembersRequestKey &&
    now - lastMembersRequestAt < MEMBER_REQUEST_DEDUPE_MS
  ) {
    return
  }

  lastMembersRequestKey = requestKey
  lastMembersRequestAt = now
  set({ isLoading: true, isMembersLoading: true, error: null })
  try {
    const response = await organizationMemberApi.getMembers(organizationId, page, pageSize)
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.message)
    set({ members: response.data.data, isLoading: false, isMembersLoading: false })
  } catch (error: any) {
    set({
      error: error.response?.data?.message ?? error.message,
      isLoading: false,
      isMembersLoading: false,
    })
    throw error
  }
}

const getPendingMembersAction = async (set: any, organizationId: string, force = false) => {
  const now = Date.now()

  if (
    !force &&
    organizationId === lastPendingMembersRequestKey &&
    now - lastPendingMembersRequestAt < MEMBER_REQUEST_DEDUPE_MS
  ) {
    return
  }

  lastPendingMembersRequestKey = organizationId
  lastPendingMembersRequestAt = now
  set({ isLoading: true, isPendingMembersLoading: true, error: null })
  try {
    const response = await organizationMemberApi.getPendingMembers(organizationId)
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.message)
    set({ pendingMembers: response.data.data, isLoading: false, isPendingMembersLoading: false })
  } catch (error: any) {
    set({
      error: error.response?.data?.message ?? error.message,
      isLoading: false,
      isPendingMembersLoading: false,
    })
    throw error
  }
}


export const useOrganizationMemberStore = create<MemberState>((set) => ({
  members: [],
  pendingMembers: [],
  isLoading: false,
  isMembersLoading: false,
  isPendingMembersLoading: false,
  actionLoadingUserId: null,
  actionLoadingType: null,
  error: null,
  isUpdated: false,
  isDeleted: false,
  memberShip: null,
  getMembers: async (organizationId, page, pageSize) => {
     await getMembersAction(set, organizationId, page, pageSize)
  },

  getPendingMembers: async (organizationId) => {
   await getPendingMembersAction(set,organizationId)
  },

approveMember: async (organizationId, userId) => {
  set({
    isLoading: true,
    error: null,
    isUpdated: false,
    actionLoadingUserId: userId,
    actionLoadingType: 'approve',
  })
  try {
    const response = await organizationMemberApi.approve(organizationId, userId)
    if (!response.data.success)
      throw new Error(response.data.message)
    set((state) => ({
      pendingMembers: state.pendingMembers.filter(m => m.userId !== userId),
      isLoading: false,
      isUpdated: true
    }))
      await getMembersAction(set, organizationId, undefined, undefined, true)
      await getPendingMembersAction(set, organizationId, true)
      set({ actionLoadingUserId: null, actionLoadingType: null })
  } catch (error: any) {
    set({
      error: error.response?.data?.message ?? error.message,
      isLoading: false,
      actionLoadingUserId: null,
      actionLoadingType: null,
    })
    throw error
  }
},
 
rejectMember: async (organizationId, userId) => {
    set({
      isLoading: true,
      error: null,
      isDeleted: false,
      actionLoadingUserId: userId,
      actionLoadingType: 'reject',
    })
    try {
      const response = await organizationMemberApi.reject(organizationId, userId)
      if (!response.data.success)
        throw new Error(response.data.message)
      set((state) => ({
        pendingMembers: state.pendingMembers.filter(m => m.userId !== userId),
        isLoading: false,
        isDeleted: true
      }))
      await getPendingMembersAction(set, organizationId, true)
      set({ actionLoadingUserId: null, actionLoadingType: null })
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? error.message,
        isLoading: false,
        actionLoadingUserId: null,
        actionLoadingType: null,
      })
      throw error
    }
  },

  removeMember: async (organizationId, userId) => {
    set({
      isLoading: true,
      error: null,
      isDeleted: false,
      actionLoadingUserId: userId,
      actionLoadingType: 'remove',
    })
    try {
      const response = await organizationMemberApi.removeMember(organizationId, userId)
      if (!response.data.success)
        throw new Error(response.data.message)
      set((state) => ({
        members: state.members.filter(m => m.userId !== userId),
        isLoading: false,
        isDeleted: true,
        actionLoadingUserId: null,
        actionLoadingType: null,
      }))
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? error.message,
        isLoading: false,
        actionLoadingUserId: null,
        actionLoadingType: null,
      })
      throw error
    }
  },

  getOrganizationMembership: async (organizationId, userId) => {
    const requestKey = `${organizationId}:${userId}`
    const now = Date.now()

    if (
      requestKey === lastMembershipRequestKey &&
      now - lastMembershipRequestAt < MEMBER_REQUEST_DEDUPE_MS
    ) {
      return
    }

    lastMembershipRequestKey = requestKey
    lastMembershipRequestAt = now
    set({ isLoading: true, error: null })
    try {
      const response = await organizationMemberApi.getMemberShip(organizationId, userId)
      set({ memberShip: response.data.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message ?? error.message, isLoading: false })
      throw error
    }
  },

  promoteToAdmin: async (organizationId, userId) => {
    set({
      isLoading: true,
      error: null,
      isUpdated: false,
      actionLoadingUserId: userId,
      actionLoadingType: 'promote',
    })
    try {
      const response = await organizationMemberApi.promoteToAdmin(organizationId, userId)
      if (!response.data.success)
        throw new Error(response.data.message)
      set((state) => ({
        members: state.members.map(m => m.userId === userId ? { ...m, role: 1 } : m), 
        isLoading: false,
        isUpdated: true,
        actionLoadingUserId: null,
        actionLoadingType: null,
      }))
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? error.message,
        isLoading: false,
        actionLoadingUserId: null,
        actionLoadingType: null,
      })
      throw error
    }
  },

  demoteFromAdmin: async (organizationId, userId) => {
    set({
      isLoading: true,
      error: null,
      isUpdated: false,
      actionLoadingUserId: userId,
      actionLoadingType: 'demote',
    })
    try {
      const response = await organizationMemberApi.demoteFromAdmin(organizationId, userId)
      if (!response.data.success)
        throw new Error(response.data.message)
      set((state) => ({
        members: state.members.map(m => m.userId === userId ? { ...m, role: 0 } : m), // Adjust based on DTO
        isLoading: false,
        isUpdated: true,
        actionLoadingUserId: null,
        actionLoadingType: null,
      }))
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? error.message,
        isLoading: false,
        actionLoadingUserId: null,
        actionLoadingType: null,
      })
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
  clearMembers: () => set({
  members: [],
  pendingMembers: [],
  isMembersLoading: false,
  isPendingMembersLoading: false,
  actionLoadingUserId: null,
  actionLoadingType: null,
  error: null,
}),
}))
