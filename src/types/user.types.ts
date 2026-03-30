export interface UserDto {
  id: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  roles: string[]
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