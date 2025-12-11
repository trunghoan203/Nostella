import Link from "next/link"
import { Camera, Home, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col items-center justify-center p-8">
      {/* Decorative floating polaroids */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-40 bg-card rounded-lg shadow-lg rotate-[-15deg] opacity-20 border-8 border-white" />
        <div className="absolute top-1/3 right-1/4 w-28 h-36 bg-card rounded-lg shadow-lg rotate-12 opacity-15 border-8 border-white" />
        <div className="absolute bottom-1/3 left-1/3 w-24 h-32 bg-card rounded-lg shadow-lg rotate-[8deg] opacity-10 border-8 border-white" />
        <div className="absolute bottom-1/4 right-1/3 w-36 h-44 bg-card rounded-lg shadow-lg rotate-[-8deg] opacity-20 border-8 border-white" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* Icon with decorative elements */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute w-32 h-32 rounded-full bg-secondary/10 animate-pulse" />
          <div className="absolute w-24 h-24 rounded-full bg-accent/10" />
          <div className="relative w-20 h-20 rounded-2xl bg-card shadow-lg flex items-center justify-center border border-border">
            <Camera className="w-10 h-10 text-muted-foreground" />
          </div>

          {/* Floating question marks */}
          <Search className="absolute -top-2 -right-4 w-5 h-5 text-secondary/60 rotate-12" />
          <span className="absolute -bottom-1 -left-3 text-2xl font-serif text-accent/40">?</span>
        </div>

        {/* 404 Number */}
        <div className="font-serif text-8xl font-bold text-muted-foreground/20 mb-4 select-none">404</div>

        {/* Main heading */}
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4 text-balance">
          Lost in Memories
        </h1>

        {/* Poetic description */}
        <p className="text-muted-foreground text-lg mb-2 leading-relaxed">It seems this memory has faded away...</p>
        <p className="text-muted-foreground mb-8">
          Like a photograph left in the sun, the page you're looking for no longer exists.
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-px bg-border" />
          <div className="w-2 h-2 rounded-full bg-secondary/40" />
          <div className="w-12 h-px bg-border" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-xl gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Return to Gallery
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl gap-2 bg-transparent">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Bottom quote */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <blockquote className="font-serif text-sm italic text-muted-foreground">
            "Every memory is a journey back in time"
          </blockquote>
        </div>
      </div>
    </div>
  )
}
