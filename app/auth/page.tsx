"use client"

import { useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    // If logged in → go to builder
    if (session) {
      router.replace("/builder")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking authentication...
      </div>
    )
  }

  // Not logged in → show Google sign-in
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Sign in to continue</h1>
        <p className="text-gray-400">
          Sign in with Google to start building your resume
        </p>

            <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => signIn("google")}
            >
          Continue with Google
        </Button>
      </div>
    </div>
  )
}
