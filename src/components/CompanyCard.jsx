import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

export default function CompanyCard({ company }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-primary-glow gradient-border transition-all duration-300"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/20 text-primary">
        <Building2 className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{company.name || company}</h3>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
        {company.description || "Join our growing team"}
      </p>
      <p className="mt-3 text-xs font-medium text-primary">
        {company.jobCount || 0} open positions
      </p>
    </motion.div>
  );
}
