"use client"

import { motion } from "framer-motion"
import { Github, ExternalLink, Mail, Linkedin, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface ResumePreviewProps {
  data: any
  isCompact?: boolean
}

export default function ResumePreview({ data, isCompact = false }: ResumePreviewProps) {
  const { name, title, bio, email, github, linkedin, profilePicture, projects, skills, theme, animations } = data

  const containerClass = isCompact ? "w-full h-full overflow-y-auto text-xs" : "w-full min-h-screen"
  const sectionClass = isCompact ? "p-4" : "p-8"

  return (
    <div
      className={containerClass}
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.font,
      }}
    >
      {/* Hero Section */}
      <motion.section
        initial={animations ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${sectionClass} text-center relative overflow-hidden`}
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.secondaryColor}20)`,
        }}
      >
        {animations && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle, ${theme.primaryColor}, ${theme.secondaryColor})`,
            }}
          />
        )}

        <motion.div
          initial={animations ? { scale: 0 } : { scale: 1 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <div
            className={`w-32 h-32 ${isCompact ? "w-16 h-16" : "w-32 h-32"} mx-auto mb-6 rounded-full flex items-center justify-center text-white font-bold overflow-hidden border-2`}
            style={{
              background: profilePicture
                ? "transparent"
                : `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              fontSize: isCompact ? "1.5rem" : "2.5rem",
              borderColor: `${theme.primaryColor}40`,
              borderWidth: "3px",
            }}
          >
            {profilePicture ? (
              <img
                src={profilePicture || "/placeholder.svg"}
                alt={name || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : name ? (
              name.charAt(0).toUpperCase()
            ) : (
              <User className={`${isCompact ? "w-8 h-8" : "w-16 h-16"}`} />
            )}
          </div>

          <h1
            className={`${isCompact ? "text-lg" : "text-4xl md:text-6xl"} font-bold mb-4`}
            style={{
              textShadow: animations ? `0 0 10px ${theme.primaryColor}40` : "none",
            }}
          >
            {name || "Your Name"}
          </h1>

          <h2 className={`${isCompact ? "text-sm" : "text-xl md:text-2xl"} mb-6`} style={{ color: theme.primaryColor }}>
            {title || "Your Title"}
          </h2>

          <p className={`${isCompact ? "text-xs" : "text-lg"} max-w-2xl mx-auto mb-8 opacity-80`}>
            {bio || "Your bio will appear here..."}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {email && (
              <button
                className={`${isCompact ? "text-xs px-4 py-2" : "text-base px-6 py-3"} font-semibold rounded-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg`}
                style={{
                  backgroundColor: theme.primaryColor,
                  color: theme.backgroundColor,
                  border: `2px solid ${theme.primaryColor}`,
                  opacity: 1,
                  visibility: "visible",
                }}
              >
                <Mail className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} inline mr-2`} />
                Contact
              </button>
            )}
            {github && (
              <button
                className={`${isCompact ? "text-xs px-4 py-2" : "text-base px-6 py-3"} font-semibold rounded-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg`}
                style={{
                  backgroundColor: "transparent",
                  color: theme.primaryColor,
                  border: `2px solid ${theme.primaryColor}`,
                  opacity: 1,
                  visibility: "visible",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primaryColor
                  e.currentTarget.style.color = theme.backgroundColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.color = theme.primaryColor
                }}
              >
                <Github className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} inline mr-2`} />
                GitHub
              </button>
            )}
            {linkedin && (
              <button
                className={`${isCompact ? "text-xs px-4 py-2" : "text-base px-6 py-3"} font-semibold rounded-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg`}
                style={{
                  backgroundColor: "transparent",
                  color: theme.primaryColor,
                  border: `2px solid ${theme.primaryColor}`,
                  opacity: 1,
                  visibility: "visible",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primaryColor
                  e.currentTarget.style.color = theme.backgroundColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.color = theme.primaryColor
                }}
              >
                <Linkedin className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} inline mr-2`} />
                LinkedIn
              </button>
            )}
          </div>
        </motion.div>
      </motion.section>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className={sectionClass}>
          <motion.h2
            initial={animations ? { opacity: 0, x: -50 } : { opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={`${isCompact ? "text-lg" : "text-3xl"} font-bold mb-8 text-center`}
            style={{ color: theme.primaryColor }}
          >
            Projects
          </motion.h2>

          <div className={`grid ${isCompact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-6`}>
            {projects.map((project: any, index: number) => (
              <motion.div
                key={project.id}
                initial={animations ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={animations ? { scale: 1.05, rotateY: 5 } : {}}
                className="h-full"
              >
                <Card
                  className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                  style={{ backgroundColor: `${theme.primaryColor}10` }}
                >
                  <div className="relative">
                    <Image
                      src={project.image || "/placeholder.svg?height=200&width=300"}
                      alt={project.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <CardContent className={`${isCompact ? "p-3" : "p-6"} flex-1 flex flex-col`}>
                    <h3 className={`${isCompact ? "text-sm" : "text-xl"} font-bold mb-2`}>{project.title}</h3>
                    <p className={`${isCompact ? "text-xs" : "text-sm"} opacity-80 mb-4 flex-1`}>
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className={`${isCompact ? "text-xs px-2 py-1" : "text-xs px-3 py-1"} rounded-full`}
                          style={{
                            backgroundColor: theme.primaryColor,
                            color: theme.backgroundColor,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      {project.liveUrl && (
                        <button
                          className={`${isCompact ? "text-xs px-3 py-2" : "text-sm px-4 py-2"} font-semibold rounded-lg flex-1 transition-all duration-300`}
                          style={{
                            backgroundColor: theme.primaryColor,
                            color: theme.backgroundColor,
                            border: `2px solid ${theme.primaryColor}`,
                            opacity: 1,
                            visibility: "visible",
                          }}
                        >
                          <ExternalLink className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} inline mr-2`} />
                          Live
                        </button>
                      )}
                      {project.githubUrl && (
                        <button
                          className={`${isCompact ? "text-xs px-3 py-2" : "text-sm px-4 py-2"} font-semibold rounded-lg flex-1 transition-all duration-300`}
                          style={{
                            backgroundColor: "transparent",
                            color: theme.primaryColor,
                            border: `2px solid ${theme.primaryColor}`,
                            opacity: 1,
                            visibility: "visible",
                          }}
                        >
                          <Github className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} inline mr-2`} />
                          Code
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className={sectionClass} style={{ backgroundColor: `${theme.primaryColor}05` }}>
          <motion.h2
            initial={animations ? { opacity: 0, x: -50 } : { opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={`${isCompact ? "text-lg" : "text-3xl"} font-bold mb-8 text-center`}
            style={{ color: theme.primaryColor }}
          >
            Skills
          </motion.h2>

          <div className={`grid ${isCompact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-6`}>
            {skills.map((skill: any, index: number) => (
              <motion.div
                key={skill.id}
                initial={animations ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className={`${isCompact ? "text-sm" : "text-lg"} font-semibold mb-2`}>{skill.name}</h3>
                <div className="relative w-full bg-gray-300 rounded-full h-2 mb-2">
                  <motion.div
                    initial={animations ? { width: 0 } : { width: `${skill.level}%` }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                </div>
                <span className={`${isCompact ? "text-xs" : "text-sm"} opacity-70`}>{skill.level}%</span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className={`${sectionClass} text-center`}>
        <motion.h2
          initial={animations ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          className={`${isCompact ? "text-lg" : "text-3xl"} font-bold mb-8`}
          style={{ color: theme.primaryColor }}
        >
          Get In Touch
        </motion.h2>

        <motion.p
          initial={animations ? { opacity: 0 } : { opacity: 1 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${isCompact ? "text-xs" : "text-lg"} mb-8 opacity-80`}
        >
          Let's work together on your next project!
        </motion.p>

        <motion.div
          initial={animations ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {email && (
            <button
              className={`${isCompact ? "text-sm px-6 py-3" : "text-lg px-8 py-4"} font-semibold rounded-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg`}
              style={{
                backgroundColor: theme.primaryColor,
                color: theme.backgroundColor,
                border: `2px solid ${theme.primaryColor}`,
                opacity: 1,
                visibility: "visible",
              }}
            >
              <Mail className={`${isCompact ? "w-3 h-3" : "w-5 h-5"} inline mr-2`} />
              Contact Me
            </button>
          )}
        </motion.div>
      </section>
    </div>
  )
}
