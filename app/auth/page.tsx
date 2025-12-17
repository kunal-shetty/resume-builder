"use client"

import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function AuthPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    // Logged in → redirect
    if (session) {
      router.replace("/templates")
    }
  }, [session, status, router])

  // Global auth loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Checking authentication…
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm text-center space-y-6">
        <h1 className="text-3xl font-bold">Sign in to continue</h1>

        <p className="text-gray-400 text-sm">
          Sign in with Google to start building your resume
        </p>

        <Button
          size="lg"
          className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={signingIn}
          onClick={() => {
            setSigningIn(true)
            signIn("google")
          }}
        >
          {signingIn ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in…
            </span>
          ) : (
            "Continue with Google"
          )}
        </Button>

        {signingIn && (
          <p className="text-xs text-gray-500">
            Redirecting to Google securely…
          </p>
        )}
      </div>
    </div>
  )
}
