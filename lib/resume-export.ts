const FONT_WEIGHTS: Record<string, string> = {
  Lato: "wght@400;700",
  Merriweather: "wght@400;700",
}

export function googleFontsHref(fonts: string[]) {
  const families = Array.from(new Set(fonts.filter(Boolean)))
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:${FONT_WEIGHTS[f] || "wght@400;500;600;700"}`)
    .join("&")
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

// A4 is 210mm x 297mm. The sheet is laid out at 794px (210mm at 96dpi), the same
// width the editor preview uses, so the PDF matches what the user sees.
const PRINT_CSS = `
@page { size: A4; margin: 0; }
html, body { margin: 0; padding: 0; background: #ffffff; }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.resume-sheet {
  width: 210mm !important;
  min-height: 296.5mm;
  margin: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
/* Blocks tagged by markKeepTogether (a job, a degree, a skills group) never split across pages. */
.resume-sheet [data-keep], .resume-sheet li, .resume-sheet img { break-inside: avoid; }
.resume-sheet h1, .resume-sheet h2, .resume-sheet h3 { break-after: avoid; }
`

function collectAppCss(): string {
  let css = ""
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      css += Array.from(sheet.cssRules).map((r) => r.cssText).join("\n")
    } catch {
      // Cross-origin sheets (Google Fonts) are re-linked explicitly instead.
    }
  }
  return css
}

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!)

const KEEP_MAX_PX = 220

/**
 * Returns a copy of the sheet where every "maximal small block" (an element at most
 * KEEP_MAX_PX tall whose parent is taller) is tagged to stay on one page. That keeps
 * entries intact while letting columns and long sections flow onto the next page.
 * Measured on the live sheet, which is laid out at true A4 width.
 */
function markKeepTogether(sheet: HTMLElement): HTMLElement {
  const clone = sheet.cloneNode(true) as HTMLElement
  const live = sheet.querySelectorAll<HTMLElement>("*")
  const copies = clone.querySelectorAll<HTMLElement>("*")
  live.forEach((el, i) => {
    const parent = el.parentElement
    if (!parent || !(el instanceof HTMLDivElement || el.tagName === "SECTION" || el.tagName === "UL")) return
    if (el.offsetHeight > 0 && el.offsetHeight <= KEEP_MAX_PX && parent.offsetHeight > KEEP_MAX_PX) {
      copies[i]?.setAttribute("data-keep", "")
    }
  })
  return clone
}

export function buildResumeDocument(sheet: HTMLElement, opts: { fonts: string[]; title: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(opts.title)}</title>
<link rel="stylesheet" href="${googleFontsHref(opts.fonts)}" />
<style>${collectAppCss()}</style>
<style>${PRINT_CSS}</style>
</head>
<body>${markKeepTogether(sheet).outerHTML}</body>
</html>`
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Native print dialog on an isolated copy of the resume. Produces a vector PDF. */
export function printDocument(html: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe")
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden"
    iframe.srcdoc = html
    iframe.onload = async () => {
      try {
        const win = iframe.contentWindow!
        await win.document.fonts?.ready
        await Promise.all(
          Array.from(win.document.images).map((img) =>
            img.complete ? null : new Promise((r) => ((img.onload = r), (img.onerror = r))),
          ),
        )
        win.focus()
        win.print()
        resolve()
      } catch (err) {
        reject(err)
      } finally {
        setTimeout(() => iframe.remove(), 1000)
      }
    }
    document.body.appendChild(iframe)
  })
}

export type ExportResult = "downloaded" | "print-dialog"

export async function exportResume(
  sheet: HTMLElement,
  format: "pdf" | "png",
  opts: { fonts: string[]; filename: string },
): Promise<ExportResult> {
  const html = buildResumeDocument(sheet, { fonts: opts.fonts, title: opts.filename })

  let res: Response | null = null
  try {
    res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, format, filename: opts.filename }),
    })
  } catch {
    res = null
  }

  if (res?.ok) {
    download(await res.blob(), `${opts.filename}.${format}`)
    return "downloaded"
  }

  const data = res ? await res.json().catch(() => null) : { fallback: true }
  if (format === "pdf" && (data?.fallback || !res)) {
    await printDocument(html)
    return "print-dialog"
  }
  throw new Error(data?.error || "Export failed. Try again.")
}
