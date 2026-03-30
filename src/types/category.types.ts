import type { CandidateDto, WinnerDto, CandidateResultDto } from './candidate.types'

export interface ElectionCategoryDto {
  id: string
  name: string
  description: string
  electionId: string
  candidates: CandidateDto[]
}

export interface CreateElectionCategoryDto {
  name: string
  description?: string
  electionId: string
}

export interface UpdateElectionCategoryDto {
  name?: string
  description?: string
}

export interface ElectionCategoryResultDto {
  electionCategoryId: string
  electionCategoryName: string
  totalVotes: number
  winner: WinnerDto | null
  results: CandidateResultDto[]
}