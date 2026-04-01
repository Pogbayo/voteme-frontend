import axiosInstance from './axiosInstance'
import type { ApiResponse } from '../types/api.types'
import type { UserDto, UpdateUserDto, OrganizationUserDto } from '../types/user.types'

class UserApi {
  getById(userId: string) {
    return axiosInstance.get<ApiResponse<UserDto>>(
      `/Users/${userId}`
    )
  }

  update(userId: string, dto: UpdateUserDto) {
    return axiosInstance.patch<ApiResponse<OrganizationUserDto>>(
      `/Users/${userId}`,
      dto
    )
  }

  delete(userId: string) {
    return axiosInstance.delete<ApiResponse<boolean>>(
      `/Users/${userId}`
    )
  }

  getOrganizationUsers(organizationId: string, page = 1, pageSize = 20) {
    return axiosInstance.get<ApiResponse<OrganizationUserDto[]>>(
      `/Users/organization/${organizationId}?page=${page}&pageSize=${pageSize}`
    )
  }
}

export const userApi = new UserApi()