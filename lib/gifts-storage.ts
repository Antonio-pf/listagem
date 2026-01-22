import { supabase } from "./supabase"
import type { Gift } from "./types"

export interface GiftData {
  id?: string
  name: string
  description: string
  image: string
  category: string
  price?: number
  isOpenValue?: boolean
}

/**
 * Get all gifts from database
 */
export async function getGifts(): Promise<Gift[]> {
  const { data, error } = await supabase
    .from("gifts")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching gifts:", error)
    return []
  }

  return (
    data?.map((gift) => ({
      id: gift.id,
      name: gift.name,
      description: gift.description,
      image: gift.image,
      category: gift.category,
      price: gift.price ? Number(gift.price) : undefined,
      reserved: false,
      isOpenValue: gift.is_open_value || false,
    })) || []
  )
}

/**
 * Get a single gift by ID
 */
export async function getGiftById(id: string): Promise<Gift | null> {
  const { data, error } = await supabase.from("gifts").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching gift:", error)
    return null
  }

  return data
    ? {
        id: data.id,
        name: data.name,
        description: data.description,
        image: data.image,
        category: data.category,
        price: data.price ? Number(data.price) : undefined,
        reserved: false,
        isOpenValue: data.is_open_value || false,
      }
    : null
}

/**
 * Create a new gift
 */
export async function createGift(giftData: GiftData): Promise<{ success: boolean; error?: string; gift?: Gift }> {
  const { data, error } = await supabase
    .from("gifts")
    .insert({
      id: giftData.id || crypto.randomUUID(),
      name: giftData.name,
      description: giftData.description,
      image: giftData.image,
      category: giftData.category,
      price: giftData.price,
      is_open_value: giftData.isOpenValue || false,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating gift:", error)
    return { success: false, error: error.message }
  }

  return {
    success: true,
    gift: {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image,
      category: data.category,
      price: data.price ? Number(data.price) : undefined,
      reserved: false,
      isOpenValue: data.is_open_value || false,
    },
  }
}

/**
 * Update an existing gift
 */
export async function updateGift(
  id: string,
  giftData: Partial<GiftData>
): Promise<{ success: boolean; error?: string; gift?: Gift }> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  if (giftData.name !== undefined) updateData.name = giftData.name
  if (giftData.description !== undefined) updateData.description = giftData.description
  if (giftData.image !== undefined) updateData.image = giftData.image
  if (giftData.category !== undefined) updateData.category = giftData.category
  if (giftData.price !== undefined) updateData.price = giftData.price
  if (giftData.isOpenValue !== undefined) updateData.is_open_value = giftData.isOpenValue

  const { data, error } = await supabase.from("gifts").update(updateData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating gift:", error)
    return { success: false, error: error.message }
  }

  return {
    success: true,
    gift: {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image,
      category: data.category,
      price: data.price ? Number(data.price) : undefined,
      reserved: false,
      isOpenValue: data.is_open_value || false,
    },
  }
}

/**
 * Delete a gift
 */
export async function deleteGift(id: string): Promise<{ success: boolean; error?: string }> {
  // First check if gift has reservations
  const { data: reservations } = await supabase.from("reservations").select("id").eq("gift_id", id).limit(1)

  if (reservations && reservations.length > 0) {
    return {
      success: false,
      error: "Não é possível excluir um presente que já tem reservas. Cancele as reservas primeiro.",
    }
  }

  const { error } = await supabase.from("gifts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting gift:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadGiftImage(
  file: File,
  giftId: string
): Promise<{ success: boolean; error?: string; url?: string }> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${giftId}-${Date.now()}.${fileExt}`
    const filePath = `gifts/${fileName}`

    const { error: uploadError } = await supabase.storage.from("gift-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("Error uploading image:", uploadError)
      return { success: false, error: uploadError.message }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("gift-images").getPublicUrl(filePath)

    return { success: true, url: publicUrl }
  } catch (error: any) {
    console.error("Error uploading image:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteGiftImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split("/gift-images/")
    if (urlParts.length < 2) {
      return { success: false, error: "Invalid image URL" }
    }

    const filePath = `gifts/${urlParts[1]}`

    const { error } = await supabase.storage.from("gift-images").remove([filePath])

    if (error) {
      console.error("Error deleting image:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting image:", error)
    return { success: false, error: error.message }
  }
}
