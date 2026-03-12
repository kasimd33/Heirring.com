import { useState, useEffect } from "react";
import { MapPin, Calendar } from "lucide-react";
import ApplicationTimeline from "./ApplicationTimeline";

const STATUS_LABELS = {
  applied: "Applied",
  under_review: "Under Review",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

const STATUS_STYLES = {
  applied: "bg-muted-foreground/20 text-muted-foreground",
  under_review: "bg-blue-500/20 text-blue-400",
  interview: "bg-amber-500/20 text-amber-400",
  offer: "bg-green-500/20 text-green-400",
  rejected: "bg-destructive/20 text-destructive",
};

export default function ApplicationCard({
  application,
  onWithdraw,
  onStatusChange,
  onNotesChange,
  showTimeline = true,
  isRecruiterView = false,
  updating = false,
}) {
  const [notes, setNotes] = useState(application.interviewNotes || "");

  useEffect(() => {
    setNotes(application.interviewNotes || "");
  }, [application.interviewNotes]);

  const statusStyle = STATUS_STYLES[application.status] || STATUS_STYLES.applied;
  const appliedDate = application.appliedDate
    ? new Date(application.appliedDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/20 transition-colors">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h3 className="font-semibold text-foreground text-lg">{application.jobTitle}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{application.company}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {application.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {application.location}
                </span>
              )}
              {appliedDate && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Applied {appliedDate}
                </span>
              )}
            </div>
            <span className={`inline-block mt-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle}`}>
              {STATUS_LABELS[application.status] || application.status}
            </span>
          </div>
          {isRecruiterView && onStatusChange && (
            <div className="shrink-0">
              <select
                value={application.status}
                onChange={(e) => onStatusChange(application._id, e.target.value)}
                disabled={updating}
                className={`rounded-lg border border-border bg-input px-3 py-2 text-sm ${statusStyle}`}
              >
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {showTimeline && application.status !== "rejected" && (
          <div className="pt-2">
            <ApplicationTimeline
              currentStatus={application.status}
              showRejected={application.status === "rejected"}
            />
          </div>
        )}

        {isRecruiterView && (application.notes || application.userId || application.candidateId) && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground font-medium mb-1">Applicant</p>
            <p className="text-sm text-foreground">
              {application.userId?.name || application.candidateId?.name || "—"}
              {application.userId?.email || application.candidateId?.email ? (
                <span className="text-muted-foreground ml-1">
                  ({application.userId?.email || application.candidateId?.email})
                </span>
              ) : null}
            </p>
            {application.notes && (
              <p className="mt-2 text-sm text-muted-foreground">{application.notes}</p>
            )}
          </div>
        )}

        {isRecruiterView && onNotesChange && (
          <div className="pt-2 border-t border-border">
            <label className="text-xs font-medium text-muted-foreground">Interview notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={(e) => {
                const val = e.target.value;
                if (val !== (application.interviewNotes || "")) {
                  onNotesChange(application._id, val);
                }
              }}
              placeholder="Add interview notes..."
              rows={2}
              className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        )}

        {!isRecruiterView && application.status === "applied" && onWithdraw && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onWithdraw(application._id)}
              className="text-xs text-destructive hover:underline"
            >
              Withdraw application
            </button>
          </div>
        )}

        {!isRecruiterView && application.externalApplyLink && (
          <a
            href={application.externalApplyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Open original posting →
          </a>
        )}
      </div>
    </div>
  );
}
