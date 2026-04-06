import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useElection } from '../../hooks/useElection'
import { useElectionCategory } from '../../hooks/useElectionCategory'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const inputClass = 'w-full rounded-[16px] border px-4 py-3 text-[14px] outline-none transition'

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
      getElectionCategories(electionId).catch(() => {})
      getElection(electionId).catch(() => {})
    }
  }, [electionId, getElectionCategories, getElection])

  const onSubmit = async (data: FormData) => {
    if (!electionId) return
    try {
      await createElectionCategory({ ...data, electionId })
      reset()
      setShowForm(false)
    } catch {
      // store handles error state
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <button
          type='button'
          onClick={() => navigate('/admin/elections')}
          className='inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium'
          style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text2)' }}
        >
          <svg width='14' height='14' viewBox='0 0 16 16' fill='currentColor'>
            <path d='M10 3L6 8l4 5' />
          </svg>
          Back to elections
        </button>

        <button
          type='button'
          onClick={() => setShowForm(current => !current)}
          className='rounded-[18px] px-4 py-3 text-[13px] font-semibold text-white'
          style={{ background: 'var(--accent)', boxShadow: '0 16px 32px rgba(47,134,255,0.18)' }}
        >
          {showForm ? 'Close form' : 'Add category'}
        </button>
      </div>

      <section
        className='overflow-hidden rounded-[32px] border p-6 shadow-[0_28px_80px_rgba(16,42,67,0.1)] sm:p-8'
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className='grid gap-8 xl:grid-cols-[1.08fr_0.92fr]'>
          <div className='space-y-5'>
            <div className='inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em]' style={{ borderColor: 'var(--border)', background: 'var(--surface2)', color: 'var(--accent)' }}>
              Election categories
            </div>
            <div>
              <h1 className='text-[30px] font-semibold leading-[1.05] sm:text-[38px]' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                Structure the ballot
              </h1>
              <p className='mt-3 max-w-[700px] text-[15px] leading-7' style={{ color: 'var(--text2)' }}>
                Build the category layout for <span className='font-semibold' style={{ color: 'var(--text)' }}>{currentElection?.name ?? 'this election'}</span> so candidates can be grouped clearly.
              </p>
            </div>
            <div className='grid gap-3 sm:grid-cols-3'>
              {[
                ['Election', currentElection?.name ?? 'Loading'],
                ['Categories', `${categories.length}`],
                ['Action', showForm ? 'Form open' : 'Review mode'],
              ].map(([label, value]) => (
                <div key={label} className='rounded-[20px] border px-4 py-4' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                  <div className='text-[11px] uppercase tracking-[0.16em]' style={{ color: 'var(--text3)' }}>{label}</div>
                  <div className='mt-2 text-[15px] font-semibold' style={{ color: 'var(--text)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-[26px] border p-5' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
            <div className='mb-4 text-[13px] font-semibold uppercase tracking-[0.14em]' style={{ color: 'var(--text3)' }}>Ballot guidance</div>
            <div className='space-y-3'>
              {[
                'Each category represents one contest on the ballot.',
                'Descriptions help voters understand the purpose of each role.',
                'After categories are ready, move on to candidate management.',
              ].map(item => (
                <div key={item} className='rounded-[18px] px-4 py-3 text-[13px] leading-6' style={{ background: 'var(--surface)', color: 'var(--text2)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='grid gap-6 xl:grid-cols-[0.94fr_1.06fr]'>
        {showForm && (
          <div className='rounded-[28px] border p-5 sm:p-6 shadow-[0_22px_60px_rgba(16,42,67,0.08)]' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className='text-[22px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Create category</h2>
            <p className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
              Add the role or contest name voters will see on the election ballot.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className='mt-5 space-y-4'>
              <label className='space-y-2'>
                <span className='text-[12px] font-semibold uppercase tracking-[0.12em]' style={{ color: 'var(--text3)' }}>Category name</span>
                <input
                  {...register('name')}
                  placeholder='President'
                  className={inputClass}
                  style={{ background: 'var(--surface2)', borderColor: errors.name ? 'rgba(220,38,38,0.28)' : 'var(--border)', color: 'var(--text)' }}
                />
                {errors.name && <p className='text-[11px]' style={{ color: 'var(--danger)' }}>{errors.name.message}</p>}
              </label>

              <label className='space-y-2'>
                <span className='text-[12px] font-semibold uppercase tracking-[0.12em]' style={{ color: 'var(--text3)' }}>Description</span>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder='Describe what this category is for'
                  className={`${inputClass} resize-none`}
                  style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </label>

              <button
                type='submit'
                disabled={loading}
                className='rounded-[18px] px-5 py-3 text-[14px] font-semibold text-white disabled:opacity-60'
                style={{ background: 'var(--accent)', boxShadow: '0 16px 32px rgba(47,134,255,0.18)' }}
              >
                {loading ? 'Creating...' : 'Create category'}
              </button>
            </form>
          </div>
        )}

        <div className='rounded-[28px] border p-5 sm:p-6 shadow-[0_22px_60px_rgba(16,42,67,0.08)]' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='mb-5'>
            <h2 className='text-[22px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Current categories</h2>
            <p className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
              Open the candidate workspace from any category to keep ballot setup moving.
            </p>
          </div>

          <div className='space-y-4'>
            {categories.map(category => (
              <article key={category.id} className='rounded-[22px] border p-4 sm:p-5' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                  <div>
                    <h3 className='text-[17px] font-semibold' style={{ color: 'var(--text)' }}>{category.name}</h3>
                    {category.description && (
                      <p className='mt-1 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>{category.description}</p>
                    )}
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    <button
                      type='button'
                      onClick={() => navigate(`/admin/elections/${electionId}/categories/${category.id}/candidates`)}
                      className='rounded-[16px] border px-4 py-2 text-[13px] font-semibold'
                      style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text2)' }}
                    >
                      Candidates ({category.candidates.length})
                    </button>
                    <button
                      type='button'
                      onClick={() => deleteElectionCategory(category.id)}
                      className='rounded-[16px] border px-4 py-2 text-[13px] font-semibold'
                      style={{ background: 'var(--surface)', borderColor: 'rgba(220,38,38,0.2)', color: 'var(--danger)' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {categories.length === 0 && !loading && (
              <div className='rounded-[22px] border px-5 py-10 text-center' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                <div className='text-[16px] font-semibold' style={{ color: 'var(--text)' }}>No categories yet</div>
                <div className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>Create the first category to start structuring this election.</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ManageCategoriesPage
