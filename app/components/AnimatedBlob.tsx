"use client"

import { motion } from "framer-motion"

export default function AnimatedBlob() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="relative"
      >
        <motion.div
          animate={{
            borderRadius: [
              "60% 40% 30% 70%/60% 30% 70% 40%",
              "30% 60% 70% 40%/50% 60% 30% 60%",
              "60% 40% 30% 70%/60% 30% 70% 40%",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-96 h-96 md:w-[500px] md:h-[500px] bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 blur-3xl"
        />
      </motion.div>
    </div>
  )
}
