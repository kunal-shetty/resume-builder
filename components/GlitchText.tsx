"use client"

import { motion } from "framer-motion"

interface GlitchTextProps {
  text: string
  className?: string
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <div className={`relative inline-block leading-none ${className}`}>
      {/* Main layer */}
      <motion.span
        className="relative z-10 block m-0 p-0"
        animate={{
          textShadow: [
            "0 0 0 transparent",
            "2px 0 0 #ff004c, -2px 0 0 #00f7ff",
            "0 0 0 transparent"
          ],
        }}
        transition={{
          duration: 0.25,
          repeat: Infinity,
          repeatDelay: 1.8,
        }}
      >
        {text}
      </motion.span>

      {/* Red layer */}
      <motion.span
        className="absolute top-0 left-0 block m-0 p-0"
        animate={{
          x: [0, 1.5, -1.5, 0],
          opacity: [0.6, 0.85, 0.65, 0.6],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
        style={{ color: "#ff004c", mixBlendMode: "screen" }}
      >
        {text}
      </motion.span>

      {/* Blue/green layer */}
      <motion.span
        className="absolute top-0 left-0 block m-0 p-0"
        animate={{
          x: [0, -1.5, 1.5, 0],
          opacity: [0.6, 0.7, 0.9, 0.6],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2.3,
        }}
        style={{ color: "#00f7ff", mixBlendMode: "screen" }}
      >
        {text}
      </motion.span>
    </div>
  )
}
