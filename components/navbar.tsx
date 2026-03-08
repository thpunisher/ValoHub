"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "HOME", href: "/" },
  { name: "AGENTS", href: "/agents" },
  { name: "WEAPONS", href: "/weapons" },
  { name: "MAPS", href: "/maps" },
  { name: "ARSENAL", href: "/arsenal" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg shadow-black/5" 
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-8 bg-primary rotate-45 group-hover:rotate-[405deg] transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 w-8 h-8 bg-primary/50 rotate-45 scale-0 group-hover:scale-125 opacity-0 group-hover:opacity-50 transition-all duration-500" />
            </div>
            <span className="font-[var(--font-display)] text-xl font-bold tracking-wider text-foreground">
              VALO<span className="text-primary">BASE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium tracking-wider transition-all duration-300 relative group",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
                <span 
                  className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 rounded-full",
                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                  )} 
                />
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu 
                size={24} 
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  mobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                )}
              />
              <X 
                size={24} 
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  mobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden absolute top-16 left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-4 space-y-1 stagger-children">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-4 py-3 text-sm font-medium tracking-wider transition-all duration-300 border-l-2 rounded-r-lg",
                pathname === item.href
                  ? "text-primary border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground border-transparent hover:border-primary/50 hover:bg-secondary/50"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
