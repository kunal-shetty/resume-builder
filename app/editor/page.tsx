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
import { ThemeToggle } from "@/components/theme-toggle"

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
  layout: "single" | "two-column"
}

export default function EditorPage() {

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
      setResumeData(JSON.parse(saved))
    }
  }, [])

  // SAVE anytime resumeData updates (customSections or anything else)
  useEffect(() => {
    localStorage.setItem("resume-data", JSON.stringify(resumeData))
  }, [resumeData])



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
    layout: "single",
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

  const updatePersonal = (field: string, value: string) => {
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
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }))
  }

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const removeExperience = (id: string) => {
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
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }))
  }

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }))
    }
  }

  const removeSkill = (skill: string) => {
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
    setResumeData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, newSection],
    }))
  }

  const updateCustomSection = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section,
      ),
    }))
  }

  const removeCustomSection = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((section) => section.id !== id),
    }))
  }

  const updateStyle = (category: string, field: string, value: any) => {
    setResumeStyle((prev) => ({
      ...prev,
      [category]:
        typeof prev[category as keyof ResumeStyle] === "object"
          ? { ...prev[category as keyof ResumeStyle], [field]: value }
          : value,
    }))
  }

  const exportResume = (format: "pdf" | "png" | "svg") => {
    // Export functionality would be implemented here
    console.log(`Exporting resume as ${format}`)
    // For demo purposes, we'll just show an alert
    alert(`Resume exported as ${format.toUpperCase()}!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Resume Editor</h1>
                <p className="text-sm text-muted-foreground">Customize your resume</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                <Redo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setPreviewMode(!previewMode)}>
                {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {previewMode ? "Edit" : "Preview"}
              </Button>
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" className="animate-pulse-glow">
                <Download className="w-4 h-4 mr-2" />
                Export
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
                          rows={3}
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
                    <h3 className="text-lg font-semibold mb-4">Template</h3>
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
                    <h3 className="text-lg font-semibold mb-4">Colors</h3>
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
                    <h3 className="text-lg font-semibold mb-4">Typography</h3>
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Show Photo</Label>
                        <Switch
                          checked={resumeStyle.showPhoto}
                          onCheckedChange={(checked) => updateStyle("showPhoto", "", checked)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Layout Style</Label>
                        <Select value={resumeStyle.layout} onValueChange={(value) => updateStyle("layout", "", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single Column</SelectItem>
                            <SelectItem value="two-column">Two Column</SelectItem>
                          </SelectContent>
                        </Select>
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
                    <div className="grid grid-cols-3 gap-3">
                      <Button onClick={() => exportResume("pdf")} className="flex-col h-auto py-4">
                        <Download className="w-6 h-6 mb-2" />
                        PDF
                      </Button>
                      <Button onClick={() => exportResume("png")} variant="outline" className="flex-col h-auto py-4">
                        <Download className="w-6 h-6 mb-2" />
                        PNG
                      </Button>
                      <Button onClick={() => exportResume("svg")} variant="outline" className="flex-col h-auto py-4">
                        <Download className="w-6 h-6 mb-2" />
                        SVG
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
              <div className="border border-border/50 rounded-lg overflow-hidden bg-white">
                <div className="transform scale-75 origin-top-left w-[133.33%] h-fit">
                  <TemplatePreview templateId={resumeStyle.template} data={resumeData} className="w-full" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
