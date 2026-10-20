"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { CheckCircle2, FileInput, Loader2, MessageSquare, Plus, Send, Sparkles, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { callAI } from "@/lib/ai-client"
import { normalizeResume, resumeToText, type ResumeData } from "@/lib/resume"

interface ATSResult {
  score: number
  verdict: string
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface AIPanelProps {
  data: ResumeData
  jobDescription: string
  onJobDescriptionChange: (value: string) => void
  onAddSkills: (skills: string[]) => void
  onImport: (data: ResumeData) => void
  onTailorSummary: () => void
  tailorBusy: boolean
}

function ScoreRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  const color = clamped >= 75 ? "#059669" : clamped >= 50 ? "#d97706" : "#dc2626"
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" className="shrink-0" role="img" aria-label={`Match score ${clamped} out of 100`}>
      <circle cx="42" cy="42" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="8" />
      <circle
        cx="42"
        cy="42"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - clamped / 100)}
        transform="rotate(-90 42 42)"
      />
      <text x="42" y="47" textAnchor="middle" fontSize="20" fontWeight="700" fill={color}>
        {clamped}
      </text>
    </svg>
  )
}

export default function AIPanel({
  data,
  jobDescription,
  onJobDescriptionChange,
  onAddSkills,
  onImport,
  onTailorSummary,
  tailorBusy,
}: AIPanelProps) {
  const { toast } = useToast()
  const [busy, setBusy] = useState<"ats" | "import" | "chat" | null>(null)
  const [ats, setAts] = useState<ATSResult | null>(null)
  const [importText, setImportText] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! Ask me anything about your resume: what to cut, how to phrase an achievement, or how to tailor it to a job." },
  ])
  const [chatInput, setChatInput] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [messages, busy])

  const fail = (err: unknown) =>
    toast({ title: "AI couldn't finish", description: (err as Error).message, variant: "destructive" })

  const runAts = async () => {
    if (!jobDescription.trim()) return toast({ title: "Paste a job description first" })
    setBusy("ats")
    try {
      setAts(await callAI<ATSResult>("atsReview", { resume: resumeToText(data), jobDescription }))
    } catch (err) {
      fail(err)
    } finally {
      setBusy(null)
    }
  }

  const runImport = async () => {
    const hasContent = data.personal.firstName || data.experience.length || data.education.length
    if (hasContent && !window.confirm("Replace your current resume content with the imported one? You can undo afterwards.")) return
    setBusy("import")
    try {
      const parsed = await callAI("parseResume", { text: importText })
      onImport(normalizeResume(parsed))
      setImportText("")
      toast({ title: "Resume imported", description: "Check each section on the Content tab." })
    } catch (err) {
      fail(err)
    } finally {
      setBusy(null)
    }
  }

  const sendChat = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const text = chatInput.trim()
    if (!text || busy === "chat") return
    const next: ChatMessage[] = [...messages, { role: "user", content: text }]
    setMessages(next)
    setChatInput("")
    setBusy("chat")
    try {
      const { reply } = await callAI<{ reply: string }>("chat", {
        // The greeting is UI-only; the model doesn't need it.
        messages: next.slice(1),
        resume: resumeToText(data),
      })
      setMessages((m) => [...m, { role: "assistant", content: reply }])
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: (err as Error).message }])
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Job match */}
      <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
        <div className="mb-1 flex items-center gap-2">
          <Target className="h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-semibold">Job match &amp; ATS check</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Paste a job posting. AI scores your resume against it and lists missing keywords. The posting is also used to tailor
          “AI write” and “AI improve”.
        </p>
        <Textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description here…"
          rows={6}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={runAts} disabled={!!busy || !jobDescription.trim()}>
            {busy === "ats" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analyze match
          </Button>
          <Button variant="outline" onClick={onTailorSummary} disabled={tailorBusy || !jobDescription.trim()}>
            {tailorBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Tailor my summary
          </Button>
        </div>

        {ats && (
          <div className="mt-6 space-y-4 rounded-lg border bg-background p-4">
            <div className="flex items-center gap-4">
              <ScoreRing score={ats.score} />
              <div>
                <p className="text-sm font-semibold">Match score</p>
                <p className="text-sm text-muted-foreground">{ats.verdict}</p>
              </div>
            </div>
            {ats.missingKeywords.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Missing keywords <span className="font-normal text-muted-foreground">(add only what's true for you)</span></p>
                <div className="flex flex-wrap gap-2">
                  {ats.missingKeywords.map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        onAddSkills([k])
                        setAts((a) => a && { ...a, missingKeywords: a.missingKeywords.filter((x) => x !== k), matchedKeywords: [...a.matchedKeywords, k] })
                      }}
                      title="Add to skills"
                      className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs text-red-800 hover:bg-red-100"
                    >
                      <Plus className="h-3 w-3" /> {k}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {ats.matchedKeywords.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Already covered</p>
                <div className="flex flex-wrap gap-2">
                  {ats.matchedKeywords.map((k) => (
                    <span key={k} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800">
                      <CheckCircle2 className="h-3 w-3" /> {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {ats.suggestions.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">How to improve</p>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {ats.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Import */}
      <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
        <div className="mb-1 flex items-center gap-2">
          <FileInput className="h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-semibold">Import an existing resume</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Paste the text of an old resume or your LinkedIn profile and AI fills in every section.
        </p>
        <Textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Paste resume text…" rows={6} />
        <Button className="mt-3" onClick={runImport} disabled={!!busy || importText.trim().length < 40}>
          {busy === "import" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Import with AI
        </Button>
      </Card>

      {/* Chat */}
      <Card className="gap-0 border-border/50 bg-card/60 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-semibold">Career assistant</h3>
        </div>
        <div className="mb-3 h-72 space-y-3 overflow-y-auto rounded-lg border bg-background p-3">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm",
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {busy === "chat" && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-3.5 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={sendChat} className="flex gap-2">
          <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="e.g. How can I make my latest role sound stronger?" maxLength={2000} />
          <Button type="submit" disabled={busy === "chat" || !chatInput.trim()} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  )
}
