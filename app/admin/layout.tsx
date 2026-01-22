import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, Gift } from 'lucide-react'
import Link from 'next/link'

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
          <div className="flex items-center gap-2">
            <Link href="/admin/gifts">
              <Button variant="default" size="sm">
                <Gift className="h-4 w-4 mr-2" />
                Gerenciar Presentes
              </Button>
            </Link>
            <form action={handleLogout}>
              <Button variant="outline" size="sm" type="submit">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
