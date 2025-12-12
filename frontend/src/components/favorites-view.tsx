"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Calendar, Heart, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/empty-state"
import { usePhotosStore, type PhotoWithMeta } from "@/lib/photos-store"
import Image from "next/image"

interface FavoritesViewProps {
  photos: PhotoWithMeta[]
  onPhotoClick: (photo: PhotoWithMeta) => void
}

export function FavoritesView({ photos, onPhotoClick }: FavoritesViewProps) {
  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-accent fill-accent" />
          </div>
          <h1 className="font-serif text-4xl font-semibold text-foreground text-balance">Favorites</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {photos.length} {photos.length === 1 ? "cherished memory" : "cherished memories"}
        </p>
      </header>

      {photos.length === 0 ? (
        <EmptyState type="favorites" />
      ) : (
        /* Masonry Grid - Same as Gallery */
        <div className="masonry-grid">
          {photos.map((photo, index) => (
            <FavoriteCard key={photo.id} photo={photo} index={index} onClick={() => onPhotoClick(photo)} />
          ))}
        </div>
      )}
    </div>
  )
}

interface FavoriteCardProps {
  photo: PhotoWithMeta
  index: number
  onClick: () => void
}

function FavoriteCard({ photo, index, onClick }: FavoriteCardProps) {
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
          <Image
            src={photo.imageUrl}
            alt={photo.title || "Photo"}
            fill={false}
            width={800}
            height={600}
            className={cn(
              "w-full h-auto object-cover transition-transform duration-500",
              isHovered && "scale-105"
            )}
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
              "absolute bottom-0 left-0 right-0 p-4",
              "transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            <h3 className="font-serif text-lg font-medium text-primary-foreground mb-1 text-balance">{photo.title}</h3>
            <div className="flex items-center gap-3 text-primary-foreground/80 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {photo.date}
              </span>
              {photo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {photo.location}
                </span>
              )}
            </div>
          </div>

          {/* Favorite Button - Always visible since these are favorites */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-accent text-accent-foreground transition-all duration-300 hover:scale-110"
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </button>

          {/* AI Badge */}
          {photo.hasAiStory && (
            <div
              className={cn(
                "absolute top-3 left-3",
                "transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="ai-shimmer p-px rounded-full">
                <div className="bg-card px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-xs font-medium text-foreground">AI Story</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
