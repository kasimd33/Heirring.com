import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import { Link } from "react-router-dom";
import { Bookmark, MapPin, Briefcase } from "lucide-react";

export default function SavedJobsPage() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    try {
      const res = await apiFetch("/profile/saved-jobs");
      setSaved(res.data || []);
    } catch (err) {
      setSaved([]);
    } finally {
      setLoading(false);
    }
  };

  const unsave = async (e, s) => {
    e?.preventDefault?.();
    const jobId = s.jobId?._id ?? s.jobId;
    if (!jobId) return;
    try {
      await apiFetch(`/saved-jobs/${String(jobId)}`, { method: "DELETE" });
      loadSaved();
    } catch (err) {
      alert(err.message || "Failed to remove");
    }
  };

  const getSalary = (job) => job?.salary || job?.salaryRange?.displayText;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saved Jobs</h1>
        <p className="mt-1 text-muted-foreground">
          Jobs you've bookmarked for later
        </p>
      </div>
      {loading ? (
        <p className="text-muted-foreground py-12 text-center">Loading...</p>
      ) : saved.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No saved jobs yet</p>
          <Link
            to="/dashboard/seeker/jobs"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Browse jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {saved.map((s) => (
            <div
              key={s._id}
              className="rounded-xl border border-border bg-card p-6 flex items-start justify-between gap-4"
            >
              <Link to="/dashboard/seeker/jobs" className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground hover:text-primary">
                  {s.jobId?.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{s.jobId?.company}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {s.jobId?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {s.jobId.location}
                    </span>
                  )}
                  {getSalary(s.jobId) && (
                    <span>{getSalary(s.jobId)}</span>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Saved {s.savedDate ? new Date(s.savedDate).toLocaleDateString() : ""}
                </p>
              </Link>
              <button
                type="button"
                onClick={(e) => unsave(e, s)}
                className="p-2 text-primary hover:text-destructive shrink-0"
                title="Remove from saved"
              >
                <Bookmark className="h-5 w-5 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
