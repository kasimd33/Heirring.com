import DashboardCard from "../components/DashboardCard";
import { FileText, BookmarkCheck, Calendar, Eye } from "lucide-react";

const profileChecklist = [
  { label: "Basic Info", done: true },
  { label: "Experience", done: true },
  { label: "Certifications", done: false },
];

const upcomingInterviews = [
  { company: "TechCorp", round: "Round 2", date: "Tomorrow 10 AM" },
  { company: "StartupXYZ", round: "HR Round", date: "Mar 10, 2:30 PM" },
];

const recentApps = [
  { job: "Senior Frontend Engineer", status: "Reviewing" },
  { job: "Product Designer", status: "Interview" },
  { job: "DevOps Engineer", status: "Applied" },
];

const recommendedJobs = [
  { title: "Full Stack Developer", company: "TechCorp", match: "95%" },
  { title: "React Engineer", company: "DesignCo", match: "88%" },
];

export default function SeekerDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Jobs Applied" value="24" icon={FileText} />
        <DashboardCard title="Saved Jobs" value="18" icon={BookmarkCheck} />
        <DashboardCard title="Interviews" value="5" icon={Calendar} />
        <DashboardCard title="Profile Views" value="156" icon={Eye} />
      </div>

      {/* Profile Completion & Upcoming Interviews */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Completion</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-border"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="71, 100"
                  className="text-primary"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">71%</span>
            </div>
            <div className="space-y-2">
              {profileChecklist.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  {item.done ? (
                    <span className="text-primary">✓</span>
                  ) : (
                    <span className="text-muted-foreground">✗</span>
                  )}
                  <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Interviews</h2>
          <ul className="space-y-4">
            {upcomingInterviews.map((int) => (
              <li key={int.company} className="flex flex-col gap-1 py-3 border-b border-border last:border-0">
                <p className="font-medium text-foreground">{int.company} - {int.round}</p>
                <p className="text-sm text-muted-foreground">{int.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Applications & Recommended Jobs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
            <span className="text-sm text-primary hover:underline cursor-pointer">View all</span>
          </div>
          <ul className="space-y-4">
            {recentApps.map((app) => (
              <li key={app.job} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <p className="font-medium text-foreground">{app.job}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">{app.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recommended Jobs</h2>
            <span className="text-sm text-primary hover:underline cursor-pointer">View all</span>
          </div>
          <ul className="space-y-4">
            {recommendedJobs.map((job) => (
              <li key={job.title} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.company} · {job.match} match</p>
                </div>
                <button className="text-sm font-medium text-primary hover:underline">Apply Now</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
