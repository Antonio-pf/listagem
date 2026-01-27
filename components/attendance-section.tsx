"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, Calendar, Users, UtensilsCrossed, MessageSquare, Edit2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { scrollRevealVariants, staggerContainerVariants, staggerItemVariants } from "@/lib/animation-variants"
import { useAuth } from "@/lib/auth-context"
import { confirmAttendance, getGuestAttendance, type AttendanceConfirmation } from "@/lib/attendance-storage"
import { saveMessage } from "@/lib/message-storage"
import { toast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"

interface AttendanceSectionProps {
  onRequestLogin?: () => void
  onNavigateToSection?: (section: string) => void
}

export function AttendanceSection({ onRequestLogin, onNavigateToSection }: AttendanceSectionProps) {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation()
  const { ref: formRef, isInView: formInView } = useScrollAnimation()
  const { user } = useAuth()
  
  const [willAttend, setWillAttend] = useState<string>("yes")
  const [additionalNotes, setAdditionalNotes] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingConfirmation, setExistingConfirmation] = useState<AttendanceConfirmation | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoadingConfirmation, setIsLoadingConfirmation] = useState(true)

  useEffect(() => {
    // Reset state when user changes
    setExistingConfirmation(null)
    setIsEditing(false)
    setWillAttend("yes")
    setAdditionalNotes("")
    
    // Always call loadExistingConfirmation, it handles the no-user case
    loadExistingConfirmation()
  }, [user?.id])

  const loadExistingConfirmation = async () => {
    if (!user?.id) {
      setIsLoadingConfirmation(false)
      return
    }

    setIsLoadingConfirmation(true)
    const confirmation = await getGuestAttendance(user.id)
    if (confirmation) {
      setExistingConfirmation(confirmation)
      setWillAttend(confirmation.willAttend ? "yes" : "no")
      setAdditionalNotes(confirmation.additionalNotes || "")
    }
    setIsLoadingConfirmation(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      if (onRequestLogin) {
        onRequestLogin()
      }
      toast({
        title: "Faça login primeiro",
        description: "Por favor, identifique-se para confirmar sua presença.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await confirmAttendance(user.id, {
        willAttend: willAttend === "yes",
        companionCount: 0,
        additionalNotes: additionalNotes || undefined,
      })

      if (result.success) {
        // Save message to messages table if provided
        if (additionalNotes.trim()) {
          await saveMessage(user.name, additionalNotes.trim())
        }
        
        // Show confetti effect if attending
        if (willAttend === "yes") {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
          })
          
          // Additional confetti burst
          setTimeout(() => {
            confetti({
              particleCount: 50,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#FF6B6B', '#4ECDC4', '#45B7D1']
            })
          }, 250)
          
          setTimeout(() => {
            confetti({
              particleCount: 50,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#FFA07A', '#98D8C8', '#FF6B6B']
            })
          }, 400)
        }
        
        toast({
          title: "Confirmação enviada!",
          description: existingConfirmation 
            ? "Sua confirmação foi atualizada com sucesso." 
            : "Obrigado por confirmar sua presença!",
        })
        await loadExistingConfirmation()
        setIsEditing(false)
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao confirmar presença. Tente novamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting attendance:", error)
      toast({
        title: "Erro",
        description: "Erro ao confirmar presença. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const showForm = !isLoadingConfirmation && (!existingConfirmation || isEditing)

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        ref={headerRef}
        className="mb-8 text-center"
        variants={scrollRevealVariants}
        initial="hidden"
        animate={headerInView ? "visible" : "hidden"}
      >
        <h2 className="text-3xl font-serif font-semibold mb-3 text-foreground">Confirmar Presença</h2>
        <p className="text-muted-foreground text-pretty">
          Por favor, confirme se você poderá comparecer ao nosso chá de casa nova
        </p>
      </motion.div>

      <motion.div
        ref={formRef}
        variants={staggerContainerVariants}
        initial="hidden"
        animate={formInView ? "visible" : "hidden"}
        className="space-y-6"
      >
        {isLoadingConfirmation && (
          <motion.div variants={staggerItemVariants}>
            <Card className="border-border/60 bg-card/80">
              <CardContent className="pt-6 flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Verificando confirmação...</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!isLoadingConfirmation && existingConfirmation && !isEditing && (
          <motion.div variants={staggerItemVariants}>
            <Card className="bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 border-accent/20">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-8 w-8 text-accent shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-semibold mb-2 text-foreground">
                      {existingConfirmation.willAttend ? "Presença Confirmada! 🎉" : "Confirmação Recebida"}
                    </h3>
                    <div className="space-y-3 text-muted-foreground">
                      <p className="text-base">
                        <strong>
                          {existingConfirmation.willAttend 
                            ? "Que alegria saber que você estará conosco neste dia especial!" 
                            : "Obrigado por nos informar. Sentiremos sua falta!"}
                        </strong>
                      </p>
                      {existingConfirmation.additionalNotes && (
                        <div className="p-3 bg-background/50 rounded-lg border border-border/40">
                          <p className="flex items-start gap-2 text-sm">
                            <MessageSquare className="h-4 w-4 mt-0.5 text-accent" />
                            <span className="italic">"{existingConfirmation.additionalNotes}"</span>
                          </p>
                        </div>
                      )}
                      {existingConfirmation.willAttend && (
                        <div className="pt-2">
                          <p className="text-sm mb-3">Próximos passos:</p>
                          <div className="grid gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                if (onNavigateToSection) {
                                  onNavigateToSection('presentes')
                                }
                              }}
                              className="justify-start"
                            >
                              🎁 Ver lista de presentes
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                if (onNavigateToSection) {
                                  onNavigateToSection('mensagens')
                                }
                              }}
                              className="justify-start"
                            >
                              💌 Ver mural de mensagens
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={handleEdit}
                      className="mt-4"
                      size="sm"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar Confirmação
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {showForm && (
          <motion.div variants={staggerItemVariants}>
            <Card className="border-border/60 bg-card/80">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 border border-primary/20 shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <Label className="text-base font-semibold">
                        Você poderá comparecer ao evento?
                      </Label>
                    </div>

                    <RadioGroup value={willAttend} onValueChange={setWillAttend}>
                      <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="flex-1 cursor-pointer">
                          Sim, estarei presente! 🎉
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="flex-1 cursor-pointer">
                          Infelizmente não poderei comparecer 😔
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="notes">Deixe uma mensagem no mural (opcional)</Label>
                    </div>
                    <Textarea
                      id="notes"
                      placeholder="Deixe suas felicitações e votos para o casal! Sua mensagem aparecerá no mural de mensagens para todos verem 💝"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="bg-background/50 border-border/80 min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Compartilhe seus votos de felicidade! Sua mensagem será exibida no mural para que todos possam ver e celebrar junto conosco ❤️
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {existingConfirmation ? "Atualizar Confirmação" : "Confirmar Presença"}
                        </>
                      )}
                    </Button>
                    {isEditing && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div variants={staggerItemVariants}>
          <Card className="border-border/60 bg-card/80">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 border border-accent/30 shrink-0">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold mb-2 text-foreground">Detalhes do Evento</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Data:</strong> 28 de fevereiro de 2026</p>
                    <p><strong>Horário:</strong> A partir das 16h30</p>
                    <p><strong>Local:</strong> Clube Ipanema</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
