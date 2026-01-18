export interface Gift {
  id: string
  name: string
  description: string
  image: string
  category: string
  price?: number // Valor estimado do presente
  reserved: boolean
  reservedBy?: {
    userName: string
    hasCompanion: boolean
    reservedAt: string
    contributionType: 'physical' | 'pix' // Tipo de contribuição
  }
  isOpenValue?: boolean 
}

export interface Reservation {
  giftId: string
  userName: string
  hasCompanion: boolean
  reservedAt: string
  contributionType: 'physical' | 'pix' // Tipo de contribuição escolhida
  giftPrice?: number // Valor estimado (para referência)
}
