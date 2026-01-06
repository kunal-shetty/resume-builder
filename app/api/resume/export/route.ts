import { chromium } from "playwright"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  console.log("🚀 EXPORT STARTED")

  try {
    // ---------------- AUTH ----------------
    console.log("🔐 Fetching session...")
    const session = await getServerSession()

    if (!session?.user?.email) {
      console.log("❌ Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ---------------- BODY ----------------
    const { format } = await req.json()
    console.log("📦 Format:", format)

    if (!["png", "pdf"].includes(format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }

    // ---------------- BROWSER ----------------
    console.log("🧠 Launching Playwright Chromium...")
    const browser = await chromium.launch({
      headless: true,
    })

    console.log("🧭 Browser launched")

    const context = await browser.newContext({
      viewport: { width: 794, height: 1123 },
    })

    const page = await context.newPage()

    // Forward auth cookies
    await page.setExtraHTTPHeaders({
      cookie: req.headers.get("cookie") || "",
      "x-puppeteer": "1", // reused flag
    })

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/export`
    console.log("🌐 Navigating to:", url)

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60000,
    })

    console.log("🔍 Waiting for #export-area")
    const element = await page.waitForSelector("#export-area", {
      timeout: 30000,
    })

    if (!element) {
      throw new Error("Export area not found")
    }

    let buffer: Buffer
    let filename: string
    let contentType: string

    // ---------------- EXPORT ----------------
    if (format === "png") {
      console.log("🖼 Taking PNG screenshot")
      buffer = await element.screenshot()
      filename = "resume.png"
      contentType = "image/png"
    } else {
      console.log("📄 Generating PDF")
      buffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "0mm",
          right: "0mm",
          bottom: "0mm",
          left: "0mm",
        },
      })
      filename = "resume.pdf"
      contentType = "application/pdf"
    }

    await browser.close()
    console.log("🎉 EXPORT SUCCESS")

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (err: any) {
    console.error("🔥 EXPORT FAILED")
    console.error(err)

    return NextResponse.json(
      {
        error: "Export failed",
        message: err?.message,
      },
      { status: 500 }
    )
  }
}
