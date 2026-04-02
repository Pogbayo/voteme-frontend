export const formatDate = (date: string | null | undefined): string => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const formatDateTime = (date: string | null | undefined): string => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Convert UTC ISO date string to local datetime-local format (YYYY-MM-DDTHH:mm)
 * For use with HTML datetime-local input fields
 */
export const formatToLocalDateTime = (date: string | null | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Convert local datetime-local string to UTC ISO format
 * For sending to API
 */
export const convertLocalToUTC = (localDateTimeString: string): string => {
  if (!localDateTimeString) return ''
  return new Date(localDateTimeString).toISOString()
}