export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  graduationDate: string
  gpa?: string
}

export interface CustomSection {
  id: string
  title: string
  content: string
  type: "text" | "list"
}

export interface ResumeData {
  personal: {
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    summary: string
    photo?: string
  }
  experience: Experience[]
  education: Education[]
  skills: string[]
  customSections: CustomSection[]
}

export interface ResumeStyle {
  template: string
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: number
  borderRadius: number
  showPhoto: boolean
}

export const TEMPLATES = [
  { id: "modern-minimal", name: "Modern Minimal", ats: false },
  { id: "creative-photo", name: "Creative Photo", ats: false },
  { id: "timeline", name: "Timeline", ats: false },
  { id: "creative-card", name: "Creative Card", ats: false },
  { id: "executive-pro", name: "Executive Pro", ats: true },
  { id: "tech-focused", name: "Tech Focused", ats: true },
  { id: "centered-elegant", name: "Centered Elegant", ats: true },
  { id: "two-column-modern", name: "Two Column Modern", ats: true },
  { id: "modern-sidebar", name: "Modern Sidebar", ats: true },
  { id: "classic-highlight", name: "Classic Highlight", ats: true },
] as const

export const FONTS = ["Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Merriweather", "Source Serif 4"]

export const emptyResume = (): ResumeData => ({
  personal: { firstName: "", lastName: "", email: "", phone: "", location: "", summary: "", photo: "" },
  experience: [],
  education: [],
  skills: [],
  customSections: [],
})

export const defaultStyle = (): ResumeStyle => ({
  template: "modern-minimal",
  colors: {
    primary: "#1f2937",
    secondary: "#8b5cf6",
    accent: "#3b82f6",
    text: "#374151",
    background: "#ffffff",
  },
  fonts: { heading: "Inter", body: "Inter" },
  spacing: 16,
  borderRadius: 8,
  showPhoto: false,
})

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`

const str = (v: unknown) => (typeof v === "string" ? v : "")

/** Coerces anything (old saves, imported JSON, AI output) into a valid ResumeData. */
export function normalizeResume(raw: any): ResumeData {
  const base = emptyResume()
  if (!raw || typeof raw !== "object") return base
  const p = raw.personal || {}
  return {
    personal: {
      firstName: str(p.firstName),
      lastName: str(p.lastName),
      email: str(p.email),
      phone: str(p.phone),
      location: str(p.location),
      summary: str(p.summary),
      photo: str(p.photo),
    },
    experience: Array.isArray(raw.experience)
      ? raw.experience.map((e: any) => ({
          id: str(e?.id) || newId(),
          company: str(e?.company),
          position: str(e?.position),
          startDate: str(e?.startDate),
          endDate: str(e?.endDate),
          current: Boolean(e?.current),
          description: str(e?.description),
        }))
      : [],
    education: Array.isArray(raw.education)
      ? raw.education.map((e: any) => ({
          id: str(e?.id) || newId(),
          school: str(e?.school),
          degree: str(e?.degree),
          field: str(e?.field),
          graduationDate: str(e?.graduationDate),
          gpa: str(e?.gpa),
        }))
      : [],
    skills: Array.isArray(raw.skills)
      ? Array.from(new Set(raw.skills.filter((s: unknown) => typeof s === "string" && s.trim()).map((s: string) => s.trim())))
      : [],
    customSections: Array.isArray(raw.customSections)
      ? raw.customSections
          .filter((s: any) => s && typeof s === "object")
          .map((s: any) => ({
            id: str(s.id) || newId(),
            title: str(s.title),
            content: str(s.content),
            type: s.type === "list" ? "list" : "text",
          }))
      : [],
  }
}

export function normalizeStyle(raw: any): ResumeStyle {
  const base = defaultStyle()
  if (!raw || typeof raw !== "object") return base
  const template = TEMPLATES.some((t) => t.id === raw.template) ? raw.template : base.template
  return {
    template,
    colors: { ...base.colors, ...(raw.colors || {}) },
    fonts: { ...base.fonts, ...(raw.fonts || {}) },
    spacing: typeof raw.spacing === "number" ? raw.spacing : base.spacing,
    borderRadius: typeof raw.borderRadius === "number" ? raw.borderRadius : base.borderRadius,
    showPhoto: Boolean(raw.showPhoto),
  }
}

export function isValidTemplate(id: string | null | undefined): id is string {
  return !!id && TEMPLATES.some((t) => t.id === id)
}

// ---------- Local persistence (no account, no server) ----------

const DATA_KEY = "resume-data"
const STYLE_KEY = "resume-style"

export function loadResume(): ResumeData {
  try {
    return normalizeResume(JSON.parse(localStorage.getItem(DATA_KEY) || "null"))
  } catch {
    return emptyResume()
  }
}

export function loadStyle(): ResumeStyle {
  try {
    return normalizeStyle(JSON.parse(localStorage.getItem(STYLE_KEY) || "null"))
  } catch {
    return defaultStyle()
  }
}

/** Returns false when the browser refuses the write (quota, private mode). */
export function saveResume(data: ResumeData): boolean {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function saveStyle(style: ResumeStyle): boolean {
  try {
    localStorage.setItem(STYLE_KEY, JSON.stringify(style))
    return true
  } catch {
    return false
  }
}

export function hasSavedResume() {
  try {
    const d = loadResume()
    return Boolean(d.personal.firstName || d.personal.lastName || d.experience.length || d.education.length)
  } catch {
    return false
  }
}

/** Plain-text rendering of the resume, used as AI context. */
export function resumeToText(d: ResumeData): string {
  const lines: string[] = []
  const p = d.personal
  lines.push(`Name: ${[p.firstName, p.lastName].filter(Boolean).join(" ")}`)
  if (p.location) lines.push(`Location: ${p.location}`)
  if (p.summary) lines.push(`Summary: ${p.summary}`)
  if (d.experience.length) {
    lines.push("Experience:")
    for (const e of d.experience) {
      lines.push(`- ${e.position} at ${e.company} (${e.startDate || "?"} – ${e.current ? "Present" : e.endDate || "?"})`)
      if (e.description) lines.push(`  ${e.description.replace(/\n/g, "\n  ")}`)
    }
  }
  if (d.education.length) {
    lines.push("Education:")
    for (const e of d.education) lines.push(`- ${e.degree} in ${e.field}, ${e.school} (${e.graduationDate})`)
  }
  if (d.skills.length) lines.push(`Skills: ${d.skills.join(", ")}`)
  for (const s of d.customSections) lines.push(`${s.title}: ${s.content}`)
  return lines.join("\n")
}

/** Downscales an uploaded photo so it fits in localStorage and the PDF request. */
export function resizeImage(file: File, maxSize = 400): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Please choose an image file."))
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Could not process the image."))
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL("image/jpeg", 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read that image."))
    }
    img.src = url
  })
}
