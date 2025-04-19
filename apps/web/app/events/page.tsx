"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Search, Filter, CalendarDays, MapPin } from "lucide-react"
import { motion } from "framer-motion"

import EventCard from "@/components/event-card"
import AnimatedCard from "@/components/animated-card"
import Footer from "@/components/layout/footer"
import MainNav from "@/components/layout/main-nav"

// Mock event data generator
const generateMockEvents = (page: number, limit = 12) => {
  const events = []
  const startId = (page - 1) * limit + 1
  const endId = startId + limit - 1

  const venues = [
    "Crypto Convention Center",
    "Digital Gallery Space",
    "Finance Tech Hub",
    "Game Development Campus",
    "Tech Security Center",
    "Blockchain Arena",
    "Web3 Innovation Lab",
    "Metaverse Pavilion",
  ]

  const eventNames = [
    "Ethereum Developer Summit",
    "NFT Art Exhibition",
    "DeFi Conference 2025",
    "Web3 Gaming Hackathon",
    "Blockchain Security Workshop",
    "Crypto Investment Forum",
    "Metaverse Design Expo",
    "Smart Contract Hackathon",
    "DAO Governance Summit",
    "Zero Knowledge Proofs Conference",
  ]

  for (let id = startId; id <= endId; id++) {
    const randomDays = Math.floor(Math.random() * 365) + 1
    const startTime = new Date()
    startTime.setDate(startTime.getDate() + randomDays)

    const endTime = new Date(startTime)
    endTime.setHours(endTime.getHours() + Math.floor(Math.random() * 8) + 2)

    const maxTickets = Math.floor(Math.random() * 500) + 100
    const bookedTickets = Math.floor(Math.random() * maxTickets)
    const availableTickets = maxTickets - bookedTickets

    events.push({
      id,
      name: eventNames[Math.floor(Math.random() * eventNames.length)] + ` ${id}`,
      description:
        "Join us for this exciting event in the web3 space. Network with industry leaders and learn about the latest innovations.",
      startTime,
      endTime,
      venue: venues[Math.floor(Math.random() * venues.length)],
      maxTickets,
      bookedTickets,
      availableTickets,
      availability: availableTickets > 0 ? "available" : "sold out",
      imageUrl: `/placeholder.svg?height=400&width=600&text=Event+${id}`,
    })
  }

  return events
}

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])

  const observer = useRef<IntersectionObserver | null>(null)
  const lastEventElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries && entries[0]?.isIntersecting && hasMore) {
          loadMoreEvents()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  const loadMoreEvents = () => {
    if (loading) return

    setLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      const newEvents = generateMockEvents(page)
      setEvents((prev) => [...prev, ...newEvents])
      setPage((prev) => prev + 1)
      setLoading(false)

      // Stop after 5 pages for demo purposes
      if (page >= 5) {
        setHasMore(false)
      }
    }, 1000)
  }

  useEffect(() => {
    // Load initial events
    loadMoreEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = events.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredEvents(filtered)
    } else {
      setFilteredEvents(events)
    }
  }, [events, searchTerm])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-border/40">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6),transparent)]" />
        <motion.div
          className="container px-4 md:px-6 mx-auto relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">Events</Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-500">
              Discover Web3 Events
            </h1>
            <p className="mt-4 max-w-[600px] mx-auto text-muted-foreground md:text-xl">
              Find and book the most exciting events in the blockchain and web3 space. Connect with like-minded
              individuals and stay ahead of the curve.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="py-8 border-b border-border/40">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="w-full bg-background pl-8 shadow-sm"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                Date
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Location
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div className="flex flex-col gap-8" variants={container} initial="hidden" animate="show">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">All Events</h2>
              <p className="text-muted-foreground">
                {filteredEvents.length} events found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredEvents.map((event, index) => {
                  if (filteredEvents.length === index + 1) {
                    return (
                      <div ref={lastEventElementRef} key={event.id}>
                        <AnimatedCard delay={(index % 12) * 0.05}>
                          <EventCard event={event} />
                        </AnimatedCard>
                      </div>
                    )
                  } else {
                    return (
                      <AnimatedCard key={event.id} delay={(index % 12) * 0.05}>
                        <EventCard event={event} />
                      </AnimatedCard>
                    )
                  }
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No events found. Try adjusting your search.</p>
              </div>
            )}

            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={`skeleton-${i}`} className="rounded-lg border border-blue-500/20 overflow-hidden">
                    <Skeleton className="h-[200px] w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!hasMore && filteredEvents.length > 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You've reached the end of the list.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

