import puppeteer from "puppeteer"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import crypto from "crypto"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { format } = await req.json() // "png" | "pdf"

  if (!format || !["png", "pdf"].includes(format)) {
    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  }

  // 🔐 SET export_token (PUPPETEER ACCESS KEY)
  const exportToken = crypto.randomUUID()

  const response = new NextResponse()

  response.cookies.set("export_token", exportToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30, // seconds
    path: "/export",
  })

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = await browser.newPage()

  // ✅ FORWARD AUTH COOKIES (MOST IMPORTANT)
  await page.setExtraHTTPHeaders({
    cookie: req.headers.get("cookie") || "",
  })

  await page.setViewport({
    width: 794,
    height: 1123,
    deviceScaleFactor: 2,
  })

  await page.goto(`${process.env.APP_URL}/export`, {
    waitUntil: "networkidle0",
  })

  const element = await page.waitForSelector("#export-area", {
    timeout: 10000,
  })

  if (!element) {
    await browser.close()
    return NextResponse.json(
      { error: "Export area not found" },
      { status: 500 }
    )
  }

  // ---------- PNG ----------
  if (format === "png") {
    const png = await element.screenshot({ type: "png" })
    await browser.close()

    return new NextResponse(png, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="resume.png"',
      },
    })
  }

  // ---------- PDF ----------
  const pdf = await page.pdf({
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

  await browser.close()

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="resume.pdf"',
    },
  })
}
