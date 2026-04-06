import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useOrganizationStore } from '../../stores/organizationStore'
import { useAuthStore } from '../../stores/authStore'

const createOrgSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  description: z.string().optional(),
  displayName: z.string().optional(),
  email: z.string().email('Please enter a valid email'),
  logoFile: z.instanceof(File).optional(),
})

type CreateOrgFormData = z.infer<typeof createOrgSchema>

const inputClassName =
  'w-full rounded-[18px] border px-4 py-3.5 text-[14px] outline-none transition'

const CreateOrganizationPage = () => {
  const { createOrganization, isLoading, error, clearError } = useOrganizationStore()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      displayName: user?.displayName || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
      email: user?.email || '',
    },
  })

  useEffect(() => {
    reset({
      displayName: user?.displayName || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
      email: user?.email || '',
      organizationName: '',
      description: '',
    })
  }, [reset, user?.displayName, user?.email, user?.firstName, user?.lastName])

  useEffect(() => {
    clearError()
  }, [clearError])

  const fieldStyle = (borderColor: string) => ({
    background: 'var(--surface2)',
    borderColor,
    color: 'var(--text)',
    WebkitTextFillColor: 'var(--text)',
    caretColor: 'var(--text)',
  })

  const onSubmit = async (data: CreateOrgFormData) => {
    clearError()
    try {
      await createOrganization({
        ...data,
        firstName: user?.firstName,
        lastName: user?.lastName,
        displayName:
          data.displayName?.trim() || user?.displayName || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
        email: data.email.trim(),
      })
      navigate('/dashboard')
    } catch {
      // store manages error state
    }
  }

  return (
    <div className='min-h-screen px-4 py-8 sm:px-6 lg:px-8' style={{ background: 'var(--bg)' }}>
      <div className='mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1180px] items-center justify-center'>
        <div
          className='grid w-full max-w-[1080px] overflow-hidden rounded-[32px] border md:grid-cols-[0.9fr_1.1fr]'
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
                  <div className='text-[18px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    VoteMe
                  </div>
                  <div className='text-[11px] uppercase tracking-[0.18em]' style={{ color: 'var(--text3)' }}>
                    Create workspace
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div
                  className='inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em]'
                  style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}
                >
                  Existing user
                </div>
                <h1
                  className='max-w-[360px] text-[34px] font-semibold leading-[1.05] sm:text-[40px]'
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                >
                  Create another organization
                </h1>
                <p className='max-w-[430px] text-[14px] leading-7 sm:text-[15px]' style={{ color: 'var(--text2)' }}>
                  Use your current account details and set up a fresh workspace without leaving the dashboard flow.
                </p>
              </div>
            </div>

            <div className='grid gap-3'>
              {[
                'Your current account stays connected',
                'The new workspace is added to your organization switcher',
                'You become the first owner for that workspace',
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
            <div className='mx-auto max-w-[560px]'>
              <div className='mb-8 space-y-2'>
                <h2 className='text-[28px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  Organization details
                </h2>
                <p className='text-[14px] leading-6' style={{ color: 'var(--text2)' }}>
                  Fill the workspace details below. If something blocks submission, you will see the message here instead of a silent failure.
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
                  <span className='text-[12px] font-semibold uppercase tracking-[0.14em]' style={{ color: 'var(--text3)' }}>
                    Organization name
                  </span>
                  <input
                    {...register('organizationName')}
                    placeholder='VoteMe Students Council'
                    className={inputClassName}
                    style={fieldStyle(errors.organizationName ? 'var(--danger)' : 'var(--border)')}
                  />
                  {errors.organizationName && <p className='text-[12px]' style={{ color: 'var(--danger)' }}>{errors.organizationName.message}</p>}
                </label>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <label className='space-y-2'>
                    <span className='text-[12px] font-semibold uppercase tracking-[0.14em]' style={{ color: 'var(--text3)' }}>
                      Display name
                    </span>
                    <input
                      {...register('displayName')}
                      placeholder='How members should see you'
                      className={inputClassName}
                      style={fieldStyle('var(--border)')}
                    />
                  </label>

                  <label className='space-y-2'>
                    <span className='text-[12px] font-semibold uppercase tracking-[0.14em]' style={{ color: 'var(--text3)' }}>
                      Email address
                    </span>
                    <input
                      {...register('email')}
                      type='email'
                      placeholder='admin@example.com'
                      className={inputClassName}
                      style={fieldStyle(errors.email ? 'var(--danger)' : 'var(--border)')}
                    />
                    {errors.email && <p className='text-[12px]' style={{ color: 'var(--danger)' }}>{errors.email.message}</p>}
                  </label>
                </div>

                <label className='block space-y-2'>
                  <span className='text-[12px] font-semibold uppercase tracking-[0.14em]' style={{ color: 'var(--text3)' }}>
                    Organization description
                  </span>
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder='Tell members what this workspace is for'
                    className={`${inputClassName} resize-none`}
                    style={fieldStyle('var(--border)')}
                  />
                </label>

                <label className='block space-y-2'>
                  <span className='text-[12px] font-semibold uppercase tracking-[0.14em]' style={{ color: 'var(--text3)' }}>
                    Organization logo
                  </span>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        setValue('logoFile', file)
                      }
                    }}
                    className='block w-full text-[13px]'
                    style={{ color: 'var(--text2)' }}
                  />
                  {errors.logoFile && <p className='text-[12px]' style={{ color: 'var(--danger)' }}>{errors.logoFile.message}</p>}
                </label>

                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full rounded-[18px] px-5 py-3.5 text-[14px] font-semibold text-white disabled:opacity-60'
                  style={{ background: 'var(--accent)' }}
                >
                  {isLoading ? 'Creating organization...' : 'Create organization'}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default CreateOrganizationPage
