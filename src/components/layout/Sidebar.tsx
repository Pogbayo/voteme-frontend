import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../stores/authStore'
import { useOrganization } from '../../hooks/useOrganization'
import { useThemeStore } from '../../stores/themeStore' // ✅ IMPORT

const Sidebar = () => {
  const { user, isOrgAdmin } = useAuth()
  const { logout } = useAuthStore()
  const { userOrganizations, currentOrganization, setCurrentOrganization, getUserOrganizations } = useOrganization()

  const { isDark, toggleDark } = useThemeStore() // ✅ USE ZUSTAND

  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getUserOrganizations()
  }, [])

  const switchOrg = (org: any) => {
    setCurrentOrganization(org)
    setShowOrgDropdown(false)
    navigate('/dashboard')
  }

  const navItem = (to: string, label: string, icon: React.ReactNode, dot?: string) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-2.5 py-[7px] rounded-[7px] text-[13px] cursor-pointer mb-[1px]
        ${isActive
          ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-text)]'
          : 'text-[var(--sidebar-muted)] hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-active)]'
        }`
      }
    >
      {icon}
      <span className='flex-1'>{label}</span>
      {dot && <div className='w-[5px] h-[5px] rounded-full flex-shrink-0' style={{ background: dot }} />}
    </NavLink>
  )

  return (
    <div className='w-[216px] flex-shrink-0 flex flex-col' style={{ background: 'var(--sidebar)' }}>
      <div className='p-4 flex-1'>

        {/* Logo */}
        <div className='flex items-center gap-2 mb-8'>
          <div className='w-[30px] h-[30px] rounded-[8px] flex items-center justify-center flex-shrink-0' style={{ background: 'var(--accent)' }}>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='white'>
              <path d='M8 1L2 5v6l6 4 6-4V5z'/>
            </svg>
          </div>
          <span className='text-[16px] font-medium' style={{ color: 'var(--sidebar-text)' }}>VoteMe</span>
        </div>

        {/* Org switcher */}
        <div className='relative mb-5'>
          <div
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className='rounded-[8px] p-2.5 flex items-center gap-2 cursor-pointer'
            style={{ background: 'var(--sidebar-active)' }}
          >
            <div className='w-2 h-2 rounded-full flex-shrink-0' style={{ background: 'var(--accent)' }} />
            <div className='flex-1 overflow-hidden'>
              <div className='text-[12px] font-medium truncate' style={{ color: 'var(--sidebar-text)' }}>
                {currentOrganization?.name ?? 'Select organization'}
              </div>
              <div className='text-[10px]' style={{ color: 'var(--sidebar-muted)' }}>
                {isOrgAdmin ? 'OrgAdmin' : 'Voter'}
              </div>
            </div>
            <svg width='12' height='12' viewBox='0 0 16 16' fill='var(--sidebar-muted)'>
              <path d='M4 6l4 4 4-4'/>
            </svg>
          </div>

          {/* Dropdown */}
          {showOrgDropdown && userOrganizations.length > 0 && (
            <div
              className='absolute left-0 right-0 top-full mt-1 rounded-[8px] overflow-hidden z-50 border'
              style={{ background: 'var(--sidebar-active)', borderColor: 'var(--border)' }}
            >
              {userOrganizations.map((org) => (
                <div
                  key={org.id}
                  onClick={() => switchOrg(org)}
                  className='px-3 py-2.5 cursor-pointer text-[12px] hover:opacity-80'
                  style={{
                    color: currentOrganization?.id === org.id ? 'var(--accent)' : 'var(--sidebar-text)',
                    borderBottom: '0.5px solid var(--border)'
                  }}
                >
                  {org.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nav */}
        {navItem('/dashboard', 'Dashboard', <svg width='15' height='15'><rect width='15' height='15'/></svg>)}
        {navItem('/elections', 'Elections', <svg width='15' height='15'><circle cx='7' cy='7' r='6'/></svg>, 'var(--accent)')}
        {navItem('/organization', 'Organization', <svg width='15' height='15'><rect width='15' height='10'/></svg>)}
        {navItem('/results', 'Results', <svg width='15' height='15'><path d='M2 12l4-4 3 3 5-6'/></svg>)}

        {/* Admin */}
        {isOrgAdmin && (
          <>
            <div className='text-[9px] uppercase tracking-[.1em] px-2.5 mb-1 mt-2' style={{ color: 'var(--sidebar-muted)' }}>
              Admin
            </div>
            {navItem('/admin/elections', 'Manage elections', <svg width='15' height='15'><path d='M8 1l2 5h5'/></svg>)}
            {navItem('/organization/members', 'Members', <svg width='15' height='15'><circle cx='8' cy='5' r='3'/></svg>, 'var(--warning)')}
          </>
        )}
      </div>

      {/* Bottom */}
      <div className='p-4 flex flex-col gap-2'>

        {/* ✅ THEME TOGGLE */}
        <div
          onClick={toggleDark}
          className='flex items-center gap-2 px-2.5 py-2 rounded-[7px] cursor-pointer text-[12px]'
          style={{ color: 'var(--sidebar-muted)' }}
        >
          {isDark
            ? <svg width='14' height='14'><circle cx='7' cy='7' r='4'/></svg>
            : <svg width='14' height='14'><path d='M8 2a6 6 0 100 12'/></svg>
          }
          {isDark ? 'Light mode' : 'Dark mode'}
        </div>

        {/* User */}
        <div
          className='flex items-center gap-2 p-2.5 rounded-[8px] cursor-pointer'
          style={{ background: 'var(--sidebar-active)' }}
          onClick={logout}
        >
          <div className='w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-medium text-white' style={{ background: 'var(--accent)' }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className='flex-1 overflow-hidden'>
            <div className='text-[12px] font-medium truncate' style={{ color: 'var(--sidebar-text)' }}>
              {user?.displayName || `${user?.firstName} ${user?.lastName}`}
            </div>
            <div className='text-[10px]' style={{ color: 'var(--sidebar-muted)' }}>
              Sign out
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Sidebar