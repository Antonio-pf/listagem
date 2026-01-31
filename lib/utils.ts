import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a UTC date string from database to Brazil timezone (America/Sao_Paulo)
 * and returns a Date object in the local timezone
 * 
 * @param utcDateString - ISO date string from database (e.g., "2026-01-31T15:10:25.000Z")
 * @returns Date object adjusted to Brazil timezone
 */
export function convertUTCToBrazilTime(utcDateString: string): Date {
  // Parse the UTC date string
  const utcDate = new Date(utcDateString)
  
  const brazilDateString = utcDate.toLocaleString('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  return new Date(brazilDateString)
}

/**
 * Formats a UTC date string from database to a localized date string in Brazil timezone
 * 
 * @param utcDateString - ISO date string from database
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string in Brazil timezone
 */
export function formatBrazilDate(
  utcDateString: string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: 'short',
    timeStyle: 'short'
  }
): string {
  const utcDate = new Date(utcDateString)
  
  return utcDate.toLocaleString('pt-BR', {
    ...options,
    timeZone: 'America/Sao_Paulo'
  })
}

/**
 * Formats a date for relative time display (e.g., "5 min atrás", "2 dias atrás")
 * Considers Brazil timezone for accurate relative time calculation
 * 
 * @param utcDateString - ISO date string from database
 * @returns Formatted relative time string in Portuguese
 */
export function formatRelativeTime(utcDateString: string): string {
  const messageDate = new Date(utcDateString)
  const now = new Date()
  
  // Convert both dates to Brazil timezone for accurate comparison
  const messageDateBrazil = new Date(messageDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  const nowBrazil = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  
  const diffMs = nowBrazil.getTime() - messageDateBrazil.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Agora"
  if (diffMins < 60) return `${diffMins} min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays === 1) return "1 dia atrás"
  if (diffDays < 7) return `${diffDays} dias atrás`
  
  // For older dates, show formatted date
  return messageDate.toLocaleDateString("pt-BR", { 
    day: "numeric", 
    month: "short",
    timeZone: 'America/Sao_Paulo'
  })
}
