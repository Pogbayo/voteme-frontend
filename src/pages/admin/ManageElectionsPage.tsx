import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useElection } from '../../hooks/useElection'
import { useOrganization } from '../../hooks/useOrganization'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatDate } from '../../utils/formatDate'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isPrivate: z.boolean().default(false).optional(),
})

type FormData = z.infer<typeof schema>

const statusStyle: Record<number, { label: string; bg: string; color: string }> = {
  0: { label: 'Pending', bg: 'var(--warning-bg)', color: 'var(--warning)' },
  1: { label: 'Active', bg: 'var(--success-bg)', color: 'var(--success)' },
  2: { label: 'Closed', bg: 'var(--surface2)', color: 'var(--text3)' },
}

const ManageElectionsPage = () => {
  const {
    elections,
    getOrganizationElections,
    createElection,
    deleteElection,
    openElection,
    isLoading,
    error,
    clearError,
  } = useElection()
  const { currentOrganization } = useOrganization()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [openingId, setOpeningId] = useState<string | null>(null)
  const [endDate, setEndDate] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isPrivate: false },
  })

  useEffect(() => {
    if (currentOrganization?.id) getOrganizationElections(currentOrganization.id)
  }, [currentOrganization?.id])

  const onSubmit = async (data: FormData) => {
    console.log('Current org:', currentOrganization)
    if (!currentOrganization?.id) return
    try {
      console.log('Submitting election:', {
      ...data,
      organizationId: currentOrganization?.id,
    })
      await createElection({
        ...data,
        isPrivate: data.isPrivate ?? false,
        organizationId: currentOrganization.id,
      })
      reset()
      setShowForm(false)
    } catch (err) {
      console.error(err) // error is already stored in the store
    }
  }

  const handleOpen = async (electionId: string) => {
    if (!endDate) return
    try {
      await openElection(electionId, { endDate: new Date(endDate).toISOString() })
      setOpeningId(null)
      setEndDate('')
      if (currentOrganization?.id) getOrganizationElections(currentOrganization.id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='flex flex-col gap-5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-[20px] font-medium' style={{ color: 'var(--text)' }}>Manage elections</h1>
          <p className='text-[13px] mt-0.5' style={{ color: 'var(--text2)' }}>{currentOrganization?.name}</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); clearError() }}
          className='px-4 py-2 rounded-[8px] text-[13px] font-medium text-white'
          style={{ background: 'var(--accent)' }}
        >
          {showForm ? 'Cancel' : '+ Create election'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className='rounded-[12px] p-5 border' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className='text-[14px] font-medium mb-4' style={{ color: 'var(--text)' }}>New election</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>Election name</label>
              <input
                {...register('name')}
                placeholder='e.g. Student Union Election 2026'
                className='px-3 py-2 rounded-[8px] text-[13px] outline-none border'
                style={{ background: 'var(--surface2)', borderColor: errors.name ? 'var(--danger)' : 'var(--border)', color: 'var(--text)' }}
              />
              {errors.name && <span className='text-[11px]' style={{ color: 'var(--danger)' }}>{errors.name.message}</span>}
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-medium' style={{ color: 'var(--text2)' }}>Description (optional)</label>
              <textarea
                {...register('description')}
                placeholder='Brief description of this election'
                rows={2}
                className='px-3 py-2 rounded-[8px] text-[13px] outline-none border resize-none'
                style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <label className='flex items-center gap-2 cursor-pointer'>
              <input {...register('isPrivate')} type='checkbox' />
              <span className='text-[13px]' style={{ color: 'var(--text2)' }}>Private election</span>
            </label>

            {/* Backend error */}
            {error && <div className='text-[12px]' style={{ color: 'var(--danger)' }}>{error}</div>}

            <button
              type='submit'
              disabled={isLoading}
              className='px-4 py-2 rounded-[8px] text-[13px] font-medium text-white w-fit disabled:opacity-50'
              style={{ background: 'var(--accent)' }}
            >
              {isLoading ? 'Creating...' : 'Create election'}
            </button>
          </form>
        </div>
      )}

      {/* Elections list */}
      <div className='rounded-[12px] border overflow-hidden' style={{ borderColor: 'var(--border)' }}>
        {elections.map((e, i) => {
          const s = statusStyle[e.status]
          const isOpening = openingId === e.id
          return (
            <div
              key={e.id}
              className='p-4 flex flex-col md:flex-row md:items-center gap-3'
              style={{
                background: 'var(--surface)',
                borderBottom: i < elections.length - 1 ? '0.5px solid var(--border)' : 'none',
              }}
            >
              {/* Status Icon */}
              <div
                className='w-[34px] h-[34px] rounded-[8px] flex items-center justify-center flex-shrink-0'
                style={{ background: s.bg }}
              >
                <svg width='16' height='16' viewBox='0 0 16 16' fill={s.color}>
                  <path d='M8 1L2 5v6l6 4 6-4V5z'/>
                </svg>
              </div>

              {/* Election Info */}
              <div className='flex-1 min-w-0'>
                <div className='text-[13px] font-medium' style={{ color: 'var(--text)' }}>{e.name}</div>
                <div className='text-[11px] mt-0.5' style={{ color: 'var(--text3)' }}>
                  {e.categories.length} categories · Created {formatDate(e.createdAt)}
                </div>

                {isOpening && (
                  <div className='flex items-center gap-2 mt-3'>
                    <input
                      type='datetime-local'
                      value={endDate}
                      onChange={ev => setEndDate(ev.target.value)}
                      className='px-2 py-1.5 rounded-[6px] text-[12px] border outline-none'
                      style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    />
                    <button
                      onClick={() => handleOpen(e.id)}
                      disabled={!endDate}
                      className='px-3 py-1.5 rounded-[6px] text-[12px] font-medium text-white disabled:opacity-50'
                      style={{ background: 'var(--accent)' }}
                    >
                      Confirm open
                    </button>
                    <button
                      onClick={() => setOpeningId(null)}
                      className='text-[12px]'
                      style={{ color: 'var(--text3)' }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className='flex items-center gap-2 flex-shrink-0'>
                <span className='text-[10px] font-medium px-2 py-1 rounded-full' style={{ background: s.bg, color: s.color }}>
                  {s.label}
                </span>
                <button
                  onClick={() => navigate(`/admin/elections/${e.id}/categories`)}
                  className='text-[11px] px-2.5 py-1.5 rounded-[6px] border'
                  style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                >
                  Categories
                </button>
                {e.status === 0 && (
                  <button
                    onClick={() => setOpeningId(e.id)}
                    className='text-[11px] px-2.5 py-1.5 rounded-[6px] text-white'
                    style={{ background: 'var(--accent)' }}
                  >
                    Open
                  </button>
                )}
                {e.status === 2 && (
                  <button
                    onClick={() => navigate(`/elections/${e.id}/results`)}
                    className='text-[11px] px-2.5 py-1.5 rounded-[6px] border'
                    style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                  >
                    Results
                  </button>
                )}
                {e.status !== 1 && (
                  <button
                    onClick={() => deleteElection(e.id)}
                    className='text-[11px] px-2.5 py-1.5 rounded-[6px] border'
                    style={{ borderColor: 'var(--border)', color: 'var(--danger)' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ManageElectionsPage