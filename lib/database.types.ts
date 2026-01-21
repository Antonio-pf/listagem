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
          contribution_type: 'physical' | 'pix'
          gift_price: number | null
          reserved_at: string
        }
        Insert: {
          id?: string
          gift_id: string
          guest_id: string
          guest_name: string
          has_companion?: boolean
          contribution_type?: 'physical' | 'pix'
          gift_price?: number | null
          reserved_at?: string
        }
        Update: {
          id?: string
          gift_id?: string
          guest_id?: string
          guest_name?: string
          has_companion?: boolean
          contribution_type?: 'physical' | 'pix'
          gift_price?: number | null
          reserved_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          guest_name: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          guest_name: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          guest_name?: string
          message?: string
          created_at?: string
        }
      }
      shopping_links: {
        Row: {
          id: string
          gift_id: string
          store: 'mercado-livre' | 'amazon' | 'magalu'
          url: string
          title: string
          price: number | null
          image_url: string | null
          rating: number | null
          generated_by_ai: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gift_id: string
          store: 'mercado-livre' | 'amazon' | 'magalu'
          url: string
          title: string
          price?: number | null
          image_url?: string | null
          rating?: number | null
          generated_by_ai?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gift_id?: string
          store?: 'mercado-livre' | 'amazon' | 'magalu'
          url?: string
          title?: string
          price?: number | null
          image_url?: string | null
          rating?: number | null
          generated_by_ai?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      rate_limits: {
        Row: {
          id: string
          key: string
          count: number
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          count?: number
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          count?: number
          created_at?: string
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
