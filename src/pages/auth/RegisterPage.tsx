import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useEffect } from 'react'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  displayName: z.string(), 
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  uniqueKey: z.string().min(1, 'Organization key is required'),
})

type FormData = z.infer<typeof schema>

const RegisterPage = () => {
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { clearError() }, [])

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data)
      navigate('/dashboard')
    } catch {}
  }

  const field = (
    label: string,
    name: keyof FormData,
    props?: React.InputHTMLAttributes<HTMLInputElement>,
    error?: string
  ) => (
    <div className='flex flex-col gap-1'>
      <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>{label}</label>
      <input
        {...register(name)}
        {...props}
        className='px-3 py-2 rounded-[8px] text-[13px] outline-none border transition-colors'
        style={{
          background: 'var(--surface2)',
          borderColor: error ? 'var(--danger)' : 'var(--border)',
          color: 'var(--text)',
        }}
      />
      {error && <span className='text-[11px]' style={{ color: 'var(--danger)' }}>{error}</span>}
    </div>
  )

  return (
    <div className='min-h-screen flex items-center justify-center p-4' style={{ background: 'var(--bg)' }}>
      <div className='w-full max-w-[400px]'>
        <div className='rounded-[16px] p-8 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

          {/* Logo */}
          <div className='flex items-center gap-2 mb-7'>
            <div className='w-[30px] h-[30px] rounded-[8px] flex items-center justify-center' style={{ background: 'var(--accent)' }}>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='white'><path d='M8 1L2 5v6l6 4 6-4V5z'/></svg>
            </div>
            <span className='text-[16px] font-medium' style={{ color: 'var(--text)' }}>VoteMe</span>
          </div>

          <h1 className='text-[20px] font-medium mb-1' style={{ color: 'var(--text)' }}>Create account</h1>
          <p className='text-[13px] mb-6' style={{ color: 'var(--text2)' }}>
            You'll need a UniqueKey from your organization admin
          </p>

          {error && (
            <div className='text-[12px] px-3 py-2.5 rounded-[8px] mb-4' style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            <div className='grid grid-cols-2 gap-3'>
              {field('First name', 'firstName', { placeholder: 'Ade' }, errors.firstName?.message)}
              {field('Last name', 'lastName', { placeholder: 'Bayo' }, errors.lastName?.message)}
            </div>
            {field('Display name (optional)', 'displayName', { placeholder: 'Spag' })}
            {field('Email address', 'email', { type: 'email', placeholder: 'you@example.com' }, errors.email?.message)}
            {field('Password', 'password', { type: 'password', placeholder: '••••••••' }, errors.password?.message)}

            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>Organization key</label>
              <input
                {...register('uniqueKey')}
                placeholder='e.g. UNILAG26'
                className='px-3 py-2 rounded-[8px] text-[13px] outline-none border transition-colors tracking-widest uppercase'
                style={{
                  background: 'var(--surface2)',
                  borderColor: errors.uniqueKey ? 'var(--danger)' : 'var(--border)',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              {errors.uniqueKey && <span className='text-[11px]' style={{ color: 'var(--danger)' }}>{errors.uniqueKey.message}</span>}
            </div>

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
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className='text-center text-[12px] mt-4' style={{ color: 'var(--text2)' }}>
            Already registered?{' '}
            <Link to='/login' style={{ color: 'var(--accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage