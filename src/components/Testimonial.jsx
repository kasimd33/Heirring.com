import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export default function Testimonial({ quote, author, role, className, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-primary-glow gradient-border transition-all duration-300",
        className
      )}
    >
      <p className="text-muted-foreground">"{quote}"</p>
      <div className="mt-4">
        <p className="font-semibold text-foreground">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </motion.div>
  );
}
