"use client"

import { Suspense, useEffect, useState } from "react"
import EditorClient from "./EditorClient";

/* ---------------- Loader ---------------- */
function EditorLoader({ step, isComplete }: { step: number; isComplete?: boolean }) {
  const steps = [
    "Initializing editor",
    "Loading templates",
    "Applying styles",
    "Almost ready",
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Animated gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5 rounded-full blur-3xl animate-pulse" />

      {/* Content */}
      <div className="w-full max-w-md px-8 relative z-10">
        {/* Logo/Icon area */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            {/* Subtle rotating ring */}
            <div className="absolute inset-0 rounded-2xl border border-neutral-700/50 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-2 text-neutral-100 tracking-tight">
          Resume Editor
        </h2>
        
        <p className="text-sm text-center text-neutral-500 mb-10">
          Professional document editing
        </p>

        {/* Progress container with subtle glass effect */}
        <div className="bg-neutral-900/60 backdrop-blur-xl rounded-2xl p-8 border border-neutral-800/60 shadow-2xl">
          {/* Step indicators */}
          <div className="relative flex justify-between mb-8">
            {/* Connection lines */}
            <div className="absolute top-5 left-0 right-0 h-[1px] bg-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-neutral-300 to-amber-500/80 transition-all duration-700"
                style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((_, idx) => (
              <div key={idx} className="relative flex flex-col items-center gap-3 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    idx < step
                      ? 'bg-neutral-100 shadow-lg shadow-amber-500/20'
                      : idx === step
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/40'
                      : 'bg-neutral-800 border border-neutral-700'
                  }`}
                >
                  {idx < step ? (
                    <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={`text-sm font-semibold ${idx === step ? 'text-white' : 'text-neutral-600'}`}>
                      {idx + 1}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Modern progress bar */}
          <div className="relative h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden mb-5">
            <div
              className="absolute inset-0 bg-gradient-to-r from-neutral-300 via-amber-500 to-orange-500 transition-all duration-700 ease-out"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
            {/* Glow effect */}
            <div
              className="absolute top-0 h-full bg-amber-400/40 blur-sm transition-all duration-700"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Step text */}
          <div className="text-center transition-all duration-300">
            {isComplete ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-base font-semibold text-neutral-100">
                    Loading Complete
                  </p>
                </div>
                <p className="text-xs text-neutral-500">
                  Redirecting to editor...
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-neutral-200 mb-1">
                  {steps[step]}
                </p>
                <p className="text-xs text-neutral-500">
                  {Math.round((step / (steps.length - 1)) * 100)}% complete
                </p>
              </>
            )}
          </div>
        </div>

        {/* Subtle loading dots */}
        {!isComplete && (
          <div className="flex justify-center gap-1.5 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- Gate ---------------- */
function EditorGate() {
  const [step, setStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    let current = 0

    const interval = setInterval(() => {
      current++
      setStep(current)

      if (current === 3) {
        clearInterval(interval)
        // Show complete message
        setTimeout(() => {
          setIsComplete(true)
          // Redirect after showing complete message
          setTimeout(() => {
            setShouldRender(true)
          }, 800)
        }, 800)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  if (!shouldRender) {
    return <EditorLoader step={step} isComplete={isComplete} />
  }

  return (
    <EditorClient />
  )
}

/* ---------------- Page ---------------- */
export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoader step={0} />}>
      <EditorGate />
    </Suspense>
  )
}