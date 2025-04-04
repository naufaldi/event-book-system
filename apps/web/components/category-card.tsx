"use client"

import { Card, CardContent } from "@workspace/ui/components/card"
import { motion } from "framer-motion"
import Link from "next/link"
import { Coffee, Cpu, BookOpen } from "lucide-react"

interface CategoryCardProps {
  category: {
    name: string
    description: string
    slug: string
    icon: string
    color: string
    count: number
  }
  index: number
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  // Select icon based on category
  const IconComponent = () => {
    switch (category.icon) {
      case "coffee":
        return <Coffee className="h-10 w-10 text-white" />
      case "cpu":
        return <Cpu className="h-10 w-10 text-white" />
      case "book-open":
        return <BookOpen className="h-10 w-10 text-white" />
      default:
        return <Coffee className="h-10 w-10 text-white" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Link href={`/events?category=${category.slug}`}>
        <Card className="overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-background shadow-md transition-all hover:shadow-xl h-full">
          <div className="absolute inset-0 bg-grid-white/5" />
          <CardContent className="relative z-10 p-6">
            <div className="flex items-start gap-4">
              <div className={`${category.color} rounded-full p-3 flex items-center justify-center`}>
                <IconComponent />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
                <p className="mt-2 text-sm font-medium">{category.count} events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

