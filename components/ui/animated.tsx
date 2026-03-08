"use client"

import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/use-animations"
import type { ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  duration?: number
}

export function FadeIn({ 
  children, 
  className, 
  delay = 0, 
  direction = "up",
  duration = 600 
}: FadeInProps) {
  const { ref, isInView } = useInView()

  const directionStyles = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    none: ""
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all",
        !isInView && `opacity-0 ${directionStyles[direction]}`,
        isInView && "opacity-100 translate-y-0 translate-x-0",
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {children}
    </div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({ children, className, staggerDelay = 100 }: StaggerContainerProps) {
  const { ref, isInView } = useInView()

  return (
    <div 
      ref={ref} 
      className={cn(className)}
      style={{ "--stagger-delay": `${staggerDelay}ms` } as React.CSSProperties}
      data-in-view={isInView}
    >
      {children}
    </div>
  )
}

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
}

export function GlowCard({ children, className, glowColor = "var(--primary)" }: GlowCardProps) {
  return (
    <div className={cn("relative group", className)}>
      <div 
        className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500"
        style={{ background: glowColor }}
      />
      <div className="relative bg-card border border-border rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  )
}

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  speed?: number
}

export function ParallaxSection({ 
  children, 
  className,
  intensity = 0.1 
}: { 
  children: ReactNode
  className?: string 
  intensity?: number
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div 
        className="transform-gpu"
        style={{
          transform: `translateY(calc(var(--scroll-y, 0) * ${intensity}))`
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Shimmer loading skeleton
export function Shimmer({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-muted rounded-lg",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:animate-[shimmer_2s_infinite]",
        className
      )}
    />
  )
}

// Floating animation
export function FloatingElement({ 
  children, 
  className,
  duration = 3,
  distance = 10
}: { 
  children: ReactNode
  className?: string
  duration?: number
  distance?: number
}) {
  return (
    <div 
      className={cn("animate-float", className)}
      style={{ 
        animationDuration: `${duration}s`,
        "--float-distance": `${distance}px`
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// Magnetic hover effect wrapper
export function MagneticWrapper({ 
  children, 
  className,
  strength = 0.3
}: { 
  children: ReactNode
  className?: string
  strength?: number
}) {
  return (
    <div 
      className={cn(
        "transition-transform duration-200 ease-out hover:scale-105",
        className
      )}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) * strength
        const y = (e.clientY - rect.top - rect.height / 2) * strength
        e.currentTarget.style.transform = `translate(${x}px, ${y}px) scale(1.05)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ""
      }}
    >
      {children}
    </div>
  )
}
