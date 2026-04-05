import axiosInstance from './axiosInstance'
import type { ApiResponse } from '../types/api.types'
import type {
  CandidateDto,
  CreateCandidateDto,
  UpdateCandidateDto,
} from '../types/candidate.types'

class CandidateApi {
  getById(candidateId: string) {
    return axiosInstance.get<ApiResponse<CandidateDto>>(
      `/Candidate/${candidateId}`
    )
  }

  create(dto: CreateCandidateDto) {
    return axiosInstance.post<ApiResponse<CandidateDto>>(
      '/Candidate',
      dto,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }

  update(candidateId: string, dto: UpdateCandidateDto) {
    return axiosInstance.patch<ApiResponse<CandidateDto>>(
      `/Candidate/${candidateId}`,
      dto,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }

  delete(candidateId: string) {
    return axiosInstance.delete<ApiResponse<boolean>>(
      `/Candidate/${candidateId}`
    )
  }

  getByCategory(electionCategoryId: string) {
    return axiosInstance.get<ApiResponse<CandidateDto[]>>(
      `/Candidate/category/${electionCategoryId}`
    )
  }
}

export const candidateApi = new CandidateApi()