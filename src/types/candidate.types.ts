export interface CandidateDto {
  id: string
  firstName: string
  lastName: string
  displayName: string
  bio: string | null
  photoUrl: string | null
  electionCategoryId: string
}

export interface CreateCandidateDto {
  firstName: string
  lastName: string
  displayName?: string
  bio?: string
  photoFile?: File
  electionCategoryId: string
}

export interface UpdateCandidateDto {
  firstName?: string
  lastName?: string
  displayName?: string
  bio?: string
  photoFile?: File
}

export interface TiedCandidateDto {
  candidateId: string
  firstName: string
  lastName: string
  displayName: string | null
  voteCount: number
  percentage: number
}

export interface WinnerDto {
  candidateId: string
  firstName: string
  lastName: string
  displayName: string | null
  voteCount: number
  percentage: number
  isTie: boolean
  tiedCandidates: TiedCandidateDto[] | null
}

export interface CandidateResultDto {
  candidateId: string
  displayName: string
  firstName: string
  lastName: string
  voteCount: number
  percentage: number
}