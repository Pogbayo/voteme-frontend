import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useUIStore } from '../../stores/uiStore'

const DashboardLayout = () => {
  const { setMobileOpen } = useUIStore()

  return (
    <div className='flex h-screen overflow-hidden' style={{ background: 'var(--bg)' }}>
      <Sidebar />

      <div className='flex flex-col flex-1 overflow-hidden'>

        {/* Mobile topbar */}
        <div
          className='flex md:hidden items-center justify-between px-4 h-[52px] flex-shrink-0 border-b'
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className='w-[34px] h-[34px] rounded-[8px] flex items-center justify-center'
            style={{ background: 'var(--surface2)', color: 'var(--text)' }}
          >
            <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
              <rect x='1' y='3' width='14' height='1.5' rx='0.75'/>
              <rect x='1' y='7' width='14' height='1.5' rx='0.75'/>
              <rect x='1' y='11' width='14' height='1.5' rx='0.75'/>
            </svg>
          </button>
          <div className='flex items-center gap-2'>
            <div
              className='w-[26px] h-[26px] rounded-[6px] flex items-center justify-center'
              style={{ background: 'var(--accent)' }}
            >
              <svg width='14' height='14' viewBox='0 0 16 16' fill='white'>
                <path d='M8 1L2 5v6l6 4 6-4V5z'/>
              </svg>
            </div>
            <span className='text-[15px] font-medium' style={{ color: 'var(--text)' }}>VoteMe</span>
          </div>
          <div className='w-[34px]' />
        </div>

        <main className='flex-1 overflow-y-auto no-scrollbar p-4 md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
