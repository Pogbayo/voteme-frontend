import type { ApiResponse } from '../types/api.types'
import type { JoinOrgDto, OrganizationMemberDto, PendingMemberDto } from '../types/member.types'
import api from './axiosInstance' 

export const organizationMemberApi = {
  removeMember: (organizationId: string, userId: string) => 
    api.delete<ApiResponse<boolean>>(`/organizationmember/${organizationId}/members/${userId}`),

  join: (dto:JoinOrgDto) => 
    api.post<ApiResponse<OrganizationMemberDto>>('/organizationmember/join', dto),

  promoteToAdmin: (organizationId: string, userId: string) => 
    api.put<ApiResponse<boolean>>(`/organizationmember/${organizationId}/members/${userId}/promote`),

  demoteFromAdmin: (organizationId: string, userId: string) => 
    api.put(`/organizationmember/${organizationId}/members/${userId}/demote`),

  leave: (organizationId: string) => 
    api.post<ApiResponse<boolean>>(`/organizationmember/${organizationId}/leave`),

        //   getUserOrganizations: () => 
        //     api.get('/organizationmember/user'),

  approve: (organizationId: string, userId: string) => 
    api.put<ApiResponse<boolean>>(`/organizationmember/${organizationId}/members/${userId}/approve`),

  reject: (organizationId: string, userId: string) => 
    api.put<ApiResponse<boolean>>(`/organizationmember/${organizationId}/members/${userId}/reject`),

  getPendingMembers: (organizationId: string) => 
    api.get<ApiResponse<PendingMemberDto[]>>(`/organizationmember/${organizationId}/pending`),

  getMembers: (organizationId: string, page?: number, pageSize?: number) => 
    api.get<ApiResponse<OrganizationMemberDto[]>>(`/organizationmember/${organizationId}/members`, { params: { page, pageSize } }),
}