import { useState, useEffect } from "react";
import { apiFetch } from "../../api/client";
import { Link } from "react-router-dom";
import { Bookmark, MapPin } from "lucide-react";

export default function SavedJobs({ onRefresh }) {
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

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Saved Jobs</h2>
        {saved.length > 0 && (
          <Link to="/dashboard/seeker/jobs" className="text-sm text-primary hover:underline">
            Browse jobs
          </Link>
        )}
      </div>
      {saved.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">No saved jobs yet.</p>
      ) : (
        <div className="space-y-3">
          {saved.slice(0, 5).map((s) => (
            <div
              key={s._id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0 group"
            >
              <Link to="/dashboard/seeker/jobs" className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate group-hover:text-primary">
                  {s.jobId?.title}
                </p>
                <p className="text-sm text-muted-foreground">{s.jobId?.company}</p>
                {s.jobId?.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {s.jobId.location}
                  </p>
                )}
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
