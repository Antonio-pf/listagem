"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GiftCard } from "@/components/gift-card"
import { GiftCardSkeleton } from "@/components/skeletons/gift-card-skeleton"
import { Badge } from "@/components/ui/badge"
import type { Gift } from "@/lib/types"
import { staggerContainerVariants, staggerItemVariants, badgeVariants } from "@/lib/animation-variants"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Heart } from "lucide-react"
import { generatePixPayload } from "@/lib/pix-generator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { LoginModal } from "@/components/login-modal"
import { MessageReminderDialog } from "@/components/message-reminder-dialog"
import { saveReservation, getReservations, removeReservation, canCancelReservation } from "@/lib/services/reservation-service"
import { getGifts } from "@/lib/services/gift-service"
import { supabase } from "@/lib/supabase"
import { CategoryFilter } from "@/components/category-filter"

const categories = ["Todos", "Sala", "Cozinha", "Quarto", "Banheiro", "Limpeza", "Outros"]

interface GiftListProps {
  onNavigateToMessages?: () => void
}

export function GiftList({ onNavigateToMessages }: GiftListProps = {}) {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [reservedGifts, setReservedGifts] = useState<Set<string>>(new Set())
  const [pixDialogOpen, setPixDialogOpen] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [messageReminderOpen, setMessageReminderOpen] = useState(false)
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [copiedPixCode, setCopiedPixCode] = useState(false)
  const [reservationsMap, setReservationsMap] = useState<Map<string, any>>(new Map())
  const [reservingGiftIds, setReservingGiftIds] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  const loadGifts = async () => {
    const data = await getGifts()
    setGifts(data)
    return data
  }

  const loadReservations = async (giftsData: Gift[]) => {
    const reservations = await getReservations()
    
    // Only mark non-open-value gifts as reserved
    const reservedIds = new Set(
      reservations
        .filter(r => {
          const gift = giftsData.find(g => g.id === r.giftId)
          return gift && !gift.isOpenValue
        })
        .map(r => r.giftId)
    )
    
    const reservationsById = new Map(reservations.map(r => [r.giftId, r]))
    setReservedGifts(reservedIds)
    setReservationsMap(reservationsById)
  }

  const loadAllData = async () => {
    setLoading(true)
    try {
      // Load gifts and reservations in parallel
      const giftsData = await loadGifts()
      await loadReservations(giftsData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()

    const giftsSubscription = supabase
      .channel("gifts-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "gifts" }, () => {
        // Reload gifts when any change occurs
        loadGifts()
      })
      .subscribe()

    const reservationsSubscription = supabase
      .channel("reservations-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, async () => {
        // Reload reservations when any change occurs (use current gifts state)
        await loadReservations(gifts)
      })
      .subscribe()

    return () => {
      giftsSubscription.unsubscribe()
      reservationsSubscription.unsubscribe()
    }
  }, [])

  const filteredGifts = gifts.filter((gift) => selectedCategory === "Todos" || gift.category === selectedCategory)

  const handleReserve = async (giftId: string, method: "gift" | "pix") => {
    if (!isAuthenticated || !user) {
      setLoginDialogOpen(true)
      return
    }

    const gift = gifts.find((g) => g.id === giftId)

    if (method === "pix") {
      setSelectedGift(gift || null)
      // Pre-populate with gift price if available
      if (gift?.price) {
        setCustomAmount(gift.price.toString())
      }
      setPixDialogOpen(true)
    } else {
      // Check if already reserved before attempting
      const currentGifts = await getGifts()
      await loadReservations(currentGifts)
      
      if (reservedGifts.has(giftId)) {
        toast({
          title: "Ops! Este presente acabou de ser reservado",
          description: "Outra pessoa reservou este item enquanto você estava escolhendo. Tente outro presente!",
          variant: "destructive",
        })
        return
      }

      // Set loading state for this specific gift
      setReservingGiftIds(prev => new Set(prev).add(giftId))

      try {
        // Save reservation with user info (physical gift)
        const result = await saveReservation(giftId, user.id, user.name, user.hasCompanion, 'physical')

        if (result.success) {
          const currentGifts = await getGifts()
          await loadReservations(currentGifts)
          toast({
            title: `Obrigado! ${gift?.name} reservado ❤️`,
            description: "Lembre-se de levar o presente no dia do evento. Sua generosidade significa muito para nós!",
            duration: 7000,
          })
        } else {
          const currentGifts = await getGifts()
          await loadReservations(currentGifts)
          
          toast({
            title: "Não foi possível reservar",
            description: result.error || "Este presente pode ter sido reservado por outra pessoa. Tente outro!",
            variant: "destructive",
          })
        }
      } finally {
        setReservingGiftIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(giftId)
          return newSet
        })
      }
    }
  }

  const handleCancelReservation = async (giftId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado.",
        variant: "destructive",
      })
      return
    }

    const canCancel = await canCancelReservation(giftId, user.id)
    if (!canCancel) {
      toast({
        title: "Erro",
        description: "Você só pode cancelar suas próprias reservas.",
        variant: "destructive",
      })
      return
    }

    const gift = gifts.find((g) => g.id === giftId)
    const result = await removeReservation(giftId, user.id)
    
    if (result.success) {
      const currentGifts = await getGifts()
      await loadReservations(currentGifts)
      toast({
        title: "Reserva cancelada",
        description: `${gift?.name} está disponível novamente.`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Erro",
        description: result.error || "Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText("mirian_sdf@hotmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyPixCode = () => {
    const amount = Number.parseFloat(customAmount) || 0
    if (amount <= 0) {
      alert("Por favor, insira um valor válido")
      return
    }

    const pixCode = generatePixPayload("mirian_sdf@hotmail.com", amount, "Casa Nova", "Sao Paulo")

    navigator.clipboard.writeText(pixCode)
    setCopiedPixCode(true)
    setTimeout(() => setCopiedPixCode(false), 2000)
  }

  const handleConfirmPix = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para contribuir.",
        variant: "destructive",
      })
      return
    }

    if (selectedGift) {
      // Save reservation with user info (PIX contribution)
      const amount = Number.parseFloat(customAmount) || 0
      const giftPrice = selectedGift.price || amount
      const result = await saveReservation(selectedGift.id, user.id, user.name, user.hasCompanion, 'pix', giftPrice)

      if (result.success) {
        const currentGifts = await getGifts()
        await loadReservations(currentGifts)
        toast({
          title: "Obrigado pela contribuição via PIX! ❤️",
          description: `Confirmamos sua contribuição de R$ ${customAmount}. Sua generosidade significa muito para nós!`,
          duration: 7000,
        })
      } else {
        // Check if it's a duplicate reservation error
        if (result.error?.includes("já foi reservado")) {
          const currentGifts = await getGifts()
          await loadReservations(currentGifts) // Refresh to show updated state
        }
        toast({
          title: "Não foi possível confirmar",
          description: result.error || "Esta contribuição pode ter sido feita por outra pessoa.",
          variant: "destructive",
        })
      }
    }
    setPixDialogOpen(false)
    setSelectedGift(null)
    setCustomAmount("")
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-balance text-foreground">
          Escolha um Presente
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
          Cada item foi escolhido com carinho para tornar nossa nova casa ainda mais especial. Sua contribuição
          significa muito para nós!
        </p>
      </div>

      <motion.div 
        className="flex flex-wrap items-center justify-center gap-2"
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
      >
        <CategoryFilter
          categories={categories.filter(c => c !== "Todos")}
          selectedCategory={selectedCategory === "Todos" ? null : selectedCategory}
          categoryCounts={categories.filter(c => c !== "Todos").reduce((acc, cat) => {
            acc[cat] = gifts.filter(g => g.category === cat).length
            return acc
          }, {} as Record<string, number>)}
          totalCount={gifts.length}
          onSelectCategory={(category) => setSelectedCategory(category || "Todos")}
          showLabel={false}
        />
      </motion.div>

      {loading ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={`skeleton-${i}`} variants={staggerItemVariants}>
              <GiftCardSkeleton />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredGifts.map((gift, index) => {
          const reservation = reservationsMap.get(gift.id)
          
          return (
            <motion.div
              key={gift.id}
              variants={staggerItemVariants}
              layout
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            >
              <GiftCard
              gift={{
                ...gift,
                reserved: reservedGifts.has(gift.id),
                reservedBy: reservation ? {
                  userName: reservation.userName,
                  hasCompanion: reservation.hasCompanion,
                  reservedAt: reservation.reservedAt,
                  contributionType: reservation.contributionType,
                } : undefined,
              }}
              isReserved={reservedGifts.has(gift.id)}
              currentUser={user?.name}
              isReserving={reservingGiftIds.has(gift.id)}
              onReserve={handleReserve}
              onCancelReservation={handleCancelReservation}
              />
            </motion.div>
            )
          })}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filteredGifts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Nenhum item encontrado nesta categoria.</p>
        </div>
      )}

      <Dialog open={pixDialogOpen} onOpenChange={setPixDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/60">
          <DialogHeader>
            <DialogTitle className="font-serif flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-accent" fill="currentColor" />
              Contribuir via PIX
            </DialogTitle>
            <DialogDescription>
              {selectedGift?.isOpenValue 
                ? "Qualquer valor é bem-vindo! Sugerimos contribuições a partir de R$ 50,00 ❤️"
                : `Valor estimado: R$ ${selectedGift?.price?.toFixed(2) || '0,00'}`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                {selectedGift?.isOpenValue ? "Valor da Contribuição (R$)" : "Valor a Contribuir (R$)"}
              </Label>
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="0,00"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="bg-background/50"
              />
              {selectedGift?.price && !selectedGift.isOpenValue && (
                <p className="text-xs text-muted-foreground">
                  Valor sugerido: R$ {selectedGift.price.toFixed(2)} (você pode ajustar se preferir)
                </p>
              )}
              {selectedGift?.isOpenValue && (
                <p className="text-xs text-muted-foreground">
                  💝 Sugerimos contribuições a partir de R$ 50,00, mas qualquer valor será muito apreciado!
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Chave PIX</Label>
              <div className="flex items-center gap-2">
                <Input readOnly value="mirian_sdf@hotmail.com" className="font-mono text-sm bg-background/50" />
                <Button size="icon" variant="outline" onClick={handleCopyPix} className="shrink-0 bg-transparent">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Clique no botão para copiar a chave PIX</p>
            </div>

            <div className="space-y-2">
              <Label>PIX Copia e Cola</Label>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleCopyPixCode}
                disabled={!customAmount || Number.parseFloat(customAmount) <= 0}
              >
                {copiedPixCode ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Código Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Gerar e Copiar Código PIX
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Cole o código no seu app bancário para pagar com um clique
              </p>
            </div>

            <div className="rounded-lg bg-secondary/30 border border-border/50 p-4 space-y-2">
              <h4 className="font-medium text-sm text-foreground">Como funciona?</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Defina o valor da contribuição</li>
                <li>Clique em "Gerar e Copiar Código PIX"</li>
                <li>Abra seu aplicativo bancário</li>
                <li>Cole o código PIX ou use a chave manualmente</li>
                <li>Confirme a transferência</li>
                <li>Clique em "Confirmar Envio"</li>
              </ol>
            </div>

            <Button onClick={handleConfirmPix} className="w-full gap-2">
              <Heart className="h-4 w-4" />
              Confirmar Envio
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LoginModal open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      
      <MessageReminderDialog 
        open={messageReminderOpen} 
        onOpenChange={setMessageReminderOpen}
        onGoToMessages={() => {
          // Navigate to messages section
          if (onNavigateToMessages) {
            onNavigateToMessages()
          }
        }}
      />
    </div>
  )
}
