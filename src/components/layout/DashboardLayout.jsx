import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout({ children, role = "employer" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <button
        type="button"
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-lg bg-card border border-border text-foreground"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <DashboardHeader role={role} />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
