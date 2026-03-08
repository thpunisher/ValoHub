"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ValorantMap } from "@/lib/valorant-api"
import { FadeIn } from "@/components/ui/animated"

interface FeaturedMapsProps {
  maps: ValorantMap[]
}

export function FeaturedMaps({ maps }: FeaturedMapsProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <span className="text-primary text-sm font-medium tracking-widest">KNOW YOUR TERRAIN</span>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-foreground mt-2">
                COMPETITIVE MAPS
              </h2>
            </div>
            <Button 
              asChild 
              variant="ghost" 
              className="text-muted-foreground hover:text-primary group"
            >
              <Link href="/maps">
                VIEW ALL MAPS
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </Button>
          </div>
        </FadeIn>

        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {maps.map((map, index) => (
            <MapCard key={map.uuid} map={map} index={index} isHero={index === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MapCard({ map, index, isHero }: { map: ValorantMap; index: number; isHero: boolean }) {
  return (
    <FadeIn delay={index * 100} direction={index % 2 === 0 ? "left" : "right"}>
      <Link
        href={`/maps/${map.uuid}`}
        className={`group relative rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 block hover:shadow-2xl hover:shadow-primary/10 ${
          isHero ? 'md:col-span-2 aspect-[21/9]' : 'aspect-video'
        }`}
      >
        {/* Map Image */}
        <Image
          src={map.splash}
          alt={map.displayName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes={isHero ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500" />

        {/* Animated scan line effect */}
        <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-[shimmer_3s_infinite]" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <MapPin size={16} className="group-hover:animate-pulse" />
            <span className="text-xs font-medium tracking-widest">
              {map.coordinates || "COORDINATES CLASSIFIED"}
            </span>
          </div>
          <h3 className="font-[var(--font-display)] font-bold text-foreground text-2xl md:text-3xl tracking-wider group-hover:text-primary transition-colors duration-300">
            {map.displayName.toUpperCase()}
          </h3>
          {map.narrativeDescription && (
            <p className="text-sm text-muted-foreground mt-2 max-w-xl line-clamp-2 group-hover:text-foreground/70 transition-colors">
              {map.narrativeDescription}
            </p>
          )}
        </div>

        {/* Corner accents */}
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary/50 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-primary/50 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />

        {/* View indicator */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
          Click to explore
        </div>
      </Link>
    </FadeIn>
  )
}
