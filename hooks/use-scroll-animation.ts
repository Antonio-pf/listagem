/**
 * Custom hook for scroll-triggered animations
 * Uses Intersection Observer API to detect when elements enter viewport
 */

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

interface UseScrollAnimationOptions {
  threshold?: number
  triggerOnce?: boolean
  rootMargin?: string
}

/**
 * Hook that returns true when element is in viewport
 * @param options - Configuration for intersection observer
 * @returns ref to attach to element and inView boolean
 */
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, triggerOnce = true, rootMargin = "0px" } = options

  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: rootMargin as any,
    amount: threshold,
  })

  return { ref, isInView }
}

/**
 * Hook for staggered scroll animations
 * Useful for lists or grids where items should animate in sequence
 */
export function useStaggeredScroll(itemCount: number, options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, triggerOnce = true } = options
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: triggerOnce,
    amount: threshold,
  })

  useEffect(() => {
    if (isInView) {
      // Stagger the visibility of items
      const delays = Array.from({ length: itemCount }, (_, i) => i * 100)
      delays.forEach((delay, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, index])
        }, delay)
      })
    }
  }, [isInView, itemCount])

  return { ref, visibleItems, isInView }
}

/**
 * Hook for scroll progress tracking
 * Returns a value between 0 and 1 representing scroll progress
 */
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", updateScrollProgress, { passive: true })
    updateScrollProgress() // Initial calculation

    return () => window.removeEventListener("scroll", updateScrollProgress)
  }, [])

  return scrollProgress
}

/**
 * Hook for parallax scroll effect
 * Returns a transform value based on scroll position
 */
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.scrollY
        const elementTop = rect.top + scrolled
        const offset = (scrolled - elementTop) * speed
        setOffsetY(offset)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return { ref, offsetY }
}

/**
 * Hook to detect scroll direction
 * Returns 'up', 'down', or null
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      const direction = scrollY > lastScrollY.current ? "down" : "up"
      
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY.current) > 10) {
        setScrollDirection(direction)
      }
      
      lastScrollY.current = scrollY
    }

    window.addEventListener("scroll", updateScrollDirection, { passive: true })
    
    return () => window.removeEventListener("scroll", updateScrollDirection)
  }, [scrollDirection])

  return scrollDirection
}
