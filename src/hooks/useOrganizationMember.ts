import { useOrganizationMemberStore } from '../stores/organizationMemberStore'

export const useOrganizationMember = () => {
  const members = useOrganizationMemberStore((state) => state.members)
  const pendingMembers = useOrganizationMemberStore((state) => state.pendingMembers)
  const isLoading = useOrganizationMemberStore((state) => state.isLoading)
  const isMembersLoading = useOrganizationMemberStore((state) => state.isMembersLoading)
  const isPendingMembersLoading = useOrganizationMemberStore((state) => state.isPendingMembersLoading)
  const actionLoadingUserId = useOrganizationMemberStore((state) => state.actionLoadingUserId)
  const actionLoadingType = useOrganizationMemberStore((state) => state.actionLoadingType)
  const error = useOrganizationMemberStore((state) => state.error)
  const isUpdated = useOrganizationMemberStore((state) => state.isUpdated)
  const isDeleted = useOrganizationMemberStore((state) => state.isDeleted)
  const getMembers = useOrganizationMemberStore((state) => state.getMembers)
  const getPendingMembers = useOrganizationMemberStore((state) => state.getPendingMembers)
  const approveMember = useOrganizationMemberStore((state) => state.approveMember)
  const rejectMember = useOrganizationMemberStore((state) => state.rejectMember)
  const removeMember = useOrganizationMemberStore((state) => state.removeMember)
  const promoteToAdmin = useOrganizationMemberStore((state) => state.promoteToAdmin)
  const demoteFromAdmin = useOrganizationMemberStore((state) => state.demoteFromAdmin)
  const joinOrganization = useOrganizationMemberStore((state) => state.joinOrganization)
  const leaveOrganization = useOrganizationMemberStore((state) => state.leaveOrganization)
  const clearError = useOrganizationMemberStore((state) => state.clearError)
  const memberShip = useOrganizationMemberStore((state) => state.memberShip)
  const getOrganizationMembership = useOrganizationMemberStore((state) => state.getOrganizationMembership)  
  return {
    members,
    pendingMembers,
    isLoading,
    isMembersLoading,
    isPendingMembersLoading,
    actionLoadingUserId,
    actionLoadingType,
    error,
    isUpdated,
    isDeleted,
    memberShip,
     getOrganizationMembership,
    getMembers,
    getPendingMembers,
    approveMember,
    rejectMember,
    removeMember,
    promoteToAdmin,
    demoteFromAdmin,
    joinOrganization,
    leaveOrganization,
    clearError,
  }
}
