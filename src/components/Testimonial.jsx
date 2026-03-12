import { cn } from "../utils/cn";

export default function Testimonial({ quote, author, role, className }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6",
        className
      )}
    >
      <p className="text-muted-foreground">{quote}</p>
      <div className="mt-4">
        <p className="font-semibold text-foreground">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
