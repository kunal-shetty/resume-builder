import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { templateId, styleConfig, data, title } = await req.json()

  if (!templateId || !styleConfig || !data) {
    return NextResponse.json(
      { error: "Missing resume payload" },
      { status: 400 }
    )
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
    return NextResponse.json({ error: "User not found" }, { status: 500 })
  }

  const { data: existingResume } = await supabase
    .from("resumes")
    .select("id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single()

  if (existingResume?.id) {
    await supabase
      .from("resumes")
      .update({
        template_id: templateId,
        style_config: styleConfig,
        data,
        title: title ?? "My Resume",
        updated_at: new Date(),
      })
      .eq("id", existingResume.id)
  } else {
    await supabase.from("resumes").insert({
      user_id: user.id,
      template_id: templateId,
      style_config: styleConfig,
      data,
      title: title ?? "My Resume",
    })
  }

  return NextResponse.json({ success: true })
}
