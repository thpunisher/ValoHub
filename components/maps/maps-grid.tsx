"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"
import type { ValorantMap } from "@/lib/valorant-api"

interface MapsGridProps {
  maps: ValorantMap[]
}

export function MapsGrid({ maps }: MapsGridProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {maps.map((map, index) => (
          <Link
            key={map.uuid}
            href={`/maps/${map.uuid}`}
            className={`group relative rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 ${
              index === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-video'
            }`}
          >
            {/* Map Splash Image */}
            <Image
              src={map.splash}
              alt={map.displayName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes={index === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

            {/* Content */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
              {/* Coordinates */}
              <div className="flex items-center gap-2 text-primary mb-2">
                <MapPin size={16} />
                <span className="text-xs font-medium tracking-widest">
                  {map.coordinates || "COORDINATES CLASSIFIED"}
                </span>
              </div>

              {/* Map Name */}
              <h2 className={`font-[var(--font-display)] font-bold text-foreground tracking-wider group-hover:text-primary transition-colors ${
                index === 0 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'
              }`}>
                {map.displayName.toUpperCase()}
              </h2>

              {/* Description */}
              {map.narrativeDescription && (
                <p className={`text-muted-foreground mt-2 line-clamp-2 ${
                  index === 0 ? 'text-base max-w-2xl' : 'text-sm'
                }`}>
                  {map.narrativeDescription}
                </p>
              )}

              {/* Tactical Description */}
              {map.tacticalDescription && (
                <p className="text-xs text-accent mt-2 font-medium">
                  {map.tacticalDescription}
                </p>
              )}

              {/* Callout Count */}
              {map.callouts && map.callouts.length > 0 && (
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/80 text-xs font-medium text-muted-foreground">
                    {map.callouts.length} Callouts Available
                  </span>
                </div>
              )}
            </div>

            {/* Corner Accent */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary/50 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-primary/50 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* View indicator */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              VIEW MAP
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
