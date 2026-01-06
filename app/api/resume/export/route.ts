import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium-min"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import crypto from "crypto"

export const runtime = "nodejs"

export async function POST(req: Request) {
  console.log("🚀 EXPORT STARTED")

  try {
    console.log("🔐 Fetching session...")
    const session = await getServerSession()
    console.log("✅ Session:", session?.user?.email)

    if (!session?.user?.email) {
      console.log("❌ Unauthorized request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("📥 Reading request body...")
    const body = await req.json()
    console.log("📦 Body:", body)

    const { format } = body

    if (!["png", "pdf"].includes(format)) {
      console.log("❌ Invalid format:", format)
      return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }

    const exportToken = crypto.randomUUID()
    console.log("🔑 Export token:", exportToken)

    /* ---------------- Chromium ---------------- */

    console.log("🧠 Resolving Chromium executable...")
    const executablePath = await chromium.executablePath()
    console.log("📍 Chromium path:", executablePath)

    console.log("🚀 Launching browser...")
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
    })

    console.log("🧭 Browser launched")

    const page = await browser.newPage()
    console.log("📄 New page created")

    console.log("🍪 Forwarding cookies...")
    const cookieHeader = req.headers.get("cookie") || ""
    console.log("🍪 Cookie header length:", cookieHeader.length)

    await page.setExtraHTTPHeaders({
      cookie: cookieHeader,
      "x-puppeteer": "1",
    })

    console.log("🖥 Setting viewport...")
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
    })

    const exportUrl = `${process.env.NEXT_PUBLIC_APP_URL}/export`
    console.log("🌐 Navigating to:", exportUrl)

    await page.goto(exportUrl, {
      waitUntil: "networkidle0",
      timeout: 60000,
    })

    console.log("✅ Page loaded")

    console.log("🔍 Waiting for #export-area...")
    const element = await page.waitForSelector("#export-area", {
      timeout: 30000,
    })

    if (!element) {
      console.log("❌ export-area NOT FOUND")
      throw new Error("Export area not found")
    }

    console.log("✅ export-area found")

    let buffer: Buffer
    let contentType = ""
    let filename = ""

    if (format === "png") {
      console.log("🖼 Taking PNG screenshot...")
      buffer = (await element.screenshot({ type: "png" })) as Buffer
      contentType = "image/png"
      filename = "resume.png"
    } else {
      console.log("📄 Generating PDF...")
      buffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "0mm",
          right: "0mm",
          bottom: "0mm",
          left: "0mm",
        },
      })
      contentType = "application/pdf"
      filename = "resume.pdf"
    }

    console.log("✅ File generated:", filename)
    console.log("📦 Buffer size:", buffer.length)

    console.log("🧹 Closing browser...")
    await browser.close()
    console.log("✅ Browser closed")

    const response = new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })

    response.cookies.set("export_token", exportToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30,
      path: "/",
    })

    console.log("🎉 EXPORT SUCCESS")

    return response
  } catch (err) {
    console.error("🔥 EXPORT FAILED")
    console.error(err)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
