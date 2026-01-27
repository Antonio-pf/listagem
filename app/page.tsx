"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { GiftList } from "@/components/gift-list"
import { Header } from "@/components/header"
import { PixSection } from "@/components/pix-section"
import { MessagesSection } from "@/components/messages-section"
import { AboutSection } from "@/components/about-section"
import { AttendanceSection } from "@/components/attendance-section"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/lib/auth-context"
import { PageTransition } from "@/components/transitions/page-transition"

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
        <AnimatePresence mode="wait">
          {activeSection === "presentes" && (
            <PageTransition key="presentes">
              <GiftList onNavigateToMessages={() => setActiveSection("mensagens")} />
            </PageTransition>
          )}
          {activeSection === "pix" && (
            <PageTransition key="pix">
              <PixSection />
            </PageTransition>
          )}
          {activeSection === "confirmacao" && (
            <PageTransition key="confirmacao">
              <AttendanceSection 
                onRequestLogin={() => setShowLoginModal(true)} 
                onNavigateToSection={setActiveSection}
              />
            </PageTransition>
          )}
          {activeSection === "mensagens" && (
            <PageTransition key="mensagens">
              <div id="messages-section">
                <MessagesSection />
              </div>
            </PageTransition>
          )}
          {activeSection === "sobre" && (
            <PageTransition key="sobre">
              <AboutSection />
            </PageTransition>
          )}
        </AnimatePresence>
      </main>
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  )
}
