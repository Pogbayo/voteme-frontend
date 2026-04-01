import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useElection } from '../../hooks/useElection'
import { useAuth } from '../../hooks/useAuth'
import { formatDateTime } from '../../utils/formatDate'

const statusStyle: Record<number, { label: string; bg: string; color: string }> = {
  0: { label: 'Pending', bg: 'var(--warning-bg)', color: 'var(--warning)' },
  1: { label: 'Active', bg: 'var(--success-bg)', color: 'var(--success)' },
  2: { label: 'Closed', bg: 'var(--surface2)', color: 'var(--text3)' },
}

const ElectionDetailPage = () => {
  const { electionId } = useParams<{ electionId: string }>()
  const { currentElection, getElection, isLoading } = useElection()
  const { isOrgAdmin } = useAuth()
  const navigate = useNavigate()
const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  useEffect(() => {
    if (electionId) getElection(electionId)
  }, [electionId])

  if (isLoading) return (
    <div className='flex items-center justify-center py-16'>
      <svg className='animate-spin w-6 h-6' fill='none' viewBox='0 0 24 24' style={{ color: 'var(--accent)' }}>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
      </svg>
    </div>
  )

  if (!currentElection) return (
    <div className='text-center py-16' style={{ color: 'var(--text2)' }}>Election not found</div>
  )

  const s = statusStyle[currentElection.status]

  return (
    <div className='flex flex-col gap-5 max-w-3xl'>

      {/* Back */}
      <button
        onClick={() => navigate('/elections')}
        className='flex items-center gap-1.5 text-[13px] w-fit'
        style={{ color: 'var(--text2)' }}
      >
        <svg width='14' height='14' viewBox='0 0 16 16' fill='currentColor'><path d='M10 3L6 8l4 5'/></svg>
        Back to elections
      </button>

      {/* Header card */}
      <div className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className='flex items-start justify-between gap-4 mb-4'>
          <div>
            <h1 className='text-[18px] font-medium' style={{ color: 'var(--text)' }}>{currentElection.name}</h1>
            {currentElection.description && (
              <p className='text-[13px] mt-1' style={{ color: 'var(--text2)' }}>{currentElection.description}</p>
            )}
          </div>
          <span className='text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0' style={{ background: s.bg, color: s.color }}>
            {s.label}
          </span>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t' style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className='text-[11px] mb-0.5' style={{ color: 'var(--text3)' }}>Started</div>
            <div className='text-[12px]' style={{ color: 'var(--text)' }}>{formatDateTime(currentElection.startDate)}</div>
          </div>
          <div>
            <div className='text-[11px] mb-0.5' style={{ color: 'var(--text3)' }}>Ends</div>
            <div className='text-[12px]' style={{ color: 'var(--text)' }}>{formatDateTime(currentElection.endDate)}</div>
          </div>
          <div>
            <div className='text-[11px] mb-0.5' style={{ color: 'var(--text3)' }}>Categories</div>
            <div className='text-[12px]' style={{ color: 'var(--text)' }}>{currentElection.categories.length}</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-6">
        {currentElection.categories.map((cat) => (
          <div key={cat.id} className="rounded-[14px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>
                  {cat.name}
                </span>
                {cat.description && (
                  <span className="text-[12px]" style={{ color: 'var(--text3)' }}>
                    {cat.description}
                  </span>
                )}
              </div>
              <div className="text-[12px] px-2 py-1 rounded-full" style={{ background: 'var(--surface2)', color: 'var(--text3)' }}>
                {cat.candidates.length} candidates
              </div>
            </div>
            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cat.candidates.map((c, index) => {
                const isSelected = selectedCandidate === c.id
                const candidateColors = ['var(--accent)', 'var(--success)', 'var(--warning)', 'var(--danger)']
                const bgColor = candidateColors[index % candidateColors.length]
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 p-3 rounded-[10px] border hover:shadow-md transition-all cursor-pointer"
                    style={{
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      background: isSelected ? 'var(--accent-bg)' : 'var(--surface2)',
                    }}
                    onClick={() => setSelectedCandidate(c.id)}
                  >
                    {/* Initials */}
                    <div
                      className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[12px] font-semibold text-white flex-shrink-0"
                      style={{ background: bgColor }}
                    >
                      {c.firstName[0]}{c.lastName[0]}
                    </div>
                    {/* Info */}
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
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>


      {/* Actions */}
      <div className='flex gap-3'>
        {currentElection.status === 1 && (
          <button
            onClick={() => navigate(`/elections/${electionId}/vote`)}
            className='px-5 py-2.5 rounded-[8px] text-[13px] font-medium text-white'
            style={{ background: 'var(--accent)' }}
          >
            Vote now
          </button>
        )}
        {currentElection.status === 2 && (
          <button
            onClick={() => navigate(`/elections/${electionId}/results`)}
            className='px-5 py-2.5 rounded-[8px] text-[13px] font-medium text-white'
            style={{ background: 'var(--accent)' }}
          >
            View results
          </button>
        )}
        {isOrgAdmin && currentElection.status === 0 && (
          <button
            onClick={() => navigate(`/admin/elections`)}
            className='px-5 py-2.5 rounded-[8px] text-[13px] font-medium border'
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Manage election
          </button>
        )}
      </div>
    </div>
  )
}

export default ElectionDetailPage