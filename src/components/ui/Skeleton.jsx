import { motion } from "framer-motion";

export function Skeleton({ className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={`relative overflow-hidden rounded-lg bg-muted ${className}`}
    >
      <span
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.8s ease-in-out infinite",
        }}
      />
    </motion.div>
  );
}

export function JobCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-border bg-card p-6 overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-6 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </motion.div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </div>
  );
}
