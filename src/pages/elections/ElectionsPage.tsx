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
  2: { label: 'Closed', bg: 'var(--info-bg)', color: 'var(--info)' },
}

const getElectionCategoryCount = (categoryCount?: number, categories?: { length: number }) =>
  categoryCount ?? categories?.length ?? 0

const getElectionTimelineText = (endDate?: string | null) => {
  if (!endDate) return 'No end date'

  const parsedEndDate = new Date(endDate)
  if (Number.isNaN(parsedEndDate.getTime())) {
    return `Ends ${formatDate(endDate)}`
  }

  return parsedEndDate.getTime() < Date.now()
    ? `Ended ${formatDate(endDate)}`
    : `Ends ${formatDate(endDate)}`
}

const ElectionsPage = () => {
  const { elections, getOrganizationElections, isLoading } = useElection()
  const { currentOrganization } = useOrganization()
  const { isOrgAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentOrganization?.id) {
      getOrganizationElections(currentOrganization.id).catch(() => {})
    }
  }, [currentOrganization?.id, getOrganizationElections])

  const ElectionCard = ({ election }: { election: ElectionDto }) => {
    const tone = statusStyle[election.status]

    return (
      <button
        onClick={() => navigate(`/elections/${election.id}`)}
        className='flex h-full flex-col rounded-[24px] border p-5 text-left transition-all hover:-translate-y-0.5'
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: '0 18px 40px rgba(16, 42, 67, 0.05)',
        }}
      >
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <div className='text-[16px] font-semibold leading-snug' style={{ color: 'var(--text)' }}>
              {election.name}
            </div>
            <div className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
              {election.description || 'No description provided yet.'}
            </div>
          </div>
          <span
            className='rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]'
            style={{ background: tone.bg, color: tone.color }}
          >
            {tone.label}
          </span>
        </div>

        <div className='mt-5 grid grid-cols-2 gap-3'>
          <div className='rounded-[18px] border px-3 py-3' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
            <div className='text-[10px] uppercase tracking-[0.12em]' style={{ color: 'var(--text3)' }}>
              Categories
            </div>
            <div className='mt-2 text-[18px] font-semibold' style={{ color: 'var(--text)' }}>
              {getElectionCategoryCount(election.categoryCount, election.categories)}
            </div>
          </div>

          <div className='rounded-[18px] border px-3 py-3' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
            <div className='text-[10px] uppercase tracking-[0.12em]' style={{ color: 'var(--text3)' }}>
              Timeline
            </div>
            <div className='mt-2 text-[12px] font-medium leading-5' style={{ color: 'var(--text)' }}>
              {getElectionTimelineText(election.endDate)}
            </div>
          </div>
        </div>

        <div className='mt-5 flex items-center justify-between border-t pt-4' style={{ borderColor: 'var(--border)' }}>
          <div className='text-[11px]' style={{ color: 'var(--text3)' }}>
            Created {formatDate(election.createdAt)}
          </div>
          <div className='text-[12px] font-semibold' style={{ color: 'var(--accent)' }}>
            {election.status === 1 ? 'Open election' : election.status === 2 ? 'View results' : 'Review setup'}
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className='flex flex-col gap-5 md:gap-6'>
      <section
        className='rounded-[26px] border p-5 md:p-6'
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <div className='text-[11px] font-semibold uppercase tracking-[0.16em]' style={{ color: 'var(--info)' }}>
              Election workspace
            </div>
            <h1 className='mt-3 text-[28px] font-semibold md:text-[34px]' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Elections
            </h1>
            <p className='mt-2 max-w-2xl text-[14px] leading-6' style={{ color: 'var(--text2)' }}>
              {currentOrganization?.name ?? 'No organization selected'}.
              Track every election, open details fast, and keep the same blue dashboard language across the workspace.
            </p>
          </div>

          {isOrgAdmin && (
            <button
              onClick={() => navigate('/admin/elections')}
              className='rounded-[18px] px-5 py-3 text-[13px] font-semibold text-white'
              style={{ background: 'var(--accent)' }}
            >
              Create election
            </button>
          )}
        </div>
      </section>

      {isLoading ? (
        <div className='flex items-center justify-center rounded-[24px] border py-20' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <svg className='animate-spin w-6 h-6' fill='none' viewBox='0 0 24 24' style={{ color: 'var(--accent)' }}>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
          </svg>
        </div>
      ) : elections.length === 0 ? (
        <div className='rounded-[24px] border px-6 py-16 text-center' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full' style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
            <svg width='28' height='28' viewBox='0 0 16 16' fill='currentColor'>
              <path d='M8 1L2 5v6l6 4 6-4V5z' />
            </svg>
          </div>
          <div className='mt-5 text-[18px] font-semibold' style={{ color: 'var(--text)' }}>
            No elections yet
          </div>
          <p className='mt-2 text-[14px] leading-6' style={{ color: 'var(--text2)' }}>
            {isOrgAdmin ? 'Create your first election to start organizing votes.' : 'No elections have been created yet for this workspace.'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {elections.map((election) => <ElectionCard key={election.id} election={election} />)}
        </div>
      )}
    </div>
  )
}

export default ElectionsPage
