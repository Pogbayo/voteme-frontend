import axiosInstance from './axiosInstance'
import type{ ApiResponse } from '../types/api.types'

class VoteApi {
  castVote(candidateId: string) {
    return axiosInstance.post<ApiResponse<boolean>>(
      `/votes/${candidateId}`
    )
  }
}

export const voteApi = new VoteApi()