import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

export default function SeekerDashboard() {
  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back! Here's your hiring activity.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Jobs Applied" value="24" icon={FileText} index={0} />
        <DashboardCard title="Saved Jobs" value="18" icon={BookmarkCheck} index={1} />
        <DashboardCard title="Interviews" value="5" icon={Calendar} index={2} />
        <DashboardCard title="Profile Views" value="156" icon={Eye} index={3} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Completion</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" className="text-border" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="71, 100" className="text-primary" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">71%</span>
            </div>
            <div className="space-y-2">
              {profileChecklist.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <span className={item.done ? "text-primary" : "text-muted-foreground"}>{item.done ? "✓" : "○"}</span>
                  <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/dashboard/seeker/profile" className="text-sm font-medium text-primary hover:underline">Complete profile →</Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Interviews</h2>
          <ul className="space-y-4">
            {upcomingInterviews.map((int) => (
              <li key={int.company} className="flex flex-col gap-1 py-3 border-b border-border last:border-0">
                <p className="font-medium text-foreground">{int.company} – {int.round}</p>
                <p className="text-sm text-muted-foreground">{int.date}</p>
              </li>
            ))}
          </ul>
          <Link to="/dashboard/seeker/applied" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">View applications →</Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
          <Link to="/dashboard/seeker/applied" className="text-sm font-medium text-primary hover:underline">View all</Link>
        </div>
        <ul className="space-y-4">
          {recentApps.map((app) => (
            <li key={app.job} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <p className="font-medium text-foreground">{app.job}</p>
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{app.status}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
