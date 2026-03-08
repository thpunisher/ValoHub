"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface AgentsHeaderProps {
  agentCount: number
  roles: string[]
}

export function AgentsHeader({ agentCount, roles }: AgentsHeaderProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
      {/* Title Section */}
      <div className="text-center mb-12">
        <span className="text-primary text-sm font-medium tracking-widest">THE ROSTER</span>
        <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-2">
          VALORANT AGENTS
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-pretty">
          Choose your agent wisely. Each brings unique abilities that can turn the tide of battle.
          Master their skills to dominate the competition.
        </p>
      </div>

      {/* Stats & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">{agentCount}</span> Agents Available
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search agents..." 
              className="pl-9 bg-secondary border-border focus:border-primary"
            />
          </div>

          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-border hover:border-primary">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {roles.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={() => toggleRole(role)}
                >
                  {role}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
