import { Skeleton } from "@/components/ui/skeleton"

export function GallerySkeleton() {
  // Create varied heights for masonry effect
  const skeletonHeights = [
    "h-64",
    "h-80",
    "h-56",
    "h-72",
    "h-64",
    "h-96",
    "h-72",
    "h-56",
    "h-80",
    "h-64",
    "h-72",
    "h-56",
  ]

  return (
    <div className="p-8">
      {/* Header skeleton */}
      <header className="mb-8">
        <Skeleton className="h-10 w-56 mb-3 rounded-xl" />
        <Skeleton className="h-5 w-40 rounded-lg" />
      </header>

      {/* Masonry grid skeleton */}
      <div className="masonry-grid">
        {skeletonHeights.map((height, index) => (
          <div key={index} className="masonry-item animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="relative rounded-2xl overflow-hidden bg-card shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <Skeleton className={`w-full ${height} rounded-2xl`} />

              {/* Shimmer overlay for polish */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TimelineSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Year navigation skeleton */}
      <div className="w-24 shrink-0 border-r border-border p-4 flex flex-col items-center gap-2 pt-24">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-9 w-14 rounded-xl" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <header className="mb-12">
            <Skeleton className="h-10 w-48 mb-3 rounded-xl" />
            <Skeleton className="h-5 w-64 rounded-lg" />
          </header>

          {/* Timeline content */}
          <div className="space-y-12 pl-12">
            {[1, 2].map((year) => (
              <div key={year}>
                <Skeleton className="h-8 w-20 mb-8 rounded-lg" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="aspect-square rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
