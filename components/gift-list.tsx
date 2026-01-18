"use client"

import { useState, useEffect } from "react"
import { GiftCard } from "@/components/gift-card"
import { Badge } from "@/components/ui/badge"
import type { Gift } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Heart } from "lucide-react"
import { generatePixPayload } from "@/lib/pix-generator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { LoginModal } from "@/components/login-modal"
import { saveReservation, getReservations, removeReservation, canCancelReservation } from "@/lib/reservation-storage"
import { supabase } from "@/lib/supabase"

const gifts: Gift[] = [
  {
    id: "1",
    name: "Sofá Retrátil",
    description: "Sofá confortável de 3 lugares com chaise retrátil",
    image: "/modern-grey-sofa.jpg",
    category: "Sala",
    price: 2500,
    reserved: false,
  },
  {
    id: "2",
    name: "Jogo de Panelas",
    description: "Conjunto completo de panelas antiaderentes",
    image: "/cookware-set.png",
    category: "Cozinha",
    price: 450,
    reserved: false,
  },
  {
    id: "3",
    name: 'Smart TV 55"',
    description: "Smart TV LED 4K com sistema operacional atualizado",
    image: "/smart-tv-screen.jpg",
    category: "Eletrônicos",
    price: 2800,
    reserved: true,
  },
  {
    id: "4",
    name: "Jogo de Cama Casal",
    description: "Jogo de lençol 300 fios com fronhas",
    image: "/bed-sheets-white.jpg",
    category: "Quarto",
    price: 350,
    reserved: false,
  },
  {
    id: "5",
    name: "Cafeteira Expresso",
    description: "Máquina de café expresso automática",
    image: "/professional-espresso-setup.png",
    category: "Cozinha",
    price: 1200,
    reserved: false,
  },
  {
    id: "6",
    name: "Mesa de Jantar",
    description: "Mesa extensível para 6 pessoas em madeira",
    image: "/wooden-dining-table.png",
    category: "Sala",
    price: 1800,
    reserved: false,
  },
  {
    id: "7",
    name: "Aspirador Robô",
    description: "Aspirador inteligente com mapeamento e Wi-Fi",
    image: "/robot-vacuum.jpg",
    category: "Eletrônicos",
    price: 1500,
    reserved: false,
  },
  {
    id: "8",
    name: "Kit Toalhas de Banho",
    description: "Conjunto de 6 toalhas 100% algodão",
    image: "/fluffy-bath-towels.png",
    category: "Banheiro",
    price: 280,
    reserved: false,
  },
  {
    id: "9",
    name: "Air Fryer",
    description: "Fritadeira elétrica sem óleo 5L",
    image: "/air-fryer-appliance.jpg",
    category: "Cozinha",
    price: 650,
    reserved: true,
  },
  {
    id: "10",
    name: "Contribuição Livre",
    description: "Contribua com o valor que desejar para nos ajudar a mobiliar nossa casa nova",
    image: "/gift-box-open-present.jpg",
    category: "Outros",
    reserved: false,
    isOpenValue: true,
  },
]

const categories = ["Todos", "Sala", "Cozinha", "Quarto", "Eletrônicos", "Banheiro", "Outros"]

export function GiftList() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [reservedGifts, setReservedGifts] = useState<Set<string>>(new Set())
  const [pixDialogOpen, setPixDialogOpen] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
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
    // Load reservations from Supabase
    loadReservations()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("reservations-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, () => {
        // Reload reservations when any change occurs
        loadReservations()
      })
      .subscribe()

    // Cleanup subscription on unmount
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

      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "border-border/80 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map((gift) => {
          const reservation = reservationsMap.get(gift.id)
          
          return (
            <GiftCard
              key={gift.id}
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
          )
        })}
      </div>

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
    </div>
  )
}
