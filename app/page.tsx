"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight, Sparkles, Zap, Palette, Download,
  FileDown, Brain, CloudUpload, ShieldCheck, Trophy, LineChart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ParticlesBackground from "@/components/ParticlesBackground"
import AnimatedBlob from "@/components/AnimatedBlob"
import TypewriterText from "@/components/TypewriterText"
import GlitchText from "@/components/GlitchText"
import FloatingElements from "@/components/FloatingElements"
import { hasSavedResume } from "@/lib/resume"

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    setHasDraft(hasSavedResume())
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Writing",
      description: "AI drafts your summary and turns rough notes into strong, achievement-focused bullet points.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "ATS Job Match",
      description: "Paste a job post to get a match score, missing keywords and specific fixes before you apply.",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "10 Templates",
      description: "Recruiter-friendly designs, six of them ATS-optimized, with your own colors, fonts and spacing.",
    },
    {
      icon: <FileDown className="w-8 h-8" />,
      title: "Pixel-Perfect PDF",
      description: "Download a crisp A4 PDF with real, selectable text that looks exactly like the preview.",
    },
    {
      icon: <CloudUpload className="w-8 h-8" />,
      title: "Import in Seconds",
      description: "Paste an old resume or LinkedIn profile and AI fills in every section for you.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "No Sign-Up, Private",
      description: "No account needed. Your resume is saved only in your browser; back it up to a file anytime.",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Career Assistant",
      description: "Ask the built-in AI how to phrase an achievement, what to cut, or how to tailor for a role.",
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "Live Preview",
      description: "Every edit shows instantly on a true A4 page, with page-break guides so nothing gets cut off.",
    },
  ]

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-orange-900/40 to-black">
        <div className="absolute inset-0 animate-aurora opacity-40" />
      </div>

      <ParticlesBackground />
      <FloatingElements />

      {/* Custom glowing cursor */}
      <motion.div
        className="fixed top-0 left-0 hidden md:block w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full pointer-events-none z-50 mix-blend-difference shadow-lg shadow-orange-500/50"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Hero */}
      <section className="relative min-h-screen py-8 flex items-center justify-center px-4">
        <AnimatedBlob />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center z-10 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8"
          >
            <GlitchText text="RESUME" className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-4" />
            <TypewriterText
              text="BUILDER"
              className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Build an ATS-ready resume in minutes. AI writes and tailors it to the job, and you download a
            pixel-perfect PDF. Free, no sign-up, and your data never leaves your browser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link href={hasDraft ? "/editor" : "/templates"}>
              <Button
                size="lg"
                className="relative group bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 text-lg font-semibold rounded-full overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
                <span className="relative flex items-center">
                  {hasDraft ? "Continue Editing" : "Choose a Template"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link href="/builder">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-white/5 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Guided Builder
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mt-6 py-2 px-6 relative">
        <AnimatedBlob />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <GlitchText text="Features" className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent" />
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to craft a resume that truly stands out.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 shadow-lg"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />

                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="text-pink-400 mb-6 group-hover:text-yellow-400 transition-colors duration-300"
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-32 px-4 relative">
        <AnimatedBlob />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Craft a resume that speaks louder than words — designed to impress recruiters,
            stand out instantly, and unlock better opportunities.
          </p>
          <Link href={hasDraft ? "/editor" : "/templates"}>
            <Button
              size="lg"
              className="relative group px-12 py-6 text-xl font-bold rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white overflow-hidden"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-orange-600 to-yellow-500 blur-xl transition-opacity duration-500"></span>
              <span className="relative flex items-center">
                <Download className="mr-3 w-6 h-6 group-hover:animate-bounce" />
                Build Your Resume Now
              </span>
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
