"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import { Heart, Sparkles, User, Users } from "lucide-react"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [name, setName] = useState("")
  const [hasCompanion, setHasCompanion] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && !isLoading) {
      setIsLoading(true)
      try {
        await login(name.trim(), hasCompanion)
        onOpenChange(false)
        setName("")
        setHasCompanion(false)
      } catch (error) {
        console.error("Login error:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/60 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border-2 border-accent/30 shadow-lg">
                <Heart className="h-10 w-10 text-accent animate-pulse" fill="currentColor" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-accent animate-pulse" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <DialogTitle className="font-serif text-2xl text-foreground">
              Bem-vindo(a)!
            </DialogTitle>
            <DialogDescription className="text-base">
              Estamos felizes em ter você aqui! 🎉
              <br />
              Para começar a escolher presentes, conte-nos quem você é.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              Seu Nome Completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Maria Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50 border-border/80 focus:border-accent transition-colors h-11"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/60 bg-secondary/20 transition-colors hover:bg-secondary/30">
              <Checkbox
                id="companion"
                checked={hasCompanion}
                onCheckedChange={(checked) => setHasCompanion(checked as boolean)}
                disabled={isLoading}
                className="mt-0.5"
              />
              <div className="flex-1 space-y-1">
                <label
                  htmlFor="companion"
                  className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Estou acompanhado(a)
                </label>
                <p className="text-xs text-muted-foreground">
                  Marque se você virá com alguém especial
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2 h-11 text-base font-medium shadow-md hover:shadow-lg transition-all" 
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Entrando...
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" fill="currentColor" />
                Entrar e Escolher Presentes
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Suas informações nos ajudam a organizar melhor nossa lista ❤️
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
