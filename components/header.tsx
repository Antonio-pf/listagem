"use client"

import { Home, Heart, Menu, LogOut, User, Gift, Wallet, MessageCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { buttonVariants, navIndicatorVariants, fadeInVariants } from "@/lib/animation-variants"

interface HeaderProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const getMenuItems = () => {
    // Base items always accessible
    const baseItems = [
      { id: "confirmacao", label: "Confirmar Presença" },
      { id: "sobre", label: "Sobre o casal" },
    ]
    
    // If user confirmed attendance with "yes", show all tabs
    if (user?.hasConfirmedAttendance && user?.willAttend) {
      return [
        { id: "presentes", label: "Presentes" },
        { id: "pix", label: "PIX" },
        { id: "mensagens", label: "Mensagens" },
        ...baseItems,
      ]
    }
    
    // If not authenticated or not confirmed or confirmed "no"
    return baseItems
  }

  const menuItems = getMenuItems()

  const handleNavClick = (id: string) => {
    onSectionChange(id)
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <motion.header 
      className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 border border-accent/30">
              <Home className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-serif font-semibold text-foreground leading-tight">
                <span className="block sm:inline">Chá Casa Nova</span>{" "}
                <span className="text-accent">Antônio & Mirian</span>
              </h1>
              <p className="text-xs sm:text-xs md:text-sm text-muted-foreground">Com carinho, para o nosso novo lar</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 relative">
            {menuItems.map((item) => (
              <motion.div key={item.id} className="relative">
                <motion.button
                  onClick={() => onSectionChange(item.id)}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    activeSection === item.id
                      ? "text-primary-foreground"
                      : "text-foreground hover:bg-secondary/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-primary rounded-md -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              </motion.div>
            ))}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Heart className="h-5 w-5 text-accent ml-3" fill="currentColor" />
            </motion.div>
            <AnimatePresence>
              {isAuthenticated && user && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2 ml-3 px-3 py-1.5 rounded-md bg-secondary/50">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{user.name}</span>
                    {user.hasCompanion && (
                      <Badge variant="outline" className="text-xs">+1</Badge>
                    )}
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <Heart className="h-5 w-5 text-accent" fill="currentColor" />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full border-2 border-accent/30 hover:border-accent/50 hover:bg-accent/10 transition-all"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-card">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                {isAuthenticated && user && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 border-2 border-accent/30">
                      <User className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Convidado</p>
                      {user.hasCompanion && (
                        <Badge variant="outline" className="text-xs mt-1">+ acompanhante</Badge>
                      )}
                    </div>
                  </div>
                )}
                <nav className="flex flex-col gap-3 mt-8">
                  {menuItems.map((item) => {
                    const getIcon = () => {
                      switch(item.id) {
                        case "presentes": return Gift
                        case "pix": return Wallet
                        case "mensagens": return MessageCircle
                        case "confirmacao": return Calendar
                        case "sobre": return Heart
                        default: return Home
                      }
                    }
                    const Icon = getIcon()
                    
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={`justify-start h-auto py-3 px-3 rounded-xl transition-all ${
                          activeSection === item.id 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "hover:bg-accent/10"
                        }`}
                        onClick={() => handleNavClick(item.id)}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full mr-3 ${
                          activeSection === item.id
                            ? "bg-primary-foreground/20"
                            : "bg-accent/20"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-base">{item.label}</span>
                      </Button>
                    )
                  })}
                  {isAuthenticated && (
                    <>
                      <div className="h-px bg-border my-3" />
                      <Button
                        variant="ghost"
                        className="justify-start h-auto py-3 px-3 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                        onClick={handleLogout}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 mr-3">
                          <LogOut className="h-5 w-5" />
                        </div>
                        <span className="text-base">Sair</span>
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
