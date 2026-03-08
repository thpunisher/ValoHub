import { getAgents, getMaps, getWeapons } from "@/lib/valorant-api"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedAgents } from "@/components/home/featured-agents"
import { FeaturedWeapons } from "@/components/home/featured-weapons"
import { FeaturedMaps } from "@/components/home/featured-maps"
import { StatsSection } from "@/components/home/stats-section"

export default async function HomePage() {
  const [agents, weapons, maps] = await Promise.all([
    getAgents(),
    getWeapons(),
    getMaps()
  ])

  // Filter playable maps (exclude The Range)
  const playableMaps = maps.filter(m => m.displayName !== "The Range" && m.splash)

  return (
    <div className="relative">
      <HeroSection />
      <StatsSection 
        agentCount={agents.length} 
        weaponCount={weapons.length} 
        mapCount={playableMaps.length} 
      />
      <FeaturedAgents agents={agents.slice(0, 6)} />
      <FeaturedWeapons weapons={weapons.filter(w => w.shopData).slice(0, 6)} />
      <FeaturedMaps maps={playableMaps.slice(0, 4)} />
    </div>
  )
}
