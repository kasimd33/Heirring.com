import { motion } from "framer-motion";
import CompanyCard from "./CompanyCard";

const companies = [
  { name: "TechCorp", description: "Leading software company with 500+ employees", jobCount: 24 },
  { name: "DesignStudio", description: "Creative agency focused on product design", jobCount: 12 },
  { name: "DataFlow Inc", description: "AI and data analytics powerhouse", jobCount: 18 },
  { name: "CloudFirst", description: "Cloud infrastructure and DevOps experts", jobCount: 9 },
];

export default function FeaturedCompanies() {
  return (
    <section id="companies" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Featured Companies</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of companies building better teams with Heirring.com
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((company, i) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <CompanyCard company={company} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
