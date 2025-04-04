"use client"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Calendar } from "@workspace/ui/components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { CalendarIcon, Clock, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import AdminLayout from "@/components/layout/admin"
import Link from "next/link"

export default function NewEvent() {
  const [date, setDate] = useState<Date>()

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/events"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to events
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
            <p className="text-muted-foreground">Add a new event to the platform</p>
          </div>
        </div>

        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Enter the details for your new event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input id="name" placeholder="Enter event name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter event description" rows={5} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Event Time</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="time" className="pl-8" />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="time" className="pl-8" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" placeholder="Enter venue name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Venue Address</Label>
              <Input id="address" placeholder="Enter venue address" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxTickets">Maximum Tickets</Label>
                <Input id="maxTickets" type="number" min="1" placeholder="Enter maximum tickets" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Ticket Price ($)</Label>
                <Input id="price" type="number" min="0" step="0.01" placeholder="Enter ticket price" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create Event</Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  )
}

