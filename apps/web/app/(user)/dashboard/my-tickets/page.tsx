"use client"

import { useState, useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Badge } from "@workspace/ui/components/badge"
import { CalendarDays, Ticket, Clock, MapPin, Download, ExternalLink, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard"
import { formatDate } from "@workspace/ui/lib/utils"
import { useRouter } from "next/navigation"

export default function MyTickets() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("currentUser")
      if (!user) {
        router.push("/auth/login")
        return
      }

      setIsAuthenticated(true)
      setTimeout(() => setIsLoading(false), 800)
    }

    checkAuth()
  }, [router])

  // Mock data for upcoming events
  const upcomingTickets = [
    {
      id: 1,
      name: "Silicon Valley Tech Meetup",
      description: "Network with leading tech professionals and entrepreneurs.",
      startTime: new Date("2025-04-15T18:00:00"),
      endTime: new Date("2025-04-15T21:00:00"),
      venue: "Tech Innovation Hub",
      ticketId: "TECH-MTU-001",
      category: "tech-meetup",
      status: "CONFIRMED",
      imageUrl: "/placeholder.svg?height=200&width=400&text=Tech+Meetup",
    },
    {
      id: 2,
      name: "Book Club: Science Fiction Novels",
      description: "Join fellow bookworms in discussing classic sci-fi literature.",
      startTime: new Date("2025-05-20T19:00:00"),
      endTime: new Date("2025-05-20T21:00:00"),
      venue: "Literary Haven Bookstore",
      ticketId: "BOOK-SF-042",
      category: "bookworm",
      status: "CONFIRMED",
      imageUrl: "/placeholder.svg?height=200&width=400&text=Bookworm",
    },
  ]

  // Mock data for past events
  const pastTickets = [
    {
      id: 3,
      name: "Productivity Day at Café Noir",
      description: "A dedicated co-working day at one of the city's most inspiring coffee shops.",
      startTime: new Date("2024-12-05T09:00:00"),
      endTime: new Date("2024-12-05T17:00:00"),
      venue: "Café Noir",
      ticketId: "CAFE-WRK-089",
      category: "work-from-coffeeshop",
      status: "COMPLETED",
      imageUrl: "/placeholder.svg?height=200&width=400&text=Coffee+Shop",
    },
  ]

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-muted-foreground">Loading your tickets...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login page
  }

  return (
    <DashboardLayout>
      <motion.div
        className="flex flex-col gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tickets</h1>
          <p className="text-muted-foreground">Manage your event tickets and registrations</p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming ({upcomingTickets.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastTickets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
              {upcomingTickets.length > 0 ? (
                upcomingTickets.map((ticket) => (
                  <motion.div key={ticket.id} variants={item} transition={{ duration: 0.5 }}>
                    <Card className="overflow-hidden border-blue-500/20">
                      <div className="grid md:grid-cols-[250px_1fr]">
                        <div className="relative h-48 md:h-full">
                          <img
                            src={ticket.imageUrl || "/placeholder.svg"}
                            alt={ticket.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-xl font-semibold">{ticket.name}</h3>
                            <Badge className="bg-green-600 text-white">{ticket.status}</Badge>
                          </div>
                          <p className="mt-2 text-muted-foreground">{ticket.description}</p>
                          <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              <span>{formatDate(ticket.startTime)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {ticket.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                                {ticket.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{ticket.venue}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Ticket className="h-4 w-4" />
                              <span>Ticket ID: {ticket.ticketId}</span>
                            </div>
                          </div>
                          <div className="mt-6 flex flex-wrap gap-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white group">
                              <Download className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                              Download Ticket
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Event
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You don't have any upcoming event tickets.</p>
                  <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                    <a href="/events">Browse Events</a>
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="past">
            <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
              {pastTickets.map((ticket) => (
                <motion.div key={ticket.id} variants={item} transition={{ duration: 0.5 }}>
                  <Card className="overflow-hidden border-blue-500/20">
                    <div className="grid md:grid-cols-[250px_1fr]">
                      <div className="relative h-48 md:h-full">
                        <img
                          src={ticket.imageUrl || "/placeholder.svg"}
                          alt={ticket.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Badge variant="outline" className="border-white text-white">
                            COMPLETED
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold">{ticket.name}</h3>
                        <p className="mt-2 text-muted-foreground">{ticket.description}</p>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>{formatDate(ticket.startTime)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{ticket.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4" />
                            <span>Ticket ID: {ticket.ticketId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  )
}

