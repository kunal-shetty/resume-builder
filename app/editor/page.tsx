"use client"

import { Suspense, useEffect, useState } from "react"
import EditorClient from "./EditorClient"

/* ---------- Simple 1s Loader ---------- */
function QuickLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-neutral-600 border-t-neutral-200 animate-spin" />
        <p className="text-sm text-neutral-400">Loading editor…</p>
      </div>
    </div>
  )
}

/* ---------- Gate ---------- */
function EditorGate() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true)
    }, 1000) // ⏱ exactly 1 second

    return () => clearTimeout(timer)
  }, [])

  if (!ready) {
    return <QuickLoader />
  }

  return <EditorClient />
}

/* ---------- Page ---------- */
export default function EditorPage() {
  return (
    <Suspense fallback={<QuickLoader />}>
      <EditorGate />
    </Suspense>
  )
}
