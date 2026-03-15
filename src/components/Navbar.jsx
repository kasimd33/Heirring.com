import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Jobs", href: "/browse-jobs" },
  { label: "Companies", href: "#companies" },
  { label: "How it Works", href: "#product" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/50 glass"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to={user ? "/" : "/login"} className="flex items-center gap-2 group">
          <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            Heirring.com
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
            ✓
          </span>
        </Link>

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:gap-8">
          {user && navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.role === "seeker" ? "/dashboard/seeker" : "/dashboard/employer"}
                className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[120px]">
                {user.name}
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Log in
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 hover:shadow-primary-glow transition-all duration-200"
                >
                  Get Started
                </Link>
              </motion.div>
            </>
          )}

          <button
            type="button"
            className="md:hidden p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
                className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {user && navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block py-2.5 text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to={user.role === "seeker" ? "/dashboard/seeker" : "/dashboard/employer"}
                    className="block py-2.5 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="pt-4 flex gap-3">
                  <Link
                    to="/login"
                    className="flex-1 py-2.5 text-center text-sm font-medium border border-border rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 py-2.5 text-center text-sm font-semibold bg-primary text-white rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
