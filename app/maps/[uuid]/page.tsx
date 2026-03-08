import { getMap, getMaps } from "@/lib/valorant-api"
import { MapDetail } from "@/components/maps/map-detail"
import { Metadata } from "next"
import { notFound } from "next/navigation"

interface MapPageProps {
  params: Promise<{ uuid: string }>
}

export async function generateMetadata({ params }: MapPageProps): Promise<Metadata> {
  const { uuid } = await params
  try {
    const map = await getMap(uuid)
    return {
      title: `${map.displayName} | Maps | VALOBASE`,
      description: map.narrativeDescription || `Explore ${map.displayName} map in Valorant.`
    }
  } catch {
    return {
      title: "Map Not Found | VALOBASE"
    }
  }
}

export async function generateStaticParams() {
  const maps = await getMaps()
  return maps.map((map) => ({
    uuid: map.uuid,
  }))
}

export default async function MapPage({ params }: MapPageProps) {
  const { uuid } = await params
  
  try {
    const [map, allMaps] = await Promise.all([
      getMap(uuid),
      getMaps()
    ])
    
    const otherMaps = allMaps
      .filter(m => m.uuid !== uuid && m.splash && m.displayName !== "The Range")
      .slice(0, 4)
    
    return <MapDetail map={map} otherMaps={otherMaps} />
  } catch {
    notFound()
  }
}
