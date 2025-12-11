"use client"

import { useRef, useEffect, useState } from "react"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/empty-state"
import type { PhotoWithMeta } from "@/lib/photos-store"

interface TimelineViewProps {
  photos: PhotoWithMeta[]
  onPhotoClick: (photo: PhotoWithMeta) => void
  searchQuery?: string
  onUploadClick?: () => void
}

export function TimelineView({ photos, onPhotoClick, searchQuery, onUploadClick }: TimelineViewProps) {
  const [activeYear, setActiveYear] = useState<string>("")
  const containerRef = useRef<HTMLDivElement>(null)

  const groupedPhotos = photos.reduce(
    (acc, photo) => {
      const year = photo.year
      const month = photo.month
      if (!acc[year]) acc[year] = {}
      if (!acc[year][month]) acc[year][month] = []
      acc[year][month].push(photo)
      return acc
    },
    {} as Record<string, Record<string, PhotoWithMeta[]>>,
  )

  const years = Object.keys(groupedPhotos).sort((a, b) => Number(b) - Number(a))

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const sections = containerRef.current.querySelectorAll("[data-year]")
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom > 150) {
          setActiveYear(section.getAttribute("data-year") || "")
        }
      })
    }

    const container = containerRef.current
    container?.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => container?.removeEventListener("scroll", handleScroll)
  }, [])

  if (photos.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <EmptyState
          type={searchQuery ? "search" : "timeline"}
          searchQuery={searchQuery}
          onUploadClick={onUploadClick}
        />
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <div className="w-24 shrink-0 border-r border-border/50 bg-card/30 backdrop-blur-sm p-4 flex flex-col items-center gap-2 pt-24 relative">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-secondary/5 via-transparent to-accent/5 pointer-events-none" />

        {years.map((year) => (
          <button
            key={year}
            onClick={() => {
              const element = containerRef.current?.querySelector(`[data-year="${year}"]`)
              element?.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
            className={cn(
              "relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300",
              activeYear === year
                ? "bg-secondary text-secondary-foreground shadow-md scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            {year}
            {/* Active indicator dot */}
            {activeYear === year && (
              <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Timeline Content */}
      <div ref={containerRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className="p-8 relative">
          {/* Header */}
          <header className="mb-12">
            <h1 className="font-serif text-4xl font-semibold text-foreground mb-2 text-balance">Memory Lane</h1>
            <p className="text-muted-foreground text-lg">Journey through your memories over time</p>
          </header>

          <div className="absolute left-11 top-48 bottom-8 w-0.5 bg-linear-to-b from-secondary/60 via-border to-accent/40" />

          {/* Timeline Content */}
          <div className="space-y-16">
            {years.map((year) => (
              <section key={year} data-year={year}>
                <div className="sticky top-0 z-10 py-4 mb-8 -mx-8 px-8">
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border/30" />
                  <div className="relative flex items-center gap-4">
                    {/* Year dot with ring effect */}
                    <div className="relative">
                      <div
                        className="absolute inset-0 w-8 h-8 rounded-full bg-secondary/20 animate-ping"
                        style={{ animationDuration: "3s" }}
                      />
                      <div className="w-8 h-8 rounded-full bg-secondary border-4 border-background shadow-lg z-10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-secondary-foreground/60" />
                      </div>
                    </div>
                    <h2 className="font-serif text-3xl font-semibold text-foreground">{year}</h2>
                    {/* Year summary badge */}
                    <span className="ml-auto text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                      {Object.values(groupedPhotos[year]).flat().length} memories
                    </span>
                  </div>
                </div>

                {/* Months */}
                <div className="space-y-12 pl-12">
                  {Object.entries(groupedPhotos[year])
                    .sort(([a], [b]) => Number(b) - Number(a))
                    .map(([month, monthPhotos]) => (
                      <div key={month} className="relative">
                        <div className="flex items-center gap-3 mb-6">
                          {/* Month connector dot */}
                          <div className="relative -ml-7.5">
                            <div className="w-3 h-3 rounded-full bg-accent/60 border-2 border-background" />
                            {/* Connector line to cards */}
                            <div className="absolute top-1.5 left-3 w-4 h-px bg-border" />
                          </div>
                          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/50">
                            <h3 className="text-lg font-medium text-foreground">{getMonthName(month)}</h3>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              {monthPhotos.length}
                            </span>
                          </div>
                        </div>

                        {/* Photos Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {monthPhotos.map((photo, idx) => (
                            <TimelineCard
                              key={photo.id}
                              photo={photo}
                              index={idx}
                              onClick={() => onPhotoClick(photo)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>

          <div className="flex flex-col items-center mt-16 pt-8 border-t border-dashed border-border/50">
            <div className="w-4 h-4 rounded-full bg-muted border-2 border-border mb-3" />
            <p className="text-sm text-muted-foreground italic">The beginning of your journey</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TimelineCardProps {
  photo: PhotoWithMeta
  index: number
  onClick: () => void
}

function TimelineCard({ photo, index, onClick }: TimelineCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
      <div
        className={cn(
          "group relative rounded-xl overflow-hidden cursor-pointer aspect-square",
          "bg-card shadow-[0_2px_10px_rgba(0,0,0,0.04)]",
          "transition-all duration-300 ease-out",
          isHovered && "shadow-[0_4px_20px_rgba(0,0,0,0.08)] -translate-y-0.5",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <img
          src={photo.imageUrl || "/placeholder.svg"}
          alt={photo.title}
          className={cn("w-full h-full object-cover transition-transform duration-500", isHovered && "scale-105")}
        />

        <div
          className={cn(
            "absolute inset-0 bg-linear-to-t from-foreground/50 via-transparent to-transparent",
            "transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-3",
            "transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          )}
        >
          <p className="text-sm font-medium text-primary-foreground truncate">{photo.title}</p>
          {/* Date display */}
          <p className="text-xs text-primary-foreground/70 mt-0.5">{photo.date}</p>
        </div>

        {photo.description && (
          <div
            className={cn(
              "absolute top-2 left-2 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full",
              "flex items-center gap-1 border border-border/50",
              "transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <FileText className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-medium text-foreground">Note</span>
          </div>
        )}
      </div>
    </div>
  )
}

function getMonthName(month: string): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[Number.parseInt(month) - 1] || month
}
