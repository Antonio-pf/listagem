import { ReactNode } from 'react'
import { cookies } from 'next/headers'

async function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { Button } = await import('@/components/ui/button')
  const { LogOut, Gift, Home, LayoutDashboard } = await import('lucide-react')
  const Link = (await import('next/link')).default
  
  async function handleLogout() {
    'use server'
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.delete('admin-session')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-rose-500/10 border border-amber-500/20 flex-shrink-0">
                <Home className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />
                <Gift className="h-4 w-4 sm:h-6 sm:w-6 text-rose-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent truncate">
                  Chá de Casa Nova
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Painel Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="hidden md:flex h-8 sm:h-9">
                  <LayoutDashboard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Dashboard</span>
                </Button>
              </Link>
              <Link href="/admin/gifts">
                <Button variant="default" size="sm" className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 h-8 sm:h-9 px-2 sm:px-3">
                  <Gift className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline text-xs sm:text-sm">Gerenciar Presentes</span>
                </Button>
              </Link>
              <form action={handleLogout}>
                <Button variant="outline" size="sm" type="submit" className="h-8 sm:h-9 px-2 sm:px-3">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline text-xs sm:text-sm">Sair</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {children}
      </main>
    </div>
  )
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Check if this is the login page
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.has('admin-session')
  
  // If not logged in (login page), render without header
  if (!isLoggedIn) {
    return <>{children}</>
  }
  
  // If logged in, render with header
  return <AdminLayoutContent>{children}</AdminLayoutContent>
}
