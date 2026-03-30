export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  firstName: string
  lastName: string
  displayName: string
  email: string
  password: string
  uniqueKey: string
}

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface AuthResponseDto {
  firstName: string
  lastName: string
  displayName: string
  userId: string
  accessToken: string
  email: string
  roles: string[]
}