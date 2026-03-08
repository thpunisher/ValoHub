"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Volume2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Agent } from "@/lib/valorant-api"
import { cn } from "@/lib/utils"
import { useState, useRef } from "react"
import { FadeIn } from "@/components/ui/animated"
import dynamic from "next/dynamic"

// Dynamically import 3D scene
const AgentShowcaseScene = dynamic(
  () => import("@/components/three/valorant-scene").then((mod) => mod.AgentShowcaseScene),
  { ssr: false }
)

interface AgentDetailProps {
  agent: Agent
  otherAgents: Agent[]
}

export function AgentDetail({ agent, otherAgents }: AgentDetailProps) {
  const [activeAbility, setActiveAbility] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playVoiceLine = () => {
    if (agent.voiceLine?.mediaList?.[0]?.wave && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const filteredAbilities = agent.abilities.filter(a => a.displayIcon)

  return (
    <div className="pt-20 pb-16 min-h-screen relative">
      {/* 3D Background */}
      <AgentShowcaseScene />

      {/* Audio element for voice line */}
      {agent.voiceLine?.mediaList?.[0]?.wave && (
        <audio 
          ref={audioRef} 
          src={agent.voiceLine.mediaList[0].wave}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Background gradient */}
      <div 
        className="fixed inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          background: agent.backgroundGradientColors?.length 
            ? `radial-gradient(ellipse at top right, #${agent.backgroundGradientColors[0]}30, transparent 50%), radial-gradient(ellipse at bottom left, #${agent.backgroundGradientColors[2] || agent.backgroundGradientColors[0]}20, transparent 50%)`
            : 'none'
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <FadeIn>
          <Button 
            asChild 
            variant="ghost" 
            className="mb-8 text-muted-foreground hover:text-foreground group"
          >
            <Link href="/agents">
              <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
              Back to Agents
            </Link>
          </Button>
        </FadeIn>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left - Agent Info */}
          <div className="order-2 lg:order-1">
            {/* Role Badge */}
            {agent.role && (
              <FadeIn delay={100}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 p-2.5 flex items-center justify-center animate-pulse-glow">
                    <Image
                      src={agent.role.displayIcon}
                      alt={agent.role.displayName}
                      width={28}
                      height={28}
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground tracking-widest">ROLE</span>
                    <p className="text-foreground font-semibold">{agent.role.displayName}</p>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Agent Name */}
            <FadeIn delay={150}>
              <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
                <span className="text-gradient">{agent.displayName.toUpperCase()}</span>
              </h1>
            </FadeIn>

            {/* Voice Line Button */}
            {agent.voiceLine?.mediaList?.[0]?.wave && (
              <FadeIn delay={200}>
                <button
                  onClick={playVoiceLine}
                  className={cn(
                    "mt-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300",
                    isPlaying 
                      ? "bg-primary text-primary-foreground animate-pulse-glow" 
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  )}
                >
                  <Volume2 size={16} className={isPlaying ? "animate-pulse" : ""} />
                  {isPlaying ? "Playing..." : "Play Voice Line"}
                </button>
              </FadeIn>
            )}

            {/* Description */}
            <FadeIn delay={250}>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                {agent.description}
              </p>
            </FadeIn>

            {/* Role Description */}
            {agent.role && (
              <FadeIn delay={300}>
                <div className="mt-8 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-colors">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Sparkles size={14} className="text-primary" />
                    About {agent.role.displayName}s
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {agent.role.description}
                  </p>
                </div>
              </FadeIn>
            )}

            {/* Abilities */}
            <FadeIn delay={350}>
              <div className="mt-10">
                <h2 className="font-[var(--font-display)] text-2xl font-bold text-foreground mb-6 tracking-wider">
                  ABILITIES
                </h2>

                {/* Ability Tabs */}
                <div className="flex gap-2 mb-6">
                  {filteredAbilities.map((ability, index) => (
                    <button
                      key={ability.slot}
                      onClick={() => setActiveAbility(index)}
                      className={cn(
                        "w-14 h-14 rounded-lg border-2 p-2 transition-all duration-300 hover:scale-105",
                        activeAbility === index
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                          : "border-border bg-secondary hover:border-primary/50"
                      )}
                    >
                      {ability.displayIcon && (
                        <Image
                          src={ability.displayIcon}
                          alt={ability.displayName}
                          width={40}
                          height={40}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Active Ability Details */}
                {filteredAbilities[activeAbility] && (
                  <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border animate-scale-in">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                        {filteredAbilities[activeAbility].slot}
                      </span>
                      <h3 className="font-semibold text-foreground text-lg">
                        {filteredAbilities[activeAbility].displayName}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {filteredAbilities[activeAbility].description}
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Right - Agent Portrait */}
          <div className="order-1 lg:order-2 relative">
            <FadeIn delay={100} direction="right">
              <div className="sticky top-24">
                <div 
                  className="relative aspect-[3/4] rounded-xl overflow-hidden group"
                  style={{
                    background: agent.backgroundGradientColors?.length 
                      ? `linear-gradient(to bottom, #${agent.backgroundGradientColors[0]}40, #${agent.backgroundGradientColors[3] || agent.backgroundGradientColors[0]}60)`
                      : 'linear-gradient(to bottom, var(--secondary), transparent)'
                  }}
                >
                  {/* Background pattern */}
                  {agent.background && (
                    <Image
                      src={agent.background}
                      alt=""
                      fill
                      className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                    />
                  )}

                  {/* Agent full portrait */}
                  {(agent.fullPortraitV2 || agent.fullPortrait) && (
                    <Image
                      src={agent.fullPortraitV2 || agent.fullPortrait}
                      alt={agent.displayName}
                      fill
                      className="object-contain object-bottom group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  )}

                  {/* Corner accents with animation */}
                  <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-primary/50 rounded-tl-lg animate-border-pulse" />
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-primary/50 rounded-br-lg animate-border-pulse" style={{ animationDelay: '1s' }} />

                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 60px rgba(255, 70, 85, 0.15)`
                    }}
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Other Agents */}
        <FadeIn delay={400}>
          <div className="mt-20 pt-12 border-t border-border">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-[var(--font-display)] text-2xl font-bold text-foreground tracking-wider">
                OTHER AGENTS
              </h2>
              <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary group">
                <Link href="/agents">
                  View All
                  <ArrowLeft className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 stagger-children">
              {otherAgents.map((otherAgent) => (
                <Link
                  key={otherAgent.uuid}
                  href={`/agents/${otherAgent.uuid}`}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-secondary border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
                >
                  {otherAgent.displayIcon && (
                    <Image
                      src={otherAgent.displayIcon}
                      alt={otherAgent.displayName}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background to-transparent">
                    <p className="text-xs font-medium text-foreground text-center truncate group-hover:text-primary transition-colors">
                      {otherAgent.displayName}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
