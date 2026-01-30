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
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [hasCompanion, setHasCompanion] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (firstName.trim() && lastName.trim() && !isLoading) {
      setIsLoading(true)
      try {
        await login(firstName.trim(), lastName.trim(), hasCompanion)
        onOpenChange(false)
        setFirstName("")
        setLastName("")
        setHasCompanion(false)
        setError("")
      } catch (error) {
        console.error("Login error:", error)
        setError("Não foi possível fazer login. Por favor, tente novamente.")
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

        <form onSubmit={handleSubmit} className="space-y-6 py-2" noValidate>
          {error && (
            <div 
              role="alert" 
              aria-live="assertive"
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            >
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Primeiro Nome
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Ex: Maria"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-background/50 border-border/80 focus:border-accent transition-colors h-11 min-h-[44px]"
                required
                aria-required="true"
                aria-invalid={!!error}
                autoFocus
                autoComplete="given-name"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Sobrenome
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Ex: Silva"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-background/50 border-border/80 focus:border-accent transition-colors h-11 min-h-[44px]"
                required
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "name-error" : undefined}
                autoComplete="family-name"
                disabled={isLoading}
              />
              {error && (
                <p id="name-error" className="text-xs text-destructive">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/60 bg-secondary/20 transition-colors hover:bg-secondary/30 min-h-[44px]">
              <Checkbox
                id="companion"
                checked={hasCompanion}
                onCheckedChange={(checked) => setHasCompanion(checked as boolean)}
                disabled={isLoading}
                className="mt-0.5"
                aria-label="Estou acompanhado(a)"
              />
              <div className="flex-1 space-y-1">
                <label
                  htmlFor="companion"
                  className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  Estou acompanhado(a)
                </label>
                <p className="text-xs text-muted-foreground" id="companion-description">
                  Marque se você virá com alguém especial
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2 h-11 min-h-[44px] text-base font-medium shadow-md hover:shadow-lg transition-all touch-manipulation active:scale-95" 
            disabled={!firstName.trim() || !lastName.trim() || isLoading}
            aria-busy={isLoading}
            aria-label={isLoading ? "Processando login" : "Entrar e escolher presentes"}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" fill="currentColor" aria-hidden="true" />
                <span>Entrar e Escolher Presentes</span>
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
