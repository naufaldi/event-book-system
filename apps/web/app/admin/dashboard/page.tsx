"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Users, Calendar, Ticket, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { motion } from "framer-motion"
import AdminLayout from "@/components/layout/admin"
import { useRouter } from "next/navigation"

// Mock data for analytics
const analyticsData = {
  totalUsers: 1254,
  userGrowth: 8.2,
  activeEvents: 47,
  eventsGrowth: 12.5,
  totalTickets: 3827,
  ticketsGrowth: 5.7,
  revenue: "$28,429",
  revenueGrowth: -2.3,
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
        setTimeout(() => setIsLoading(false), 800)
      } catch (error) {
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])

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
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="h-10 w-10 rounded-full border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the admin dashboard. Here's an overview of your platform.</p>
        </div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} transition={{ duration: 0.3 }}>
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-background shadow-md">
              <div className="absolute inset-0 bg-grid-white/5" />
              <CardHeader className="relative z-10 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </div>
                <div className="p-1 bg-blue-900/50 rounded-md">
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</p>
                  <div
                    className={`flex items-center text-xs font-medium ${analyticsData.userGrowth > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {analyticsData.userGrowth > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(analyticsData.userGrowth)}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-background shadow-md">
              <div className="absolute inset-0 bg-grid-white/5" />
              <CardHeader className="relative z-10 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                </div>
                <div className="p-1 bg-blue-900/50 rounded-md">
                  <Calendar className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">{analyticsData.activeEvents}</p>
                  <div
                    className={`flex items-center text-xs font-medium ${analyticsData.eventsGrowth > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {analyticsData.eventsGrowth > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(analyticsData.eventsGrowth)}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-background shadow-md">
              <div className="absolute inset-0 bg-grid-white/5" />
              <CardHeader className="relative z-10 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                </div>
                <div className="p-1 bg-blue-900/50 rounded-md">
                  <Ticket className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">{analyticsData.totalTickets.toLocaleString()}</p>
                  <div
                    className={`flex items-center text-xs font-medium ${analyticsData.ticketsGrowth > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {analyticsData.ticketsGrowth > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(analyticsData.ticketsGrowth)}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} transition={{ duration: 0.3, delay: 0.3 }}>
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-background shadow-md">
              <div className="absolute inset-0 bg-grid-white/5" />
              <CardHeader className="relative z-10 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </div>
                <div className="p-1 bg-blue-900/50 rounded-md">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">{analyticsData.revenue}</p>
                  <div
                    className={`flex items-center text-xs font-medium ${analyticsData.revenueGrowth > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {analyticsData.revenueGrowth > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(analyticsData.revenueGrowth)}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">from last month</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          variants={item}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-blue-500/20">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>View your platform metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Interactive chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            variants={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>New users that joined recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 font-medium">
                        {String.fromCharCode(64 + i)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">User {100 + i}</p>
                        <p className="text-xs text-muted-foreground">Joined just now</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle>Popular Events</CardTitle>
                <CardDescription>Your most booked events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Silicon Valley Tech Meetup", count: 150, category: "tech-meetup" },
                    { name: "Book Club: Science Fiction", count: 28, category: "bookworm" },
                    { name: "Productivity Day at Café Noir", count: 25, category: "work-from-coffeeshop" },
                    { name: "Frontend Development Workshop", count: 45, category: "tech-meetup" },
                    { name: "Book Club: Mystery Novels", count: 22, category: "bookworm" },
                  ].map((event, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-10 rounded-full ${
                            event.category === "tech-meetup"
                              ? "bg-blue-500"
                              : event.category === "bookworm"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                          }`}
                        />
                        <p className="text-sm">{event.name}</p>
                      </div>
                      <p className="text-sm font-medium">{event.count} bookings</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

