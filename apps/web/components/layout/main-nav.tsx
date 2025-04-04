"use client"

import { useState } from "react"
import Link from "next/link"

import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet"
import { Menu, Ticket, Calendar } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Ticket className="h-6 w-6 text-blue-600" />
          <span className="hidden font-bold sm:inline-block">EventChain</span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
          <Link href="/events" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Events
          </Link>
          <Link href="/venues" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Venues
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
            About
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Calendar className="h-5 w-5" />
                <span className="sr-only">Calendar</span>
              </Button>
              <Button asChild variant="ghost" className="hidden md:flex">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/dashboard">My Tickets</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden md:flex">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/events" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                  Events
                </Link>
                <Link href="/venues" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                  Venues
                </Link>
                <Link href="/about" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                  About
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                      Dashboard
                    </Link>
                    <Link href="/dashboard" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                      My Tickets
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                    <Link href="/auth/register" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

