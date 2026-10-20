"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { TemplatePreview } from "@/components/template-preview"
import type { ResumeData, ResumeStyle } from "@/lib/resume"

const SHEET_WIDTH = 794
const PAGE_HEIGHT = 1123

export interface ResumePreviewHandle {
  /** The unscaled .resume-sheet element, for export. */
  getSheet: () => HTMLElement | null
}

/**
 * Renders the resume at true A4 width (794px) and scales it to fit the column,
 * so the preview is pixel-for-pixel what the PDF will contain.
 */
export const ResumePreview = forwardRef<ResumePreviewHandle, { data: ResumeData; style: ResumeStyle }>(
  function ResumePreview({ data, style }, ref) {
    const outerRef = useRef<HTMLDivElement>(null)
    const innerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)
    const [height, setHeight] = useState(PAGE_HEIGHT)

    useImperativeHandle(ref, () => ({
      getSheet: () => innerRef.current?.querySelector<HTMLElement>(".resume-sheet") ?? null,
    }))

    useEffect(() => {
      const outer = outerRef.current
      const inner = innerRef.current
      if (!outer || !inner) return
      const update = () => {
        setScale(Math.min(1, outer.clientWidth / SHEET_WIDTH))
        setHeight(inner.scrollHeight)
      }
      update()
      const ro = new ResizeObserver(update)
      ro.observe(outer)
      ro.observe(inner)
      return () => ro.disconnect()
    }, [])

    const pages = Math.max(1, Math.ceil((height - 2) / PAGE_HEIGHT))

    return (
      <div ref={outerRef} className="w-full">
        <div
          className="relative mx-auto overflow-hidden rounded-sm bg-white shadow-lg ring-1 ring-black/5"
          style={{ width: SHEET_WIDTH * scale, height: height * scale }}
        >
          <div
            ref={innerRef}
            style={{ width: SHEET_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}
          >
            <TemplatePreview templateId={style.template} data={data} styleConfig={style} />
          </div>
          {/* Page-break guides; not part of the exported sheet. */}
          {Array.from({ length: pages - 1 }).map((_, i) => (
            <div
              key={i}
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 border-t-2 border-dashed border-orange-400/70"
              style={{ top: PAGE_HEIGHT * (i + 1) * scale }}
            >
              <span className="absolute right-1 -top-5 rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                Page {i + 2}
              </span>
            </div>
          ))}
        </div>
        {pages > 1 && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {pages} pages. Recruiters prefer one page; tighten spacing or trim older roles.
          </p>
        )}
      </div>
    )
  },
)
