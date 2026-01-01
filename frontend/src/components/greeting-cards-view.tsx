"use client"

import { useState, useEffect } from "react"
import { GiftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGreetingCardsStore, type GreetingCard } from "@/lib/greeting-store"
import { CardDetailModal } from "./greeting-cards/card-detail-modal"
import { CreateCardModal } from "./greeting-cards/create-card-modal"
import { format } from "date-fns"
import Image from "next/image"
import { GreetingEmptyState } from "./greeting-cards/greeting-empty-state"

export function GreetingCardsView() {
  const [selectedCard, setSelectedCard] = useState<GreetingCard | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { cards, isLoading, fetchCards } = useGreetingCardsStore()

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-4">
        <div className="h-8 bg-muted rounded-lg w-32 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <>
        <div className="p-6 md:p-10 flex justify-end">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <GiftIcon className="w-4 h-4 mr-2" />
            Send New Card
          </Button>
        </div>
        <GreetingEmptyState onCreate={() => setIsCreateOpen(true)} />
        <CreateCardModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      </>
    )
  }

  return (
    <>
      <div className="p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">Greeting Cards</h1>
            <p className="text-muted-foreground mt-1">
              {cards.length} {cards.length === 1 ? "card" : "cards"} received
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <GiftIcon className="w-4 h-4 mr-2" />
            Send New Card
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
             const imageSrc = card.imageUrl || "/placeholder.svg";
             return (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 aspect-video ${
                  !card.isRead ? "border-2 border-secondary" : "border border-border"
                }`}
              >
                {!card.isRead && (
                  <div className="absolute top-3 right-3 z-10 w-3 h-3 rounded-full bg-secondary animate-pulse" />
                )}

                <div className="absolute inset-0 bg-secondary/10 overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt="Blur Background"
                    fill
                    className="object-cover blur-xl opacity-60 scale-110"
                  />
                  
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={imageSrc}
                      alt={card.title}
                      fill
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-card via-card/90 to-transparent pt-8">
                  <p className="text-xs text-muted-foreground font-medium">
                    From: {card.sender?.fullName || card.senderName || "Unknown"}
                  </p>
                  <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1 mt-0.5">{card.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {card.createdAt ? format(new Date(card.createdAt), "MMM d, yyyy") : ""}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Modals */}
      {selectedCard && <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />}
      <CreateCardModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  )
}