"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Heart, Loader2 } from "lucide-react"
import { saveMessage, getMessages } from "@/lib/message-storage"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import type { Database } from "@/lib/database.types"

type DbMessage = Database["public"]["Tables"]["messages"]["Row"]

interface Message {
  id: string
  name: string
  message: string
  date: string
}

function formatMessageDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Agora"
  if (diffMins < 60) return `${diffMins} min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays === 1) return "1 dia atrás"
  if (diffDays < 7) return `${diffDays} dias atrás`
  
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })
}

export function MessagesSection() {
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Check if current user has already left a message
  const hasUserLeftMessage = messages.some((msg) => msg.name === user?.name)

  // Load messages on component mount
  useEffect(() => {
    async function loadMessages() {
      try {
        const dbMessages = await getMessages()
        const formattedMessages: Message[] = dbMessages.map((msg: DbMessage) => ({
          id: msg.id,
          name: msg.guest_name,
          message: msg.message,
          date: formatMessageDate(msg.created_at),
        }))
        setMessages(formattedMessages)
      } catch (error) {
        console.error("Error loading messages:", error)
        toast({
          title: "Erro ao carregar mensagens",
          description: "Não foi possível carregar as mensagens. Tente novamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !message.trim()) return

    setIsSubmitting(true)

    // Optimistic UI update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      name: user.name,
      message: message.trim(),
      date: "Agora",
    }
    setMessages([tempMessage, ...messages])

    try {
      const savedMessage = await saveMessage(user.name, message.trim())
      
      if (savedMessage) {
        // Replace temporary message with real one from database
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id
              ? {
                  id: savedMessage.id,
                  name: savedMessage.guest_name,
                  message: savedMessage.message,
                  date: formatMessageDate(savedMessage.created_at),
                }
              : msg
          )
        )
        setMessage("")
        toast({
          title: "💝 Mensagem enviada com carinho!",
          description: "Sua mensagem de carinho foi recebida e está agora no mural do casal. Muito obrigado por compartilhar esse momento especial! 🎉",
        })
      } else {
        throw new Error("Failed to save message")
      }
    } catch (error) {
      console.error("Error saving message:", error)
      // Remove temporary message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível salvar sua mensagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif font-semibold text-foreground mb-3">Mensagens de Carinho</h2>
        <p className="text-muted-foreground text-pretty">
          Deixe uma mensagem especial para o casal nesse momento tão importante!
        </p>
      </div>

      <Card className="mb-8 border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 border border-accent/30">
              <MessageCircle className="h-4 w-4 text-accent" />
            </div>
            Enviar Mensagem
          </CardTitle>
          <CardDescription>Compartilhe seus votos de felicidade</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Sua Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Escreva uma mensagem para o casal..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                className="bg-background/50"
              />
            </div>
            <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4" />
                  Enviar Mensagem
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-serif font-semibold text-foreground">Mensagens Recebidas</h3>
        {messages.map((msg) => (
          <Card key={msg.id} className="border-border/60 bg-card/80">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 border border-accent/20 shrink-0">
                  <Heart className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-foreground">{msg.name}</span>
                    <span className="text-xs text-muted-foreground">{msg.date}</span>
                  </div>
                  <p className="text-muted-foreground text-pretty">{msg.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
