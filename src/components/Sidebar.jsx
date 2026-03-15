import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Building2,
  MessageSquare,
  Settings,
  Search,
  Send,
  BookmarkCheck,
  Calendar,
  UserCircle,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "../utils/cn";

const employerNav = [
  { to: "/dashboard/employer", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/employer/jobs", label: "Job Listings", icon: FileText },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/dashboard/employer/applications", label: "Applications", icon: Briefcase },
  { to: "/dashboard/employer/company", label: "Company", icon: Building2 },
  { to: "/dashboard/employer/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/employer/settings", label: "Settings", icon: Settings },
];

const seekerNav = [
  { to: "/dashboard/seeker", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/seeker/recommended", label: "Recommended", icon: Sparkles },
  { to: "/dashboard/seeker/jobs", label: "Find Jobs", icon: Search },
  { to: "/dashboard/seeker/applied", label: "Applications", icon: Send },
  { to: "/dashboard/seeker/saved", label: "Saved Jobs", icon: BookmarkCheck },
  { to: "/dashboard/seeker/interviews", label: "Interviews", icon: Calendar },
  { to: "/dashboard/seeker/profile", label: "My Profile", icon: UserCircle },
  { to: "/dashboard/seeker/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/seeker/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ role = "employer", isOpen, onClose }) {
  const navItems = role === "employer" ? employerNav : seekerNav;

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-neutral-200 bg-sidebar transition-transform duration-200",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-neutral-900">Heirring.com</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">✓</span>
          </Link>
          <button type="button" className="md:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {role === "employer" ? "Employer" : "Job Seeker"}
          </p>
          <nav className="space-y-1 px-3">
            {navItems.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.endsWith("/employer") || item.to.endsWith("/seeker")}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
