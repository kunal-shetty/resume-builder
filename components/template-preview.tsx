"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Building } from "lucide-react"

interface TemplatePreviewProps {
  templateId: string
  data?: any
  className?: string
}

export function TemplatePreview({ templateId, data, className }: TemplatePreviewProps) {
  const sampleData = {
    personal: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      summary: "Experienced software engineer with 5+ years of expertise in full-stack development.",
    },
    experience: [
      {
        company: "Tech Corp",
        position: "Senior Developer",
        startDate: "2022-01",
        endDate: "Present",
        current: true,
        description: "Led development of key features and mentored junior developers.",
      },
      {
        company: "StartupXYZ",
        position: "Full Stack Developer",
        startDate: "2020-06",
        endDate: "2021-12",
        current: false,
        description: "Built scalable web applications using React and Node.js.",
      },
    ],
    education: [
      {
        school: "University of Technology",
        degree: "Bachelor of Science",
        field: "Computer Science",
        graduationDate: "2020-05",
      },
    ],
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
  }

  const resumeData = data || sampleData

  const renderTemplate = () => {
    switch (templateId) {
      case "modern-minimal":
        return <ModernMinimalTemplate data={resumeData} />
      case "creative-photo":
        return <CreativePhotoTemplate data={resumeData} />
      case "executive-pro":
        return <ExecutiveProTemplate data={resumeData} />
      case "tech-focused":
        return <TechFocusedTemplate data={resumeData} />
      default:
        return <ModernMinimalTemplate data={resumeData} />
    }
  }

  return <div className={className}>{renderTemplate()}</div>
}

function ModernMinimalTemplate({ data }: { data: any }) {
  return (
    <Card className="p-8 bg-white text-gray-900 shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personal.firstName} {data.personal.lastName}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {data.personal.email}
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {data.personal.phone}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {data.personal.location}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.personal.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <Building className="w-4 h-4" />
                  {exp.company}
                </div>
                <p className="text-gray-700 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
          <div className="space-y-2">
            {data.education.map((edu: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-sm text-gray-600">{edu.graduationDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

function CreativePhotoTemplate({ data }: { data: any }) {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg overflow-hidden">
      <div className="flex">
        {/* Left Sidebar with Photo */}
        <div className="w-1/3 bg-gradient-to-b from-purple-600 to-pink-600 p-6 text-white">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12" />
          </div>
          <h1 className="text-xl font-bold text-center mb-6">
            {data.personal.firstName} {data.personal.lastName}
          </h1>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-xs">{data.personal.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="text-xs">{data.personal.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-xs">{data.personal.location}</span>
            </div>
          </div>

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Skills</h3>
              <div className="space-y-2">
                {data.skills.slice(0, 6).map((skill: string, index: number) => (
                  <div key={index} className="text-xs bg-white/20 rounded px-2 py-1">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-6">
          {/* Summary */}
          {data.personal.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About Me</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{data.personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Experience</h2>
              <div className="space-y-3">
                {data.experience.map((exp: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900 text-sm">{exp.position}</h3>
                    <p className="text-purple-600 text-sm font-medium">{exp.company}</p>
                    <p className="text-xs text-gray-600 mb-1">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                    <p className="text-gray-700 text-xs">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
              <div className="space-y-2">
                {data.education.map((edu: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-purple-600 text-sm">{edu.school}</p>
                    <p className="text-xs text-gray-600">{edu.graduationDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

function ExecutiveProTemplate({ data }: { data: any }) {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
      {/* Header with Photo */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {data.personal.email}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {data.personal.phone}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Executive Summary */}
        {data.personal.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-green-200 pb-1">
              Executive Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
          </div>
        )}

        {/* Professional Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-green-200 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp: any, index: number) => (
                <div key={index} className="border-l-2 border-green-600 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-green-600 font-medium mb-2">{exp.company}</p>
                  <p className="text-gray-700 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-green-200 pb-1">Education</h2>
              <div className="space-y-3">
                {data.education.map((edu: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                    <p className="text-green-600 text-sm">{edu.field}</p>
                    <p className="text-gray-600 text-sm">
                      {edu.school} • {edu.graduationDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Competencies */}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-green-200 pb-1">
                Core Competencies
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {data.skills.map((skill: string, index: number) => (
                  <div key={index} className="text-sm text-gray-700 flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

function TechFocusedTemplate({ data }: { data: any }) {
  return (
    <Card className="p-8 bg-white text-gray-900 shadow-lg">
      {/* Header */}
      <div className="px-6 py-0">
        <h1 className="text-2xl font-bold mb-2">
          {data.personal.firstName} {data.personal.lastName}
        </h1>
        <p className="mb-4">{data.personal.summary}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {data.personal.email}
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {data.personal.phone}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {data.personal.location}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Technical Skills */}
        {data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              Technical Skills
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {data.skills.map((skill: string, index: number) => (
                <Badge key={index} className="bg-blue-100 text-blue-800 justify-center">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp: any, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </Badge>
                  </div>
                  <p className="text-gray-700 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-gray-600 text-sm">{edu.school}</p>
                  </div>
                  <Badge variant="secondary">{edu.graduationDate}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
