"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, Code, Download, Star, Heart, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

const templates = [
  {
    id: 1,
    name: "Neon Cyber",
    description: "Futuristic portfolio with neon effects and cyberpunk aesthetics",
    image: "/placeholder.svg?height=300&width=400",
    category: "Modern",
    features: ["Neon Glow", "Particle Effects", "3D Animations", "Dark Theme"],
    rating: 4.9,
    downloads: 1234,
    preview: "https://neon-cyber-demo.vercel.app",
  },
  {
    id: 2,
    name: "Minimal Clean",
    description: "Clean and professional design with subtle animations",
    image: "/placeholder.svg?height=300&width=400",
    category: "Minimal",
    features: ["Clean Design", "Smooth Transitions", "Light Theme", "Typography Focus"],
    rating: 4.8,
    downloads: 987,
    preview: "https://minimal-clean-demo.vercel.app",
  },
  {
    id: 3,
    name: "Brutalist Bold",
    description: "Bold and experimental design with strong typography",
    image: "/placeholder.svg?height=300&width=400",
    category: "Experimental",
    features: ["Bold Typography", "Geometric Shapes", "High Contrast", "Experimental Layout"],
    rating: 4.7,
    downloads: 756,
    preview: "https://brutalist-bold-demo.vercel.app",
  },
  {
    id: 4,
    name: "Glass Morphism",
    description: "Modern glassmorphism design with frosted glass effects",
    image: "/placeholder.svg?height=300&width=400",
    category: "Modern",
    features: ["Glass Effects", "Backdrop Blur", "Gradient Backgrounds", "Modern UI"],
    rating: 4.9,
    downloads: 1456,
    preview: "https://glass-morphism-demo.vercel.app",
  },
  {
    id: 5,
    name: "Retro Wave",
    description: "80s inspired design with synthwave aesthetics",
    image: "/placeholder.svg?height=300&width=400",
    category: "Retro",
    features: ["Retro Colors", "Synthwave Style", "Neon Grids", "Vintage Effects"],
    rating: 4.6,
    downloads: 623,
    preview: "https://retro-wave-demo.vercel.app",
  },
  {
    id: 6,
    name: "Nature Organic",
    description: "Organic design inspired by nature with earth tones",
    image: "/placeholder.svg?height=300&width=400",
    category: "Organic",
    features: ["Earth Tones", "Organic Shapes", "Nature Inspired", "Soft Animations"],
    rating: 4.5,
    downloads: 445,
    preview: "https://nature-organic-demo.vercel.app",
  },
]

const categories = ["All", "Modern", "Minimal", "Experimental", "Retro", "Organic"]

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null)

  const filteredTemplates =
    selectedCategory === "All" ? templates : templates.filter((template) => template.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-black/20 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Portfolio Templates</h1>
              <p className="text-gray-300">Choose from our collection of stunning portfolio templates</p>
            </div>
            <Link href="/builder">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Start Building
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 mb-12 justify-center"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredTemplate(template.id)}
              onHoverEnd={() => setHoveredTemplate(null)}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="group"
            >
              <Card className="bg-black/20 backdrop-blur-md border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                <div className="relative overflow-hidden">
                  <Image
                    src={template.image || "/placeholder.svg"}
                    alt={template.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredTemplate === template.id ? 1 : 0 }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Link href={`/builder?template=${template.id}`}>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Code className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </Link>
                  </motion.div>

                  {/* Category Badge */}
                  <Badge className="absolute top-4 left-4 bg-purple-600/80 text-white">{template.category}</Badge>
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{template.name}</CardTitle>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{template.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{template.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="secondary" className="bg-white/10 text-gray-300 text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{template.downloads.toLocaleString()} downloads</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>Popular</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Link href={`/builder?template=${template.id}`} className="flex-1">
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Use
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create your own custom portfolio from scratch with our powerful builder
          </p>
          <Link href="/builder">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 hover:from-yellow-600 hover:via-red-600 hover:to-pink-600 text-white px-12 py-6 text-xl font-bold rounded-full"
            >
              Start From Scratch
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
