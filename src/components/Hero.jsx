import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import StatsCounter from "./StatsCounter";
import SearchBar from "./SearchBar";

const stats = [
  { value: "50K+", label: "Active Job Seekers" },
  { value: "2M+", label: "Jobs Posted" },
  { value: "10K+", label: "Companies" },
  { value: "95%", label: "Success Rate" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.08),transparent)]" />
      {/* Floating orbs */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-32 left-[15%] w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none [animation-delay:1s] animate-float" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6"
          >
            <Briefcase className="h-4 w-4" />
            India&apos;s #1 Job Portal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Find your dream{" "}
            <span className="text-primary">job</span>{" "}
            today
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto"
          >
            Connect with top employers. Browse thousands of jobs across tech, finance, design, and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <SearchBar redirectTo="/browse-jobs" compact={false} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-primary-glow transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/browse-jobs"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-8 py-3 text-base font-medium text-foreground hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Browse Jobs
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-20"
          >
            <StatsCounter stats={stats} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
