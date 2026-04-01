export type MembershipStatus = 0 | 1 | 2 | 3 // 0=Pending, 1=Approved, 2=Rejected, 3=Banned

export interface OrganizationMemberDto {
  userId: string
  organizationId:string
  fullName: string
  email: string
  isAdmin: boolean
  joinedAt: string
}

export interface PendingMemberDto {
  userId: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  joinedAt: string
  status: MembershipStatus
}

export interface JoinOrgDto {
  uniqueKey: string
  displayName:string
}