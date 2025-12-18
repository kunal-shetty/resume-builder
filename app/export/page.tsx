import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { TemplatePreview } from "@/components/template-preview"

export default async function ExportPage() {

  // 🔐 Normal auth still required
  const session = await getServerSession()
  if (!session?.user?.email) redirect("/")

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single()

  if (!user) redirect("/403")

  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single()

  if (!resume) redirect("/404")

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

