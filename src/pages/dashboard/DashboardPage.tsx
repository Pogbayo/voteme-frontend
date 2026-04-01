import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useElection } from '../../hooks/useElection'
import { useOrganization } from '../../hooks/useOrganization'
import { useOrganizationMember } from '../../hooks/useOrganizationMember'
import { formatDate } from '../../utils/formatDate'

const statusStyle: Record<number, { label: string; bg: string; color: string }> = {
  0: { label: 'Pending', bg: 'var(--warning-bg)', color: 'var(--warning)' },
  1: { label: 'Active', bg: 'var(--success-bg)', color: 'var(--success)' },
  2: { label: 'Closed', bg: 'var(--surface2)', color: 'var(--text3)' },
}

const DashboardPage = () => {
  const { user, isOrgAdmin } = useAuth()
  const { elections, totalElectionCount, getOrganizationElections, isLoading } = useElection()
  const { currentOrganization } = useOrganization()
  const { pendingMembers, getPendingMembers } = useOrganizationMember()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentOrganization?.id) {
      getOrganizationElections(currentOrganization.id)
      if (isOrgAdmin) getPendingMembers(currentOrganization.id)
    }
  }, [currentOrganization?.id])

  const activeElections = elections.filter(e => e.status === 1)
  const statCards = [
    { label: 'Total elections', value: totalElectionCount, dot: 'var(--accent)', sub: `${activeElections.length} active` },
    { label: 'Members', value: currentOrganization ? '—' : '0', dot: 'var(--warning)', sub: `${pendingMembers.length} pending` },
    { label: 'Votes cast', value: '—', dot: 'var(--success)', sub: 'All time' },
    { label: 'Organization', value: currentOrganization ? '1' : '0', dot: 'var(--info)', sub: 'Selected' },
  ]

  return (
    <div className='flex flex-col gap-5'>

      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-[20px] font-medium' style={{ color: 'var(--text)' }}>
            Welcome back, {user?.firstName}
          </h1>
          <p className='text-[13px] mt-0.5' style={{ color: 'var(--text2)' }}>
            {currentOrganization?.name ?? 'No organization selected'}
          </p>
        </div>
        {isOrgAdmin && (
          <button
            onClick={() => navigate('/admin/elections')}
            className='px-4 py-2 rounded-[8px] text-[13px] font-medium text-white hidden md:flex items-center gap-2'
            style={{ background: 'var(--accent)' }}
          >
            + New election
          </button>
        )}
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {statCards.map((s, i) => (
          <div key={i} className='rounded-[10px] p-3.5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className='text-[11px] mb-1' style={{ color: 'var(--text3)' }}>{s.label}</div>
            <div className='text-[22px] font-medium' style={{ color: 'var(--text)' }}>{s.value}</div>
            <div className='flex items-center gap-1.5 mt-1'>
              <div className='w-[5px] h-[5px] rounded-full' style={{ background: s.dot }} />
              <span className='text-[11px]' style={{ color: 'var(--text2)' }}>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

        {/* Recent elections */}
        <div className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='flex items-center justify-between mb-4'>
            <span className='text-[13px] font-medium' style={{ color: 'var(--text)' }}>Recent elections</span>
            <span
              onClick={() => navigate('/elections')}
              className='text-[11px] cursor-pointer'
              style={{ color: 'var(--accent)' }}
            >
              View all
            </span>
          </div>

          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24' style={{ color: 'var(--accent)' }}>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
              </svg>
            </div>
          ) : elections.length === 0 ? (
            <div className='text-center py-8'>
              <div className='text-[13px]' style={{ color: 'var(--text3)' }}>No elections yet</div>
            </div>
          ) : (
            elections.slice(0, 4).map((e, i) => {
              const s = statusStyle[e.status]
              return (
                <div
                  key={e.id}
                  onClick={() => navigate(`/elections/${e.id}`)}
                  className='flex items-center justify-between py-2.5 cursor-pointer hover:opacity-80 transition-opacity'
                  style={{ borderBottom: i < 3 ? '0.5px solid var(--border)' : 'none' }}
                >
                  <div>
                    <div className='text-[13px] font-medium' style={{ color: 'var(--text)' }}>{e.name}</div>
                    <div className='text-[11px] mt-0.5' style={{ color: 'var(--text3)' }}>{formatDate(e.createdAt)}</div>
                  </div>
                  <span
                    className='text-[10px] font-medium px-2 py-1 rounded-full'
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.label}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* Pending approvals — admin only */}
        {isOrgAdmin && (
          <div className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className='flex items-center justify-between mb-4'>
              <span className='text-[13px] font-medium' style={{ color: 'var(--text)' }}>Pending approvals</span>
              <span
                onClick={() => navigate('/organization/members')}
                className='text-[11px] cursor-pointer'
                style={{ color: 'var(--accent)' }}
              >
                Manage
              </span>
            </div>

            {pendingMembers.length === 0 ? (
              <div className='text-center py-8'>
                <div className='text-[13px]' style={{ color: 'var(--text3)' }}>No pending members</div>
              </div>
            ) : (
              pendingMembers.slice(0, 3).map((m, i) => (
                <div
                  key={m.userId}
                  className='flex items-center gap-3 py-2.5'
                  style={{ borderBottom: i < 2 ? '0.5px solid var(--border)' : 'none' }}
                >
                  <div
                    className='w-[32px] h-[32px] rounded-full flex items-center justify-center text-[11px] font-medium text-white flex-shrink-0'
                    style={{ background: 'var(--accent)' }}
                  >
                    {m.firstName[0]}{m.lastName[0]}
                  </div>
                  <div className='flex-1'>
                    <div className='text-[13px] font-medium' style={{ color: 'var(--text)' }}>
                      {m.firstName} {m.lastName}
                    </div>
                    <div className='text-[11px]' style={{ color: 'var(--text3)' }}>{m.email}</div>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      className='text-[11px] px-2.5 py-1 rounded-[6px] border'
                      style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                    >
                      Reject
                    </button>
                    <button
                      className='text-[11px] px-2.5 py-1 rounded-[6px] text-white'
                      style={{ background: 'var(--accent)' }}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage

