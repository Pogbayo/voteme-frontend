import type { OrgRoleType } from "../constants/roles"

export interface UserDto {
  id: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  roles: string[]
  createdAt: string
}

export interface OrganizationUserDto {
  id: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  role:  OrgRoleType
  createdAt: string
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  displayName?: string
}

export interface PagedUserResult {
  users: UserDto[]
  totalCount: number
}