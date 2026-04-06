import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useAuth } from '../../hooks/useAuth'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

const inputClassName =
  'w-full rounded-[18px] border px-4 py-3.5 text-[14px] outline-none transition'

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
  }, [isAuthenticated, navigate])

  useEffect(() => {
    clearError()
  }, [clearError])

  const onSubmit = async (data: FormData) => {
    clearError()
    try {
      await login(data)
      navigate('/dashboard')
    } catch {}
  }

  return (
    <div
      className='min-h-screen px-4 py-8 sm:px-6 lg:px-8'
      style={{ background: 'var(--bg)' }}
    >
      <div className='mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1120px] items-center justify-center'>
        <div
          className='grid w-full max-w-[980px] gap-0 overflow-hidden rounded-[32px] border lg:grid-cols-[0.92fr_1.08fr]'
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            boxShadow: '0 24px 60px rgba(4, 18, 34, 0.18)',
          }}
        >
          <section
            className='flex flex-col justify-between gap-8 px-6 py-8 sm:px-8 sm:py-10'
            style={{ background: 'var(--surface2)', borderRight: '1px solid var(--border)' }}
          >
            <div className='space-y-8'>
              <div className='flex items-center gap-3'>
                <div
                  className='flex h-12 w-12 items-center justify-center rounded-[16px]'
                  style={{ background: 'var(--accent)' }}
                >
                  <svg width='20' height='20' viewBox='0 0 16 16' fill='white'>
                    <path d='M8 1L2 5v6l6 4 6-4V5z' />
                  </svg>
                </div>
                <div>
                  <div
                    className='text-[18px] font-semibold'
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                  >
                    VoteMe
                  </div>
                  <div
                    className='text-[11px] uppercase tracking-[0.18em]'
                    style={{ color: 'var(--text3)' }}
                  >
                    Election workspace
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div
                  className='inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em]'
                  style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}
                >
                  Sign in
                </div>
                <h1
                  className='max-w-[320px] text-[34px] font-semibold leading-[1.05] sm:text-[40px]'
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                >
                  Welcome back
                </h1>
                <p
                  className='max-w-[420px] text-[14px] leading-7 sm:text-[15px]'
                  style={{ color: 'var(--text2)' }}
                >
                  Access your organization dashboard, review approvals, and manage elections from one calm workspace.
                </p>
              </div>
            </div>

            <div className='grid gap-3'>
              {[
                'Review pending members and approvals',
                'Open and manage elections cleanly',
                'Track voting activity without clutter',
              ].map(item => (
                <div
                  key={item}
                  className='rounded-[18px] border px-4 py-3 text-[13px]'
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text2)',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className='px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12'>
            <div className='mx-auto max-w-[430px]'>
              <div className='mb-8 space-y-2'>
                <h2
                  className='text-[28px] font-semibold'
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                >
                  Sign in to continue
                </h2>
                <p className='text-[14px] leading-6' style={{ color: 'var(--text2)' }}>
                  Use the email and password connected to your organization account.
                </p>
              </div>

              {error && (
                <div
                  className='mb-5 rounded-[18px] border px-4 py-3 text-[13px]'
                  style={{
                    background: 'var(--danger-bg)',
                    borderColor: 'rgba(220,38,38,0.18)',
                    color: 'var(--danger)',
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <label className='block space-y-2'>
                  <span
                    className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                    style={{ color: 'var(--text3)' }}
                  >
                    Email address
                  </span>
                  <input
                    {...register('email')}
                    type='email'
                    placeholder='you@example.com'
                    className={inputClassName}
                    style={{
                      background: 'var(--surface2)',
                      borderColor: errors.email ? 'var(--danger)' : 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                  {errors.email && (
                    <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                      {errors.email.message}
                    </p>
                  )}
                </label>

                <label className='block space-y-2'>
                  <span
                    className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                    style={{ color: 'var(--text3)' }}
                  >
                    Password
                  </span>
                  <input
                    {...register('password')}
                    type='password'
                    placeholder='Enter your password'
                    className={inputClassName}
                    style={{
                      background: 'var(--surface2)',
                      borderColor: errors.password ? 'var(--danger)' : 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                  {errors.password && (
                    <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                      {errors.password.message}
                    </p>
                  )}
                </label>

                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full rounded-[18px] px-5 py-3.5 text-[14px] font-semibold text-white disabled:opacity-60'
                  style={{ background: 'var(--accent)' }}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <div
                className='mt-6 rounded-[18px] border px-4 py-4 text-[13px]'
                style={{
                  background: 'var(--surface2)',
                  borderColor: 'var(--border)',
                  color: 'var(--text2)',
                }}
              >
                No account yet?{' '}
                <Link to='/register' className='font-semibold' style={{ color: 'var(--accent)' }}>
                  Create one
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
