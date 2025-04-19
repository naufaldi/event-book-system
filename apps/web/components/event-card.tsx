import { formatDate } from "@/lib/utils"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card"
import { CalendarDays, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"


interface Event {
  id: number
  name: string
  description: string
  startTime: Date
  endTime: Date
  venue: string
  maxTickets: number
  bookedTickets: number
  availableTickets: number
  availability: string
  imageUrl: string
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-background shadow-md transition-all hover:shadow-xl h-full flex flex-col">
      <div className="absolute inset-0 bg-grid-white/5" />
      <div className="relative">
        <img
          src={event.imageUrl || "/placeholder.svg"}
          alt={event.name}
          className="aspect-[16/9] w-full object-cover"
        />
        {event.availability === "sold out" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge className="bg-red-600 text-white px-3 py-1 text-sm">Sold Out</Badge>
          </div>
        )}
      </div>
      <CardContent className="relative z-10 p-4 flex-grow">
        <h3 className="font-semibold line-clamp-1">{event.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{formatDate(event.startTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{event.venue}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="relative z-10 flex items-center justify-between border-t border-border p-4">
        <div className="text-xs">
          {event.availableTickets > 0 ? (
            <span>{event.availableTickets} spots left</span>
          ) : (
            <span className="text-red-500">Sold out</span>
          )}
        </div>
        <Button asChild size="sm" variant="outline" className="gap-1 group">
          <Link href={`/events/${event.id}`}>
            Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

