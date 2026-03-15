import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import Testimonial from "../components/Testimonial";
import FeaturedCompanies from "../components/FeaturedCompanies";
import Footer from "../components/Footer";
import {
  Search,
  Zap,
  BarChart3,
  Users,
  FileCheck,
  Shield,
} from "lucide-react";

const features = [
  { icon: Search, title: "AI-Powered Search", description: "Find candidates that match your requirements with intelligent semantic search." },
  { icon: Zap, title: "Fast Hiring", description: "Streamline your hiring process from posting to offer in days, not weeks." },
  { icon: BarChart3, title: "Advanced Analytics", description: "Track hiring metrics, pipeline health, and team performance in real-time." },
  { icon: Users, title: "Talent Pools", description: "Build and manage your talent community for future openings." },
  { icon: FileCheck, title: "Applicant Tracking", description: "Organize candidates through stages with custom workflows." },
  { icon: Shield, title: "Secure & Compliant", description: "Enterprise-grade security with GDPR and SOC2 compliance." },
];

const testimonials = [
  { quote: "Heirring.com transformed our hiring process. We cut time-to-hire by 40% and found better candidates.", author: "Sarah Chen", role: "Head of Talent, TechCorp" },
  { quote: "The AI matching is incredible. We're now hiring people who actually fit our culture.", author: "Marcus Johnson", role: "HR Director, StartupXYZ" },
  { quote: "Best hiring platform we've used. The candidate experience is outstanding.", author: "Elena Rodriguez", role: "VP of People, GrowthCo" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <Hero />

        {/* Features */}
        <section id="product" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center mb-14"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything you need to hire the best
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A complete toolkit for modern hiring teams. From sourcing to onboarding.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <FeatureCard key={feature.title} {...feature} index={i} />
              ))}
            </div>
          </div>
        </section>

        <FeaturedCompanies />

        {/* Testimonials */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center mb-14"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Loved by hiring teams
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of companies building better teams with Heirring.com.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Testimonial key={t.author} {...t} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-primary px-6 py-16 text-center sm:px-12 lg:px-24"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to transform your hiring?
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Start building your dream team today. No credit card required.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center rounded-lg bg-background px-8 py-3 text-base font-medium text-primary hover:bg-background/90 transition-colors"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/browse-jobs"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-background px-8 py-3 text-base font-medium text-foreground hover:bg-background/10 transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
