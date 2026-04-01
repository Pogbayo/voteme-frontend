import { useEffect } from 'react'
import { useOrganizationMember } from '../../hooks/useOrganizationMember'
import { useOrganization } from '../../hooks/useOrganization'
// import { MembershipStatus } from '../../types/member.types'

// const statusStyle: Record<number, { label: string; bg: string; color: string }> = {
//   0: { label: 'Pending', bg: 'var(--warning-bg)', color: 'var(--warning)' },
//   1: { label: 'Approved', bg: 'var(--success-bg)', color: 'var(--success)' },
//   2: { label: 'Rejected', bg: 'var(--danger-bg)', color: 'var(--danger)' },
//   3: { label: 'Banned', bg: 'var(--surface2)', color: 'var(--text3)' },
// }

const MembersPage = () => {
  const { currentOrganization } = useOrganization()
  const {
    members, pendingMembers, isLoading,
    getMembers, getPendingMembers,
    approveMember, rejectMember, removeMember, promoteToAdmin, demoteFromAdmin
  } = useOrganizationMember()

  useEffect(() => {
    if (currentOrganization?.id) {
      getMembers(currentOrganization.id)
      getPendingMembers(currentOrganization.id)
    }
  }, [currentOrganization?.id])

  const orgId = currentOrganization?.id ?? ''

  const colors = ['#7c3aed', '#0891b2', '#059669', '#e8571a', '#b45309', '#1d4ed8']
  const avatarColor = (i: number) => colors[i % colors.length]

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h1 className='text-[20px] font-medium' style={{ color: 'var(--text)' }}>Members</h1>
        <p className='text-[13px] mt-0.5' style={{ color: 'var(--text2)' }}>
          {members.length} members · {pendingMembers.length} pending
        </p>
      </div>

      {/* Pending */}
      {pendingMembers.length > 0 && (
        <div className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='text-[13px] font-medium mb-4 flex items-center gap-2' style={{ color: 'var(--text)' }}>
            Pending approvals
            <span className='text-[10px] px-2 py-0.5 rounded-full' style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              {pendingMembers.length}
            </span>
          </div>
          {pendingMembers.map((m, i) => (
            <div
              key={m.userId}
              className='flex items-center gap-3 py-3'
              style={{ borderBottom: i < pendingMembers.length - 1 ? '0.5px solid var(--border)' : 'none' }}
            >
              <div
                className='w-[34px] h-[34px] rounded-full flex items-center justify-center text-[11px] font-medium text-white flex-shrink-0'
                style={{ background: avatarColor(i) }}
              >
                {m.firstName[0]}{m.lastName[0]}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='text-[13px] font-medium truncate' style={{ color: 'var(--text)' }}>
                  {m.firstName} {m.lastName}
                </div>
                <div className='text-[11px] truncate' style={{ color: 'var(--text3)' }}>{m.email}</div>
              </div>
              <div className='flex gap-2 flex-shrink-0'>
                <button
                  onClick={() => rejectMember(orgId, m.userId)}
                  className='text-[11px] px-3 py-1.5 rounded-[6px] border'
                  style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                >
                  Reject
                </button>
                <button
                  onClick={() => approveMember(orgId, m.userId)}
                  className='text-[11px] px-3 py-1.5 rounded-[6px] text-white'
                  style={{ background: 'var(--accent)' }}
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All members */}
      <div className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className='text-[13px] font-medium mb-4' style={{ color: 'var(--text)' }}>All members</div>
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24' style={{ color: 'var(--accent)' }}>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
            </svg>
          </div>
        ) : members.map((m, i) => {
        //   const s = statusStyle[1]
          return (
            <div
              key={m.userId}
              className='flex items-center gap-3 py-3'
              style={{ borderBottom: i < members.length - 1 ? '0.5px solid var(--border)' : 'none' }}
            >
              <div
                className='w-[34px] h-[34px] rounded-full flex items-center justify-center text-[11px] font-medium text-white flex-shrink-0'
                style={{ background: avatarColor(i) }}
              >
                {m.fullName?.[0] ?? '?'}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='text-[13px] font-medium truncate' style={{ color: 'var(--text)' }}>{m.fullName}</div>
                <div className='text-[11px] truncate' style={{ color: 'var(--text3)' }}>{m.email}</div>
              </div>
              {m.isAdmin && (
                <span className='text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0' style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
                  Admin
                </span>
              )}
              <div className='flex gap-2 flex-shrink-0'>
                {m.isAdmin ? (
                  <button
                    onClick={() => demoteFromAdmin(orgId, m.userId)}
                    className='text-[11px] px-2.5 py-1.5 rounded-[6px] border'
                    style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                  >
                    Demote
                  </button>
                ) : (
                  <button
                    onClick={() => promoteToAdmin(orgId, m.userId)}
                    className='text-[11px] px-2.5 py-1.5 rounded-[6px] border'
                    style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                  >
                    Promote
                  </button>
                )}
                <button
                  onClick={() => removeMember(orgId, m.userId)}
                  className='text-[11px] px-2.5 py-1.5 rounded-[6px] border'
                  style={{ borderColor: 'var(--border)', color: 'var(--danger)' }}
                >
                  Remove
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MembersPage