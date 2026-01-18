import { supabase } from "./supabase"
import type { Database } from "./database.types"

type Message = Database["public"]["Tables"]["messages"]["Row"]
type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"]

/**
 * Save a new message to the database
 */
export async function saveMessage(guestName: string, messageText: string): Promise<Message | null> {
  try {
    const messageData: MessageInsert = {
      guest_name: guestName,
      message: messageText,
    }

    const { data, error } = await supabase.from("messages").insert(messageData).select().single()

    if (error) {
      console.error("Error saving message:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to save message:", error)
    return null
  }
}

/**
 * Get all messages from the database, sorted by most recent first
 */
export async function getMessages(): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching messages:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return []
  }
}
