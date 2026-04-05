import type { ElectionCategoryDto, ElectionCategoryResultDto } from './electionCategory.types'

export type ElectionStatus = 0 | 1 | 2 // 0=Pending, 1=Active, 2=Closed

export interface ElectionDto {
  id: string
  name: string
  description: string
  startDate: string | null
  endDate: string | null
  status: ElectionStatus
  isPrivate: boolean
  organizationId: string
  categories: ElectionCategoryDto[]
  createdAt: string
}

export interface CreateElectionDto {
  name: string
  description?: string 
  isPrivate: boolean
  organizationId: string
}

export interface UpdateElectionDto {
  name?: string
  description?: string
  isPrivate?: boolean
}

export interface OpenElectionDto {
  endDate: string
}

export interface ElectionResultDto {
  electionId: string
  electionName: string
  totalVotes: number
  winnersNames: string[]
  categoryResults: ElectionCategoryResultDto[]
}

export interface PagedElectionResponse {
  items: ElectionDto[]
  totalCount: number
}