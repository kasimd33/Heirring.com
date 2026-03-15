import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Signup() {
  const [userType, setUserType] = useState("seeker");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, loading: authLoading, register } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: `${firstName.trim()} ${lastName.trim()}`.trim() || "User",
        email,
        password,
        role: userType === "employer" ? "recruiter" : "seeker",
        company: company || undefined,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/login" className="flex items-center justify-center gap-2 mb-10">
            <span className="text-xl font-bold text-foreground">Heirring.com</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-white text-xs font-medium">✓</span>
          </Link>

          <div className="rounded-xl border border-border bg-card p-8">
            <h1 className="text-2xl font-bold text-foreground text-center">Create your account</h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Join thousands of job seekers and employers.
            </p>

            <div className="mt-6 flex rounded-xl border border-border p-1 bg-muted/50">
              <button
                type="button"
                onClick={() => setUserType("seeker")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  userType === "seeker" ? "bg-primary text-white shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setUserType("employer")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  userType === "employer" ? "bg-primary text-white shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Employer
              </button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {userType === "employer" && (
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">Company (optional)</label>
                  <input
                    id="company"
                    type="text"
                    placeholder="TechCorp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-muted-foreground">I agree to the Terms & Conditions and Privacy Policy</span>
              </label>

              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {loading ? "Creating account..." : "Create Account"}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
