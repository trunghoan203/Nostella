"use client"

import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import {
  X,
  MapPin,
  Calendar,
  Heart,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  PenLine,
  BookOpen,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { usePhotosStore, type PhotoWithMeta } from "@/lib/photos-store"
import { AIStoryGenerator } from "@/components/ai-story-generator"
import { useAuthStore } from "@/lib/auth-store"

interface PhotoModalProps {
  memory: PhotoWithMeta
  onClose: () => void
}

export function PhotoModal({ memory, onClose }: PhotoModalProps) {
  const { user } = useAuthStore()
  const [currentId, setCurrentId] = useState(memory.id)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCaption, setEditedCaption] = useState(memory.title)
  const [editedDescription, setEditedDescription] = useState(memory.description || "")
  const [editedDate, setEditedDate] = useState<Date | undefined>(memory.takenAtDate)
  const [editedLocation, setEditedLocation] = useState(memory.location || "")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { deletePhoto, updatePhoto, toggleFavorite, photos } = usePhotosStore()

  const currentPhoto = photos.find((p) => p.id === currentId) || memory
  const currentIndex = photos.findIndex((p) => p.id === currentId)

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (currentIndex === -1) return
    // Nếu là ảnh cuối cùng -> quay về ảnh đầu (vòng lặp)
    const nextIndex = (currentIndex + 1) % photos.length
    setCurrentId(photos[nextIndex].id)
    setIsEditing(false) // Tắt chế độ edit khi chuyển ảnh
  }, [currentIndex, photos])

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (currentIndex === -1) return
    // Nếu là ảnh đầu tiên -> quay về ảnh cuối
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length
    setCurrentId(photos[prevIndex].id)
    setIsEditing(false)
  }, [currentIndex, photos])

  useEffect(() => {
    if (!isEditing) {
      setEditedCaption(currentPhoto.title)
      setEditedDescription(currentPhoto.description || "")
      setEditedDate(currentPhoto.takenAt ? new Date(currentPhoto.takenAt) : new Date(currentPhoto.createdAt))
      setEditedLocation(currentPhoto.location || "")
    }
  }, [currentPhoto, isEditing])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isEditing) {
        if (e.key === "Escape") setIsEditing(false)
        return
      }

      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrevious()
    },
    [onClose, isEditing, handleNext, handlePrevious],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleKeyDown])

  const handleFavorite = async () => {
    try {
      await toggleFavorite(currentPhoto.id)
      toast.success(currentPhoto.isFavorite ? "Removed from favorites" : "Added to favorites")
    } catch {
      toast.error("Failed to update favorite")
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(currentPhoto.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${currentPhoto.title.replace(/\s+/g, "-").toLowerCase()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success("Photo downloaded")
    } catch {
      toast.error("Failed to download photo")
    }
  }

  const handleSave = async () => {
    if (!editedCaption.trim()) {
      toast.error("Caption cannot be empty")
      return
    }
    setIsSaving(true)
    try {
      await updatePhoto(currentPhoto.id, {
        caption: editedCaption.trim(),
        description: editedDescription.trim() || undefined,
        takenAt: editedDate?.toISOString(),
        location: editedLocation.trim() || undefined,
      })
      setIsEditing(false)
      toast.success("Memory updated")
    } catch {
      toast.error("Failed to update memory")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      let nextIdToView: string | null = null
      if (photos.length > 1) {
         const nextIndex = (currentIndex + 1) % photos.length
         if (photos[nextIndex].id !== currentPhoto.id) {
            nextIdToView = photos[nextIndex].id
         }
      }

      await deletePhoto(currentPhoto.id)
      toast.success("Memory deleted")
      
      if (nextIdToView) {
        setCurrentId(nextIdToView)
      } else {
        onClose()
      }
    } catch {
      toast.error("Failed to delete memory")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedCaption(currentPhoto.title)
    setEditedDescription(currentPhoto.description || "")
    setEditedDate(currentPhoto.takenAtDate)
    setEditedLocation(currentPhoto.location || "")
    setIsEditing(false)
  }

  const handleStoryGenerated = (story: string) => {
    toast.success("Story generated successfully!")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/80 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full h-full md:max-w-7xl md:mx-auto md:p-4 lg:p-8 flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full md:max-h-[90vh] bg-card md:rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-in zoom-in-95 duration-300">
          {/* Image Section */}
          <div className="flex-1 relative bg-foreground/5 flex items-center justify-center min-h-0 md:min-h-[400px]">
            <img
              src={currentPhoto.imageUrl || "/placeholder.svg"}
              alt={currentPhoto.title}
              className="max-w-full max-h-full object-contain"
            />

            {/* Close button - Mobile only (top right) */}
            {/* Previous Button */}
            <button 
              onClick={handlePrevious}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card hover:scale-110 transition-all shadow-md z-20 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            {/* Next Button */}
            <button 
              onClick={handleNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card hover:scale-110 transition-all shadow-md z-20 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Details Panel */}
          <div className="w-full lg:w-[420px] shrink-0 border-t lg:border-t-0 lg:border-l border-border flex flex-col max-h-[55vh] md:max-h-full">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="space-y-4 md:space-y-5">
                      {/* Caption - Large input at top */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="caption"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Memory Title
                        </Label>
                        <Input
                          id="caption"
                          value={editedCaption}
                          onChange={(e) => setEditedCaption(e.target.value)}
                          className="font-serif text-base md:text-lg h-10 md:h-12 bg-muted/50 border-border rounded-xl focus:ring-2 focus:ring-secondary/50"
                          placeholder="Give this memory a title..."
                          autoFocus
                        />
                      </div>

                      {/* Meta Row - Date Picker and Location side by side */}
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        {/* Date Picker styled as metadata badge */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Date Taken
                          </Label>
                          <DatePicker 
                            date={editedDate} 
                            setDate={setEditedDate} 
                            placeholder="Pick a date"
                          />
                        </div>

                        {/* Location input */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="location"
                            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Location
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
                            <Input
                              id="location"
                              value={editedLocation}
                              onChange={(e) => setEditedLocation(e.target.value)}
                              className="pl-9 h-11 bg-muted/50 border-border rounded-xl text-sm"
                              placeholder="Where?"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description - Journal entry style */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Personal Note
                        </Label>
                        <Textarea
                          id="description"
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          className="min-h-20 md:min-h-[100px] resize-none rounded-xl border-border bg-amber-50/50 dark:bg-amber-950/20 font-serif text-sm md:text-base text-foreground/90 leading-relaxed placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-secondary/50"
                          placeholder="Write your thoughts about this memory..."
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.05) 28px)",
                            lineHeight: "28px",
                            paddingTop: "8px",
                          }}
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1 rounded-xl h-10 md:h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm md:text-base"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="rounded-xl h-10 md:h-11 bg-transparent text-sm md:text-base"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-2 md:mb-3 text-balance line-clamp-2">
                        {currentPhoto.title}
                      </h2>
                      {/* Prominent date display */}
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
                        <span className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-secondary/10 text-secondary font-medium">
                          <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          {currentPhoto.takenAtDate
                            ? format(currentPhoto.takenAtDate, "dd/MM/yyyy")
                            : currentPhoto.date}
                        </span>
                        {currentPhoto.location && (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground truncate max-w-[200px]">
                            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                            <span className="truncate">{currentPhoto.location}</span>
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {/* Close button - Desktop only */}
                <button
                  onClick={onClose}
                  className="hidden md:flex w-10 h-10 rounded-full hover:bg-muted items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
              {!isEditing && currentPhoto.description && (
                <div className="relative">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 md:mb-3 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    Personal Note
                  </h3>
                  <div className="relative rounded-xl md:rounded-2xl overflow-hidden">
                    {/* Paper texture background */}
                    <div className="absolute inset-0 bg-amber-50/80 dark:bg-amber-950/30" />
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      }}
                    />
                    <blockquote className="relative p-3 md:p-4 border-l-4 border-secondary/60">
                      <p className="font-serif text-sm md:text-base text-foreground/90 leading-relaxed italic">
                        "{currentPhoto.description}"
                      </p>
                    </blockquote>
                  </div>
                </div>
              )}

              {/* Tags */}
              {!isEditing && currentPhoto.tags && currentPhoto.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 md:mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPhoto.tags.map((tag) => (
                      <span key={tag} className="px-2.5 md:px-3 py-1 md:py-1.5 bg-muted rounded-full text-xs md:text-sm text-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Story Feature */}
              {!isEditing && (
                <div className="relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 rounded-xl md:rounded-2xl blur-sm opacity-75" />
                  <div className="relative bg-card rounded-xl md:rounded-2xl border border-border/50 p-3 md:p-4">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 md:mb-3 flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                      </span>
                      AI Storytelling
                    </h3>
                    {user?.isVip ? (
                    <AIStoryGenerator 
                      photoId={currentPhoto.id} 
                      photoTitle={currentPhoto.title} 
                      existingStory={currentPhoto.story}
                      onStoryGenerated={handleStoryGenerated} 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 md:py-6 text-center space-y-2 md:space-y-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center">
                        <Lock className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-serif font-medium text-foreground text-sm md:text-base">VIP Feature</h4>
                        <p className="text-xs md:text-sm text-muted-foreground max-w-[250px] mx-auto">
                          Upgrade your account to unlock AI Storytelling and bring your memories to life.
                        </p>
                      </div>
                      <Button variant="default" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm h-9 md:h-10">
                        Upgrade to VIP
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>

            {/* Actions - Only show when not editing */}
            {!isEditing && (
              <div className="p-4 md:p-6 border-t border-border space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-xl h-10 w-10 md:h-11 md:w-11 bg-transparent transition-colors cursor-pointer ${
                      currentPhoto.isFavorite ? "text-red-500 border-red-500/50 hover:bg-red-500/10" : ""
                    }`}
                    onClick={handleFavorite}
                  >
                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${currentPhoto.isFavorite ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 md:h-11 md:w-11 bg-transparent cursor-pointer">
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl h-10 w-10 md:h-11 md:w-11 bg-transparent cursor-pointer"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                  <Button
                    className="flex-1 rounded-xl h-10 md:h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground cursor-pointer text-sm md:text-base"
                    onClick={() => setIsEditing(true)}
                  >
                    <PenLine className="w-4 h-4 mr-1.5 md:mr-2" />
                    <span className="hidden sm:inline">Edit Memory</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl h-10 md:h-11 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive bg-transparent cursor-pointer text-sm md:text-base"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Delete Memory
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl bg-card border-border max-w-[90vw] md:max-w-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-serif text-lg md:text-xl">Delete this memory?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground text-sm">
                        This action cannot be undone. This memory will be permanently deleted from your collection.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="rounded-xl m-0 w-full sm:w-auto">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto m-0"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
