"use client"

import { useEffect, useRef, useState } from "react"
import { TemplatePreview } from "@/components/template-preview"
import { defaultStyle } from "@/lib/resume"

const SHEET_WIDTH = 794

/** Live, scaled-down render of a template with sample data, clipped to one A4 page. */
export default function TemplateThumbnail({ templateId }: { templateId: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScale(el.clientWidth / SHEET_WIDTH)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 select-none overflow-hidden bg-white" aria-hidden>
      <div style={{ width: SHEET_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <TemplatePreview templateId={templateId} styleConfig={{ ...defaultStyle(), template: templateId }} />
      </div>
    </div>
  )
}
