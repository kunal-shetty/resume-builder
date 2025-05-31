"use client"

import { motion } from "framer-motion"

interface GlitchTextProps {
  text: string
  className?: string
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{
          x: [0, -2, 2, 0],
          textShadow: [
            "0 0 0 transparent",
            "2px 0 0 #ff0000, -2px 0 0 #00ffff",
            "-2px 0 0 #ff0000, 2px 0 0 #00ffff",
            "0 0 0 transparent",
          ],
        }}
        transition={{
          duration: 0.3,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 3,
        }}
      >
        {text}
      </motion.div>
    </div>
  )
}
