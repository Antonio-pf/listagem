export interface ShoppingLink {
  id: string
  giftId: string
  store: 'mercado-livre' | 'amazon' | 'magalu'
  url: string
  title: string
  price?: number
  imageUrl?: string
  rating?: number
  generatedByAI: boolean
  createdAt: string
  updatedAt: string
}

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
  shoppingLinks?: ShoppingLink[] // AI-generated shopping links
}

export interface Reservation {
  giftId: string
  userName: string
  hasCompanion: boolean
  reservedAt: string
  contributionType: 'physical' | 'pix' // Tipo de contribuição escolhida
  giftPrice?: number // Valor estimado (para referência)
}
