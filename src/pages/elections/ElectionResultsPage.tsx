import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useElection } from '../../hooks/useElection'
import { formatPercentage } from '../../utils/formatPercentage'

const ElectionResultsPage = () => {
  const { electionId } = useParams<{ electionId: string }>()
  const { electionResults, getResults, isLoading } = useElection()
  const navigate = useNavigate()

  useEffect(() => {
    if (electionId) getResults(electionId)
  }, [electionId])

  if (isLoading) return (
    <div className='flex items-center justify-center py-16'>
      <svg className='animate-spin w-6 h-6' fill='none' viewBox='0 0 24 24' style={{ color: 'var(--accent)' }}>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
      </svg>
    </div>
  )

  if (!electionResults) return <div className='text-center py-16' style={{ color: 'var(--text2)' }}>No results found</div>

  return (
    <div className='flex flex-col gap-5 max-w-3xl'>

      <button onClick={() => navigate(-1)} className='flex items-center gap-1.5 text-[13px] w-fit' style={{ color: 'var(--text2)' }}>
        <svg width='14' height='14' viewBox='0 0 16 16' fill='currentColor'><path d='M10 3L6 8l4 5'/></svg>
        Back
      </button>

      {/* Header */}
      <div className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-[18px] font-medium' style={{ color: 'var(--text)' }}>{electionResults.electionName}</h1>
            <p className='text-[13px] mt-1' style={{ color: 'var(--text2)' }}>{electionResults.totalVotes} total votes</p>
          </div>
          <span className='text-[11px] font-medium px-2.5 py-1 rounded-full' style={{ background: 'var(--surface2)', color: 'var(--text3)' }}>
            Closed
          </span>
        </div>
      </div>

      {/* Category results */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {electionResults.categoryResults.map(cat => (
          <div key={cat.electionCategoryId} className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className='flex items-center justify-between mb-4'>
              <span className='text-[13px] font-medium' style={{ color: 'var(--text)' }}>{cat.electionCategoryName}</span>
              {cat.winner && (
                <span className='text-[10px] font-medium px-2 py-1 rounded-full' style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                  {cat.winner.isTie ? 'Tie' : 'Winner declared'}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-3'>
              {cat.results.map((r, i) => (
                <div key={r.candidateId} className='flex items-center gap-2.5'>
                  <div
                    className='w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-medium text-white flex-shrink-0'
                    style={{ background: i === 0 ? 'var(--accent)' : 'var(--text3)' }}
                  >
                    {r.firstName[0]}{r.lastName[0]}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-[12px] truncate' style={{ color: 'var(--text)' }}>
                        {r.displayName || `${r.firstName} ${r.lastName}`}
                      </span>
                      <span className='text-[11px] ml-2 flex-shrink-0' style={{ color: 'var(--text2)' }}>
                        {formatPercentage(r.percentage)}
                      </span>
                    </div>
                    <div className='h-[5px] rounded-full overflow-hidden' style={{ background: 'var(--surface2)' }}>
                      <div
                        className='h-full rounded-full transition-all'
                        style={{
                          width: `${r.percentage}%`,
                          background: i === 0 ? 'var(--accent)' : 'var(--border)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cat.winner?.isTie && (
              <div className='mt-3 pt-3 border-t text-[11px]' style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                Tied: {cat.winner.tiedCandidates?.map(t => t.displayName || `${t.firstName} ${t.lastName}`).join(' & ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ElectionResultsPage