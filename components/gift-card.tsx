"use client"

import type { Gift } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, GiftIcon, X, Heart } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { cardHoverVariants } from "@/lib/animation-variants"

interface GiftCardProps {
  gift: Gift
  isReserved: boolean
  currentUser?: string
  isReserving?: boolean
  onReserve: (id: string, method: "gift" | "pix") => void
  onCancelReservation: (id: string) => void
}

export function GiftCard({ gift, isReserved, currentUser, isReserving, onReserve, onCancelReservation }: GiftCardProps) {
  const handleReserveGift = () => {
    if (!isReserved && !isReserving) {
      onReserve(gift.id, "gift")
    }
  }

  const handleReservePix = () => {
    if (!isReserved && !isReserving) {
      onReserve(gift.id, "pix")
    }
  }

  const handleCancelReservation = () => {
    onCancelReservation(gift.id)
  }

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="group overflow-hidden transition-all hover:shadow-lg border-border/60 bg-card/80">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={gift.image || "/placeholder.svg"}
          alt={gift.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isReserved && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent border border-accent/30">
                <Check className="h-8 w-8 text-accent-foreground" />
              </div>
              <Badge variant="secondary" className="text-sm bg-secondary/80 text-secondary-foreground">
                Reservado
              </Badge>
              {gift.reservedBy && (
                <p className="text-xs text-muted-foreground bg-background/60 px-2 py-1 rounded">
                  {gift.reservedBy.userName === currentUser 
                    ? "Reservado por você" 
                    : "Reservado por outra pessoa"}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl leading-tight text-balance font-serif text-foreground">{gift.name}</CardTitle>
          <Badge variant="outline" className="shrink-0 border-border/80 text-muted-foreground">
            {gift.category}
          </Badge>
        </div>
        <CardDescription className="leading-relaxed text-pretty">{gift.description}</CardDescription>
      </CardHeader>

      {gift.isOpenValue && (
        <CardContent>
          <div className="flex items-center gap-2 text-lg font-medium text-accent">
            <Heart className="h-5 w-5" fill="currentColor" />
            Valor livre
          </div>
        </CardContent>
      )}

      <CardFooter className="flex flex-col gap-2">
        {isReserved ? (
          <>
            {gift.reservedBy?.userName === currentUser && (
              <Button className="w-full gap-2" onClick={handleCancelReservation} variant="destructive">
                <X className="h-4 w-4" />
                Cancelar Reserva
              </Button>
            )}
          </>
        ) : (
          <>
            {gift.isOpenValue ? (
              <Button 
                className="w-full gap-2" 
                onClick={handleReservePix} 
                variant="default"
                disabled={isReserving}
              >
                {isReserving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Reservando...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7.05 2.05L3.05 6.05C2.65 6.45 2.65 7.1 3.05 7.5L7.05 11.5C7.45 11.9 8.1 11.9 8.5 11.5C8.9 11.1 8.9 10.45 8.5 10.05L6.45 8H15C15.55 8 16 7.55 16 7C16 6.45 15.55 6 15 6H6.45L8.5 3.95C8.9 3.55 8.9 2.9 8.5 2.5C8.1 2.1 7.45 2.1 7.05 2.05Z"
                        fill="currentColor"
                      />
                      <path
                        d="M16.95 12.5L20.95 16.5C21.35 16.9 21.35 17.55 20.95 17.95L16.95 21.95C16.55 22.35 15.9 22.35 15.5 21.95C15.1 21.55 15.1 20.9 15.5 20.5L17.55 18.45H9C8.45 18.45 8 18 8 17.45C8 16.9 8.45 16.45 9 16.45H17.55L15.5 14.4C15.1 14 15.1 13.35 15.5 12.95C15.9 12.55 16.55 12.55 16.95 12.5Z"
                        fill="currentColor"
                      />
                    </svg>
                    Contribuir via PIX
                  </>
                )}
              </Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Button 
                  className="flex-1 gap-2" 
                  onClick={handleReserveGift} 
                  variant="default"
                  disabled={isReserving}
                >
                  {isReserving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Reservando...
                    </>
                  ) : (
                    <>
                      <GiftIcon className="h-4 w-4" />
                      Presentear
                    </>
                  )}
                </Button>
                <Button 
                  className="flex-1 gap-2" 
                  onClick={handleReservePix} 
                  variant="outline"
                  disabled={isReserving}
                >
                  {isReserving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7.05 2.05L3.05 6.05C2.65 6.45 2.65 7.1 3.05 7.5L7.05 11.5C7.45 11.9 8.1 11.9 8.5 11.5C8.9 11.1 8.9 10.45 8.5 10.05L6.45 8H15C15.55 8 16 7.55 16 7C16 6.45 15.55 6 15 6H6.45L8.5 3.95C8.9 3.55 8.9 2.9 8.5 2.5C8.1 2.1 7.45 2.1 7.05 2.05Z"
                          fill="currentColor"
                        />
                        <path
                          d="M16.95 12.5L20.95 16.5C21.35 16.9 21.35 17.55 20.95 17.95L16.95 21.95C16.55 22.35 15.9 22.35 15.5 21.95C15.1 21.55 15.1 20.9 15.5 20.5L17.55 18.45H9C8.45 18.45 8 18 8 17.45C8 16.9 8.45 16.45 9 16.45H17.55L15.5 14.4C15.1 14 15.1 13.35 15.5 12.95C15.9 12.55 16.55 12.55 16.95 12.5Z"
                          fill="currentColor"
                        />
                      </svg>
                      PIX
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </CardFooter>
    </Card>
    </motion.div>
  )
}
