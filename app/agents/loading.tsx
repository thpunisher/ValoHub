import { AgentsGridSkeleton } from "@/components/ui/skeletons"

export default function AgentsLoading() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-muted rounded mb-2" />
          <div className="h-12 w-64 bg-muted rounded mb-4" />
          <div className="h-6 w-96 bg-muted rounded" />
        </div>
      </div>
      <AgentsGridSkeleton />
    </div>
  )
}
