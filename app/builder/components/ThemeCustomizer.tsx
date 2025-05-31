"use client"

import { motion } from "framer-motion"
import { Palette, Type } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Theme {
  name: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  font: string
  layout: string
}

interface ThemeCustomizerProps {
  theme: Theme
  themes: Theme[]
  onThemeChange: (theme: Theme) => void
}

export default function ThemeCustomizer({ theme, themes, onThemeChange }: ThemeCustomizerProps) {
  const fonts = ["Inter", "Roboto", "Space Mono", "Playfair Display", "Poppins", "Fira Code"]

  const layouts = [
    { value: "grid", label: "Grid Layout" },
    { value: "minimal", label: "Minimal" },
    { value: "brutalist", label: "Brutalist" },
    { value: "neon", label: "Neon Cyber" },
  ]

  const updateTheme = (field: keyof Theme, value: string) => {
    onThemeChange({
      ...theme,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      {/* Preset Themes */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Palette className="w-5 h-5" />
            Preset Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((presetTheme, index) => (
              <motion.div
                key={presetTheme.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onThemeChange(presetTheme)}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  theme.name === presetTheme.name
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: presetTheme.primaryColor }} />
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: presetTheme.secondaryColor }} />
                </div>
                <h3 className="text-white font-semibold">{presetTheme.name}</h3>
                <p className="text-gray-400 text-sm">{presetTheme.layout}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Palette className="w-5 h-5" />
            Custom Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-color" className="text-white">
                Primary Color
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="primary-color"
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => updateTheme("primaryColor", e.target.value)}
                  className="w-12 h-10 rounded border-white/20"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => updateTheme("primaryColor", e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary-color" className="text-white">
                Secondary Color
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="secondary-color"
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => updateTheme("secondaryColor", e.target.value)}
                  className="w-12 h-10 rounded border-white/20"
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => updateTheme("secondaryColor", e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bg-color" className="text-white">
                Background Color
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="bg-color"
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => updateTheme("backgroundColor", e.target.value)}
                  className="w-12 h-10 rounded border-white/20"
                />
                <input
                  type="text"
                  value={theme.backgroundColor}
                  onChange={(e) => updateTheme("backgroundColor", e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="text-color" className="text-white">
                Text Color
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="text-color"
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => updateTheme("textColor", e.target.value)}
                  className="w-12 h-10 rounded border-white/20"
                />
                <input
                  type="text"
                  value={theme.textColor}
                  onChange={(e) => updateTheme("textColor", e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography & Layout */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Type className="w-5 h-5" />
            Typography & Layout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="font-select" className="text-white">
              Font Family
            </Label>
            <Select value={theme.font} onValueChange={(value) => updateTheme("font", value)}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="layout-select" className="text-white">
              Layout Style
            </Label>
            <Select value={theme.layout} onValueChange={(value) => updateTheme("layout", value)}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {layouts.map((layout) => (
                  <SelectItem key={layout.value} value={layout.value}>
                    {layout.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
