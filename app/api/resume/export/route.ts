import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium-min"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import crypto from "crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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

    const { format } = await req.json()
    console.log("📦 Format:", format)

    if (!["png", "pdf"].includes(format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }

    const isProd = process.env.NODE_ENV === "production"

    console.log("🌍 Environment:", process.env.NODE_ENV)

    console.log("🧠 Launching browser...")
    const browser = await puppeteer.launch(
      isProd
        ? {
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
          }
        : {
            headless: true,
          }
    )

    console.log("🧭 Browser launched")

    const page = await browser.newPage()

    await page.setExtraHTTPHeaders({
      cookie: req.headers.get("cookie") || "",
      "x-puppeteer": "1",
    })

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
    })

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/export`
    console.log("🌐 Navigating to:", url)

    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 })

    console.log("🔍 Waiting for #export-area")
    const element = await page.waitForSelector("#export-area", { timeout: 30000 })

    if (!element) throw new Error("Export area not found")

    let buffer: Buffer
    let filename: string
    let contentType: string

    if (format === "png") {
      buffer = (await element.screenshot({ type: "png" })) as Buffer
      filename = "resume.png"
      contentType = "image/png"
    } else {
      buffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
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
  } catch (err) {
    console.error("🔥 EXPORT FAILED")
    console.error(err)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
