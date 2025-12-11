"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, X, Calendar, Heart, FileText, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface SearchFilters {
  startYear: string | null
  endYear: string | null
  favoritesOnly: boolean
  hasDescription: boolean
}

interface SearchFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  availableYears: string[]
  className?: string
  compact?: boolean
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  availableYears,
  className,
  compact = false,
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.startYear || filters.endYear) count++
    if (filters.favoritesOnly) count++
    if (filters.hasDescription) count++
    return count
  }, [filters])

  const clearFilters = () => {
    onFiltersChange({
      startYear: null,
      endYear: null,
      favoritesOnly: false,
      hasDescription: false,
    })
  }

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  // Generate year options
  const currentYear = new Date().getFullYear()
  const yearOptions =
    availableYears.length > 0
      ? availableYears.sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
      : Array.from({ length: 50 }, (_, i) => (currentYear - i).toString())

  return (
    <div className={cn("space-y-2", className)}>
      {/* Search Input with Filter Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all",
            )}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-xl border-border h-[42px] w-[42px] relative",
                activeFilterCount > 0 && "border-secondary bg-secondary/10",
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-0 rounded-2xl border-border glass"
            align={compact ? "end" : "start"}
            sideOffset={8}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm">Filters</span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Filter Options */}
            <div className="p-4 space-y-5">
              {/* Date Range */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>Date Range</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">From Year</Label>
                    <Select
                      value={filters.startYear || "any"}
                      onValueChange={(value) => updateFilter("startYear", value === "any" ? null : value)}
                    >
                      <SelectTrigger className="rounded-xl bg-muted/50 border-border h-9">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="any">Any</SelectItem>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">To Year</Label>
                    <Select
                      value={filters.endYear || "any"}
                      onValueChange={(value) => updateFilter("endYear", value === "any" ? null : value)}
                    >
                      <SelectTrigger className="rounded-xl bg-muted/50 border-border h-9">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="any">Any</SelectItem>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Toggle Filters */}
              <div className="space-y-3">
                {/* Favorites Only */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart
                      className={cn(
                        "w-4 h-4",
                        filters.favoritesOnly ? "text-red-500 fill-red-500" : "text-muted-foreground",
                      )}
                    />
                    <Label htmlFor="favorites-filter" className="text-sm cursor-pointer">
                      Favorites only
                    </Label>
                  </div>
                  <Switch
                    id="favorites-filter"
                    checked={filters.favoritesOnly}
                    onCheckedChange={(checked) => updateFilter("favoritesOnly", checked)}
                    className="data-[state=checked]:bg-secondary"
                  />
                </div>

                {/* Has Description */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText
                      className={cn("w-4 h-4", filters.hasDescription ? "text-secondary" : "text-muted-foreground")}
                    />
                    <Label htmlFor="description-filter" className="text-sm cursor-pointer">
                      With personal notes
                    </Label>
                  </div>
                  <Switch
                    id="description-filter"
                    checked={filters.hasDescription}
                    onCheckedChange={(checked) => updateFilter("hasDescription", checked)}
                    className="data-[state=checked]:bg-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30">
              <Button
                onClick={() => setIsFilterOpen(false)}
                className="w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Check className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && !compact && (
        <div className="flex flex-wrap gap-1.5">
          {(filters.startYear || filters.endYear) && (
            <Badge
              variant="secondary"
              className="rounded-full text-xs gap-1 pr-1 bg-secondary/20 hover:bg-secondary/30"
            >
              <Calendar className="w-3 h-3" />
              {filters.startYear || "Any"} - {filters.endYear || "Now"}
              <button
                onClick={() => {
                  updateFilter("startYear", null)
                  updateFilter("endYear", null)
                }}
                className="ml-1 rounded-full hover:bg-secondary/50 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.favoritesOnly && (
            <Badge
              variant="secondary"
              className="rounded-full text-xs gap-1 pr-1 bg-secondary/20 hover:bg-secondary/30"
            >
              <Heart className="w-3 h-3 fill-current" />
              Favorites
              <button
                onClick={() => updateFilter("favoritesOnly", false)}
                className="ml-1 rounded-full hover:bg-secondary/50 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.hasDescription && (
            <Badge
              variant="secondary"
              className="rounded-full text-xs gap-1 pr-1 bg-secondary/20 hover:bg-secondary/30"
            >
              <FileText className="w-3 h-3" />
              With notes
              <button
                onClick={() => updateFilter("hasDescription", false)}
                className="ml-1 rounded-full hover:bg-secondary/50 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
