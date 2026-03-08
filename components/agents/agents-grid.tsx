"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"
import type { Agent } from "@/lib/valorant-api"
import { cn } from "@/lib/utils"
import { FadeIn } from "@/components/ui/animated"
import { Search } from "lucide-react"

interface AgentsGridProps {
  agents: Agent[]
}

export function AgentsGrid({ agents }: AgentsGridProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Get unique roles
  const roles = useMemo(() => {
    return Array.from(new Set(agents.filter(a => a.role).map(a => a.role!)))
      .filter((role, index, self) => 
        index === self.findIndex(r => r.displayName === role.displayName)
      )
  }, [agents])

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesRole = !selectedRole || agent.role?.displayName === selectedRole
      const matchesSearch = !searchQuery || 
        agent.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role?.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesRole && matchesSearch
    })
  }, [agents, selectedRole, searchQuery])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Search and Filter Bar */}
      <FadeIn>
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedRole(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                selectedRole === null
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              All Agents
            </button>
            {roles.map((role) => (
              <button
                key={role.uuid}
                onClick={() => setSelectedRole(role.displayName)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  selectedRole === role.displayName
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                )}
              >
                <Image
                  src={role.displayIcon}
                  alt={role.displayName}
                  width={16}
                  height={16}
                  className={cn(
                    "transition-all",
                    selectedRole === role.displayName ? "brightness-200" : "opacity-70"
                  )}
                />
                {role.displayName}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Results count */}
      <FadeIn delay={100}>
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredAgents.length} {filteredAgents.length === 1 ? 'agent' : 'agents'}
        </p>
      </FadeIn>

      {/* Agents Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {filteredAgents.map((agent, index) => (
          <AgentCard key={agent.uuid} agent={agent} index={index} />
        ))}
      </div>

      {/* No results */}
      {filteredAgents.length === 0 && (
        <FadeIn>
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No agents found matching your criteria</p>
            <button
              onClick={() => { setSelectedRole(null); setSearchQuery(""); }}
              className="mt-4 text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        </FadeIn>
      )}
    </div>
  )
}

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  return (
    <FadeIn delay={index * 30} direction="up">
      <Link
        href={`/agents/${agent.uuid}`}
        className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary border border-border hover:border-primary/50 transition-all duration-500 block will-change-transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
      >
        {/* Background gradient using agent colors */}
        <div 
          className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500"
          style={{
            background: agent.backgroundGradientColors?.length 
              ? `linear-gradient(to bottom, #${agent.backgroundGradientColors[0]}40, #${agent.backgroundGradientColors[3] || agent.backgroundGradientColors[0]}60)`
              : 'linear-gradient(to bottom, var(--primary), transparent)'
          }}
        />

        {/* Agent Background Pattern */}
        {agent.background && (
          <Image
            src={agent.background}
            alt=""
            fill
            className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          />
        )}

        {/* Agent Portrait */}
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
          {agent.fullPortrait && (
            <Image
              src={agent.fullPortrait}
              alt={agent.displayName}
              fill
              className="object-cover object-top scale-110 group-hover:scale-[1.18] transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          )}
        </div>

        {/* Role Badge */}
        {agent.role && (
          <div className="absolute top-3 left-3 z-10">
            <div className="w-8 h-8 rounded-md bg-background/80 backdrop-blur-sm p-1.5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
              <Image
                src={agent.role.displayIcon}
                alt={agent.role.displayName}
                width={20}
                height={20}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Hover Effect - View indicator */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        {/* Agent Name & Role */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
          <h3 className="font-[var(--font-display)] font-bold text-foreground text-lg tracking-wider group-hover:text-primary transition-colors duration-300">
            {agent.displayName.toUpperCase()}
          </h3>
          {agent.role && (
            <p className="text-xs text-muted-foreground mt-0.5">{agent.role.displayName}</p>
          )}
        </div>

        {/* Border glow effect on hover */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 30px rgba(255, 70, 85, 0.2)`
          }}
        />
      </Link>
    </FadeIn>
  )
}
