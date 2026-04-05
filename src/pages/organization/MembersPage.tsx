import { useEffect, useState } from 'react'
import { useOrganizationMember } from '../../hooks/useOrganizationMember'
import { useOrganization } from '../../hooks/useOrganization'
import { usePagination } from '../../hooks/usePagination'

type Tab = 'all' | 'pending'

const colors = ['#7c3aed', '#0891b2', '#059669', '#e8571a', '#b45309', '#1d4ed8']
const avatarColor = (i: number) => colors[i % colors.length]

const MembersPage = () => {
  const { currentOrganization } = useOrganization()
  const {
    members, pendingMembers, isLoading, error,
    getMembers, getPendingMembers,
    approveMember, rejectMember, removeMember,
    promoteToAdmin, demoteFromAdmin,
    joinOrganization, clearError,
  } = useOrganizationMember()

  const { page, pageSize, nextPage, prevPage } = usePagination(20)
  const [tab, setTab] = useState<Tab>('all')
  const [joinKey, setJoinKey] = useState('')
  const [joinDisplayName, setJoinDisplayName] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joinSuccess, setJoinSuccess] = useState(false)

  const orgId = currentOrganization?.id ?? ''

  useEffect(() => {
    if (!orgId) return
    getMembers(orgId, page, pageSize)
    getPendingMembers(orgId)
  }, [orgId, page, pageSize])

  const handleJoin = async () => {
    if (!joinKey.trim()) return
    setJoinLoading(true)
    setJoinError(null)
    setJoinSuccess(false)
    try {
       await joinOrganization({ uniqueKey: joinKey.trim().toUpperCase(), displayName: '' })
      setJoinSuccess(true)
      setJoinKey('')
    } catch (e: any) {
      setJoinError(e.response?.data?.message ?? e.message ?? 'Failed to join')
    } finally {
      setJoinLoading(false)
    }
  }

  const tabBtn = (t: Tab, label: string, count?: number) => (
    <button
      onClick={() => setTab(t)}
      className='flex items-center gap-2 px-4 py-2 text-[13px] rounded-[8px] transition-colors'
      style={{
        background: tab === t ? 'var(--accent)' : 'transparent',
        color: tab === t ? 'white' : 'var(--text2)',
        border: tab === t ? 'none' : '0.5px solid var(--border)',
      }}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          className='text-[10px] px-1.5 py-0.5 rounded-full'
          style={{
            background: tab === t ? 'rgba(255,255,255,0.25)' : 'var(--warning-bg)',
            color: tab === t ? 'white' : 'var(--warning)',
          }}
        >
          {count}
        </span>
      )}
    </button>
  )

  return (
    <div className='flex flex-col gap-5'>

      {/* Header */}
      <div className='flex items-start justify-between flex-wrap gap-3'>
        <div>
          <h1 className='text-[20px] font-medium' style={{ color: 'var(--text)' }}>Members</h1>
          <p className='text-[13px] mt-0.5' style={{ color: 'var(--text2)' }}>
            {currentOrganization?.name} · {members.length} members
          </p>
        </div>

        {/* Join org input */}
       <div className='flex flex-col gap-2'>
  <div className='flex items-center gap-2'>
    <input
      value={joinKey}
      onChange={e => setJoinKey(e.target.value.toUpperCase())}
      placeholder='Organization key'
      className='px-3 py-2 rounded-[8px] text-[12px] outline-none border w-[160px]'
      style={{
        background: 'var(--surface2)',
        borderColor: joinError ? 'var(--danger)' : 'var(--border)',
        color: 'var(--text)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
      }}
    />
    <input
      value={joinDisplayName}
      onChange={e => setJoinDisplayName(e.target.value)}
      placeholder='Display name'
      className='px-3 py-2 rounded-[8px] text-[12px] outline-none border w-[140px]'
      style={{
        background: 'var(--surface2)',
        borderColor: joinError ? 'var(--danger)' : 'var(--border)',
        color: 'var(--text)',
      }}
    />
    <button
      onClick={handleJoin}
      disabled={joinLoading || !joinKey.trim() || !joinDisplayName.trim()}
      className='px-3 py-2 rounded-[8px] text-[12px] font-medium text-white disabled:opacity-50 flex items-center gap-1.5'
      style={{ background: 'var(--accent)' }}
    >
      {joinLoading && (
        <svg className='animate-spin w-3 h-3' fill='none' viewBox='0 0 24 24'>
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
        </svg>
      )}
      Join org
    </button>
  </div>
  {joinError && (
    <span className='text-[11px]' style={{ color: 'var(--danger)' }}>{joinError}</span>
  )}
  {joinSuccess && (
    <span className='text-[11px]' style={{ color: 'var(--success)' }}>
      Join request submitted — awaiting admin approval
    </span>
  )}
</div>
      </div>

      {/* Global error */}
      {error && (
        <div
          className='text-[12px] px-3 py-2.5 rounded-[8px] flex items-center justify-between'
          style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}
        >
          {error}
          <button onClick={clearError} className='text-[11px] underline ml-3'>Dismiss</button>
        </div>
      )}

      {/* Tabs */}
      <div className='flex items-center gap-2'>
        {tabBtn('all', 'All members', members.length)}
        {tabBtn('pending', 'Pending approvals', pendingMembers.length)}
      </div>

      {/* Pending tab */}
      {tab === 'pending' && (
        <div className='rounded-[12px] border overflow-hidden' style={{ borderColor: 'var(--border)' }}>
          {pendingMembers.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 gap-2' style={{ background: 'var(--surface)' }}>
              <div className='text-[32px]'>✓</div>
              <div className='text-[14px] font-medium' style={{ color: 'var(--text)' }}>All caught up</div>
              <div className='text-[12px]' style={{ color: 'var(--text3)' }}>No pending approvals</div>
            </div>
          ) : (
            pendingMembers.map((m, i) => (
              <div
                key={m.userId}
                className='flex items-center gap-3 p-4'
                style={{
                  background: 'var(--surface)',
                  borderBottom: i < pendingMembers.length - 1 ? '0.5px solid var(--border)' : 'none',
                }}
              >
                <div
                  className='w-[36px] h-[36px] rounded-full flex items-center justify-center text-[12px] font-medium text-white flex-shrink-0'
                  style={{ background: avatarColor(i) }}
                >
                  {m.firstName[0]}{m.lastName[0]}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-[13px] font-medium truncate' style={{ color: 'var(--text)' }}>
                    {m.firstName} {m.lastName}
                  </div>
                  <div className='text-[11px] truncate' style={{ color: 'var(--text3)' }}>{m.email}</div>
                  <div className='text-[10px] mt-0.5' style={{ color: 'var(--text3)' }}>
                    Requested {new Date(m.joinedAt).toLocaleDateString()}
                  </div>
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
            ))
          )}
        </div>
      )}

      {/* All members tab */}
      {tab === 'all' && (
        <>
          <div className='rounded-[12px] border overflow-hidden' style={{ borderColor: 'var(--border)' }}>
            {isLoading ? (
              <div className='flex items-center justify-center py-12' style={{ background: 'var(--surface)' }}>
                <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24' style={{ color: 'var(--accent)' }}>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
                </svg>
              </div>
            ) : members.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 gap-2' style={{ background: 'var(--surface)' }}>
                <div className='text-[13px]' style={{ color: 'var(--text3)' }}>No members found</div>
              </div>
            ) : (
              members.map((m, i) => (
                <div
                  key={m.userId}
                  className='flex items-center gap-3 p-4'
                  style={{
                    background: 'var(--surface)',
                    borderBottom: i < members.length - 1 ? '0.5px solid var(--border)' : 'none',
                  }}
                >
                  <div
                    className='w-[36px] h-[36px] rounded-full flex items-center justify-center text-[12px] font-medium text-white flex-shrink-0'
                    style={{ background: avatarColor(i) }}
                  >
                    {m.fullName?.[0] ?? '?'}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='text-[13px] font-medium truncate' style={{ color: 'var(--text)' }}>
                      {m.fullName}
                    </div>
                    <div className='text-[11px] truncate' style={{ color: 'var(--text3)' }}>{m.email}</div>
                  </div>

                 {/* Show Admin badge only for Admin and Owner roles */}
{(m.role === 1 || m.role === 2) && (
  <span className='text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0' 
    style={{ background: 'var(--info-bg)', color: 'var(--info)' }}
  >
    {m.role === 1 ? 'Admin' : 'Owner'}
  </span>
)}

              <div className='flex gap-2 flex-shrink-0'>
                {/* Show Demote button for Admin role, Promote button for Member role */}
                  {m.role === 1 ? (
                    <button onClick={() => demoteFromAdmin(orgId, m.userId)} 
                      className='text-[11px] px-2.5 py-1.5 rounded-[6px] border' 
                      style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                    >
                      Demote
                    </button>
                  ) : m.role === 0 ? (
                    <button onClick={() => promoteToAdmin(orgId, m.userId)} 
                      className='text-[11px] px-2.5 py-1.5 rounded-[6px] border' 
                      style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                    >
                      Promote
                    </button>
                  ) : null}

                    {/* Show Remove button for all roles except Owner */}
                    {m.role !== 2 && (
                      <button onClick={() => removeMember(orgId, m.userId)} 
                        className='text-[11px] px-2.5 py-1.5 rounded-[6px] border' 
                        style={{ borderColor: 'var(--border)', color: 'var(--danger)' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {members.length > 0 && (
            <div className='flex items-center justify-between'>
              <span className='text-[12px]' style={{ color: 'var(--text3)' }}>
                Page {page} · {members.length} members shown
              </span>
              <div className='flex gap-2'>
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  className='px-3 py-1.5 rounded-[7px] text-[12px] border disabled:opacity-40'
                  style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                >
                  ← Prev
                </button>
                <button
                  onClick={nextPage}
                  disabled={members.length < pageSize}
                  className='px-3 py-1.5 rounded-[7px] text-[12px] border disabled:opacity-40'
                  style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MembersPage