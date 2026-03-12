import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";

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
      console.error(err);
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
          body: JSON.stringify({
            candidateName: form.name,
            candidateEmail: form.email,
            notes: form.notes,
          }),
        });
      } else {
        await apiFetch("/applications", {
          method: "POST",
          body: JSON.stringify({
            jobId: id,
            candidateName: form.name,
            candidateEmail: form.email,
            notes: form.notes,
          }),
        });
      }
      alert("Application submitted successfully!");
      navigate(user?.role === "seeker" ? "/dashboard/seeker/applied" : "/jobs");
    } catch (err) {
      alert(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-muted-foreground p-8">Loading...</p>;
  if (!job) return <p className="text-muted-foreground p-8">Job not found</p>;
  if (job.source !== "internal") {
    navigate("/jobs");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-foreground">Apply for {job.title}</h1>
      <p className="mt-1 text-muted-foreground">{job.company}</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Cover letter (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={4}
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : application ? "Update Application" : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
