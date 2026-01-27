import { supabase } from "./supabase"

export interface AttendanceData {
  willAttend: boolean
  companionCount: number
  dietaryRestrictions?: string
  additionalNotes?: string
}

export interface AttendanceConfirmation extends AttendanceData {
  id: string
  guestId: string
  confirmedAt: string
  updatedAt: string
}

export async function confirmAttendance(
  guestId: string,
  data: AttendanceData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if guest already has a confirmation
    const { data: existing } = await supabase
      .from("event_attendance")
      .select("id")
      .eq("guest_id", guestId)
      .maybeSingle()

    if (existing) {
      // Update existing confirmation
      return await updateAttendance(guestId, data)
    }

    // Insert new confirmation
    const { error } = await supabase
      .from("event_attendance")
      .insert({
        guest_id: guestId,
        will_attend: data.willAttend,
        companion_count: data.companionCount,
        dietary_restrictions: data.dietaryRestrictions || null,
        additional_notes: data.additionalNotes || null,
      } as any)
      .select()
      .single()

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error confirming attendance:", error)
    return { success: false, error: "Erro ao confirmar presença. Tente novamente." }
  }
}

export async function getGuestAttendance(guestId: string): Promise<AttendanceConfirmation | undefined> {
  try {
    const { data, error } = await supabase
      .from("event_attendance")
      .select("*")
      .eq("guest_id", guestId)
      .maybeSingle() as { data: any; error: any }

    if (error) throw error
    if (!data) return undefined

    return {
      id: data.id,
      guestId: data.guest_id,
      willAttend: data.will_attend,
      companionCount: data.companion_count,
      dietaryRestrictions: data.dietary_restrictions || undefined,
      additionalNotes: data.additional_notes || undefined,
      confirmedAt: data.confirmed_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error("Error loading guest attendance:", error)
    return undefined
  }
}

export async function updateAttendance(
  guestId: string,
  data: AttendanceData
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await supabase
      .from("event_attendance")
      .update({
        will_attend: data.willAttend,
        companion_count: data.companionCount,
        dietary_restrictions: data.dietaryRestrictions || null,
        additional_notes: data.additionalNotes || null,
      } as any)
      .eq("guest_id", guestId) as any

    if (result.error) {
      throw result.error
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating attendance:", error)
    return { success: false, error: "Erro ao atualizar presença. Tente novamente." }
  }
}

export async function getAllAttendances(): Promise<AttendanceConfirmation[]> {
  try {
    const { data, error } = await supabase
      .from("event_attendance")
      .select("*")
      .order("confirmed_at", { ascending: false }) as { data: any[] | null; error: any }

    if (error) throw error

    return (data || []).map((r) => ({
      id: r.id,
      guestId: r.guest_id,
      willAttend: r.will_attend,
      companionCount: r.companion_count,
      dietaryRestrictions: r.dietary_restrictions || undefined,
      additionalNotes: r.additional_notes || undefined,
      confirmedAt: r.confirmed_at,
      updatedAt: r.updated_at,
    }))
  } catch (error) {
    console.error("Error loading all attendances:", error)
    return []
  }
}

// Real-time subscription helper
export function subscribeToAttendance(callback: () => void) {
  const subscription = supabase
    .channel("attendance-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "event_attendance" }, () => {
      callback()
    })
    .subscribe()

  return subscription
}
