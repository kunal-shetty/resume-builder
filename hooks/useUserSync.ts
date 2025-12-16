"use client"

import { useEffect } from "react"

export function useUserSync() {
  useEffect(() => {
    fetch("/api/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data?.user) return

        localStorage.setItem(
          "rb_user",
          JSON.stringify(data.user)
        )
      })
      .catch(() => {})
  }, [])
}
