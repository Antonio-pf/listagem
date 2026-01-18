export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      guests: {
        Row: {
          id: string
          name: string
          has_companion: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          has_companion?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          has_companion?: boolean
          created_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          gift_id: string
          guest_id: string
          guest_name: string
          has_companion: boolean
          reserved_at: string
        }
        Insert: {
          id?: string
          gift_id: string
          guest_id: string
          guest_name: string
          has_companion?: boolean
          reserved_at?: string
        }
        Update: {
          id?: string
          gift_id?: string
          guest_id?: string
          guest_name?: string
          has_companion?: boolean
          reserved_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
