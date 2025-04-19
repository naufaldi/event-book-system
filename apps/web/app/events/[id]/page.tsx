"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Clock, MapPin, Users, Ticket, Share2, Calendar, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import { useParams } from "next/navigation"
import { formatDate } from "@workspace/ui/lib/utils"

export default function EventDetails() {
  const { id } = useParams()
  const [isAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock event data - in a real app, this would be fetched from an API
  const [event, setEvent] = useState({
    id: Number(id),
    name: "Ethereum Developer Summit",
    description:
      "Join the leading Ethereum developers for a two-day summit on the future of blockchain development. This event will feature keynote speeches, workshops, and networking opportunities with the brightest minds in the Ethereum ecosystem. Topics will include Ethereum 2.0, layer 2 scaling solutions, smart contract security, and more. Don't miss this opportunity to stay at the forefront of blockchain innovation.",
    startTime: new Date("2025-04-15T09:00:00"),
    endTime: new Date("2025-04-16T18:00:00"),
    venue: "Crypto Convention Center",
    venueAddress: "123 Blockchain Boulevard, San Francisco, CA 94105",
    maxTickets: 500,
    bookedTickets: 350,
    availableTickets: 150,
    availability: "available",
    price: "$299",
    organizer: "Ethereum Foundation",
    imageUrl: "/placeholder.svg?height=600&width=1200",
  })

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNav />

      <div className="container px-4 py-8 md:px-6 md:py-12 mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Link
            href="/events"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to events
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div className="lg:col-span-2" variants={fadeInUp} initial="hidden" animate="visible">
            <div className="relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-background p-1 shadow-xl">
              <div className="absolute inset-0 bg-grid-white/5" />
              {isLoading ? (
                <div className="relative z-10 w-full h-[300px] md:h-[400px] bg-muted/50 animate-pulse rounded-lg" />
              ) : (
                <img
                  src={event.imageUrl || "/placeholder.svg"}
                  alt={event.name}
                  className="relative z-10 w-full h-[300px] md:h-[400px] object-cover rounded-lg"
                />
              )}
            </div>

            <motion.div className="mt-8 space-y-6" variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-600 text-white">Web3</Badge>
                <Badge variant="outline">Developer</Badge>
                <Badge variant="outline">Conference</Badge>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-3xl font-bold tracking-tight md:text-4xl">
                {isLoading ? <div className="h-10 w-3/4 bg-muted/50 animate-pulse rounded-md" /> : event.name}
              </motion.h1>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {isLoading ? (
                    <div className="h-4 w-24 bg-muted/50 animate-pulse rounded-md" />
                  ) : (
                    <span>{formatDate(event.startTime)}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {isLoading ? (
                    <div className="h-4 w-32 bg-muted/50 animate-pulse rounded-md" />
                  ) : (
                    <span>
                      {event.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                      {event.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {isLoading ? (
                    <div className="h-4 w-40 bg-muted/50 animate-pulse rounded-md" />
                  ) : (
                    <span>{event.venue}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {isLoading ? (
                    <div className="h-4 w-28 bg-muted/50 animate-pulse rounded-md" />
                  ) : (
                    <span>{event.availableTickets} spots left</span>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="prose prose-invert max-w-none">
                <h2 className="text-xl font-semibold">About this event</h2>
                {isLoading ? (
                  <>
                    <div className="h-4 w-full bg-muted/50 animate-pulse rounded-md mb-2" />
                    <div className="h-4 w-full bg-muted/50 animate-pulse rounded-md mb-2" />
                    <div className="h-4 w-3/4 bg-muted/50 animate-pulse rounded-md" />
                  </>
                ) : (
                  <p>{event.description}</p>
                )}

                <h2 className="text-xl font-semibold">Venue</h2>
                {isLoading ? (
                  <>
                    <div className="h-4 w-1/2 bg-muted/50 animate-pulse rounded-md mb-2" />
                    <div className="h-4 w-3/4 bg-muted/50 animate-pulse rounded-md" />
                  </>
                ) : (
                  <>
                    <p>{event.venue}</p>
                    <p>{event.venueAddress}</p>
                  </>
                )}

                <h2 className="text-xl font-semibold">Organizer</h2>
                {isLoading ? (
                  <div className="h-4 w-1/3 bg-muted/50 animate-pulse rounded-md" />
                ) : (
                  <p>{event.organizer}</p>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="sticky top-8 overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-background shadow-xl">
              <div className="absolute inset-0 bg-grid-white/5" />
              <CardContent className="relative z-10 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Ticket Information</h3>
                    <p className="text-muted-foreground">Secure your spot at this event</p>
                  </div>

                  <div className="flex items-baseline justify-between">
                    {isLoading ? (
                      <>
                        <div className="h-8 w-16 bg-muted/50 animate-pulse rounded-md" />
                        <div className="h-4 w-24 bg-muted/50 animate-pulse rounded-md" />
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-bold">{event.price}</span>
                        <span className="text-muted-foreground">{event.availableTickets} remaining</span>
                      </>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="h-10 w-full bg-muted/50 animate-pulse rounded-md" />
                  ) : event.availability === "available" ? (
                    isAuthenticated ? (
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group">
                        <Ticket className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        Book Ticket
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Link href="/auth/login">Login to Book</Link>
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                          Don't have an account?{" "}
                          <Link href="/auth/register" className="text-blue-400 hover:text-blue-300">
                            Register
                          </Link>
                        </p>
                      </div>
                    )
                  ) : (
                    <Button disabled className="w-full">
                      Sold Out
                    </Button>
                  )}

                  <div className="flex flex-col gap-4 pt-4 border-t border-border">
                    <Button variant="outline" className="w-full group">
                      <Calendar className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Add to Calendar
                    </Button>
                    <Button variant="outline" className="w-full group">
                      <Share2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Share Event
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

