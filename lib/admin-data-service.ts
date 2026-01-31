import { supabase } from './supabase'
import type { AttendanceConfirmation } from './attendance-storage'

export interface AdminStats {
  totalGuests: number
  totalReservations: number
  totalMessages: number
  guestsWithCompanions: number
  reservedGiftsPercentage: number
  totalAttendanceConfirmed: number
  totalAttending: number
  totalNotAttending: number
  totalPendingConfirmation: number
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
  gifts: string[]
}

export interface MessageDetail {
  id: string
  guest_name: string
  message: string
  created_at: string
}

export interface AttendanceDetail {
  id: string
  guest_id: string
  guest_name: string
  will_attend: boolean
  companion_count: number
  dietary_restrictions: string | null
  additional_notes: string | null
  confirmed_at: string
  updated_at: string
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [
      { count: totalGuests },
      { count: totalReservations },
      { count: totalMessages },
      { count: guestsWithCompanions },
      { count: totalAttendanceConfirmed },
      { count: totalAttending },
      { count: totalNotAttending }
    ] = await Promise.all([
      supabase.from('guests').select('*', { count: 'exact', head: true }),
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('guests').select('*', { count: 'exact', head: true }).eq('has_companion', true),
      supabase.from('event_attendance').select('*', { count: 'exact', head: true }),
      supabase.from('event_attendance').select('*', { count: 'exact', head: true }).eq('will_attend', true),
      supabase.from('event_attendance').select('*', { count: 'exact', head: true }).eq('will_attend', false)
    ])

    const totalPendingConfirmation = (totalGuests || 0) - (totalAttendanceConfirmed || 0)

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
      reservedGiftsPercentage,
      totalAttendanceConfirmed: totalAttendanceConfirmed || 0,
      totalAttending: totalAttending || 0,
      totalNotAttending: totalNotAttending || 0,
      totalPendingConfirmation
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    throw error
  }
}

export async function calculateEventResourcesFromAttendance(): Promise<{
  totalPeople: number
  tablesNeeded: number
  chairsNeeded: number
  platesNeeded: number
  cupsNeeded: number
}> {
  try {
    // Get all attendances where will_attend = true
    const { data: attendances, error } = await supabase
      .from('event_attendance')
      .select('companion_count')
      .eq('will_attend', true) as { data: { companion_count: number }[] | null; error: any }

    if (error) throw error

    // Calculate total people: number of guests attending + their companions
    const totalGuests = attendances?.length || 0
    const totalCompanions = attendances?.reduce((sum, a) => sum + (a.companion_count || 0), 0) || 0
    const totalPeople = totalGuests + totalCompanions
    
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
  } catch (error) {
    console.error('Error calculating event resources from attendance:', error)
    // Return default values if error
    return {
      totalPeople: 0,
      tablesNeeded: 0,
      chairsNeeded: 0,
      platesNeeded: 0,
      cupsNeeded: 0
    }
  }
}

export function calculateEventResources(totalGuests: number, guestsWithCompanions: number) {
  // Total people = guests + companions (assuming each guest with companion brings 1 companion)
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

    // Get reservation counts and gift names for each guest
    const guestsWithDetails: GuestDetail[] = await Promise.all(
      (guests || []).map(async (guest: any) => {
        const { data: reservations, count } = await supabase
          .from('reservations')
          .select('gift_id', { count: 'exact' })
          .eq('guest_id', guest.id)

        // Get gift names for each reservation
        const gifts: string[] = []
        if (reservations && reservations.length > 0) {
          const giftIds = reservations.map((r: any) => r.gift_id)
          const { data: giftData } = await supabase
            .from('gifts')
            .select('id, name')
            .in('id', giftIds)
          
          if (giftData) {
            gifts.push(...giftData.map((g: any) => g.name))
          }
        }

        return {
          id: guest.id,
          name: guest.name,
          has_companion: guest.has_companion,
          created_at: guest.created_at,
          reservations_count: count || 0,
          gifts
        }
      })
    )

    return guestsWithDetails
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

export async function getAllAttendances(): Promise<AttendanceDetail[]> {
  try {
    const { data: attendances, error } = await supabase
      .from('event_attendance')
      .select('*')
      .order('confirmed_at', { ascending: false }) as { data: any[] | null; error: any }

    if (error) throw error

    // Join with guests to get guest names
    const attendancesWithNames = await Promise.all(
      (attendances || []).map(async (attendance) => {
        const { data: guest } = await supabase
          .from('guests')
          .select('name')
          .eq('id', attendance.guest_id)
          .single() as { data: any; error: any }

        return {
          id: attendance.id,
          guest_id: attendance.guest_id,
          guest_name: guest?.name || 'Unknown',
          will_attend: attendance.will_attend,
          companion_count: attendance.companion_count,
          dietary_restrictions: attendance.dietary_restrictions,
          additional_notes: attendance.additional_notes,
          confirmed_at: attendance.confirmed_at,
          updated_at: attendance.updated_at
        }
      })
    )

    return attendancesWithNames
  } catch (error) {
    console.error('Error fetching attendances:', error)
    throw error
  }
}

export async function getEventResources() {
  try {
    // Use real attendance data for more accurate resource calculation
    return await calculateEventResourcesFromAttendance()
  } catch (error) {
    console.error('Error calculating event resources:', error)
    throw error
  }
}

export async function getPendingConfirmationGuests(): Promise<Array<{ id: string; name: string }>> {
  try {
    // Get all guests
    const { data: allGuests, error: guestsError } = await supabase
      .from('guests')
      .select('id, name')
      .order('created_at', { ascending: false }) as { data: Array<{ id: string; name: string }> | null; error: any }

    if (guestsError) throw guestsError

    // Get all guest IDs who have confirmed attendance
    const { data: confirmedAttendances, error: attendanceError } = await supabase
      .from('event_attendance')
      .select('guest_id') as { data: Array<{ guest_id: string }> | null; error: any }

    if (attendanceError) throw attendanceError

    // Create a Set of confirmed guest IDs for fast lookup
    const confirmedGuestIds = new Set(
      (confirmedAttendances || []).map(a => a.guest_id)
    )

    // Filter guests who haven't confirmed
    const pendingGuests = (allGuests || []).filter(
      guest => !confirmedGuestIds.has(guest.id)
    )

    return pendingGuests
  } catch (error) {
    console.error('Error fetching pending confirmation guests:', error)
    return []
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
