"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"


import { ArrowLeft, ArrowRight, User, Briefcase, GraduationCap, Zap, FileText, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import GeneralToast from "@/components/Toast"

interface ResumeData {
  personal: {
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    summary: string
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
}

const steps = [
  { id: 1, title: "Personal", icon: User },
  { id: 2, title: "Experience", icon: Briefcase },
  { id: 3, title: "Education", icon: GraduationCap },
  { id: 4, title: "Skills", icon: Zap },
  { id: 5, title: "Review", icon: FileText },
]

export default function ResumeBuilderPage() {
  const [showToast, setShowToast] = useState(false)
  const [toastPayload, setToastPayload] = useState<{
    variant: "success" | "error" | "warning" | "info"
    title: string
    description: string
  } | null>(null)

  const [currentStep, setCurrentStep] = useState(1)
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
  })

  const progress = (currentStep / steps.length) * 100

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


  const nextStep = () => {
    if (!validateStep(currentStep)) return

    setCurrentStep((prev) => prev + 1)
  }


  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
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

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
    }
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }))
  }

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={resumeData.personal}
            onChange={(field, value) =>
              setResumeData((prev) => ({
                ...prev,
                personal: { ...prev.personal, [field]: value },
              }))
            }
          />
        )
      case 2:
        return (
          <ExperienceStep
            experiences={resumeData.experience}
            onAdd={addExperience}
            onRemove={removeExperience}
            onUpdate={updateExperience}
          />
        )
      case 3:
        return (
          <EducationStep
            education={resumeData.education}
            onAdd={addEducation}
            onRemove={removeEducation}
            onUpdate={updateEducation}
          />
        )
      case 4:
        return <SkillsStep skills={resumeData.skills} onAdd={addSkill} onRemove={removeSkill} />
      case 5:
        return (
          <SummaryStep
            data={resumeData}
            onSummaryChange={(value) =>
              setResumeData((prev) => ({
                ...prev,
                personal: { ...prev.personal, summary: value },
              }))
            }
          />
        )
      default:
        return null
    }
  }

  const validateStep = (step: number) => {
    // STEP 1 — PERSONAL INFO
    if (step === 1) {
      const p = resumeData.personal

      if (!p.firstName || !p.lastName || !p.email || !p.phone || !p.location) {
        triggerToast(
          "error",
          "Personal Details Required",
          "Please complete all personal information before continuing."
        )
        return false
      }

      return true
    }

    // STEP 2 — EXPERIENCE
    if (step === 2) {
      if (resumeData.experience.length === 0) {
        return true // optional section for you
      }

      for (const exp of resumeData.experience) {
        if (!exp.company || !exp.position || !exp.startDate) {
          triggerToast(
            "error",
            "Experience Incomplete",
            "Please fill company name, job title, and start date."
          )
          return false
        }
      }

      return true
    }

    // STEP 3 — EDUCATION
    if (step === 3) {
      if (resumeData.education.length === 0) {
        triggerToast(
          "warning",
          "Add Your Education",
          "You need to add at least one education entry to continue."
        )
        return false
      }

      for (const edu of resumeData.education) {
        if (!edu.school || !edu.degree || !edu.field || !edu.graduationDate) {
          triggerToast(
            "error",
            "Education Details Missing",
            "Please fill school, degree, field of study, and graduation date."
          )
          return false
        }
      }

      return true
    }

    // STEP 4 — SKILLS
    if (step === 4) {
      if (resumeData.skills.length === 0) {
        triggerToast(
          "warning",
          "Add Your Skills",
          "Please add at least one skill before continuing."
        )
        return false
      }

      return true
    }

    return true
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 shadow-lg shadow-orange-500/20">
              {currentStep} / {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500 shadow-lg shadow-orange-500/30"
              style={{ width: `${progress}%` }}
            />
          </Progress>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-xl shadow-orange-500/10 border border-orange-100/50">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (!isCompleted) return;
                    setCurrentStep(step.id)
                  }}
                  disabled={!isCompleted}
                  className={cn(
                    "flex items-center space-x-6 mx-2 px-6 py-2 rounded-lg transition-all duration-300 text-sm font-medium relative",
                    isActive && "bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105",
                    isCompleted && "text-orange-600 hover:bg-orange-50",
                    !isActive && !isCompleted && "text-gray-500 hover:text-gray-700 hover:bg-orange-50",
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive && "drop-shadow-sm")} />
                  <span className="hidden sm:inline ">{step.title}</span>
                  {isActive && <div className="absolute inset-0 rounded-lg bg-orange-500/20 blur-sm -z-10 scale-110" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm border border-orange-100/50 rounded-xl shadow-xl shadow-orange-500/5 hover:shadow-orange-500/10 transition-all duration-300">
          {renderStepContent()}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 hover:shadow-md transition-all duration-200 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-200"
              onClick={() => {
                window.location.href = "/templates"
              }}
            >
              Choose Template
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-200"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {showToast && toastPayload && (
        <GeneralToast
          variant={toastPayload.variant}
          title={toastPayload.title}
          description={toastPayload.description}
        />
      )}




    </div>
  )
}

// Step Components
function PersonalInfoStep({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 drop-shadow-sm">Personal Information</h2>
        <p className="text-gray-600">Let's start with your basic details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name
          </Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="John"
            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name
          </Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Doe"
            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="john@example.com"
            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone
          </Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="location" className="text-sm font-medium text-gray-700">
            Location
          </Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="New York, NY"
            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  )
}

function ExperienceStep({ experiences, onAdd, onRemove, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 drop-shadow-sm">Work Experience</h2>
        <p className="text-gray-600">Add your professional experience</p>
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300 drop-shadow-sm" />
          <p>No experience added yet</p>
        </div>
      )}

      {experiences.map((exp: any, index: number) => (
        <div
          key={exp.id}
          className="p-6 border border-orange-100/50 rounded-lg bg-gradient-to-br from-gray-50/80 to-orange-50/30 shadow-md hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Position #{index + 1}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(exp.id)}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => onUpdate(exp.id, "company", e.target.value)}
                placeholder="Company name"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Job Title</Label>
              <Input
                value={exp.position}
                onChange={(e) => onUpdate(exp.id, "position", e.target.value)}
                placeholder="Your position"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Start Date</Label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => onUpdate(exp.id, "startDate", e.target.value)}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">End Date</Label>
              <Input
                type="month"
                value={exp.endDate}
                onChange={(e) => onUpdate(exp.id, "endDate", e.target.value)}
                disabled={exp.current}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 disabled:bg-gray-100 transition-all duration-200"
              />
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => onUpdate(exp.id, "current", e.target.checked)}
                  className="text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <Label htmlFor={`current-${exp.id}`} className="text-sm text-gray-600">
                  Current position
                </Label>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => onUpdate(exp.id, "description", e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 resize-none transition-all duration-200"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        onClick={onAdd}
        variant="outline"
        className="w-full border-2 border-dashed border-orange-300/60 text-orange-600 hover:border-orange-500 hover:text-orange-700 hover:bg-orange-50 hover:shadow-lg hover:shadow-orange-500/20 py-6 transition-all duration-300 bg-transparent"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  )
}

function EducationStep({ education, onAdd, onRemove, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 drop-shadow-sm">Education</h2>
        <p className="text-gray-600">Add your educational background</p>
      </div>

      {education.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300 drop-shadow-sm" />
          <p>No education added yet</p>
        </div>
      )}

      {education.map((edu: any, index: number) => (
        <div
          key={edu.id}
          className="p-6 border border-orange-100/50 rounded-lg bg-gradient-to-br from-gray-50/80 to-orange-50/30 shadow-md hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Education #{index + 1}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(edu.id)}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">School</Label>
              <Input
                value={edu.school}
                onChange={(e) => onUpdate(edu.id, "school", e.target.value)}
                placeholder="University name"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Degree</Label>
              <Input
                value={edu.degree}
                onChange={(e) => onUpdate(edu.id, "degree", e.target.value)}
                placeholder="Bachelor's, Master's, etc."
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Field of Study</Label>
              <Input
                value={edu.field}
                onChange={(e) => onUpdate(edu.id, "field", e.target.value)}
                placeholder="Computer Science, etc."
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Graduation Date</Label>
              <Input
                type="month"
                value={edu.graduationDate}
                onChange={(e) => onUpdate(edu.id, "graduationDate", e.target.value)}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">GPA (Optional)</Label>
              <Input
                value={edu.gpa}
                onChange={(e) => onUpdate(edu.id, "gpa", e.target.value)}
                placeholder="3.8"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        onClick={onAdd}
        variant="outline"
        className="w-full border-2 border-dashed border-orange-300/60 text-orange-600 hover:border-orange-500 hover:text-orange-700 hover:bg-orange-50 hover:shadow-lg hover:shadow-orange-500/20 py-6 transition-all duration-300 bg-transparent"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  )
}

function SkillsStep({ skills, onAdd, onRemove }: any) {
  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = () => {
    onAdd(newSkill)
    setNewSkill("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSkill()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 drop-shadow-sm">Skills</h2>
        <p className="text-gray-600">Add your key skills and competencies</p>
      </div>

      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a skill and press Enter"
          className="flex-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-200"
        />
        <Button
          onClick={handleAddSkill}
          disabled={!newSkill.trim()}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white disabled:bg-gray-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {skills.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Your Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1 cursor-pointer bg-orange-100 text-orange-700 border border-orange-200 hover:bg-red-100 hover:text-red-700 hover:border-red-200 hover:shadow-md hover:shadow-red-500/20 transition-all duration-200 shadow-sm shadow-orange-500/10"
                onClick={() => onRemove(skill)}
              >
                {skill}
                <X className="w-3 h-3 ml-2" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {skills.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300 drop-shadow-sm" />
          <p>No skills added yet</p>
        </div>
      )}
    </div>
  )
}

function SummaryStep({ data, onSummaryChange }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 drop-shadow-sm">Review & Summary</h2>
        <p className="text-gray-600">Add a professional summary to complete your resume</p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="summary" className="text-sm font-medium text-gray-700">
          Professional Summary
        </Label>
        <Textarea
          id="summary"
          value={data.personal.summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Write a brief summary of your professional background and goals..."
          rows={4}
          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 focus:shadow-lg focus:shadow-orange-500/20 resize-none transition-all duration-200"
        />
      </div>

      <div className="p-6 bg-gradient-to-br from-orange-50/50 to-gray-50/80 rounded-lg border border-orange-100/50 shadow-md shadow-orange-500/5">
        <h3 className="font-medium text-gray-900 mb-4">Resume Overview</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <span className="ml-2 text-gray-900">
              {data.personal.firstName} {data.personal.lastName}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <span className="ml-2 text-gray-900">{data.personal.email || "Not provided"}</span>
          </div>
          <div>
            <span className="text-gray-600">Experience:</span>
            <span className="ml-2 text-gray-900">
              {data.experience.length} position{data.experience.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Education:</span>
            <span className="ml-2 text-gray-900">
              {data.education.length} entr{data.education.length !== 1 ? "ies" : "y"}
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="text-gray-600">Skills:</span>
            <span className="ml-2 text-gray-900">
              {data.skills.length} skill{data.skills.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
