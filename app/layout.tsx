import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AuthProvider from "@/components/providers/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cognitia - Study, Learn, Grow",
  description: "A modern study app to help students build habits, learn skills, and stay consistent",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

