import { getWeapons } from "@/lib/valorant-api"
import { WeaponsGrid } from "@/components/weapons/weapons-grid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Weapons | VALOBASE",
  description: "Explore the complete Valorant weapon arsenal. Compare stats, damage values, and find your perfect loadout."
}

export default async function WeaponsPage() {
  const weapons = await getWeapons()

  // Get unique categories
  const categories = Array.from(new Set(
    weapons
      .filter(w => w.shopData?.categoryText)
      .map(w => w.shopData!.categoryText)
  ))

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium tracking-widest">THE ARSENAL</span>
          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-2">
            WEAPONS CATALOG
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-pretty">
            Master your weapons. Know their damage ranges, fire rates, and stats to make 
            every credit count in the buy phase.
          </p>
        </div>
      </div>

      <WeaponsGrid weapons={weapons} categories={categories} />
    </div>
  )
}
