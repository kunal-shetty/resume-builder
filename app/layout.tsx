import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portfolio Builder - Create Stunning Portfolios",
  description:
    "Build amazing animated portfolios with crazy effects, real-time customization, and one-click deployment. No coding required.",
  keywords: "portfolio builder, web design, animations, templates, developer portfolio",
  authors: [{ name: "Portfolio Builder Team" }],
  openGraph: {
    title: "Portfolio Builder - Create Stunning Portfolios",
    description:
      "Build amazing animated portfolios with crazy effects, real-time customization, and one-click deployment.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
