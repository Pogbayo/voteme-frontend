import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCandidate } from '../../hooks/useCandidate'
import { useElectionCategory } from '../../hooks/useElectionCategory'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  displayName: z.string().optional(),
  bio: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const ManageCandidatesPage = () => {
  const { electionId, categoryId } = useParams<{ electionId: string; categoryId: string }>()
  const { candidates, getCategoryCandidates, createCandidate, deleteCandidate, isLoading, error, clearError } = useCandidate()
  const { category, getElectionCategory } = useElectionCategory()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (categoryId) {
      getCategoryCandidates(categoryId)
      getElectionCategory(categoryId)
    }
  }, [categoryId])

  const onSubmit = async (data: FormData) => {
    if (!categoryId) return
    try {
      await createCandidate({
        ...data,
        electionCategoryId: categoryId,
        photoFile: photoFile ?? undefined,
      })
      reset()
      setPhotoFile(null)
      setShowForm(false)
      clearError()
    } catch {
      // error is kept in store.error for display
    }
  }

  const colors = ['#7c3aed', '#0891b2', '#059669', '#e8571a', '#b45309', '#1d4ed8']

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between'>
        <div>
          <button
            onClick={() => navigate(`/admin/elections/${electionId}/categories`)}
            className='flex items-center gap-1.5 text-[13px] mb-1'
            style={{ color: 'var(--text2)' }}
          >
            <svg width='14' height='14' viewBox='0 0 16 16' fill='currentColor'><path d='M10 3L6 8l4 5'/></svg>
            Back to categories
          </button>
          <h1 className='text-[20px] font-medium' style={{ color: 'var(--text)' }}>Candidates</h1>
          <p className='text-[13px] mt-0.5' style={{ color: 'var(--text2)' }}>{category?.name}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className='px-4 py-2 rounded-[8px] text-[13px] font-medium text-white'
          style={{ background: 'var(--accent)' }}
        >
          {showForm ? 'Cancel' : '+ Add candidate'}
        </button>
      </div>

      {error && (
        <div className='rounded-[8px] p-3 border mb-3' style={{ background: 'rgba(220, 38, 38, 0.1)', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className='text-[14px] font-medium mb-4' style={{ color: 'var(--text)' }}>New candidate</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            <div className='grid grid-cols-2 gap-3'>
              <div className='flex flex-col gap-1'>
                <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>First name</label>
                <input
                  {...register('firstName')}
                  placeholder='John'
                  className='px-3 py-2 rounded-[8px] text-[13px] outline-none border'
                  style={{ background: 'var(--surface2)', borderColor: errors.firstName ? 'var(--danger)' : 'var(--border)', color: 'var(--text)' }}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>Last name</label>
                <input
                  {...register('lastName')}
                  placeholder='Adeyemi'
                  className='px-3 py-2 rounded-[8px] text-[13px] outline-none border'
                  style={{ background: 'var(--surface2)', borderColor: errors.lastName ? 'var(--danger)' : 'var(--border)', color: 'var(--text)' }}
                />
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>Display name (optional)</label>
              <input
                {...register('displayName')}
                placeholder='Johnny A.'
                className='px-3 py-2 rounded-[8px] text-[13px] outline-none border'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>Bio (optional)</label>
              <textarea
                {...register('bio')}
                placeholder='Brief candidate bio'
                rows={2}
                className='px-3 py-2 rounded-[8px] text-[13px] outline-none border resize-none'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>Photo (optional)</label>
              <input
                type='file'
                accept='image/*'
                onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
                className='text-[12px]'
                style={{ color: 'var(--text2)' }}
              />
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className='px-4 py-2 rounded-[8px] text-[13px] font-medium text-white w-fit disabled:opacity-50'
              style={{ background: 'var(--accent)' }}
            >
              {isLoading ? 'Adding...' : 'Add candidate'}
            </button>
          </form>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
        {candidates.map((c, i) => (
          <div key={c.id} className='rounded-[12px] p-4 border flex items-start gap-3' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            {c.photoUrl ? (
              <img src={c.photoUrl} alt='' className='w-[40px] h-[40px] rounded-full object-cover flex-shrink-0' />
            ) : (
              <div
                className='w-[40px] h-[40px] rounded-full flex items-center justify-center text-[13px] font-medium text-white flex-shrink-0'
                style={{ background: colors[i % colors.length] }}
              >
                {c.firstName[0]}{c.lastName[0]}
              </div>
            )}
            <div className='flex-1 min-w-0'>
              <div className='text-[13px] font-medium' style={{ color: 'var(--text)' }}>
                {c.displayName || `${c.firstName} ${c.lastName}`}
              </div>
              {c.bio && <div className='text-[11px] mt-0.5 line-clamp-2' style={{ color: 'var(--text3)' }}>{c.bio}</div>}
              <button
                onClick={() => deleteCandidate(c.id)}
                className='text-[11px] mt-2'
                style={{ color: 'var(--danger)' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {candidates.length === 0 && !isLoading && (
          <div className='col-span-3 text-center py-10'>
            <div className='text-[13px]' style={{ color: 'var(--text3)' }}>No candidates yet — add one above</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageCandidatesPage