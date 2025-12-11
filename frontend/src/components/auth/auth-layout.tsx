"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Camera } from "lucide-react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  quote: string
  quoteAuthor: string
}

export function AuthLayout({ children, title, subtitle, quote, quoteAuthor }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Nostalgic Image with Quote */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/nostalgic-vintage-polaroid-photos-scattered-on-woo.jpg" alt="Nostalgic memories" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/40 to-transparent" />
        </div>

        {/* Quote Overlay */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-primary-foreground">
          <blockquote className="max-w-md">
            <p className="font-serif text-2xl leading-relaxed italic mb-4 text-balance">"{quote}"</p>
            <cite className="text-sm font-medium opacity-80 not-italic">— {quoteAuthor}</cite>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-background paper-texture">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Camera className="w-5 h-5 text-secondary-foreground" />
          </div>
          <span className="font-serif text-2xl font-semibold text-foreground">Nostella</span>
        </Link>

        {/* Glassmorphism Card */}
        <div className="w-full max-w-md">
          <div className="glass rounded-2xl border border-border/50 p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nostella. Preserving memories beautifully.
        </p>
      </div>
    </div>
  )
}
