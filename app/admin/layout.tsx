import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

async function handleLogout() {
  'use server'
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground">Gerenciamento de presentes e convidados</p>
          </div>
          <form action={handleLogout}>
            <Button variant="outline" size="sm" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </form>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
