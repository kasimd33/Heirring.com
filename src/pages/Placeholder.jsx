export default function Placeholder({ title = "Coming Soon" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-muted-foreground">This section is under development.</p>
    </div>
  );
}
