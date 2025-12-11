"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Sparkles, Clock, ArrowRight, Camera, Heart, ChevronDown } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure Storage",
    description: "Your precious memories are encrypted and safely stored in the cloud, accessible only to you.",
  },
  {
    icon: Sparkles,
    title: "AI Storytelling",
    description: "Let our AI craft beautiful narratives from your photos, turning moments into meaningful stories.",
  },
  {
    icon: Clock,
    title: "Timeline Journey",
    description: "Travel through time with our beautiful timeline view, reliving memories year by year.",
  },
]

const demoPhotos = [
  { 
    id: 1, 
    src: "/autumn-forest-path-with-golden-leaves-falling.jpg", 
    height: "h-64",
    alt: "Autumn Forest"
  },
  { 
    id: 2, 
    src: "/beautiful-sunset-beach-with-golden-light-and-silho.jpg", 
    height: "h-80",
    alt: "Sunset Beach"
  },
  { 
    id: 3, 
    src: "/cherry-blossoms-in-spring-with-soft-pink-petals.jpg", 
    height: "h-56",
    alt: "Cherry Blossoms"
  },
  { 
    id: 4, 
    src: "/city-skyline-at-night-with-twinkling-lights-and-re.jpg", 
    height: "h-72",
    alt: "City Night"
  },
  { 
    id: 5, 
    src: "/cozy-reading-nook-with-rain-on-window-and-warm-lig.jpg", 
    height: "h-64",
    alt: "Cozy Reading"
  },
  { 
    id: 6, 
    src: "/majestic-mountain-peak-with-morning-mist-and-hikin.jpg", 
    height: "h-80",
    alt: "Mountain Peak"
  },
  { 
    id: 7, 
    src: "/snowy-winter-landscape-with-cabin-and-pine-trees.jpg", 
    height: "h-56",
    alt: "Winter Cabin"
  },
  { 
    id: 8, 
    src: "/summer-picnic-blanket-with-fruits-and-sunshine.jpg", 
    height: "h-72",
    alt: "Summer Picnic"
  },
]

export function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background paper-texture overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Camera className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-serif text-2xl text-foreground">Nostella</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Parallax Background Elements */}
        <div className="absolute inset-0 pointer-events-none" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          {/* Floating Polaroid Decorations */}
          <div
            className="absolute top-20 left-[10%] w-32 h-40 bg-card rounded-lg shadow-xl -rotate-12 opacity-20"
            style={{ transform: `translateY(${scrollY * 0.1}px) rotate(-12deg)` }}
          />
          <div
            className="absolute top-40 right-[15%] w-28 h-36 bg-card rounded-lg shadow-xl rotate-[8deg] opacity-15"
            style={{ transform: `translateY(${scrollY * 0.15}px) rotate(8deg)` }}
          />
          <div
            className="absolute bottom-40 left-[20%] w-24 h-32 bg-card rounded-lg shadow-xl rotate-15 opacity-10"
            style={{ transform: `translateY(${scrollY * -0.1}px) rotate(15deg)` }}
          />
          <div
            className="absolute bottom-60 right-[10%] w-36 h-44 bg-card rounded-lg shadow-xl -rotate-6 opacity-15"
            style={{ transform: `translateY(${scrollY * -0.05}px) rotate(-6deg)` }}
          />
        </div>

        {/* Gradient Orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          style={{ transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          style={{ transform: `translate(${scrollY * -0.05}px, ${scrollY * 0.08}px)` }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-8">
              <Heart className="w-4 h-4" />
              Where memories live forever
            </span>
          </div>

          <h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground leading-tight mb-8 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Preserve Your
            <br />
            <span className="text-secondary">Moments</span> Forever
          </h1>

          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            A sanctuary for your cherished memories. Store, organize, and relive your most precious moments with the
            warmth they deserve.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl px-8 py-6 text-lg group"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-8 py-6 text-lg border-2 bg-transparent"
              onClick={scrollToFeatures}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div
          className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-background to-transparent"
          style={{ transform: `translateY(${Math.max(0, (scrollY - 400) * 0.1)}px)` }}
        />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
              Crafted with <span className="text-secondary">Care</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every feature is thoughtfully designed to honor your memories and make preservation effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-secondary/5 transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Gallery Section */}
      <section className="py-32 px-6 bg-muted/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
              Your <span className="text-secondary">Gallery</span> Awaits
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A glimpse into how your memories will be beautifully displayed and organized.
            </p>
          </div>

          {/* Demo Masonry Grid */}
          <div className="relative">
            {/* Fade overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent pointer-events-none h-full w-full" />

            <div className="masonry-grid">
              {demoPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="masonry-item"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    transform: `translateY(${Math.sin(scrollY * 0.002 + index) * 5}px)`,
                  }}
                >
                  <div
                    className={`${photo.height} rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:z-20 relative bg-card`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16 relative z-20">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl px-10 py-6 text-lg group"
              >
                Create Your Gallery
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial/Quote Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-9xl text-secondary/10 font-serif">
              &ldquo;
            </span>
            <blockquote className="font-serif text-3xl md:text-4xl text-foreground leading-relaxed mb-8 relative z-10">
              The best thing about memories is making them.
            </blockquote>
            <cite className="text-muted-foreground text-lg not-italic">Every moment matters</cite>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Camera className="w-5 h-5 text-secondary" />
              </div>
              <span className="font-serif text-2xl text-foreground">Nostella</span>
            </div>

            <div className="flex items-center gap-8 text-muted-foreground">
              <Link href="/login" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="hover:text-foreground transition-colors">
                Register
              </Link>
              <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
            </div>

            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Nostella. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
