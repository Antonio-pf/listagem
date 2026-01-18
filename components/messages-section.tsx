"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Heart } from "lucide-react"

interface Message {
  id: string
  name: string
  message: string
  date: string
}

export function MessagesSection() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      name: "Maria Silva",
      message: "Parabéns pela nova casa! Desejo muita felicidade e amor nesse novo lar.",
      date: "2 dias atrás",
    },
    {
      id: "2",
      name: "João Santos",
      message: "Que essa casa seja repleta de momentos especiais e muitas conquistas. Felicidades!",
      date: "3 dias atrás",
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        name: name.trim(),
        message: message.trim(),
        date: "Agora",
      }
      setMessages([newMessage, ...messages])
      setName("")
      setMessage("")
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif font-semibold mb-3 text-foreground">Mensagens de Carinho</h2>
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
              <Label htmlFor="name">Seu Nome</Label>
              <Input
                id="name"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
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
            <Button type="submit" className="w-full gap-2" size="lg">
              <Heart className="h-4 w-4" />
              Enviar Mensagem
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
