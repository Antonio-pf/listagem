'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Gift, Home, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  
  async function handleLogout() {
    try {
      // Delete the cookie by calling the API or setting expiry to past
      document.cookie = 'admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {!isLoginPage && (
        <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-1 sm:gap-2 p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-rose-500/10 border border-amber-500/20">
                  <Home className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                  <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-serif font-semibold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent truncate">
                    Chá de Casa Nova
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">Painel Administrativo</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link href="/admin" className="flex-1 sm:flex-none">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto h-9 px-3">
                    <LayoutDashboard className="h-4 w-4 sm:mr-2" />
                    <span className="text-sm hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <Link href="/admin/gifts" className="flex-1 sm:flex-none">
                  <Button variant="default" size="sm" className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 h-9 px-3">
                    <Gift className="h-4 w-4 sm:mr-2" />
                    <span className="text-sm hidden sm:inline">Presentes</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="h-9 px-3 flex-shrink-0"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="text-sm hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="container mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
