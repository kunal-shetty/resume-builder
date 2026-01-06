import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import crypto from "crypto"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
  const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { format } = await req.json()

    if (!["png", "pdf"].includes(format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }

    const exportToken = crypto.randomUUID()

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })

    const page = await browser.newPage()

    await page.setExtraHTTPHeaders({
      cookie: req.headers.get("cookie") || "",
    })

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
    })

    await page.goto(`${process.env.NEXT_PUBLIC_APP_URL}/export`, {
      waitUntil: "networkidle0",
    })

    const element = await page.waitForSelector("#export-area", {
      timeout: 30000,
    })

    if (!element) {
      throw new Error("Export area not found")
    }

    let buffer: Buffer
    let contentType = ""
    let filename = ""

    if (format === "png") {
      buffer = await element.screenshot({ type: "png" }) as Buffer
      contentType = "image/png"
      filename = "resume.png"
    } else {
      buffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
      })
      contentType = "application/pdf"
      filename = "resume.pdf"
    }

    await browser.close()

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

    return response
  } catch (err) {
    console.error("EXPORT ERROR:", err)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
