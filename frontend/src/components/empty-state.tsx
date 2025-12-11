"use client"
import { Camera, Heart, Upload, Sparkles, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  type: "gallery" | "timeline" | "favorites" | "search"
  searchQuery?: string
  onUploadClick?: () => void
}

export function EmptyState({ type, searchQuery, onUploadClick }: EmptyStateProps) {
  const configs = {
    gallery: {
      icon: Camera,
      title: "No memories yet",
      description:
        "Your gallery is waiting to be filled with precious moments. Start capturing memories that will last a lifetime.",
      quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
      showUpload: true,
    },
    timeline: {
      icon: Sparkles,
      title: "Your timeline awaits",
      description:
        "As you add memories, they'll appear here organized by time. Watch your story unfold chronologically.",
      quote: "Life is not measured by the breaths we take, but by the moments that take our breath away.",
      showUpload: true,
    },
    favorites: {
      icon: Heart,
      title: "No favorites yet",
      description: "When you find memories that touch your heart, mark them as favorites and they'll appear here.",
      quote: "The heart has its reasons which reason knows nothing of.",
      showUpload: false,
    },
    search: {
      icon: ImagePlus,
      title: "No memories found",
      description: searchQuery
        ? `We couldn't find any memories matching "${searchQuery}". Try a different search term.`
        : "No memories match your current search.",
      quote: "Not all those who wander are lost.",
      showUpload: false,
    },
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      {/* Decorative background elements */}
      <div className="relative mb-8">
        {/* Floating decorative polaroids */}
        <div className="absolute -left-16 -top-8 w-16 h-20 bg-card rounded-lg shadow-md -rotate-12 opacity-40 border-4 border-white" />
        <div className="absolute -right-14 -top-4 w-14 h-18 bg-card rounded-lg shadow-md rotate-15 opacity-30 border-4 border-white" />
        <div className="absolute -left-8 top-12 w-12 h-16 bg-card rounded-lg shadow-md rotate-[8deg] opacity-20 border-4 border-white" />

        {/* Main icon container */}
        <div className="relative">
          <div className="absolute inset-0 w-28 h-28 rounded-full bg-secondary/10 blur-xl" />
          <div className="relative w-28 h-28 rounded-2xl bg-linear-to-br from-card to-muted flex items-center justify-center shadow-lg border border-border">
            <Icon className="w-12 h-12 text-secondary" />
          </div>
        </div>
      </div>

      {/* Content */}
      <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-3 text-balance">
        {config.title}
      </h3>

      <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">{config.description}</p>

      {/* Upload CTA */}
      {config.showUpload && onUploadClick && (
        <Button onClick={onUploadClick} size="lg" className="rounded-xl gap-2 mb-8">
          <Upload className="w-4 h-4" />
          Upload Your First Memory
        </Button>
      )}

      {/* Decorative divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-px bg-border" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
        <div className="w-8 h-px bg-border" />
      </div>

      {/* Inspirational quote */}
      <blockquote className="font-serif text-sm italic text-muted-foreground/80 max-w-sm">"{config.quote}"</blockquote>
    </div>
  )
}
