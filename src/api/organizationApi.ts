import axiosInstance from './axiosInstance'
import type { ApiResponse } from '../types/api.types'
import type {
  OrganizationDto,
  CreateOrganizationDto,
} from '../types/organization.types'

class OrganizationApi {

  getById(id: string) {
    return axiosInstance.get<ApiResponse<OrganizationDto>>(`/organization/${id}`)
  }

  create(dto: CreateOrganizationDto) {
    const formData = new FormData()
    formData.append('organizationName', dto.organizationName)
    formData.append('adminFirstName', dto.adminFirstName)
    formData.append('adminLastName', dto.adminLastName)
    formData.append('adminEmail', dto.adminEmail)
    formData.append('adminPhoneNumber', dto.adminPhoneNumber)
    formData.append('password', dto.password)
    if (dto.description) formData.append('description', dto.description)
    if (dto.adminDisplayName) formData.append('adminDisplayName', dto.adminDisplayName)
    if (dto.logoFile) formData.append('logoFile', dto.logoFile)

    return axiosInstance.post<ApiResponse<OrganizationDto>>(
      '/auth/register-organization',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }

  update(id: string, formData: FormData) {
    return axiosInstance.patch<ApiResponse<boolean>>(
      `/organization/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }

 getUserOrganizations() {
    return axiosInstance.get<ApiResponse<OrganizationDto[]>>('/organizationmember/my-organizations') 
  }

  delete(id: string) {
    return axiosInstance.delete<ApiResponse<boolean>>(`/organization/${id}`)
  }
}

export const organizationApi = new OrganizationApi()
