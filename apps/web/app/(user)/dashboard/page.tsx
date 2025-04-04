"use client"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Badge } from "@workspace/ui/components/badge"
import { CalendarDays, Ticket, Clock, MapPin, Download, ExternalLink } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard"
import { formatDate } from "@workspace/ui/lib/utils"

export default function Dashboard() {
  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      name: "Ethereum Developer Summit",
      description: "Join the leading Ethereum developers for a two-day summit.",
      startTime: new Date("2025-04-15T09:00:00"),
      endTime: new Date("2025-04-16T18:00:00"),
      venue: "Crypto Convention Center",
      ticketId: "ETH-DEV-001",
      status: "CONFIRMED",
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      name: "DeFi Conference 2025",
      description: "The premier conference for decentralized finance innovations.",
      startTime: new Date("2025-06-10T09:00:00"),
      endTime: new Date("2025-06-12T17:00:00"),
      venue: "Finance Tech Hub",
      ticketId: "DEFI-2025-042",
      status: "CONFIRMED",
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
  ]

  // Mock data for past events
  const pastEvents = [
    {
      id: 3,
      name: "Blockchain Security Workshop",
      description: "Learn about the latest security practices for blockchain applications.",
      startTime: new Date("2024-12-05T10:00:00"),
      endTime: new Date("2024-12-05T16:00:00"),
      venue: "Tech Security Center",
      ticketId: "BSW-2024-089",
      status: "COMPLETED",
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Manage your event tickets and reservations.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-background shadow-md">
            <div className="absolute inset-0 bg-grid-white/5" />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
              <CardDescription>Events you're attending soon</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <p className="text-3xl font-bold">{upcomingEvents.length}</p>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-background shadow-md">
            <div className="absolute inset-0 bg-grid-white/5" />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-lg">Active Tickets</CardTitle>
              <CardDescription>Valid tickets for future events</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <p className="text-3xl font-bold">{upcomingEvents.length}</p>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-background shadow-md">
            <div className="absolute inset-0 bg-grid-white/5" />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-lg">Past Events</CardTitle>
              <CardDescription>Events you've attended</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <p className="text-3xl font-bold">{pastEvents.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden border-blue-500/20">
                <div className="grid md:grid-cols-[250px_1fr]">
                  <div className="relative h-48 md:h-full">
                    <img
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xl font-semibold">{event.name}</h3>
                      <Badge className="bg-green-600 text-white">{event.status}</Badge>
                    </div>
                    <p className="mt-2 text-muted-foreground">{event.description}</p>
                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatDate(event.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {event.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                          {event.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4" />
                        <span>Ticket ID: {event.ticketId}</span>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="mr-2 h-4 w-4" />
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
            ))}
          </TabsContent>
          <TabsContent value="past" className="space-y-6">
            {pastEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden border-blue-500/20">
                <div className="grid md:grid-cols-[250px_1fr]">
                  <div className="relative h-48 md:h-full">
                    <img
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Badge variant="outline" className="border-white text-white">
                        COMPLETED
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{event.name}</h3>
                    <p className="mt-2 text-muted-foreground">{event.description}</p>
                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatDate(event.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4" />
                        <span>Ticket ID: {event.ticketId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

