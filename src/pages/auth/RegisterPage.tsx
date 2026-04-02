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
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const createOrgSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  adminFirstName: z.string().min(1, 'First name is required'),
  adminLastName: z.string().min(1, 'Last name is required'),
  adminDisplayName: z.string().optional(),
  adminEmail: z.string().email('Enter a valid email'),
  adminPhoneNumber: z.string().min(10, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  description: z.string().optional(),
})

type registerData = z.infer<typeof registerSchema>
type CreateOrgFormData = z.infer<typeof createOrgSchema>

const RegisterPage = () => {
  const { register: registerUser, isLoading, error } = useAuthStore()
  const {createOrganization} = useOrganizationStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'join' | 'create'>('join') // 'join' or 'create'
  const registerForm = useForm<registerData>({
    resolver: zodResolver(registerSchema),
  })
  const createOrgForm = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgSchema),
  })

  const onRegisterSubmit = async (data: registerData) => {
    try {
      await registerUser(data)
      navigate('/dashboard')
    } catch {}
  }

  const onCreateOrgSubmit = async (data: CreateOrgFormData) => {
    try {
      await createOrganization({
        organizationName: data.organizationName,
        description: data.description,
        adminFirstName: data.adminFirstName,
        adminLastName: data.adminLastName,
        adminDisplayName: data.adminDisplayName,
        adminEmail: data.adminEmail,
        adminPhoneNumber: data.adminPhoneNumber,
        password: data.password,
      })
      navigate('/dashboard')
    } catch {}
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4' style={{ background: 'var(--bg)' }}>
      <div className='w-full max-w-[420px]'>
        <div className='rounded-[16px] p-8 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='flex items-center gap-2 mb-8'>
            <div className='w-[30px] h-[30px] rounded-[8px] flex items-center justify-center' style={{ background: 'var(--accent)' }}>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='white'><path d='M8 1L2 5v6l6 4 6-4V5z'/></svg>
            </div>
            <span className='text-[16px] font-medium' style={{ color: 'var(--text)' }}>VoteMe</span>
          </div>
          <h1 className='text-[20px] font-medium mb-1' style={{ color: 'var(--text)' }}>Create Account</h1>
          <p className='text-[13px] mb-6' style={{ color: 'var(--text2)' }}>Join or create an organization</p>

          {/* Mode Tabs */}
          <div className='flex border-b mb-6' style={{ borderColor: 'var(--border)' }}>
            <button onClick={() => setMode('join')} className={`flex-1 pb-3 text-sm font-medium ${mode === 'join' ? 'border-b-2 border-[var(--accent)] text-[var(--text)]' : 'text-[var(--text2)]'}`} >
              Join Existing Org
            </button>
            <button onClick={() => setMode('create')} className={`flex-1 pb-3 text-sm font-medium ${mode === 'create' ? 'border-b-2 border-[var(--accent)] text-[var(--text)]' : 'text-[var(--text2)]'}`} >
              Create New Org
            </button>
          </div>

          {error && (
            <div className='text-[12px] px-3 py-2.5 rounded-[8px] mb-4' style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
              {error}
            </div>
          )}

          {/* JOIN EXISTING ORGANIZATION FORM */}
          {mode === 'join' && (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className='flex flex-col gap-4'>
              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Organization Key</label>
                <input {...registerForm.register('uniqueKey')} placeholder='e.g. UNILAG26' className='w-full px-3 py-2.5 rounded-[8px] text-sm' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
              </div>
              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Email</label>
                <input {...registerForm.register('email')} type='email' placeholder='you@example.com' className='w-full px-3 py-2.5 rounded-[8px] text-sm' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
              </div>
              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Password</label>
                <input {...registerForm.register('password')} type='password' placeholder='••••••••' className='w-full px-3 py-2.5 rounded-[8px] text-sm' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
              </div>
              <button type='submit' disabled={isLoading} className='w-full py-3 rounded-[8px] text-white font-medium' style={{ background: 'var(--accent)' }}>
                {isLoading ? 'Joining...' : 'Join Organization'}
              </button>
            </form>
          )}

          {/* CREATE NEW ORGANIZATION FORM */}
          {mode === 'create' && (
            <form onSubmit={createOrgForm.handleSubmit(onCreateOrgSubmit)} className='flex flex-col gap-4'>
              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Organization Name</label>
                <input {...createOrgForm.register('organizationName')} placeholder='My Awesome Company' className='w-full px-3 py-2.5 rounded-[8px] text-sm' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>First Name</label>
                  <input {...createOrgForm.register('adminFirstName')} placeholder='John' className='w-full px-3 py-2.5 rounded-[8px] text-sm' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Last Name</label>
                  <input {...createOrgForm.register('adminLastName')} placeholder='Doe' className='w-full px-3 py-2.5 rounded-[8px] text-sm' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
                </div>
              </div>
              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Email</label>
                <input {...createOrgForm.register('adminEmail')} type='email' placeholder='admin@company.com' className='w-full px-3 py-2.5 rounded-[8px] text-sm' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
              </div>
              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Phone Number</label>
                <input {...createOrgForm.register('adminPhoneNumber')} placeholder='+234 801 234 5678' className='w-full px-3 py-2.5 rounded-[8px] text-sm' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
              </div>
              <div>
                <label className='text-[12px] font-medium block mb-1' style={{ color: 'var(--text2)' }}>Password</label>
                <input {...createOrgForm.register('password')} type='password' placeholder='••••••••' className='w-full px-3 py-2.5 rounded-[8px] text-sm' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
              </div>
              <button type='submit' disabled={isLoading} className='w-full py-3 rounded-[8px] text-white font-medium' style={{ background: 'var(--accent)' }}>
                {isLoading ? 'Creating Organization...' : 'Create Organization'}
              </button>
            </form>
          )}

          <p className='text-center text-[12px] mt-6' style={{ color: 'var(--text2)' }}>
            Already have an account? <Link to='/login' style={{ color: 'var(--accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage