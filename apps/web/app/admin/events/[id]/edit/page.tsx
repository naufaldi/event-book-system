"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Clock, ArrowLeft, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@workspace/ui/lib/utils"
import { motion } from "framer-motion"
import AdminLayout from "@/components/admin-layout"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function EditEvent() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Event form state
  const [event, setEvent] = useState({
    id: Number(id),
    name: "",
    description: "",
    startDate: new Date(),
    startTime: "",
    endTime: "",
    venue: "",
    address: "",
    maxTickets: 100,
    price: 29.99,
    category: "tech-meetup",
    published: true,
    imageUrl: "/placeholder.svg?height=400&width=600",
  })

  // Check if user is authenticated as admin
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("currentUser")
      if (!user) {
        router.push("/auth/login")
        return
      }

      try {
        const userData = JSON.parse(user)
        if (userData.role !== "admin") {
          router.push("/dashboard")
          return
        }

        setIsAuthenticated(true)
        loadEventData()
      } catch (error) {
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router, id])

  // Load event data
  const loadEventData = () => {
    // Simulate API call to fetch event data
    setTimeout(() => {
      // Mock data for different event types
      const eventData = {
        id: Number(id),
        name:
          id === "1"
            ? "Silicon Valley Tech Meetup"
            : id === "2"
              ? "Book Club: Science Fiction Novels"
              : "Productivity Day at Café Noir",
        description:
          id === "1"
            ? "Network with leading tech professionals and entrepreneurs in Silicon Valley."
            : id === "2"
              ? "Join fellow bookworms in discussing classic and contemporary sci-fi literature."
              : "A dedicated co-working day at one of the city's most inspiring coffee shops.",
        startDate: new Date("2025-04-15"),
        startTime: "18:00",
        endTime: "21:00",
        venue: id === "1" ? "Tech Innovation Hub" : id === "2" ? "Literary Haven Bookstore" : "Café Noir",
        address: "123 Example Street, San Francisco, CA 94105",
        maxTickets: id === "1" ? 200 : id === "2" ? 30 : 40,
        price: id === "1" ? 49.99 : id === "2" ? 9.99 : 19.99,
        category: id === "1" ? "tech-meetup" : id === "2" ? "bookworm" : "work-from-coffeeshop",
        published: true,
        imageUrl:
          id === "1"
            ? "/placeholder.svg?height=400&width=600&text=Tech+Meetup"
            : id === "2"
              ? "/placeholder.svg?height=400&width=600&text=Bookworm"
              : "/placeholder.svg?height=400&width=600&text=Coffee+Shop",
      }

      setEvent(eventData)
      setIsLoading(false)
    }, 1000)
  }

  // Handle form input changes
  const handleChange = (field: string, value: any) => {
    setEvent((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call to update event
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Event updated",
        description: `${event.name} has been successfully updated.`,
        variant: "default",
      })
    }, 1500)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-muted-foreground">Loading event details...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <motion.div
        className="flex flex-col gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/admin/events"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to events
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
            <p className="text-muted-foreground">Update event information</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-blue-500/20">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Update the details for this event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input id="name" value={event.name} onChange={(e) => handleChange("name", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    value={event.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={event.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech-meetup">Tech Meetup</SelectItem>
                      <SelectItem value="bookworm">Bookworm</SelectItem>
                      <SelectItem value="work-from-coffeeshop">Work From Coffeeshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Event Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {event.startDate ? format(event.startDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={event.startDate}
                          onSelect={(date) => handleChange("startDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Event Time</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          className="pl-8"
                          value={event.startTime}
                          onChange={(e) => handleChange("startTime", e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          className="pl-8"
                          value={event.endTime}
                          onChange={(e) => handleChange("endTime", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input id="venue" value={event.venue} onChange={(e) => handleChange("venue", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Venue Address</Label>
                  <Input id="address" value={event.address} onChange={(e) => handleChange("address", e.target.value)} />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxTickets">Maximum Tickets</Label>
                    <Input
                      id="maxTickets"
                      type="number"
                      min="1"
                      value={event.maxTickets}
                      onChange={(e) => handleChange("maxTickets", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Ticket Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={event.price}
                      onChange={(e) => handleChange("price", Number.parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={event.published}
                    onCheckedChange={(checked) => handleChange("published", checked)}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.push("/admin/events")}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div>
            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle>Event Preview</CardTitle>
                <CardDescription>Current event image</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-blue-500/20">
                  <img
                    src={event.imageUrl || "/placeholder.svg"}
                    alt={event.name}
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div className="mt-4">
                  <Button className="w-full" variant="outline">
                    Change Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 border-blue-500/20">
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Created</span>
                  <span className="text-sm text-muted-foreground">March 15, 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Modified</span>
                  <span className="text-sm text-muted-foreground">March 30, 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <span className={`text-sm font-medium ${event.published ? "text-green-500" : "text-amber-500"}`}>
                    {event.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tickets Sold</span>
                  <span className="text-sm text-muted-foreground">32 / {event.maxTickets}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

