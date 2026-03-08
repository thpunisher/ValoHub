"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Agent } from "@/lib/valorant-api"
import { FadeIn, GlowCard } from "@/components/ui/animated"

interface FeaturedAgentsProps {
  agents: Agent[]
}

export function FeaturedAgents({ agents }: FeaturedAgentsProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <span className="text-primary text-sm font-medium tracking-widest">MEET THE ROSTER</span>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-foreground mt-2">
                FEATURED AGENTS
              </h2>
            </div>
            <Button 
              asChild 
              variant="ghost" 
              className="text-muted-foreground hover:text-primary group"
            >
              <Link href="/agents">
                VIEW ALL AGENTS
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </Button>
          </div>
        </FadeIn>

        {/* Agents Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
          {agents.map((agent, index) => (
            <AgentCard key={agent.uuid} agent={agent} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  return (
    <FadeIn delay={index * 50}>
      <Link
        href={`/agents/${agent.uuid}`}
        className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary border border-border hover:border-primary/50 transition-all duration-500 block will-change-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
      >
        {/* Background gradient using agent colors */}
        <div 
          className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-500"
          style={{
            background: agent.backgroundGradientColors?.length 
              ? `linear-gradient(to bottom, #${agent.backgroundGradientColors[0]}, #${agent.backgroundGradientColors[3] || agent.backgroundGradientColors[0]})`
              : 'linear-gradient(to bottom, var(--primary), transparent)'
          }}
        />

        {/* Agent Portrait */}
        <div className="absolute inset-0 flex items-end justify-center">
          {agent.fullPortrait && (
            <Image
              src={agent.fullPortrait}
              alt={agent.displayName}
              fill
              className="object-cover object-top scale-125 group-hover:scale-[1.35] transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
          )}
        </div>

        {/* Role Badge */}
        {agent.role && (
          <div className="absolute top-3 left-3 z-10">
            <div className="w-6 h-6 rounded bg-background/80 backdrop-blur-sm p-1 group-hover:bg-primary/20 transition-colors">
              <Image
                src={agent.role.displayIcon}
                alt={agent.role.displayName}
                width={16}
                height={16}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Agent Name */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background via-background/80 to-transparent">
          <h3 className="font-[var(--font-display)] font-bold text-foreground text-sm tracking-wider group-hover:text-primary transition-colors duration-300">
            {agent.displayName.toUpperCase()}
          </h3>
          {agent.role && (
            <p className="text-xs text-muted-foreground">{agent.role.displayName}</p>
          )}
        </div>

        {/* Corner accent on hover */}
        <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary" />
        </div>
      </Link>
    </FadeIn>
  )
}
