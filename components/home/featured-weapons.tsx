"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Weapon } from "@/lib/valorant-api"
import { FadeIn } from "@/components/ui/animated"

interface FeaturedWeaponsProps {
  weapons: Weapon[]
}

export function FeaturedWeapons({ weapons }: FeaturedWeaponsProps) {
  return (
    <section className="py-20 relative bg-card/30 border-y border-border overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <span className="text-primary text-sm font-medium tracking-widest">GEAR UP</span>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-foreground mt-2">
                WEAPON ARSENAL
              </h2>
            </div>
            <Button 
              asChild 
              variant="ghost" 
              className="text-muted-foreground hover:text-primary group"
            >
              <Link href="/weapons">
                VIEW ALL WEAPONS
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </Button>
          </div>
        </FadeIn>

        {/* Weapons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weapons.map((weapon, index) => (
            <WeaponCard key={weapon.uuid} weapon={weapon} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function WeaponCard({ weapon, index }: { weapon: Weapon; index: number }) {
  return (
    <FadeIn delay={index * 75} direction="up">
      <Link
        href={`/weapons/${weapon.uuid}`}
        className="group relative p-6 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-all duration-500 block hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      >
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="text-xs font-medium text-muted-foreground tracking-widest">
            {weapon.shopData?.categoryText?.toUpperCase() || weapon.category?.replace("EEquippableCategory::", "").toUpperCase()}
          </span>
        </div>

        {/* Price Badge */}
        {weapon.shopData?.cost && (
          <div className="absolute top-4 right-4 flex items-center gap-1 text-accent bg-accent/10 px-2 py-1 rounded-full">
            <Coins size={14} />
            <span className="text-sm font-semibold">{weapon.shopData.cost}</span>
          </div>
        )}

        {/* Weapon Image */}
        <div className="relative h-28 my-8 flex items-center justify-center">
          {weapon.displayIcon && (
            <Image
              src={weapon.displayIcon}
              alt={weapon.displayName}
              width={220}
              height={90}
              className="object-contain max-h-full w-auto group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_10px_20px_rgba(255,70,85,0.15)]"
            />
          )}
        </div>

        {/* Weapon Name & Stats */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <h3 className="font-[var(--font-display)] font-bold text-foreground text-lg tracking-wider group-hover:text-primary transition-colors duration-300">
            {weapon.displayName.toUpperCase()}
          </h3>
          
          {weapon.weaponStats && (
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between text-muted-foreground p-2 rounded bg-background/50">
                <span>Fire Rate</span>
                <span className="text-foreground font-medium">{weapon.weaponStats.fireRate}</span>
              </div>
              <div className="flex justify-between text-muted-foreground p-2 rounded bg-background/50">
                <span>Magazine</span>
                <span className="text-foreground font-medium">{weapon.weaponStats.magazineSize}</span>
              </div>
            </div>
          )}
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 40px rgba(255, 70, 85, 0.08)' }}
        />
      </Link>
    </FadeIn>
  )
}
