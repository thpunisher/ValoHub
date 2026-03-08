"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    // Fade out
    setIsVisible(false)
    
    // After fade out, update children and fade in
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div 
      className="transition-all duration-300 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
      }}
    >
      {displayChildren}
    </div>
  )
}
