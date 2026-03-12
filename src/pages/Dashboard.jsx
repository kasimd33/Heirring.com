import { Link } from "react-router-dom";
import { Building2, User } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Link to="/" className="flex items-center gap-2 mb-12">
        <span className="text-2xl font-bold text-foreground">Heirring.com</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
          <span className="text-xs text-primary-foreground">✓</span>
        </span>
      </Link>

      <h1 className="text-2xl font-semibold text-foreground mb-8 text-center">
        Choose how you want to use Heirring.com
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-2xl w-full">
        <Link
          to="/dashboard/employer"
          className="group rounded-xl border-2 border-border bg-card p-8 hover:border-primary transition-colors"
        >
          <Building2 className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Employer</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Post jobs</li>
            <li>• Find talent</li>
            <li>• Track hiring</li>
          </ul>
          <span className="mt-6 inline-flex items-center text-sm font-medium text-primary group-hover:underline">
            Continue →
          </span>
        </Link>

        <Link
          to="/dashboard/seeker"
          className="group rounded-xl border-2 border-border bg-card p-8 hover:border-primary transition-colors"
        >
          <User className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Job Seeker</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Find jobs</li>
            <li>• Get matched</li>
            <li>• Track applications</li>
          </ul>
          <span className="mt-6 inline-flex items-center text-sm font-medium text-primary group-hover:underline">
            Continue →
          </span>
        </Link>
      </div>
    </div>
  );
}
