'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface PendingGuestsModalProps {
  pendingGuests: Array<{ id: string; name: string }>
  trigger?: React.ReactNode
}

const ITEMS_PER_PAGE = 10

export function PendingGuestsModal({ pendingGuests, trigger }: PendingGuestsModalProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(pendingGuests.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentGuests = pendingGuests.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentPage(1) // Reset to first page when closing
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
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
        <div className="space-y-2">
          {pendingGuests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              Todos os convidados confirmaram presença
            </p>
          ) : (
            <>
              <div className="space-y-2 max-h-[50vh] sm:max-h-[400px] overflow-y-auto pr-2">
                {currentGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm sm:text-base">{guest.name}</span>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="h-8"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="h-8"
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}

              <div className="text-xs sm:text-sm text-muted-foreground border-t pt-3">
                Total: {pendingGuests.length} {pendingGuests.length === 1 ? 'convidado' : 'convidados'} pendente{pendingGuests.length === 1 ? '' : 's'}
                {totalPages > 1 && (
                  <span className="block mt-1">
                    Exibindo {startIndex + 1}-{Math.min(endIndex, pendingGuests.length)} de {pendingGuests.length}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
