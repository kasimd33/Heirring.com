import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";
import JobFilters from "../components/JobFilters";
import JobCard from "../components/JobCard";
import { JobCardSkeleton } from "../components/ui/Skeleton";
import { Briefcase } from "lucide-react";

function ImportJobsButton({ onImport }) {
  const [loading, setLoading] = useState(false);
  const handleImport = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/jobs/import", { method: "POST", body: JSON.stringify({}) });
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
      className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted flex items-center gap-2 disabled:opacity-50"
    >
      {loading ? "Importing..." : "Import Jobs"}
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
  const [filters, setFilters] = useState({ keyword: "", location: "", category: "" });
  const [searchKey, setSearchKey] = useState(0);

  useEffect(() => loadJobs(), [pagination.page, searchKey]);

  useEffect(() => {
    if (!isSeeker) return;
    apiFetch("/profile/saved-jobs")
      .then((res) => {
        const ids = new Set((res.data || []).map((s) => (s.jobId?._id ?? s.jobId)?.toString()).filter(Boolean));
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
      setPagination((p) => ({ ...p, page: res.pagination?.page ?? p.page, pages: res.pagination?.pages ?? 1, total: res.pagination?.total ?? 0 }));
    } catch (err) {
      setJobs([]);
      setError(err?.message || "Could not load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((p) => ({ ...p, page: 1 }));
    setSearchKey((k) => k + 1);
  };

  const handleSaveJob = async (jobId) => {
    if (!isSeeker) return;
    const id = String(jobId);
    try {
      if (savedJobIds.has(id)) {
        await apiFetch(`/saved-jobs/${id}`, { method: "DELETE" });
        setSavedJobIds((s) => { const n = new Set(s); n.delete(id); return n; });
      } else {
        await apiFetch("/saved-jobs", { method: "POST", body: JSON.stringify({ jobId: id }) });
        setSavedJobIds((s) => new Set([...s, id]));
      }
    } catch (err) {
      alert(err.message || "Failed");
    }
  };

  const handleApply = async (job) => {
    setApplying(job._id);
    try {
      const res = await apiFetch("/applications", { method: "POST", body: JSON.stringify({ jobId: job._id }) });
      if (job.source === "adzuna" || job.source === "external") {
        if (job.externalApplyLink) window.open(job.externalApplyLink, "_blank");
        else alert("No external link.");
      } else {
        navigate(`/apply/${job._id}`);
      }
    } catch (err) {
      alert(err.message || "Failed");
    } finally {
      setApplying(null);
    }
  };

  const getSourceBadge = (source) => {
    const c = source === "internal" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent";
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c}`}>{source === "internal" ? "Platform" : "Adzuna"}</span>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Listings</h1>
        <p className="mt-1 text-muted-foreground">Browse tech jobs across India</p>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <JobFilters filters={filters} onFiltersChange={setFilters} onSubmit={handleSearch} />
        <ImportJobsButton onImport={loadJobs} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
          <p className="font-medium text-amber-700">{error}</p>
          <button onClick={loadJobs} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">Retry</button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No jobs found</p>
          <ImportJobsButton onImport={loadJobs} />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{pagination.total} jobs found</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={savedJobIds.has(String(job._id))}
                onSave={handleSaveJob}
                onApply={handleApply}
                applying={applying === job._id}
                isSeeker={isSeeker}
                sourceBadge={getSourceBadge(job.source)}
              />
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={pagination.page <= 1} className="rounded-xl border border-border px-4 py-2 text-sm disabled:opacity-50 hover:bg-muted">Previous</button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">Page {pagination.page} of {pagination.pages}</span>
              <button onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.pages, p.page + 1) }))} disabled={pagination.page >= pagination.pages} className="rounded-xl border border-border px-4 py-2 text-sm disabled:opacity-50 hover:bg-muted">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
