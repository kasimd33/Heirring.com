import { cn } from "../utils/cn";

export default function FeatureCard({ icon: Icon, title, description, className }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
