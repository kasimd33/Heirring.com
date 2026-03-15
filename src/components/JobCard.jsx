import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Bookmark, ExternalLink } from "lucide-react";
import { cn } from "../utils/cn";

export default function JobCard({
  job,
  isSaved = false,
  onSave,
  onApply,
  applying = false,
  isSeeker = false,
  sourceBadge,
}) {
  const salary = job.salary || job.salaryRange?.displayText;
  const skills = job.skills || job.requiredSkills || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2 }}
      className="group rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-primary-glow gradient-border overflow-hidden transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <Briefcase className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2">
          {sourceBadge}
          {isSeeker && onSave && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSave?.(job._id);
              }}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                isSaved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
              aria-label={isSaved ? "Unsave" : "Save job"}
            >
              <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
            </button>
          )}
        </div>
      </div>

      <Link to={`/jobs/${job._id}`} className="block mt-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {job.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
      </Link>

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {job.location || "Remote"}
        </span>
      </div>

      {salary && (
        <p className="mt-2 text-sm font-semibold text-primary">{salary}</p>
      )}

      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-border">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onApply?.(job);
          }}
          disabled={applying}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {applying ? (
            "Applying..."
          ) : (job.source === "adzuna" || job.source === "external") && job.externalApplyLink ? (
            <>
              Apply on External Site
              <ExternalLink className="h-4 w-4" />
            </>
          ) : (
            "Apply Now"
          )}
        </button>
      </div>
    </motion.div>
  );
}
