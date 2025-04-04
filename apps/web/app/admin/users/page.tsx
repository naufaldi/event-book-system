"use client"

import { useState, useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu"
import { Search, MoreHorizontal, Filter } from "lucide-react"
import { motion } from "framer-motion"
import AdminLayout from "@/components/layout/admin"
import { useRouter } from "next/navigation"
import { formatDate } from "@workspace/ui/lib/utils"

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "User",
    status: "Active",
    eventsAttended: 8,
    registrationDate: new Date("2024-01-15"),
  },
  {
    id: 2,
    name: "Jamie Smith",
    email: "jamie@example.com",
    role: "User",
    status: "Active",
    eventsAttended: 12,
    registrationDate: new Date("2024-02-20"),
  },
  {
    id: 3,
    name: "Casey Wilson",
    email: "casey@example.com",
    role: "Admin",
    status: "Active",
    eventsAttended: 5,
    registrationDate: new Date("2023-11-05"),
  },
  {
    id: 4,
    name: "Morgan Lee",
    email: "morgan@example.com",
    role: "User",
    status: "Inactive",
    eventsAttended: 3,
    registrationDate: new Date("2024-01-28"),
  },
  {
    id: 5,
    name: "Taylor Green",
    email: "taylor@example.com",
    role: "User",
    status: "Active",
    eventsAttended: 6,
    registrationDate: new Date("2023-12-12"),
  },
  {
    id: 6,
    name: "Jordan Brown",
    email: "jordan@example.com",
    role: "User",
    status: "Active",
    eventsAttended: 2,
    registrationDate: new Date("2024-03-01"),
  },
  {
    id: 7,
    name: "Riley Clark",
    email: "riley@example.com",
    role: "User",
    status: "Inactive",
    eventsAttended: 0,
    registrationDate: new Date("2024-02-15"),
  },
]

export default function AdminUsers() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)

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

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(mockUsers)
    }
  }, [searchTerm])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="h-10 w-10 rounded-full border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading users...</p>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">Manage user accounts on the platform</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add User</Button>
        </div>

        <Card className="border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Role
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
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Events Attended</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === "Admin" ? (
                          <Badge className="bg-blue-600 text-white">Admin</Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.status === "Active" ? (
                          <Badge variant="outline" className="border-green-500 text-green-500">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-500 text-amber-500">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.eventsAttended}</TableCell>
                      <TableCell>{formatDate(user.registrationDate)}</TableCell>
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
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            {user.status === "Active" ? (
                              <DropdownMenuItem>Deactivate User</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>Activate User</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">No users found. Try adjusting your search.</div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  )
}

