"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TypewriterTextProps {
  text: string
  className?: string
  delay?: number
}

export default function TypewriterText({ text, className = "", delay = 0 }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (currentIndex < text.length) {
          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }
      },
      delay + currentIndex * 100,
    )

    return () => clearTimeout(timer)
  }, [currentIndex, text, delay])

  return (
    <div className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
        className="inline-block w-1 h-full bg-current ml-1"
      >
        |
      </motion.span>
    </div>
  )
}
