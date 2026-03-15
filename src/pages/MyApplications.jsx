import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import { motion } from "framer-motion";
import { Search, FileText } from "lucide-react";
import ApplicationCard from "../components/ApplicationCard";
import { JobCardSkeleton } from "../components/ui/Skeleton";

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
  const [filters, setFilters] = useState({ status: "", keyword: "", fromDate: "", toDate: "" });
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
    } catch {
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
    if (!confirm("Withdraw this application?")) return;
    try {
      await apiFetch(`/applications/${id}`, { method: "DELETE" });
      loadApplications();
    } catch (err) {
      alert(err.message || "Failed");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Application Status</h1>
        <p className="mt-1 text-muted-foreground">Track your application status across all jobs</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        onSubmit={handleSearch}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Job title or company..."
              value={filters.keyword}
              onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
              className="w-full rounded-xl border border-border bg-input py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="rounded-xl border border-border bg-input px-4 py-2.5 text-sm min-w-[140px] focus:border-primary"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
            className="rounded-xl border border-border bg-input px-4 py-2.5 text-sm"
          />
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
            className="rounded-xl border border-border bg-input px-4 py-2.5 text-sm"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white"
          >
            Search
          </motion.button>
        </div>
      </motion.form>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6">
              <div className="h-6 w-3/4 bg-muted rounded-lg animate-pulse" />
              <div className="mt-2 h-4 w-1/2 bg-muted rounded animate-pulse" />
              <div className="mt-4 h-4 w-1/3 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-border bg-card p-16 text-center"
        >
          <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-foreground">No applications yet</p>
          <p className="mt-2 text-muted-foreground">Apply to jobs from the Jobs page to see them here</p>
        </motion.div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{pagination.total} application{pagination.total !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onWithdraw={handleWithdraw}
                showTimeline
                isRecruiterView={false}
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
