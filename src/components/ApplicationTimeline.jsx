const PIPELINE_STAGES = [
  { key: "applied", label: "Applied" },
  { key: "under_review", label: "Under Review" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
];

export default function ApplicationTimeline({ currentStatus, showRejected = true }) {
  const isRejected = currentStatus === "rejected";
  const stages = showRejected && isRejected
    ? [...PIPELINE_STAGES, { key: "rejected", label: "Rejected" }]
    : PIPELINE_STAGES;
  const currentIndex = stages.findIndex((s) => s.key === currentStatus);

  return (
    <div className="flex items-center justify-between gap-1">
      {stages.map((stage, i) => {
        const isActive = stage.key === currentStatus;
        const isPast = currentIndex > -1 && stages.findIndex((s) => s.key === stage.key) < currentIndex;
        const isRejectedStage = stage.key === "rejected";

        return (
          <div key={stage.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`h-2 w-2 rounded-full shrink-0 ${
                  isRejectedStage && isRejected
                    ? "bg-destructive ring-2 ring-destructive/30"
                    : isActive && !isRejectedStage
                    ? "bg-primary ring-2 ring-primary/30"
                    : isPast && !isRejectedStage
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
              />
              <span
                className={`mt-1.5 text-xs font-medium ${
                  isRejectedStage && isRejected
                    ? "text-destructive"
                    : isActive
                    ? "text-primary"
                    : isPast
                    ? "text-muted-foreground"
                    : "text-muted-foreground/70"
                }`}
              >
                {stage.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-0.5 ${
                  isPast && !isRejectedStage ? "bg-primary" : "bg-muted-foreground/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
