"use client"

import { motion } from "framer-motion"
import { Code, Palette, Zap, Star, Heart, Sparkles } from "lucide-react"

export default function FloatingElements() {
  const elements = [
    { icon: Code, delay: 0 },
    { icon: Palette, delay: 1 },
    { icon: Zap, delay: 2 },
    { icon: Star, delay: 3 },
    { icon: Heart, delay: 4 },
    { icon: Sparkles, delay: 5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {elements.map((Element, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: Element.delay,
            repeatDelay: 6,
          }}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <Element.icon className="w-6 h-6 text-purple-400" />
        </motion.div>
      ))}
    </div>
  )
}
