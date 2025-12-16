import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1️⃣ Get user
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, email, name, has_paid")
    .eq("email", session.user.email)
    .single()

  if (userError || !user) {
    return NextResponse.json({ user: null }, { status: 500 })
  }

  // 2️⃣ Get latest payment (if any)
  const { data: payment } = await supabase
    .from("payments")
    .select("plan")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      hasPaid: user.has_paid,
      plan: payment?.plan ?? "FREE",
    },
  })
}
