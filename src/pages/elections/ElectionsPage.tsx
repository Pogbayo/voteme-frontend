import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useElection } from '../../hooks/useElection'
import { useOrganization } from '../../hooks/useOrganization'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/formatDate'
import type { ElectionDto } from '../../types/election.types'

const statusStyle: Record<number, { label: string; bg: string; color: string }> = {
  0: { label: 'Pending', bg: 'var(--warning-bg)', color: 'var(--warning)' },
  1: { label: 'Active', bg: 'var(--success-bg)', color: 'var(--success)' },
  2: { label: 'Closed', bg: 'var(--surface2)', color: 'var(--text3)' },
}

const ElectionsPage = () => {
  const { elections, getOrganizationElections, isLoading } = useElection()
  const { currentOrganization } = useOrganization()
  const { isOrgAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentOrganization?.id) getOrganizationElections(currentOrganization.id)
  }, [currentOrganization?.id])

  const ElectionCard = ({ e }: { e: ElectionDto }) => {
    const s = statusStyle[e.status]
    return (
      <div
        onClick={() => navigate(`/elections/${e.id}`)}
        className='rounded-[12px] p-4 border cursor-pointer hover:shadow-sm transition-all flex flex-col gap-3'
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          borderLeft: e.status === 1 ? '3px solid var(--accent)' : '0.5px solid var(--border)',
        }}
      >
        <div className='flex items-start justify-between gap-2'>
          <div>
            <div className='text-[13px] font-medium leading-snug' style={{ color: 'var(--text)' }}>{e.name}</div>
            <div className='text-[11px] mt-1' style={{ color: 'var(--text3)' }}>{e.description}</div>
          </div>
          <span className='text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0' style={{ background: s.bg, color: s.color }}>
            {s.label}
          </span>
        </div>

        <div className='flex items-center gap-3'>
          <span className='text-[11px]' style={{ color: 'var(--text3)' }}>
            {e.categories.length} categories
          </span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span className='text-[11px]' style={{ color: 'var(--text3)' }}>
            {e.endDate ? `Ends ${formatDate(e.endDate)}` : 'No end date'}
          </span>
        </div>

        <div className='flex items-center justify-between border-t pt-3' style={{ borderColor: 'var(--border)' }}>
          <span className='text-[11px]' style={{ color: 'var(--text3)' }}>
            Created {formatDate(e.createdAt)}
          </span>
          <span className='text-[11px] font-medium' style={{ color: 'var(--accent)' }}>
            {e.status === 1 ? 'Vote now →' : e.status === 2 ? 'Results →' : 'View →'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-[20px] font-medium' style={{ color: 'var(--text)' }}>Elections</h1>
          <p className='text-[13px] mt-0.5' style={{ color: 'var(--text2)' }}>
            {currentOrganization?.name ?? 'No organization selected'}
          </p>
        </div>
        {isOrgAdmin && (
          <button
            onClick={() => navigate('/admin/elections')}
            className='px-4 py-2 rounded-[8px] text-[13px] font-medium text-white flex items-center gap-2'
            style={{ background: 'var(--accent)' }}
          >
            + New election
          </button>
        )}
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-16'>
          <svg className='animate-spin w-6 h-6' fill='none' viewBox='0 0 24 24' style={{ color: 'var(--accent)' }}>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
          </svg>
        </div>
      ) : elections.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 gap-3'>
          <div className='text-[40px]'>🗳️</div>
          <div className='text-[15px] font-medium' style={{ color: 'var(--text)' }}>No elections yet</div>
          <div className='text-[13px]' style={{ color: 'var(--text2)' }}>
            {isOrgAdmin ? 'Create your first election to get started' : 'No elections have been created yet'}
          </div>
          {isOrgAdmin && (
            <button
              onClick={() => navigate('/admin/elections')}
              className='px-4 py-2 rounded-[8px] text-[13px] font-medium text-white mt-2'
              style={{ background: 'var(--accent)' }}
            >
              Create election
            </button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {elections.map(e => <ElectionCard key={e.id} e={e} />)}
        </div>
      )}
    </div>
  )
}

export default ElectionsPage