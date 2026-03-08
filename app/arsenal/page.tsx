import { getBuddies, getPlayerCards, getSprays, getGameModes } from "@/lib/valorant-api"
import { ArsenalTabs } from "@/components/arsenal/arsenal-tabs"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Arsenal | VALOBASE",
  description: "Explore Valorant buddies, player cards, sprays, and game modes. Customize your loadout and express yourself."
}

export default async function ArsenalPage() {
  const [buddies, playerCards, sprays, gameModes] = await Promise.all([
    getBuddies(),
    getPlayerCards(),
    getSprays(),
    getGameModes()
  ])

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium tracking-widest">CUSTOMIZE</span>
          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-2">
            YOUR ARSENAL
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-pretty">
            Express yourself with buddies, player cards, sprays, and explore all game modes.
            Your style, your way.
          </p>
        </div>
      </div>

      <ArsenalTabs 
        buddies={buddies} 
        playerCards={playerCards} 
        sprays={sprays}
        gameModes={gameModes}
      />
    </div>
  )
}
