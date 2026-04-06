import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useElection } from '../../hooks/useElection'
import { useOrganizationMember } from '../../hooks/useOrganizationMember'
import { formatDateTime } from '../../utils/formatDate'

const statusStyle: Record<number, { label: string; tone: string; glow: string }> = {
  0: { label: 'Pending', tone: 'var(--warning)', glow: 'rgba(245,158,11,0.16)' },
  1: { label: 'Active', tone: 'var(--accent)', glow: 'rgba(47,134,255,0.14)' },
  2: { label: 'Closed', tone: 'var(--text2)', glow: 'rgba(88,112,134,0.12)' },
}

const candidateAccent = ['#2f86ff', '#4c98ff', '#6aa9ff', '#3d8eff', '#5ea2ff', '#7bb4ff']

const ElectionDetailPage = () => {
  const { electionId } = useParams<{ electionId: string }>()
  const { currentElection, getElection, isLoading } = useElection()
  const { memberShip } = useOrganizationMember()
  const navigate = useNavigate()

  useEffect(() => {
    if (electionId) {
      getElection(electionId).catch(() => {})
    }
  }, [electionId, getElection])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <svg className='h-7 w-7 animate-spin' fill='none' viewBox='0 0 24 24' style={{ color: 'var(--accent)' }}>
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
        </svg>
      </div>
    )
  }

  if (!currentElection) {
    return (
      <div className='rounded-[28px] border px-6 py-16 text-center shadow-[0_24px_60px_rgba(16,42,67,0.08)]' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full' style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
          <svg width='20' height='20' viewBox='0 0 16 16' fill='currentColor'>
            <path d='M8 1L2 5v6l6 4 6-4V5z' />
          </svg>
        </div>
        <h1 className='text-[24px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Election not found</h1>
        <p className='mx-auto mt-3 max-w-[520px] text-[14px] leading-7' style={{ color: 'var(--text2)' }}>
          The election may have been removed or the link is no longer valid.
        </p>
      </div>
    )
  }

  const status = statusStyle[currentElection.status]
  const canManageElection = memberShip?.status === 1 && (memberShip?.role === 1 || memberShip?.role === 2)

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <button
          type='button'
          onClick={() => navigate('/elections')}
          className='inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium'
          style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text2)' }}
        >
          <svg width='14' height='14' viewBox='0 0 16 16' fill='currentColor'>
            <path d='M10 3L6 8l4 5' />
          </svg>
          Back to elections
        </button>

        <div className='inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold' style={{ background: status.glow, color: status.tone }}>
          <span className='h-2 w-2 rounded-full' style={{ background: status.tone }} />
          {status.label}
        </div>
      </div>

      <section
        className='overflow-hidden rounded-[32px] border p-6 shadow-[0_28px_80px_rgba(16,42,67,0.1)] sm:p-8'
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className='grid gap-8 xl:grid-cols-[1.1fr_0.9fr]'>
          <div className='space-y-5'>
            <div className='inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em]' style={{ borderColor: 'var(--border)', background: 'var(--surface2)', color: 'var(--accent)' }}>
              Election detail
            </div>
            <div>
              <h1 className='text-[30px] font-semibold leading-[1.05] sm:text-[38px]' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                {currentElection.name}
              </h1>
              <p className='mt-3 max-w-[700px] text-[15px] leading-7' style={{ color: 'var(--text2)' }}>
                {currentElection.description || 'Review the election timeline, category breakdown, and voting readiness from one place.'}
              </p>
            </div>
            <div className='grid gap-3 sm:grid-cols-3'>
              {[
                ['Started', formatDateTime(currentElection.startDate)],
                ['Ends', formatDateTime(currentElection.endDate)],
                ['Categories', `${currentElection.categories.length}`],
              ].map(([label, value]) => (
                <div key={label} className='rounded-[20px] border px-4 py-4' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                  <div className='text-[11px] uppercase tracking-[0.16em]' style={{ color: 'var(--text3)' }}>{label}</div>
                  <div className='mt-2 text-[15px] font-semibold' style={{ color: 'var(--text)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-[26px] border p-5' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
            <div className='mb-4 text-[13px] font-semibold uppercase tracking-[0.14em]' style={{ color: 'var(--text3)' }}>Election guidance</div>
            <div className='space-y-4'>
              {[
                'Pending elections stay hidden from voting until administrators open them.',
                'Approved members can vote only while the election is active.',
                currentElection.status === 1
                  ? 'This election is currently live, so voters can move directly into the ballot.'
                  : currentElection.status === 2
                    ? 'This election is closed, so only results review remains.'
                    : 'This election is still in preparation and can be managed from the admin area.',
              ].map(item => (
                <div key={item} className='rounded-[18px] px-4 py-3 text-[13px] leading-6' style={{ background: 'var(--surface)', color: 'var(--text2)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='grid gap-6 xl:grid-cols-[1.08fr_0.92fr]'>
        <div className='rounded-[28px] border p-5 sm:p-6 shadow-[0_22px_60px_rgba(16,42,67,0.08)]' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='mb-5 flex items-center justify-between gap-3'>
            <div>
              <h2 className='text-[22px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Category workspace</h2>
              <p className='mt-1 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
                Browse categories and preview the candidates available in each contest.
              </p>
            </div>
            <div className='rounded-full px-3 py-2 text-[12px] font-semibold' style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
              {currentElection.categories.length} groups
            </div>
          </div>

          <div className='space-y-4'>
            {currentElection.categories.map(cat => {
              const visibleCandidates = cat.candidates.slice(0, 4)
              const remaining = cat.candidates.length - visibleCandidates.length

              return (
                <article key={cat.id} className='rounded-[24px] border p-4 sm:p-5' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                  <div className='mb-4 flex flex-wrap items-start justify-between gap-3'>
                    <div>
                      <h3 className='text-[18px] font-semibold' style={{ color: 'var(--text)' }}>{cat.name}</h3>
                      {cat.description && (
                        <p className='mt-1 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>{cat.description}</p>
                      )}
                    </div>
                    <div className='rounded-full px-3 py-2 text-[12px] font-semibold' style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                      {cat.candidates.length} candidate{cat.candidates.length === 1 ? '' : 's'}
                    </div>
                  </div>

                  <div className='grid gap-3 sm:grid-cols-2'>
                    {visibleCandidates.map((candidate, index) => {
                      const bg = candidateAccent[index % candidateAccent.length]
                      return (
                        <div key={candidate.id} className='flex items-center gap-3 rounded-[18px] border px-4 py-3' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                          <div className='flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-semibold text-white' style={{ background: bg }}>
                            {candidate.firstName[0]}{candidate.lastName[0]}
                          </div>
                          <div className='min-w-0 flex-1'>
                            <div className='truncate text-[14px] font-semibold' style={{ color: 'var(--text)' }}>
                              {candidate.displayName || `${candidate.firstName} ${candidate.lastName}`}
                            </div>
                            {candidate.bio && (
                              <div className='mt-1 line-clamp-2 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>
                                {candidate.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {remaining > 0 && (
                    <div className='mt-3 text-[12px] font-medium' style={{ color: 'var(--text3)' }}>
                      +{remaining} more candidate{remaining === 1 ? '' : 's'} available in this category
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>

        <div className='space-y-6'>
          <div className='rounded-[28px] border p-5 sm:p-6 shadow-[0_22px_60px_rgba(16,42,67,0.08)]' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className='text-[22px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Next action</h2>
            <p className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
              Move into the right workflow based on the current election state.
            </p>
            <div className='mt-5 space-y-3'>
              {currentElection.status === 1 && (
                <button
                  type='button'
                  onClick={() => navigate(`/elections/${electionId}/vote`)}
                  className='w-full rounded-[18px] px-4 py-3 text-left text-[14px] font-semibold text-white'
                  style={{ background: 'var(--accent)', boxShadow: '0 18px 34px rgba(47,134,255,0.18)' }}
                >
                  Vote now
                </button>
              )}
              {currentElection.status === 2 && (
                <button
                  type='button'
                  onClick={() => navigate(`/elections/${electionId}/results`)}
                  className='w-full rounded-[18px] px-4 py-3 text-left text-[14px] font-semibold text-white'
                  style={{ background: 'var(--accent)', boxShadow: '0 18px 34px rgba(47,134,255,0.18)' }}
                >
                  View results
                </button>
              )}
              {canManageElection && currentElection.status !== 2 && (
                <button
                  type='button'
                  onClick={() => navigate('/admin/elections')}
                  className='w-full rounded-[18px] border px-4 py-3 text-left text-[14px] font-semibold'
                  style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  Manage election
                </button>
              )}
            </div>
          </div>

          <div className='rounded-[28px] border p-5 sm:p-6 shadow-[0_22px_60px_rgba(16,42,67,0.08)]' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className='text-[22px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Timeline note</h2>
            <p className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
              {currentElection.status === 1 && memberShip?.status === 1
                ? 'This election is active. Voting will automatically stop at the closing date shown above.'
                : currentElection.status === 0
                  ? 'This election is still in draft mode. Open it from admin management once categories and candidates are complete.'
                  : 'This election has concluded. Results remain available for review and reporting.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ElectionDetailPage
