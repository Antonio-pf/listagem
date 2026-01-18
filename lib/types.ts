export interface Gift {
  id: string
  name: string
  description: string
  image: string
  category: string
  reserved: boolean
  reservedBy?: {
    userName: string
    hasCompanion: boolean
    reservedAt: string
  }
  isOpenValue?: boolean 
}

export interface Reservation {
  giftId: string
  userName: string
  hasCompanion: boolean
  reservedAt: string
}
