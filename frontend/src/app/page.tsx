"use client"

import { useState, useEffect, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { MobileHeader } from "@/components/mobile-header"
import { Gallery } from "@/components/gallery"
import { PhotoModal } from "@/components/photo-modal"
import { UploadZone } from "@/components/upload-zone"
import { TimelineView } from "@/components/timeline-view"
import { FavoritesView } from "@/components/favorites-view"
import { SettingsView } from "@/components/settings-view"
import { GallerySkeleton, TimelineSkeleton } from "@/components/skeletons/gallery-skeleton"
import { useAuthStore } from "@/lib/auth-store"
import { usePhotosStore, type PhotoWithMeta } from "@/lib/photos-store"
import { LandingPage } from "@/components/landing-page"
import type { SearchFilters } from "@/components/search-filter"

type ViewType = "gallery" | "timeline" | "upload" | "favorites" | "settings"

export default function HomePage() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithMeta | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>("gallery")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [filters, setFilters] = useState<SearchFilters>({
    startYear: null,
    endYear: null,
    favoritesOnly: false,
    hasDescription: false,
  })

  const { access_token } = useAuthStore()
  const { photos, isLoading, fetchPhotos } = usePhotosStore()

  useEffect(() => {
  queueMicrotask(() => setIsHydrated(true))
}, [])

  useEffect(() => {
    if (!isHydrated) return
    if (!access_token) return

    fetchPhotos()
  }, [isHydrated, access_token, fetchPhotos])

  const availableYears = useMemo(() => {
    const years = new Set(photos.map((photo) => photo.year))
    return Array.from(years).sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
  }, [photos])

  const filteredPhotos = useMemo(() => {
    let result = photos

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (photo) =>
          photo.title?.toLowerCase().includes(query) ||
          photo.caption?.toLowerCase().includes(query) ||
          photo.location?.toLowerCase().includes(query) ||
          photo.description?.toLowerCase().includes(query),
      )
    }

    // Date range filter
    if (filters.startYear) {
      result = result.filter((photo) => Number.parseInt(photo.year) >= Number.parseInt(filters.startYear!))
    }
    if (filters.endYear) {
      result = result.filter((photo) => Number.parseInt(photo.year) <= Number.parseInt(filters.endYear!))
    }

    // Favorites only filter
    if (filters.favoritesOnly) {
      result = result.filter((photo) => photo.isFavorite)
    }

    // Has description filter
    if (filters.hasDescription) {
      result = result.filter((photo) => photo.description && photo.description.trim().length > 0)
    }

    return result
  }, [photos, searchQuery, filters])

  const favoritePhotos = useMemo(() => {
    // If we're already filtering by favorites, just return filteredPhotos
    if (filters.favoritesOnly) {
      return filteredPhotos
    }
    // Otherwise, filter from the already filtered list
    return filteredPhotos.filter((photo) => photo.isFavorite)
  }, [filteredPhotos, filters.favoritesOnly])

  const handleUploadClick = () => setCurrentView("upload")

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen bg-background paper-texture">
        <div className="hidden md:block w-72 bg-card/50 border-r border-border" />
        <main className="flex-1 pt-16 md:pt-0 pb-20 md:pb-0">
          <GallerySkeleton />
        </main>
      </div>
    )
  }

  if (!access_token) {
    return <LandingPage />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background paper-texture">
        {/* Mobile Header */}
        <MobileHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
          availableYears={availableYears}
        />

        {/* Desktop Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentView={currentView}
          onViewChange={setCurrentView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
          availableYears={availableYears}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 pt-16 md:pt-0 pb-20 md:pb-0 ${sidebarCollapsed ? "md:ml-20" : "md:ml-72"}`}
        >
          {currentView === "timeline" ? <TimelineSkeleton /> : <GallerySkeleton />}
        </main>

        {/* Mobile Nav */}
        <MobileNav currentView={currentView} onViewChange={setCurrentView} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background paper-texture">
      {/* Mobile Header - with filter props */}
      <MobileHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        availableYears={availableYears}
      />

      {/* Desktop Sidebar - with filter props */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        availableYears={availableYears}
      />

      <main
        className={`flex-1 transition-all duration-300 pt-16 md:pt-0 pb-20 md:pb-0 ${sidebarCollapsed ? "md:ml-20" : "md:ml-72"}`}
      >
        {currentView === "gallery" && (
          <Gallery
            photos={filteredPhotos}
            onPhotoClick={setSelectedPhoto}
            searchQuery={searchQuery}
            onUploadClick={handleUploadClick}
          />
        )}
        {currentView === "timeline" && (
          <TimelineView
            photos={filteredPhotos}
            onPhotoClick={setSelectedPhoto}
            searchQuery={searchQuery}
            onUploadClick={handleUploadClick}
          />
        )}
        {currentView === "upload" && <UploadZone />}
        {currentView === "favorites" && <FavoritesView photos={favoritePhotos} onPhotoClick={setSelectedPhoto} />}
        {currentView === "settings" && <SettingsView />}
      </main>

      {/* Mobile Navigation */}
      <MobileNav currentView={currentView} onViewChange={setCurrentView} />

      {selectedPhoto && <PhotoModal memory={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </div>
  )
}
