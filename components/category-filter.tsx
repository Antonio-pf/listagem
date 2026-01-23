"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Package, Sofa, ChefHat, Bed, Bath, Sparkles } from "lucide-react"

const categoryConfig = {
  "Todos": { icon: Package, color: "bg-black text-white" },
  "Sala": { icon: Sofa, color: "bg-blue-100 text-blue-700 border-blue-200" },
  "Cozinha": { icon: ChefHat, color: "bg-orange-100 text-orange-700 border-orange-200" },
  "Quarto": { icon: Bed, color: "bg-purple-100 text-purple-700 border-purple-200" },
  "Banheiro": { icon: Bath, color: "bg-teal-100 text-teal-700 border-teal-200" },
  "Limpeza": { icon: Sparkles, color: "bg-red-100 text-red-700 border-red-200" },
  "Outros": { icon: Package, color: "bg-gray-100 text-gray-700 border-gray-200" },
}

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  categoryCounts: Record<string, number>
  totalCount: number
  onSelectCategory: (category: string | null) => void
  showLabel?: boolean
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  categoryCounts, 
  totalCount,
  onSelectCategory,
  showLabel = true
}: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      {showLabel && <Label className="text-xs sm:text-sm font-medium">Filtrar por categoria:</Label>}
      <div className="flex flex-wrap gap-2">
        <Badge
          className={`cursor-pointer hover:opacity-80 transition-opacity text-xs sm:text-sm px-3 py-2 flex items-center gap-1.5 font-semibold shadow-sm ${
            selectedCategory === null ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => onSelectCategory(null)}
        >
          <Package className="h-3.5 w-3.5" />
          Todas
          <span className="ml-1">{totalCount}</span>
        </Badge>
        {categories.map((cat) => {
          const count = categoryCounts[cat] || 0
          const config = categoryConfig[cat as keyof typeof categoryConfig]
          const Icon = config.icon
          return (
            <Badge
              key={cat}
              className={`cursor-pointer hover:opacity-80 transition-opacity text-xs sm:text-sm px-3 py-2 flex items-center gap-1.5 border-2 font-semibold shadow-sm ${
                selectedCategory === cat ? config.color + ' border-current' : config.color + ' opacity-60'
              }`}
              onClick={() => onSelectCategory(cat)}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat}
              <span className="ml-1">{count}</span>
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
