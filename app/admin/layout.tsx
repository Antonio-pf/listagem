import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, Gift, Home, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

async function handleLogout() {
  'use server'
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-rose-500/10 border border-amber-500/20">
                <Home className="h-6 w-6 text-amber-600" />
                <Gift className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  Chá de Casa Nova
                </h1>
                <p className="text-sm text-muted-foreground">Painel Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/gifts">
                <Button variant="default" size="sm" className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700">
                  <Gift className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Gerenciar Presentes</span>
                  <span className="sm:hidden">Presentes</span>
                </Button>
              </Link>
              <form action={handleLogout}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
