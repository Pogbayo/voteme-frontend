import { useEffect, useState } from 'react'
import { useOrganizationMember } from '../../hooks/useOrganizationMember'
import { useOrganization } from '../../hooks/useOrganization'
import { usePagination } from '../../hooks/usePagination'

type Tab = 'all' | 'pending'

const avatarShades = ['#2f86ff', '#4a97ff', '#689fff', '#5b94f0']
const avatarColor = (index: number) => avatarShades[index % avatarShades.length]

const MembersPage = () => {
  const { currentOrganization } = useOrganization()
  const {
    members,
    pendingMembers,
    isMembersLoading,
    isPendingMembersLoading,
    actionLoadingUserId,
    actionLoadingType,
    error,
    getMembers,
    getPendingMembers,
    approveMember,
    rejectMember,
    // removeMember,
    // promoteToAdmin,
    // demoteFromAdmin,
    clearError,
  } = useOrganizationMember()

  const { page, pageSize, nextPage, prevPage } = usePagination(20)
  const [tab, setTab] = useState<Tab>('all')

  const orgId = currentOrganization?.id ?? ''
  const isPendingTabLoading = tab === 'pending' && isPendingMembersLoading
  const isAllMembersTabLoading = tab === 'all' && isMembersLoading

  useEffect(() => {
    if (!orgId) return
    getMembers(orgId, page, pageSize).catch(() => {})
    getPendingMembers(orgId).catch(() => {})
  }, [orgId, page, pageSize, getMembers, getPendingMembers])

  const tabButton = (targetTab: Tab, label: string, count: number) => (
    <button
      type='button'
      onClick={() => setTab(targetTab)}
      className='rounded-full px-4 py-2 text-[12px] font-semibold transition'
      style={{
        background: tab === targetTab ? 'var(--accent)' : 'var(--surface2)',
        color: tab === targetTab ? 'white' : 'var(--text2)',
        border: `1px solid ${tab === targetTab ? 'var(--accent)' : 'var(--border)'}`,
      }}
    >
      {label} ({count})
    </button>
  )

  return (
    <div className='space-y-5'>
      <section className='rounded-[28px] border p-5 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className='space-y-4'>
          <div className='inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]' style={{ borderColor: 'var(--border)', background: 'var(--surface2)', color: 'var(--accent)' }}>
            Membership workspace
          </div>

          <div>
            <h1 className='text-[24px] font-semibold md:text-[30px]' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Members and approvals
            </h1>
            <p className='mt-2 max-w-[680px] text-[13px] leading-6 md:text-[14px]' style={{ color: 'var(--text2)' }}>
              Review members, handle pending approvals, and manage roles for the current organization.
            </p>
          </div>

          <div className='grid gap-3 sm:grid-cols-3'>
            {[
              ['Organization', currentOrganization?.name ?? 'No organization selected'],
              ['Members', `${members.length}`],
              ['Pending', `${pendingMembers.length}`],
            ].map(([label, value]) => (
              <div key={label} className='rounded-[18px] border px-4 py-4' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                <div className='text-[10px] font-semibold uppercase tracking-[0.16em]' style={{ color: 'var(--text3)' }}>{label}</div>
                <div className='mt-2 text-[15px] font-semibold' style={{ color: 'var(--text)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <div className='flex items-center justify-between rounded-[16px] border px-4 py-3 text-[12px]' style={{ background: 'var(--danger-bg)', borderColor: 'rgba(220,38,38,0.16)', color: 'var(--danger)' }}>
          <span>{error}</span>
          <button type='button' onClick={clearError} className='underline'>
            Dismiss
          </button>
        </div>
      )}

      <section className='grid gap-5 xl:grid-cols-[1.35fr_0.8fr]'>
        <div className='rounded-[24px] border p-4 md:p-5' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <h2 className='text-[18px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Member directory</h2>
              <p className='mt-1 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>
                Switch between approved members and pending requests.
              </p>
            </div>
            <div className='flex flex-wrap gap-2'>
              {tabButton('all', 'All members', members.length)}
              {tabButton('pending', 'Pending', pendingMembers.length)}
            </div>
          </div>

          <div className='mt-4 space-y-3'>
            {tab === 'pending' ? (
              isPendingTabLoading ? (
                <div className='rounded-[18px] border px-4 py-8 text-center' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                  <div className='flex items-center justify-center gap-2 text-[13px]' style={{ color: 'var(--text2)' }}>
                    <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24' style={{ color: 'var(--accent)' }}>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                    </svg>
                    <span>Loading pending members...</span>
                  </div>
                </div>
              ) : pendingMembers.length === 0 ? (
                <div className='rounded-[18px] border px-4 py-8 text-center' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                  <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>No pending approvals</div>
                  <div className='mt-2 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>New requests will appear here.</div>
                </div>
              ) : (
                pendingMembers.map((member, index) => (
                  <article key={member.userId} className='rounded-[18px] border px-4 py-4' style={{ background: 'var(--surface2)', borderColor: 'rgba(219,230,240,0.7)' }}>
                    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                      <div className='flex items-center gap-3 min-w-0'>
                        <div className='flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-semibold text-white' style={{ background: avatarColor(index) }}>
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div className='min-w-0'>
                          <div className='truncate text-[14px] font-semibold' style={{ color: 'var(--text)' }}>
                            {member.firstName} {member.lastName}
                          </div>
                          <div className='truncate text-[12px]' style={{ color: 'var(--text2)' }}>{member.email}</div>
                          <div className='mt-1 text-[11px]' style={{ color: 'var(--text3)' }}>
                            Requested {new Date(member.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-wrap gap-2'>
                        <button
                          type='button'
                          onClick={() => rejectMember(orgId, member.userId)}
                          disabled={actionLoadingUserId === member.userId}
                          className='rounded-[14px] border px-3 py-2 text-[12px] font-semibold'
                          style={{
                            background: 'var(--surface)',
                            borderColor: 'var(--border)',
                            color: 'var(--text2)',
                            opacity: actionLoadingUserId === member.userId ? 0.6 : 1,
                          }}
                        >
                          {actionLoadingUserId === member.userId && actionLoadingType === 'reject' ? 'Rejecting...' : 'Reject'}
                        </button>
                        <button
                          type='button'
                          onClick={() => approveMember(orgId, member.userId)}
                          disabled={actionLoadingUserId === member.userId}
                          className='rounded-[14px] px-3 py-2 text-[12px] font-semibold text-white'
                          style={{
                            background: 'var(--accent)',
                            opacity: actionLoadingUserId === member.userId ? 0.72 : 1,
                          }}
                        >
                          {actionLoadingUserId === member.userId && actionLoadingType === 'approve' ? 'Approving...' : 'Approve'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )
            ) : isAllMembersTabLoading ? (
              <div className='rounded-[18px] border px-4 py-8 text-center' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                <div className='flex items-center justify-center gap-2 text-[13px]' style={{ color: 'var(--text2)' }}>
                  <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24' style={{ color: 'var(--accent)' }}>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                  </svg>
                  <span>Loading organization members...</span>
                </div>
              </div>
            ) : members.length === 0 ? (
              <div className='rounded-[18px] border px-4 py-8 text-center' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>No members found</div>
                <div className='mt-2 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>Approved members will appear here.</div>
              </div>
            ) : (
              members.map((member, index) => (
                <article key={member.userId} className='rounded-[18px] border px-4 py-4' style={{ background: 'var(--surface2)', borderColor: 'rgba(219,230,240,0.7)' }}>
                  <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div className='flex items-center gap-3 min-w-0'>
                      <div className='flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-semibold text-white' style={{ background: avatarColor(index) }}>
                        {member.fullName?.[0] ?? '?'}
                      </div>
                      <div className='min-w-0'>
                        <div className='truncate text-[14px] font-semibold' style={{ color: 'var(--text)' }}>{member.fullName}</div>
                        <div className='truncate text-[12px]' style={{ color: 'var(--text2)' }}>{member.email}</div>
                      </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-2'>
                      {(member.role === 1 || member.role === 2) && (
                        <span className='rounded-full px-3 py-1.5 text-[11px] font-semibold' style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                          {member.role === 1 ? 'Admin' : 'Owner'}
                        </span>
                      )}

                      {/* {member.role === 1 ? (
                        <button
                          type='button'
                          onClick={() => demoteFromAdmin(orgId, member.userId)}
                          disabled={actionLoadingUserId === member.userId}
                          className='rounded-[14px] border px-3 py-2 text-[12px] font-semibold'
                          style={{
                            background: 'var(--surface)',
                            borderColor: 'var(--border)',
                            color: 'var(--text2)',
                            opacity: actionLoadingUserId === member.userId ? 0.6 : 1,
                          }}
                        >
                          {actionLoadingUserId === member.userId && actionLoadingType === 'demote' ? 'Demoting...' : 'Demote'}
                        </button>
                      ) : member.role === 0 ? (
                        <button
                          type='button'
                          onClick={() => promoteToAdmin(orgId, member.userId)}
                          disabled={actionLoadingUserId === member.userId}
                          className='rounded-[14px] border px-3 py-2 text-[12px] font-semibold'
                          style={{
                            background: 'var(--surface)',
                            borderColor: 'var(--border)',
                            color: 'var(--text2)',
                            opacity: actionLoadingUserId === member.userId ? 0.6 : 1,
                          }}
                        >
                          {actionLoadingUserId === member.userId && actionLoadingType === 'promote' ? 'Promoting...' : 'Promote'}
                        </button>
                      ) : null} */}

                      {/* {member.role !== 2 && (
                        <button
                          type='button'
                          onClick={() => removeMember(orgId, member.userId)}
                          disabled={actionLoadingUserId === member.userId}
                          className='rounded-[14px] border px-3 py-2 text-[12px] font-semibold'
                          style={{
                            background: 'var(--surface)',
                            borderColor: 'rgba(220,38,38,0.2)',
                            color: 'var(--danger)',
                            opacity: actionLoadingUserId === member.userId ? 0.6 : 1,
                          }}
                        >
                          {actionLoadingUserId === member.userId && actionLoadingType === 'remove' ? 'Removing...' : 'Remove'}
                        </button>
                      )} */}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className='space-y-4'>
          <div className='rounded-[24px] border p-4 md:p-5' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className='text-[17px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Approval flow</h2>
            <div className='mt-3 space-y-2.5'>
              {[
                'Members submit a join request with the organization key and display name.',
                'Admins or owners review pending requests in the approval panel.',
                'Only approved members can access dashboard content and voting panels.',
              ].map(item => (
                <div key={item} className='rounded-[16px] px-3 py-3 text-[12px] leading-5' style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-[24px] border p-4 md:p-5' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className='flex items-center justify-between'>
              <h2 className='text-[17px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Pagination</h2>
              <span className='text-[11px] font-semibold' style={{ color: 'var(--text3)' }}>Page {page}</span>
            </div>
            <p className='mt-2 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>
              Move through the approved member list in manageable chunks.
            </p>
            <div className='mt-4 flex gap-2.5'>
              <button
                type='button'
                onClick={prevPage}
                disabled={page === 1}
                className='rounded-[14px] border px-3 py-2 text-[12px] font-semibold disabled:opacity-45'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text2)' }}
              >
                Previous
              </button>
              <button
                type='button'
                onClick={nextPage}
                disabled={members.length < pageSize}
                className='rounded-[14px] border px-3 py-2 text-[12px] font-semibold disabled:opacity-45'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text2)' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MembersPage
