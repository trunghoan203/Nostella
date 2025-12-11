"use client"

import { Images, Clock, Upload, Heart, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewType = "gallery" | "timeline" | "upload" | "favorites" | "settings"

interface MobileNavProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const navItems = [
  { icon: Images, label: "Gallery", view: "gallery" as const },
  { icon: Clock, label: "Timeline", view: "timeline" as const },
  { icon: Upload, label: "Upload", view: "upload" as const, isFab: true },
  { icon: Heart, label: "Favorites", view: "favorites" as const },
  { icon: Settings, label: "Settings", view: "settings" as const },
]

export function MobileNav({ currentView, onViewChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glassmorphism background */}
      <div className="glass border-t border-sidebar-border">
        <div className="flex items-center justify-around px-2 py-2 relative">
          {navItems.map((item) => {
            const isActive = currentView === item.view

            // FAB style for Upload button
            if (item.isFab) {
              return (
                <button
                  key={item.view}
                  onClick={() => onViewChange(item.view)}
                  className={cn(
                    "relative -top-5 flex flex-col items-center justify-center",
                    "w-14 h-14 rounded-full",
                    "shadow-lg transition-all duration-300",
                    isActive
                      ? "bg-secondary text-secondary-foreground scale-110"
                      : "bg-card text-foreground hover:bg-secondary/80",
                  )}
                >
                  <item.icon className="w-6 h-6" />
                </button>
              )
            }

            return (
              <button
                key={item.view}
                onClick={() => onViewChange(item.view)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl",
                  "transition-all duration-200",
                  isActive ? "text-secondary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "scale-110")} />
                <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-background/80 backdrop-blur-sm" />
    </nav>
  )
}
