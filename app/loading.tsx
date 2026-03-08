export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="relative">
        {/* Animated logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-primary rotate-45 animate-pulse" />
            <div className="absolute inset-0 w-12 h-12 bg-primary/30 rotate-45 animate-ping" />
          </div>
          <div>
            <span className="font-[var(--font-display)] text-2xl font-bold tracking-wider text-foreground">
              VALO<span className="text-primary">BASE</span>
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground tracking-widest">LOADING</span>
              <span className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
