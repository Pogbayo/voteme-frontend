import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useElection } from '../../hooks/useElection'
import { useVote } from '../../hooks/useVote'
import type { ElectionCategoryDto } from '../../types/electionCategory.types'
import type { CandidateDto } from '../../types/candidate.types'

const candidateColors = [
  '#FFD6A5', // light peach
  '#FFC6FF', // light pink
  '#A0C4FF', // light blue
  '#B5EAD7', // mint
  '#FFF5BA', // light yellow
  '#FFABAB', // light coral
]

const getCandidateColor = (index: number) =>
  candidateColors[index % candidateColors.length]

const VotingPage = () => {
  const { electionId } = useParams<{ electionId: string }>()
  const { currentElection, getElection, isLoading } = useElection()
  const { castVote, isLoading: voting, error, clearError } = useVote()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (electionId) getElection(electionId)
  }, [electionId])

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-16">
        <svg
          className="animate-spin w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          style={{ color: 'var(--accent)' }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    )

  if (!currentElection)
    return (
      <div className="text-center py-16" style={{ color: 'var(--text2)' }}>
        Election not found
      </div>
    )

  if (currentElection.status !== 1)
    return (
      <div className="text-center py-16" style={{ color: 'var(--text2)' }}>
        This election is not currently active
      </div>
    )

  const categories = currentElection.categories
  const currentCategory: ElectionCategoryDto = categories[step]
  const isLast = step === categories.length - 1

  const handleVote = async (candidateId: string) => {
    setSelectedCandidate(candidateId)
    clearError()
    setMessage(null)

    try {
      const res = await castVote(candidateId)
      if (res?.message) {
        setMessage(res.message)
      }
    } catch {}
  }

  const handleNext = () => {
    if (isLast) {
      navigate(`/elections/${electionId}`) 
    } else {
      setStep((s) => s + 1)
      setSelectedCandidate(null)
      setMessage(null)
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto px-3 py-6">

      {/* Header */}
      <div>
        <button
          onClick={() => navigate(`/elections/${electionId}`)}
          className="flex items-center gap-1.5 text-[13px] mb-3"
          style={{ color: 'var(--text2)' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 3L6 8l4 5" />
          </svg>
          Back
        </button>
        <h1 className="text-[18px] font-medium" style={{ color: 'var(--text)' }}>
          {currentElection.name}
        </h1>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-0">
        {categories.map((cat, i) => (
          <div key={cat.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-medium transition-all"
                style={{
                  background:
                    i < step
                      ? 'var(--accent)'
                      : i === step
                      ? 'var(--accent-bg)'
                      : 'var(--surface2)',
                  color:
                    i < step
                      ? 'white'
                      : i === step
                      ? 'var(--accent)'
                      : 'var(--text3)',
                  border: i === step ? '1.5px solid var(--accent)' : 'none',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span
                className="text-[10px] hidden md:block"
                style={{ color: i === step ? 'var(--accent)' : 'var(--text3)' }}
              >
                {cat.name}
              </span>
            </div>
            {i < categories.length - 1 && (
              <div className="flex-1 h-px mx-2 mb-4" style={{ background: 'var(--border)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Category Card */}
      <div className="rounded-[12px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-medium" style={{ color: 'var(--text)' }}>
            {currentCategory.name}
          </h2>
          <span
            className="text-[11px] px-2 py-1 rounded-full"
            style={{ background: 'var(--surface2)', color: 'var(--text3)' }}
          >
            Step {step + 1} of {categories.length}
          </span>
        </div>

        {error && (
          <div
            className="text-[12px] px-3 py-2.5 rounded-[8px] mb-4"
            style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            className="text-[12px] px-3 py-2.5 rounded-[8px] mb-4"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {currentCategory.candidates.map((c: CandidateDto, idx) => {
            const selected = selectedCandidate === c.id
            return (
              <div
                key={c.id}
                onClick={() => handleVote(c.id)}
                className="flex items-center gap-3 p-3 rounded-[10px] border cursor-pointer transition-all hover:shadow-sm"
                style={{
                  borderColor: selected ? 'var(--accent)' : 'var(--border)',
                  background: selected ? 'var(--accent-bg)' : 'var(--surface)',
                }}
              >
                <div
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[12px] font-medium text-white flex-shrink-0"
                  style={{ background: selected ? 'var(--accent)' : getCandidateColor(idx) }}
                >
                  {c.firstName[0]}
                  {c.lastName[0]}
                </div>

                <div className="flex-1">
                  <div className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>
                    {c.displayName || `${c.firstName} ${c.lastName}`}
                  </div>
                  {c.bio && (
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>
                      {c.bio}
                    </div>
                  )}
                </div>

                <div
                  className="w-[16px] h-[16px] rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ borderColor: selected ? 'var(--accent)' : 'var(--border)' }}
                >
                  {selected && (
                    <div className="w-[8px] h-[8px] rounded-full" style={{ background: 'var(--accent)' }} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-2 rounded-[8px] text-[13px] border disabled:opacity-40"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          ← Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedCandidate || voting} 
          className="px-5 py-2 rounded-[8px] text-[13px] font-medium text-white flex items-center gap-2"
          style={{ background: 'var(--accent)' }}
        >
          {isLast ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  )
}

export default VotingPage