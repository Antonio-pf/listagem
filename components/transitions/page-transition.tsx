

"use client"

/**
 * Page transition wrapper component
 * Provides smooth fade and slide animations when content changes
 */

import { motion, AnimatePresence } from "framer-motion"
import { pageVariants, getVariants } from "@/lib/animation-variants"
import type { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const variants = getVariants(pageVariants)

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Section transition for individual sections within a page
 */
interface SectionTransitionProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function SectionTransition({ children, className, delay = 0 }: SectionTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
