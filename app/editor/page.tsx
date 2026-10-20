import type { Metadata } from "next"
import EditorClient from "./EditorClient"

export const metadata: Metadata = {
  title: "Resume Editor",
}

export default function EditorPage() {
  return <EditorClient />
}
