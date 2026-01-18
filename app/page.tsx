"use client"

import { useState, useEffect } from "react"
import { GiftList } from "@/components/gift-list"
import { Header } from "@/components/header"
import { PixSection } from "@/components/pix-section"
import { MessagesSection } from "@/components/messages-section"
import { AboutSection } from "@/components/about-section"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const [activeSection, setActiveSection] = useState("presentes")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
    }
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {activeSection === "presentes" && (
          <GiftList onNavigateToMessages={() => setActiveSection("mensagens")} />
        )}
        {activeSection === "pix" && <PixSection />}
        {activeSection === "mensagens" && <div id="messages-section"><MessagesSection /></div>}
        {activeSection === "sobre" && <AboutSection />}
      </main>
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  )
}
