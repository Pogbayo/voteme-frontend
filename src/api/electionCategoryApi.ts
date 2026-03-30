import axiosInstance from './axiosInstance'
import type { ApiResponse } from '../types/api.types'
import  type {
  ElectionCategoryDto,
  CreateElectionCategoryDto,
  UpdateElectionCategoryDto,
  ElectionCategoryResultDto,
} from '../types/category.types'

class ElectionCategoryApi {
  getById(electionCategoryId: string) {
    return axiosInstance.get<ApiResponse<ElectionCategoryDto>>(
      `/ElectionCategory/${electionCategoryId}`
    )
  }

  create(dto: CreateElectionCategoryDto) {
    return axiosInstance.post<ApiResponse<ElectionCategoryDto>>(
      '/ElectionCategory',
      dto
    )
  }

  update(electionCategoryId: string, dto: UpdateElectionCategoryDto) {
    return axiosInstance.patch<ApiResponse<boolean>>(
      `/ElectionCategory/${electionCategoryId}`,
      dto
    )
  }

  delete(electionCategoryId: string) {
    return axiosInstance.delete<ApiResponse<boolean>>(
      `/ElectionCategory/${electionCategoryId}`
    )
  }

  getByElection(electionId: string) {
    return axiosInstance.get<ApiResponse<ElectionCategoryDto[]>>(
      `/ElectionCategory/election/${electionId}`
    )
  }

  getElectionCategoryResults(electionCategoryId: string) {
    return axiosInstance.get<ApiResponse<ElectionCategoryResultDto>>(
      `/ElectionCategory/${electionCategoryId}/results`
    )
  }
}

export const electionCategoryApi = new ElectionCategoryApi()