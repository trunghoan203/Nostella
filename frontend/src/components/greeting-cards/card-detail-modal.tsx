"use client"

import { useEffect } from "react"
import { format } from "date-fns"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGreetingCardsStore, type GreetingCard } from "@/lib/greeting-store"
import Image from "next/image";


interface CardDetailModalProps {
  card: GreetingCard
  onClose: () => void
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  const { markAsRead } = useGreetingCardsStore()

  useEffect(() => {
    if (!card.isRead) {
      markAsRead(card.id)
    }
  }, [card.id, card.isRead, markAsRead])

  const senderName = card.sender?.fullName || card.senderName || "Unknown Sender";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/80 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Modal */}
      <div
        className="relative z-10 w-full h-full max-w-2xl mx-auto p-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-md bg-card rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
          {/* Header */}
            <div className="relative h-64 shrink-0 bg-secondary/10 overflow-hidden">
              <Image
                src={card.imageUrl || "/placeholder.svg"}
                alt="Blur Background"
                fill
                className="object-cover blur-xl opacity-60 scale-110"
              />
              <div className="absolute inset-0">
                <Image
                  src={card.imageUrl || "/placeholder.svg"}
                  alt={card.title}
                  fill
                  className="object-contain drop-shadow-xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* From & Date */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                From: <span className="font-semibold text-foreground">{senderName}</span>
              </p>
              <p className="text-xs text-muted-foreground">{format(new Date(card.createdAt), "MMMM d, yyyy")}</p>
            </div>

            {/* Title */}
            <div>
              <h2 className="font-serif text-3xl font-semibold text-foreground text-balance">{card.title}</h2>
            </div>

            {/* Message */}
            <div className="relative rounded-2xl overflow-hidden p-6 bg-amber-50/50 dark:bg-amber-950/20 border border-secondary/20">
              <p className="font-serif text-lg text-foreground/90 leading-relaxed italic">&quot;{card.message}&quot;</p>
            </div>

            {/* Close Button */}
            <Button
              onClick={onClose}
              className="w-full rounded-xl h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
