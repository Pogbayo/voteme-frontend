import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../api/authApi'
import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
} from '../types/auth.types'

type AuthUser = Omit<AuthResponseDto, 'accessToken'>

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (dto: LoginDto) => Promise<void>
  register: (dto: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (dto) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.login(dto)

          if (!response.data.success || !response.data.data)
            throw new Error(response.data.message)

          const { accessToken, ...user } = response.data.data

          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ??
              error.message ??
              'Login failed',
            isLoading: false,
          })
          throw error
        }
      },

      register: async (dto) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.register(dto)

          if (!response.data.success || !response.data.data)
            throw new Error(response.data.message)

          const { accessToken, ...user } = response.data.data

          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ??
              error.message ??
              'Registration failed',
            isLoading: false,
          })
          throw error
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)