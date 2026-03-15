import { motion } from "framer-motion";
import AnimatedCounter from "./ui/AnimatedCounter";

export default function StatsCounter({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
      {stats.map((stat, i) => {
        const match = (stat.value || "").match(/^([\d.]+)([KM+%]*)$/);
        const num = match ? parseFloat(match[1]) : 0;
        const suffix = match ? match[2] : "";
        const isPercent = suffix.includes("%");

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-center"
          >
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              <AnimatedCounter
                value={stat.value}
                suffix={suffix}
                duration={1.2}
                decimals={isPercent ? 0 : 0}
              />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
