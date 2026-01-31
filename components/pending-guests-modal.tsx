'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PendingGuestsModalProps {
  pendingGuests: Array<{ id: string; name: string }>
  trigger?: React.ReactNode
}

export function PendingGuestsModal({ pendingGuests, trigger }: PendingGuestsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Convidados Pendentes de Confirmação
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-[60vh] sm:max-h-[400px] overflow-y-auto pr-2">
          {pendingGuests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              Todos os convidados confirmaram presença
            </p>
          ) : (
            pendingGuests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm sm:text-base">{guest.name}</span>
              </div>
            ))
          )}
        </div>
        {pendingGuests.length > 0 && (
          <div className="text-xs sm:text-sm text-muted-foreground border-t pt-3">
            Total: {pendingGuests.length} {pendingGuests.length === 1 ? 'convidado' : 'convidados'} pendente{pendingGuests.length === 1 ? '' : 's'}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
