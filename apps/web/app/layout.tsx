import type React from "react"
import { Inter } from "next/font/google"
import ClientLayout from "./client-layout"
import { Toaster } from '@workspace/ui/components/sonner';

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EventChain - Web3 Event Booking",
  description: "Next-generation event booking platform with web3 aesthetics",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}
	<Toaster />
	</ClientLayout>
}

