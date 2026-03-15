import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import JobFilters from "../components/JobFilters";
import JobCard from "../components/JobCard";
import { JobCardSkeleton } from "../components/ui/Skeleton";
import FadeInSection from "../components/ui/FadeInSection";
import { StaggerChildren } from "../components/ui/ScrollReveal";
import { Briefcase } from "lucide-react";

export default function BrowseJobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    category: "",
  });
  const [searchKey, setSearchKey] = useState(0);

  const isSeeker = user?.role === "seeker";

  useEffect(() => {
    loadJobs();
  }, [pagination.page, searchKey]);

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
    } catch {
      setJobs([]);
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
    } catch (e) {
      alert(e.message || "Failed");
    }
  };

  const handleApply = async (job) => {
    setApplying(job._id);
    try {
      const res = await apiFetch("/applications", { method: "POST", body: JSON.stringify({ jobId: job._id }) });
      if (job.source === "adzuna" || job.source === "external") {
        if (job.externalApplyLink) window.open(job.externalApplyLink, "_blank");
        else alert("No external apply link.");
      } else {
        navigate(`/apply/${job._id}`);
      }
    } catch (e) {
      if (e?.message?.toLowerCase().includes("login")) navigate("/login");
      else alert(e.message || "Failed");
    } finally {
      setApplying(null);
    }
  };

  const getSourceBadge = (source) => {
    const c = source === "internal" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent";
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c}`}>{source === "internal" ? "Platform" : "Adzuna"}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-8 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <h1 className="text-3xl font-bold text-foreground">Find Your Next Role</h1>
            <p className="mt-2 text-muted-foreground">Browse thousands of jobs across India</p>
            <div className="mt-8">
              <SearchBar
                onSearch={({ keyword, location }) => {
                  setFilters((f) => ({ ...f, keyword, location }));
                  setPagination((p) => ({ ...p, page: 1 }));
                  setSearchKey((k) => k + 1);
                }}
                compact={false}
              />
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1} className="mt-10">
            <JobFilters filters={filters} onFiltersChange={setFilters} onSubmit={handleSearch} />
          </FadeInSection>

          <div className="mt-10">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-16 text-center">
                <Briefcase className="mx-auto h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-foreground">No jobs found</p>
                <p className="mt-2 text-muted-foreground">Try adjusting your filters</p>
                <button onClick={loadJobs} className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white">Retry</button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">{pagination.total} jobs found</p>
                <StaggerChildren className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.05}>
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      isSaved={savedJobIds.has(String(job._id))}
                      onSave={handleSaveJob}
                      onApply={user ? handleApply : () => navigate("/login")}
                      applying={applying === job._id}
                      isSeeker={isSeeker}
                      sourceBadge={getSourceBadge(job.source)}
                    />
                  ))}
                </StaggerChildren>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
