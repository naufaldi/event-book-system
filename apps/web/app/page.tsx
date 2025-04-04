"use client"

import { useState, useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Star,
  Users,
  Coffee,
  Cpu,
  BookOpen,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import MainNav from "@/components/layout/main-nav"
import Footer from "@/components/layout/footer"
import { cn } from "@workspace/ui/lib/utils"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.05], [1, 0.98])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Featured events with focus on the specified categories
  const featuredEvents = [
    {
      id: 1,
      name: "Silicon Valley Tech Meetup",
      description: "Network with leading tech professionals and entrepreneurs in Silicon Valley.",
      startTime: new Date("2025-04-15T18:00:00"),
      endTime: new Date("2025-04-15T21:00:00"),
      venue: "Tech Innovation Hub",
      maxTickets: 200,
      bookedTickets: 150,
      availableTickets: 50,
      availability: "available",
      category: "tech-meetup",
      imageUrl: "/placeholder.svg?height=400&width=600&text=Tech+Meetup",
    },
    {
      id: 2,
      name: "Book Club: Science Fiction Novels",
      description: "Join fellow bookworms in discussing classic and contemporary sci-fi literature.",
      startTime: new Date("2025-05-20T19:00:00"),
      endTime: new Date("2025-05-20T21:00:00"),
      venue: "Literary Haven Bookstore",
      maxTickets: 30,
      bookedTickets: 28,
      availableTickets: 2,
      availability: "limited",
      category: "bookworm",
      imageUrl: "/placeholder.svg?height=400&width=600&text=Bookworm",
    },
    {
      id: 3,
      name: "Productivity Day at Café Noir",
      description: "A dedicated co-working day at one of the city's most inspiring coffee shops.",
      startTime: new Date("2025-06-10T09:00:00"),
      endTime: new Date("2025-06-10T17:00:00"),
      venue: "Café Noir",
      maxTickets: 40,
      bookedTickets: 25,
      availableTickets: 15,
      availability: "available",
      category: "work-from-coffeeshop",
      imageUrl: "/placeholder.svg?height=400&width=600&text=Coffee+Shop",
    },
    {
      id: 4,
      name: "Frontend Development Workshop",
      description: "Learn the latest frontend technologies from industry experts.",
      startTime: new Date("2025-07-05T10:00:00"),
      endTime: new Date("2025-07-05T16:00:00"),
      venue: "Code Academy",
      maxTickets: 50,
      bookedTickets: 45,
      availableTickets: 5,
      availability: "limited",
      category: "tech-meetup",
      imageUrl: "/placeholder.svg?height=400&width=600&text=Tech+Meetup",
    },
  ]

  // Categories with enhanced data
  const categories = [
    {
      name: "Work From Coffeeshop",
      description: "Productive coworking sessions at local coffee shops",
      slug: "work-from-coffeeshop",
      icon: <Coffee className="h-6 w-6" />,
      color: "bg-gradient-to-br from-amber-500 to-amber-700",
      textColor: "text-amber-500",
      borderColor: "border-amber-500/30",
      count: 24,
      features: ["Reserved seating", "High-speed WiFi", "Unlimited coffee", "Networking opportunities"],
      image: "/placeholder.svg?height=600&width=800&text=Coffee+Shop+Workspace",
    },
    {
      name: "Tech Meetup",
      description: "Connect with tech enthusiasts and industry professionals",
      slug: "tech-meetup",
      icon: <Cpu className="h-6 w-6" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/30",
      count: 42,
      features: ["Expert speakers", "Hands-on workshops", "Networking sessions", "Job opportunities"],
      image: "/placeholder.svg?height=600&width=800&text=Tech+Meetup",
    },
    {
      name: "Bookworm",
      description: "Book clubs and literary discussions for avid readers",
      slug: "bookworm",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-700",
      textColor: "text-emerald-500",
      borderColor: "border-emerald-500/30",
      count: 18,
      features: ["Curated reading lists", "Author Q&As", "Literary discussions", "Book exchanges"],
      image: "/placeholder.svg?height=600&width=800&text=Book+Club",
    },
  ]

  // Testimonials
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Software Engineer",
      company: "TechCorp",
      text: "EventChain has transformed how I discover tech events. The UI is sleek and the booking process is seamless.",
      avatar: "/placeholder.svg?height=100&width=100&text=AJ",
      rating: 5,
    },
    {
      name: "Sophia Chen",
      role: "Book Club Organizer",
      company: "Literary Circle",
      text: "As an event organizer, I love how easy it is to manage bookings and communicate with attendees.",
      avatar: "/placeholder.svg?height=100&width=100&text=SC",
      rating: 5,
    },
    {
      name: "Marcus Williams",
      role: "Remote Worker",
      company: "Freelance",
      text: "The coffee shop workspaces have been a game-changer for my productivity. Highly recommended!",
      avatar: "/placeholder.svg?height=100&width=100&text=MW",
      rating: 4,
    },
  ]

  // Stats
  const stats = [
    { label: "Events Hosted", value: "2,500+", icon: <CalendarDays className="h-5 w-5" /> },
    { label: "Active Users", value: "50,000+", icon: <Users className="h-5 w-5" /> },
    { label: "Cities", value: "120+", icon: <MapPin className="h-5 w-5" /> },
    { label: "Satisfaction Rate", value: "98%", icon: <Star className="h-5 w-5" /> },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-hidden">
      <MainNav />

      {/* Hero Section - Enhanced with parallax and advanced animations */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border/40">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6),transparent)]" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            {isLoaded && (
              <>
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-1000" />
                <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000" />
              </>
            )}
          </div>
        </div>

        <motion.div
          className="container px-4 md:px-6 relative z-10"
          style={{ opacity, scale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-blue-600/80 hover:bg-blue-700 text-white backdrop-blur-sm px-3 py-1.5 text-sm">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Next Generation Event Platform
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-blue-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Discover & Join Amazing Events
            </motion.h1>

            <motion.p
              className="mt-4 text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Connect with communities and attend events for tech enthusiasts, bookworms, and remote workers.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Browse Events
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-blue-500/30 hover:border-blue-500/60 rounded-full backdrop-blur-sm"
              >
                Host an Event
              </Button>
            </motion.div>

            {/* Floating cards preview */}
            <motion.div
              className="mt-16 relative h-64 md:h-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div
                className="absolute left-1/2 top-0 -translate-x-1/2 w-64 md:w-80 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden"
                initial={{ y: 100, x: "-50%", rotate: -5, opacity: 0 }}
                animate={{ y: 0, x: "-50%", rotate: -5, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8, type: "spring" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-4">
                  <div className="h-32 bg-blue-900/30 rounded-lg mb-3 flex items-center justify-center">
                    <Cpu className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="font-medium">Tech Meetup</h3>
                  <p className="text-xs text-muted-foreground">Connect with tech enthusiasts</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute left-1/2 top-10 -translate-x-1/2 w-64 md:w-80 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden"
                initial={{ y: 100, x: "-80%", rotate: 5, opacity: 0 }}
                animate={{ y: 10, x: "-80%", rotate: 5, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.9, type: "spring" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-4">
                  <div className="h-32 bg-amber-900/30 rounded-lg mb-3 flex items-center justify-center">
                    <Coffee className="h-10 w-10 text-amber-400" />
                  </div>
                  <h3 className="font-medium">Work From Coffeeshop</h3>
                  <p className="text-xs text-muted-foreground">Productive coworking sessions</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute left-1/2 top-10 -translate-x-1/2 w-64 md:w-80 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden"
                initial={{ y: 100, x: "-20%", rotate: -5, opacity: 0 }}
                animate={{ y: 10, x: "-20%", rotate: -5, opacity: 1 }}
                transition={{ duration: 0.7, delay: 1.0, type: "spring" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-4">
                  <div className="h-32 bg-emerald-900/30 rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-emerald-400" />
                  </div>
                  <h3 className="font-medium">Bookworm</h3>
                  <p className="text-xs text-muted-foreground">Book clubs and literary discussions</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-border/40 bg-gradient-to-b from-background to-blue-950/20">
        <div className="container px-4 md:px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.label} className="text-center" variants={itemVariants}>
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-500/10 text-blue-400">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Category Showcase - Interactive and Engaging */}
      <section className="py-24 border-b border-border/40 overflow-hidden">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Badge className="mb-4 bg-blue-600/20 text-blue-400 backdrop-blur-sm">Explore</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Find Your Perfect Event Type</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover events tailored to your interests and connect with like-minded individuals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Category Tabs */}
            <motion.div
              className="flex flex-col gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.slug}
                  variants={itemVariants}
                  className={cn(
                    "group cursor-pointer rounded-xl p-4 transition-all duration-300",
                    activeCategory === index
                      ? `border ${category.borderColor} bg-gradient-to-r from-background to-blue-950/30`
                      : "border border-border/40 hover:border-blue-500/30",
                  )}
                  onClick={() => setActiveCategory(index)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "rounded-full p-3 flex items-center justify-center transition-colors",
                        activeCategory === index ? category.color : "bg-blue-950/50",
                      )}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3
                          className={cn(
                            "font-semibold text-lg mb-1 transition-colors",
                            activeCategory === index ? category.textColor : "",
                          )}
                        >
                          {category.name}
                        </h3>
                        <ChevronRight
                          className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform",
                            activeCategory === index ? "rotate-90 text-blue-400" : "group-hover:translate-x-1",
                          )}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{category.description}</p>

                      <AnimatePresence>
                        {activeCategory === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <ul className="mt-4 space-y-2">
                              {category.features.map((feature, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center text-sm"
                                >
                                  <div className={cn("w-1.5 h-1.5 rounded-full mr-2", category.textColor)} />
                                  {feature}
                                </motion.li>
                              ))}
                            </ul>
                            <div className="mt-4">
                              <Button variant="link" className={cn("p-0", category.textColor)} asChild>
                                <Link href={`/events?category=${category.slug}`} className="flex items-center">
                                  Browse {category.count} events
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Category Preview */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden border border-border/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
                  <img
                    src={categories[activeCategory].image || "/placeholder.svg"}
                    alt={categories[activeCategory].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <Badge
                      className={cn(
                        "mb-2",
                        activeCategory === 0 ? "bg-amber-600" : activeCategory === 1 ? "bg-blue-600" : "bg-emerald-600",
                      )}
                    >
                      {categories[activeCategory].count} Events
                    </Badge>
                    <h3 className="text-2xl font-bold mb-2">{categories[activeCategory].name}</h3>
                    <p className="text-muted-foreground mb-4">{categories[activeCategory].description}</p>
                    <Button
                      className={cn(
                        "rounded-full",
                        activeCategory === 0
                          ? "bg-amber-600 hover:bg-amber-700"
                          : activeCategory === 1
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-emerald-600 hover:bg-emerald-700",
                      )}
                      asChild
                    >
                      <Link href={`/events?category=${categories[activeCategory].slug}`}>
                        Explore Events
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events - Enhanced with staggered animations */}
      <section className="py-24 bg-gradient-to-b from-background to-blue-950/20">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Badge className="mb-4 bg-blue-600/20 text-blue-400">Featured</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Upcoming Events You'll Love</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on these popular events happening soon
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="relative bg-card rounded-xl overflow-hidden border border-border/40 h-full shadow-lg transition-all duration-300 group-hover:shadow-blue-500/10 group-hover:border-blue-500/30">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge
                        className={cn(
                          "capitalize",
                          event.category === "tech-meetup"
                            ? "bg-blue-600"
                            : event.category === "bookworm"
                              ? "bg-emerald-600"
                              : "bg-amber-600",
                        )}
                      >
                        {event.category.split("-").join(" ")}
                      </Badge>
                      <Badge variant={event.availability === "limited" ? "destructive" : "outline"}>
                        {event.availability === "limited" ? "Few spots left" : "Available"}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>

                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span>
                        {event.startTime.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-5">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{event.venue}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/40">
                      <Button
                        variant="ghost"
                        className="w-full justify-between group-hover:text-blue-400 transition-colors"
                        asChild
                      >
                        <Link href={`/events/${event.id}`}>
                          View Details
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex justify-center mt-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-blue-500/30 hover:border-blue-500/60 group"
              asChild
            >
              <Link href="/events" className="flex items-center">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 border-t border-border/40 bg-gradient-to-b from-blue-950/20 to-background">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Badge className="mb-4 bg-blue-600/20 text-blue-400">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who have discovered amazing events through our platform
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-card border border-border/40 rounded-xl p-6 h-full shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground",
                        )}
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 to-background/80" />

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">Get Started Today</Badge>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400"
              variants={itemVariants}
            >
              Ready to Discover Your Next Favorite Event?
            </motion.h2>

            <motion.p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" variants={itemVariants}>
              Join our community of event enthusiasts and never miss out on exciting opportunities to connect, learn,
              and grow.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-blue-500/30 hover:border-blue-500/60 rounded-full"
                asChild
              >
                <Link href="/events">Browse Events</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

