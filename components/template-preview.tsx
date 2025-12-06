"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Building } from "lucide-react"

interface TemplatePreviewProps {
  templateId: string
  data?: any
  styleConfig: any;  
  className?: string
}
export function formatDate(date: string): string {
  if (!date) return "";

  // Handle "present" in any casing
  if (date.toLowerCase() === "present") return "Present";

  const parts = date.split("-");

  // If only year is given: "2025"
  if (parts.length === 1) {
    return parts[0];
  }

  const [year, month] = parts;

  // If month is missing or invalid
  if (!month || isNaN(Number(month))) {
    return year;
  }

  const monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December",
  ];

  const monthIndex = Number(month) - 1;

  if (monthIndex < 0 || monthIndex > 11) return year;

  return `${monthNames[monthIndex]} ${year}`;
}

export function TemplatePreview({ templateId, data, styleConfig, className }: TemplatePreviewProps) {
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
        return styleConfig.showPhoto ? (
          <ModernMinimalPhotoTemplate data={resumeData} styleConfig={styleConfig} />
        ) : (
          <ModernMinimalTemplate data={resumeData} styleConfig={styleConfig} />
        );

      case "creative-photo":
        return <CreativePhotoTemplate data={resumeData} styleConfig={styleConfig} />;

      case "executive-pro":
        return <ExecutiveProTemplate data={resumeData} styleConfig={styleConfig} />;

      case "tech-focused":
        return <TechFocusedTemplate data={resumeData} styleConfig={styleConfig} />;

      default:
        return (
          <ModernMinimalTemplate data={resumeData} styleConfig={styleConfig} />
        );
    }

  }

  return <div className={className}>{renderTemplate()}</div>
}

function ModernMinimalTemplate({
  data,
  styleConfig,
}: {
  data: any
  styleConfig: any
}) {
  return (
    <Card
      className="shadow-lg py-0"
      style={{
        padding: styleConfig.spacing,
        background: styleConfig.colors.background,
        color: styleConfig.colors.text,
        borderRadius: styleConfig.borderRadius,
        fontFamily: styleConfig.fonts.body,
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${styleConfig.colors.secondary}`,
          paddingBottom: styleConfig.spacing / 1.5,
          marginBottom: styleConfig.spacing,
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: 8,
            color: styleConfig.colors.primary,
            fontFamily: styleConfig.fonts.heading,
          }}
        >
          {data.personal.firstName} {data.personal.lastName}
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 14,
            color: styleConfig.colors.text,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Mail className="w-4 h-4" color={styleConfig.colors.primary} />
            {data.personal.email}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Phone className="w-4 h-4" color={styleConfig.colors.primary} />
            {data.personal.phone}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin className="w-4 h-4" color={styleConfig.colors.primary} />
            {data.personal.location}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.personal.summary && (
        <div style={{ marginBottom: styleConfig.spacing }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: 8,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            Professional Summary
          </h2>
          <p style={{ color: styleConfig.colors.text, lineHeight: 1.6 }}>
            {data.personal.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: styleConfig.spacing }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: 12,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            Experience
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.experience.map((exp: any, index: number) => (
              <div key={index}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 600,
                      color: styleConfig.colors.primary,
                    }}
                  >
                    {exp.position}
                  </h3>
                  <span style={{ fontSize: 13, color: styleConfig.colors.text }}>
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 13,
                    gap: 4,
                    marginBottom: 6,
                    color: styleConfig.colors.secondary,
                  }}
                >
                  <Building className="w-4 h-4" />
                  {exp.company}
                </div>

                <p style={{ fontSize: 14, color: styleConfig.colors.text }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: styleConfig.spacing }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: 12,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            Education
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.education.map((edu: any, index: number) => (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <h3
                      style={{
                        fontWeight: 600,
                        color: styleConfig.colors.primary,
                      }}
                    >
                      {edu.degree} in {edu.field}
                    </h3>
                    <p style={{ fontSize: 14, color: styleConfig.colors.text }}>
                      {edu.school}
                    </p>
                  </div>

                  <span style={{ fontSize: 13, color: styleConfig.colors.text }}>
                    {formatDate(edu.graduationDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: 12,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            Skills
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.skills.map((skill: string, index: number) => (
              <span
                key={index}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: styleConfig.colors.accent + "22",
                  color: styleConfig.colors.primary,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

function ModernMinimalPhotoTemplate({
  data,
  styleConfig,
}: {
  data: any;
  styleConfig: any;
}) {

  // Placeholder image (simple avatar)
  const placeholder =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <Card
      className="shadow-lg py-0"
      style={{
        padding: styleConfig.spacing,
        background: styleConfig.colors.background,
        color: styleConfig.colors.text,
        borderRadius: styleConfig.borderRadius,
        fontFamily: styleConfig.fonts.body,
      }}
    >
      {/* HEADER WITH PHOTO */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: styleConfig.spacing,
          borderBottom: `1px solid ${styleConfig.colors.secondary}`,
          paddingBottom: styleConfig.spacing / 1.2,
          marginBottom: styleConfig.spacing,
        }}
      >
        {/* PHOTO OR PLACEHOLDER */}
        {styleConfig.showPhoto && (
          <img
            src={data.personal.photo || placeholder}
            alt="Profile"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${styleConfig.colors.primary}`,
              opacity: data.personal.photo ? 1 : 0.6,
            }}
          />
        )}

        {/* USER DETAILS */}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: 6,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            {data.personal.firstName} {data.personal.lastName}
          </h1>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              fontSize: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Mail className="w-4 h-4" color={styleConfig.colors.primary} />
              {data.personal.email}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Phone className="w-4 h-4" color={styleConfig.colors.primary} />
              {data.personal.phone}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin className="w-4 h-4" color={styleConfig.colors.primary} />
              {data.personal.location}
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      {data.personal.summary && (
        <div style={{ marginBottom: styleConfig.spacing }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: 8,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            Professional Summary
          </h2>
          <p style={{ lineHeight: 1.6 }}>{data.personal.summary}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: styleConfig.spacing }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: 12,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            Experience
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <strong style={{ color: styleConfig.colors.primary }}>
                    {exp.position}
                  </strong>
                  <span style={{ fontSize: 13 }}>
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    color: styleConfig.colors.secondary,
                    marginBottom: 6,
                  }}
                >
                  <Building className="w-4 h-4" /> {exp.company}
                </div>

                <p style={{ fontSize: 14 }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDUCATION */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: styleConfig.spacing }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: 12,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            Education
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.education.map((edu: any, idx: number) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong style={{ color: styleConfig.colors.primary }}>
                    {edu.degree} in {edu.field}
                  </strong>
                  <p style={{ fontSize: 14 }}>{edu.school}</p>
                </div>

                <span style={{ fontSize: 13 }}>{formatDate(edu.graduationDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SKILLS */}
      {data.skills.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: 12,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            Skills
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.skills.map((skill: string, i: number) => (
              <span
                key={i}
                style={{
                  padding: "6px 12px",
                  background: styleConfig.colors.accent + "22",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  color: styleConfig.colors.primary,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}


function CreativePhotoTemplate({
  data,
  styleConfig,
}: {
  data: any;
  styleConfig: any;
}) {
  // Placeholder avatar
  const placeholder =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <Card
      className="w-full max-w-2xl mx-auto shadow-lg overflow-hidden py-0"
      style={{
        background: styleConfig.colors.background,
        borderRadius: styleConfig.borderRadius,
        fontFamily: styleConfig.fonts.body,
      }}
    >
      <div style={{ display: "flex" }}>
        {/* LEFT SIDEBAR */}
        <div
          style={{
            width: "33%",
            padding: styleConfig.spacing,
            color: "white",
            background: `linear-gradient(to bottom, ${styleConfig.colors.primary}, ${styleConfig.colors.secondary})`,
          }}
        >
          {/* PHOTO AREA */}
          {styleConfig.showPhoto && (
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                overflow: "hidden",
              }}
            >
              <img
                src={data.personal.photo || placeholder}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: data.personal.photo ? 1 : 0.6,
                }}
              />
            </div>
          )}

          {/* NAME */}
          <h1
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 20,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            {data.personal.firstName} {data.personal.lastName}
          </h1>

          {/* CONTACT INFO */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Mail className="w-4 h-4" color="white" />
              <span style={{ fontSize: 12 }}>{data.personal.email}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Phone className="w-4 h-4" color="white" />
              <span style={{ fontSize: 12 }}>{data.personal.phone}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin className="w-4 h-4" color="white" />
              <span style={{ fontSize: 12 }}>{data.personal.location}</span>
            </div>
          </div>

          {/* SKILLS */}
          {data.skills.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3
                style={{
                  fontWeight: 600,
                  marginBottom: 12,
                  fontFamily: styleConfig.fonts.heading,
                }}
              >
                Skills
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.skills.slice(0, 6).map((skill: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 12,
                      background: "rgba(255,255,255,0.22)",
                      padding: "4px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT CONTENT */}
        <div
          style={{
            width: "67%",
            padding: styleConfig.spacing,
            color: styleConfig.colors.text,
            fontFamily: styleConfig.fonts.body,
          }}
        >
          {/* SUMMARY */}
          {data.personal.summary && (
            <div style={{ marginBottom: 20 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 8,
                  color: styleConfig.colors.primary,
                  fontFamily: styleConfig.fonts.heading,
                }}
              >
                About Me
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.6 }}>
                {data.personal.summary}
              </p>
            </div>
          )}

          {/* EXPERIENCE */}
          {data.experience.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 12,
                  color: styleConfig.colors.primary,
                  fontFamily: styleConfig.fonts.heading,
                }}
              >
                Experience
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {data.experience.map((exp: any, index: number) => (
                  <div key={index}>
                    <h3
                      style={{
                        fontWeight: 600,
                        color: styleConfig.colors.primary,
                        fontSize: 14,
                      }}
                    >
                      {exp.position}
                    </h3>
                    <p
                      style={{
                        color: styleConfig.colors.secondary,
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {exp.company}
                    </p>
                    <p style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                    <p style={{ fontSize: 13 }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {data.education.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 12,
                  color: styleConfig.colors.primary,
                  fontFamily: styleConfig.fonts.heading,
                }}
              >
                Education
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {data.education.map((edu: any, index: number) => (
                  <div key={index}>
                    <h3
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: styleConfig.colors.primary,
                      }}
                    >
                      {edu.degree} in {edu.field}
                    </h3>
                    <p
                      style={{
                        color: styleConfig.colors.secondary,
                        fontSize: 13,
                      }}
                    >
                      {edu.school}
                    </p>
                    <p style={{ fontSize: 12, color: "#555" }}>
                      {formatDate(edu.graduationDate)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.customSections &&
  data.customSections.length > 0 &&
  data.customSections.map((section: any) => (
    <div
      key={section.id}
      style={{ marginBottom: styleConfig.spacing }}
    >
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: styleConfig.colors.primary,
          fontFamily: styleConfig.fonts.heading,
        }}
      >
        <div
          style={{
            width: 4,
            height: 24,
            background: styleConfig.colors.accent,
            borderRadius: 4,
          }}
        ></div>

        {section.title}
      </h2>

      {/* TEXT SECTION */}
      {section.type === "text" && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: styleConfig.colors.text,
            whiteSpace: "pre-line", // preserve line breaks
          }}
        >
          {section.content}
        </p>
      )}

      {/* LIST SECTION */}
      {section.type === "list" && (
        <ul
          style={{
            paddingLeft: 20,
            lineHeight: 1.6,
            color: styleConfig.colors.text,
            fontSize: 14,
          }}
        >
          {section.content
            .split("\n")
            .filter((i: string) => i.trim() !== "")
            .map((item: string, idx: number) => (
              <li key={idx} style={{ marginBottom: 6 }}>
                {item}
              </li>
            ))}
        </ul>
      )}
    </div>
  ))}
        </div>
      </div>
    </Card>
  );
}


function ExecutiveProTemplate({
  data,
  styleConfig,
}: {
  data: any;
  styleConfig: any;
}) {
  const placeholder =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <Card
      className="w-full max-w-2xl mx-auto shadow-lg overflow-hidden"
      style={{
        background: styleConfig.colors.background,
        borderRadius: styleConfig.borderRadius,
        fontFamily: styleConfig.fonts.body,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: styleConfig.spacing,
          paddingBottom: styleConfig.spacing / 1.5,
          borderBottom: `1px solid ${styleConfig.colors.secondary}33`,
          display: "flex",
          alignItems: "center",
          gap: styleConfig.spacing,
        }}
      >
        {/* PHOTO AREA */}
        {styleConfig.showPhoto && (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `${styleConfig.colors.secondary}22`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={data.personal.photo || placeholder}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: data.personal.photo ? 1 : 0.65,
              }}
            />
          </div>
        )}

        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 6,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            {data.personal.firstName} {data.personal.lastName}
          </h1>

          {/* CONTACT GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              fontSize: 14,
              color: styleConfig.colors.text,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Mail className="w-4 h-4" color={styleConfig.colors.primary} />
              {data.personal.email}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Phone className="w-4 h-4" color={styleConfig.colors.primary} />
              {data.personal.phone}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: styleConfig.spacing }}>
        {/* SUMMARY */}
        {data.personal.summary && (
          <div style={{ marginBottom: styleConfig.spacing }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
                color: styleConfig.colors.primary,
                borderBottom: `2px solid ${styleConfig.colors.secondary}55`,
                paddingBottom: 4,
                fontFamily: styleConfig.fonts.heading,
              }}
            >
              Executive Summary
            </h2>
            <p style={{ lineHeight: 1.6, color: styleConfig.colors.text }}>
              {data.personal.summary}
            </p>
          </div>
        )}

        {/* EXPERIENCE */}
        {data.experience.length > 0 && (
          <div style={{ marginBottom: styleConfig.spacing }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 12,
                color: styleConfig.colors.primary,
                borderBottom: `2px solid ${styleConfig.colors.secondary}55`,
                paddingBottom: 4,
                fontFamily: styleConfig.fonts.heading,
              }}
            >
              Professional Experience
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {data.experience.map((exp: any, i: number) => (
                <div
                  key={i}
                  style={{
                    borderLeft: `3px solid ${styleConfig.colors.primary}`,
                    paddingLeft: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: 600,
                        color: styleConfig.colors.primary,
                      }}
                    >
                      {exp.position}
                    </h3>

                    <span
                      style={{
                        fontSize: 12,
                        background: `${styleConfig.colors.secondary}22`,
                        padding: "2px 6px",
                        borderRadius: 4,
                        color: styleConfig.colors.primary,
                        fontWeight: 500,
                      }}
                    >
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>

                  <p
                    style={{
                      fontWeight: 600,
                      color: styleConfig.colors.secondary,
                      marginBottom: 6,
                      fontSize: 14,
                    }}
                  >
                    {exp.company}
                  </p>

                  <p style={{ fontSize: 14, color: styleConfig.colors.text }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TWO COLUMN SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: styleConfig.spacing,
          }}
        >
          {/* EDUCATION */}
          {data.education.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 12,
                  color: styleConfig.colors.primary,
                  borderBottom: `2px solid ${styleConfig.colors.secondary}55`,
                  paddingBottom: 4,
                  fontFamily: styleConfig.fonts.heading,
                }}
              >
                Education
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.education.map((edu: any, i: number) => (
                  <div key={i}>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: styleConfig.colors.primary,
                      }}
                    >
                      {edu.degree}
                    </h3>
                    <p
                      style={{
                        color: styleConfig.colors.secondary,
                        fontSize: 13,
                      }}
                    >
                      {edu.field}
                    </p>
                    <p
                      style={{ fontSize: 12, color: styleConfig.colors.text }}
                    >
                      {edu.school} • {formatDate(edu.graduationDate)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {data.skills.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 12,
                  color: styleConfig.colors.primary,
                  borderBottom: `2px solid ${styleConfig.colors.secondary}55`,
                  paddingBottom: 4,
                  fontFamily: styleConfig.fonts.heading,
                }}
              >
                Core Competencies
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {data.skills.map((skill: string, index: number) => (
                  <div
                    key={index}
                    style={{
                      fontSize: 14,
                      color: styleConfig.colors.text,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        background: styleConfig.colors.primary,
                        borderRadius: "50%",
                        marginRight: 8,
                      }}
                    ></div>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.customSections &&
  data.customSections.length > 0 &&
  data.customSections.map((section: any) => (
    <div
      key={section.id}
      style={{ marginBottom: styleConfig.spacing }}
    >
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: styleConfig.colors.primary,
          fontFamily: styleConfig.fonts.heading,
        }}
      >
        <div
          style={{
            width: 4,
            height: 24,
            background: styleConfig.colors.accent,
            borderRadius: 4,
          }}
        ></div>

        {section.title}
      </h2>

      {/* TEXT SECTION */}
      {section.type === "text" && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: styleConfig.colors.text,
            whiteSpace: "pre-line", // preserve line breaks
          }}
        >
          {section.content}
        </p>
      )}

      {/* LIST SECTION */}
      {section.type === "list" && (
        <ul
          style={{
            paddingLeft: 20,
            lineHeight: 1.6,
            color: styleConfig.colors.text,
            fontSize: 14,
          }}
        >
          {section.content
            .split("\n")
            .filter((i: string) => i.trim() !== "")
            .map((item: string, idx: number) => (
              <li key={idx} style={{ marginBottom: 6 }}>
                {item}
              </li>
            ))}
        </ul>
      )}
    </div>
  ))}
        </div>
      </div>
    </Card>
  );
}


function TechFocusedTemplate({
  data,
  styleConfig,
}: {
  data: any;
  styleConfig: any;
}) {
  const placeholder =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <Card
      className="shadow-lg"
      style={{
        padding: styleConfig.spacing,
        background: styleConfig.colors.background,
        color: styleConfig.colors.text,
        borderRadius: styleConfig.borderRadius,
        fontFamily: styleConfig.fonts.body,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          paddingBottom: styleConfig.spacing,
          borderBottom: `2px solid ${styleConfig.colors.accent}`,
          marginBottom: styleConfig.spacing,
        }}
      >
        {/* Name + Photo Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: styleConfig.spacing,
          }}
        >
          {styleConfig.showPhoto && (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                overflow: "hidden",
                background: styleConfig.colors.accent + "33",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={data.personal.photo || placeholder}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: data.personal.photo ? 1 : 0.7,
                }}
              />
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                marginBottom: 4,
                fontFamily: styleConfig.fonts.heading,
                color: styleConfig.colors.primary,
              }}
            >
              {data.personal.firstName} {data.personal.lastName}
            </h1>

            <p
              style={{
                fontSize: 14,
                opacity: 0.9,
                marginBottom: 8,
              }}
            >
              {data.personal.summary}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                fontSize: 13,
              }}
            >
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <Mail className="w-4 h-4" color={styleConfig.colors.primary} />
                {data.personal.email}
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <Phone className="w-4 h-4" color={styleConfig.colors.primary} />
                {data.personal.phone}
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <MapPin className="w-4 h-4" color={styleConfig.colors.primary} />
                {data.personal.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TECHNICAL SKILLS */}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: styleConfig.spacing }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            <div
              style={{
                width: 4,
                height: 24,
                background: styleConfig.colors.accent,
                borderRadius: 4,
              }}
            ></div>
            Technical Skills
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }}
          >
            {data.skills.map((skill: string, i: number) => (
              <span
                key={i}
                style={{
                  background: styleConfig.colors.accent + "22",
                  color: styleConfig.colors.primary,
                  borderRadius: 6,
                  padding: "6px 8px",
                  fontSize: 13,
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* EXPERIENCE */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: styleConfig.spacing }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            <div
              style={{
                width: 4,
                height: 24,
                background: styleConfig.colors.accent,
                borderRadius: 4,
              }}
            ></div>
            Professional Experience
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.experience.map((exp: any, i: number) => (
              <div
                key={i}
                style={{
                  background: styleConfig.colors.accent + "10",
                  padding: styleConfig.spacing / 1.5,
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontWeight: 600,
                        color: styleConfig.colors.primary,
                      }}
                    >
                      {exp.position}
                    </h3>
                    <p
                      style={{
                        color: styleConfig.colors.secondary,
                        fontWeight: 500,
                      }}
                    >
                      {exp.company}
                    </p>
                  </div>

                  <span
                    style={{
                      fontSize: 12,
                      padding: "2px 8px",
                      borderRadius: 4,
                      border: `1px solid ${styleConfig.colors.primary}55`,
                      color: styleConfig.colors.primary,
                    }}
                  >
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>

                <p style={{ fontSize: 14 }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDUCATION */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: styleConfig.spacing }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: styleConfig.colors.primary,
              fontFamily: styleConfig.fonts.heading,
            }}
          >
            <div
              style={{
                width: 4,
                height: 24,
                background: styleConfig.colors.accent,
                borderRadius: 4,
              }}
            ></div>
            Education
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.education.map((edu: any, idx: number) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <strong style={{ color: styleConfig.colors.primary }}>
                    {edu.degree} in {edu.field}
                  </strong>
                  <p style={{ fontSize: 14 }}>{edu.school}</p>
                </div>

                <span
                  style={{
                    fontSize: 13,
                    background: styleConfig.colors.accent + "22",
                    padding: "4px 8px",
                    borderRadius: 6,
                    color: styleConfig.colors.primary,
                  }}
                >
                  {formatDate(edu.graduationDate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⭐ CUSTOM SECTIONS */}
      {data.customSections &&
        data.customSections.length > 0 &&
        data.customSections.map((section: any) => (
          <div
            key={section.id}
            style={{ marginBottom: styleConfig.spacing }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: styleConfig.colors.primary,
                fontFamily: styleConfig.fonts.heading,
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 24,
                  background: styleConfig.colors.accent,
                  borderRadius: 4,
                }}
              ></div>

              {section.title}
            </h2>

            {/* TEXT SECTION */}
            {section.type === "text" && (
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: styleConfig.colors.text,
                  whiteSpace: "pre-line", // preserve line breaks
                }}
              >
                {section.content}
              </p>
            )}

            {/* LIST SECTION */}
            {section.type === "list" && (
              <ul
                style={{
                  paddingLeft: 20,
                  lineHeight: 1.6,
                  color: styleConfig.colors.text,
                  fontSize: 14,
                }}
              >
                {section.content
                  .split("\n")
                  .filter((i: string) => i.trim() !== "")
                  .map((item: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: 6 }}>
                      {item}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}

    </Card>
  );
}
