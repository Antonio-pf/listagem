"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "./supabase"

// Normalize name for comparison (remove accents, lowercase, trim)
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
}

export interface User {
  id: string
  name: string
  hasCompanion: boolean
  hasConfirmedAttendance: boolean
  willAttend: boolean | null
}

export interface AuthContextType {
  user: User | null
  login: (name: string, hasCompanion: boolean) => Promise<void>
  logout: () => void
  refreshAttendanceStatus: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const GUEST_ID_KEY = "gift-list-guest-id"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from Supabase on mount
    const loadUser = async () => {
      const guestId = localStorage.getItem(GUEST_ID_KEY)
      if (guestId) {
        try {
          const { data, error } = await supabase
            .from("guests")
            .select("*")
            .eq("id", guestId)
            .single() as { data: any; error: any }

          if (data && !error) {
            // Check attendance status
            const { data: attendanceData } = await supabase
              .from("event_attendance")
              .select("will_attend")
              .eq("guest_id", guestId)
              .maybeSingle() as { data: any }

            setUser({
              id: data.id,
              name: data.name,
              hasCompanion: data.has_companion,
              hasConfirmedAttendance: !!attendanceData,
              willAttend: attendanceData?.will_attend ?? null,
            })
          } else {
            // Guest not found, clear localStorage
            localStorage.removeItem(GUEST_ID_KEY)
          }
        } catch (error) {
          console.error("Error loading user:", error)
          localStorage.removeItem(GUEST_ID_KEY)
        }
      }
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = async (name: string, hasCompanion: boolean) => {
    try {
      const normalizedName = normalizeName(name)
      
      // Check if guest already exists by normalized name
      const { data: existingGuest } = await supabase
        .from("guests")
        .select("*")
        .eq("normalized_name", normalizedName)
        .eq("has_companion", hasCompanion)
        .maybeSingle() as { data: any }

      let guestData

      if (existingGuest) {
        // Use existing guest
        guestData = existingGuest
      } else {
        // Create new guest
        const { data, error } = await supabase
          .from("guests")
          .insert({
            name,
            normalized_name: normalizedName,
            has_companion: hasCompanion,
          } as any)
          .select()
          .single() as { data: any; error: any }

        if (error) throw error
        guestData = data
      }

      // Check attendance status
      const { data: attendanceData } = await supabase
        .from("event_attendance")
        .select("will_attend")
        .eq("guest_id", guestData.id)
        .maybeSingle() as { data: any }

      const userData: User = {
        id: guestData.id,
        name: guestData.name,
        hasCompanion: guestData.has_companion,
        hasConfirmedAttendance: !!attendanceData,
        willAttend: attendanceData?.will_attend ?? null,
      }

      setUser(userData)
      localStorage.setItem(GUEST_ID_KEY, guestData.id)
    } catch (error) {
      console.error("Error logging in:", error)
      throw error
    }
  }

  const refreshAttendanceStatus = async () => {
    if (!user) return

    try {
      const { data: attendanceData } = await supabase
        .from("event_attendance")
        .select("will_attend")
        .eq("guest_id", user.id)
        .maybeSingle() as { data: any }

      setUser({
        ...user,
        hasConfirmedAttendance: !!attendanceData,
        willAttend: attendanceData?.will_attend ?? null,
      })
    } catch (error) {
      console.error("Error refreshing attendance status:", error)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(GUEST_ID_KEY)
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    refreshAttendanceStatus,
    isAuthenticated: !!user,
    isLoading,
  }

  if (isLoading) {
    return null // or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
