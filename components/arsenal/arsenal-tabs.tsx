"use client"

import { useState } from "react"
import Image from "next/image"
import { Dog, CreditCard, Sparkles, Gamepad2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Buddy, PlayerCard, Spray, GameMode } from "@/lib/valorant-api"
import { cn } from "@/lib/utils"

interface ArsenalTabsProps {
  buddies: Buddy[]
  playerCards: PlayerCard[]
  sprays: Spray[]
  gameModes: GameMode[]
}

const tabs = [
  { id: "buddies", label: "Buddies", icon: Dog },
  { id: "cards", label: "Player Cards", icon: CreditCard },
  { id: "sprays", label: "Sprays", icon: Sparkles },
  { id: "modes", label: "Game Modes", icon: Gamepad2 },
] as const

type TabId = typeof tabs[number]["id"]

export function ArsenalTabs({ buddies, playerCards, sprays, gameModes }: ArsenalTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("buddies")
  const [searchQuery, setSearchQuery] = useState("")

  const counts = {
    buddies: buddies.length,
    cards: playerCards.length,
    sprays: sprays.filter(s => !s.isNullSpray).length,
    modes: gameModes.filter(m => m.displayName).length,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setSearchQuery("")
            }}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              activeTab === tab.id
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary border-border focus:border-primary"
        />
      </div>

      {/* Content */}
      {activeTab === "buddies" && (
        <BuddiesGrid buddies={buddies} searchQuery={searchQuery} />
      )}
      {activeTab === "cards" && (
        <PlayerCardsGrid cards={playerCards} searchQuery={searchQuery} />
      )}
      {activeTab === "sprays" && (
        <SpraysGrid sprays={sprays} searchQuery={searchQuery} />
      )}
      {activeTab === "modes" && (
        <GameModesGrid modes={gameModes} searchQuery={searchQuery} />
      )}
    </div>
  )
}

function BuddiesGrid({ buddies, searchQuery }: { buddies: Buddy[], searchQuery: string }) {
  const filtered = buddies.filter(buddy => 
    buddy.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {filtered.map((buddy) => (
        <div
          key={buddy.uuid}
          className="group relative aspect-square rounded-lg bg-card border border-border hover:border-primary/50 p-4 flex flex-col items-center justify-center transition-all duration-200"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {buddy.displayIcon && (
              <Image
                src={buddy.displayIcon}
                alt={buddy.displayName}
                width={80}
                height={80}
                className="object-contain group-hover:scale-110 transition-transform duration-200"
              />
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs text-foreground text-center truncate font-medium">
              {buddy.displayName}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function PlayerCardsGrid({ cards, searchQuery }: { cards: PlayerCard[], searchQuery: string }) {
  const filtered = cards.filter(card => 
    card.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {filtered.slice(0, 50).map((card) => (
        <div
          key={card.uuid}
          className="group relative rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-200"
        >
          <div className="aspect-[3/4] relative">
            {card.largeArt && (
              <Image
                src={card.largeArt}
                alt={card.displayName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background via-background/80 to-transparent">
            <p className="text-sm text-foreground font-medium truncate">
              {card.displayName}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function SpraysGrid({ sprays, searchQuery }: { sprays: Spray[], searchQuery: string }) {
  const filtered = sprays
    .filter(spray => !spray.isNullSpray)
    .filter(spray => spray.displayName.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {filtered.slice(0, 60).map((spray) => (
        <div
          key={spray.uuid}
          className="group relative aspect-square rounded-lg bg-card border border-border hover:border-primary/50 p-3 flex flex-col items-center justify-center transition-all duration-200"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {(spray.fullTransparentIcon || spray.displayIcon) && (
              <Image
                src={spray.fullTransparentIcon || spray.displayIcon}
                alt={spray.displayName}
                width={100}
                height={100}
                className="object-contain max-h-full group-hover:scale-110 transition-transform duration-200"
              />
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs text-foreground text-center truncate font-medium">
              {spray.displayName}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function GameModesGrid({ modes, searchQuery }: { modes: GameMode[], searchQuery: string }) {
  const filtered = modes
    .filter(mode => mode.displayName)
    .filter(mode => mode.displayName.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((mode) => (
        <div
          key={mode.uuid}
          className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            {mode.displayIcon ? (
              <div className="w-16 h-16 rounded-lg bg-secondary p-2 flex items-center justify-center shrink-0">
                <Image
                  src={mode.displayIcon}
                  alt={mode.displayName}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Gamepad2 className="text-primary" size={32} />
              </div>
            )}

            <div className="min-w-0">
              <h3 className="font-[var(--font-display)] font-bold text-foreground text-lg tracking-wider group-hover:text-primary transition-colors">
                {mode.displayName.toUpperCase()}
              </h3>
              
              <div className="mt-3 space-y-2 text-sm">
                {mode.duration && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-foreground font-medium">Duration:</span>
                    {mode.duration}
                  </div>
                )}
                {mode.roundsPerHalf > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-foreground font-medium">Rounds/Half:</span>
                    {mode.roundsPerHalf}
                  </div>
                )}
                {mode.orbCount > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-foreground font-medium">Orb Count:</span>
                    {mode.orbCount}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feature badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {mode.isTeamVoiceAllowed && (
              <span className="px-2 py-1 text-xs rounded bg-accent/10 text-accent">
                Team Voice
              </span>
            )}
            {mode.allowsMatchTimeouts && (
              <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                Timeouts
              </span>
            )}
            {mode.isMinimapHidden && (
              <span className="px-2 py-1 text-xs rounded bg-destructive/10 text-destructive">
                No Minimap
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
