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
    const formData = new FormData()
    formData.append('firstName', dto.firstName)
    formData.append('lastName', dto.lastName)
    formData.append('electionCategoryId', dto.electionCategoryId)
    if (dto.displayName) formData.append('displayName', dto.displayName)
    if (dto.bio) formData.append('bio', dto.bio)
    if (dto.photoFile) formData.append('photoFile', dto.photoFile)

    return axiosInstance.post<ApiResponse<CandidateDto>>(
      '/Candidate',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }

  update(candidateId: string, dto: UpdateCandidateDto) {
    const formData = new FormData()
    if (dto.firstName) formData.append('firstName', dto.firstName)
    if (dto.lastName) formData.append('lastName', dto.lastName)
    if (dto.displayName) formData.append('displayName', dto.displayName)
    if (dto.bio) formData.append('bio', dto.bio)
    if (dto.photoFile) formData.append('photoFile', dto.photoFile)

    return axiosInstance.patch<ApiResponse<boolean>>(
      `/Candidate/${candidateId}`,
      formData,
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