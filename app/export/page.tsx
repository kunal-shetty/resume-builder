import { getServerSession } from "next-auth"
import { headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { TemplatePreview } from "@/components/template-preview"

export default async function ExportPage() {
  const headersList = headers()
  const isPuppeteer = headersList.get("x-puppeteer") === "1"

  const session = await getServerSession()

  //  DO NOT redirect during puppeteer render
  if (!session?.user?.email) {
    if (isPuppeteer) return null
    throw new Error("Unauthorized")
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single()

  if (!user) {
    if (isPuppeteer) return null
    throw new Error("User not found")
  }

  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single()

  if (!resume) {
    if (isPuppeteer) return null
    throw new Error("Resume not found")
  }

  return (
    <div
      id="export-area"
      style={{
        width: "794px",
        minHeight: "1123px",
        background: "white",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <TemplatePreview
        templateId={resume.template_id}
        data={resume.data}
        styleConfig={resume.style_config}
      />
    </div>
  )
}
