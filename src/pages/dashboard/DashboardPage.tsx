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

const membershipStatusLabel = (status?: number) => {
  switch (status) {
    case 0:
      return 'Pending'
    case 1:
      return 'Approved'
    case 2:
      return 'Removed'
    case 3:
      return 'Rejected'
    default:
      return 'Unknown'
  }
}

const roleLabel = (role?: number) => {
  switch (role) {
    case 0:
      return 'Member'
    case 1:
      return 'Admin'
    case 2:
      return 'Owner'
    default:
      return 'Unknown'
  }
}

const pendingTone = (count: number) => ({
  bg: 'var(--accent-bg)',
  color: 'var(--accent)',
  text: count > 0 ? `${count} request${count === 1 ? '' : 's'} waiting` : 'No requests waiting',
})

const getElectionCategoryCount = (categoryCount?: number, categories?: { length: number }) =>
  categoryCount ?? categories?.length ?? 0

const DashboardPage = () => {
  const { user } = useAuth()
  const { elections, totalElectionCount, getOrganizationElections, isLoading } = useElection()
  const { currentOrganization, totalVotes, getOrganizationVotesCount } = useOrganization()
  const { pendingMembers, memberShip, getPendingMembers } = useOrganizationMember()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentOrganization?.id) {
      getOrganizationElections(currentOrganization.id).catch(() => {})
      getOrganizationVotesCount(currentOrganization.id).catch(() => {})
    }
  }, [currentOrganization?.id, getOrganizationElections, getOrganizationVotesCount])

  useEffect(() => {
    if (
      currentOrganization?.id &&
      (memberShip?.role === 1 || memberShip?.role === 2)
    ) {
      getPendingMembers(currentOrganization.id).catch(() => {})
    }
  }, [currentOrganization?.id, memberShip?.role, getPendingMembers])

  const activeElections = elections.filter((e) => e.status === 1)
  const recentElections = elections.slice(0, 4)
  const isManager = memberShip?.role === 1 || memberShip?.role === 2
  const approvalTone = pendingTone(pendingMembers.length)

  const statCards = [
    {
      label: 'Total elections',
      value: totalElectionCount,
      sub: `${activeElections.length} active now`,
      accent: 'var(--accent)',
      bg: 'var(--surface)',
    },
    {
      label: 'Votes cast',
      value: totalVotes ?? 0,
      sub: 'Across this organization',
      accent: 'var(--accent)',
      bg: 'var(--surface)',
    },
    {
      label: 'Pending approvals',
      value: isManager ? pendingMembers.length : 0,
      sub: isManager ? approvalTone.text : 'Visible to admins and owners',
      accent: 'var(--accent)',
      bg: 'var(--surface)',
    },
    {
      label: 'Membership',
      value: roleLabel(memberShip?.role),
      sub: `${membershipStatusLabel(memberShip?.status)} status`,
      accent: 'var(--accent)',
      bg: 'var(--surface)',
    },
  ]

  return (
    <div className='flex flex-col gap-4 md:gap-6'>
      <section
        className='relative overflow-hidden rounded-[24px] md:rounded-[30px] border p-5 md:p-7'
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className='relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]'
              style={{
                borderColor: 'var(--border)',
                color: 'var(--accent)',
                background: 'var(--surface2)',
              }}
            >
              <span
                className='h-2 w-2 rounded-full'
                style={{ background: memberShip?.status === 1 ? 'var(--success)' : 'var(--warning)' }}
              />
              Workspace overview
            </div>

            <h1
              className='mt-4 text-[28px] font-semibold leading-[1.05] md:text-[40px]'
              style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
            >
              Welcome back, {user?.firstName ?? 'there'}
            </h1>

            <p className='mt-3 max-w-2xl text-[14px] leading-6 md:text-[15px]' style={{ color: 'var(--text2)' }}>
              {currentOrganization?.name ?? 'No organization selected'} is your current workspace.
              Review approvals, monitor election activity, and move quickly between admin actions
              without losing context on smaller screens.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-[340px]'>
            <button
              onClick={() => navigate('/elections')}
              className='rounded-[18px] px-4 py-3 text-left transition-transform hover:-translate-y-0.5'
              style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
              }}
            >
              <div className='text-[11px] uppercase tracking-[0.14em]' style={{ color: 'var(--text3)' }}>
                Browse
              </div>
              <div className='mt-1 text-[15px] font-semibold' style={{ color: 'var(--text)' }}>
                View elections
              </div>
            </button>

            {isManager && (
              <button
                onClick={() => navigate('/organization/members')}
                className='rounded-[18px] px-4 py-3 text-left transition-transform hover:-translate-y-0.5'
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                }}
              >
                <div className='text-[11px] uppercase tracking-[0.14em] text-white/70'>
                  Action
                </div>
                <div className='mt-1 text-[15px] font-semibold'>Review approvals</div>
              </button>
            )}
          </div>
        </div>
      </section>

      <section className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        {statCards.map((card) => (
          <article
            key={card.label}
            className='rounded-[22px] border p-4 md:p-5'
            style={{
              background: card.bg,
              borderColor: 'var(--border)',
              boxShadow: '0 18px 45px rgba(16, 42, 67, 0.05)',
            }}
          >
            <div className='flex items-start justify-between gap-3'>
              <div>
                <div className='text-[11px] font-semibold uppercase tracking-[0.14em]' style={{ color: 'var(--text3)' }}>
                  {card.label}
                </div>
                <div
                  className='mt-3 text-[24px] font-semibold md:text-[27px]'
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                >
                  {card.value}
                </div>
              </div>
              <div
                className='mt-1 h-3 w-3 rounded-full'
                style={{ background: card.accent, boxShadow: `0 0 0 8px color-mix(in srgb, ${card.accent} 18%, transparent)` }}
              />
            </div>
            <div className='mt-3 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>
              {card.sub}
            </div>
          </article>
        ))}
      </section>

      <section className='grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.95fr]'>
        <div className='rounded-[26px] border p-4 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between' style={{ borderColor: 'var(--border)' }}>
            <div>
              <h2 className='text-[20px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                Approval workspace
              </h2>
              <p className='mt-1 text-[13px] leading-5' style={{ color: 'var(--text2)' }}>
                A fast lane for the items that need attention first.
              </p>
            </div>

            <div
              className='inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium'
              style={{ background: approvalTone.bg, color: approvalTone.color }}
            >
              <span className='h-2 w-2 rounded-full' style={{ background: approvalTone.color }} />
              {approvalTone.text}
            </div>
          </div>

          {!isManager ? (
            <div className='rounded-[22px] border px-4 py-6 mt-5' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <div className='text-[16px] font-semibold' style={{ color: 'var(--text)' }}>
                Approval queue is reserved for admins and owners
              </div>
              <p className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
                You can still browse elections and stay updated here, but only managers can approve
                pending membership requests.
              </p>
            </div>
          ) : pendingMembers.length === 0 ? (
            <div className='rounded-[22px] border px-4 py-8 mt-5 text-center' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <div
                className='mx-auto flex h-14 w-14 items-center justify-center rounded-full'
                style={{ background: 'var(--success-bg)', color: 'var(--success)' }}
              >
                OK
              </div>
              <div className='mt-4 text-[17px] font-semibold' style={{ color: 'var(--text)' }}>
                Everything is up to date
              </div>
              <p className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
                No pending requests right now. When new members ask to join, they will show here.
              </p>
            </div>
          ) : (
            <div className='mt-5 grid gap-3'>
              {pendingMembers.slice(0, 3).map((member) => (
                <article
                  key={member.userId}
                  className='rounded-[22px] border p-4 md:p-5'
                  style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
                >
                  <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-start gap-3'>
                      <div
                        className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[16px] text-[14px] font-semibold'
                        style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                      >
                        {member.firstName[0]}{member.lastName[0]}
                      </div>

                      <div className='min-w-0'>
                        <div className='text-[15px] font-semibold' style={{ color: 'var(--text)' }}>
                          {member.firstName} {member.lastName}
                        </div>
                        <div className='mt-1 break-all text-[12px]' style={{ color: 'var(--text2)' }}>
                          {member.email}
                        </div>
                        <div className='mt-2 flex flex-wrap items-center gap-2 text-[11px]'>
                          <span
                            className='rounded-full px-2.5 py-1 font-medium'
                            style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}
                          >
                            Pending
                          </span>
                          <span style={{ color: 'var(--text3)' }}>
                            Requested {formatDate(member.joinedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/organization/members')}
                      className='rounded-[14px] px-4 py-2.5 text-[13px] font-medium'
                      style={{ background: 'var(--accent)', color: 'white' }}
                    >
                      Open queue
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className='grid gap-4'>
          <div className='rounded-[26px] border p-4 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-[20px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  Election stream
                </h2>
                <p className='mt-1 text-[13px]' style={{ color: 'var(--text2)' }}>
                  Latest activity in your workspace.
                </p>
              </div>
              <button
                onClick={() => navigate('/elections')}
                className='text-[12px] font-medium'
                style={{ color: 'var(--accent)' }}
              >
                View all
              </button>
            </div>

            <div className='mt-5 space-y-3'>
              {isLoading ? (
                <div className='flex items-center justify-center py-10'>
                  <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24' style={{ color: 'var(--accent)' }}>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                  </svg>
                </div>
              ) : recentElections.length === 0 ? (
                <div className='rounded-[20px] border px-4 py-8 text-center' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                  <div className='text-[15px] font-semibold' style={{ color: 'var(--text)' }}>
                    No elections yet
                  </div>
                  <p className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
                    Start by creating one when your organization is ready.
                  </p>
                </div>
              ) : (
                recentElections.map((election) => {
                  const tone = statusStyle[election.status]

                  return (
                    <button
                      key={election.id}
                      onClick={() => navigate(`/elections/${election.id}`)}
                      className='flex w-full items-start justify-between gap-3 rounded-[20px] border p-4 text-left transition-transform hover:-translate-y-0.5'
                      style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
                    >
                      <div className='min-w-0'>
                        <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>
                          {election.name}
                        </div>
                        <div className='mt-1 text-[12px]' style={{ color: 'var(--text2)' }}>
                          {getElectionCategoryCount(election.categoryCount, election.categories)} categories
                        </div>
                        <div className='mt-2 text-[11px]' style={{ color: 'var(--text3)' }}>
                          Created {formatDate(election.createdAt)}
                        </div>
                      </div>

                      <span
                        className='rounded-full px-2.5 py-1 text-[10px] font-semibold'
                        style={{ background: tone.bg, color: tone.color }}
                      >
                        {tone.label}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className='rounded-[26px] border p-4 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className='text-[20px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Quick actions
            </h2>
            <p className='mt-1 text-[13px]' style={{ color: 'var(--text2)' }}>
              Use the actions you need most without hunting through the menu.
            </p>

            <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <button
                onClick={() => navigate('/organization/members')}
                disabled={!isManager}
                className='rounded-[18px] border p-4 text-left disabled:opacity-50'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
              >
                <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>
                  Members
                </div>
                <div className='mt-1 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>
                  Review approvals, promotions, and membership changes.
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/elections')}
                disabled={!isManager}
                className='rounded-[18px] border p-4 text-left disabled:opacity-50'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
              >
                <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>
                  Manage elections
                </div>
                <div className='mt-1 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>
                  Create, open, and organize election categories.
                </div>
              </button>

              <button
                onClick={() => navigate(`/organization/${currentOrganization?.id}`)}
                className='rounded-[18px] border p-4 text-left'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
              >
                <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>
                  Organization profile
                </div>
                <div className='mt-1 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>
                  Check workspace details and your organization key.
                </div>
              </button>

              <button
                onClick={() => navigate('/elections')}
                className='rounded-[18px] border p-4 text-left'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
              >
                <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>
                  Election archive
                </div>
                <div className='mt-1 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>
                  Browse active, pending, and closed elections.
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
