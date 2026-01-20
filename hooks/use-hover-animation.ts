/**
 * Custom hook for interactive hover effects
 * Provides smooth hover animations with customizable options
 */

import { useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef } from "react"

interface UseHoverAnimationOptions {
  scale?: number
  rotateIntensity?: number
  springConfig?: {
    stiffness: number
    damping: number
  }
}

/**
 * Hook for 3D tilt effect on hover
 * Returns motion values for smooth perspective transforms
 */
export function useHoverTilt(options: UseHoverAnimationOptions = {}) {
  const { scale = 1.05, rotateIntensity = 10, springConfig = { stiffness: 300, damping: 20 } } = options

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [rotateIntensity, -rotateIntensity]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-rotateIntensity, rotateIntensity]), springConfig)

  const handleMouseMove = (event: MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY
    
    const normalizedX = mouseX / (rect.width / 2)
    const normalizedY = mouseY / (rect.height / 2)
    
    x.set(normalizedX)
    y.set(normalizedY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return {
    rotateX,
    rotateY,
    scale,
    handleMouseMove,
    handleMouseLeave,
  }
}

/**
 * Hook for magnetic hover effect
 * Elements follow the cursor with a spring animation
 */
export function useMagneticHover(strength: number = 0.3) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (event: MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = (event.clientX - centerX) * strength
    const distanceY = (event.clientY - centerY) * strength
    
    x.set(distanceX)
    y.set(distanceY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return {
    x: springX,
    y: springY,
    handleMouseMove,
    handleMouseLeave,
  }
}

/**
 * Hook for ripple effect on click
 * Creates expanding circles on interaction
 */
export function useRippleEffect() {
  const ripplesRef = useRef<Array<{ x: number; y: number; id: number }>>([])
  
  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()
    
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const id = Date.now()
    
    ripplesRef.current.push({ x, y, id })
    
    // Clean up after animation completes
    setTimeout(() => {
      ripplesRef.current = ripplesRef.current.filter(ripple => ripple.id !== id)
    }, 600)
    
    return { x, y, id }
  }

  return { createRipple, ripples: ripplesRef.current }
}

/**
 * Hook for glow effect on hover
 * Creates a radial gradient that follows the cursor
 */
export function useGlowEffect() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const handleMouseMove = (event: MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    x.set(event.clientX - rect.left)
    y.set(event.clientY - rect.top)
  }

  const handleMouseLeave = () => {
    x.set(-100)
    y.set(-100)
  }

  return {
    x,
    y,
    handleMouseMove,
    handleMouseLeave,
  }
}

/**
 * Hook for scale animation on hover
 * Simple but smooth scale effect with spring physics
 */
export function useHoverScale(scaleAmount: number = 1.05) {
  const scale = useMotionValue(1)
  const springScale = useSpring(scale, { stiffness: 300, damping: 20 })

  const handleMouseEnter = () => {
    scale.set(scaleAmount)
  }

  const handleMouseLeave = () => {
    scale.set(1)
  }

  return {
    scale: springScale,
    handleMouseEnter,
    handleMouseLeave,
  }
}
