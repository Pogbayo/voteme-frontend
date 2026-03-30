export interface VoteResultDto {
  electionId: string
  electionCategoryId: string
  candidateId: string
  firstName: string
  lastName: string
  displayName: string | null
  voteCount: number
  percentage: number
}