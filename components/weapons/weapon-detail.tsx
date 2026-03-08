"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Coins, Zap, Target, Box, Clock, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Weapon } from "@/lib/valorant-api"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { FadeIn } from "@/components/ui/animated"
import dynamic from "next/dynamic"

// Dynamically import 3D scene
const WeaponDisplayScene = dynamic(
  () => import("@/components/three/valorant-scene").then((mod) => mod.WeaponDisplayScene),
  { ssr: false }
)

interface WeaponDetailProps {
  weapon: Weapon
}

export function WeaponDetail({ weapon }: WeaponDetailProps) {
  const [selectedSkin, setSelectedSkin] = useState(0)
  const [selectedChroma, setSelectedChroma] = useState(0)

  // Filter skins with display icons
  const skins = weapon.skins?.filter(skin => 
    skin.displayIcon || skin.chromas?.[0]?.fullRender
  ) || []

  const currentSkin = skins[selectedSkin]
  const currentChroma = currentSkin?.chromas?.[selectedChroma]

  return (
    <div className="pt-20 pb-16 min-h-screen relative">
      {/* 3D Background */}
      <WeaponDisplayScene />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <FadeIn>
          <Button 
            asChild 
            variant="ghost" 
            className="mb-8 text-muted-foreground hover:text-foreground group"
          >
            <Link href="/weapons">
              <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
              Back to Arsenal
            </Link>
          </Button>
        </FadeIn>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Left - Weapon Image */}
          <FadeIn delay={100} direction="left">
            <div className="relative group">
              <div className="aspect-video bg-gradient-to-br from-secondary to-card rounded-xl border border-border p-8 flex items-center justify-center overflow-hidden hover:border-primary/30 transition-colors">
                {/* Animated grid */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,70,85,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,70,85,0.3) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }}
                />
                
                {weapon.displayIcon && (
                  <Image
                    src={weapon.displayIcon}
                    alt={weapon.displayName}
                    width={500}
                    height={200}
                    className="object-contain max-h-full drop-shadow-[0_0_40px_rgba(255,70,85,0.3)] group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                )}
              </div>

              {/* Kill Stream Icon */}
              {weapon.killStreamIcon && (
                <div className="mt-4 flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                  <span className="text-sm text-muted-foreground">Kill Feed Icon:</span>
                  <Image
                    src={weapon.killStreamIcon}
                    alt="Kill feed icon"
                    width={80}
                    height={30}
                    className="object-contain invert"
                  />
                </div>
              )}
            </div>
          </FadeIn>

          {/* Right - Weapon Info */}
          <div>
            {/* Category */}
            <FadeIn delay={150}>
              <span className="text-primary text-sm font-medium tracking-widest">
                {weapon.shopData?.categoryText?.toUpperCase() || weapon.category?.replace("EEquippableCategory::", "").toUpperCase()}
              </span>
            </FadeIn>

            {/* Name & Price */}
            <FadeIn delay={200}>
              <div className="flex items-start justify-between gap-4 mt-2">
                <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                  <span className="text-gradient">{weapon.displayName.toUpperCase()}</span>
                </h1>
                {weapon.shopData?.cost && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent shrink-0 animate-pulse-glow">
                    <Coins size={20} />
                    <span className="text-xl font-bold">{weapon.shopData.cost}</span>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Stats Grid */}
            {weapon.weaponStats && (
              <FadeIn delay={250}>
                <div className="mt-8 grid grid-cols-2 gap-4 stagger-children">
                  <StatCard 
                    icon={Zap} 
                    label="Fire Rate" 
                    value={weapon.weaponStats.fireRate?.toFixed(2) || "N/A"} 
                    unit="rounds/sec"
                    index={0}
                  />
                  <StatCard 
                    icon={Box} 
                    label="Magazine Size" 
                    value={weapon.weaponStats.magazineSize?.toString() || "N/A"} 
                    unit="rounds"
                    index={1}
                  />
                  <StatCard 
                    icon={Clock} 
                    label="Reload Time" 
                    value={weapon.weaponStats.reloadTimeSeconds?.toFixed(2) || "N/A"} 
                    unit="seconds"
                    index={2}
                  />
                  <StatCard 
                    icon={Move} 
                    label="Run Speed" 
                    value={((weapon.weaponStats.runSpeedMultiplier || 1) * 100).toFixed(0)} 
                    unit="% base"
                    index={3}
                  />
                  <StatCard 
                    icon={Target} 
                    label="Wall Penetration" 
                    value={weapon.weaponStats.wallPenetration?.replace("EWallPenetrationDisplayType::", "") || "N/A"}
                    index={4}
                  />
                  <StatCard 
                    icon={Target} 
                    label="First Bullet Accuracy" 
                    value={weapon.weaponStats.firstBulletAccuracy?.toFixed(2) || "N/A"} 
                    unit="degrees"
                    index={5}
                  />
                </div>
              </FadeIn>
            )}

            {/* Damage Ranges */}
            {weapon.weaponStats?.damageRanges && weapon.weaponStats.damageRanges.length > 0 && (
              <FadeIn delay={350}>
                <div className="mt-8">
                  <h2 className="font-[var(--font-display)] text-lg font-bold text-foreground mb-4 tracking-wider">
                    DAMAGE RANGES
                  </h2>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-card">
                          <th className="py-3 px-4 text-left text-muted-foreground font-medium">Range</th>
                          <th className="py-3 px-4 text-center text-primary font-medium">Head</th>
                          <th className="py-3 px-4 text-center text-foreground font-medium">Body</th>
                          <th className="py-3 px-4 text-center text-muted-foreground font-medium">Leg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weapon.weaponStats.damageRanges.map((range, index) => (
                          <tr 
                            key={index} 
                            className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="py-3 px-4 text-foreground">
                              {range.rangeStartMeters}m - {range.rangeEndMeters}m
                            </td>
                            <td className="py-3 px-4 text-center text-primary font-semibold">
                              {range.headDamage.toFixed(0)}
                            </td>
                            <td className="py-3 px-4 text-center text-foreground font-semibold">
                              {range.bodyDamage.toFixed(0)}
                            </td>
                            <td className="py-3 px-4 text-center text-muted-foreground">
                              {range.legDamage.toFixed(0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>

        {/* Skins Section */}
        {skins.length > 0 && (
          <FadeIn delay={400}>
            <div className="mt-16">
              <Tabs defaultValue="skins" className="w-full">
                <TabsList className="bg-secondary border border-border mb-8">
                  <TabsTrigger value="skins" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Skins ({skins.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="skins" className="animate-scale-in">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Skin Preview */}
                    <div className="lg:col-span-2">
                      <div className="aspect-video bg-gradient-to-br from-secondary to-card rounded-xl border border-border p-8 flex items-center justify-center group hover:border-primary/30 transition-colors">
                        {(currentChroma?.fullRender || currentSkin?.displayIcon) && (
                          <Image
                            src={currentChroma?.fullRender || currentSkin?.displayIcon || ""}
                            alt={currentSkin?.displayName || "Skin"}
                            width={600}
                            height={200}
                            className="object-contain max-h-full group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>

                      {/* Chroma selector */}
                      {currentSkin?.chromas && currentSkin.chromas.length > 1 && (
                        <div className="mt-4 flex gap-2">
                          {currentSkin.chromas.map((chroma, index) => (
                            <button
                              key={chroma.uuid}
                              onClick={() => setSelectedChroma(index)}
                              className={cn(
                                "w-10 h-10 rounded-lg border-2 overflow-hidden transition-all hover:scale-110",
                                selectedChroma === index 
                                  ? "border-primary shadow-lg shadow-primary/25" 
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              {chroma.swatch ? (
                                <Image
                                  src={chroma.swatch}
                                  alt={chroma.displayName}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-secondary flex items-center justify-center text-xs">
                                  {index + 1}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="mt-4">
                        <h3 className="font-semibold text-foreground text-lg">
                          {currentSkin?.displayName}
                        </h3>
                        {currentChroma && currentChroma.displayName !== currentSkin?.displayName && (
                          <p className="text-sm text-muted-foreground">{currentChroma.displayName}</p>
                        )}
                      </div>
                    </div>

                    {/* Skin List */}
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                      {skins.map((skin, index) => (
                        <button
                          key={skin.uuid}
                          onClick={() => {
                            setSelectedSkin(index)
                            setSelectedChroma(0)
                          }}
                          className={cn(
                            "w-full p-4 rounded-lg border text-left transition-all duration-300 hover:scale-[1.02]",
                            selectedSkin === index
                              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                              : "border-border hover:border-primary/50 bg-card"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            {(skin.displayIcon || skin.chromas?.[0]?.fullRender) && (
                              <div className="w-20 h-12 flex items-center justify-center shrink-0">
                                <Image
                                  src={skin.displayIcon || skin.chromas?.[0]?.fullRender || ""}
                                  alt={skin.displayName}
                                  width={80}
                                  height={40}
                                  className="object-contain max-h-full"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {skin.displayName}
                              </p>
                              {skin.chromas.length > 1 && (
                                <p className="text-xs text-muted-foreground">
                                  {skin.chromas.length} chromas
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  )
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  unit,
  index = 0
}: { 
  icon: typeof Zap
  label: string
  value: string
  unit?: string
  index?: number
}) {
  return (
    <div 
      className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon size={16} className="text-primary group-hover:animate-pulse" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  )
}
