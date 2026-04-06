import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useElection } from '../../hooks/useElection'
import { useVote } from '../../hooks/useVote'
import type { ElectionCategoryDto } from '../../types/electionCategory.types'
import type { CandidateDto } from '../../types/candidate.types'

const candidateColors = ['#b8d7ff', '#d8e8ff', '#dff4ea', '#fff4d8', '#d9ebff', '#e7f1ff']

const getCandidateColor = (index: number) => candidateColors[index % candidateColors.length]

const VotingPage = () => {
  const { electionId } = useParams<{ electionId: string }>()
  const { currentElection, getElection, isLoading } = useElection()
  const { castVote, isLoading: voting, error, clearError } = useVote()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (electionId) {
      getElection(electionId).catch(() => {})
    }
  }, [electionId, getElection])

  if (isLoading) return <div className='flex items-center justify-center py-16'><div className='animate-spin w-6 h-6 rounded-full border-4 border-[var(--accent)] border-t-transparent' /></div>
  if (!currentElection) return <div className='text-center py-16' style={{ color: 'var(--text2)' }}>Election not found</div>
  if (currentElection.status !== 1) return <div className='text-center py-16' style={{ color: 'var(--text2)' }}>This election is not currently active</div>

  const categories = currentElection.categories
  const currentCategory: ElectionCategoryDto = categories[step]
  const isLast = step === categories.length - 1

  const handleVote = async (candidateId: string) => {
    setSelectedCandidate(candidateId)
    clearError()
    setMessage(null)
    try {
      const res = await castVote(candidateId)
      if (res?.message) setMessage(res.message)
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
    <div className='mx-auto flex max-w-5xl flex-col gap-5 px-1 py-2 md:gap-6'>
      <button onClick={() => navigate(`/elections/${electionId}`)} className='flex items-center gap-2 text-[13px] font-medium w-fit' style={{ color: 'var(--text2)' }}>
        <svg width='14' height='14' viewBox='0 0 16 16' fill='currentColor'><path d='M10 3L6 8l4 5' /></svg>
        Back
      </button>

      <section className='rounded-[26px] border p-5 md:p-6' style={{ background: 'linear-gradient(135deg, rgba(47,134,255,0.08), rgba(255,255,255,0.96))', borderColor: 'var(--border)' }}>
        <div className='text-[11px] font-semibold uppercase tracking-[0.16em]' style={{ color: 'var(--info)' }}>
          Voting flow
        </div>
        <h1 className='mt-3 text-[28px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
          {currentElection.name}
        </h1>
      </section>

      <div className='rounded-[24px] border p-4 md:p-5' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className='flex items-center gap-3 overflow-x-auto pb-1'>
          {categories.map((cat, i) => (
            <div key={cat.id} className='flex items-center gap-3 min-w-fit'>
              <div className='flex flex-col items-center gap-2'>
                <div
                  className='flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold'
                  style={{
                    background: i < step ? 'var(--accent)' : i === step ? 'var(--accent-bg)' : 'var(--surface2)',
                    color: i < step ? 'white' : i === step ? 'var(--accent)' : 'var(--text3)',
                    border: i === step ? '1.5px solid var(--accent)' : 'none',
                  }}
                >
                  {i + 1}
                </div>
                <span className='text-[11px] font-medium' style={{ color: i === step ? 'var(--accent)' : 'var(--text3)' }}>
                  {cat.name}
                </span>
              </div>
              {i < categories.length - 1 && <div className='h-px w-10 md:w-16' style={{ background: 'var(--border)' }} />}
            </div>
          ))}
        </div>
      </div>

      <section className='rounded-[26px] border p-5 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className='flex items-center justify-between gap-3 flex-wrap'>
          <div>
            <h2 className='text-[22px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              {currentCategory.name}
            </h2>
            <p className='mt-1 text-[13px]' style={{ color: 'var(--text2)' }}>
              Step {step + 1} of {categories.length}
            </p>
          </div>
        </div>

        {error && <div className='mt-4 rounded-[18px] px-4 py-3 text-[13px]' style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>{error}</div>}
        {message && <div className='mt-4 rounded-[18px] px-4 py-3 text-[13px]' style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{message}</div>}

        <div className='mt-5 grid grid-cols-1 gap-3'>
          {currentCategory.candidates.map((candidate: CandidateDto, idx) => {
            const selected = selectedCandidate === candidate.id
            return (
              <button
                key={candidate.id}
                onClick={() => handleVote(candidate.id)}
                className='flex items-center gap-4 rounded-[22px] border p-4 text-left transition-all'
                style={{
                  borderColor: selected ? 'var(--accent)' : 'var(--border)',
                  background: selected ? 'var(--accent-bg)' : 'var(--surface2)',
                }}
              >
                <div className='flex h-12 w-12 items-center justify-center rounded-[16px] text-[14px] font-semibold flex-shrink-0' style={{ background: selected ? 'var(--accent)' : getCandidateColor(idx), color: selected ? 'white' : 'var(--text)' }}>
                  {candidate.firstName[0]}{candidate.lastName[0]}
                </div>
                <div className='flex-1'>
                  <div className='text-[15px] font-semibold' style={{ color: 'var(--text)' }}>
                    {candidate.displayName || `${candidate.firstName} ${candidate.lastName}`}
                  </div>
                  {candidate.bio && <div className='mt-1 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>{candidate.bio}</div>}
                </div>
                <div className='h-5 w-5 rounded-full border-2 flex-shrink-0' style={{ borderColor: selected ? 'var(--accent)' : '#bfd0df', background: selected ? 'var(--accent)' : 'transparent' }} />
              </button>
            )
          })}
        </div>
      </section>

      <div className='flex items-center justify-between gap-3'>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className='rounded-[16px] border px-4 py-3 text-[13px] font-medium disabled:opacity-40' style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
          Previous
        </button>
        <button onClick={handleNext} disabled={!selectedCandidate || voting} className='rounded-[16px] px-5 py-3 text-[13px] font-semibold text-white disabled:opacity-50' style={{ background: 'var(--accent)' }}>
          {isLast ? 'Finish voting' : 'Next step'}
        </button>
      </div>
    </div>
  )
}

export default VotingPage
