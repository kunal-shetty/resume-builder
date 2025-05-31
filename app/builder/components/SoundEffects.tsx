"use client"

import { useEffect, useRef } from "react"

interface SoundEffectsProps {
  enabled: boolean
}

export default function SoundEffects({ enabled }: SoundEffectsProps) {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (enabled && typeof window !== "undefined" && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.warn("Audio context not supported:", error)
      }
    }
  }, [enabled])

  const playSound = (frequency: number, duration = 100, type: OscillatorType = "sine") => {
    if (!enabled || !audioContextRef.current) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      oscillator.type = type

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000)
    } catch (error) {
      console.warn("Sound playback failed:", error)
    }
  }

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (!target || typeof target.closest !== "function") return

      try {
        if (target.tagName === "BUTTON") {
          playSound(800, 150, "square")
        } else if (target.closest("[data-sound='hover']")) {
          playSound(600, 100, "sine")
        } else if (target.closest("input, textarea")) {
          playSound(400, 50, "triangle")
        }
      } catch (error) {
        // Silently handle any errors with closest()
      }
    }

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (!target || typeof target.closest !== "function") return

      try {
        if (target.tagName === "BUTTON" || target.closest("[data-sound='hover']")) {
          playSound(300, 50, "sine")
        }
      } catch (error) {
        // Silently handle any errors with closest()
      }
    }

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClick)
      document.addEventListener("mouseenter", handleHover, true)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener("click", handleClick)
      document.removeEventListener("mouseenter", handleHover, true)
    }
  }, [enabled])

  return null
}
