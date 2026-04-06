import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../stores/authStore'
import { useOrganization } from '../../hooks/useOrganization'
import { useUIStore } from '../../stores/uiStore'
import { useThemeStore } from '../../stores/themeStore'
import { useElectionStore } from '../../stores/electionStore'
import { useOrganizationMemberStore } from '../../stores/organizationMemberStore'
import { useOrganizationMember } from '../../hooks/useOrganizationMember'


const Sidebar = () => {
  const { user } = useAuth()
  const{ memberShip} = useOrganizationMember()
  const { logout } = useAuthStore()
  const {
    userOrganizations,
    currentOrganization,
    setCurrentOrganization,
    getUserOrganizations
  } = useOrganization()
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useUIStore()
  const { isDark, toggleDark } = useThemeStore()
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getUserOrganizations().catch(() => {})
  }, [getUserOrganizations])

  const switchOrg = (org: any) => {
  if (!org || org.id === currentOrganization?.id) return;

  setShowOrgDropdown(false);
  setMobileOpen(false);

  // Clear previous data
  useElectionStore.getState().clearElections();
  useOrganizationMemberStore.getState().clearMembers();

  // Set new organization instantly
  setCurrentOrganization(org);

  // Navigate after a tiny delay to ensure state update
  setTimeout(() => {
    navigate('/dashboard');
  }, 20);
};
const allowedRoles = [1, 2];

  const navItem = (to: string, label: string, icon: React.ReactNode, dot?: string) => (
    <NavLink
      to={to}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-[7px] text-[13px] cursor-pointer mb-[1px] transition-all
        ${collapsed ? 'px-2 py-2 justify-center' : 'px-2.5 py-[7px]'}
        ${isActive
          ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-text)]'
          : 'text-[var(--sidebar-muted)] hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-active)]'
        }`
      }
      title={collapsed ? label : undefined}
    >
      <span className='flex-shrink-0'>{icon}</span>
      {!collapsed && <span className='flex-1'>{label}</span>}
      {!collapsed && dot && (
        <div className='w-[5px] h-[5px] rounded-full flex-shrink-0' style={{ background: dot }} />
      )}
    </NavLink>
  )

  const sidebarContent = (
    <div
      className='flex flex-col h-full overflow-hidden transition-all duration-200'
      style={{
        width: collapsed ? 64 : 236,
        background: 'var(--sidebar)',
        minHeight: '100vh',
      }}
    >
      <div className='flex-1 p-3 flex flex-col overflow-y-auto no-scrollbar'>

        {/* Logo + collapse toggle */}
        <div className={`flex items-center mb-7 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className='flex items-center gap-3 overflow-hidden'>
            <div
              className='w-[34px] h-[34px] rounded-[12px] flex items-center justify-center flex-shrink-0'
                style={{ background: 'var(--accent)' }}
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='white'>
                <path d='M8 1L2 5v6l6 4 6-4V5z'/>
              </svg>
            </div>
            {!collapsed && (
              <div className='min-w-0'>
                <div className='text-[15px] font-semibold truncate' style={{ color: 'var(--sidebar-text)', fontFamily: 'var(--font-display)' }}>
                  VoteMe
                </div>
                <div className='text-[10px] uppercase tracking-[0.16em]' style={{ color: 'var(--sidebar-muted)' }}>
                  workspace
                </div>
              </div>
            )}
          </div>
          <button
            onClick={toggleCollapsed}
            className='w-[22px] h-[22px] rounded-[5px] flex items-center justify-center flex-shrink-0 hover:opacity-70'
            style={{ color: 'var(--sidebar-muted)', background: 'var(--sidebar-active)' }}
          >
            <svg width='12' height='12' viewBox='0 0 16 16' fill='currentColor'>
              {collapsed
                ? <path d='M6 3l4 5-4 5'/>
                : <path d='M10 3L6 8l4 5'/>
              }
            </svg>
          </button>
        </div>

        {/* Org switcher */}
        {!collapsed && (
          <div className='relative mb-5'>
            <div
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className='rounded-[14px] p-3 flex items-center gap-2 cursor-pointer border'
              style={{ background: 'var(--sidebar-active)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className='w-2.5 h-2.5 rounded-full flex-shrink-0' style={{ background: 'var(--accent)' }} />
              <div className='flex-1 overflow-hidden'>
                <div className='text-[12px] font-medium truncate' style={{ color: 'var(--sidebar-text)' }}>
                  {currentOrganization?.name ?? 'Select organization'}
                </div>
                {currentOrganization && (
                  <div className='text-[10px]' style={{ color: 'var(--sidebar-muted)' }}>
                    {memberShip?.role === 0 ? 'Member' :
                      memberShip?.role === 1 ? 'Admin' :
                      memberShip?.role === 2 ? 'Owner' :
                      ''
                    }
                  </div>
                )}
              </div>
              <svg
                width='12' height='12' viewBox='0 0 16 16'
                fill='none' stroke='var(--sidebar-muted)' strokeWidth='2'
              >
                <path d='M4 6l4 4 4-4'/>
              </svg>
            </div>

            {showOrgDropdown && userOrganizations.length > 0 && (
              <div
                className='absolute left-0 right-0 top-full mt-1 rounded-[8px] overflow-hidden z-50 border'
                style={{ background: 'var(--sidebar-active)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                {userOrganizations.map((org) => (
                  <div
                    key={org.id}
                    onClick={() => switchOrg(org)}
                    className='px-3 py-2.5 cursor-pointer text-[12px] transition-colors'
                    style={{
                      background: currentOrganization?.id === org.id ? 'rgba(47,134,255,0.12)' : 'var(--sidebar-active)',
                      color: 'var(--sidebar-text)',
                      borderBottom: '0.5px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <p>{org.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
          <div
            onClick={() => {
              setMobileOpen(false)
              navigate('/organization/create-organization')}   
            }
              className={`rounded-[12px] text-[12px] cursor-pointer hover:opacity-90 border mb-2 flex items-center ${
                collapsed ? 'justify-center px-2 py-2.5' : 'gap-2 px-3 py-2.5'
              }`}
            style={{ color: 'var(--sidebar-text)', background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.08)' }}
            title={collapsed ? 'Create organization' : undefined}
          >
            <span className='text-[14px] leading-none'>+</span>
            {!collapsed && <span>Create Organization</span>}
          </div>
        {/* Nav items */}
        {navItem('/dashboard', 'Dashboard',
          <svg width='15' height='15' viewBox='0 0 16 16' fill='currentColor'>
            <rect x='1' y='1' width='6' height='6' rx='1'/>
            <rect x='9' y='1' width='6' height='6' rx='1'/>
            <rect x='1' y='9' width='6' height='6' rx='1'/>
            <rect x='9' y='9' width='6' height='6' rx='1'/>
          </svg>
        )}

        {navItem('/elections', 'Elections',
          <svg width='15' height='15' viewBox='0 0 16 16' fill='currentColor'>
            <path d='M8 1L2 5v6l6 4 6-4V5z'/>
          </svg>,
          'var(--accent)'
        )}

        {navItem(`/organization/${currentOrganization?.id}`, 'Organization',
          <svg width='15' height='15' viewBox='0 0 16 16' fill='currentColor'>
            <rect x='1' y='4' width='14' height='10' rx='1'/>
            <path d='M5 4V3a3 3 0 016 0v1'/>
          </svg>
        )}

        {/* Admin section */}
        {allowedRoles.includes(memberShip?.role ?? 0) &&(
          <>
            {!collapsed && (
              <div
                className='text-[9px] uppercase tracking-[.1em] px-2.5 mb-1 mt-3'
                style={{ color: 'var(--sidebar-muted)' }}
              >
                Admin
              </div>
            )}
            {collapsed && (
              <div className='my-2 border-t' style={{ borderColor: 'var(--sidebar-active)' }} />
            )}
            {navItem('/admin/elections', 'Manage elections',
              <svg width='15' height='15' viewBox='0 0 16 16' fill='currentColor'>
                <path d='M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z'/>
              </svg>
            )}
            {navItem('/organization/members', 'Members',
              <svg width='15' height='15' viewBox='0 0 16 16' fill='currentColor'>
                <circle cx='8' cy='5' r='3'/>
                <path d='M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6'/>
              </svg>,
              'var(--warning)'
            )}
          </>
        )}
      </div>

      {/* Bottom */}
      <div className='p-3 flex flex-col gap-2'>

        {/* Dark mode toggle */}
        <div
          onClick={toggleDark}
          className={`flex items-center gap-2 rounded-[7px] cursor-pointer text-[12px] hover:opacity-80 transition-opacity
            ${collapsed ? 'px-2 py-2 justify-center' : 'px-2.5 py-2'}`}
          style={{ color: 'var(--sidebar-muted)' }}
          title={collapsed ? (isDark ? 'Light mode' : 'Dark mode') : undefined}
        >
          {isDark
            ? (
              <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
                <circle cx='12' cy='12' r='5'/>
                <path d='M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'
                  stroke='currentColor' strokeWidth='2' fill='none'/>
              </svg>
            )
            : (
              <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z'/>
              </svg>
            )
          }
          {!collapsed && (isDark ? 'Light mode' : 'Dark mode')}
        </div>

        {/* User / Sign out */}
        <div
          onClick={logout}
          className={`flex items-center gap-2 rounded-[8px] cursor-pointer hover:opacity-80 transition-opacity
            ${collapsed ? 'p-2 justify-center' : 'p-2.5'}`}
          style={{ background: 'var(--sidebar-active)' }}
          title={collapsed ? 'Sign out' : undefined}
        >
          <div
            className='w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-medium text-white flex-shrink-0'
            style={{ background: 'var(--accent)' }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          {!collapsed && (
            <div className='flex-1 overflow-hidden'>
              <div className='text-[12px] font-medium truncate' style={{ color: 'var(--sidebar-text)' }}>
                {user?.displayName?.trim() || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
              </div>
              <div className='text-[10px]' style={{ color: 'var(--sidebar-muted)' }}>
                Sign out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <div className='hidden md:flex flex-shrink-0' style={{ transition: 'width 0.2s' }}>
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className='fixed inset-0 z-50 md:hidden'>
          <div
            className='absolute inset-0 bg-black/50'
            onClick={() => setMobileOpen(false)}
          />
          <div className='absolute left-0 top-0 bottom-0'>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
