"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportButtonProps {
  type: 'guests' | 'reservations' | 'messages' | 'attendances'
  className?: string
}

export function ExportButton({ type, className }: ExportButtonProps) {
  const handleExport = () => {
    window.open(`/api/admin/export?type=${type}&format=csv`, '_blank')
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={className}
      onClick={handleExport}
    >
      <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
      <span className="text-xs sm:text-sm">Exportar CSV</span>
    </Button>
  )
}
