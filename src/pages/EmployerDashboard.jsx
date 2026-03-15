import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

export default function EmployerDashboard() {
  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Your hiring overview at a glance</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Active Jobs" value="12" icon={FileText} index={0} />
        <DashboardCard title="Total Applicants" value="248" icon={Users} index={1} />
        <DashboardCard title="Interviews" value="15" icon={BarChart3} index={2} />
        <DashboardCard title="Profile Views" value="1,429" icon={Eye} index={3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Hiring Pipeline</h2>
        <div className="flex flex-wrap gap-6">
          {pipelineStages.map((item, i) => (
            <div key={item.stage} className="flex items-center gap-2">
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-2xl font-bold text-primary">{item.count}</span>
                <span className="text-sm text-muted-foreground">{item.stage}</span>
              </div>
              {i < pipelineStages.length - 1 && <span className="text-muted-foreground">→</span>}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Jobs</h2>
          <Link to="/dashboard/employer/jobs" className="text-sm font-medium text-primary hover:underline">View all</Link>
        </div>
        <ul className="space-y-4">
          {recentJobs.map((job) => (
            <li key={job.title} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-foreground">{job.title}</p>
                <p className="text-sm text-muted-foreground">{job.company} · {job.applicants} applicants</p>
              </div>
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Shortlisted</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
