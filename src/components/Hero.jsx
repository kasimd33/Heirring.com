import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            The complete platform to{" "}
            <span className="text-primary">hire smarter</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Streamline your hiring process with AI-powered matching, advanced analytics, 
            and a platform built for modern teams. Find the best talent faster.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Hiring
            </Link>
            <Link
              to="#demo"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-8 py-3 text-base font-medium text-foreground hover:bg-primary/10 transition-colors"
            >
              Watch Demo
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "50K+", label: "Active Users" },
              { value: "2M+", label: "Jobs Posted" },
              { value: "10K+", label: "Companies" },
              { value: "95%", label: "Satisfaction Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
