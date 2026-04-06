import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrganization } from '../../hooks/useOrganization'
import { useElection } from '../../hooks/useElection'
import { useOrganizationMember } from '../../hooks/useOrganizationMember'

const getElectionCategoryCount = (categoryCount?: number, categories?: { length: number }) =>
  categoryCount ?? categories?.length ?? 0

const OrganizationPage = () => {
  const { currentOrganization } = useOrganization()
  const { elections, getOrganizationElections } = useElection()
  const { memberShip, joinOrganization } = useOrganizationMember()
  const navigate = useNavigate()
  const [joinKey, setJoinKey] = useState('')
  const [joinDisplayName, setJoinDisplayName] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joinSuccess, setJoinSuccess] = useState(false)

  useEffect(() => {
    if (currentOrganization?.id) {
      getOrganizationElections(currentOrganization.id).catch(() => {})
    }
  }, [currentOrganization?.id, getOrganizationElections])

  if (!currentOrganization) {
    return <div className='text-center py-16' style={{ color: 'var(--text2)' }}>No organization selected</div>
  }

  const isManager = memberShip?.role === 1 || memberShip?.role === 2

  const handleJoin = async () => {
    if (!joinKey.trim() || !joinDisplayName.trim()) return
    setJoinLoading(true)
    setJoinError(null)
    setJoinSuccess(false)

    try {
      await joinOrganization({
        uniqueKey: joinKey.trim().toUpperCase(),
        displayName: joinDisplayName.trim(),
      })
      setJoinSuccess(true)
      setJoinKey('')
      setJoinDisplayName('')
    } catch (event: any) {
      setJoinError(event.response?.data?.message ?? event.message ?? 'Failed to join')
    } finally {
      setJoinLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-5 md:gap-6'>
      <section
        className='rounded-[26px] border p-5 md:p-7'
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-3xl'>
            <div className='text-[11px] font-semibold uppercase tracking-[0.16em]' style={{ color: 'var(--info)' }}>
              Organization profile
            </div>
            <h1 className='mt-3 text-[28px] font-semibold md:text-[34px]' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              {currentOrganization.name}
            </h1>
            <p className='mt-3 text-[14px] leading-6' style={{ color: 'var(--text2)' }}>
              {currentOrganization.description || 'No description added yet.'}
            </p>
            <div className='mt-4 inline-flex rounded-full px-3 py-1.5 text-[12px] font-medium' style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
              Key: {currentOrganization.uniqueKey}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
            <div className='rounded-[20px] border px-4 py-4' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <div className='text-[10px] uppercase tracking-[0.12em]' style={{ color: 'var(--text3)' }}>Elections</div>
              <div className='mt-2 text-[22px] font-semibold' style={{ color: 'var(--text)' }}>{elections.length}</div>
            </div>
            <div className='rounded-[20px] border px-4 py-4' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <div className='text-[10px] uppercase tracking-[0.12em]' style={{ color: 'var(--text3)' }}>Role</div>
              <div className='mt-2 text-[16px] font-semibold' style={{ color: 'var(--text)' }}>
                {memberShip?.role === 2 ? 'Owner' : memberShip?.role === 1 ? 'Admin' : 'Member'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]'>
        <div className='rounded-[26px] border p-5 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='flex items-center justify-between'>
            <h2 className='text-[20px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Recent elections
            </h2>
            <button onClick={() => navigate('/elections')} className='text-[12px] font-semibold' style={{ color: 'var(--accent)' }}>
              View all
            </button>
          </div>

          <div className='mt-5 grid gap-3'>
            {elections.slice(0, 4).map((election) => (
              <button
                key={election.id}
                onClick={() => navigate(`/elections/${election.id}`)}
                className='flex items-center justify-between gap-3 rounded-[20px] border p-4 text-left'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
              >
                <div className='min-w-0'>
                  <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>
                    {election.name}
                  </div>
                  <div className='mt-1 text-[12px]' style={{ color: 'var(--text2)' }}>
                    {getElectionCategoryCount(election.categoryCount, election.categories)} categories
                  </div>
                </div>
                <div className='text-[12px] font-medium' style={{ color: 'var(--accent)' }}>
                  Open
                </div>
              </button>
            ))}

            {elections.length === 0 && (
              <div className='rounded-[20px] border px-4 py-10 text-center' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                <div className='text-[15px] font-semibold' style={{ color: 'var(--text)' }}>
                  No elections yet
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='rounded-[26px] border p-5 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className='text-[20px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            Quick actions
          </h2>
          <div className='mt-5 grid gap-3'>
            {isManager && (
              <button
                onClick={() => navigate('/admin/elections')}
                className='rounded-[18px] border p-4 text-left'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
              >
                <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>Create new election</div>
                <div className='mt-1 text-[12px]' style={{ color: 'var(--text2)' }}>Start a fresh election workflow.</div>
              </button>
            )}
            {isManager && (
              <button
                onClick={() => navigate('/organization/members')}
                className='rounded-[18px] border p-4 text-left'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
              >
                <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>Manage members</div>
                <div className='mt-1 text-[12px]' style={{ color: 'var(--text2)' }}>Review approvals and roles.</div>
              </button>
            )}
            <div
              className='rounded-[18px] border p-4 text-left'
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
            >
              <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>Join another organization</div>
              <div className='mt-1 text-[12px]' style={{ color: 'var(--text2)' }}>Use an organization key to request access to another workspace.</div>
              <div className='mt-3 space-y-2.5'>
                <input
                  value={joinKey}
                  onChange={(event) => setJoinKey(event.target.value.toUpperCase())}
                  placeholder='Organization key'
                  className='w-full rounded-[14px] border px-3 py-2.5 text-[12px] outline-none'
                  style={{ background: 'var(--surface)', borderColor: joinError ? 'rgba(220,38,38,0.35)' : 'var(--border)', color: 'var(--text)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
                />
                <input
                  value={joinDisplayName}
                  onChange={(event) => setJoinDisplayName(event.target.value)}
                  placeholder='Display name'
                  className='w-full rounded-[14px] border px-3 py-2.5 text-[12px] outline-none'
                  style={{ background: 'var(--surface)', borderColor: joinError ? 'rgba(220,38,38,0.35)' : 'var(--border)', color: 'var(--text)' }}
                />
                <button
                  type='button'
                  onClick={handleJoin}
                  disabled={joinLoading || !joinKey.trim() || !joinDisplayName.trim()}
                  className='w-full rounded-[14px] px-3 py-2.5 text-[12px] font-semibold text-white disabled:opacity-55'
                  style={{ background: 'var(--accent)' }}
                >
                  {joinLoading ? 'Submitting...' : 'Submit join request'}
                </button>
                {joinError && <div className='rounded-[12px] px-3 py-2 text-[11px]' style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>{joinError}</div>}
                {joinSuccess && <div className='rounded-[12px] px-3 py-2 text-[11px]' style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Join request submitted successfully.</div>}
              </div>
            </div>
            <button
              onClick={() => navigate('/elections')}
              className='rounded-[18px] border p-4 text-left'
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
            >
              <div className='text-[14px] font-semibold' style={{ color: 'var(--text)' }}>Browse elections</div>
              <div className='mt-1 text-[12px]' style={{ color: 'var(--text2)' }}>See all active and closed elections.</div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OrganizationPage
