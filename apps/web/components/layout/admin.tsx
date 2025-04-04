"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
  Menu,
  Ticket,
  Users,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  CalendarDays,
  Home,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Events",
      href: "/admin/events",
      icon: CalendarDays,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Tickets",
      href: "/admin/tickets",
      icon: Ticket,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Ticket className="h-6 w-6 text-blue-600" />
            <span className="hidden font-bold sm:inline-block">EventChain Admin</span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>

            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 pt-6">
                  <Link href="/" className="flex items-center gap-2">
                    <Ticket className="h-6 w-6 text-blue-600" />
                    <span className="font-bold">EventChain Admin</span>
                  </Link>

                  <nav className="flex flex-col gap-4">
                    {navItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center gap-2 text-lg font-semibold"
                        onClick={() => setIsMobileNavOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    ))}

                    <Link
                      href="/"
                      className="flex items-center gap-2 text-lg font-semibold"
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      <Home className="h-5 w-5" />
                      Back to Site
                    </Link>
                  </nav>

                  <div className="mt-auto pt-4 border-t border-border">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-500">
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 border-r border-border/40 md:block">
          <div className="flex h-full flex-col gap-4 p-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item, index) => {
                const isActive = typeof window !== "undefined" && window.location.pathname === item.href

                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}

              <Link
                href="/"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-4"
              >
                <Home className="h-4 w-4" />
                Back to Site
              </Link>
            </nav>

            <div className="mt-auto pt-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start gap-2 text-red-500">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}

