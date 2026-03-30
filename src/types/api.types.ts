export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  errors: string[]
}

export interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message: string
}