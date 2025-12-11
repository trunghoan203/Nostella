"use client"

import { useState } from "react"
import { MapPin, Calendar, Heart, Sparkles, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/empty-state"
import { PhotoWithMeta, usePhotosStore } from "@/lib/photos-store"

interface GalleryProps {
  photos: PhotoWithMeta[]
  onPhotoClick: (photo: PhotoWithMeta) => void
  searchQuery?: string
  onUploadClick?: () => void
}

export function Gallery({ photos, onPhotoClick, searchQuery, onUploadClick }: GalleryProps) {
  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <header className="mb-6 md:mb-8">
        <h1 className="font-serif text-2xl md:text-4xl font-semibold text-foreground mb-1 md:mb-2 text-balance">
          Your Memories
        </h1>
        <p className="text-muted-foreground text-sm md:text-lg">{photos.length} precious moments captured</p>
      </header>

      {photos.length === 0 ? (
        <EmptyState type={searchQuery ? "search" : "gallery"} searchQuery={searchQuery} onUploadClick={onUploadClick} />
      ) : (
        /* Masonry Grid - already responsive via CSS */
        <div className="masonry-grid">
          {photos.map((photo, index) => (
            <MemoryCard key={photo.id} photo={photo} index={index} onClick={() => onPhotoClick(photo)} />
          ))}
        </div>
      )}
    </div>
  )
}

interface MemoryCardProps {
  photo: PhotoWithMeta
  index: number
  onClick: () => void
}

function MemoryCard({ photo, index, onClick }: MemoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { toggleFavorite } = usePhotosStore()
  const isLiked = photo.isFavorite
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await toggleFavorite(photo.id)
    } catch (error) {
      console.error("Failed to toggle favorite", error)
    }
  }

  return (
    <div className="masonry-item animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
      <div
        className={cn(
          "group relative rounded-2xl overflow-hidden cursor-pointer",
          "bg-card shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
          "transition-all duration-300 ease-out",
          isHovered && "shadow-[0_8px_30px_rgba(0,0,0,0.1)] -translate-y-1",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={photo.imageUrl || "/placeholder.svg"}
            alt={photo.title}
            className={cn("w-full h-auto object-cover transition-transform duration-500", isHovered && "scale-105")}
          />

          {/* Gradient Overlay on Hover */}
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-transparent",
              "transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          />

          {/* Metadata on Hover */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-3 md:p-4",
              "transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            <h3 className="font-serif text-base md:text-lg font-medium text-primary-foreground mb-1 text-balance">
              {photo.title}
            </h3>
            <div className="flex items-center gap-2 md:gap-3 text-primary-foreground/80 text-xs md:text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                {photo.date}
              </span>
              {photo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  {photo.location}
                </span>
              )}
              {photo.description && (
                <span className="flex items-center gap-1" title="Has personal note">
                  <FileText className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </span>
              )}
            </div>
          </div>

          {/* Favorite Button - Always visible on mobile */}
          <button
            onClick={handleToggleFavorite} 
            className={cn(
              "absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-9 md:h-9 rounded-full",
              "flex items-center justify-center",
              "transition-all duration-300",
              isHovered || isLiked ? "opacity-100" : "md:opacity-0 opacity-100",
              isLiked ? "bg-accent text-accent-foreground" : "bg-card/80 text-foreground backdrop-blur-sm",
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </button>

          <div
            className={cn(
              "absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-1.5",
              "transition-opacity duration-300",
              isHovered ? "opacity-100" : "md:opacity-0 opacity-100",
            )}
          >
            {/* AI Badge */}
            {photo.hasAiStory && (
              <div className="ai-shimmer p-px rounded-full">
                <div className="bg-card px-2 py-0.5 md:px-2.5 md:py-1 rounded-full flex items-center gap-1 md:gap-1.5">
                  <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary" />
                  <span className="text-[10px] md:text-xs font-medium text-foreground">AI Story</span>
                </div>
              </div>
            )}
            {/* Description Badge */}
            {photo.description && (
              <div className="bg-card/90 backdrop-blur-sm px-2 py-0.5 md:px-2.5 md:py-1 rounded-full flex items-center gap-1 md:gap-1.5 border border-border/50">
                <FileText className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground" />
                <span className="text-[10px] md:text-xs font-medium text-foreground">Note</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
