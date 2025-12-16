import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"

const PLAN_RANK: Record<string, number> = {
  FREE: 0,
  BASIC: 1,
  ADVANCED: 2,
  PREMIUM: 3,
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      order_id,
      payment_id,
      signature,
      plan: newPlan,
      amount,
    } = await req.json()

    // 🔐 Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(order_id + "|" + payment_id)
      .digest("hex")

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1️⃣ Get user
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single()

    if (!user) throw new Error("User not found")

    // 2️⃣ Get current plan (latest payment)
    const { data: lastPayment } = await supabase
      .from("payments")
      .select("plan")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    const currentPlan = lastPayment?.plan ?? "FREE"

    // 3️⃣ Block invalid or downgrade attempts
    if (PLAN_RANK[newPlan] <= PLAN_RANK[currentPlan]) {
      return NextResponse.json({
        error: `Cannot upgrade from ${currentPlan} to ${newPlan}`,
      }, { status: 400 })
    }

    // 4️⃣ Save payment
    await supabase.from("payments").insert({
      user_id: user.id,
      order_id,
      payment_id,
      plan: newPlan,
      amount,
    })

    // 5️⃣ Mark user as paid (still useful flag)
    await supabase
      .from("users")
      .update({ has_paid: true })
      .eq("id", user.id)

    return NextResponse.json({
      success: true,
      previousPlan: currentPlan,
      newPlan,
    })

  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || "Payment failed" },
      { status: 500 }
    )
  }
}
