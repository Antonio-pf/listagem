"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GiftCard } from "@/components/gift-card"
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
import { saveReservation, getReservations, removeReservation, canCancelReservation } from "@/lib/reservation-storage"
import { supabase } from "@/lib/supabase"

const gifts: Gift[] = [
  {
    id: "1",
    name: "Liquidificador",
    description: "Liquidificador potente para preparar vitaminas e receitas",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 250,
    reserved: false,
  },
  {
    id: "2",
    name: "Kit Talher",
    description: "Conjunto completo de talheres para 6 pessoas",
    image: "https://images.unsplash.com/photo-1606787620819-8bdf0c44c293?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 180,
    reserved: false,
  },
  {
    id: "3",
    name: "Kit Utensílios Cozinha",
    description: "Conjunto de utensílios essenciais para cozinha",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 150,
    reserved: false,
  },
  {
    id: "4",
    name: "Cesto de Roupa",
    description: "Cesto organizador para roupas sujas",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&h=600&fit=crop",
    category: "Quarto",
    price: 80,
    reserved: false,
  },
  {
    id: "5",
    name: "Cesto de Lixo",
    description: "Lixeira moderna com tampa e pedal",
    image: "https://images.unsplash.com/photo-1625225233840-695456021cde?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 120,
    reserved: false,
  },
  {
    id: "6",
    name: "Kit Toalhas",
    description: "Conjunto de 6 toalhas de banho macias",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&h=600&fit=crop",
    category: "Banheiro",
    price: 200,
    reserved: false,
  },
  {
    id: "7",
    name: "Panela de Arroz Elétrica",
    description: "Panela elétrica automática para arroz perfeito",
    image: "https://images.unsplash.com/photo-1584990347449-39b9e5d87ddf?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 280,
    reserved: false,
  },
  {
    id: "8",
    name: "Toalha de Mesa Redonda",
    description: "Toalha de mesa elegante para ocasiões especiais",
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&h=600&fit=crop",
    category: "Sala",
    price: 90,
    reserved: false,
  },
  {
    id: "9",
    name: "Jogo de Lençol Casal",
    description: "Jogo de lençol 100% algodão para casal",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
    category: "Quarto",
    price: 220,
    reserved: false,
  },
  {
    id: "10",
    name: "Forma Retangular",
    description: "Forma retangular para assados e bolos",
    image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 60,
    reserved: false,
  },
  {
    id: "11",
    name: "Almofadas",
    description: "Kit com 4 almofadas decorativas",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=600&fit=crop",
    category: "Sala",
    price: 120,
    reserved: false,
  },
  {
    id: "12",
    name: "Abridor de Lata",
    description: "Abridor de lata manual de qualidade",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 25,
    reserved: false,
  },
  {
    id: "13",
    name: "Aspirador de Pó",
    description: "Aspirador de pó potente e silencioso",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&h=600&fit=crop",
    category: "Limpeza",
    price: 450,
    reserved: false,
  },
  {
    id: "14",
    name: "Jarra de Suco",
    description: "Jarra de vidro com tampa para sucos",
    image: "https://images.unsplash.com/photo-1544145945-35c4e5d68d8c?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 45,
    reserved: false,
  },
  {
    id: "15",
    name: "Kit de Potes Vidro",
    description: "Conjunto de potes de vidro para armazenamento",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 150,
    reserved: false,
  },
  {
    id: "16",
    name: "Luminária",
    description: "Luminária moderna de mesa ou chão",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop",
    category: "Sala",
    price: 180,
    reserved: false,
  },
  {
    id: "17",
    name: "Rodo Alumínio",
    description: "Rodo de alumínio durável para limpeza",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=600&fit=crop",
    category: "Limpeza",
    price: 40,
    reserved: false,
  },
  {
    id: "18",
    name: "Mop",
    description: "Mop giratório com balde para limpeza fácil",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&h=600&fit=crop",
    category: "Limpeza",
    price: 130,
    reserved: false,
  },
  {
    id: "19",
    name: "Pipoqueira",
    description: "Pipoqueira elétrica para pipoca caseira",
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 95,
    reserved: false,
  },
  {
    id: "20",
    name: "Kit Assadeira Pizza",
    description: "Conjunto de assadeiras para pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 85,
    reserved: false,
  },
  {
    id: "21",
    name: "Kit Taças Sobremesa",
    description: "Conjunto de taças elegantes para sobremesa",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 110,
    reserved: false,
  },
  {
    id: "22",
    name: "Jogo de Piso para Banheiro",
    description: "Conjunto de tapetes antiderrapantes para banheiro",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop",
    category: "Banheiro",
    price: 75,
    reserved: false,
  },
  {
    id: "23",
    name: "Kit Faca",
    description: "Conjunto completo de facas profissionais para cozinha",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 320,
    reserved: false,
  },
  {
    id: "24",
    name: "Kit Churrasco",
    description: "Conjunto completo de utensílios para churrasco",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 280,
    reserved: false,
  },
  {
    id: "25",
    name: "Kit Passadeira Cozinha",
    description: "Conjunto de utensílios para passar e organizar a cozinha",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
    category: "Cozinha",
    price: 190,
    reserved: false,
  },
  {
    id: "26",
    name: "Umidificador de Ar",
    description: "Umidificador de ar ultrassônico para ambientes",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop",
    category: "Quarto",
    price: 220,
    reserved: false,
  },
  {
    id: "27",
    name: "Contribuição Livre",
    description: "Contribua com o valor que desejar para nos ajudar a mobiliar nossa casa nova",
    image: "/gift-box-open-present.jpg",
    category: "Outros",
    reserved: false,
    isOpenValue: true,
  },
]

const categories = ["Todos", "Sala", "Cozinha", "Quarto", "Banheiro", "Limpeza", "Outros"]

interface GiftListProps {
  onNavigateToMessages?: () => void
}

export function GiftList({ onNavigateToMessages }: GiftListProps = {}) {
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

  const loadReservations = async () => {
    const reservations = await getReservations()
    const reservedIds = new Set(reservations.map(r => r.giftId))
    const reservationsById = new Map(reservations.map(r => [r.giftId, r]))
    setReservedGifts(reservedIds)
    setReservationsMap(reservationsById)
  }

  useEffect(() => {
    loadReservations()

    const subscription = supabase
      .channel("reservations-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, () => {
        // Reload reservations when any change occurs
        loadReservations()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
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
      await loadReservations()
      
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
          await loadReservations()
          toast({
            title: `Obrigado! ${gift?.name} reservado ❤️`,
            description: "Lembre-se de levar o presente no dia do evento. Sua generosidade significa muito para nós!",
            duration: 7000,
          })
          // Show message reminder dialog after successful reservation
          setTimeout(() => setMessageReminderOpen(true), 1500)
        } else {
          // Always refresh to show current state
          await loadReservations()
          
          toast({
            title: "Não foi possível reservar",
            description: result.error || "Este presente pode ter sido reservado por outra pessoa. Tente outro!",
            variant: "destructive",
          })
        }
      } finally {
        // Remove loading state
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
      await loadReservations()
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
    navigator.clipboard.writeText("seuemail@exemplo.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyPixCode = () => {
    const amount = Number.parseFloat(customAmount) || 0
    if (amount <= 0) {
      alert("Por favor, insira um valor válido")
      return
    }

    const pixCode = generatePixPayload("seuemail@exemplo.com", amount, "Casa Nova", "Sao Paulo")

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
        await loadReservations()
        toast({
          title: "Obrigado pela contribuição via PIX! ❤️",
          description: `Confirmamos sua contribuição de R$ ${customAmount}. Sua generosidade significa muito para nós!`,
          duration: 7000,
        })
        // Show message reminder dialog after successful PIX contribution
        setTimeout(() => setMessageReminderOpen(true), 1500)
      } else {
        // Check if it's a duplicate reservation error
        if (result.error?.includes("já foi reservado")) {
          await loadReservations() // Refresh to show updated state
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
        {categories.map((category) => (
          <motion.div key={category} variants={staggerItemVariants}>
            <motion.div
              variants={badgeVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Badge
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border-border/80 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

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

      {filteredGifts.length === 0 && (
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
                ? "Defina o valor que deseja contribuir e envie via PIX"
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
            </div>

            <div className="space-y-2">
              <Label>Chave PIX</Label>
              <div className="flex items-center gap-2">
                <Input readOnly value="seuemail@exemplo.com" className="font-mono text-sm bg-background/50" />
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
