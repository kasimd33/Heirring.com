import { Search } from "lucide-react";

const mockCandidates = [
  {
    id: 1,
    name: "Sarah Mitchell",
    title: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    experience: "5 years",
    skills: ["React", "TypeScript", "Node.js"],
    match: "94%",
    available: true,
  },
  {
    id: 2,
    name: "James Kim",
    title: "Product Designer",
    location: "New York, NY",
    experience: "7 years",
    skills: ["Figma", "UX Research", "Prototyping"],
    match: "91%",
    available: true,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "DevOps Engineer",
    location: "Remote",
    experience: "4 years",
    skills: ["AWS", "Kubernetes", "Terraform"],
    match: "88%",
    available: false,
  },
];

export default function Candidates() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Candidates</h1>
        <p className="mt-1 text-muted-foreground">Browse and filter candidates for your open roles</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search candidates..."
            className="w-full rounded-lg border border-border bg-input py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select className="rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
          <option>Experience</option>
        </select>
        <select className="rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
          <option>Skill</option>
        </select>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xl font-semibold text-primary">
                {candidate.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{candidate.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {candidate.location} · {candidate.experience}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">{candidate.match} match</span>
                  <span
                    className={`text-xs ${candidate.available ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {candidate.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    View Profile
                  </button>
                  <button className="rounded-lg border border-border py-2 px-3 text-sm font-medium text-foreground hover:bg-card">
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
