import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../stores/authStore'

const Navbar = () => {
  const { user } = useAuth()
  const { logout } = useAuthStore()

  return (
    <div style={{ height: 52 }} className='bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6 flex-shrink-0'>
      <span className='text-[15px] font-medium text-[var(--text)]'>
        VoteMe
      </span>
      <div className='flex items-center gap-3'>
        <button
          onClick={logout}
          className='text-[12px] text-[var(--text2)] hover:text-[var(--text)] border border-[var(--border)] px-3 py-1.5 rounded-lg'
        >
          Sign out
        </button>
        <div className='w-[30px] h-[30px] rounded-full bg-[var(--accent)] flex items-center justify-center text-[11px] font-medium text-white'>
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
      </div>
    </div>
  )
}

export default Navbar