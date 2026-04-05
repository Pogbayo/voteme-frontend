import type { OrgRoleType } from "../constants/roles"

export type MembershipStatus = 0 | 1 | 2 | 3 // 0=Pending, 1=Approved, 2=Removed, 3=Rejected

export interface OrganizationMemberDto {
  userId: string
  organizationId:string
  fullName: string
  email: string
  role: OrgRoleType
  status: MembershipStatus
  joinedAt: string
}

export interface PendingMemberDto {
  userId: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  status: MembershipStatus
  joinedAt: string
}

export interface JoinOrgDto {
  uniqueKey: string
  displayName:string
}