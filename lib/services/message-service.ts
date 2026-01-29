import { supabase } from "../supabase"
import type { Database } from "../database.types"

type DbMessage = Database["public"]["Tables"]["messages"]["Row"]

export interface Message {
  id: string
  guestName: string
  message: string
  createdAt: string
}

export async function saveMessage(guestName: string, messageText: string): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        guest_name: guestName,
        message: messageText,
      } as any)
      .select()
      .single() as { data: DbMessage | null; error: any }

    if (error) {
      console.error("Error saving message:", error)
      return null
    }

    if (!data) return null

    return {
      id: data.id,
      guestName: data.guest_name,
      message: data.message,
      createdAt: data.created_at,
    }
  } catch (error) {
    console.error("Error saving message:", error)
    return null
  }
}

export async function getMessages(): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching messages:", error)
      return []
    }

    return (data || []).map((msg: DbMessage) => ({
      id: msg.id,
      guestName: msg.guest_name,
      message: msg.message,
      createdAt: msg.created_at,
    }))
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}
