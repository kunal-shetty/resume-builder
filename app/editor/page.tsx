"use client"

import { useState, useEffect } from "react"
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
  ArrowLeft,
  Download,
  Eye,
  EyeOff,
  Palette,
  Type,
  Layout,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Share,
  Undo,
  Redo,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TemplatePreview } from "@/components/template-preview"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import GeneralToast from "@/components/Toast"
import ExportPayButton from "@/components/PayButton"

interface ResumeData {
  personal: {
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    summary: string
    photo?: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    school: string
    degree: string
    field: string
    graduationDate: string
    gpa?: string
  }>
  skills: string[]
  customSections: Array<{
    id: string
    title: string
    content: string
    type: "text" | "list"
  }>
}

interface ResumeStyle {
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

export default function EditorPage() {
  const [showToast, setShowToast] = useState(false)
  const [toastPayload, setToastPayload] = useState<{
    variant: "success" | "error" | "warning" | "info"
    title: string
    description: string
  } | null>(null)

  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    customSections: [],
  })

  // Load on first render
  useEffect(() => {
    const saved = localStorage.getItem("resume-data")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)

        setResumeData({
          personal: {
            firstName: parsed.personal?.firstName || "",
            lastName: parsed.personal?.lastName || "",
            email: parsed.personal?.email || "",
            phone: parsed.personal?.phone || "",
            location: parsed.personal?.location || "",
            summary: parsed.personal?.summary || "",
            photo: parsed.personal?.photo || "",
          },
          experience: parsed.experience || [],
          education: parsed.education || [],
          skills: parsed.skills || [],
          customSections: parsed.customSections || [],
        })
      } catch (e) {
        console.error("Error loading saved data:", e)
      }
    }
  }, [])


  // SAVE anytime resumeData updates (customSections or anything else)
  useEffect(() => {
    localStorage.setItem("resume-data", JSON.stringify(resumeData))
  }, [resumeData])

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
});
  
const [isBlurred, setIsBlurred] = useState(true);
const [plan, setPlan] = useState("");

useEffect(() => {
  const unlocked = localStorage.getItem("resume_unlocked");

  if (!unlocked) return; // nothing unlocked → skip

  // Set the plan based on stored value
  switch (unlocked) {
    case "basic":
    case "advanced":
    case "premium":
      setPlan(unlocked);
      break;
    default:
      setPlan(""); // fallback
  }

  setIsBlurred(false);
  setShowModal(false);
}, []);


const [showModal, setShowModal] = useState(false);

  const [resumeStyle, setResumeStyle] = useState<ResumeStyle>({
    template: "modern-minimal",
    colors: {
      primary: "#1f2937",
      secondary: "#8b5cf6",
      accent: "#3b82f6",
      text: "#374151",
      background: "#ffffff",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    spacing: 16,
    borderRadius: 8,
    showPhoto: false,
  })

  const [activeTab, setActiveTab] = useState("content")
  const [previewMode, setPreviewMode] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Save to history for undo/redo
  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ data: resumeData, style: resumeStyle })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setResumeData(prevState.data)
      setResumeStyle(prevState.style)
      setHistoryIndex(historyIndex - 1)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setResumeData(nextState.data)
      setResumeStyle(nextState.style)
      setHistoryIndex(historyIndex + 1)
    }
  }

  const triggerToast = (
    variant: "success" | "error" | "warning" | "info",
    title: string,
    description: string
  ) => {
    setShowToast(false)
    setToastPayload({ variant, title, description })

    setTimeout(() => {
      setShowToast(true)
    }, 10)
  }

  const updatePersonal = (field: string, value: string) => {
    saveToHistory()
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }))
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    saveToHistory()
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }))
  }

  const updateExperience = (id: string, field: string, value: any) => {
    saveToHistory()
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const removeExperience = (id: string) => {
    saveToHistory()
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      graduationDate: "",
    }
    saveToHistory()
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }))
  }

  const updateEducation = (id: string, field: string, value: string) => {
    saveToHistory()
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const removeEducation = (id: string) => {
    saveToHistory()
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const addSkill = (skill: string) => {
    saveToHistory()
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }))
    }
  }

  const removeSkill = (skill: string) => {
    saveToHistory()
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const addCustomSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: "Custom Section",
      content: "",
      type: "text" as const,
    }
    saveToHistory()
    setResumeData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, newSection],
    }))
  }

  const updateCustomSection = (id: string, field: string, value: any) => {
    saveToHistory()
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section,
      ),
    }))
  }

  const removeCustomSection = (id: string) => {
    saveToHistory()
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((section) => section.id !== id),
    }))
  }

    const updateStyle = (
  category: keyof ResumeStyle,
  field: string | null,
  value: any
) => {
  saveToHistory();

  setResumeStyle((prev) => {
    const current = prev[category];

    // Nested object update
    if (field && typeof current === "object" && current !== null) {
      return {
        ...prev,
        [category]: {
          ...current,
          [field]: value,
        },
      };
    }

    // Primitive value update
    return {
      ...prev,
      [category]: value,
    };
  });
};


  const exportResume = async (format: "pdf" | "png") => {
  const element = document.getElementById("export-area");
  if (!element) return;

  // Clone HTML into SVG wrapper
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${element.offsetWidth}" height="${element.offsetHeight}">
      <foreignObject width="100%" height="100%">
        ${new XMLSerializer().serializeToString(element)}
      </foreignObject>
    </svg>
  `;

  // Convert SVG → Blob
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });

  // Convert Blob → URL
  const blobURL = URL.createObjectURL(blob);

  // Create an image from the blob URL
  const img = new Image();
  img.src = blobURL;

  img.onload = () => {
    // Draw image onto canvas
    const canvas = document.createElement("canvas");
    canvas.width = img.width * 2;
    canvas.height = img.height * 2;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);
    ctx.drawImage(img, 0, 0);

    const pngData = canvas.toDataURL("image/png");

    // PNG EXPORT
    if (format === "png") {
      const link = document.createElement("a");
      link.href = pngData;
      link.download = "resume.png";
      link.click();
    }

    // PDF EXPORT (using browser-native print-to-pdf style)
    if (format === "pdf") {
      const pdfBlob = canvasToPDF(canvas);
      const pdfURL = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = pdfURL;
      link.download = "resume.pdf";
      link.click();
    }

    URL.revokeObjectURL(blobURL);
  };
};

const canvasToPDF = (canvas: HTMLCanvasElement) => {
  const pdfCanvas = document.createElement("canvas");
  pdfCanvas.width = canvas.width;
  pdfCanvas.height = canvas.height;

  const pdfCtx = pdfCanvas.getContext("2d")!;
  pdfCtx.drawImage(canvas, 0, 0);

  const pdfData = pdfCanvas.toDataURL("image/png");

  return new Blob([pdfData], { type: "application/pdf" });
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 py-3">
    <div className="flex items-center justify-between">

      {/* LEFT SIDE — Title */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-xl font-bold">Resume Editor</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Customize your resume
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — Actions */}
      <div className="flex items-center space-x-2">
        
        {/* UNDO */}
        <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0}>
          <Undo className="w-4 h-4" />
          <span className="hidden md:inline ml-1">Undo</span>
        </Button>

        {/* REDO */}
        <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
          <Redo className="w-4 h-4" />
          <span className="hidden md:inline ml-1">Redo</span>
        </Button>

        {/* PREVIEW TOGGLE */}
        <Button variant="ghost" size="sm" onClick={() => setPreviewMode(!previewMode)}>
          {previewMode ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          <span className="hidden md:inline ml-1">
            {previewMode ? "Edit" : "Preview"}
          </span>
        </Button>

        {/* SAVE */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            saveToHistory();
            triggerToast("success", "Progress Saved", "Your resume has been updated successfully.");
          }}
        >
          <Save className="w-4 h-4" />
          <span className="hidden md:inline ml-2">Save</span>
        </Button>

      </div>
    </div>
  </div>
</div>

      <div className="max-w-7xl mx-auto p-4">
        <div className={cn("grid gap-6 transition-all duration-300", previewMode ? "grid-cols-1" : "lg:grid-cols-2")}>
          {/* Editor Panel */}
          {!previewMode && (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="design" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Layout
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  {/* Personal Information */}
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={resumeData.personal.firstName}
                          onChange={(e) => updatePersonal("firstName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={resumeData.personal.lastName}
                          onChange={(e) => updatePersonal("lastName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={resumeData.personal.email}
                          onChange={(e) => updatePersonal("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={resumeData.personal.phone}
                          onChange={(e) => updatePersonal("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={resumeData.personal.location}
                          onChange={(e) => updatePersonal("location", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                          id="summary"
                          value={resumeData.personal.summary}
                          onChange={(e) => updatePersonal("summary", e.target.value)}
                          rows={7}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Experience */}
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Work Experience</h3>
                      <Button onClick={addExperience} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {resumeData.experience.map((exp, index) => (
                        <Card key={exp.id} className="p-4 bg-muted/30">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                              <span className="font-medium">Experience #{index + 1}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Company</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                placeholder="Company name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Position</Label>
                              <Input
                                value={exp.position}
                                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                                placeholder="Job title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Start Date</Label>
                              <Input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>End Date</Label>
                              <Input
                                type="month"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                disabled={exp.current}
                              />
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={exp.current}
                                  onCheckedChange={(checked) => updateExperience(exp.id, "current", checked)}
                                />
                                <Label className="text-sm">Currently working here</Label>
                              </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Description</Label>
                              <Textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                placeholder="Describe your responsibilities and achievements..."
                                rows={2}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>

                  {/* Education */}
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Education</h3>
                      <Button onClick={addEducation} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {resumeData.education.map((edu, index) => (
                        <Card key={edu.id} className="p-4 bg-muted/30">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                              <span className="font-medium">Education #{index + 1}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(edu.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>School/University</Label>
                              <Input
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                                placeholder="Institution name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Degree</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                placeholder="Bachelor of Science"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Field of Study</Label>
                              <Input
                                value={edu.field}
                                onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                                placeholder="Computer Science"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Graduation Date</Label>
                              <Input
                                type="month"
                                value={edu.graduationDate}
                                onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>

                  {/* Skills */}
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
                    <h3 className="text-lg font-semibold mb-4">Skills</h3>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill and press Enter"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addSkill(e.currentTarget.value)
                              e.currentTarget.value = ""
                            }
                          }}
                        />
                        <Button
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                            addSkill(input.value)
                            input.value = ""
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            onClick={() => removeSkill(skill)}
                          >
                            {skill}
                            <Trash2 className="w-3 h-3 ml-2" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Custom Sections */}
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Custom Sections</h3>
                      <Button onClick={addCustomSection} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Section
                      </Button>
                    </div>

                    {/* Empty State */}
                    {resumeData.customSections.length === 0 && (
                      <div className="text-center py-16 text-gray-500">
                        <Plus className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No custom sections added yet</p>
                        <p className="text-xs">Click “Add Section” to create one</p>
                      </div>
                    )}

                    {/* Sections List */}
                    <div className="space-y-4">
                      {resumeData.customSections.map((section, index) => (
                        <Card key={section.id} className="p-4 bg-muted/30">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                              <span className="font-medium">Section #{index + 1}</span>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCustomSection(section.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label>Section Title</Label>
                              <Input
                                value={section.title}
                                onChange={(e) => updateCustomSection(section.id, "title", e.target.value)}
                                placeholder="Section title"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Content</Label>
                              <Textarea
                                value={section.content}
                                onChange={(e) => updateCustomSection(section.id, "content", e.target.value)}
                                placeholder="Section content..."
                                rows={3}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>

                </TabsContent>

                <TabsContent value="design" className="space-y-6">
                  {/* Template Selection */}
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
                    <h3 className="text-lg font-semibold mb-0">Template</h3>
                    <Select value={resumeStyle.template} onValueChange={(value) => updateStyle("template", "", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern-minimal">Modern Minimal</SelectItem>
                        <SelectItem value="creative-photo">Creative Photo</SelectItem>
                        <SelectItem value="executive-pro">Executive Pro</SelectItem>
                        <SelectItem value="tech-focused">Tech Focused</SelectItem>
                      </SelectContent>
                    </Select>
                  </Card>

                  {/* Colors */}
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
                    <h3 className="text-lg font-semibold mb-0">Colors</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={resumeStyle.colors.primary}
                            onChange={(e) => updateStyle("colors", "primary", e.target.value)}
                            className="w-10 h-10 rounded border border-border"
                          />
                          <Input
                            value={resumeStyle.colors.primary}
                            onChange={(e) => updateStyle("colors", "primary", e.target.value)}
                            placeholder="#1f2937"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary Color</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={resumeStyle.colors.secondary}
                            onChange={(e) => updateStyle("colors", "secondary", e.target.value)}
                            className="w-10 h-10 rounded border border-border"
                          />
                          <Input
                            value={resumeStyle.colors.secondary}
                            onChange={(e) => updateStyle("colors", "secondary", e.target.value)}
                            placeholder="#8b5cf6"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Accent Color</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={resumeStyle.colors.accent}
                            onChange={(e) => updateStyle("colors", "accent", e.target.value)}
                            className="w-10 h-10 rounded border border-border"
                          />
                          <Input
                            value={resumeStyle.colors.accent}
                            onChange={(e) => updateStyle("colors", "accent", e.target.value)}
                            placeholder="#3b82f6"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={resumeStyle.colors.text}
                            onChange={(e) => updateStyle("colors", "text", e.target.value)}
                            className="w-10 h-10 rounded border border-border"
                          />
                          <Input
                            value={resumeStyle.colors.text}
                            onChange={(e) => updateStyle("colors", "text", e.target.value)}
                            placeholder="#374151"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Typography */}
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
                    <h3 className="text-lg font-semibold mb-0">Typography</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Heading Font</Label>
                        <Select
                          value={resumeStyle.fonts.heading}
                          onValueChange={(value) => updateStyle("fonts", "heading", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Lato">Lato</SelectItem>
                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Body Font</Label>
                        <Select
                          value={resumeStyle.fonts.body}
                          onValueChange={(value) => updateStyle("fonts", "body", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Lato">Lato</SelectItem>
                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="layout" className="space-y-6">
                  {/* Layout Options */}
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
                    <h3 className="text-lg font-semibold mb-4">Layout Options</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label>Show Photo</Label>
                        <Switch
                          checked={resumeStyle.showPhoto}
                          onCheckedChange={(checked) => updateStyle("showPhoto", "", checked)}
                        />
                      </div>
                     
                      <div className="space-y-2">
                        <Label>Spacing: {resumeStyle.spacing}px</Label>
                        <Slider
                          value={[resumeStyle.spacing]}
                          onValueChange={(value) => updateStyle("spacing", "", value[0])}
                          max={32}
                          min={8}
                          step={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Border Radius: {resumeStyle.borderRadius}px</Label>
                        <Slider
                          value={[resumeStyle.borderRadius]}
                          onValueChange={(value) => updateStyle("borderRadius", "", value[0])}
                          max={16}
                          min={0}
                          step={2}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Export Options */}
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
                    <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={() => exportResume("pdf")} className="flex-col h-auto py-4">
                        <Download className="w-6 h-6 mb-2" />
                        PDF
                      </Button>
                      <Button onClick={() => exportResume("png")} variant="outline" className="flex-col h-auto py-4">
                        <Download className="w-6 h-6 mb-2" />
                        PNG
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Preview Panel */}
          <div className={cn("sticky top-24 h-fit", previewMode && "mx-auto max-w-4xl")}>
            <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                </div>
              </div>
              <div
    id="export-area"
    style={{
      position: "relative",
      background: "white",
      padding: 0,
      margin: 0,
      userSelect: "none",
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      overflow: "hidden",
    }}
  >
    {/* BLUR OVERLAY */}
    {/* BLUR OVERLAY */}
{isBlurred && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      background: "rgba(255, 255, 255, 0.45)",
      pointerEvents: "none",
      zIndex: 99999,
    }}
  ></div>
)}

{/* PREVIEW BUTTON */}
{isBlurred && (
  <button
    onClick={() => setShowModal(true)}
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "14px 28px",
      fontSize: "16px",
      fontWeight: "600",
      background: "#111827",
      color: "white",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      zIndex: 100000,
      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    }}
  >
    Preview Resume
  </button>
)}
{/* BLUR OVERLAY */}
{isBlurred && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      background: "rgba(255, 255, 255, 0.45)",
      pointerEvents: "none",
      zIndex: 99999,
    }}
  ></div>
)}

{/* PREVIEW BUTTON */}
{isBlurred && (
  <button
    onClick={() => setShowModal(true)}
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "14px 28px",
      fontSize: "16px",
      fontWeight: "600",
      background: "#111827",
      color: "white",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      zIndex: 100000,
      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    }}
  >
    Preview Resume
  </button>
)}



    <TemplatePreview templateId={resumeStyle.template} data={resumeData} styleConfig={resumeStyle} />
  </div>

            </Card>
          </div>
        </div>
      </div>
      {showToast && toastPayload && (
        <GeneralToast
          variant={toastPayload.variant}
          title={toastPayload.title}
          description={toastPayload.description}
        />
      )}
      {!showModal && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[200000] px-3 py-4 overflow-y-auto">

    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-4 sm:p-10 relative">

      {/* Title */}
      <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-1 sm:mb-3">
        Unlock Full Resume Access
      </h2>

      <p className="text-sm sm:text-lg text-gray-600 text-center mb-5 sm:mb-10">
        Choose a plan to preview in HD & export without limits.
      </p>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">

        {/* OPTION 1 */}
        <div className="border rounded-2xl p-4 sm:p-7 bg-gray-50 hover:shadow-xl transition cursor-pointer">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">₹49</h3>
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4">
            One-Time Unlock
          </p>

          <ul className="text-[13px] sm:text-[15px] text-gray-700 space-y-1.5 mb-4 sm:mb-6">
            <li>✔ Full HD Preview</li>
            <li>✔ Export PDF & PNG</li>
            <li>✔ Remove Watermark</li>
          </ul>

          <button
            onClick={() => window.location.href = `/checkout?plan=basic`}
            className="w-full py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition text-sm sm:text-base"
          >
            Choose ₹49
          </button>
        </div>

        {/* OPTION 2 | MOST POPULAR */}
        <div className="relative border-2 border-blue-600 rounded-2xl p-4 sm:p-7 bg-blue-50 hover:shadow-xl transition cursor-pointer">

          {/* Ribbon */}
          <span className="absolute -top-3 sm:-top-5 left-1/2 -translate-x-1/2 rotate-[5deg] bg-blue-600 text-white px-3 sm:px-6 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-md">
            MOST POPULAR
          </span>

          {/* Star icon */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 sm:w-6 sm:h-6 fill-yellow-300 drop-shadow-md"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0..." />
            </svg>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-blue-700 text-center">₹99</h3>
          <p className="text-xs sm:text-sm text-blue-600 text-center mb-3 sm:mb-4">Unlimited Exports</p>

          <ul className="text-[13px] sm:text-[15px] text-gray-700 space-y-1.5 mb-4 sm:mb-6">
            <li>✔ Unlimited Downloads</li>
            <li>✔ HD Preview Forever</li>
            <li>✔ Access All Templates</li>
          </ul>

          <button
            onClick={() => window.location.href = `/checkout?plan=advanced`}
            className="w-full py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Choose ₹99
          </button>
        </div>

        {/* OPTION 3 */}
        <div className="border rounded-2xl p-4 sm:p-7 bg-gray-50 hover:shadow-xl transition cursor-pointer">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">₹129</h3>
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4">
            Premium Pack
          </p>

          <ul className="text-[13px] sm:text-[15px] text-gray-700 space-y-1.5 mb-4 sm:mb-6">
            <li>✔ Unlimited Everything</li>
            <li>✔ All Future Templates</li>
            <li>✔ Priority Support</li>
          </ul>

          <button
            onClick={() => window.location.href = `/checkout?plan=premium`}
            className="w-full py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition text-sm sm:text-base"
          >
            Choose ₹129
          </button>
        </div>

      </div>

      {/* BIG CLOSE BUTTON */}
      <div className="flex justify-center mt-6 sm:mt-10">
  <button
    onClick={() => setShowModal(false)}
    className="
      w-full sm:w-auto        // ✅ FULL WIDTH ON MOBILE, AUTO ON DESKTOP
      px-8 sm:px-10 
      py-4 sm:py-3 
      rounded-xl 
      bg-gray-200 text-gray-800 font-semibold 
      hover:bg-gray-300 
      transition 
      text-base sm:text-lg 
      shadow-md 
      active:scale-95
    "
  >
    Close
  </button>
</div>

    </div>
  </div>
)}


    </div>
    
  )
}
