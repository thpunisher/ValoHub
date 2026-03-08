import { getMaps } from "@/lib/valorant-api"
import { MapsGrid } from "@/components/maps/maps-grid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Maps | VALOBASE",
  description: "Explore all Valorant maps, callouts, and strategic points. Master every angle and dominate the battlefield."
}

export default async function MapsPage() {
  const maps = await getMaps()

  // Filter only playable maps with splash images
  const playableMaps = maps.filter(m => m.splash && m.displayName !== "The Range")

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium tracking-widest">BATTLEGROUNDS</span>
          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-2">
            COMPETITIVE MAPS
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-pretty">
            Know your terrain. Study callouts, key positions, and strategic angles to gain 
            the advantage over your opponents.
          </p>
        </div>
      </div>

      <MapsGrid maps={playableMaps} />
    </div>
  )
}
