"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Wand2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePhotosStore } from "@/lib/photos-store"
import { toast } from "sonner"

type GenerationState = "idle" | "loading" | "success"

const loadingPhrases = [
  "Reading the emotions...",
  "Analyzing the scene...",
  "Connecting with AI...",
  "Crafting your story...",
  "Preserving the memory...",
]

interface AIStoryGeneratorProps {
  photoId: string
  photoTitle: string
  existingStory?: string
  onStoryGenerated?: (story: string) => void
}

export function AIStoryGenerator({ photoId, photoTitle, existingStory, onStoryGenerated }: AIStoryGeneratorProps) {
  const [state, setState] = useState<GenerationState>(existingStory ? "success" : "idle")
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [generatedStory, setGeneratedStory] = useState(existingStory || "")
  const [displayedText, setDisplayedText] = useState(existingStory || "")

  const { generateAiStory } = usePhotosStore()

  useEffect(() => {
    if (existingStory) {
      setGeneratedStory(existingStory)
      setDisplayedText(existingStory)
      setState("success")
    } else {
      setGeneratedStory("")
      setDisplayedText("")
      setState("idle")
    }
  }, [existingStory])

  useEffect(() => {
    if (state !== "loading") return

    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % loadingPhrases.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [state])

  useEffect(() => {
    if (state !== "success" || !generatedStory || existingStory) return

    let currentIndex = 0
    setDisplayedText("")
    const typeInterval = setInterval(() => {
      if (currentIndex < generatedStory.length) {
        setDisplayedText(generatedStory.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typeInterval)
      }
    }, 20)

    return () => clearInterval(typeInterval)
  }, [state, generatedStory, existingStory])

  const handleGenerate = async () => {
    setState("loading")
    setCurrentPhraseIndex(0)

    try {
      const story = await generateAiStory(photoId)
      
      setGeneratedStory(story)
      setState("success")
      onStoryGenerated?.(story)
      toast.success("Memory captured in words!")
    } catch (error) {
      console.error(error)
      setState("idle")
      toast.error("The muse is silent right now. Try again later.")
    }
  }

  const handleRegenerate = () => {
    setDisplayedText("")
    handleGenerate()
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {/* Idle State */}
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <button onClick={handleGenerate} className="w-full group">
              <div className="ai-shimmer p-px rounded-2xl">
                <div className="bg-card rounded-2xl p-4 flex items-center gap-4 group-hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-foreground">AI Storytelling</h4>
                    <p className="text-sm text-muted-foreground">Let AI craft a story from this memory</p>
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="ai-shimmer p-px rounded-2xl">
              <div className="bg-card rounded-2xl p-6 space-y-4">
                {/* Mystical orbs animation */}
                <div className="relative h-24 flex items-center justify-center overflow-hidden">
                  {/* Central icon */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="relative z-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Wand2 className="w-8 h-8 text-secondary" />
                    </div>
                  </motion.div>

                  {/* Orbiting particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        background: i % 2 === 0 ? "oklch(0.68 0.05 160)" : "oklch(0.78 0.045 45)",
                      }}
                      animate={{
                        x: [
                          Math.cos((i * Math.PI) / 3) * 40,
                          Math.cos((i * Math.PI) / 3 + Math.PI) * 40,
                          Math.cos((i * Math.PI) / 3) * 40,
                        ],
                        y: [
                          Math.sin((i * Math.PI) / 3) * 40,
                          Math.sin((i * Math.PI) / 3 + Math.PI) * 40,
                          Math.sin((i * Math.PI) / 3) * 40,
                        ],
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}

                  {/* Shimmer waves */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle, oklch(0.68 0.05 160 / 0.1) 0%, transparent 70%)",
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                {/* Loading phrase with fade transition */}
                <div className="text-center h-6">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentPhraseIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-muted-foreground font-medium"
                    >
                      {loadingPhrases[currentPhraseIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-secondary/30"
                      animate={{
                        backgroundColor:
                          currentPhraseIndex >= i ? "oklch(0.68 0.05 160)" : "oklch(0.68 0.05 160 / 0.3)",
                        scale: currentPhraseIndex === i ? 1.3 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="border border-secondary/30 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-secondary/10 px-4 py-3 flex items-center gap-3 border-b border-secondary/20">
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">AI Generated Story</h4>
                  <p className="text-xs text-muted-foreground">Based on "{photoTitle}"</p>
                </div>
              </div>

              {/* Story content with typewriter effect */}
              <div className="p-4 bg-card">
                <p className="text-foreground leading-relaxed font-serif text-[15px]">
                  {displayedText}
                  {displayedText.length < generatedStory.length && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                      className="inline-block w-0.5 h-4 bg-secondary ml-0.5 align-middle"
                    />
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="bg-muted/30 px-4 py-3 flex items-center justify-end gap-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  className="rounded-lg bg-transparent text-muted-foreground hover:text-foreground"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Regenerate
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
