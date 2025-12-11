"use client"

import { Images, Clock, Upload, Heart, Settings, ChevronLeft, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SearchFilter, type SearchFilters } from "@/components/search-filter"

type ViewType = "gallery" | "timeline" | "upload" | "favorites" | "settings"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  currentView: string
  onViewChange: (view: ViewType) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  availableYears: string[]
}

const navItems = [
  { icon: Images, label: "Gallery", view: "gallery" as const },
  { icon: Clock, label: "Timeline", view: "timeline" as const },
  { icon: Upload, label: "Upload", view: "upload" as const },
]

const secondaryItems = [
  { icon: Heart, label: "Favorites", view: "favorites" as const },
  { icon: Settings, label: "Settings", view: "settings" as const },
]

export function Sidebar({
  collapsed,
  onToggle,
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  availableYears,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen glass border-r border-sidebar-border z-40",
        "transition-all duration-300 ease-out",
        "hidden md:flex md:flex-col",
        collapsed ? "w-20" : "w-72",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-secondary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-serif text-xl font-semibold text-foreground tracking-tight">Nostella</h1>
            <p className="text-xs text-muted-foreground">Memory Keeper</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="p-4">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            filters={filters}
            onFiltersChange={onFiltersChange}
            availableYears={availableYears}
          />
        </div>
      )}

      {/* Main Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              "hover:bg-sidebar-accent",
              currentView === item.view
                ? "bg-secondary text-secondary-foreground shadow-sm"
                : "text-sidebar-foreground",
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-sidebar-border" />

      {/* Secondary Navigation */}
      <nav className="p-4 space-y-2">
        {secondaryItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onViewChange(item.view)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              "hover:bg-sidebar-accent",
              currentView === item.view
                ? "bg-secondary text-secondary-foreground shadow-sm"
                : "text-muted-foreground hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute bottom-6 right-4 w-8 h-8 rounded-full hover:bg-sidebar-accent"
      >
        <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", collapsed && "rotate-180")} />
      </Button>
    </aside>
  )
}
