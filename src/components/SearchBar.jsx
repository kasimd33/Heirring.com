import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchBar({ onSearch, redirectTo, compact = true }) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, location });
    } else if (redirectTo) {
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (location) params.set("location", location);
      const qs = params.toString();
      navigate(qs ? `${redirectTo}?${qs}` : redirectTo);
    }
  };

  const containerClass = compact
    ? "flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-card border border-border"
    : "flex flex-col sm:flex-row gap-4 p-6 rounded-xl bg-card border border-border max-w-4xl mx-auto";

  return (
    <form onSubmit={handleSubmit} className={containerClass}>
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Job title, keywords..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full rounded-lg border border-border bg-input py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex-1 relative">
        <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="City or remote"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-lg border border-border bg-input py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <Search className="h-4 w-4" />
        Search Jobs
      </motion.button>
    </form>
  );
}
