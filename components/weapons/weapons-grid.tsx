"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Coins, Zap, Target, Box } from "lucide-react"
import type { Weapon } from "@/lib/valorant-api"
import { cn } from "@/lib/utils"

interface WeaponsGridProps {
  weapons: Weapon[]
  categories: string[]
}

export function WeaponsGrid({ weapons, categories }: WeaponsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredWeapons = selectedCategory 
    ? weapons.filter(w => w.shopData?.categoryText === selectedCategory)
    : weapons.filter(w => w.shopData) // Only show weapons with shop data

  // Group weapons by category for organized display
  const weaponsByCategory = filteredWeapons.reduce((acc, weapon) => {
    const category = weapon.shopData?.categoryText || "Other"
    if (!acc[category]) acc[category] = []
    acc[category].push(weapon)
    return acc
  }, {} as Record<string, Weapon[]>)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            selectedCategory === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          )}
        >
          All Weapons
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Weapons by Category */}
      {selectedCategory === null ? (
        // Show grouped by category
        <div className="space-y-12">
          {Object.entries(weaponsByCategory).map(([category, categoryWeapons]) => (
            <div key={category}>
              <h2 className="font-[var(--font-display)] text-xl font-bold text-foreground mb-6 tracking-wider flex items-center gap-3">
                <span className="w-8 h-0.5 bg-primary" />
                {category.toUpperCase()}
                <span className="text-sm font-normal text-muted-foreground">
                  ({categoryWeapons.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryWeapons.map((weapon) => (
                  <WeaponCard key={weapon.uuid} weapon={weapon} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Show flat grid for filtered view
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWeapons.map((weapon) => (
            <WeaponCard key={weapon.uuid} weapon={weapon} />
          ))}
        </div>
      )}
    </div>
  )
}

function WeaponCard({ weapon }: { weapon: Weapon }) {
  return (
    <Link
      href={`/weapons/${weapon.uuid}`}
      className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
    >
      {/* Category Badge */}
      <div className="absolute top-4 left-4">
        <span className="text-xs font-medium text-muted-foreground tracking-widest">
          {weapon.shopData?.categoryText?.toUpperCase() || "WEAPON"}
        </span>
      </div>

      {/* Price Badge */}
      {weapon.shopData?.cost ? (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent">
          <Coins size={14} />
          <span className="text-sm font-bold">{weapon.shopData.cost}</span>
        </div>
      ) : null}

      {/* Weapon Image */}
      <div className="relative h-28 my-8 flex items-center justify-center">
        {weapon.displayIcon && (
          <Image
            src={weapon.displayIcon}
            alt={weapon.displayName}
            width={280}
            height={100}
            className="object-contain max-h-full w-auto group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(255,70,85,0.3)] transition-all duration-300"
          />
        )}
      </div>

      {/* Weapon Name */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <h3 className="font-[var(--font-display)] font-bold text-foreground text-xl tracking-wider group-hover:text-primary transition-colors">
          {weapon.displayName.toUpperCase()}
        </h3>
        
        {/* Stats Grid */}
        {weapon.weaponStats && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <StatItem 
              icon={Zap} 
              label="Fire Rate" 
              value={weapon.weaponStats.fireRate?.toFixed(1) || "N/A"} 
            />
            <StatItem 
              icon={Box} 
              label="Magazine" 
              value={weapon.weaponStats.magazineSize?.toString() || "N/A"} 
            />
            <StatItem 
              icon={Target} 
              label="Wall Pen" 
              value={weapon.weaponStats.wallPenetration?.replace("EWallPenetrationDisplayType::", "") || "N/A"} 
            />
            <StatItem 
              icon={Zap} 
              label="Reload" 
              value={weapon.weaponStats.reloadTimeSeconds ? `${weapon.weaponStats.reloadTimeSeconds.toFixed(1)}s` : "N/A"} 
            />
          </div>
        )}
      </div>

      {/* Hover accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  )
}

function StatItem({ icon: Icon, label, value }: { icon: typeof Zap, label: string, value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon size={14} className="text-primary shrink-0" />
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium ml-auto">{value}</span>
    </div>
  )
}
