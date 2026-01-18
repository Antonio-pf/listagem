"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

interface MessageReminderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGoToMessages: () => void
}

export function MessageReminderDialog({ open, onOpenChange, onGoToMessages }: MessageReminderDialogProps) {
  const handleGoToMessages = () => {
    onOpenChange(false)
    onGoToMessages()
  }

  const handleMaybeLater = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/60">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-2 text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 border border-accent/30">
              <MessageCircle className="h-5 w-5 text-accent" />
            </div>
            Gostaria de deixar uma mensagem?
          </DialogTitle>
          <DialogDescription className="pt-2">
            Compartilhe seus votos de felicidade e carinho para o casal neste momento especial! ✨
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={handleGoToMessages} className="w-full gap-2" size="lg">
            <MessageCircle className="h-4 w-4" />
            Sim, deixar mensagem
          </Button>
          <Button onClick={handleMaybeLater} variant="ghost" className="w-full" size="lg">
            Agora não
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
