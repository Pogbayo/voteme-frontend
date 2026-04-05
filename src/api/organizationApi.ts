import axiosInstance from './axiosInstance'
import type { ApiResponse } from '../types/api.types'
import type {
  OrganizationDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '../types/organization.types'

class OrganizationApi {

  getById(id: string) {
    return axiosInstance.get<ApiResponse<OrganizationDto>>(`/organization/${id}`)
  }

  create(dto: CreateOrganizationDto) {
    return axiosInstance.post<ApiResponse<OrganizationDto>>(
      '/auth/register-organization',
      dto,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }

  update(id: string,dto: UpdateOrganizationDto) {
    return axiosInstance.patch<ApiResponse<boolean>>(
      `/organization/${id}`,
      dto,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }

 getUserOrganizations() {
    return axiosInstance.get<ApiResponse<OrganizationDto[]>>('/organizationmember/my-organizations') 
  }

  delete(id: string) {
    return axiosInstance.delete<ApiResponse<boolean>>(`/organization/${id}`)
  }

  getOrganizationVotesCount(organizationId: string) {
    return axiosInstance.get<ApiResponse<number>>(`/votes/${organizationId}/total-votes`)
  }
}

export const organizationApi = new OrganizationApi()
