export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  firstName: string
  lastName: string
  displayName: string
  uniqueKey: string
  email: string
  password: string
}

export interface AuthResponseDto {
  firstName: string
  lastName: string
  displayName?: string
  userId: string
  accessToken: string
  email: string
}
