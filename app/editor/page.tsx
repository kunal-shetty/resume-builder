import { Suspense } from "react"
import EditorClient from "./EditorClient"

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading editor…
        </div>
      }
    >
      <EditorClient />
    </Suspense>
  )
}
