import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";
import {
  Briefcase,
  MapPin,
  Bookmark,
  ExternalLink,
  Sparkles,
  Filter,
} from "lucide-react";

const LOCATIONS = ["", "Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai", "Delhi", "Gurgaon", "Noida"];
const JOB_TYPES = ["", "full-time", "part-time", "contract", "internship", "permanent"];
const MATCH_THRESHOLDS = ["", "50", "60", "70", "80", "90"];

export default function RecommendedJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSeeker = user?.role === "seeker";
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    minMatchScore: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadRecommended();
  }, [filters.location, filters.jobType, filters.minMatchScore]);

  useEffect(() => {
    if (!isSeeker) return;
    apiFetch("/profile/saved-jobs")
      .then((res) => {
        const ids = new Set(
          (res.data || [])
            .map((s) => {
              const id = s.jobId?._id ?? s.jobId;
              return id ? String(id) : null;
            })
            .filter(Boolean)
        );
        setSavedJobIds(ids);
      })
      .catch(() => setSavedJobIds(new Set()));
  }, [isSeeker]);

  const loadRecommended = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.location) params.set("location", filters.location);
      if (filters.jobType) params.set("jobType", filters.jobType);
      if (filters.minMatchScore) params.set("minMatchScore", filters.minMatchScore);
      const res = await apiFetch(`/jobs/recommended?${params.toString()}`);
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (e, jobId) => {
    e?.stopPropagation?.();
    if (!isSeeker) return;
    const id = String(jobId);
    try {
      if (savedJobIds.has(id)) {
        await apiFetch(`/saved-jobs/${id}`, { method: "DELETE" });
        setSavedJobIds((s) => {
          const next = new Set(s);
          next.delete(id);
          return next;
        });
      } else {
        await apiFetch("/saved-jobs", {
          method: "POST",
          body: JSON.stringify({ jobId: id }),
        });
        setSavedJobIds((s) => new Set([...s, id]));
      }
    } catch (err) {
      alert(err.message || "Failed to update saved job");
    }
  };

  const handleApply = async (job) => {
    setApplying(job._id);
    try {
      const res = await apiFetch("/applications", {
        method: "POST",
        body: JSON.stringify({ jobId: job._id }),
      });
      if (job.source === "adzuna" || job.source === "external") {
        if (job.externalApplyLink) {
          window.open(job.externalApplyLink, "_blank");
        } else {
          alert("No external apply link available.");
        }
      } else {
        navigate(`/apply/${job._id}`);
      }
    } catch (err) {
      alert(err.message || "Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  const getSourceBadge = (source) => {
    const styles = {
      internal: "bg-primary/20 text-primary",
      adzuna: "bg-blue-500/20 text-blue-400",
      external: "bg-amber-500/20 text-amber-400",
    };
    return (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          styles[source] || styles.external
        }`}
      >
        {source === "internal" ? "Platform" : "Adzuna"}
      </span>
    );
  };

  const getMatchColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-amber-400";
    return "text-muted-foreground";
  };

  if (!isSeeker) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Recommended jobs are available for job seekers. Log in as a seeker to see your matches.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          Recommended for You
        </h1>
        <p className="mt-1 text-muted-foreground">
          Jobs matched to your profile, skills, and preferences
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
        {showFilters && (
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.location}
              onChange={(e) =>
                setFilters((f) => ({ ...f, location: e.target.value }))
              }
              className="rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc || "all"} value={loc}>
                  {loc || "All locations"}
                </option>
              ))}
            </select>
            <select
              value={filters.jobType}
              onChange={(e) =>
                setFilters((f) => ({ ...f, jobType: e.target.value }))
              }
              className="rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground"
            >
              {JOB_TYPES.map((jt) => (
                <option key={jt || "all"} value={jt}>
                  {jt ? jt.charAt(0).toUpperCase() + jt.slice(1) : "All types"}
                </option>
              ))}
            </select>
            <select
              value={filters.minMatchScore}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minMatchScore: e.target.value }))
              }
              className="rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground"
            >
              {MATCH_THRESHOLDS.map((m) => (
                <option key={m || "any"} value={m}>
                  {m ? `Match ≥ ${m}%` : "Any match"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          Loading recommendations...
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No recommended jobs yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Update your profile with skills, experience, and preferences to get personalized recommendations.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/seeker/profile")}
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Update Profile
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} matched
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors flex flex-col"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getSourceBadge(job.source)}
                    <span
                      className={`font-semibold text-sm ${getMatchColor(
                        job.matchScore || 0
                      )}`}
                    >
                      {job.matchScore || 0}% match
                    </span>
                    {isSeeker && (
                      <button
                        type="button"
                        onClick={(e) => handleSaveJob(e, job._id)}
                        className={`p-1 hover:text-primary ${
                          savedJobIds.has(String(job._id))
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                        aria-label={
                          savedJobIds.has(String(job._id))
                            ? "Unsave job"
                            : "Save job"
                        }
                      >
                        <Bookmark
                          className={`h-5 w-5 ${
                            savedJobIds.has(String(job._id))
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                </div>
                {(job.salary || job.salaryRange?.displayText) && (
                  <p className="mt-2 text-sm font-medium text-primary">
                    {job.salary || job.salaryRange?.displayText}
                  </p>
                )}
                {(job.skills?.length > 0 || job.requiredSkills?.length > 0) && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(job.skills || job.requiredSkills)
                      .slice(0, 3)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleApply(job)}
                  disabled={applying === job._id}
                  className="mt-4 w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {applying === job._id ? (
                    "Applying..."
                  ) : (job.source === "adzuna" ||
                      job.source === "external") &&
                    job.externalApplyLink ? (
                    <>
                      Apply on External Site
                      <ExternalLink className="h-4 w-4" />
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
