import { Link } from "react-router-dom";
import { Briefcase, ExternalLink } from "lucide-react";

const STATUS_STYLES = {
  applied: "bg-muted-foreground/20 text-muted-foreground",
  under_review: "bg-blue-500/20 text-blue-400",
  interview: "bg-amber-500/20 text-amber-400",
  offer: "bg-green-500/20 text-green-400",
  rejected: "bg-destructive/20 text-destructive",
};

export default function ApplicationActivity({ applications }) {
  const list = applications || [];
  const recent = list.slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Application Activity</h2>
        {list.length > 0 && (
          <Link
            to="/dashboard/seeker/applied"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        )}
      </div>
      {recent.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {recent.map((app) => (
            <div
              key={app._id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{app.jobTitle}</p>
                <p className="text-sm text-muted-foreground">{app.company}</p>
                <p className="text-xs text-muted-foreground">
                  Applied {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : ""}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[app.status] || STATUS_STYLES.applied}`}>
                {app.status?.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
