import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Building2, ArrowLeft, ExternalLink } from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (id) {
      apiFetch(`/jobs/${id}`)
        .then((res) => setJob(res.data))
        .catch(() => setJob(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setApplying(true);
    try {
      await apiFetch("/applications", { method: "POST", body: JSON.stringify({ jobId: id }) });
      if (job?.source === "adzuna" || job?.source === "external") {
        if (job.externalApplyLink) window.open(job.externalApplyLink, "_blank");
      } else {
        navigate(`/apply/${id}`);
      }
    } catch (e) {
      alert(e.message || "Failed");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="h-8 w-48 bg-muted rounded-xl animate-pulse" />
          <div className="mt-4 h-4 w-32 bg-muted rounded animate-pulse" />
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Job not found</p>
          <Link to="/browse-jobs" className="mt-4 inline-block text-primary font-medium">Back to jobs</Link>
        </div>
      </div>
    );
  }

  const salary = job.salary || job.salaryRange?.displayText;
  const skills = job.skills || job.requiredSkills || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-8 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Link to="/browse-jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to jobs
            </Link>

            <div className="rounded-xl border border-border bg-card p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Briefcase className="h-7 w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
                  <p className="mt-1 text-lg text-muted-foreground">{job.company}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {job.location || "Remote"}
                    </span>
                    {(job.jobCategory || job.category) && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        {job.jobCategory || job.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {salary && (
                <p className="mt-6 text-lg font-semibold text-primary">{salary}</p>
              )}

              {job.description && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-foreground">Job Description</h2>
                  <p className="mt-3 text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                </div>
              )}

              {skills.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-foreground">Skills</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill} className="rounded-lg bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-border">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full sm:w-auto rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {applying ? "Applying..." : (job.source === "adzuna" || job.source === "external") && job.externalApplyLink ? (
                    <>Apply on External Site <ExternalLink className="h-5 w-5" /></>
                  ) : (
                    "Apply Now"
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
