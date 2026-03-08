"use client"

import { cn } from "@/lib/utils"

// Base skeleton with shimmer effect
export function Skeleton({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg bg-muted",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        "before:animate-[shimmer_2s_infinite]",
        className
      )}
    />
  )
}

// Agent card skeleton
export function AgentCardSkeleton() {
  return (
    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary border border-border">
      {/* Role badge skeleton */}
      <div className="absolute top-3 left-3 z-10">
        <Skeleton className="w-8 h-8 rounded-md" />
      </div>
      
      {/* Portrait skeleton */}
      <Skeleton className="absolute inset-0" />
      
      {/* Name area skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

// Agents grid skeleton
export function AgentsGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Filter skeleton */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <Skeleton className="h-12 w-full max-w-md" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
      </div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <AgentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// Weapon card skeleton
export function WeaponCardSkeleton() {
  return (
    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-secondary border border-border p-4">
      <Skeleton className="absolute top-4 right-4 h-6 w-16 rounded-full" />
      <Skeleton className="h-full w-full" />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

// Map card skeleton
export function MapCardSkeleton() {
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary border border-border">
      <Skeleton className="absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

// Stats skeleton
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="text-center p-6 rounded-xl bg-card border border-border">
          <Skeleton className="h-10 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-20 mx-auto" />
        </div>
      ))}
    </div>
  )
}

// Full page loading
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-48 mb-4" />
        <Skeleton className="h-6 w-96 mb-12" />
        <AgentsGridSkeleton />
      </div>
    </div>
  )
}
