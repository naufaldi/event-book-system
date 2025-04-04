"use client"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu"
import { CalendarDays, MoreHorizontal, Plus, Search, Filter } from "lucide-react"
import AdminLayout from "@/components/layout/admin"
import { formatDate } from "@workspace/ui/lib/utils"
import Link from "next/link"

export default function AdminEvents() {
  // Mock events data
  const events = [
    {
      id: 1,
      name: "Ethereum Developer Summit",
      description: "Join the leading Ethereum developers for a two-day summit.",
      startTime: new Date("2025-04-15T09:00:00"),
      endTime: new Date("2025-04-16T18:00:00"),
      venue: "Crypto Convention Center",
      maxTickets: 500,
      bookedTickets: 350,
      availableTickets: 150,
      status: "upcoming",
    },
    {
      id: 2,
      name: "NFT Art Exhibition",
      description: "Explore the intersection of digital art and blockchain technology.",
      startTime: new Date("2025-05-20T10:00:00"),
      endTime: new Date("2025-05-22T20:00:00"),
      venue: "Digital Gallery Space",
      maxTickets: 300,
      bookedTickets: 300,
      availableTickets: 0,
      status: "sold out",
    },
    {
      id: 3,
      name: "DeFi Conference 2025",
      description: "The premier conference for decentralized finance innovations.",
      startTime: new Date("2025-06-10T09:00:00"),
      endTime: new Date("2025-06-12T17:00:00"),
      venue: "Finance Tech Hub",
      maxTickets: 800,
      bookedTickets: 450,
      availableTickets: 350,
      status: "upcoming",
    },
    {
      id: 4,
      name: "Web3 Gaming Hackathon",
      description: "Build the next generation of blockchain games in this 48-hour hackathon.",
      startTime: new Date("2025-07-05T08:00:00"),
      endTime: new Date("2025-07-07T20:00:00"),
      venue: "Game Development Campus",
      maxTickets: 200,
      bookedTickets: 180,
      availableTickets: 20,
      status: "upcoming",
    },
    {
      id: 5,
      name: "Blockchain Security Workshop",
      description: "Learn about the latest security practices for blockchain applications.",
      startTime: new Date("2024-12-05T10:00:00"),
      endTime: new Date("2024-12-05T16:00:00"),
      venue: "Tech Security Center",
      maxTickets: 150,
      bookedTickets: 150,
      availableTickets: 0,
      status: "completed",
    },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground">Manage and monitor all events on the platform</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/admin/events/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        <Card className="border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle>Event Management</CardTitle>
            <CardDescription>View and manage all events in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search events..." className="pl-8" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  Date
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Status
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{formatDate(event.startTime)}</TableCell>
                      <TableCell>{event.venue}</TableCell>
                      <TableCell>
                        {event.bookedTickets}/{event.maxTickets}
                      </TableCell>
                      <TableCell>
                        {event.status === "upcoming" && <Badge className="bg-blue-600 text-white">Upcoming</Badge>}
                        {event.status === "sold out" && <Badge className="bg-amber-600 text-white">Sold Out</Badge>}
                        {event.status === "completed" && <Badge variant="outline">Completed</Badge>}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Event</DropdownMenuItem>
                            <DropdownMenuItem>Manage Tickets</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Cancel Event</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

