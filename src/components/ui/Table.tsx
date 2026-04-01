interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => ReactNode)
}

import { type ReactNode } from 'react'

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
}

const Table = <T extends { id?: string }>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No data found'
}: TableProps<T>) => {
  return (
    <div className='w-full overflow-x-auto rounded-lg border border-gray-200'>
      <table className='w-full text-sm text-left'>
        <thead className='bg-gray-50 text-gray-600 uppercase text-xs'>
          <tr>
            {columns.map((col, i) => (
              <th key={i} className='px-4 py-3 font-medium'>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className='px-4 py-8 text-center text-gray-400'>
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className='px-4 py-8 text-center text-gray-400'>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id ?? i} className='hover:bg-gray-50 transition-colors'>
                {columns.map((col, j) => (
                  <td key={j} className='px-4 py-3 text-gray-700'>
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : row[col.accessor] as ReactNode
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table