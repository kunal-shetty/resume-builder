"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Download, Globe, Plus, Trash2, Edit3, Save, ExternalLink, Copy, Upload, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import PortfolioPreview from "./components/PortfolioPreview"
import ProjectEditor from "./components/ProjectEditor"
import ThemeCustomizer from "./components/ThemeCustomizer"
import SoundEffects from "./components/SoundEffects"

interface PortfolioData {
  name: string
  title: string
  bio: string
  email: string
  github: string
  linkedin: string
  profilePicture: string
  projects: Project[]
  skills: Skill[]
  theme: Theme
  animations: boolean
  soundEffects: boolean
}

interface Project {
  id: string
  title: string
  description: string
  image: string
  liveUrl: string
  githubUrl: string
  technologies: string[]
}

interface Skill {
  id: string
  name: string
  level: number
  category: string
}

interface Theme {
  name: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  font: string
  layout: string
}

const defaultThemes: Theme[] = [
  {
    name: "Neon Cyber",
    primaryColor: "#8B5CF6",
    secondaryColor: "#EC4899",
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
    font: "Inter",
    layout: "grid",
  },
  {
    name: "Minimal Clean",
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    font: "Inter",
    layout: "minimal",
  },
  {
    name: "Brutalist",
    primaryColor: "#EF4444",
    secondaryColor: "#F59E0B",
    backgroundColor: "#FEF3C7",
    textColor: "#1F2937",
    font: "Space Mono",
    layout: "brutalist",
  },
]

export default function BuilderPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    name: "",
    title: "",
    bio: "",
    email: "",
    github: "",
    linkedin: "",
    profilePicture: "",
    projects: [],
    skills: [],
    theme: defaultThemes[0],
    animations: true,
    soundEffects: true,
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState("")
  const [customUrl, setCustomUrl] = useState("")
  const [showDeployDialog, setShowDeployDialog] = useState(false)
  const [generatedPortfolioUrl, setGeneratedPortfolioUrl] = useState("")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("portfolio-data")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setPortfolioData(parsed)
      } catch (error) {
        console.error("Failed to load saved data:", error)
      }
    }
  }, [])

  const updatePortfolioData = (field: keyof PortfolioData, value: any) => {
    setPortfolioData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      }
      // Auto-save to localStorage
      localStorage.setItem("portfolio-data", JSON.stringify(updated))
      return updated
    })
  }

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        updatePortfolioData("profilePicture", result)
        toast({
          title: "Profile Picture Updated",
          description: "Your profile picture has been uploaded successfully.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfilePicture = () => {
    updatePortfolioData("profilePicture", "")
    toast({
      title: "Profile Picture Removed",
      description: "Your profile picture has been removed.",
    })
  }

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "New Project",
      description: "Project description",
      image: "/placeholder.svg?height=300&width=400",
      liveUrl: "",
      githubUrl: "",
      technologies: [],
    }

    const updatedProjects = [...portfolioData.projects, newProject]
    updatePortfolioData("projects", updatedProjects)

    toast({
      title: "Project Added",
      description: "New project has been added to your portfolio.",
    })
  }

  const updateProject = (projectId: string, updatedProject: Partial<Project>) => {
    const updatedProjects = portfolioData.projects.map((project) =>
      project.id === projectId ? { ...project, ...updatedProject } : project,
    )
    updatePortfolioData("projects", updatedProjects)
  }

  const deleteProject = (projectId: string) => {
    const updatedProjects = portfolioData.projects.filter((project) => project.id !== projectId)
    updatePortfolioData("projects", updatedProjects)

    toast({
      title: "Project Deleted",
      description: "Project has been removed from your portfolio.",
      variant: "destructive",
    })
  }

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "New Skill",
      level: 50,
      category: "Frontend",
    }

    const updatedSkills = [...portfolioData.skills, newSkill]
    updatePortfolioData("skills", updatedSkills)

    toast({
      title: "Skill Added",
      description: "New skill has been added to your portfolio.",
    })
  }

  const updateSkill = (skillId: string, updatedSkill: Partial<Skill>) => {
    const updatedSkills = portfolioData.skills.map((skill) =>
      skill.id === skillId ? { ...skill, ...updatedSkill } : skill,
    )
    updatePortfolioData("skills", updatedSkills)
  }

  const deleteSkill = (skillId: string) => {
    const updatedSkills = portfolioData.skills.filter((skill) => skill.id !== skillId)
    updatePortfolioData("skills", updatedSkills)

    toast({
      title: "Skill Deleted",
      description: "Skill has been removed from your portfolio.",
      variant: "destructive",
    })
  }

  const savePortfolio = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage
      localStorage.setItem("portfolio-data", JSON.stringify(portfolioData))
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Portfolio Saved",
        description: "Your portfolio has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save your portfolio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const generatePortfolioFiles = (data: PortfolioData) => {
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name || "Portfolio"} - ${data.title || "Developer"}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=${data.theme.font.replace(" ", "+")}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
    body { 
        font-family: '${data.theme.font}', sans-serif; 
        background-color: ${data.theme.backgroundColor};
        color: ${data.theme.textColor};
    }
    .gradient-bg { 
        background: linear-gradient(135deg, ${data.theme.primaryColor}20, ${data.theme.secondaryColor}20); 
    }
    .subtle-glow { 
        text-shadow: 0 0 10px ${data.theme.primaryColor}40; 
    }
    .project-card {
        transition: all 0.3s ease;
        background: ${data.theme.primaryColor}10;
        border: 1px solid ${data.theme.primaryColor}20;
    }
    .project-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        border-color: ${data.theme.primaryColor}40;
    }
    .skill-bar {
        background: ${data.theme.primaryColor};
        transition: width 2s ease-in-out;
    }
    .btn-primary {
        background: ${data.theme.primaryColor} !important;
        color: ${data.theme.backgroundColor} !important;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        display: inline-block;
        transition: all 0.3s ease;
        border: 2px solid ${data.theme.primaryColor};
        font-weight: 600;
        opacity: 1 !important;
        visibility: visible !important;
    }
    .btn-primary:hover {
        opacity: 0.9 !important;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px ${data.theme.primaryColor}40;
    }
    .btn-outline {
        border: 2px solid ${data.theme.primaryColor} !important;
        color: ${data.theme.primaryColor} !important;
        background: transparent !important;
        padding: 10px 22px;
        border-radius: 8px;
        text-decoration: none;
        display: inline-block;
        transition: all 0.3s ease;
        font-weight: 600;
        opacity: 1 !important;
        visibility: visible !important;
    }
    .btn-outline:hover {
        background: ${data.theme.primaryColor} !important;
        color: ${data.theme.backgroundColor} !important;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px ${data.theme.primaryColor}40;
    }
    .tech-tag {
        background: ${data.theme.primaryColor};
        color: ${data.theme.backgroundColor};
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        display: inline-block;
        margin: 4px 2px;
        font-weight: 500;
        opacity: 1;
        visibility: visible;
    }
    .avatar {
        width: 120px;
        height: 120px;
        background: linear-gradient(45deg, ${data.theme.primaryColor}, ${data.theme.secondaryColor});
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        font-weight: bold;
        color: white;
        margin: 0 auto 24px;
        overflow: hidden;
        border: 3px solid ${data.theme.primaryColor}40;
    }
    .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .section {
        padding: 80px 0;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }
    .grid {
        display: grid;
        gap: 24px;
    }
    .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
    .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    .flex {
        display: flex;
    }
    .flex-wrap {
        flex-wrap: wrap;
    }
    .justify-center {
        justify-content: center;
    }
    .gap-4 {
        gap: 16px;
    }
    .gap-2 {
        gap: 8px;
    }
    .text-center {
        text-align: center;
    }
    .mb-4 { margin-bottom: 16px; }
    .mb-6 { margin-bottom: 24px; }
    .mb-8 { margin-bottom: 32px; }
    .mb-12 { margin-bottom: 48px; }
    .flex-1 { flex: 1; }
    .rounded-lg { border-radius: 8px; }
    .overflow-hidden { overflow: hidden; }
    .shadow-lg { 
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
    }
    .opacity-80 { opacity: 0.8; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .text-lg { font-size: 18px; line-height: 28px; }
    .text-xl { font-size: 20px; line-height: 28px; }
    .text-2xl { font-size: 24px; line-height: 32px; }
    .text-3xl { font-size: 30px; line-height: 36px; }
    .text-4xl { font-size: 36px; line-height: 40px; }
    .text-6xl { font-size: 60px; line-height: 1; }
    .max-w-2xl { max-width: 672px; }
    .max-w-3xl { max-width: 768px; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    
    @media (max-width: 768px) {
        .grid-cols-2, .grid-cols-3 { grid-template-columns: 1fr; }
        .section { padding: 40px 0; }
        .text-6xl { font-size: 36px; }
        .text-4xl { font-size: 28px; }
        .text-3xl { font-size: 24px; }
        .flex-wrap { flex-direction: column; align-items: center; }
        .btn-primary, .btn-outline { 
            width: 100%; 
            max-width: 200px; 
            text-align: center; 
            margin: 4px 0;
        }
    }
</style>
</head>
<body>
    <div class="min-h-screen">
        <!-- Hero Section -->
        <section class="gradient-bg section text-center">
            <div class="container">
                <div class="avatar">
                    ${
                      data.profilePicture
                        ? `<img src="${data.profilePicture}" alt="${data.name || "Profile"}" />`
                        : data.name
                          ? data.name.charAt(0).toUpperCase()
                          : "?"
                    }
                </div>
                <h1 class="text-4xl md:text-6xl font-bold mb-4 ${data.animations ? "subtle-glow" : ""}">${data.name || "Your Name"}</h1>
                <h2 class="text-xl md:text-2xl mb-6" style="color: ${data.theme.primaryColor}">${data.title || "Your Title"}</h2>
                <p class="text-lg max-w-2xl mx-auto mb-8 opacity-80">${data.bio || "Your bio will appear here..."}</p>
                <div class="flex flex-wrap justify-center gap-4">
                    ${data.email ? `<a href="mailto:${data.email}" class="btn-primary">Contact Me</a>` : ""}
                    ${data.github ? `<a href="${data.github}" target="_blank" class="btn-outline">GitHub</a>` : ""}
                    ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="btn-outline">LinkedIn</a>` : ""}
                </div>
            </div>
        </section>

        <!-- Projects Section -->
        ${
          data.projects.length > 0
            ? `
        <section class="section">
            <div class="container">
                <h2 class="text-3xl font-bold mb-12 text-center" style="color: ${data.theme.primaryColor}">Projects</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    ${data.projects
                      .map(
                        (project) => `
                    <div class="project-card rounded-lg overflow-hidden shadow-lg">
                        <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 200px; object-fit: cover;">
                        <div style="padding: 24px;">
                            <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                            <p class="opacity-80 mb-4">${project.description}</p>
                            <div class="mb-4">
                                ${project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
                            </div>
                            <div class="flex gap-2">
                                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn-primary flex-1 text-center">Live Demo</a>` : ""}
                                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="btn-outline flex-1 text-center">Code</a>` : ""}
                            </div>
                        </div>
                    </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </section>
        `
            : ""
        }

        <!-- Skills Section -->
        ${
          data.skills.length > 0
            ? `
        <section class="section" style="background-color: ${data.theme.primaryColor}05;">
            <div class="container">
                <h2 class="text-3xl font-bold mb-12 text-center" style="color: ${data.theme.primaryColor}">Skills</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    ${data.skills
                      .map(
                        (skill) => `
                    <div class="text-center mb-6">
                        <h3 class="text-lg font-semibold mb-2">${skill.name}</h3>
                        <div style="width: 100%; background: #e5e7eb; border-radius: 10px; height: 8px; margin-bottom: 8px;">
                            <div class="skill-bar" style="width: ${skill.level}%; height: 8px; border-radius: 10px;"></div>
                        </div>
                        <span class="text-sm opacity-70">${skill.level}%</span>
                    </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </section>
        `
            : ""
        }

        <!-- Contact Section -->
        <section class="section text-center">
            <div class="container">
                <h2 class="text-3xl font-bold mb-8" style="color: ${data.theme.primaryColor}">Get In Touch</h2>
                <p class="text-lg mb-8 opacity-80">Let's work together on your next project!</p>
                ${data.email ? `<a href="mailto:${data.email}" class="btn-primary text-lg">Contact Me</a>` : ""}
            </div>
        </section>
    </div>

    <script>
        // Animate skill bars on load
        window.addEventListener('load', function() {
            const skillBars = document.querySelectorAll('.skill-bar');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
            });
        });
    </script>
</body>
</html>`

    return {
      "index.html": indexHtml,
      "package.json": `{
  "name": "${data.name?.toLowerCase().replace(/\s+/g, "-") || "portfolio"}",
  "version": "1.0.0",
  "description": "Portfolio website for ${data.name || "Developer"}",
  "main": "index.html"
}`,
      "README.md": `# ${data.name || "Portfolio"} Website\n\nBuilt with Portfolio Builder`,
    }
  }

  const exportPortfolio = async () => {
    setIsExporting(true)
    try {
      // Generate portfolio files
      const files = generatePortfolioFiles(portfolioData)

      // Create zip file using JSZip
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      // Add files to zip
      Object.entries(files).forEach(([filename, content]) => {
        zip.file(filename, content)
      })

      // Generate zip blob
      const zipBlob = await zip.generateAsync({ type: "blob" })

      // Download zip file
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${portfolioData.name?.toLowerCase().replace(/\s+/g, "-") || "portfolio"}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Your portfolio has been exported as a ZIP file.",
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export your portfolio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const generateAndViewPortfolio = async () => {
    setIsDeploying(true)
    try {
      // Generate portfolio files
      const files = generatePortfolioFiles(portfolioData)

      // Create a blob URL for the generated HTML
      const htmlBlob = new Blob([files["index.html"]], { type: "text/html" })
      const htmlUrl = URL.createObjectURL(htmlBlob)

      // Store the URL for later use
      setGeneratedPortfolioUrl(htmlUrl)

      // Create a display URL for the user
      const timestamp = Date.now()
      const slug = customUrl || portfolioData.name?.toLowerCase().replace(/\s+/g, "-") || "portfolio"
      const displayUrl = `https://${slug}-${timestamp}.vercel.app`
      setDeploymentUrl(displayUrl)

      // Simulate deployment process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Portfolio Generated!",
        description: "Your portfolio is ready to view. Opening in new tab...",
      })

      // Auto-open the portfolio in a new tab
      setTimeout(() => {
        const newWindow = window.open(htmlUrl, "_blank")
        if (!newWindow) {
          toast({
            title: "Popup Blocked",
            description: "Please allow popups and try again, or click 'View Portfolio' button.",
            variant: "destructive",
          })
        }
      }, 500)
    } catch (error) {
      console.error("Generation failed:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate your portfolio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const viewGeneratedPortfolio = () => {
    if (generatedPortfolioUrl) {
      const newWindow = window.open(generatedPortfolioUrl, "_blank")
      if (!newWindow) {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups to view your portfolio.",
          variant: "destructive",
        })
      }
    } else {
      // Generate on the fly if not available
      const files = generatePortfolioFiles(portfolioData)
      const htmlBlob = new Blob([files["index.html"]], { type: "text/html" })
      const htmlUrl = URL.createObjectURL(htmlBlob)
      const newWindow = window.open(htmlUrl, "_blank")
      if (!newWindow) {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups to view your portfolio.",
          variant: "destructive",
        })
      }
    }
  }

  const copyDeploymentUrl = async () => {
    if (deploymentUrl) {
      try {
        await navigator.clipboard.writeText(deploymentUrl)
        toast({
          title: "URL Copied",
          description: "Portfolio URL has been copied to clipboard.",
        })
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy URL to clipboard.",
          variant: "destructive",
        })
      }
    }
  }

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode)
    toast({
      title: isPreviewMode ? "Edit Mode" : "Preview Mode",
      description: isPreviewMode ? "You can now edit your portfolio." : "Viewing your portfolio preview.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {typeof window !== "undefined" && <SoundEffects enabled={portfolioData.soundEffects} />}

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Portfolio Builder</h1>

            {/* Mobile-First Button Layout */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Always visible core buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={togglePreviewMode}
                className="text-white border-white/40 hover:bg-white/10 bg-white/5 opacity-100 font-medium text-xs sm:text-sm px-2 sm:px-3"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                <span className="hidden sm:inline">{isPreviewMode ? "Edit" : "Preview"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={savePortfolio}
                disabled={isSaving}
                className="text-white border-white/40 hover:bg-white/10 bg-white/5 opacity-100 font-medium text-xs sm:text-sm px-2 sm:px-3"
              >
                {isSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                )}
                <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
              </Button>

              {/* Mobile dropdown for additional actions */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="text-white border-white/40 hover:bg-white/10 bg-white/5 opacity-100 font-medium text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Menu className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden lg:inline ml-1">More</span>
                </Button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showMobileMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-2 space-y-1">
                        <Button
                          size="sm"
                          onClick={() => {
                            exportPortfolio()
                            setShowMobileMenu(false)
                          }}
                          disabled={isExporting}
                          className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white opacity-100 font-medium text-xs"
                        >
                          {isExporting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-3 h-3 mr-2 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <Download className="w-3 h-3 mr-2" />
                          )}
                          {isExporting ? "Exporting..." : "Export ZIP"}
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => {
                            generateAndViewPortfolio()
                            setShowMobileMenu(false)
                          }}
                          disabled={isDeploying}
                          className="w-full justify-start bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white opacity-100 font-medium text-xs"
                        >
                          {isDeploying ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-3 h-3 mr-2 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <Globe className="w-3 h-3 mr-2" />
                          )}
                          {isDeploying ? "Generating..." : "View Live Site"}
                        </Button>

                        {generatedPortfolioUrl && (
                          <Button
                            size="sm"
                            onClick={() => {
                              viewGeneratedPortfolio()
                              setShowMobileMenu(false)
                            }}
                            variant="outline"
                            className="w-full justify-start text-white border-white/40 hover:bg-white/10 bg-white/5 opacity-100 font-medium text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-2" />
                            Open Site
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Deploy Success Modal */}
      {deploymentUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setDeploymentUrl("")}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-700 text-white p-6 rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-green-400">🎉 Portfolio Generated!</h3>

            <div className="space-y-4">
              <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">Your portfolio is ready to view:</p>
                <p className="text-green-400 font-mono text-sm break-all">{deploymentUrl}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={viewGeneratedPortfolio} className="flex-1 bg-green-600 hover:bg-green-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Portfolio
                </Button>
                <Button
                  onClick={copyDeploymentUrl}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-xs text-gray-400">
                <p>💡 To deploy for real:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Click "Export ZIP" to download files</li>
                  <li>Upload to Netlify, Vercel, or GitHub Pages</li>
                  <li>Your portfolio will be live on the internet!</li>
                </ul>
              </div>

              <Button
                onClick={() => setDeploymentUrl("")}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {isPreviewMode ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <PortfolioPreview data={portfolioData} />
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Editor Panel */}
              <div className="lg:col-span-2">
                <Card className="bg-black/20 backdrop-blur-md border-white/10 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Edit3 className="w-5 h-5" />
                      Portfolio Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-5 bg-white/5 text-xs h-auto">
                        <TabsTrigger value="basic" className="text-xs py-2 px-1 data-[state=active]:bg-white/20">
                          <span className="hidden sm:inline">Basic Info</span>
                          <span className="sm:hidden">Basic</span>
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="text-xs py-2 px-1 data-[state=active]:bg-white/20">
                          Projects
                        </TabsTrigger>
                        <TabsTrigger value="skills" className="text-xs py-2 px-1 data-[state=active]:bg-white/20">
                          Skills
                        </TabsTrigger>
                        <TabsTrigger value="theme" className="text-xs py-2 px-1 data-[state=active]:bg-white/20">
                          Theme
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="text-xs py-2 px-1 data-[state=active]:bg-white/20">
                          <span className="hidden sm:inline">Settings</span>
                          <span className="sm:hidden">Set</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-6 mt-6">
                        {/* Profile Picture Section */}
                        <div className="space-y-4">
                          <Label className="text-white">Profile Picture</Label>
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative">
                              <div
                                className="w-20 h-20 rounded-full bg-gradient-to-r flex items-center justify-center text-white text-2xl font-bold overflow-hidden"
                                style={{
                                  background: portfolioData.profilePicture
                                    ? "transparent"
                                    : `linear-gradient(45deg, ${portfolioData.theme.primaryColor}, ${portfolioData.theme.secondaryColor})`,
                                }}
                              >
                                {portfolioData.profilePicture ? (
                                  <img
                                    src={portfolioData.profilePicture || "/placeholder.svg"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                  />
                                ) : portfolioData.name ? (
                                  portfolioData.name.charAt(0).toUpperCase()
                                ) : (
                                  <User className="w-8 h-8" />
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              <Button
                                onClick={() => fileInputRef.current?.click()}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-xs md:text-sm"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Photo
                              </Button>
                              {portfolioData.profilePicture && (
                                <Button
                                  onClick={removeProfilePicture}
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-xs md:text-sm"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureUpload}
                            className="hidden"
                          />
                          <p className="text-xs text-gray-400">
                            Upload a profile picture (max 5MB). Supports JPG, PNG, GIF formats.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={portfolioData.name}
                              onChange={(e) => updatePortfolioData("name", e.target.value)}
                              placeholder="John Doe"
                              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="title">Professional Title</Label>
                            <Input
                              id="title"
                              value={portfolioData.title}
                              onChange={(e) => updatePortfolioData("title", e.target.value)}
                              placeholder="Full Stack Developer"
                              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={portfolioData.bio}
                            onChange={(e) => updatePortfolioData("bio", e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={portfolioData.email}
                              onChange={(e) => updatePortfolioData("email", e.target.value)}
                              placeholder="john@example.com"
                              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="github">GitHub</Label>
                            <Input
                              id="github"
                              value={portfolioData.github}
                              onChange={(e) => updatePortfolioData("github", e.target.value)}
                              placeholder="https://github.com/johndoe"
                              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              value={portfolioData.linkedin}
                              onChange={(e) => updatePortfolioData("linkedin", e.target.value)}
                              placeholder="https://linkedin.com/in/johndoe"
                              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="projects" className="space-y-6 mt-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <h3 className="text-lg font-semibold">Projects</h3>
                          <Button
                            onClick={addProject}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Project
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {portfolioData.projects.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                              <p className="mb-4">No projects added yet.</p>
                              <Button onClick={addProject} className="bg-purple-600 hover:bg-purple-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Project
                              </Button>
                            </div>
                          ) : (
                            portfolioData.projects.map((project) => (
                              <ProjectEditor
                                key={project.id}
                                project={project}
                                onUpdate={(updatedProject) => updateProject(project.id, updatedProject)}
                                onDelete={() => deleteProject(project.id)}
                              />
                            ))
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="skills" className="space-y-6 mt-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <h3 className="text-lg font-semibold">Skills</h3>
                          <Button
                            onClick={addSkill}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Skill
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {portfolioData.skills.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                              <p className="mb-4">No skills added yet.</p>
                              <Button onClick={addSkill} className="bg-purple-600 hover:bg-purple-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Skill
                              </Button>
                            </div>
                          ) : (
                            portfolioData.skills.map((skill) => (
                              <Card key={skill.id} className="bg-white/5 border-white/20">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <Input
                                      value={skill.name}
                                      onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                                      className="bg-transparent border-none text-white p-0 font-semibold"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteSkill(skill.id)}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    <Select
                                      value={skill.category}
                                      onValueChange={(value) => updateSkill(skill.id, { category: value })}
                                    >
                                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Frontend">Frontend</SelectItem>
                                        <SelectItem value="Backend">Backend</SelectItem>
                                        <SelectItem value="Database">Database</SelectItem>
                                        <SelectItem value="DevOps">DevOps</SelectItem>
                                        <SelectItem value="Design">Design</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={skill.level}
                                        onChange={(e) =>
                                          updateSkill(skill.id, { level: Number.parseInt(e.target.value) })
                                        }
                                        className="flex-1 accent-purple-500"
                                      />
                                      <span className="text-sm text-gray-400 w-12">{skill.level}%</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="theme" className="mt-6">
                        <ThemeCustomizer
                          theme={portfolioData.theme}
                          themes={defaultThemes}
                          onThemeChange={(theme) => updatePortfolioData("theme", theme)}
                        />
                      </TabsContent>

                      <TabsContent value="settings" className="space-y-6 mt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="animations">Enable Animations</Label>
                              <p className="text-sm text-gray-400">Toggle animations and effects</p>
                            </div>
                            <Switch
                              id="animations"
                              checked={portfolioData.animations}
                              onCheckedChange={(checked) => updatePortfolioData("animations", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="sound">Sound Effects</Label>
                              <p className="text-sm text-gray-400">Enable interaction sound effects</p>
                            </div>
                            <Switch
                              id="sound"
                              checked={portfolioData.soundEffects}
                              onCheckedChange={(checked) => updatePortfolioData("soundEffects", checked)}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Live Preview Panel - Hidden on mobile when in edit mode */}
              <div className="hidden lg:block lg:col-span-1">
                <Card className="bg-black/20 backdrop-blur-md border-white/10 text-white sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[9/16] bg-black/30 rounded-lg overflow-hidden">
                      <PortfolioPreview data={portfolioData} isCompact />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
