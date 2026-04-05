import axiosInstance from './axiosInstance'
import type { ApiResponse } from '../types/api.types'
import  type {
  ElectionCategoryDto,
  CreateElectionCategoryDto,
  UpdateElectionCategoryDto,
  ElectionCategoryResultDto,
} from '../types/electionCategory.types'

class ElectionCategoryApi {
  getById(electionCategoryId: string) {
    return axiosInstance.get<ApiResponse<ElectionCategoryDto>>(
      `/electioncategory/${electionCategoryId}`
    )
  }

  create(dto: CreateElectionCategoryDto) {
    return axiosInstance.post<ApiResponse<ElectionCategoryDto>>(
      '/electioncategory',
      dto
    )
  }

  update(electionCategoryId: string, dto: UpdateElectionCategoryDto) {
    return axiosInstance.patch<ApiResponse<boolean>>(
      `/electioncategory/${electionCategoryId}`,
      dto
    )
  }

  delete(electionCategoryId: string) {
    return axiosInstance.delete<ApiResponse<boolean>>(
      `/electioncategory/${electionCategoryId}`
    )
  }

  getByElection(electionId: string) {
    return axiosInstance.get<ApiResponse<ElectionCategoryDto[]>>(
      `/electioncategory/election/${electionId}`
    )
  }

  getElectionCategoryResults(electionCategoryId: string) {
    return axiosInstance.get<ApiResponse<ElectionCategoryResultDto>>(
      `/electioncategory/${electionCategoryId}/results`
    )
  }
}

export const electionCategoryApi = new ElectionCategoryApi()