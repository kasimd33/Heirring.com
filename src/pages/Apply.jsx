import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", notes: "" });

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        apiFetch(`/jobs/${id}`),
        apiFetch(`/applications/me?jobId=${id}&limit=1`),
      ]);
      setJob(jobRes.data);
      const app = appsRes.data?.[0] || null;
      setApplication(app);
      if (app) {
        setForm({
          name: app.userId?.name || "",
          email: app.userId?.email || "",
          notes: app.notes || "",
        });
      }
    } catch (err) {
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job || job.source !== "internal") return;
    setSubmitting(true);
    try {
      if (application) {
        await apiFetch(`/applications/${application._id}`, {
          method: "PUT",
          body: JSON.stringify({ candidateName: form.name, candidateEmail: form.email, notes: form.notes }),
        });
      } else {
        await apiFetch("/applications", {
          method: "POST",
          body: JSON.stringify({ jobId: id, candidateName: form.name, candidateEmail: form.email, notes: form.notes }),
        });
      }
      alert("Application submitted successfully!");
      navigate(user?.role === "seeker" ? "/dashboard/seeker/applied" : "/dashboard/seeker/jobs");
    } catch (err) {
      alert(err.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="h-8 w-48 bg-muted rounded-xl animate-pulse" />
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-muted rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!job) return <p className="text-muted-foreground p-8">Job not found</p>;
  if (job.source !== "internal") {
    navigate("/dashboard/seeker/jobs");
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <Link to={`/jobs/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to job
      </Link>

      <h1 className="text-2xl font-bold text-foreground">Apply for {job.title}</h1>
      <p className="mt-1 text-muted-foreground">{job.company}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="w-full rounded-xl border border-border bg-input px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            className="w-full rounded-xl border border-border bg-input px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Cover letter (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={4}
            className="w-full rounded-xl border border-border bg-input px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Submitting..." : application ? "Update Application" : "Submit Application"}
        </motion.button>
      </form>
    </motion.div>
  );
}
