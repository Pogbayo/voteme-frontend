import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../stores/authStore'
import { useOrganizationStore } from '../../stores/organizationStore'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  uniqueKey: z.string().min(1, 'Organization key is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  email: z.string().email('Enter a valid email'),
 
})

const createOrgSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  displayName: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  logoFile: z
    .instanceof(File)
    .refine(file => file.size <= 5_000_000, 'File must be smaller than 5MB')
    .optional(),
})

type RegisterData = z.infer<typeof registerSchema>
type CreateOrgData = z.infer<typeof createOrgSchema>

const RegisterPage = () => {
  const {
    register: registerUser,
    isLoading: authLoading,
    error: authError,       // ← from authStore
    clearError: clearAuthError,
  } = useAuthStore()

  const {
    createOrganization,
    isLoading: orgLoading,
    error: orgError,        // ← from organizationStore
    clearError: clearOrgError,
  } = useOrganizationStore()

  const navigate = useNavigate()
  const [mode, setMode] = useState<'join' | 'create'>('join')

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const createOrgForm = useForm<CreateOrgData>({
    resolver: zodResolver(createOrgSchema),
    mode: 'onBlur',
  })

  const switchMode = (m: 'join' | 'create') => {
    setMode(m)
    clearAuthError()
    clearOrgError()
  }

  const onRegisterSubmit = async (data: RegisterData) => {
    clearAuthError()
    console.log('Registering user with data:', data)
    try {
      await registerUser(data)
      navigate('/dashboard')
    } catch {
      // error already set in authStore — shown below
    }
  }

  const onCreateOrgSubmit = async (data: CreateOrgData) => {
    clearOrgError()
    try {
      await createOrganization(data)
      navigate('/login')
    } catch {
      // error already set in organizationStore — shown below
    }
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-[8px] text-sm outline-none border'
  const inputStyle = { background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }

  return (
    <div className='min-h-screen flex items-center justify-center p-4' style={{ background: 'var(--bg)' }}>
      <div className='w-full max-w-[700px]'>
        <div className='rounded-[16px] p-8 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

          {/* Logo */}
          <div className='flex items-center gap-2 mb-8'>
            <div className='w-[30px] h-[30px] rounded-[8px] flex items-center justify-center' style={{ background: 'var(--accent)' }}>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='white'>
                <path d='M8 1L2 5v6l6 4 6-4V5z'/>
              </svg>
            </div>
            <span className='text-[16px] font-medium' style={{ color: 'var(--text)' }}>VoteMe</span>
          </div>

          <h1 className='text-[20px] font-medium mb-1' style={{ color: 'var(--text)' }}>Create Account</h1>
          <p className='text-[13px] mb-6' style={{ color: 'var(--text2)' }}>Join or create an organization</p>

          {/* Tabs */}
          <div className='flex border-b mb-6' style={{ borderColor: 'var(--border)' }}>
            <div className='flex-1 flex flex-col items-center'>
              <button
                onClick={() => switchMode('join')}
                className={`pb-1 text-sm font-medium ${
                  mode === 'join'
                    ? 'border-b-2 border-[var(--accent)] text-[var(--text)]'
                    : 'text-[var(--text2)]'
                }`}
              >
                Join Organization
              </button>
              <span className='text-[11px] mt-1' style={{ color: 'var(--text2)' }}>as a new user</span>
            </div>
            <div className='flex-1 text-center'>
              <button
                onClick={() => switchMode('create')}
                className={`pb-3 text-sm font-medium ${
                  mode === 'create'
                    ? 'border-b-2 border-[var(--accent)] text-[var(--text)]'
                    : 'text-[var(--text2)]'
                }`}
              >
                Create Organization
              </button>
            </div>
          </div>

          {/* ─── JOIN FORM ─── */}
          {mode === 'join' && (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className='flex flex-col gap-4'>

              {/* ✅ Auth API error — shown above form */}
              {authError && (
                <div
                  className='text-[12px] px-3 py-2.5 rounded-[8px] flex items-center justify-between'
                  style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}
                >
                  {authError}
                  <button type='button' onClick={clearAuthError} className='text-[11px] underline ml-3'>
                    Dismiss
                  </button>
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div>
                  <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>First name</label>
                  <input {...registerForm.register('firstName')} placeholder='John' className={inputClass} style={inputStyle} />
                  {registerForm.formState.errors.firstName && (
                    <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{registerForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Last name</label>
                  <input {...registerForm.register('lastName')} placeholder='Doe' className={inputClass} style={inputStyle} />
                  {registerForm.formState.errors.lastName && (
                    <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{registerForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div>
                  <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Display name</label>
                  <input {...registerForm.register('displayName')} placeholder='This name is org-specific' className={inputClass} style={inputStyle} />
                  {registerForm.formState.errors.displayName && (
                    <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{registerForm.formState.errors.displayName.message}</p>
                  )}
                </div>
                <div>
                  <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Organization key</label>
                  <input
                    {...registerForm.register('uniqueKey')}
                    placeholder='e.g. UNILAG26'
                    className={inputClass}
                    style={{ ...inputStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
                  />
                  {registerForm.formState.errors.uniqueKey && (
                    <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{registerForm.formState.errors.uniqueKey.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Email</label>
                <input {...registerForm.register('email')} type='email' placeholder='you@example.com' className={inputClass} style={inputStyle} />
                {registerForm.formState.errors.email && (
                  <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Password</label>
                <input {...registerForm.register('password')} type='password' placeholder='••••••••' className={inputClass} style={inputStyle} />
                {registerForm.formState.errors.password && (
                  <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type='submit'
                disabled={authLoading}
                className='w-full py-3 rounded-[8px] text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2'
                style={{ background: 'var(--accent)' }}
              >
                {authLoading && (
                  <svg className='animate-spin w-4 h-4' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
                  </svg>
                )}
                {authLoading ? 'Joining...' : 'Join Organization'}
              </button>
            </form>
          )}

          {/* ─── CREATE ORG FORM ─── */}
          {mode === 'create' && (
            <form onSubmit={createOrgForm.handleSubmit(onCreateOrgSubmit)} className='flex flex-col gap-4'>

              {/* ✅ Org API error — shown above form */}
              {orgError && (
                <div
                  className='text-[12px] px-3 py-2.5 rounded-[8px] flex items-center justify-between'
                  style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}
                >
                  {orgError}
                  <button type='button' onClick={clearOrgError} className='text-[11px] underline ml-3'>
                    Dismiss
                  </button>
                </div>
              )}

              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Organization name</label>
                <input {...createOrgForm.register('organizationName')} placeholder='My Awesome Company' className={inputClass} style={inputStyle} />
                {createOrgForm.formState.errors.organizationName && (
                  <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{createOrgForm.formState.errors.organizationName.message}</p>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div>
                  <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>First name</label>
                  <input {...createOrgForm.register('firstName')} placeholder='John' className={inputClass} style={inputStyle} />
                  {createOrgForm.formState.errors.firstName && (
                    <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{createOrgForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Last name</label>
                  <input {...createOrgForm.register('lastName')} placeholder='Doe' className={inputClass} style={inputStyle} />
                  {createOrgForm.formState.errors.lastName && (
                    <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{createOrgForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div>
                  <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Display name</label>
                  <input {...createOrgForm.register('displayName')} placeholder='Johnny' className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Email</label>
                  <input {...createOrgForm.register('email')} type='email' placeholder='admin@company.com' className={inputClass} style={inputStyle} />
                  {createOrgForm.formState.errors.email && (
                    <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{createOrgForm.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Password</label>
                <input {...createOrgForm.register('password')} type='password' placeholder='••••••••' className={inputClass} style={inputStyle} />
                {createOrgForm.formState.errors.password && (
                  <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{createOrgForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Description (optional)</label>
                <textarea
                  {...createOrgForm.register('description')}
                  placeholder='About your organization'
                  rows={2}
                  className={inputClass + ' resize-none'}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Logo (optional)</label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) createOrgForm.setValue('logoFile', file)
                  }}
                  className='text-[12px]'
                  style={{ color: 'var(--text2)' }}
                />
                {createOrgForm.formState.errors.logoFile && (
                  <p className='text-[11px] mt-1' style={{ color: 'var(--danger)' }}>{createOrgForm.formState.errors.logoFile.message}</p>
                )}
              </div>

              <button
                type='submit'
                disabled={orgLoading}
                className='w-full py-3 rounded-[8px] text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2'
                style={{ background: 'var(--accent)' }}
              >
                {orgLoading && (
                  <svg className='animate-spin w-4 h-4' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
                  </svg>
                )}
                {orgLoading ? 'Creating...' : 'Create Organization'}
              </button>
            </form>
          )}

          <p className='text-center text-[12px] mt-6' style={{ color: 'var(--text2)' }}>
            Already have an account?{' '}
            <Link to='/login' style={{ color: 'var(--accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage