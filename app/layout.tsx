import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Resume Builder: Free AI Resume Maker with ATS Templates",
    template: "%s | Resume Builder",
  },
  description:
    "Build a professional, ATS-friendly resume in minutes. AI writes your summary and bullet points, scores your resume against a job post, and exports a pixel-perfect PDF. No sign-up; your data stays in your browser.",
  keywords: ["resume builder", "AI resume", "ATS resume", "CV maker", "resume templates", "PDF resume"],
  openGraph: {
    title: "Resume Builder: Free AI Resume Maker",
    description: "ATS-friendly templates, AI writing help and pixel-perfect PDF export. No sign-up required.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
