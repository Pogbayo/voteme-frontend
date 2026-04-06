import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCandidate } from '../../hooks/useCandidate'
import { useElectionCategory } from '../../hooks/useElectionCategory'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  displayName: z.string().optional(),
  bio: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const colors = ['#2f86ff', '#4c98ff', '#6aa9ff', '#3d8eff', '#5ea2ff', '#7bb4ff']
const inputClass = 'w-full rounded-[16px] border px-4 py-3 text-[14px] outline-none transition'

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
      getCategoryCandidates(categoryId).catch(() => {})
      getElectionCategory(categoryId).catch(() => {})
    }
  }, [categoryId, getCategoryCandidates, getElectionCategory])

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
      // store manages error state
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <button
          type='button'
          onClick={() => navigate(`/admin/elections/${electionId}/categories`)}
          className='inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium'
          style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text2)' }}
        >
          <svg width='14' height='14' viewBox='0 0 16 16' fill='currentColor'>
            <path d='M10 3L6 8l4 5' />
          </svg>
          Back to categories
        </button>

        <button
          type='button'
          onClick={() => setShowForm(current => !current)}
          className='rounded-[18px] px-4 py-3 text-[13px] font-semibold text-white'
          style={{ background: 'var(--accent)', boxShadow: '0 16px 32px rgba(47,134,255,0.18)' }}
        >
          {showForm ? 'Close form' : 'Add candidate'}
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
              Candidate workspace
            </div>
            <div>
              <h1 className='text-[30px] font-semibold leading-[1.05] sm:text-[38px]' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                Manage candidates
              </h1>
              <p className='mt-3 max-w-[700px] text-[15px] leading-7' style={{ color: 'var(--text2)' }}>
                Add the people running for <span className='font-semibold' style={{ color: 'var(--text)' }}>{category?.name ?? 'this category'}</span> and keep the ballot clear for voters.
              </p>
            </div>
            <div className='grid gap-3 sm:grid-cols-3'>
              {[
                ['Category', category?.name ?? 'Loading'],
                ['Candidates', `${candidates.length}`],
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
            <div className='mb-4 text-[13px] font-semibold uppercase tracking-[0.14em]' style={{ color: 'var(--text3)' }}>Setup guidance</div>
            <div className='space-y-3'>
              {[
                'Keep display names short so ballots stay readable on smaller screens.',
                'Use photos only when they add clarity, not clutter.',
                'Candidate bios should be concise enough to scan quickly before voting.',
              ].map(item => (
                <div key={item} className='rounded-[18px] px-4 py-3 text-[13px] leading-6' style={{ background: 'var(--surface)', color: 'var(--text2)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className='rounded-[20px] border px-4 py-3 text-[13px]' style={{ background: 'var(--danger-bg)', borderColor: 'rgba(220,38,38,0.16)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <section className='grid gap-6 xl:grid-cols-[0.94fr_1.06fr]'>
        {showForm && (
          <div className='rounded-[28px] border p-5 sm:p-6 shadow-[0_22px_60px_rgba(16,42,67,0.08)]' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className='text-[22px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Add a candidate</h2>
            <p className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
              Complete the candidate profile voters will see in the election flow.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className='mt-5 space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <label className='space-y-2'>
                  <span className='text-[12px] font-semibold uppercase tracking-[0.12em]' style={{ color: 'var(--text3)' }}>First name</span>
                  <input
                    {...register('firstName')}
                    placeholder='John'
                    className={inputClass}
                    style={{ background: 'var(--surface2)', borderColor: errors.firstName ? 'rgba(220,38,38,0.28)' : 'var(--border)', color: 'var(--text)' }}
                  />
                  {errors.firstName && <p className='text-[11px]' style={{ color: 'var(--danger)' }}>{errors.firstName.message}</p>}
                </label>

                <label className='space-y-2'>
                  <span className='text-[12px] font-semibold uppercase tracking-[0.12em]' style={{ color: 'var(--text3)' }}>Last name</span>
                  <input
                    {...register('lastName')}
                    placeholder='Adeyemi'
                    className={inputClass}
                    style={{ background: 'var(--surface2)', borderColor: errors.lastName ? 'rgba(220,38,38,0.28)' : 'var(--border)', color: 'var(--text)' }}
                  />
                  {errors.lastName && <p className='text-[11px]' style={{ color: 'var(--danger)' }}>{errors.lastName.message}</p>}
                </label>
              </div>

              <label className='space-y-2'>
                <span className='text-[12px] font-semibold uppercase tracking-[0.12em]' style={{ color: 'var(--text3)' }}>Display name</span>
                <input
                  {...register('displayName')}
                  placeholder='Short ballot name'
                  className={inputClass}
                  style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </label>

              <label className='space-y-2'>
                <span className='text-[12px] font-semibold uppercase tracking-[0.12em]' style={{ color: 'var(--text3)' }}>Bio</span>
                <textarea
                  {...register('bio')}
                  rows={4}
                  placeholder='Short biography or manifesto summary'
                  className={`${inputClass} resize-none`}
                  style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </label>

              <label className='space-y-2'>
                <span className='text-[12px] font-semibold uppercase tracking-[0.12em]' style={{ color: 'var(--text3)' }}>Photo</span>
                <input
                  type='file'
                  accept='image/*'
                  onChange={event => setPhotoFile(event.target.files?.[0] ?? null)}
                  className='block w-full text-[13px]'
                  style={{ color: 'var(--text2)' }}
                />
              </label>

              <button
                type='submit'
                disabled={isLoading}
                className='rounded-[18px] px-5 py-3 text-[14px] font-semibold text-white disabled:opacity-60'
                style={{ background: 'var(--accent)', boxShadow: '0 16px 32px rgba(47,134,255,0.18)' }}
              >
                {isLoading ? 'Adding candidate...' : 'Add candidate'}
              </button>
            </form>
          </div>
        )}

        <div className='rounded-[28px] border p-5 sm:p-6 shadow-[0_22px_60px_rgba(16,42,67,0.08)]' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className='mb-5'>
            <h2 className='text-[22px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Candidate roster</h2>
            <p className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
              Review the ballot lineup and remove anyone who should no longer appear in this category.
            </p>
          </div>

          {candidates.length === 0 && !isLoading ? (
            <div className='rounded-[22px] border px-5 py-10 text-center' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <div className='text-[16px] font-semibold' style={{ color: 'var(--text)' }}>No candidates yet</div>
              <div className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>Add the first candidate to complete this ballot category.</div>
            </div>
          ) : (
            <div className='grid gap-4 md:grid-cols-2'>
              {candidates.map((candidate, index) => (
                <article key={candidate.id} className='rounded-[22px] border p-4' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                  <div className='flex items-start gap-3'>
                    {candidate.photoUrl ? (
                      <img src={candidate.photoUrl} alt='' className='h-14 w-14 rounded-full object-cover' />
                    ) : (
                      <div className='flex h-14 w-14 items-center justify-center rounded-full text-[15px] font-semibold text-white' style={{ background: colors[index % colors.length] }}>
                        {candidate.firstName[0]}{candidate.lastName[0]}
                      </div>
                    )}
                    <div className='min-w-0 flex-1'>
                      <div className='text-[15px] font-semibold' style={{ color: 'var(--text)' }}>
                        {candidate.displayName || `${candidate.firstName} ${candidate.lastName}`}
                      </div>
                      {candidate.bio && (
                        <div className='mt-2 line-clamp-3 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
                          {candidate.bio}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => deleteCandidate(candidate.id)}
                    className='mt-4 rounded-[16px] border px-4 py-2 text-[13px] font-semibold'
                    style={{ background: 'var(--surface)', borderColor: 'rgba(220,38,38,0.2)', color: 'var(--danger)' }}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ManageCandidatesPage
