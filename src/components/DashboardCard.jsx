import { motion } from "framer-motion";

export default function DashboardCard({ title, value, icon: Icon, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)" }}
      className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
          {Icon && <Icon className="h-6 w-6" />}
        </div>
      </div>
    </motion.div>
  );
}
