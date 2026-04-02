import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useOrganizationStore } from '../../stores/organizationStore'

const createOrgSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  description: z.string().optional(),
  adminFirstName: z.string().min(1, 'First name is required'),
  adminLastName: z.string().min(1, 'Last name is required'),
  adminDisplayName: z.string().optional(),
  adminEmail: z.string().email('Please enter a valid email'),
  adminPhoneNumber: z.string().min(10, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type CreateOrgFormData = z.infer<typeof createOrgSchema>

interface CreateOrganizationModalProps {
  onClose: () => void
}

const CreateOrganizationModal = ({ onClose }: CreateOrganizationModalProps) => {
  const { createOrganization, isLoading } = useOrganizationStore()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgSchema),
  })

  const onSubmit = async (data: CreateOrgFormData) => {
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

      reset()
      onClose()
      // Optional: show success toast
      alert("Organization created successfully!")
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.message || "Failed to create organization")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[var(--surface)] rounded-[16px] w-full max-w-[460px] mx-4 overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
        
        {/* Header */}
        <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-[18px] font-medium" style={{ color: 'var(--text)' }}>Create New Organization</h2>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text2)' }}>
            You'll become the Owner of this organization
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
          
          <div>
            <label className="text-[12px] font-medium block mb-1" style={{ color: 'var(--text2)' }}>Organization Name</label>
            <input
              {...register('organizationName')}
              placeholder="e.g. Tech Innovators Hub"
              className="w-full px-4 py-3 rounded-[10px] text-[14px]"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
            />
            {errors.organizationName && <p className="text-red-500 text-xs mt-1">{errors.organizationName.message}</p>}
          </div>

          <div>
            <label className="text-[12px] font-medium block mb-1" style={{ color: 'var(--text2)' }}>Description (optional)</label>
            <textarea
              {...register('description')}
              placeholder="Brief description about your organization"
              rows={2}
              className="w-full px-4 py-3 rounded-[10px] text-[14px] resize-y"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium block mb-1" style={{ color: 'var(--text2)' }}>First Name</label>
              <input {...register('adminFirstName')} placeholder="John" className="w-full px-4 py-3 rounded-[10px] text-[14px]" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
            </div>
            <div>
              <label className="text-[12px] font-medium block mb-1" style={{ color: 'var(--text2)' }}>Last Name</label>
              <input {...register('adminLastName')} placeholder="Doe" className="w-full px-4 py-3 rounded-[10px] text-[14px]" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium block mb-1" style={{ color: 'var(--text2)' }}>Display Name (optional)</label>
            <input {...register('adminDisplayName')} placeholder="John D." className="w-full px-4 py-3 rounded-[10px] text-[14px]" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
          </div>

          <div>
            <label className="text-[12px] font-medium block mb-1" style={{ color: 'var(--text2)' }}>Email Address</label>
            <input {...register('adminEmail')} type="email" placeholder="admin@company.com" className="w-full px-4 py-3 rounded-[10px] text-[14px]" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
          </div>

          <div>
            <label className="text-[12px] font-medium block mb-1" style={{ color: 'var(--text2)' }}>Phone Number</label>
            <input {...register('adminPhoneNumber')} placeholder="+234 801 234 5678" className="w-full px-4 py-3 rounded-[10px] text-[14px]" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
          </div>

          <div>
            <label className="text-[12px] font-medium block mb-1" style={{ color: 'var(--text2)' }}>Password</label>
            <input {...register('password')} type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-[10px] text-[14px]" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }} />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-[10px] text-[13px] font-medium border"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-[10px] text-[13px] font-medium text-white disabled:opacity-60"
              style={{ background: 'var(--accent)' }}
            >
              {isLoading ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateOrganizationModal