"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Eye, Palette, User, Camera, FileText, Star, Zap, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  category: string[]
  hasPhoto: boolean
  isPremium: boolean
  rating: number
  downloads: string
  preview: string
  description: string
  colors: string[]
}

const templates: Template[] = [
  // ===== FREE / BASIC =====
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    category: ["Professional", "Modern", "Traditional"],
    hasPhoto: false,
    isPremium: false,
    rating: 3.9,
    downloads: "18.2K",
    preview: "/resumes/modern-minimal.png",
    description: "Clean and modern resume for all professionals",
    colors: ["#1f2937", "#3b82f6", "#ffffff"],
  },
  {
    id: "creative-photo",
    name: "Creative Photo",
    category: ["Creative", "Modern"],
    hasPhoto: false,
    isPremium: false,
    rating: 4.7,
    downloads: "12.4K",
    preview: "/resumes/creative-photo.png",
    description: "Creative layout with visual emphasis",
    colors: ["#8b5cf6", "#ec4899", "#ffffff"],
  },
  {
    id: "timeline",
    name: "Timeline Resume",
    category: ["Modern", "Professional"],
    hasPhoto: false,
    isPremium: false,
    rating: 4.6,
    downloads: "9.1K",
    preview: "/resumes/timeline.png",
    description: "Timeline-based layout highlighting experience growth",
    colors: ["#1f2937", "#10b981", "#ffffff"],
  },
  {
    id: "creative-card",
    name: "Creative Card",
    category: ["Creative", "Modern"],
    hasPhoto: false,
    isPremium: false,
    rating: 4.5,
    downloads: "7.8K",
    preview: "/resumes/creative-card.png",
    description: "Card-style sections for a bold creative look",
    colors: ["#6366f1", "#f59e0b", "#ffffff"],
  },

  // ===== ATS / PREMIUM =====
  {
    id: "executive-pro",
    name: "Executive Pro (ATS)",
    category: ["Executive", "Professional", "Traditional"],
    hasPhoto: false,
    isPremium: true,
    rating: 5.0,
    downloads: "21.3K",
    preview: "/resumes/executive-pro.png",
    description: "ATS-optimized resume for senior professionals",
    colors: ["#111827", "#059669", "#ffffff"],
  },
  {
    id: "tech-focused",
    name: "Tech Focused (ATS)",
    category: ["Technology", "Professional", "Modern"],
    hasPhoto: false,
    isPremium: true,
    rating: 4.9,
    downloads: "19.6K",
    preview: "/resumes/tech-focused.png",
    description: "ATS-safe layout for developers and engineers",
    colors: ["#1f2937", "#3b82f6", "#ffffff"],
  },
  {
    id: "centered-elegant",
    name: "Centered Elegant (ATS)",
    category: ["Professional", "Executive", "Traditional"],
    hasPhoto: false,
    isPremium: true,
    rating: 4.8,
    downloads: "14.2K",
    preview: "/resumes/centered-elegant.png",
    description: "Balanced, centered design with ATS compliance",
    colors: ["#1f2937", "#6b7280", "#ffffff"],
  },
  {
    id: "two-column-modern",
    name: "Two Column Modern (ATS)",
    category: ["Modern", "Professional", "Technology"],
    hasPhoto: false,
    isPremium: true,
    rating: 4.8,
    downloads: "16.9K",
    preview: "/resumes/two-column.png",
    description: "Modern two-column structure, fully ATS-safe",
    colors: ["#111827", "#2563eb", "#ffffff"],
  },
  {
    id: "modern-sidebar",
    name: "Modern Sidebar (ATS)",
    category: ["Modern", "Professional", "Executive"],
    hasPhoto: false,
    isPremium: true,
    rating: 4.7,
    downloads: "13.5K",
    preview: "/resumes/modern-sidebar.png",
    description: "Sidebar layout with clean ATS-friendly formatting",
    colors: ["#1f2937", "#7c3aed", "#ffffff"],
  },
  {
    id: "classic-highlight",
    name: "Classic Highlight (ATS)",
    category: ["Traditional", "Professional", "Executive"],
    hasPhoto: false,
    isPremium: true,
    rating: 4.6,
    downloads: "11.8K",
    preview: "/resumes/classic-highlight.png",
    description: "Classic resume with subtle highlights for ATS",
    colors: ["#1f2937", "#f59e0b", "#ffffff"],
  },
]




const categories = [
  "All",
  "Professional",
  "Creative",
  "Executive",
  "Technology",
  "Traditional",
  "Modern",
]

const RatingStars = ({ rating }: { rating: number })  => {
  let fullStars = Math.floor(rating)
  if (rating - fullStars  >= 0.5) fullStars++;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}
export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const filteredTemplates = templates.filter((template) => {
  const matchesCategory =
    selectedCategory === "All" ||
    template.category.includes(selectedCategory)

  const matchesSearch =
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())

  return matchesCategory && matchesSearch
})


  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    // Navigate to editor with selected template
    
    setTimeout(() => {
      window.location.href = `/editor?template=${template.id}`
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Choose Your Template</h1>
                <p className="text-sm text-muted-foreground">Select from our collection of professional templates</p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {filteredTemplates.length} Templates
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={cn("transition-all duration-200", selectedCategory === category && "animate-pulse-glow")}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

       {/* Templates Grid */}
<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
  {filteredTemplates.map((template, index) => (
    <Card
      key={template.id}
      onClick={() => handleSelectTemplate(template)}
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/60 backdrop-blur-sm border-border/50 p-0",
        selectedTemplate?.id === template.id && "ring-2 ring-accent"
      )}
    >
      {/* ================= Template Preview ================= */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-lg">
        {/* Image */}
        <img
          src={template.preview || "/placeholder.svg"}
          alt={template.name}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end z-10">
          <div className="w-full p-3">
            <Button
              size="sm"
              className="w-full bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-2 left-2 z-20">
            <Badge className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5 shadow-sm">
              Premium
            </Badge>
          </div>
        )}

        {/* Color Palette */}
        <div className="absolute top-2 right-2 z-20 flex gap-1  px-1.5 py-1 rounded-full">
          {template.colors.map((color, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-white/60"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* ================= Template Info ================= */}
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-0.5">
          {template.name}
        </h3>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-1">
          {template.category.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="text-[10px] px-1.5 py-0"
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Rating + Downloads */}
        <div className="flex items-center justify-between mb-2">
          <RatingStars rating={template.rating} />

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="w-3 h-3" />
            {template.downloads}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {template.description}
        </p>

        <Button
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation()
            handleSelectTemplate(template)
          }}
        >
          {template.isPremium ? "Upgrade & Use" : "Use Template"}
        </Button>
      </div>
    </Card>
  ))}
</div>


        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-20">
  {/* Header */}
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold tracking-tight mb-3">
      Why Choose Our Templates?
    </h2>
    <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
      Professionally designed resumes that help you stand out and get hired faster
    </p>
  </div>

  {/* Feature Cards */}
  <div className="grid md:grid-cols-3 gap-8">
    {/* ATS */}
    <Card className="group p-7 text-center bg-card/60 backdrop-blur-md border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="w-14 h-14 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md group-hover:scale-105 transition-transform">
        <Zap className="w-6 h-6 text-white" />
      </div>

      <h3 className="font-semibold text-lg mb-2">ATS Optimized</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Built to pass Applicant Tracking Systems and reach real recruiters
      </p>
    </Card>

    {/* Customizable */}
    <Card className="group p-7 text-center bg-card/60 backdrop-blur-md border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="w-14 h-14 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md group-hover:scale-105 transition-transform">
        <Palette className="w-6 h-6 text-white" />
      </div>

      <h3 className="font-semibold text-lg mb-2">Fully Customizable</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Adjust colors, fonts, spacing, and layouts to match your personal brand
      </p>
    </Card>

    {/* Proven */}
    <Card className="group p-7 text-center bg-card/60 backdrop-blur-md border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="w-14 h-14 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md group-hover:scale-105 transition-transform">
        <Star className="w-6 h-6 text-white" />
      </div>

      <h3 className="font-semibold text-lg mb-2">Proven Results</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Trusted by thousands of job seekers who landed interviews faster
      </p>
    </Card>
  </div>
</div>

      </div>
    </div>
  )
}
