"use client"

import { Home, Heart, Menu, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const menuItems = [
    { id: "presentes", label: "Presentes" },
    { id: "pix", label: "PIX" },
    { id: "mensagens", label: "Mensagens" },
    { id: "sobre", label: "Sobre o casal" },
  ]

  const handleNavClick = (id: string) => {
    onSectionChange(id)
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 border border-accent/30">
              <Home className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-semibold text-foreground">Chá de Casa Nova</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Com carinho, para o nosso novo lar</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onSectionChange(item.id)}
                className={`text-sm ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary/50"
                }`}
              >
                {item.label}
              </Button>
            ))}
            <Heart className="h-5 w-5 text-accent ml-3" fill="currentColor" />
            {isAuthenticated && user && (
              <>
                <div className="flex items-center gap-2 ml-3 px-3 py-1.5 rounded-md bg-secondary/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user.name}</span>
                  {user.hasCompanion && (
                    <Badge variant="outline" className="text-xs">+1</Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <Heart className="h-5 w-5 text-accent" fill="currentColor" />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-card">
                {isAuthenticated && user && (
                  <div className="flex items-center gap-2 p-3 rounded-md bg-secondary/50 mb-4">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      {user.hasCompanion && (
                        <Badge variant="outline" className="text-xs mt-1">+ acompanhante</Badge>
                      )}
                    </div>
                  </div>
                )}
                <nav className="flex flex-col gap-2 mt-8">
                  {menuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      className={`justify-start ${
                        activeSection === item.id ? "bg-primary text-primary-foreground" : "text-foreground"
                      }`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      {item.label}
                    </Button>
                  ))}
                  {isAuthenticated && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <Button
                        variant="ghost"
                        className="justify-start text-muted-foreground hover:text-foreground"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
