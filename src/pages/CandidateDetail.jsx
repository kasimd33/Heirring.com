import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Calendar } from "lucide-react";

const mockCandidate = {
  id: 1,
  name: "Sarah Mitchell",
  title: "Senior Frontend Engineer",
  location: "San Francisco, CA",
  experience: "5 years",
  bio: "Passionate about building scalable web applications with React and TypeScript. Experienced in leading cross-functional teams and shipping products used by millions.",
  skills: [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "AWS", level: 70 },
  ],
  email: "sarah.mitchell@email.com",
  phone: "+1 (555) 123-4567",
  linkedin: "linkedin.com/in/sarahmitchell",
  experienceList: [
    {
      company: "TechCorp",
      role: "Senior Frontend Engineer",
      period: "2020 - Present",
      description: "Led frontend architecture for main product. Reduced bundle size by 40%.",
    },
    {
      company: "StartupXYZ",
      role: "Frontend Engineer",
      period: "2018 - 2020",
      description: "Built responsive web apps used by 100k+ users.",
    },
  ],
  education: [
    { degree: "B.S. Computer Science", school: "Stanford University", year: "2018" },
  ],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "AWS", date: "2022" },
  ],
};

export default function CandidateDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-8">
      <Link
        to="/candidates"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Candidates
      </Link>

      {/* Profile Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
              SM
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{mockCandidate.name}</h1>
              <p className="text-muted-foreground">{mockCandidate.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {mockCandidate.location} · {mockCandidate.experience} experience
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card">
              <Download className="h-4 w-4" />
              Download CV
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Calendar className="h-4 w-4" />
              Schedule Interview
            </button>
          </div>
        </div>
      </div>

      {/* Three column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">About</h3>
          <p className="mt-3 text-sm text-muted-foreground">{mockCandidate.bio}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">Skills</h3>
          <div className="mt-4 space-y-3">
            {mockCandidate.skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-input overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Email: {mockCandidate.email}</li>
            <li>Phone: {mockCandidate.phone}</li>
            <li>
              <a href="#" className="text-primary hover:underline">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Experience & Education */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">Experience</h3>
          <ul className="mt-4 space-y-4">
            {mockCandidate.experienceList.map((exp) => (
              <li key={exp.company} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <p className="font-medium text-foreground">{exp.role} · {exp.company}</p>
                <p className="text-sm text-muted-foreground">{exp.period}</p>
                <p className="mt-1 text-sm text-muted-foreground">{exp.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">Education</h3>
          <ul className="mt-4 space-y-4">
            {mockCandidate.education.map((edu) => (
              <li key={edu.school}>
                <p className="font-medium text-foreground">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">{edu.school} · {edu.year}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Certifications */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground">Certifications</h3>
        <ul className="mt-4 space-y-2">
          {mockCandidate.certifications.map((cert) => (
            <li key={cert.name} className="text-sm text-muted-foreground">
              {cert.name} · {cert.issuer} ({cert.date})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
