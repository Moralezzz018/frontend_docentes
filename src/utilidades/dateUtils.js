import { format, parseISO } from 'date-fns'

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return ''
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, formatStr)
  } catch (error) {
    console.error('Error formateando fecha:', error)
    return date
  }
}

export const formatDateTime = (date) => {
  if (!date) return ''
  try {
    return formatDate(date, 'dd/MM/yyyy HH:mm')
  } catch (error) {
    console.error('Error formateando fecha/hora:', error)
    return date
  }
}

export const formatDateForInput = (date) => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, "yyyy-MM-dd'T'HH:mm")
}
