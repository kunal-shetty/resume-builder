"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Eye, Palette, User, Camera, FileText, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  category: string
  hasPhoto: boolean
  isPremium: boolean
  rating: number
  downloads: string
  preview: string
  description: string
  colors: string[]
}

const templates: Template[] = [
  {
    id: "artistic-minimalistic",
    name: "Artistic Minimalistic",
    category: "Minimimalistic",
    hasPhoto: false,
    isPremium: false,
    rating: 4.9,
    downloads: "12.5K",
    preview: "/no-photo/artistic-minimalistic-1.jpg",
    description: "Clean, artistic design perfect for any industry",
    colors: ["#1f2937", "#8b5cf6", "#ffffff"],
  },
  {
    id: "creative-photo",
    name: "Creative Photo",
    category: "Creative",
    hasPhoto: true,
    isPremium: false,
    rating: 4.8,
    downloads: "8.2K",
    preview: "/creative-resume-template-with-photo-section-colorf.png",
    description: "Eye-catching design with photo section for creative roles",
    colors: ["#8b5cf6", "#ec4899", "#ffffff"],
  },
  {
    id: "executive-pro",
    name: "Executive Pro",
    category: "Executive",
    hasPhoto: true,
    isPremium: true,
    rating: 5.0,
    downloads: "15.1K",
    preview: "/executive-professional-resume-template-with-photo-.png",
    description: "Premium template for senior executives and managers",
    colors: ["#1f2937", "#059669", "#ffffff"],
  },
  {
    id: "tech-focused",
    name: "Tech Focused",
    category: "Technology",
    hasPhoto: false,
    isPremium: false,
    rating: 4.7,
    downloads: "9.8K",
    preview: "/tech-resume-template-modern-coding-developer-desig.png",
    description: "Perfect for developers and tech professionals",
    colors: ["#1f2937", "#3b82f6", "#ffffff"],
  },
  {
    id: "artistic-flair",
    name: "Artistic Flair",
    category: "Creative",
    hasPhoto: true,
    isPremium: true,
    rating: 4.9,
    downloads: "6.7K",
    preview: "/artistic-creative-resume-template-with-photo-artis.png",
    description: "Bold, artistic design for creative professionals",
    colors: ["#8b5cf6", "#f59e0b", "#ffffff"],
  },
  {
    id: "classic-elegant",
    name: "Classic Elegant",
    category: "Traditional",
    hasPhoto: false,
    isPremium: false,
    rating: 4.6,
    downloads: "11.3K",
    preview: "/classic-elegant-resume-template-traditional-profes.png",
    description: "Timeless design suitable for traditional industries",
    colors: ["#1f2937", "#6b7280", "#ffffff"],
  },
  {
    id: "startup-dynamic",
    name: "Startup Dynamic",
    category: "Modern",
    hasPhoto: true,
    isPremium: true,
    rating: 4.8,
    downloads: "7.9K",
    preview: "/startup-dynamic-resume-template-with-photo-modern-.png",
    description: "Dynamic design perfect for startup environments",
    colors: ["#8b5cf6", "#ef4444", "#ffffff"],
  },
  {
    id: "academic-scholar",
    name: "Academic Scholar",
    category: "Academic",
    hasPhoto: false,
    isPremium: false,
    rating: 4.5,
    downloads: "5.4K",
    preview: "/academic-scholar-resume-template-clean-professiona.png",
    description: "Designed for academics and researchers",
    colors: ["#1f2937", "#059669", "#ffffff"],
  },
  {
    id: "sales-champion",
    name: "Sales Champion",
    category: "Sales",
    hasPhoto: true,
    isPremium: true,
    rating: 4.7,
    downloads: "8.6K",
    preview: "/sales-champion-resume-template-with-photo-professi.png",
    description: "Results-focused design for sales professionals",
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
  "Academic",
  "Sales",
]

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
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

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Camera className="w-4 h-4" />
              <span>With Photo</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>No Photo</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-accent" />
              <span>Premium</span>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template, index) => (
            <Card
              key={template.id}
              className={cn(
                "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden",
                selectedTemplate?.id === template.id && "ring-2 ring-accent animate-pulse-glow",
              )}
              onClick={() => handleSelectTemplate(template)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Template Preview */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Button
                      size="sm"
                      className="w-full bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {template.isPremium && (
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {template.hasPhoto && (
                    <Badge variant="secondary" className="text-xs">
                      <Camera className="w-3 h-3 mr-1" />
                      Photo
                    </Badge>
                  )}
                </div>

                {/* Color Palette */}
                <div className="absolute top-3 right-3 flex space-x-1">
                  {template.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full border border-white/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">{template.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-xs">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span>{template.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{template.downloads} downloads</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{template.description}</p>

                <Button
                  size="sm"
                  className="w-full group-hover:animate-pulse-glow"
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
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Why Choose Our Templates?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our templates are designed by professionals and optimized for success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-card/60 backdrop-blur-sm border-border/50">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">ATS Optimized</h3>
              <p className="text-sm text-muted-foreground">All templates pass through Applicant Tracking Systems</p>
            </Card>

            <Card className="p-6 text-center bg-card/60 backdrop-blur-sm border-border/50">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Fully Customizable</h3>
              <p className="text-sm text-muted-foreground">Change colors, fonts, and layout to match your style</p>
            </Card>

            <Card className="p-6 text-center bg-card/60 backdrop-blur-sm border-border/50">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Proven Results</h3>
              <p className="text-sm text-muted-foreground">Used by thousands of successful job seekers</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
