import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useAuth } from '../../hooks/useAuth'
import { useEffect } from 'react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuthStore()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated])

  useEffect(() => {
    clearError()
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      await login(data)
      navigate('/dashboard')
    } catch {
      // error handled in store
    }
  }

  return (
    <div
      className='min-h-screen flex items-center justify-center p-4'
      style={{ background: 'var(--bg)' }}
    >
      <div className='w-full max-w-[360px]'>

        {/* Card */}
        <div
          className='rounded-[16px] p-8 border'
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          {/* Logo */}
          <div className='flex items-center gap-2 mb-7'>
            <div
              className='w-[30px] h-[30px] rounded-[8px] flex items-center justify-center'
              style={{ background: 'var(--accent)' }}
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='white'>
                <path d='M8 1L2 5v6l6 4 6-4V5z'/>
              </svg>
            </div>
            <span className='text-[16px] font-medium' style={{ color: 'var(--text)' }}>
              VoteMe
            </span>
          </div>

          <h1 className='text-[20px] font-medium mb-1' style={{ color: 'var(--text)' }}>
            Welcome back
          </h1>
          <p className='text-[13px] mb-6' style={{ color: 'var(--text2)' }}>
            Sign in to your account to continue
          </p>

          {/* Error */}
          {error && (
            <div
              className='text-[12px] px-3 py-2.5 rounded-[8px] mb-4'
              style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            {/* Email */}
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>
                Email address
              </label>
              <input
                {...register('email')}
                type='email'
                placeholder='you@example.com'
                className='px-3 py-2 rounded-[8px] text-[13px] outline-none border transition-colors'
                style={{
                  background: 'var(--surface2)',
                  borderColor: errors.email ? 'var(--danger)' : 'var(--border)',
                  color: 'var(--text)',
                }}
              />
              {errors.email && (
                <span className='text-[11px]' style={{ color: 'var(--danger)' }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>
                Password
              </label>
              <input
                {...register('password')}
                type='password'
                placeholder='••••••••'
                className='px-3 py-2 rounded-[8px] text-[13px] outline-none border transition-colors'
                style={{
                  background: 'var(--surface2)',
                  borderColor: errors.password ? 'var(--danger)' : 'var(--border)',
                  color: 'var(--text)',
                }}
              />
              {errors.password && (
                <span className='text-[11px]' style={{ color: 'var(--danger)' }}>
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full py-2.5 rounded-[8px] text-[13px] font-medium text-white mt-1 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2'
              style={{ background: 'var(--accent)' }}
            >
              {isLoading && (
                <svg className='animate-spin w-4 h-4' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
                </svg>
              )}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className='text-center text-[12px] mt-4' style={{ color: 'var(--text2)' }}>
            No account?{' '}
            <Link to='/register' style={{ color: 'var(--accent)' }}>
              Register with a key
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage