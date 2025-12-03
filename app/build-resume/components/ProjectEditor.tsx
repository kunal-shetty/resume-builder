"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trash2, Edit3, Save, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  description: string
  image: string
  liveUrl: string
  githubUrl: string
  technologies: string[]
}

interface ProjectEditorProps {
  project: Project
  onUpdate: (project: Partial<Project>) => void
  onDelete: () => void
}

export default function ProjectEditor({ project, onUpdate, onDelete }: ProjectEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProject, setEditedProject] = useState(project)
  const [newTech, setNewTech] = useState("")

  const handleSave = () => {
    onUpdate(editedProject)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProject(project)
    setIsEditing(false)
  }

  const addTechnology = () => {
    if (newTech.trim()) {
      setEditedProject((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()],
      }))
      setNewTech("")
    }
  }

  const removeTechnology = (index: number) => {
    setEditedProject((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }))
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <Card className="bg-white/5 border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-white">
            {isEditing ? "Edit Project" : project.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleSave} className="text-green-400 hover:text-green-300">
                  <Save className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancel} className="text-gray-400 hover:text-gray-300">
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Title</label>
                  <Input
                    value={editedProject.title}
                    onChange={(e) => setEditedProject((prev) => ({ ...prev, title: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Image URL</label>
                  <Input
                    value={editedProject.image}
                    onChange={(e) => setEditedProject((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="/placeholder.svg?height=300&width=400"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Description</label>
                <Textarea
                  value={editedProject.description}
                  onChange={(e) => setEditedProject((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Live URL</label>
                  <Input
                    value={editedProject.liveUrl}
                    onChange={(e) => setEditedProject((prev) => ({ ...prev, liveUrl: e.target.value }))}
                    placeholder="https://example.com"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">GitHub URL</label>
                  <Input
                    value={editedProject.githubUrl}
                    onChange={(e) => setEditedProject((prev) => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/user/repo"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Technologies</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editedProject.technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 cursor-pointer"
                      onClick={() => removeTechnology(index)}
                    >
                      {tech} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology"
                    className="bg-white/5 border-white/20 text-white flex-1"
                    onKeyPress={(e) => e.key === "Enter" && addTechnology()}
                  />
                  <Button onClick={addTechnology} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-300">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-600/20 text-purple-300">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                {project.liveUrl && <span>Live: {project.liveUrl}</span>}
                {project.githubUrl && <span>GitHub: {project.githubUrl}</span>}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
