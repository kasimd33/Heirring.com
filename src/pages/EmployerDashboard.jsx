import DashboardCard from "../components/DashboardCard";
import { BarChart3, FileText, Users, Eye } from "lucide-react";

const pipelineStages = [
  { stage: "New", count: 45 },
  { stage: "Screening", count: 28 },
  { stage: "Interview", count: 15 },
  { stage: "Offer", count: 5 },
];

const recentJobs = [
  { title: "Senior Frontend Engineer", company: "TechCorp", applicants: 24 },
  { title: "Product Designer", company: "DesignCo", applicants: 18 },
  { title: "DevOps Engineer", company: "CloudInc", applicants: 12 },
];

const topCandidates = [
  { name: "Sarah M.", match: "94%" },
  { name: "James K.", match: "91%" },
];

export default function EmployerDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Active Jobs"
          value="12"
          icon={FileText}
        />
        <DashboardCard
          title="Total Applicants"
          value="248"
          icon={Users}
        />
        <DashboardCard
          title="Interviews Scheduled"
          value="15"
          icon={BarChart3}
        />
        <DashboardCard
          title="Profile Views"
          value="1,429"
          icon={Eye}
        />
      </div>

      {/* Hiring Pipeline */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Hiring Pipeline</h2>
        <div className="flex flex-wrap gap-4">
          {pipelineStages.map((item, i) => (
            <div key={item.stage} className="flex items-center gap-2">
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-2xl font-bold text-primary">{item.count}</span>
                <span className="text-sm text-muted-foreground">{item.stage}</span>
              </div>
              {i < pipelineStages.length - 1 && (
                <span className="text-muted-foreground">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Jobs & Top Candidates */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Jobs</h2>
            <span className="text-sm text-primary hover:underline cursor-pointer">View all</span>
          </div>
          <ul className="space-y-4">
            {recentJobs.map((job) => (
              <li key={job.title} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.company} · {job.applicants} applicants</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">Shortlisted</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Top Candidates</h2>
            <span className="text-sm text-primary hover:underline cursor-pointer">View all</span>
          </div>
          <ul className="space-y-4">
            {topCandidates.map((c) => (
              <li key={c.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <p className="font-medium text-foreground">{c.name}</p>
                <span className="text-sm font-medium text-primary">{c.match} match</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
