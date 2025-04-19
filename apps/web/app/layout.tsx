import type React from "react"

import ClientLayout from "./client-layout"
import { Toaster } from '@workspace/ui/components/sonner';

import '@workspace/ui/globals.css';


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

