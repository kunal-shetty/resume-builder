"use client"

import { motion } from "framer-motion"
import { FileText, Sparkles, Zap, Trophy, Palette, ShieldCheck, LineChart, Brain, CloudUpload, Globe, AppWindow, ArrowRight, Download, FileDown } from "lucide-react"

export default function FloatingElements() {
  const elements = [
  { icon: FileText, delay: 0, x: "10%", y: "20%" },
  { icon: Sparkles, delay: 1, x: "80%", y: "30%" },
  { icon: Zap, delay: 2, x: "15%", y: "70%" },
  { icon: Trophy, delay: 3, x: "85%", y: "80%" },

  // Added elements (balanced diagonally, symmetric glow layout)
  { icon: Palette, delay: 0.4, x: "25%", y: "10%" },
  { icon: ShieldCheck, delay: 1.2, x: "70%", y: "15%" },

  { icon: Brain, delay: 0.8, x: "5%", y: "40%" },
  { icon: CloudUpload, delay: 1.6, x: "90%", y: "45%" },

  { icon: Globe, delay: 2.4, x: "30%", y: "85%" },
  { icon: AppWindow, delay: 3.2, x: "60%", y: "88%" },

  { icon: ArrowRight, delay: 0.6, x: "40%", y: "25%" },
  { icon: Download, delay: 1.4, x: "60%", y: "30%" },

  { icon: FileDown, delay: 2.2, x: "20%", y: "55%" },
  { icon: Sparkles, delay: 3.5, x: "75%", y: "60%" },

  { icon: Zap, delay: 1.1, x: "45%", y: "75%" },
  { icon: Trophy, delay: 2.9, x: "10%", y: "90%" },

  { icon: Palette, delay: 0.9, x: "88%", y: "12%" },
  { icon: ShieldCheck, delay: 2.7, x: "12%", y: "12%" },

  { icon: Brain, delay: 1.8, x: "92%", y: "70%" },
  { icon: Globe, delay: 3.1, x: "50%", y: "50%" },

  { icon: Sparkles, delay: 2.5, x: "68%", y: "68%" },
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
