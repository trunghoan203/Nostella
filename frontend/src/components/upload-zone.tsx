"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Upload, ImageIcon, Film, CloudUpload, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePhotosStore } from "@/lib/photos-store"
import { toast } from "sonner"

interface FileWithCaption {
  file: File
  caption: string
  preview: string
}

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<FileWithCaption[]>([])

  const { uploadPhoto, isUploading, uploadProgress } = usePhotosStore()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    const newFiles = files.map((file) => ({
      file,
      caption: "",
      preview: URL.createObjectURL(file),
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newFiles = files.map((file) => ({
        file,
        caption: "",
        preview: URL.createObjectURL(file),
      }))
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const updateCaption = (index: number, caption: string) => {
    setUploadedFiles((prev) => prev.map((item, i) => (i === index ? { ...item, caption } : item)))
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const removed = prev[index]
      URL.revokeObjectURL(removed.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleUploadAll = async () => {
    let successCount = 0
    let failCount = 0

    for (const item of uploadedFiles) {
      try {
        await uploadPhoto(item.file, item.caption || item.file.name)
        successCount++
      } catch (error) {
        failCount++
      }
    }

    // Cleanup previews
    uploadedFiles.forEach((item) => URL.revokeObjectURL(item.preview))
    setUploadedFiles([])

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} ${successCount === 1 ? "memory" : "memories"}`)
    }
    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} ${failCount === 1 ? "file" : "files"}`)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-semibold text-foreground mb-2 text-balance">Add New Memories</h1>
        <p className="text-muted-foreground text-lg">
          Upload your photos and let us help preserve your precious moments
        </p>
      </header>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-3xl border-2 border-dashed transition-all duration-300",
          "flex flex-col items-center justify-center text-center p-12 min-h-[400px]",
          isDragging
            ? "border-secondary bg-secondary/5 scale-[1.02]"
            : "border-border hover:border-secondary/50 hover:bg-muted/30",
        )}
      >
        {/* Decorative Polaroids */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div
            className={cn(
              "absolute -top-4 -left-4 w-32 h-40 bg-card rounded-lg shadow-lg rotate-[-15deg] transition-transform duration-500",
              isDragging && "rotate-[-20deg] translate-y-2",
            )}
          >
            <div className="w-full h-24 bg-muted m-2 rounded" />
          </div>
          <div
            className={cn(
              "absolute -top-2 -right-6 w-28 h-36 bg-card rounded-lg shadow-lg rotate-12 transition-transform duration-500",
              isDragging && "rotate-18 translate-y-2",
            )}
          >
            <div className="w-full h-20 bg-muted m-2 rounded" />
          </div>
          <div
            className={cn(
              "absolute -bottom-6 left-1/4 w-24 h-32 bg-card rounded-lg shadow-lg rotate-[-8deg] transition-transform duration-500",
              isDragging && "-rotate-12 -translate-y-2",
            )}
          >
            <div className="w-full h-16 bg-muted m-2 rounded" />
          </div>
        </div>

        {/* Upload Icon */}
        <div
          className={cn(
            "relative z-10 w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 transition-all duration-300",
            isDragging && "scale-110 bg-secondary/20",
          )}
        >
          <CloudUpload
            className={cn(
              "w-10 h-10 text-secondary transition-transform duration-300",
              isDragging && "scale-110 -translate-y-1",
            )}
          />
        </div>

        <h3 className="relative z-10 font-serif text-2xl font-semibold text-foreground mb-2">
          {isDragging ? "Drop your memories here" : "Drag & drop your photos"}
        </h3>
        <p className="relative z-10 text-muted-foreground mb-6">or click to browse from your device</p>

        <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
        <label htmlFor="file-upload">
          <Button
            asChild
            className="relative z-10 rounded-xl h-12 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground cursor-pointer"
          >
            <span>
              <Upload className="w-5 h-5 mr-2" />
              Browse Files
            </span>
          </Button>
        </label>

        <div className="relative z-10 flex items-center gap-4 mt-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            JPG, PNG, HEIC
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="flex items-center gap-1.5">
            <Film className="w-4 h-4" />
            Up to 50MB each
          </span>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="font-medium text-foreground mb-4">Ready to upload ({uploadedFiles.length} files)</h3>
          <div className="space-y-4">
            {uploadedFiles.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={item.preview || "/placeholder.svg"}
                    alt={item.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate mb-1">{item.file.name}</p>
                  <Input
                    placeholder="Add a caption for this memory..."
                    value={item.caption}
                    onChange={(e) => updateCaption(idx, e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <Button variant="ghost" size="icon" className="shrink-0" onClick={() => removeFile(idx)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUploadAll}
            disabled={isUploading}
            className="mt-6 w-full rounded-xl h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload All Memories
              </>
            )}
          </Button>

          {isUploading && (
            <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
