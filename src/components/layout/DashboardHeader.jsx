import { Search, Bell, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardHeader({ role = "employer" }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 py-3 md:px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder={role === "employer" ? "Search jobs, candidates..." : "Search jobs..."}
          className="w-full rounded-lg border border-border bg-input py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex items-center gap-2">
        {role === "employer" && (
          <Link to="/dashboard/employer/jobs" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Post Job</span>
          </Link>
        )}
        {role === "seeker" && (
          <Link to="/dashboard/seeker/profile" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-card transition-colors">
            Edit Profile
          </Link>
        )}
        <Link to={role === "employer" ? "/dashboard/employer/messages" : "/dashboard/seeker/messages"} className="relative p-2 rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-colors" aria-label="Messages">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Link>
      </div>
    </header>
  );
}
