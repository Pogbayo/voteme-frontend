import axiosInstance from './axiosInstance'
import type { ApiResponse } from '../types/api.types'
import type {LoginDto, RegisterDto, AuthResponseDto} from '../types/auth.types'

class AuthApi {
  login(dto: LoginDto) {
    return axiosInstance.post<ApiResponse<AuthResponseDto>>('/auth/login', dto);
  }

  register(dto: RegisterDto) {
    return axiosInstance.post<ApiResponse<AuthResponseDto>>('/auth/register', dto);
  }

  logout() {
    return axiosInstance.post<ApiResponse<boolean>>('/auth/logout');
  }
}

export const authApi = new AuthApi();  
