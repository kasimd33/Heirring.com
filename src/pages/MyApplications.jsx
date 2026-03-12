import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import { Search, Filter } from "lucide-react";
import ApplicationCard from "../components/ApplicationCard";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "applied", label: "Applied" },
  { value: "under_review", label: "Under Review" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    status: "",
    keyword: "",
    fromDate: "",
    toDate: "",
  });
  const [searchKey, setSearchKey] = useState(0);

  useEffect(() => {
    loadApplications();
  }, [pagination.page, searchKey]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pagination.page);
      params.set("limit", "12");
      if (filters.status) params.set("status", filters.status);
      if (filters.keyword) params.set("keyword", filters.keyword);
      if (filters.fromDate) params.set("fromDate", filters.fromDate);
      if (filters.toDate) params.set("toDate", filters.toDate);

      const res = await apiFetch(`/applications/me?${params.toString()}`);
      setApplications(res.data ?? []);
      setPagination((p) => ({
        ...p,
        page: res.pagination?.page ?? 1,
        pages: res.pagination?.pages ?? 1,
        total: res.pagination?.total ?? 0,
      }));
    } catch (err) {
      console.error(err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    setSearchKey((k) => k + 1);
  };

  const handleWithdraw = async (id) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await apiFetch(`/applications/${id}`, { method: "DELETE" });
      loadApplications();
    } catch (err) {
      alert(err.message || "Failed to withdraw");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="mt-1 text-muted-foreground">
          Track your application status across all jobs
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Job title or company..."
              value={filters.keyword}
              onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
              className="w-full rounded-lg border border-border bg-input py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground min-w-[140px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
            className="rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground"
            placeholder="From"
          />
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
            className="rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground"
            placeholder="To"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-muted-foreground py-12 text-center">Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No applications yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Apply to jobs from the Jobs page to see them here
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {pagination.total} application{pagination.total !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onWithdraw={handleWithdraw}
                showTimeline={true}
                isRecruiterView={false}
              />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
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
                  setPagination((p) => ({ ...p, page: Math.min(p.pages, p.page + 1) }))
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
