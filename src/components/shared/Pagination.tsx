import Button from '../ui/Button'

interface PaginationProps {
  page: number
  pageSize: number
  totalCount: number
  onNext: () => void
  onPrev: () => void
}

const Pagination = ({ page, pageSize, totalCount, onNext, onPrev }: PaginationProps) => {
  const totalPages = Math.ceil(totalCount / pageSize)
  const isFirstPage = page === 1
  const isLastPage = page >= totalPages

  return (
    <div className='flex items-center justify-between mt-4'>
      <span className='text-sm text-gray-500'>
        Page {page} of {totalPages} — {totalCount} total
      </span>
      <div className='flex gap-2'>
        <Button
          variant='secondary'
          size='sm'
          onClick={onPrev}
          disabled={isFirstPage}
        >
          Previous
        </Button>
        <Button
          variant='secondary'
          size='sm'
          onClick={onNext}
          disabled={isLastPage}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default Pagination