"use client"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { ArrowLeft, EyeIcon, EyeOffIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import MainNav from "@/components/layout/main-nav"
import Footer from "@/components/layout/footer"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const router = useRouter()

  // Track mouse position for glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login with animation
    setTimeout(() => {
      toast.success("Login successful!")
      setIsLoading(false)
      // router.push("/dashboard")
    }, 1500)
  }

  // Floating orbs animation variants
  const orbVariants = {
    animate: (i: number) => ({
      x: Math.sin(i * 0.5) * 20,
      y: Math.cos(i * 0.5) * 20,
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.1, 1],
      transition: {
        duration: 8 + i * 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    }),
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden">
      <MainNav />
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid-white/[0.02] z-0" />

        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-black to-indigo-950/20 z-0" />

        {/* Animated orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={orbVariants}
            animate="animate"
            className="absolute rounded-full blur-3xl"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              background:
                i % 2 === 0
                  ? "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(29,78,216,0.1) 70%, rgba(0,0,0,0) 100%)"
                  : "radial-gradient(circle, rgba(79,70,229,0.3) 0%, rgba(67,56,202,0.1) 70%, rgba(0,0,0,0) 100%)",
              zIndex: 0,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Card className="backdrop-blur-xl border border-blue-500/20 bg-black/40 shadow-[0_0_25px_rgba(59,130,246,0.15)] overflow-hidden">
            {/* Glow effect that follows cursor */}
            <motion.div
              className="absolute inset-0 opacity-70 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x - 500}px ${mousePosition.y - 200}px, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 60%)`,
              }}
            />

            {/* Card border glow effect */}
            <div className="absolute inset-0 rounded-lg p-px bg-gradient-to-br from-blue-500/30 via-transparent to-indigo-500/30" />

            <CardHeader className="relative z-10 pb-6">
              <Link
                href="/"
                className="group inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-2 transition-colors"
              >
                <motion.span
                  className="mr-2 h-6 w-6 rounded-full bg-blue-950/50 flex items-center justify-center border border-blue-500/20"
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </motion.span>
                <span className="relative">
                  Back to home
                  <span className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </span>
              </Link>
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Welcome back
              </CardTitle>
              <CardDescription className="text-zinc-400">Sign in to your account to continue</CardDescription>
            </CardHeader>

            <form onSubmit={handleLogin}>
              <CardContent className="relative z-10 space-y-5">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="email" className="text-zinc-300">
                    Email
                  </Label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-blue-500/50 to-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="relative bg-zinc-900/70 border-zinc-800 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-zinc-300">
                      Password
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors relative group"
                    >
                      Forgot password?
                      <span className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-blue-500/50 to-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-zinc-900/70 border-zinc-800 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-zinc-400 hover:text-blue-400 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={showPassword ? "visible" : "hidden"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                          >
                            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </motion.div>
                        </AnimatePresence>
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="text-xs text-blue-400/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Demo credentials: user@example.com / password
                </motion.div>
              </CardContent>

              <CardFooter className="relative z-10 flex flex-col space-y-4 pb-6">
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative group">
                    {/* Button glow effect */}
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 opacity-70 group-hover:opacity-100 blur-lg transition-all duration-300" />

                    <Button
                      type="submit"
                      className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2.5 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] border-t border-blue-500/30"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Signing In...
                        </div>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <span className="h-px w-12 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                    <span className="text-xs text-zinc-500">OR CONTINUE WITH</span>
                    <span className="h-px w-12 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <motion.button
                      type="button"
                      className="flex-1 flex items-center justify-center py-2 px-4 rounded-md bg-zinc-900/70 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all duration-300"
                      whileHover={{ y: -2, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.2)" }}
                      whileTap={{ y: 0 }}
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.19 18.63 6.8 16.69 5.95 14.1H2.27V16.94C4.08 20.47 7.76 23 12 23Z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.95 14.1C5.75 13.47 5.63 12.79 5.63 12.09C5.63 11.39 5.75 10.71 5.95 10.08V7.24H2.27C1.46 8.68 1 10.34 1 12.09C1 13.84 1.46 15.5 2.27 16.94L5.95 14.1Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.55C13.57 5.55 14.97 6.08 16.08 7.14L19.22 4C17.46 2.38 14.97 1.4 12 1.4C7.76 1.4 4.08 3.93 2.27 7.46L5.95 10.3C6.8 7.71 9.19 5.55 12 5.55Z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </motion.button>

                    <motion.button
                      type="button"
                      className="flex-1 flex items-center justify-center py-2 px-4 rounded-md bg-zinc-900/70 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all duration-300"
                      whileHover={{ y: -2, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.2)" }}
                      whileTap={{ y: 0 }}
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M13.5 1C7.97715 1 3.5 5.47715 3.5 11C3.5 15.4888 6.29665 19.2806 10.2391 20.5556C10.7454 20.6647 10.95 20.3559 10.95 20.0947C10.95 19.8335 10.9394 19.1499 10.9394 18.3576C8.5 18.8747 7.875 17.8082 7.7 17.2912C7.6025 17.0406 7.175 16.2482 6.75 15.9871C6.4 15.7788 6 15.2618 6.74035 15.2512C7.5 15.2406 8.03415 15.9765 8.25 16.2376C9.05 17.5929 10.3 17.3323 11 17.0712C11.1 16.4965 11.3975 16.1135 11.75 15.8947C9.5 15.6759 7.2 14.8835 7.2 11.3835C7.2 10.3171 7.5 9.43529 8.25 8.75353C8.15 8.50235 7.9 7.56647 8.35 6.30176C8.35 6.30176 9.125 6.04059 10.95 7.27765C11.8 7.05706 12.65 6.94676 13.5 6.94676C14.35 6.94676 15.2 7.05706 16.05 7.27765C17.875 6.03 18.65 6.30176 18.65 6.30176C19.1 7.56647 18.85 8.50235 18.75 8.75353C19.5 9.43529 19.8 10.3171 19.8 11.3835C19.8 14.8941 17.5 15.6759 15.25 15.8947C15.7 16.1665 16.1 16.6835 16.1 17.4865C16.1 18.6494 16.0894 19.7382 16.0894 20.0947C16.0894 20.3559 16.2941 20.6753 16.8004 20.5556C18.7677 19.9101 20.4681 18.6005 21.6074 16.8497C22.7466 15.0988 23.2545 13.0426 23.0503 10.9923C22.846 8.94195 21.9402 7.01686 20.4814 5.56807C19.0226 4.11929 17.0975 3.21346 15.0472 3.00924C12.9969 2.80501 10.9407 3.31286 9.18982 4.45215C7.43896 5.59145 6.12936 7.29179 5.48385 9.25911C4.83834 11.2264 4.88909 13.3427 5.62686 15.2765C6.36463 17.2103 7.74458 18.8545 9.5 19.9394"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      GitHub
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  className="text-center mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="text-zinc-500 text-sm">
                    Don't have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="text-blue-400 hover:text-blue-300 transition-colors relative group"
                    >
                      Sign up
                      <span className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </Link>
                  </span>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
      <Footer/>
    </div>
  )
}
