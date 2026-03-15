import { motion } from "framer-motion";

export default function CardHover({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
