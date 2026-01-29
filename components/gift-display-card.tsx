"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sofa, ChefHat, Bed, Bath, Sparkles, Package } from "lucide-react"
import type { Gift } from "@/lib/types"

const categoryConfig = {
  "Sala": { icon: Sofa, color: "bg-blue-100 text-blue-700 border-blue-200" },
  "Cozinha": { icon: ChefHat, color: "bg-orange-100 text-orange-700 border-orange-200" },
  "Quarto": { icon: Bed, color: "bg-purple-100 text-purple-700 border-purple-200" },
  "Banheiro": { icon: Bath, color: "bg-teal-100 text-teal-700 border-teal-200" },
  "Limpeza": { icon: Sparkles, color: "bg-red-100 text-red-700 border-red-200" },
  "Outros": { icon: Package, color: "bg-gray-100 text-gray-700 border-gray-200" },
}

interface GiftDisplayCardProps {
  gift: Gift
  actions?: React.ReactNode
  imageComponent?: React.ReactNode
  showPrice?: boolean
}

export function GiftDisplayCard({ gift, actions, imageComponent, showPrice = true }: GiftDisplayCardProps) {
  const config = categoryConfig[gift.category as keyof typeof categoryConfig]
  const Icon = config?.icon || Package

  return (
    <Card className="overflow-hidden p-0">
      <div className="relative h-58 sm:h-100 bg-muted overflow-hidden">
        {imageComponent || (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gift.image}
            alt={gift.name}
            className="w-full h-full object-cover"
          />
        )}
        <Badge 
          className={`absolute top-2 right-2 text-xs font-semibold flex items-center gap-1 ${config.color} border shadow-sm`}
        >
          <Icon className="h-3 w-3" />
          {gift.category}
        </Badge>
      </div>
      <div className="p-3 sm:p-4 space-y-3">
        <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-1">{gift.name}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{gift.description}</p>
        
        {showPrice && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm sm:text-lg font-bold">
              R$ {gift.price?.toFixed(2)}
            </span>
            {actions && <div className="flex gap-1 sm:gap-2">{actions}</div>}
          </div>
        )}
        
        {!showPrice && actions && (
          <div className="flex gap-1 sm:gap-2">{actions}</div>
        )}
      </div>
    </Card>
  )
}
