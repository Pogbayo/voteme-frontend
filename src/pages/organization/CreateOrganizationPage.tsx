import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useOrganizationStore } from '../../stores/organizationStore'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

const createOrgSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  description: z.string().optional(),
  adminFirstName: z.string().min(1, 'First name is required').optional(),
  adminLastName: z.string().min(1, 'Last name is required').optional(),
  adminDisplayName: z.string().optional(),
  adminEmail: z.string().email('Please enter a valid email'),
  adminPhoneNumber: z.string().min(10, 'Phone number is required').optional(),
  logoFile: z.instanceof(File).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
})

type CreateOrgFormData = z.infer<typeof createOrgSchema>

const CreateOrganizationPage = () => {
  const { createOrganization, isLoading } = useOrganizationStore()
  const navigate = useNavigate()
const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      adminEmail: user?.email || '',
    },
  })

  const onSubmit = async (data: CreateOrgFormData) => {
    try {
      await createOrganization(data)
      reset()
      navigate('/dashboard')
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to create organization')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-2 w-9 h-9 rounded-2xl flex items-center justify-center" 
               style={{ background: 'var(--accent)' }}>
            <span className="text-2xl text-white">+</span>
          </div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
            Create new Organization
          </h1>
          <p className="text-sm" style={{ color: 'var(--text2)' }}>
            You will be the Owner of this organization
          </p>
        </div>

        {/* Form Card */}
        <div 
          className="rounded-3xl p-8 border"
          style={{ 
            background: 'var(--surface)', 
            borderColor: 'var(--border)' 
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Organization Name */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text2)' }}>
                Organization Name
              </label>
              <input
                {...register('organizationName')}
                placeholder="e.g. Tech Innovators"
                className="w-full px-4 py-3 rounded-1xl text-sm focus:outline-none border transition-colors"
                style={{
                  background: 'var(--surface2)',
                  borderColor: errors.organizationName ? 'var(--danger)' : 'var(--border)',
                  color: 'var(--text)'
                }}
              />
              {errors.organizationName && (
                <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.organizationName.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text2)' }}>
                Description <span className="opacity-60">(optional)</span>
              </label>
              <textarea
                {...register('description')}
                placeholder="Brief description of your organization"
                rows={2}
                className="w-full px-4 py-3 rounded-1xl text-sm resize-y focus:outline-none border"
                style={{
                  background: 'var(--surface2)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
                }}
              />
            </div>

            {/* Name Fields */}
            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text2)' }}>First Name</label>
                <input
                  {...register('adminFirstName')}
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none border"
                  style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text2)' }}>Last Name</label>
                <input
                  {...register('adminLastName')}
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none border"
                  style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>
            </div> */}

            {/* Display Name */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text2)' }}>
                Display Name (optional)
              </label>
              <input
                {...register('adminDisplayName')}
                placeholder="John D."
                className="w-full px-4 py-3 rounded-1xl text-sm focus:outline-none border"
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>


            {/* Logo */}
            <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text2)' }}>
                Organization Logo
            </label>
            <input
                type="file"
                {...register('logoFile')}
                accept="image/*"
                className="w-full px-4 py-3 rounded-1xl text-sm focus:outline-none border"
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
            </div>

            {/* Email */}
            {/* <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text2)' }}>Email Address</label>
              <input
                {...register('adminEmail')}
                type="email"
                placeholder="admin@company.com"
                className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none border"
                style={{
                  background: 'var(--surface2)',
                  borderColor: errors.adminEmail ? 'var(--danger)' : 'var(--border)',
                  color: 'var(--text)'
                }}
              />
              {errors.adminEmail && (
                <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.adminEmail.message}</p>
              )}
            </div> */}

            {/* Phone */}
            {/* <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text2)' }}>Phone Number</label>
              <input
                {...register('adminPhoneNumber')}
                placeholder="+234 801 234 5678"
                className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none border"
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div> */}

            {/* Password */}
            {/* <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text2)' }}>Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none border"
                style={{
                  background: 'var(--surface2)',
                  borderColor: errors.password ? 'var(--danger)' : 'var(--border)',
                  color: 'var(--text)'
                }}
              />
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.password.message}</p>
              )}
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-1xl text-sm font-semibold text-white mt-4 transition-all disabled:opacity-70"
              style={{ background: 'var(--accent)' }}
            >
              {isLoading ? 'Creating Organization...' : 'Create Organization'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateOrganizationPage