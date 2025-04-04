"use client"

import React from "react"
import { useState, useEffect } from "react"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Menu, Ticket, User, Calendar, LogOut, Settings, Bell, CreditCard, TicketIcon } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}


export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const userData = localStorage.getItem("currentUser")
      if (!userData) {
        router.push("/auth/login")
        return
      }

      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/auth/login")
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Calendar,
    },
    {
      title: "My Tickets",
      href: "/dashboard/my-tickets",
      icon: Ticket,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
   
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center px-4 md:px-6">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <TicketIcon className="h-6 w-6 text-blue-600" />
              <span className="hidden font-bold sm:inline-block">EventChain</span>
            </Link>

            <div className="flex flex-1 items-center justify-end gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>

              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
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
                      <span className="font-bold">EventChain</span>
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
                    </nav>

                    <div className="mt-auto pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-red-500"
                        onClick={handleLogout}
                      >
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
                  const isActive = pathname === item.href

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Link
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
                    </motion.div>
                  )
                })}
              </nav>

              <div className="mt-auto pt-4 border-t border-border">
                <Button variant="ghost" className="w-full justify-start gap-2 text-red-500" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </aside>

          <main className="flex-1 p-4 md:p-8">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    
  )
}

