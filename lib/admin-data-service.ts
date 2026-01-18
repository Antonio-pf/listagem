import { supabase } from './supabase'

export interface AdminStats {
  totalGuests: number
  totalReservations: number
  totalMessages: number
  guestsWithCompanions: number
  reservedGiftsPercentage: number
}

export interface ReservationDetail {
  id: string
  gift_id: string
  guest_name: string
  has_companion: boolean
  contribution_type: 'physical' | 'pix'
  gift_price: number | null
  reserved_at: string
}

export interface GuestDetail {
  id: string
  name: string
  has_companion: boolean
  created_at: string
  reservations_count: number
}

export interface MessageDetail {
  id: string
  guest_name: string
  message: string
  created_at: string
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [
      { count: totalGuests },
      { count: totalReservations },
      { count: totalMessages },
      { count: guestsWithCompanions }
    ] = await Promise.all([
      supabase.from('guests').select('*', { count: 'exact', head: true }),
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('guests').select('*', { count: 'exact', head: true }).eq('has_companion', true)
    ])

    // Assuming there are 15 gifts total (based on the gift list)
    const TOTAL_GIFTS = 15
    const reservedGiftsPercentage = totalReservations 
      ? Math.round((totalReservations / TOTAL_GIFTS) * 100)
      : 0

    return {
      totalGuests: totalGuests || 0,
      totalReservations: totalReservations || 0,
      totalMessages: totalMessages || 0,
      guestsWithCompanions: guestsWithCompanions || 0,
      reservedGiftsPercentage
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    throw error
  }
}

export function calculateEventResources(totalGuests: number, guestsWithCompanions: number) {
  // Total people = guests + companions
  const totalPeople = totalGuests + guestsWithCompanions
  
  // Mesas: assuming 4 people per table
  const tablesNeeded = Math.ceil(totalPeople / 4)
  
  // Cadeiras: one chair per person
  const chairsNeeded = totalPeople
  
  // Estimate additional resources
  const platesNeeded = totalPeople
  const cupsNeeded = totalPeople
  
  return {
    totalPeople,
    tablesNeeded,
    chairsNeeded,
    platesNeeded,
    cupsNeeded
  }
}

export async function getAllReservations(): Promise<ReservationDetail[]> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('reserved_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching reservations:', error)
    throw error
  }
}

export async function getAllGuests(): Promise<GuestDetail[]> {
  try {
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false })

    if (guestsError) throw guestsError

    // Get reservation counts for each guest
    const guestsWithCounts = await Promise.all(
      (guests || []).map(async (guest) => {
        const { count } = await supabase
          .from('reservations')
          .select('*', { count: 'exact', head: true })
          .eq('guest_id', guest.id)

        return {
          ...guest,
          reservations_count: count || 0
        }
      })
    )

    return guestsWithCounts
  } catch (error) {
    console.error('Error fetching guests:', error)
    throw error
  }
}

export async function getAllMessages(): Promise<MessageDetail[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw error
  }
}

export async function getEventResources() {
  try {
    const stats = await getAdminStats()
    return calculateEventResources(stats.totalGuests, stats.guestsWithCompanions)
  } catch (error) {
    console.error('Error calculating event resources:', error)
    throw error
  }
}

export function convertToCSV(data: any[], headers: string[]): string {
  if (!data || data.length === 0) {
    return headers.join(',') + '\n'
  }

  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma or quote
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    )
  ]

  return csvRows.join('\n')
}
