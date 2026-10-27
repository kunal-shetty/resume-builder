import { existsSync } from "node:fs"
import { NextResponse } from "next/server"
import type { Browser } from "puppeteer-core"
import { DAY, MINUTE, envLimit, rateLimit, RateLimitError } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

const MAX_HTML_BYTES = 4 * 1024 * 1024
// The page renders untrusted, user-supplied HTML, so it may only fetch fonts.
const ALLOWED_HOSTS = new Set(["fonts.googleapis.com", "fonts.gstatic.com"])

const LOCAL_CHROME_PATHS = [
  process.env.CHROME_EXECUTABLE_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
]

let browserPromise: Promise<Browser> | null = null

async function launchBrowser(): Promise<Browser> {
  const puppeteer = (await import("puppeteer-core")).default
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY)
  const localPath = isServerless ? undefined : LOCAL_CHROME_PATHS.find((p): p is string => !!p && existsSync(p))

  if (localPath) {
    return puppeteer.launch({ executablePath: localPath, headless: true, args: ["--no-sandbox", "--disable-gpu"] })
  }
  if (process.platform !== "linux") {
    throw new Error("No Chrome/Edge found. Install Chrome or set CHROME_EXECUTABLE_PATH.")
  }
  const chromium = (await import("@sparticuz/chromium")).default
  return puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    headless: true,
  })
}

// Reuse one browser per warm instance; relaunch if it died.
async function getBrowser() {
  if (browserPromise) {
    const browser = await browserPromise.catch(() => null)
    if (browser?.connected) return browser
  }
  browserPromise = launchBrowser()
  browserPromise.catch(() => (browserPromise = null))
  return browserPromise
}

function safeFilename(name: unknown, ext: string) {
  const base = typeof name === "string" ? name.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "_").slice(0, 80) : ""
  return `${base || "resume"}.${ext}`
}

export async function POST(req: Request) {
  try {
    await rateLimit(
      req,
      "export",
      [
        { name: "minute", max: envLimit("EXPORT_RATE_LIMIT_PER_MINUTE", 10), windowMs: MINUTE },
        { name: "day", max: envLimit("EXPORT_RATE_LIMIT_PER_DAY", 200), windowMs: DAY },
      ],
      { what: "exports" },
    )
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json({ error: err.message }, { status: 429, headers: { "Retry-After": String(err.retryAfter) } })
    }
    throw err
  }

  const body = await req.json().catch(() => null)
  const html: unknown = body?.html
  const format = body?.format === "png" ? "png" : "pdf"
  if (typeof html !== "string" || !html.includes("resume-sheet")) {
    return NextResponse.json({ error: "Nothing to export." }, { status: 400 })
  }
  if (Buffer.byteLength(html) > MAX_HTML_BYTES) {
    return NextResponse.json({ error: "Resume is too large to export. Try a smaller photo." }, { status: 413 })
  }

  let browser: Browser
  try {
    browser = await getBrowser()
  } catch (err) {
    console.error("Export: browser unavailable", err)
    // 503 tells the client to fall back to the browser's own print-to-PDF.
    return NextResponse.json({ error: "PDF renderer unavailable.", fallback: true }, { status: 503 })
  }

  const page = await browser.newPage()
  try {
    await page.setJavaScriptEnabled(false)
    await page.setRequestInterception(true)
    page.on("request", (request) => {
      const url = request.url()
      if (url.startsWith("data:") || url === "about:blank") return request.continue()
      try {
        const { protocol, hostname } = new URL(url)
        if (protocol === "https:" && ALLOWED_HOSTS.has(hostname)) return request.continue()
      } catch {}
      return request.abort()
    })

    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: format === "png" ? 2 : 1 })
    await page.setContent(html, { waitUntil: "load", timeout: 20_000 })
    // Web fonts are requested during layout, after "load"; wait for them to land.
    await page.waitForNetworkIdle({ idleTime: 300, timeout: 10_000 }).catch(() => {})

    let buffer: Uint8Array
    if (format === "pdf") {
      buffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      })
    } else {
      buffer = await page.screenshot({ type: "png", fullPage: true })
    }

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": format === "pdf" ? "application/pdf" : "image/png",
        "Content-Disposition": `attachment; filename="${safeFilename(body?.filename, format)}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (err) {
    console.error("Export failed", err)
    return NextResponse.json({ error: "Export failed. Try again.", fallback: format === "pdf" }, { status: 500 })
  } finally {
    await page.close().catch(() => {})
  }
}
