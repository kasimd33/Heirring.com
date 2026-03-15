import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px", amount: 0.2 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function ScrollReveal({ children, className = "", delay = 0, stagger = 0 }) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: typeof stagger === "number" ? delay : stagger }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChildren({ children, className = "", staggerDelay = 0.05 }) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={child?.key ?? i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.4,
                delay: i * staggerDelay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </div>
  );
}
