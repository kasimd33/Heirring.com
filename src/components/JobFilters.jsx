import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, Filter } from "lucide-react";

const INDIAN_CITIES = ["", "Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai", "Delhi", "Gurgaon", "Noida"];
const CATEGORIES = ["", "IT Jobs", "Software", "Engineering", "Design", "Data Science", "Marketing", "Sales", "Finance"];

export default function JobFilters({ filters, onFiltersChange, onSubmit }) {
  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Job title, keywords..."
            value={filters.keyword}
            onChange={(e) => onFiltersChange?.({ ...filters, keyword: e.target.value })}
            className="w-full rounded-xl border border-border bg-input py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="relative min-w-[180px]">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={filters.location}
            onChange={(e) => onFiltersChange?.({ ...filters, location: e.target.value })}
            className="w-full rounded-xl border border-border bg-input py-2.5 pl-10 pr-4 text-sm appearance-none focus:border-primary"
          >
            {INDIAN_CITIES.map((c) => (
              <option key={c || "all"} value={c}>{c || "All locations"}</option>
            ))}
          </select>
        </div>
        <select
          value={filters.category}
          onChange={(e) => onFiltersChange?.({ ...filters, category: e.target.value })}
          className="rounded-xl border border-border bg-input px-4 py-2.5 text-sm min-w-[140px] focus:border-primary"
        >
          {CATEGORIES.map((c) => (
            <option key={c || "all"} value={c}>{c || "All categories"}</option>
          ))}
        </select>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Apply
        </motion.button>
      </div>
    </motion.form>
  );
}
