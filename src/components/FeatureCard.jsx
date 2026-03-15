import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export default function FeatureCard({ icon: Icon, title, description, className, index = 0 }) {
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
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-card text-primary">
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
