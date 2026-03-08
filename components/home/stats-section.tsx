"use client"

import { Users, Sword, Map, Gamepad2 } from "lucide-react"
import { FadeIn } from "@/components/ui/animated"
import { useCountUp } from "@/hooks/use-animations"

interface StatsSectionProps {
  agentCount: number
  weaponCount: number
  mapCount: number
}

function AnimatedStat({ 
  icon: Icon, 
  value, 
  label, 
  description,
  index 
}: { 
  icon: typeof Users
  value: number
  label: string
  description: string
  index: number
}) {
  const { count, ref } = useCountUp(value, 1500, true)

  return (
    <FadeIn delay={index * 100}>
      <div 
        ref={ref}
        className="relative group text-center p-8 rounded-xl bg-gradient-to-b from-secondary/50 to-transparent border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
      >
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
          <Icon size={28} className="group-hover:animate-pulse" />
        </div>
        
        {/* Value with count animation */}
        <div className="font-[var(--font-display)] text-5xl font-bold text-foreground mb-2 tabular-nums">
          {count}+
        </div>
        
        {/* Label */}
        <div className="font-semibold text-foreground mb-1">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>

        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 40px rgba(255, 70, 85, 0.05)' }}
        />
      </div>
    </FadeIn>
  )
}

export function StatsSection({ agentCount, weaponCount, mapCount }: StatsSectionProps) {
  const stats = [
    {
      icon: Users,
      value: agentCount,
      label: "Playable Agents",
      description: "Each with unique abilities"
    },
    {
      icon: Sword,
      value: weaponCount,
      label: "Weapons",
      description: "In the complete arsenal"
    },
    {
      icon: Map,
      value: mapCount,
      label: "Competitive Maps",
      description: "Ready to explore"
    },
    {
      icon: Gamepad2,
      value: 7,
      label: "Game Modes",
      description: "Various ways to play"
    }
  ]

  return (
    <section className="relative py-20 border-y border-border bg-card/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-widest">DATABASE STATS</span>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-foreground mt-2">
              COMPREHENSIVE DATA
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <AnimatedStat key={stat.label} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
