import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useElectionCategory } from '../../hooks/useElectionCategory'
import { useElection } from '../../hooks/useElection'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const ManageCategoriesPage = () => {
  const { electionId } = useParams<{ electionId: string }>()
  const { categories, getElectionCategories, createElectionCategory, deleteElectionCategory, loading } = useElectionCategory()
  const { currentElection, getElection } = useElection()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (electionId) {
      getElectionCategories(electionId)
      getElection(electionId)
    }
  }, [electionId])

  const onSubmit = async (data: FormData) => {
    if (!electionId) return
    try {
      await createElectionCategory({ ...data, electionId })
      reset()
      setShowForm(false)
    } catch {}
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between'>
        <div>
          <button onClick={() => navigate('/admin/elections')} className='flex items-center gap-1.5 text-[13px] mb-1' style={{ color: 'var(--text2)' }}>
            <svg width='14' height='14' viewBox='0 0 16 16' fill='currentColor'><path d='M10 3L6 8l4 5'/></svg>
            Back
          </button>
          <h1 className='text-[20px] font-medium' style={{ color: 'var(--text)' }}>Categories</h1>
          <p className='text-[13px] mt-0.5' style={{ color: 'var(--text2)' }}>{currentElection?.name}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className='px-4 py-2 rounded-[8px] text-[13px] font-medium text-white'
          style={{ background: 'var(--accent)' }}
        >
          {showForm ? 'Cancel' : '+ Add category'}
        </button>
      </div>

      {showForm && (
        <div className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className='text-[14px] font-medium mb-4' style={{ color: 'var(--text)' }}>New category</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>Category name</label>
              <input
                {...register('name')}
                placeholder='e.g. President'
                className='px-3 py-2 rounded-[8px] text-[13px] outline-none border'
                style={{ background: 'var(--surface2)', borderColor: errors.name ? 'var(--danger)' : 'var(--border)', color: 'var(--text)' }}
              />
              {errors.name && <span className='text-[11px]' style={{ color: 'var(--danger)' }}>{errors.name.message}</span>}
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>Description (optional)</label>
              <input
                {...register('description')}
                placeholder='Brief description'
                className='px-3 py-2 rounded-[8px] text-[13px] outline-none border'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='px-4 py-2 rounded-[8px] text-[13px] font-medium text-white w-fit disabled:opacity-50'
              style={{ background: 'var(--accent)' }}
            >
              {loading ? 'Creating...' : 'Create category'}
            </button>
          </form>
        </div>
      )}

      <div className='flex flex-col gap-3'>
        {categories.map(cat => (
          <div key={cat.id} className='rounded-[12px] p-4 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className='flex items-center justify-between mb-3'>
              <div>
                <div className='text-[13px] font-medium' style={{ color: 'var(--text)' }}>{cat.name}</div>
                {cat.description && <div className='text-[11px] mt-0.5' style={{ color: 'var(--text3)' }}>{cat.description}</div>}
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => navigate(`/admin/elections/${electionId}/categories/${cat.id}/candidates`)}
                  className='text-[11px] px-2.5 py-1.5 rounded-[6px] border'
                  style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                >
                  Candidates ({cat.candidates.length})
                </button>
                <button
                  onClick={() => deleteElectionCategory(cat.id)}
                  className='text-[11px] px-2.5 py-1.5 rounded-[6px] border'
                  style={{ borderColor: 'var(--border)', color: 'var(--danger)' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {categories.length === 0 && !loading && (
          <div className='text-center py-10'>
            <div className='text-[13px]' style={{ color: 'var(--text3)' }}>No categories yet — add one above</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageCategoriesPage