import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useElection } from '../../hooks/useElection'
import { formatPercentage } from '../../utils/formatPercentage'

const ElectionResultsPage = () => {
  const { electionId } = useParams<{ electionId: string }>()
  const { electionResults, getResults, isLoading } = useElection()
  const navigate = useNavigate()

  useEffect(() => {
    if (electionId) {
      getResults(electionId).catch(() => {})
    }
  }, [electionId, getResults])

  if (isLoading) {
    return <div className='flex items-center justify-center py-16'><div className='animate-spin w-6 h-6 rounded-full border-4 border-[var(--accent)] border-t-transparent' /></div>
  }

  if (!electionResults) {
    return <div className='text-center py-16' style={{ color: 'var(--text2)' }}>No results found</div>
  }

  return (
    <div className='flex flex-col gap-5 md:gap-6'>
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 text-[13px] font-medium w-fit' style={{ color: 'var(--text2)' }}>
        <svg width='14' height='14' viewBox='0 0 16 16' fill='currentColor'><path d='M10 3L6 8l4 5' /></svg>
        Back
      </button>

      <section className='rounded-[26px] border p-5 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <div className='text-[11px] font-semibold uppercase tracking-[0.16em]' style={{ color: 'var(--info)' }}>
              Results overview
            </div>
            <h1 className='mt-3 text-[28px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              {electionResults.electionName}
            </h1>
            <p className='mt-2 text-[14px] leading-6' style={{ color: 'var(--text2)' }}>
              {electionResults.totalVotes} total votes counted.
            </p>
          </div>
          <div className='rounded-full px-3 py-1.5 text-[12px] font-semibold' style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
            Closed election
          </div>
        </div>
      </section>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        {electionResults.categoryResults.map((cat) => (
          <div key={cat.electionCategoryId} className='rounded-[24px] border p-5 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className='flex items-center justify-between gap-3'>
              <div className='text-[16px] font-semibold' style={{ color: 'var(--text)' }}>
                {cat.electionCategoryName}
              </div>
              {cat.winner && (
                <span className='rounded-full px-2.5 py-1 text-[10px] font-semibold' style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                  {cat.winner.isTie ? 'Tie' : 'Winner declared'}
                </span>
              )}
            </div>

            <div className='mt-5 flex flex-col gap-4'>
              {cat.results.map((result, index) => (
                <div key={result.candidateId} className='rounded-[18px] border p-4' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                  <div className='flex items-center justify-between gap-3'>
                    <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>
                      {result.displayName || `${result.firstName} ${result.lastName}`}
                    </div>
                    <div className='text-[12px] font-semibold' style={{ color: index === 0 ? 'var(--accent)' : 'var(--text2)' }}>
                      {formatPercentage(result.percentage)}
                    </div>
                  </div>
                  <div className='mt-3 h-[8px] rounded-full overflow-hidden' style={{ background: 'rgba(16,42,67,0.08)' }}>
                    <div
                      className='h-full rounded-full'
                      style={{ width: `${result.percentage}%`, background: index === 0 ? 'var(--accent)' : '#a8bfd6' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ElectionResultsPage
