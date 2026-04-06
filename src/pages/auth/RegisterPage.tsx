import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
type Mode = 'join' | 'create'

const modeCopy: Record<Mode, { eyebrow: string; title: string; description: string }> = {
  join: {
    eyebrow: 'Join a workspace',
    title: 'Request access to an organization',
    description: 'Use your organization key and account details to send a join request for approval.',
  },
  create: {
    eyebrow: 'Create a workspace',
    title: 'Launch a new organization',
    description: 'Set up your organization and become the first owner managing approvals and elections.',
  },
}

const inputClassName =
  'w-full rounded-[18px] border px-4 py-3.5 text-[14px] outline-none transition'

const inputStyle = (borderColor: string) => ({
  background: 'var(--surface2)',
  borderColor,
  color: 'var(--text)',
  WebkitTextFillColor: 'var(--text)',
  caretColor: 'var(--text)',
})

const RegisterPage = () => {
  const {
    register: registerUser,
    isLoading: authLoading,
    error: authError,
    clearError: clearAuthError,
  } = useAuthStore()

  const {
    createOrganization,
    isLoading: orgLoading,
    error: orgError,
    clearError: clearOrgError,
  } = useOrganizationStore()

  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('join')

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const createOrgForm = useForm<CreateOrgData>({
    resolver: zodResolver(createOrgSchema),
    mode: 'onBlur',
  })

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode)
    clearAuthError()
    clearOrgError()
  }

  const onRegisterSubmit = async (data: RegisterData) => {
    clearAuthError()
    try {
      await registerUser(data)
      navigate('/dashboard')
    } catch {
      // store manages error state
    }
  }

  const onCreateOrgSubmit = async (data: CreateOrgData) => {
    clearOrgError()
    try {
      await createOrganization(data)
      navigate('/login')
    } catch {
      // store manages error state
    }
  }

  const activeCopy = modeCopy[mode]

  return (
    <div
      className='min-h-screen px-4 py-8 sm:px-6 lg:px-8'
      style={{ background: 'var(--bg)' }}
    >
      <div className='mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1240px] items-center justify-center'>
        <div
          className='grid w-full max-w-[1120px] gap-0 overflow-hidden rounded-[32px] border md:grid-cols-[0.88fr_1.12fr]'
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
                    Workspace access
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div
                  className='inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em]'
                  style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}
                >
                  {activeCopy.eyebrow}
                </div>
                <h1
                  className='max-w-[360px] text-[34px] font-semibold leading-[1.05] sm:text-[40px]'
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                >
                  {activeCopy.title}
                </h1>
                <p
                  className='max-w-[430px] text-[14px] leading-7 sm:text-[15px]'
                  style={{ color: 'var(--text2)' }}
                >
                  {activeCopy.description}
                </p>
              </div>
            </div>

            <div className='grid gap-3'>
              {[
                'Clean approval flow for new members',
                'One blue system across admin pages',
                'Responsive forms that stay readable',
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
            <div className='mx-auto max-w-[560px] space-y-6'>
              <div
                className='grid gap-2 rounded-[20px] border p-2 sm:grid-cols-2'
                style={{
                  background: 'var(--surface2)',
                  borderColor: 'var(--border)',
                }}
              >
                {(['join', 'create'] as Mode[]).map(tab => (
                  <button
                    key={tab}
                    type='button'
                    onClick={() => switchMode(tab)}
                    className='rounded-[16px] px-4 py-3 text-left transition'
                    style={{
                      background: mode === tab ? 'var(--accent)' : 'transparent',
                      color: mode === tab ? 'white' : 'var(--text2)',
                    }}
                  >
                    <div className='text-[14px] font-semibold'>
                      {tab === 'join' ? 'Join organization' : 'Create organization'}
                    </div>
                    <div
                      className='mt-1 text-[12px]'
                      style={{ color: mode === tab ? 'rgba(255,255,255,0.78)' : 'var(--text3)' }}
                    >
                      {tab === 'join'
                        ? 'Request access with an organization key'
                        : 'Set up a new workspace as owner'}
                    </div>
                  </button>
                ))}
              </div>

              <div
                className='rounded-[24px] border p-5 sm:p-6'
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className='mb-6 space-y-2'>
                  <h2
                    className='text-[26px] font-semibold'
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                  >
                    {mode === 'join' ? 'Member registration' : 'Organization setup'}
                  </h2>
                  <p className='text-[14px] leading-6' style={{ color: 'var(--text2)' }}>
                    {mode === 'join'
                      ? 'Your request will stay pending until an admin or owner approves it.'
                      : 'This account becomes the first owner and admin for the new organization.'}
                  </p>
                </div>

                {mode === 'join' ? (
                  <>
                    {authError && (
                      <div
                        className='mb-5 rounded-[18px] border px-4 py-3 text-[13px]'
                        style={{
                          background: 'var(--danger-bg)',
                          borderColor: 'rgba(220,38,38,0.18)',
                          color: 'var(--danger)',
                        }}
                      >
                        {authError}
                      </div>
                    )}

                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className='space-y-4'>
                      <div className='grid gap-4 sm:grid-cols-2'>
                        <label className='space-y-2'>
                          <span
                            className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                            style={{ color: 'var(--text3)' }}
                          >
                            First name
                          </span>
                          <input
                            {...registerForm.register('firstName')}
                            placeholder='John'
                            className={inputClassName}
                            style={{
                              ...inputStyle(registerForm.formState.errors.firstName ? 'var(--danger)' : 'var(--border)'),
                            }}
                          />
                          {registerForm.formState.errors.firstName && (
                            <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                              {registerForm.formState.errors.firstName.message}
                            </p>
                          )}
                        </label>

                        <label className='space-y-2'>
                          <span
                            className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                            style={{ color: 'var(--text3)' }}
                          >
                            Last name
                          </span>
                          <input
                            {...registerForm.register('lastName')}
                            placeholder='Doe'
                            className={inputClassName}
                            style={{
                              ...inputStyle(registerForm.formState.errors.lastName ? 'var(--danger)' : 'var(--border)'),
                            }}
                          />
                          {registerForm.formState.errors.lastName && (
                            <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                              {registerForm.formState.errors.lastName.message}
                            </p>
                          )}
                        </label>
                      </div>

                      <label className='space-y-2'>
                        <span
                          className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                          style={{ color: 'var(--text3)' }}
                        >
                          Display name
                        </span>
                        <input
                          {...registerForm.register('displayName')}
                          placeholder='How your organization should see you'
                          className={inputClassName}
                          style={{
                            ...inputStyle(registerForm.formState.errors.displayName ? 'var(--danger)' : 'var(--border)'),
                          }}
                        />
                        {registerForm.formState.errors.displayName && (
                          <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                            {registerForm.formState.errors.displayName.message}
                          </p>
                        )}
                      </label>

                      <div className='grid gap-4 sm:grid-cols-[1.15fr_0.85fr]'>
                        <label className='space-y-2'>
                          <span
                            className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                            style={{ color: 'var(--text3)' }}
                          >
                            Email address
                          </span>
                          <input
                            {...registerForm.register('email')}
                            type='email'
                            placeholder='you@example.com'
                            className={inputClassName}
                            style={{
                              ...inputStyle(registerForm.formState.errors.email ? 'var(--danger)' : 'var(--border)'),
                            }}
                          />
                          {registerForm.formState.errors.email && (
                            <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                              {registerForm.formState.errors.email.message}
                            </p>
                          )}
                        </label>

                        <label className='space-y-2'>
                          <span
                            className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                            style={{ color: 'var(--text3)' }}
                          >
                            Organization key
                          </span>
                          <input
                            {...registerForm.register('uniqueKey')}
                            placeholder='UNILAG26'
                            className={inputClassName}
                            style={{
                              ...inputStyle(registerForm.formState.errors.uniqueKey ? 'var(--danger)' : 'var(--border)'),
                              fontFamily: 'var(--font-mono)',
                              letterSpacing: '0.08em',
                            }}
                          />
                          {registerForm.formState.errors.uniqueKey && (
                            <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                              {registerForm.formState.errors.uniqueKey.message}
                            </p>
                          )}
                        </label>
                      </div>

                      <label className='space-y-2'>
                        <span
                          className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                          style={{ color: 'var(--text3)' }}
                        >
                          Password
                        </span>
                        <input
                          {...registerForm.register('password')}
                          type='password'
                          placeholder='Create a strong password'
                          className={inputClassName}
                          style={{
                            ...inputStyle(registerForm.formState.errors.password ? 'var(--danger)' : 'var(--border)'),
                          }}
                        />
                        {registerForm.formState.errors.password && (
                          <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </label>

                      <button
                        type='submit'
                        disabled={authLoading}
                        className='w-full rounded-[18px] px-5 py-3.5 text-[14px] font-semibold text-white disabled:opacity-60'
                        style={{ background: 'var(--accent)' }}
                      >
                        {authLoading ? 'Submitting request...' : 'Join organization'}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    {orgError && (
                      <div
                        className='mb-5 rounded-[18px] border px-4 py-3 text-[13px]'
                        style={{
                          background: 'var(--danger-bg)',
                          borderColor: 'rgba(220,38,38,0.18)',
                          color: 'var(--danger)',
                        }}
                      >
                        {orgError}
                      </div>
                    )}

                    <form onSubmit={createOrgForm.handleSubmit(onCreateOrgSubmit)} className='space-y-4'>
                      <label className='space-y-2'>
                        <span
                          className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                          style={{ color: 'var(--text3)' }}
                        >
                          Organization name
                        </span>
                        <input
                          {...createOrgForm.register('organizationName')}
                          placeholder='VoteMe Students Council'
                          className={inputClassName}
                          style={{
                            ...inputStyle(createOrgForm.formState.errors.organizationName ? 'var(--danger)' : 'var(--border)'),
                          }}
                        />
                        {createOrgForm.formState.errors.organizationName && (
                          <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                            {createOrgForm.formState.errors.organizationName.message}
                          </p>
                        )}
                      </label>

                      <div className='grid gap-4 sm:grid-cols-2'>
                        <label className='space-y-2'>
                          <span
                            className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                            style={{ color: 'var(--text3)' }}
                          >
                            First name
                          </span>
                          <input
                            {...createOrgForm.register('firstName')}
                            placeholder='John'
                            className={inputClassName}
                            style={{
                              ...inputStyle(createOrgForm.formState.errors.firstName ? 'var(--danger)' : 'var(--border)'),
                            }}
                          />
                          {createOrgForm.formState.errors.firstName && (
                            <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                              {createOrgForm.formState.errors.firstName.message}
                            </p>
                          )}
                        </label>

                        <label className='space-y-2'>
                          <span
                            className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                            style={{ color: 'var(--text3)' }}
                          >
                            Last name
                          </span>
                          <input
                            {...createOrgForm.register('lastName')}
                            placeholder='Doe'
                            className={inputClassName}
                            style={{
                              ...inputStyle(createOrgForm.formState.errors.lastName ? 'var(--danger)' : 'var(--border)'),
                            }}
                          />
                          {createOrgForm.formState.errors.lastName && (
                            <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                              {createOrgForm.formState.errors.lastName.message}
                            </p>
                          )}
                        </label>
                      </div>

                      <div className='grid gap-4 sm:grid-cols-2'>
                        <label className='space-y-2'>
                          <span
                            className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                            style={{ color: 'var(--text3)' }}
                          >
                            Display name
                          </span>
                          <input
                            {...createOrgForm.register('displayName')}
                            placeholder='How members should see you'
                            className={inputClassName}
                            style={{
                              ...inputStyle('var(--border)'),
                            }}
                          />
                        </label>

                        <label className='space-y-2'>
                          <span
                            className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                            style={{ color: 'var(--text3)' }}
                          >
                            Email address
                          </span>
                          <input
                            {...createOrgForm.register('email')}
                            type='email'
                            placeholder='admin@example.com'
                            className={inputClassName}
                            style={{
                              ...inputStyle(createOrgForm.formState.errors.email ? 'var(--danger)' : 'var(--border)'),
                            }}
                          />
                          {createOrgForm.formState.errors.email && (
                            <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                              {createOrgForm.formState.errors.email.message}
                            </p>
                          )}
                        </label>
                      </div>

                      <label className='space-y-2'>
                        <span
                          className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                          style={{ color: 'var(--text3)' }}
                        >
                          Password
                        </span>
                        <input
                          {...createOrgForm.register('password')}
                          type='password'
                          placeholder='Create an owner password'
                          className={inputClassName}
                          style={{
                            ...inputStyle(createOrgForm.formState.errors.password ? 'var(--danger)' : 'var(--border)'),
                          }}
                        />
                        {createOrgForm.formState.errors.password && (
                          <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                            {createOrgForm.formState.errors.password.message}
                          </p>
                        )}
                      </label>

                      <label className='space-y-2'>
                        <span
                          className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                          style={{ color: 'var(--text3)' }}
                        >
                          Organization description
                        </span>
                        <textarea
                          {...createOrgForm.register('description')}
                          placeholder='Tell members what this workspace is for'
                          rows={3}
                          className={`${inputClassName} resize-none`}
                          style={{
                            ...inputStyle('var(--border)'),
                          }}
                        />
                      </label>

                      <label className='space-y-2'>
                        <span
                          className='text-[12px] font-semibold uppercase tracking-[0.14em]'
                          style={{ color: 'var(--text3)' }}
                        >
                          Logo
                        </span>
                        <input
                          type='file'
                          accept='image/*'
                          onChange={event => {
                            const file = event.target.files?.[0]
                            if (file) {
                              createOrgForm.setValue('logoFile', file)
                            }
                          }}
                          className='block w-full text-[13px]'
                          style={{ color: 'var(--text2)' }}
                        />
                        {createOrgForm.formState.errors.logoFile && (
                          <p className='text-[12px]' style={{ color: 'var(--danger)' }}>
                            {createOrgForm.formState.errors.logoFile.message}
                          </p>
                        )}
                      </label>

                      <button
                        type='submit'
                        disabled={orgLoading}
                        className='w-full rounded-[18px] px-5 py-3.5 text-[14px] font-semibold text-white disabled:opacity-60'
                        style={{ background: 'var(--accent)' }}
                      >
                        {orgLoading ? 'Creating organization...' : 'Create organization'}
                      </button>
                    </form>
                  </>
                )}
              </div>

              <div
                className='rounded-[18px] border px-4 py-4 text-[13px]'
                style={{
                  background: 'var(--surface2)',
                  borderColor: 'var(--border)',
                  color: 'var(--text2)',
                }}
              >
                Already have an account?{' '}
                <Link to='/login' className='font-semibold' style={{ color: 'var(--accent)' }}>
                  Sign in
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
