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
  private readonly basePath = '/elections';   

  getById(id: string) {
    return axiosInstance.get<ApiResponse<ElectionDto>>(`${this.basePath}/${id}`);
  }

  getOrganizationElections(organizationId: string, page = 1, pageSize = 20) {
    return axiosInstance.get<ApiResponse<PagedElectionResponse>>(
      `${this.basePath}/organization/${organizationId}?page=${page}&pageSize=${pageSize}`
    );
  }

  create(dto: CreateElectionDto) {
    console.log('Creating election with DTO <electionApi.ts>:', dto);
    return axiosInstance.post<ApiResponse<ElectionDto>>(this.basePath, dto);
  }

  update(id: string, dto: UpdateElectionDto) {
    return axiosInstance.patch<ApiResponse<ElectionDto>>(`${this.basePath}/${id}`, dto);
  }

  delete(id: string) {
    return axiosInstance.delete<ApiResponse<boolean>>(`${this.basePath}/${id}`);
  }

  open(id: string, dto: OpenElectionDto) {
    return axiosInstance.post<ApiResponse<ElectionDto>>(`${this.basePath}/${id}/open`, dto);
  }

  getResults(id: string) {
    return axiosInstance.get<ApiResponse<ElectionResultDto>>(`${this.basePath}/${id}/results`);
  }
}

export const electionApi = new ElectionApi();