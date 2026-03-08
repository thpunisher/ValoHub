"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ValorantMap } from "@/lib/valorant-api"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface MapDetailProps {
  map: ValorantMap
  otherMaps: ValorantMap[]
}

export function MapDetail({ map, otherMaps }: MapDetailProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "callouts">("overview")

  // Group callouts by super region
  const calloutsByRegion = map.callouts?.reduce((acc, callout) => {
    const region = callout.superRegionName || "Other"
    if (!acc[region]) acc[region] = []
    acc[region].push(callout)
    return acc
  }, {} as Record<string, typeof map.callouts>) || {}

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={map.splash}
          alt={map.displayName}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-12">
          <div className="mx-auto max-w-7xl">
            {/* Back Button */}
            <Button 
              asChild 
              variant="ghost" 
              className="mb-6 text-muted-foreground hover:text-foreground bg-background/50 backdrop-blur-sm"
            >
              <Link href="/maps">
                <ArrowLeft className="mr-2" size={18} />
                Back to Maps
              </Link>
            </Button>

            {/* Coordinates */}
            <div className="flex items-center gap-2 text-primary mb-3">
              <MapPin size={18} />
              <span className="text-sm font-medium tracking-widest">
                {map.coordinates || "COORDINATES CLASSIFIED"}
              </span>
            </div>

            {/* Map Name */}
            <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
              {map.displayName.toUpperCase()}
            </h1>

            {/* Tactical Description */}
            {map.tacticalDescription && (
              <p className="text-accent font-medium mt-3">
                {map.tacticalDescription}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all",
              activeTab === "overview"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            Overview
          </button>
          {map.callouts && map.callouts.length > 0 && (
            <button
              onClick={() => setActiveTab("callouts")}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-all",
                activeTab === "callouts"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              Callouts ({map.callouts.length})
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Description */}
            <div>
              <h2 className="font-[var(--font-display)] text-2xl font-bold text-foreground mb-4 tracking-wider">
                ABOUT THIS MAP
              </h2>
              {map.narrativeDescription ? (
                <p className="text-muted-foreground leading-relaxed">
                  {map.narrativeDescription}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  No description available for this map.
                </p>
              )}

              {/* Map Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <span className="text-xs text-muted-foreground">Coordinates</span>
                  <p className="text-foreground font-semibold mt-1">
                    {map.coordinates || "Classified"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <span className="text-xs text-muted-foreground">Callouts</span>
                  <p className="text-foreground font-semibold mt-1">
                    {map.callouts?.length || 0} locations
                  </p>
                </div>
              </div>
            </div>

            {/* Map Display Icon / Minimap */}
            <div>
              {map.displayIcon && (
                <div className="aspect-square bg-card rounded-xl border border-border p-4 overflow-hidden">
                  <Image
                    src={map.displayIcon}
                    alt={`${map.displayName} minimap`}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "callouts" && map.callouts && (
          <div className="space-y-8">
            {Object.entries(calloutsByRegion).map(([region, callouts]) => (
              <div key={region}>
                <h3 className="font-[var(--font-display)] text-lg font-bold text-foreground mb-4 tracking-wider flex items-center gap-3">
                  <Navigation size={18} className="text-primary" />
                  {region.toUpperCase()}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({callouts?.length || 0} locations)
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {callouts?.map((callout, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all"
                    >
                      <p className="font-medium text-foreground text-sm">
                        {callout.regionName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {callout.superRegionName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other Maps */}
        <div className="mt-20 pt-12 border-t border-border">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-[var(--font-display)] text-2xl font-bold text-foreground tracking-wider">
              OTHER MAPS
            </h2>
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
              <Link href="/maps">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {otherMaps.map((otherMap) => (
              <Link
                key={otherMap.uuid}
                href={`/maps/${otherMap.uuid}`}
                className="group relative aspect-video rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all"
              >
                <Image
                  src={otherMap.splash}
                  alt={otherMap.displayName}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-[var(--font-display)] font-bold text-foreground text-lg tracking-wider group-hover:text-primary transition-colors">
                    {otherMap.displayName.toUpperCase()}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
