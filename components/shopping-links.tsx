'use client'

import { useState } from 'react'
import { ExternalLink, ShoppingBag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ShoppingLink } from '@/lib/types'

interface ShoppingLinksProps {
  giftId: string
  giftName: string
  giftDescription: string
  links?: ShoppingLink[]
  onLinksGenerated?: (links: ShoppingLink[]) => void
}

const storeConfig = {
  'mercado-livre': {
    name: 'Mercado Livre',
    icon: '🛒',
    color: 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30'
  },
  'amazon': {
    name: 'Amazon',
    icon: '📦',
    color: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30'
  },
  'magalu': {
    name: 'Magazine Luiza',
    icon: '🏪',
    color: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30'
  }
}

export function ShoppingLinks({ 
  giftId, 
  giftName, 
  giftDescription,
  links, 
  onLinksGenerated 
}: ShoppingLinksProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedLinks, setGeneratedLinks] = useState<ShoppingLink[]>(links || [])

  const handleGenerateLinks = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch(`/api/gifts/${giftId}/shopping-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productName: giftName,
          description: giftDescription
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate shopping links')
      }

      if (data.success && data.links) {
        setGeneratedLinks(data.links)
        onLinksGenerated?.(data.links)
      }

    } catch (err) {
      console.error('Error generating shopping links:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate shopping links')
    } finally {
      setIsGenerating(false)
    }
  }

  if (generatedLinks.length === 0) {
    return (
      <div className="mt-4 p-4 bg-secondary/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            Sugestões de compra
          </p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Encontre este presente nas principais lojas online
        </p>
        
        {error && (
          <div className="mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
            {error}
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateLinks}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Buscando sugestões...
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Buscar Links de Compra
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          Onde comprar:
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGenerateLinks}
          disabled={isGenerating}
          className="text-xs h-7"
        >
          {isGenerating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            'Atualizar'
          )}
        </Button>
      </div>

      {error && (
        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        {generatedLinks.map((link) => {
          const config = storeConfig[link.store as keyof typeof storeConfig]
          
          if (!config) return null
          
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${config.color}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <p className="text-sm font-medium">{config.name}</p>
                  {link.price && (
                    <p className="text-xs text-muted-foreground">
                      R$ {link.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          )
        })}
      </div>

      {generatedLinks.length > 0 && (
        <p className="text-xs text-muted-foreground text-center pt-1">
          Links gerados automaticamente
        </p>
      )}
    </div>
  )
}
