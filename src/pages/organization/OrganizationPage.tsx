import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrganization } from '../../hooks/useOrganization'
import { useElection } from '../../hooks/useElection'
import { useAuth } from '../../hooks/useAuth'

const OrganizationPage = () => {
  const { currentOrganization } = useOrganization()
  const { elections, getOrganizationElections } = useElection()
  const { isOrgAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentOrganization?.id) getOrganizationElections(currentOrganization.id)
  }, [currentOrganization?.id])

  if (!currentOrganization) return (
    <div className='text-center py-16' style={{ color: 'var(--text2)' }}>No organization selected</div>
  )

  return (
    <div className='flex flex-col gap-5 max-w-3xl'>

      {/* Org header */}
      <div className='rounded-[12px] p-5 border flex flex-col md:flex-row items-start md:items-center gap-4' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div
          className='w-[52px] h-[52px] rounded-[12px] flex items-center justify-center text-[22px] flex-shrink-0'
          style={{ background: 'var(--accent-bg)', border: '0.5px solid var(--border)' }}
        >
          🏛️
        </div>
        <div className='flex-1'>
          <h1 className='text-[18px] font-medium' style={{ color: 'var(--text)' }}>{currentOrganization.name}</h1>
          <p className='text-[13px] mt-0.5' style={{ color: 'var(--text2)' }}>{currentOrganization.description}</p>
          <div
            className='inline-block text-[11px] mt-2 px-2 py-0.5 rounded-[5px]'
            style={{ background: 'var(--surface2)', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}
          >
            KEY: {currentOrganization.uniqueKey}
          </div>
        </div>
        <div className='flex gap-6 text-center flex-shrink-0'>
          <div>
            <div className='text-[18px] font-medium' style={{ color: 'var(--text)' }}>{elections.length}</div>
            <div className='text-[10px]' style={{ color: 'var(--text3)' }}>Elections</div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

        {/* Recent elections */}
        <div className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='text-[13px] font-medium mb-4' style={{ color: 'var(--text)' }}>Recent elections</div>
          {elections.slice(0, 3).map((e, i) => (
            <div
              key={e.id}
              onClick={() => navigate(`/elections/${e.id}`)}
              className='flex items-center justify-between py-2.5 cursor-pointer hover:opacity-80'
              style={{ borderBottom: i < 2 ? '0.5px solid var(--border)' : 'none' }}
            >
              <span className='text-[13px]' style={{ color: 'var(--text)' }}>{e.name}</span>
              <span className='text-[11px]' style={{ color: 'var(--accent)' }}>View →</span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='text-[13px] font-medium mb-4' style={{ color: 'var(--text)' }}>Quick actions</div>
          <div className='flex flex-col gap-2'>
            {isOrgAdmin && (
              <button
                onClick={() => navigate('/admin/elections')}
                className='flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-[13px] border w-full text-left'
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                + Create new election
              </button>
            )}
            {isOrgAdmin && (
              <button
                onClick={() => navigate('/organization/members')}
                className='flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-[13px] border w-full text-left'
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Manage members
              </button>
            )}
            <button
              onClick={() => navigate('/elections')}
              className='flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-[13px] border w-full text-left'
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              View all elections
            </button>
            <button
              className='flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-[13px] border w-full text-left'
              style={{ borderColor: 'var(--border)', color: 'var(--danger)' }}
            >
              Leave organization
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationPage