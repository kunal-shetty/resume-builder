"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  Download,
  Eye,
  EyeOff,
  FileJson,
  ImageIcon,
  Layout,
  Loader2,
  Palette,
  Plus,
  Redo,
  RotateCcw,
  Sparkles,
  Trash2,
  Type,
  Undo,
  Upload,
  Wand2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ResumePreview, type ResumePreviewHandle } from "@/components/ResumePreview"
import AIPanel from "@/components/editor/AIPanel"
import { callAI } from "@/lib/ai-client"
import { exportResume, googleFontsHref } from "@/lib/resume-export"
import {
  FONTS,
  TEMPLATES,
  defaultStyle,
  emptyResume,
  isValidTemplate,
  loadResume,
  loadStyle,
  newId,
  normalizeResume,
  normalizeStyle,
  resizeImage,
  resumeToText,
  saveResume,
  saveStyle,
  type ResumeData,
  type ResumeStyle,
} from "@/lib/resume"

interface Snapshot {
  data: ResumeData
  style: ResumeStyle
}

interface History {
  past: Snapshot[]
  present: Snapshot
  future: Snapshot[]
}

const COALESCE_MS = 800
const MAX_HISTORY = 100
const JOB_KEY = "resume-job-description"

const COLOR_PRESETS = [
  { name: "Slate", primary: "#1f2937", secondary: "#8b5cf6", accent: "#3b82f6", text: "#374151" },
  { name: "Navy", primary: "#1e3a8a", secondary: "#2563eb", accent: "#60a5fa", text: "#1f2937" },
  { name: "Emerald", primary: "#064e3b", secondary: "#059669", accent: "#34d399", text: "#1f2937" },
  { name: "Burgundy", primary: "#7f1d1d", secondary: "#b91c1c", accent: "#f87171", text: "#292524" },
  { name: "Orange", primary: "#7c2d12", secondary: "#ea580c", accent: "#fb923c", text: "#292524" },
  { name: "Mono", primary: "#000000", secondary: "#525252", accent: "#a3a3a3", text: "#262626" },
]

export default function EditorClient() {
  const { toast } = useToast()
  const previewRef = useRef<ResumePreviewHandle>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const restoreInputRef = useRef<HTMLInputElement>(null)

  const [history, setHistory] = useState<History>({
    past: [],
    present: { data: emptyResume(), style: defaultStyle() },
    future: [],
  })
  const lastCommit = useRef(0)
  const [hydrated, setHydrated] = useState(false)
  const saveWarned = useRef(false)

  const { data, style } = history.present

  const [activeTab, setActiveTab] = useState("content")
  const [previewOnly, setPreviewOnly] = useState(false)
  const [exporting, setExporting] = useState<"pdf" | "png" | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [aiBusy, setAiBusy] = useState<string | null>(null)
  const [skillInput, setSkillInput] = useState("")
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([])

  // ---------- Load / persist ----------

  useEffect(() => {
    const loaded = { data: loadResume(), style: loadStyle() }
    const fromQuery = new URLSearchParams(window.location.search).get("template")
    if (isValidTemplate(fromQuery)) {
      loaded.style = { ...loaded.style, template: fromQuery }
      // Drop the param so a later reload keeps the user's in-editor choice.
      window.history.replaceState(null, "", "/editor")
    }
    setHistory({ past: [], present: loaded, future: [] })
    try {
      setJobDescription(localStorage.getItem(JOB_KEY) || "")
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const ok = saveResume(data) && saveStyle(style)
    if (!ok && !saveWarned.current) {
      saveWarned.current = true
      toast({
        title: "Couldn't save to this browser",
        description: "Storage is full or blocked. Download a backup from the menu so you don't lose work.",
        variant: "destructive",
      })
    }
  }, [data, style, hydrated, toast])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(JOB_KEY, jobDescription)
    } catch {}
  }, [jobDescription, hydrated])

  // Load the chosen Google Fonts so the preview matches the export.
  useEffect(() => {
    const id = "resume-fonts"
    let link = document.getElementById(id) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement("link")
      link.id = id
      link.rel = "stylesheet"
      document.head.appendChild(link)
    }
    link.href = googleFontsHref([style.fonts.heading, style.fonts.body])
  }, [style.fonts.heading, style.fonts.body])

  // ---------- History ----------

  /** Applies a change. Rapid edits (typing) collapse into one undo step. */
  const commit = useCallback((update: (s: Snapshot) => Snapshot, coalesce = true) => {
    const now = Date.now()
    const merge = coalesce && now - lastCommit.current < COALESCE_MS
    lastCommit.current = coalesce ? now : 0
    setHistory((h) => ({
      past: merge && h.past.length ? h.past : [...h.past, h.present].slice(-MAX_HISTORY),
      present: update(h.present),
      future: [],
    }))
  }, [])

  const setData = useCallback(
    (update: (d: ResumeData) => ResumeData, coalesce = true) => commit((s) => ({ ...s, data: update(s.data) }), coalesce),
    [commit],
  )
  const setStyle = useCallback(
    (update: (st: ResumeStyle) => ResumeStyle, coalesce = true) =>
      commit((s) => ({ ...s, style: update(s.style) }), coalesce),
    [commit],
  )

  const undo = useCallback(() => {
    lastCommit.current = 0
    setHistory((h) =>
      h.past.length
        ? { past: h.past.slice(0, -1), present: h.past[h.past.length - 1], future: [h.present, ...h.future] }
        : h,
    )
  }, [])

  const redo = useCallback(() => {
    lastCommit.current = 0
    setHistory((h) =>
      h.future.length ? { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1) } : h,
    )
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      const key = e.key.toLowerCase()
      if (key === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (key === "y" || (key === "z" && e.shiftKey)) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [undo, redo])

  // ---------- Content helpers ----------

  const updatePersonal = (field: keyof ResumeData["personal"], value: string) =>
    setData((d) => ({ ...d, personal: { ...d.personal, [field]: value } }))

  const updateList = <K extends "experience" | "education" | "customSections">(
    key: K,
    id: string,
    patch: Partial<ResumeData[K][number]>,
  ) =>
    setData((d) => ({
      ...d,
      [key]: (d[key] as any[]).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))

  const removeFromList = (key: "experience" | "education" | "customSections", id: string) =>
    setData((d) => ({ ...d, [key]: (d[key] as any[]).filter((item) => item.id !== id) }), false)

  const moveInList = (key: "experience" | "education" | "customSections", index: number, dir: -1 | 1) =>
    setData((d) => {
      const list = [...(d[key] as any[])]
      const target = index + dir
      if (target < 0 || target >= list.length) return d
      ;[list[index], list[target]] = [list[target], list[index]]
      return { ...d, [key]: list }
    }, false)

  const addExperience = () =>
    setData(
      (d) => ({
        ...d,
        experience: [
          ...d.experience,
          { id: newId(), company: "", position: "", startDate: "", endDate: "", current: false, description: "" },
        ],
      }),
      false,
    )

  const addEducation = () =>
    setData(
      (d) => ({
        ...d,
        education: [...d.education, { id: newId(), school: "", degree: "", field: "", graduationDate: "", gpa: "" }],
      }),
      false,
    )

  const addCustomSection = () =>
    setData(
      (d) => ({
        ...d,
        customSections: [...d.customSections, { id: newId(), title: "Projects", content: "", type: "text" }],
      }),
      false,
    )

  const addSkills = (skills: string[]) =>
    setData((d) => {
      const existing = new Set(d.skills.map((s) => s.toLowerCase()))
      const fresh = skills.map((s) => s.trim()).filter((s) => s && !existing.has(s.toLowerCase()))
      return fresh.length ? { ...d, skills: [...d.skills, ...fresh] } : d
    }, false)

  const removeSkill = (skill: string) => setData((d) => ({ ...d, skills: d.skills.filter((s) => s !== skill) }), false)

  const handlePhoto = async (file?: File) => {
    if (!file) return
    try {
      const photo = await resizeImage(file)
      commit((s) => ({ data: { ...s.data, personal: { ...s.data.personal, photo } }, style: { ...s.style, showPhoto: true } }), false)
    } catch (err) {
      toast({ title: "Photo not added", description: (err as Error).message, variant: "destructive" })
    }
  }

  // ---------- AI ----------

  const runAI = async <T,>(key: string, fn: () => Promise<T>): Promise<T | undefined> => {
    if (aiBusy) return
    setAiBusy(key)
    try {
      return await fn()
    } catch (err) {
      toast({ title: "AI couldn't finish", description: (err as Error).message, variant: "destructive" })
    } finally {
      setAiBusy(null)
    }
  }

  const aiSummary = () =>
    runAI("summary", async () => {
      const { summary } = await callAI<{ summary: string }>("summary", {
        resume: resumeToText(data),
        jobDescription: jobDescription || undefined,
      })
      setData((d) => ({ ...d, personal: { ...d.personal, summary } }), false)
      toast({ title: "Summary written", description: "Review it and press Ctrl+Z to undo." })
    })

  const aiImproveExperience = (id: string) =>
    runAI(`exp-${id}`, async () => {
      const exp = data.experience.find((e) => e.id === id)
      if (!exp) return
      if (!exp.position.trim()) throw new Error("Add the position title first.")
      const { description } = await callAI<{ description: string }>("improveExperience", {
        ...exp,
        jobDescription: jobDescription || undefined,
      })
      setData((d) => ({ ...d, experience: d.experience.map((e) => (e.id === id ? { ...e, description } : e)) }), false)
    })

  const aiSuggestSkills = () =>
    runAI("skills", async () => {
      const { skills } = await callAI<{ skills: string[] }>("suggestSkills", {
        resume: resumeToText(data),
        jobDescription: jobDescription || undefined,
      })
      const have = new Set(data.skills.map((s) => s.toLowerCase()))
      setSuggestedSkills(skills.filter((s) => !have.has(s.toLowerCase())))
    })

  // ---------- Export / backup ----------

  const fileBase =
    [data.personal.firstName, data.personal.lastName].filter(Boolean).join("_").replace(/[^\w-]+/g, "") || "resume"

  const handleExport = async (format: "pdf" | "png") => {
    if (exporting) return
    const sheet = previewRef.current?.getSheet()
    if (!sheet) return
    setExporting(format)
    try {
      const result = await exportResume(sheet, format, {
        fonts: [style.fonts.heading, style.fonts.body],
        filename: `${fileBase}_Resume`,
      })
      if (result === "print-dialog") {
        toast({
          title: "Save as PDF",
          description: 'In the print dialog choose "Save as PDF", paper A4, margins None, and turn on Background graphics.',
        })
      }
    } catch (err) {
      toast({ title: "Export failed", description: (err as Error).message, variant: "destructive" })
    } finally {
      setExporting(null)
    }
  }

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify({ version: 1, data, style }, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileBase}_resume_backup.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const restoreBackup = async (file?: File) => {
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      commit(() => ({ data: normalizeResume(parsed.data ?? parsed), style: normalizeStyle(parsed.style) }), false)
      toast({ title: "Backup restored" })
    } catch {
      toast({ title: "Not a valid backup file", variant: "destructive" })
    }
  }

  const startOver = () => {
    if (!window.confirm("Clear the whole resume? You can still undo this until you leave the page.")) return
    commit((s) => ({ data: emptyResume(), style: s.style }), false)
  }

  const applyImported = (imported: ResumeData) =>
    commit((s) => ({ ...s, data: { ...imported, personal: { ...imported.personal, photo: s.data.personal.photo } } }), false)

  // ---------- UI ----------

  const aiButton = (key: string, label: string, onClick: () => void, disabled = false) => (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={onClick}
      disabled={!!aiBusy || disabled}
      className="h-8 gap-1.5 border-violet-300 text-violet-700 hover:bg-violet-50 hover:text-violet-800"
    >
      {aiBusy === key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
      {label}
    </Button>
  )

  const listControls = (key: "experience" | "education" | "customSections", index: number, length: number, id: string) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-8 w-8" disabled={index === 0} onClick={() => moveInList(key, index, -1)} aria-label="Move up">
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" disabled={index === length - 1} onClick={() => moveInList(key, index, 1)} aria-label="Move down">
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeFromList(key, id)} aria-label="Remove">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Button asChild variant="ghost" size="icon" aria-label="Back to templates">
              <Link href="/templates">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold">Resume Editor</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {hydrated ? "Saved in this browser" : "Loading…"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={undo} disabled={!history.past.length} title="Undo (Ctrl+Z)">
              <Undo className="h-4 w-4" />
              <span className="ml-1 hidden md:inline">Undo</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={redo} disabled={!history.future.length} title="Redo (Ctrl+Shift+Z)">
              <Redo className="h-4 w-4" />
              <span className="ml-1 hidden md:inline">Redo</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setPreviewOnly((v) => !v)}>
              {previewOnly ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="ml-1 hidden md:inline">{previewOnly ? "Edit" : "Preview"}</span>
            </Button>

            <div className="flex">
              <Button size="sm" onClick={() => handleExport("pdf")} disabled={!!exporting} className="rounded-r-none">
                {exporting === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                <span className="ml-1.5">PDF</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="rounded-l-none border-l border-primary-foreground/20 px-2" aria-label="More export options">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleExport("png")} disabled={!!exporting}>
                    <ImageIcon className="mr-2 h-4 w-4" /> Download PNG
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={downloadBackup}>
                    <FileJson className="mr-2 h-4 w-4" /> Download backup (.json)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => restoreInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Restore backup
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={startOver} className="text-destructive focus:text-destructive">
                    <RotateCcw className="mr-2 h-4 w-4" /> Start over
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <input
              ref={restoreInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                restoreBackup(e.target.files?.[0])
                e.target.value = ""
              }}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4">
        <div className={cn("grid gap-6", previewOnly ? "grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]")}>
          {!previewOnly && (
            <div className="min-w-0 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content" className="gap-1.5">
                    <Type className="h-4 w-4" /> <span className="hidden sm:inline">Content</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="gap-1.5">
                    <Wand2 className="h-4 w-4" /> <span className="hidden sm:inline">AI</span>
                  </TabsTrigger>
                  <TabsTrigger value="design" className="gap-1.5">
                    <Palette className="h-4 w-4" /> <span className="hidden sm:inline">Design</span>
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="gap-1.5">
                    <Layout className="h-4 w-4" /> <span className="hidden sm:inline">Layout</span>
                  </TabsTrigger>
                </TabsList>

                {/* ================= CONTENT ================= */}
                <TabsContent value="content" className="space-y-6">
                  <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-border">
                        {data.personal.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={data.personal.photo} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => photoInputRef.current?.click()}>
                          <Upload className="mr-1.5 h-4 w-4" /> {data.personal.photo ? "Change photo" : "Add photo"}
                        </Button>
                        {data.personal.photo && (
                          <Button size="sm" variant="ghost" onClick={() => updatePersonal("photo", "")}>
                            <X className="mr-1 h-4 w-4" /> Remove
                          </Button>
                        )}
                      </div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handlePhoto(e.target.files?.[0])
                          e.target.value = ""
                        }}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {(
                        [
                          ["firstName", "First Name", "text"],
                          ["lastName", "Last Name", "text"],
                          ["email", "Email", "email"],
                          ["phone", "Phone", "tel"],
                        ] as const
                      ).map(([field, label, type]) => (
                        <div key={field} className="space-y-2">
                          <Label htmlFor={field}>{label}</Label>
                          <Input id={field} type={type} value={data.personal[field]} onChange={(e) => updatePersonal(field, e.target.value)} />
                        </div>
                      ))}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={data.personal.location} placeholder="City, Country" onChange={(e) => updatePersonal("location", e.target.value)} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="summary">Professional Summary</Label>
                          {aiButton("summary", data.personal.summary ? "AI rewrite" : "AI write", aiSummary)}
                        </div>
                        <Textarea id="summary" value={data.personal.summary} onChange={(e) => updatePersonal("summary", e.target.value)} rows={6} placeholder="2–4 sentences about who you are and the value you bring." />
                      </div>
                    </div>
                  </Card>

                  {/* Experience */}
                  <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Work Experience</h3>
                      <Button onClick={addExperience} size="sm">
                        <Plus className="mr-1.5 h-4 w-4" /> Add
                      </Button>
                    </div>
                    {data.experience.length === 0 && (
                      <p className="py-6 text-center text-sm text-muted-foreground">No experience yet. Add your most recent role first.</p>
                    )}
                    <div className="space-y-4">
                      {data.experience.map((exp, index) => (
                        <Card key={exp.id} className="gap-0 bg-muted/30 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="truncate font-medium">{exp.position || exp.company || `Experience #${index + 1}`}</span>
                            {listControls("experience", index, data.experience.length, exp.id)}
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Company</Label>
                              <Input value={exp.company} onChange={(e) => updateList("experience", exp.id, { company: e.target.value })} placeholder="Company name" />
                            </div>
                            <div className="space-y-2">
                              <Label>Position</Label>
                              <Input value={exp.position} onChange={(e) => updateList("experience", exp.id, { position: e.target.value })} placeholder="Job title" />
                            </div>
                            <div className="space-y-2">
                              <Label>Start Date</Label>
                              <Input type="month" value={exp.startDate} onChange={(e) => updateList("experience", exp.id, { startDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>End Date</Label>
                              <Input type="month" value={exp.current ? "" : exp.endDate} disabled={exp.current} onChange={(e) => updateList("experience", exp.id, { endDate: e.target.value })} />
                              <div className="flex items-center gap-2">
                                <Switch id={`current-${exp.id}`} checked={exp.current} onCheckedChange={(current) => updateList("experience", exp.id, { current })} />
                                <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">I currently work here</Label>
                              </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <div className="flex items-center justify-between">
                                <Label>Description</Label>
                                {aiButton(`exp-${exp.id}`, exp.description ? "AI improve" : "AI write", () => aiImproveExperience(exp.id))}
                              </div>
                              <Textarea
                                value={exp.description}
                                onChange={(e) => updateList("experience", exp.id, { description: e.target.value })}
                                placeholder={"• Achievement with impact\n• Another responsibility"}
                                rows={4}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>

                  {/* Education */}
                  <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Education</h3>
                      <Button onClick={addEducation} size="sm">
                        <Plus className="mr-1.5 h-4 w-4" /> Add
                      </Button>
                    </div>
                    {data.education.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No education added yet.</p>}
                    <div className="space-y-4">
                      {data.education.map((edu, index) => (
                        <Card key={edu.id} className="gap-0 bg-muted/30 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="truncate font-medium">{edu.school || `Education #${index + 1}`}</span>
                            {listControls("education", index, data.education.length, edu.id)}
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>School / University</Label>
                              <Input value={edu.school} onChange={(e) => updateList("education", edu.id, { school: e.target.value })} placeholder="Institution name" />
                            </div>
                            <div className="space-y-2">
                              <Label>Degree</Label>
                              <Input value={edu.degree} onChange={(e) => updateList("education", edu.id, { degree: e.target.value })} placeholder="Bachelor of Science" />
                            </div>
                            <div className="space-y-2">
                              <Label>Field of Study</Label>
                              <Input value={edu.field} onChange={(e) => updateList("education", edu.id, { field: e.target.value })} placeholder="Computer Science" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label>Graduation</Label>
                                <Input type="month" value={edu.graduationDate} onChange={(e) => updateList("education", edu.id, { graduationDate: e.target.value })} />
                              </div>
                              <div className="space-y-2">
                                <Label>GPA (optional)</Label>
                                <Input value={edu.gpa || ""} onChange={(e) => updateList("education", edu.id, { gpa: e.target.value })} placeholder="3.8/4.0" />
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>

                  {/* Skills */}
                  <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Skills</h3>
                      {aiButton("skills", "Suggest skills", aiSuggestSkills)}
                    </div>
                    <form
                      className="mb-4 flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault()
                        addSkills(skillInput.split(","))
                        setSkillInput("")
                      }}
                    >
                      <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add skills (comma separated) and press Enter" />
                      <Button type="submit" aria-label="Add skill">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="gap-1 py-1 pl-2.5 pr-1 text-sm">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="rounded-full p-0.5 hover:bg-destructive hover:text-white" aria-label={`Remove ${skill}`}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {data.skills.length === 0 && <p className="text-sm text-muted-foreground">No skills yet.</p>}
                    </div>
                    {suggestedSkills.length > 0 && (
                      <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50/60 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-medium text-violet-800">Suggested. Click to add only the ones you really have.</p>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { addSkills(suggestedSkills); setSuggestedSkills([]) }}>
                              Add all
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setSuggestedSkills([])} aria-label="Dismiss suggestions">
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {suggestedSkills.map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                addSkills([s])
                                setSuggestedSkills((list) => list.filter((x) => x !== s))
                              }}
                              className="inline-flex items-center gap-1 rounded-full border border-violet-300 bg-white px-2.5 py-1 text-xs text-violet-800 hover:bg-violet-100"
                            >
                              <Plus className="h-3 w-3" /> {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Custom sections */}
                  <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Additional Sections</h3>
                        <p className="text-xs text-muted-foreground">Projects, certifications, awards, languages…</p>
                      </div>
                      <Button onClick={addCustomSection} size="sm">
                        <Plus className="mr-1.5 h-4 w-4" /> Add
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {data.customSections.map((section, index) => (
                        <Card key={section.id} className="gap-0 bg-muted/30 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="truncate font-medium">{section.title || `Section #${index + 1}`}</span>
                            {listControls("customSections", index, data.customSections.length, section.id)}
                          </div>
                          <div className="space-y-3">
                            <Input value={section.title} onChange={(e) => updateList("customSections", section.id, { title: e.target.value })} placeholder="Section title" />
                            <Textarea value={section.content} onChange={(e) => updateList("customSections", section.id, { content: e.target.value })} placeholder={"• AWS Certified Solutions Architect (2024)"} rows={3} />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                {/* ================= AI ================= */}
                <TabsContent value="ai">
                  <AIPanel
                    data={data}
                    jobDescription={jobDescription}
                    onJobDescriptionChange={setJobDescription}
                    onAddSkills={addSkills}
                    onImport={applyImported}
                    onTailorSummary={aiSummary}
                    tailorBusy={aiBusy === "summary"}
                  />
                </TabsContent>

                {/* ================= DESIGN ================= */}
                <TabsContent value="design" className="space-y-6">
                  <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                    <h3 className="mb-1 text-lg font-semibold">Template</h3>
                    <p className="mb-4 text-xs text-muted-foreground">ATS templates use simple structure that applicant tracking systems parse reliably.</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {TEMPLATES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setStyle((s) => ({ ...s, template: t.id }), false)}
                          className={cn(
                            "relative rounded-lg border p-3 text-left text-sm transition-colors hover:border-primary/60",
                            style.template === t.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-background",
                          )}
                        >
                          <span className="block font-medium">{t.name}</span>
                          {t.ats && <span className="mt-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">ATS</span>}
                          {style.template === t.id && <Check className="absolute right-2 top-2 h-4 w-4 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </Card>

                  <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-semibold">Colors</h3>
                    <div className="mb-5 flex flex-wrap gap-2">
                      {COLOR_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => setStyle((s) => ({ ...s, colors: { ...s.colors, primary: p.primary, secondary: p.secondary, accent: p.accent, text: p.text } }), false)}
                          className="flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs hover:border-primary/60"
                        >
                          <span className="flex">
                            {[p.primary, p.secondary, p.accent].map((c) => (
                              <span key={c} className="-ml-1 h-3.5 w-3.5 rounded-full ring-2 ring-background first:ml-0" style={{ background: c }} />
                            ))}
                          </span>
                          {p.name}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {(["primary", "secondary", "accent", "text"] as const).map((key) => (
                        <div key={key} className="space-y-2">
                          <Label className="capitalize">{key} color</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={/^#[0-9a-f]{6}$/i.test(style.colors[key]) ? style.colors[key] : "#000000"}
                              onChange={(e) => setStyle((s) => ({ ...s, colors: { ...s.colors, [key]: e.target.value } }))}
                              className="h-10 w-10 shrink-0 cursor-pointer rounded border border-border"
                            />
                            <Input value={style.colors[key]} onChange={(e) => setStyle((s) => ({ ...s, colors: { ...s.colors, [key]: e.target.value } }))} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-semibold">Typography</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {(["heading", "body"] as const).map((key) => (
                        <div key={key} className="space-y-2">
                          <Label className="capitalize">{key} font</Label>
                          <Select value={style.fonts[key]} onValueChange={(value) => setStyle((s) => ({ ...s, fonts: { ...s.fonts, [key]: value } }), false)}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FONTS.map((f) => (
                                <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                                  {f}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                {/* ================= LAYOUT ================= */}
                <TabsContent value="layout" className="space-y-6">
                  <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-semibold">Layout Options</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="show-photo">Show photo</Label>
                          <p className="text-xs text-muted-foreground">Many US/UK employers prefer resumes without photos.</p>
                        </div>
                        <Switch id="show-photo" checked={style.showPhoto} onCheckedChange={(showPhoto) => setStyle((s) => ({ ...s, showPhoto }), false)} />
                      </div>
                      <div className="space-y-3">
                        <Label>Spacing: {style.spacing}px</Label>
                        <Slider value={[style.spacing]} onValueChange={([v]) => setStyle((s) => ({ ...s, spacing: v }))} max={32} min={8} step={2} />
                      </div>
                      <div className="space-y-3">
                        <Label>Corner radius: {style.borderRadius}px</Label>
                        <Slider value={[style.borderRadius]} onValueChange={([v]) => setStyle((s) => ({ ...s, borderRadius: v }))} max={16} min={0} step={2} />
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Preview */}
          <div className={cn("min-w-0", previewOnly ? "mx-auto w-full max-w-[860px]" : "lg:sticky lg:top-20 lg:h-fit")}>
            <Card className="gap-0 border-border/50 bg-card/60 p-4 backdrop-blur-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <Badge variant="secondary">A4 · {TEMPLATES.find((t) => t.id === style.template)?.name}</Badge>
              </div>
              <div className={cn(!previewOnly && "lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-1")}>
                <ResumePreview ref={previewRef} data={data} style={style} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
