import type { Reservation } from "./types"
import { supabase } from "./supabase"

export async function saveReservation(
  giftId: string,
  guestId: string,
  guestName: string,
  hasCompanion: boolean,
  contributionType: 'physical' | 'pix',
  giftPrice?: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if gift is open value by querying gifts table
    const { data: gift, error: giftError } = await supabase
      .from("gifts")
      .select("is_open_value")
      .eq("id", giftId)
      .single() as { data: { is_open_value: boolean } | null; error: any }

    if (giftError) {
      console.error("Error fetching gift:", giftError)
      return { success: false, error: "Erro ao verificar presente." }
    }

    // For non-open-value gifts, check for existing reservation
    if (gift && !gift.is_open_value) {
      const { data: existingReservation } = await supabase
        .from("reservations")
        .select("id")
        .eq("gift_id", giftId)
        .maybeSingle()

      if (existingReservation) {
        return { success: false, error: "Este presente já foi reservado por outra pessoa." }
      }
    }

    // Proceed with reservation
    const { data, error } = await supabase
      .from("reservations")
      .insert({
        gift_id: giftId,
        guest_id: guestId,
        guest_name: guestName,
        has_companion: hasCompanion,
        contribution_type: contributionType,
        gift_price: giftPrice || null,
      } as any)
      .select()
      .single()

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving reservation:", error)
    return { success: false, error: "Erro ao salvar reserva. Tente novamente." }
  }
}

export async function getReservations(): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("reserved_at", { ascending: false })

    if (error) throw error

    return (data || []).map((r) => ({
      giftId: r.gift_id,
      userName: r.guest_name,
      hasCompanion: r.has_companion,
      reservedAt: r.reserved_at,
      contributionType: r.contribution_type,
      giftPrice: r.gift_price || undefined,
    }))
  } catch (error) {
    console.error("Error loading reservations:", error)
    return []
  }
}

export async function getReservationByGiftId(giftId: string): Promise<Reservation | undefined> {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("gift_id", giftId)
      .maybeSingle()

    if (error) throw error
    if (!data) return undefined

    return {
      giftId: data.gift_id,
      userName: data.guest_name,
      hasCompanion: data.has_companion,
      reservedAt: data.reserved_at,
      contributionType: data.contribution_type,
      giftPrice: data.gift_price || undefined,
    }
  } catch (error) {
    console.error("Error loading reservation:", error)
    return undefined
  }
}

export async function getReservationsByUser(guestId: string): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("guest_id", guestId)
      .order("reserved_at", { ascending: false })

    if (error) throw error

    return (data || []).map((r) => ({
      giftId: r.gift_id,
      userName: r.guest_name,
      hasCompanion: r.has_companion,
      reservedAt: r.reserved_at,
      contributionType: r.contribution_type,
      giftPrice: r.gift_price || undefined,
    }))
  } catch (error) {
    console.error("Error loading user reservations:", error)
    return []
  }
}

export async function removeReservation(
  giftId: string,
  guestId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // First verify the reservation belongs to this guest
    const { data: reservation } = await supabase
      .from("reservations")
      .select("guest_id")
      .eq("gift_id", giftId)
      .maybeSingle()

    if (!reservation) {
      return { success: false, error: "Reserva não encontrada." }
    }

    if (reservation.guest_id !== guestId) {
      return { success: false, error: "Você só pode cancelar suas próprias reservas." }
    }

    const { error } = await supabase.from("reservations").delete().eq("gift_id", giftId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error removing reservation:", error)
    return { success: false, error: "Erro ao cancelar reserva. Tente novamente." }
  }
}

export async function canCancelReservation(giftId: string, guestId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("reservations")
      .select("guest_id")
      .eq("gift_id", giftId)
      .maybeSingle()

    return data ? data.guest_id === guestId : false
  } catch (error) {
    console.error("Error checking reservation ownership:", error)
    return false
  }
}

// Real-time subscription helper
export function subscribeToReservations(callback: () => void) {
  const subscription = supabase
    .channel("reservations-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, () => {
      callback()
    })
    .subscribe()

  return subscription
}
