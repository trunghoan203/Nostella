"use client"

import { Search, Sparkles } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { SearchFilter, type SearchFilters } from "@/components/search-filter"

interface MobileHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  availableYears: string[]
}

export function MobileHeader({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  availableYears,
}: MobileHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const activeFilterCount =
    (filters.startYear || filters.endYear ? 1 : 0) + (filters.favoritesOnly ? 1 : 0) + (filters.hasDescription ? 1 : 0)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 md:hidden">
      <div className="glass border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-secondary-foreground" />
            </div>
            <h1 className="font-serif text-lg font-semibold text-foreground">Nostella</h1>
          </div>

          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-colors relative",
              isSearchOpen ? "bg-secondary text-secondary-foreground" : "hover:bg-muted",
            )}
          >
            <Search className="w-4 h-4" />
            {(activeFilterCount > 0 || searchQuery) && !isSearchOpen && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-background" />
            )}
          </button>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            isSearchOpen ? "max-h-24 mt-3 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            filters={filters}
            onFiltersChange={onFiltersChange}
            availableYears={availableYears}
            compact
          />
        </div>
      </div>
    </header>
  )
}
