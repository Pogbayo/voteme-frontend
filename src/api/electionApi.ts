import axiosInstance from './axiosInstance';
import type { ApiResponse } from '../types/api.types';
import type {
  ElectionDto,
  CreateElectionDto,
  UpdateElectionDto,
  OpenElectionDto,
  ElectionResultDto,
  PagedElectionResponse,
} from '../types/election.types';

class ElectionApi {
  getById(id: string) {
    return axiosInstance.get<ApiResponse<ElectionDto>>(`/election/${id}`);
  }

  getOrganizationElections(organizationId: string, page = 1, pageSize = 20) {
    return axiosInstance.get<ApiResponse<PagedElectionResponse>>(
      `/election/organization/${organizationId}?page=${page}&pageSize=${pageSize}`
    );
  }

  create(dto: CreateElectionDto) {
    return axiosInstance.post<ApiResponse<ElectionDto>>('/election', dto);
  }

  update(id: string, dto: UpdateElectionDto) {
    return axiosInstance.put<ApiResponse<boolean>>(`/election/${id}`, dto);
  }

  delete(id: string) {
    return axiosInstance.delete<ApiResponse<boolean>>(`/election/${id}`);
  }

  open(id: string, dto: OpenElectionDto) {
    return axiosInstance.post<ApiResponse<boolean>>(`/election/${id}/open`, dto);
  }

  getResults(id: string) {
    return axiosInstance.get<ApiResponse<ElectionResultDto>>(`/election/${id}/results`);
  }
}

export const electionApi = new ElectionApi();