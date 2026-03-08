"use client"

import Link from "next/link"
import { ArrowRight, Crosshair } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// Dynamically import 3D scene to avoid SSR issues
const ValorantHeroScene = dynamic(
  () => import("@/components/three/valorant-scene").then((mod) => mod.ValorantHeroScene),
  { ssr: false }
)

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* 3D Background Scene */}
      {mounted && <ValorantHeroScene />}

      {/* Fallback gradient for when 3D is loading */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-20" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5 -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,70,85,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,70,85,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated corner accents */}
      <div className="absolute top-20 left-4 w-32 h-32 border-l-2 border-t-2 border-primary/30 animate-border-pulse" />
      <div className="absolute bottom-20 right-4 w-32 h-32 border-r-2 border-b-2 border-primary/30 animate-border-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-primary text-sm font-medium mb-8 animate-slide-up">
          <Crosshair size={16} className="animate-pulse" />
          <span>Your Ultimate Valorant Database</span>
        </div>

        {/* Main heading with animation */}
        <h1 
          className="font-[var(--font-display)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <span className="text-foreground">MASTER THE</span>
          <br />
          <span className="text-gradient relative inline-block">
            BATTLEFIELD
            <svg 
              className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
            >
              <path 
                d="M0,6 Q50,0 100,6 T200,6" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
                className="animate-pulse"
              />
            </svg>
          </span>
        </h1>

        {/* Subheading */}
        <p 
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          Explore comprehensive data on all Valorant agents, weapons, maps, and more. 
          Everything you need to elevate your game in one place.
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          <Button 
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold tracking-wide group animate-pulse-glow"
          >
            <Link href="/agents">
              EXPLORE AGENTS
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </Button>
          <Button 
            asChild
            variant="outline"
            size="lg"
            className="border-border hover:border-primary hover:text-primary px-8 py-6 text-lg font-semibold tracking-wide transition-all duration-300"
          >
            <Link href="/weapons">
              VIEW ARSENAL
            </Link>
          </Button>
        </div>

        {/* Floating stats */}
        <div 
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-slide-up"
          style={{ animationDelay: '400ms' }}
        >
          {[
            { label: "AGENTS", value: "24+" },
            { label: "WEAPONS", value: "18+" },
            { label: "MAPS", value: "10+" }
          ].map((stat, i) => (
            <div 
              key={stat.label}
              className="text-center group cursor-default"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-muted-foreground tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </div>
    </section>
  )
}
