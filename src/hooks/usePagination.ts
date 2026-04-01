import { useState } from 'react'

export const usePagination = (defaultPageSize = 20) => {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(defaultPageSize)

  const nextPage = () => setPage((prev) => prev + 1)
  const prevPage = () => setPage((prev) => Math.max(1, prev - 1))
  const goToPage = (p: number) => setPage(p)
  const reset = () => setPage(1)

  return {
    page,
    pageSize,
    nextPage,
    prevPage,
    goToPage,
    reset,
  }
}