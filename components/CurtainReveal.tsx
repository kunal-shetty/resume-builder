"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function CurtainReveal() {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setPlay(true), 50)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Left Curtain */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: play ? "-100%" : 0 }}
        transition={{ duration: 1.3, ease: [0.45, 0, 0.55, 1] }}
        className="absolute top-0 left-0 w-1/2 h-full bg-black"
      />

      {/* Right Curtain */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: play ? "100%" : 0 }}
        transition={{ duration: 1.3, ease: [0.45, 0, 0.55, 1] }}
        className="absolute top-0 right-0 w-1/2 h-full bg-black"
      />

    </div>
  )
}
