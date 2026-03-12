import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";
import { Search, MapPin, Briefcase, Bookmark, ExternalLink, RefreshCw } from "lucide-react";

const INDIAN_CITIES = [
  "",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Mumbai",
  "Delhi",
  "Gurgaon",
  "Noida",
];

const JOB_CATEGORIES = [
  "",
  "IT Jobs",
  "Software",
  "Engineering",
  "Design",
  "Data Science",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Operations",
];

const KEYWORD_HINTS = [
  "software developer",
  "react developer",
  "backend engineer",
  "data analyst",
];

function ImportJobsButton({ onImport }) {
  const [loading, setLoading] = useState(false);
  const handleImport = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/jobs/import", {
        method: "POST",
        body: JSON.stringify({}),
      });
      alert(`Imported ${res.data.imported} new Indian jobs from Adzuna`);
      onImport?.();
    } catch (err) {
      alert(err.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      type="button"
      onClick={handleImport}
      disabled={loading}
      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Importing..." : "Import India Jobs"}
    </button>
  );
}

export default function Jobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSeeker = user?.role === "seeker";
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
  });
  const [searchKey, setSearchKey] = useState(0);

  useEffect(() => {
    loadJobs();
  }, [pagination.page, searchKey]);

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

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", pagination.page);
      params.set("limit", "12");
      if (filters.keyword) params.set("keyword", filters.keyword);
      if (filters.location) params.set("location", filters.location);
      if (filters.category) params.set("category", filters.category);

      const res = await apiFetch(`/jobs?${params.toString()}`);
      setJobs(res.data ?? []);
      setPagination((p) => ({
        ...p,
        page: res.pagination?.page ?? p.page,
        pages: res.pagination?.pages ?? 1,
        total: res.pagination?.total ?? 0,
      }));
    } catch (err) {
      console.error(err);
      setJobs([]);
      setError(
        err?.message?.toLowerCase().includes("unauthorized") || err?.message?.toLowerCase().includes("token")
          ? "Please log in to view jobs."
          : err?.message || "Could not load jobs. Ensure the backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    setSearchKey((k) => k + 1);
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
      const app = res.data;
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
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[source] || styles.external}`}
      >
        {source === "internal" ? "Platform" : "Adzuna"}
      </span>
    );
  };

  const getSalaryDisplay = (job) => {
    return job.salary || job.salaryRange?.displayText || null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Listings (India)</h1>
        <p className="mt-1 text-muted-foreground">
          Browse tech jobs across major Indian cities
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="e.g. software developer, react developer..."
              value={filters.keyword}
              onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
              className="w-full rounded-lg border border-border bg-input py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              list="keyword-hints"
            />
            <datalist id="keyword-hints">
              {KEYWORD_HINTS.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
          </div>
          <div className="relative min-w-[180px]">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={filters.location}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              className="w-full rounded-lg border border-border bg-input py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none appearance-none"
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c || "all"} value={c}>
                  {c || "All locations"}
                </option>
              ))}
            </select>
          </div>
          <select
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            className="rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none min-w-[140px]"
          >
            {JOB_CATEGORIES.map((c) => (
              <option key={c || "all"} value={c}>
                {c || "All categories"}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
          <ImportJobsButton onImport={loadJobs} />
        </div>
      </form>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          Loading jobs...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
          <p className="font-medium text-amber-400">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check that the backend is running (port 5000) and you are logged in.
          </p>
          <button
            type="button"
            onClick={() => loadJobs()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No jobs found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or import jobs from Adzuna:
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ImportJobsButton onImport={loadJobs} />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Or run <code className="rounded bg-input px-1.5 py-0.5">npm run seed</code> in the backend for sample jobs.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {pagination.total} job{pagination.total !== 1 ? "s" : ""} found
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
                  <div className="flex items-center gap-2">
                    {getSourceBadge(job.source)}
                    {isSeeker && (
                      <button
                        type="button"
                        onClick={(e) => handleSaveJob(e, job._id)}
                        className={`p-1 hover:text-primary ${savedJobIds.has(String(job._id)) ? "text-primary" : "text-muted-foreground"}`}
                        aria-label={savedJobIds.has(String(job._id)) ? "Unsave job" : "Save job"}
                      >
                        <Bookmark className={`h-5 w-5 ${savedJobIds.has(String(job._id)) ? "fill-current" : ""}`} />
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
                {getSalaryDisplay(job) && (
                  <p className="mt-2 text-sm font-medium text-primary">
                    {getSalaryDisplay(job)}
                  </p>
                )}
                {(job.jobCategory || job.category) && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.jobCategory || job.category}
                  </p>
                )}
                {(job.skills?.length > 0 || job.requiredSkills?.length > 0) && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(job.skills || job.requiredSkills).slice(0, 3).map((skill) => (
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
                  ) : (job.source === "adzuna" || job.source === "external") &&
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

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() =>
                  setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
                }
                disabled={pagination.page <= 1}
                className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50 hover:bg-card"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: Math.min(p.pages, p.page + 1),
                  }))
                }
                disabled={pagination.page >= pagination.pages}
                className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50 hover:bg-card"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
