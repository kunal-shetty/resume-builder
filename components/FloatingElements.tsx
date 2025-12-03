"use client"

import { motion } from "framer-motion"
import { FileText, Sparkles, Zap, Trophy } from "lucide-react"

export default function FloatingElements() {
  const elements = [
    { icon: FileText, delay: 0, x: "10%", y: "20%" },
    { icon: Sparkles, delay: 1, x: "80%", y: "30%" },
    { icon: Zap, delay: 2, x: "15%", y: "70%" },
    { icon: Trophy, delay: 3, x: "85%", y: "80%" },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {elements.map(({ icon: Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-orange-400/30"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Icon size={32} />
        </motion.div>
      ))}
    </div>
  )
}
