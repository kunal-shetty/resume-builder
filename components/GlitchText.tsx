"use client"

import { motion } from "framer-motion"

interface GlitchTextProps {
  text: string
  className?: string
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.h1
        className="relative z-10"
        animate={{
          textShadow: ["0 0 0 transparent", "2px 0 0 #ff0000, -2px 0 0 #00ff00", "0 0 0 transparent"],
        }}
        transition={{
          duration: 0.1,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 3,
        }}
      >
        {text}
      </motion.h1>
      <motion.h1
        className="absolute top-0 left-0 opacity-80"
        animate={{
          x: [0, 2, -2, 0],
          opacity: [0.8, 0.9, 0.7, 0.8],
        }}
        transition={{
          duration: 0.2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 2,
        }}
        style={{ color: "#ff0000", mixBlendMode: "multiply" }}
      >
        {text}
      </motion.h1>
      <motion.h1
        className="absolute top-0 left-0 opacity-80"
        animate={{
          x: [0, -2, 2, 0],
          opacity: [0.8, 0.7, 0.9, 0.8],
        }}
        transition={{
          duration: 0.2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 2.5,
        }}
        style={{ color: "#00ff00", mixBlendMode: "multiply" }}
      >
        {text}
      </motion.h1>
    </div>
  )
}
