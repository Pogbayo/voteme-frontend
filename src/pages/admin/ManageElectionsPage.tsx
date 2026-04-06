import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useElection } from '../../hooks/useElection'
import { useOrganization } from '../../hooks/useOrganization'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatDate, convertLocalToUTC } from '../../utils/formatDate'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isPrivate: z.boolean().default(false).optional(),
})

type FormData = z.infer<typeof schema>

const getElectionCategoryCount = (categoryCount?: number, categories?: { length: number }) =>
  categoryCount ?? categories?.length ?? 0

const statusStyle: Record<number, { label: string; bg: string; color: string }> = {
  0: { label: 'Pending', bg: 'var(--warning-bg)', color: 'var(--warning)' },
  1: { label: 'Active', bg: 'var(--success-bg)', color: 'var(--success)' },
  2: { label: 'Closed', bg: 'var(--info-bg)', color: 'var(--info)' },
}

const ManageElectionsPage = () => {
  const {
    elections,
    getOrganizationElections,
    createElection,
    deleteElection,
    openElection,
    getElection,
    isLoading,
    error,
    clearError,
  } = useElection()
  const { currentOrganization } = useOrganization()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [openingId, setOpeningId] = useState<string | null>(null)
  const [endDate, setEndDate] = useState('')
  const [openError, setOpenError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isPrivate: false },
  })

  useEffect(() => {
    if (currentOrganization?.id) {
      getOrganizationElections(currentOrganization.id).catch(() => {})
    }
  }, [currentOrganization?.id, getOrganizationElections])

  const onSubmit = async (data: FormData) => {
    if (!currentOrganization?.id) return
    try {
      await createElection({
        ...data,
        isPrivate: data.isPrivate ?? false,
        organizationId: currentOrganization.id,
      })
      reset()
      setShowForm(false)
    } catch {}
  }

  const handleOpen = async (electionId: string) => {
    if (!endDate) {
      setOpenError('Please select an end date before opening this election.')
      return
    }

    try {
      setOpenError(null)
      const election = await getElection(electionId)
      if (!election?.categories?.length) {
        setOpenError('This election has no categories yet. Add at least one category before opening it.')
        return
      }

      await openElection(electionId, { endDate: convertLocalToUTC(endDate) })
      setOpeningId(null)
      setEndDate('')
      setOpenError(null)

      if (currentOrganization?.id) {
        await getOrganizationElections(currentOrganization.id)
      }
    } catch (err: any) {
      setOpenError(err.response?.data?.message || 'Failed to open election')
    }
  }

  return (
    <div className='flex flex-col gap-5 md:gap-6'>
      <section className='rounded-[26px] border p-5 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <div className='text-[11px] font-semibold uppercase tracking-[0.16em]' style={{ color: 'var(--info)' }}>
              Admin workspace
            </div>
            <h1 className='mt-3 text-[28px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Manage elections
            </h1>
            <p className='mt-2 text-[14px] leading-6' style={{ color: 'var(--text2)' }}>
              Create new elections, open them when categories are ready, and keep administration inside the same blue system.
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); clearError() }}
            className='rounded-[18px] px-5 py-3 text-[13px] font-semibold text-white'
            style={{ background: 'var(--accent)' }}
          >
            {showForm ? 'Close form' : 'Create election'}
          </button>
        </div>
      </section>

      {showForm && (
        <section className='rounded-[26px] border p-5 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className='text-[20px] font-semibold' style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            New election
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='md:col-span-2'>
              <label className='block text-[12px] font-semibold uppercase tracking-[0.12em] mb-2' style={{ color: 'var(--text3)' }}>
                Election name
              </label>
              <input {...register('name')} className='w-full rounded-[18px] border px-4 py-3.5 text-[14px] outline-none' style={{ background: 'var(--surface2)', borderColor: errors.name ? 'var(--danger)' : 'var(--border)', color: 'var(--text)' }} />
              {errors.name && <p className='mt-2 text-[12px]' style={{ color: 'var(--danger)' }}>{errors.name.message}</p>}
            </div>
            <div className='md:col-span-2'>
              <label className='block text-[12px] font-semibold uppercase tracking-[0.12em] mb-2' style={{ color: 'var(--text3)' }}>
                Description
              </label>
              <textarea {...register('description')} rows={3} className='w-full rounded-[18px] border px-4 py-3.5 text-[14px] outline-none resize-none' style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }} />
            </div>
            <label className='inline-flex items-center gap-2 text-[14px]' style={{ color: 'var(--text2)' }}>
              <input {...register('isPrivate')} type='checkbox' />
              Private election
            </label>
            <div className='md:col-span-2 flex items-center justify-between gap-3 flex-wrap'>
              {error && <div className='text-[12px]' style={{ color: 'var(--danger)' }}>{error}</div>}
              <button type='submit' disabled={isLoading} className='rounded-[18px] px-5 py-3 text-[13px] font-semibold text-white disabled:opacity-60' style={{ background: 'var(--accent)' }}>
                {isLoading ? 'Creating...' : 'Create election'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className='rounded-[26px] border p-4 md:p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className='grid gap-4'>
          {elections.map((election) => {
            const tone = statusStyle[election.status]
            const isOpening = openingId === election.id

            return (
              <article key={election.id} className='rounded-[22px] border p-4 md:p-5' style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-3 flex-wrap'>
                      <div className='text-[16px] font-semibold' style={{ color: 'var(--text)' }}>{election.name}</div>
                      <span className='rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]' style={{ background: tone.bg, color: tone.color }}>
                        {tone.label}
                      </span>
                    </div>
                    <div className='mt-2 text-[13px] leading-6' style={{ color: 'var(--text2)' }}>
                      {getElectionCategoryCount(election.categoryCount, election.categories)} categories. Created {formatDate(election.createdAt)}.
                    </div>

                    {isOpening && (
                      <div className='mt-4 flex flex-col gap-3 md:flex-row md:items-center'>
                        <div className='flex-1 min-w-[240px]'>
                          <label className='block text-[11px] font-semibold uppercase tracking-[0.12em] mb-2' style={{ color: 'var(--text3)' }}>
                            Election end date
                          </label>
                          <input
                            type='datetime-local'
                            value={endDate}
                            onChange={(ev) => setEndDate(ev.target.value)}
                            className='w-full rounded-[16px] border px-4 py-3 text-[13px] outline-none open-election-datetime'
                            style={{ background: 'var(--surface)', borderColor: 'var(--accent)', color: 'var(--text)', colorScheme: 'light' }}
                          />
                          <p className='mt-2 text-[12px] leading-5' style={{ color: 'var(--text2)' }}>
                            This date is when the election will end and voting will automatically close.
                          </p>
                          {openError && (
                            <div className='mt-2 rounded-[14px] px-3 py-2 text-[12px]' style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                              {openError}
                            </div>
                          )}
                        </div>
                        <div className='flex flex-wrap items-center gap-3'>
                          <button onClick={() => handleOpen(election.id)} disabled={!endDate} className='rounded-[16px] px-4 py-3 text-[13px] font-semibold text-white disabled:opacity-50' style={{ background: 'var(--accent)' }}>
                            Confirm open
                          </button>
                          <button onClick={() => { setOpeningId(null); setOpenError(null); }} className='text-[13px] font-medium' style={{ color: 'var(--text2)' }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='flex flex-wrap items-center gap-2'>
                    <button onClick={() => navigate(`/admin/elections/${election.id}/categories`)} className='rounded-[14px] border px-3 py-2 text-[12px] font-medium' style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                      Categories
                    </button>
                    {election.status === 0 && (
                      <button onClick={() => { setOpeningId(election.id); setOpenError(null); }} className='rounded-[14px] px-3 py-2 text-[12px] font-semibold text-white' style={{ background: 'var(--accent)' }}>
                        Open
                      </button>
                    )}
                    {election.status === 2 && (
                      <button onClick={() => navigate(`/elections/${election.id}/results`)} className='rounded-[14px] border px-3 py-2 text-[12px] font-medium' style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                        Results
                      </button>
                    )}
                    {election.status !== 1 && (
                      <button onClick={() => deleteElection(election.id)} className='rounded-[14px] border px-3 py-2 text-[12px] font-medium' style={{ borderColor: 'var(--border)', color: 'var(--danger)' }}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default ManageElectionsPage
