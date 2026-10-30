// src/components/ui/StatusBadge.tsx — Reusable status badge component

import { TenderStatus, QuotationStatus } from "@/types";
import { cn } from "@/lib/utils";

type Status = TenderStatus | QuotationStatus;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const STATUS_CONFIG: Record<
  Status,
  { label: string; dot: string; badge: string }
> = {
  OPEN: {
    label: "Open",
    dot: "bg-status-open",
    badge: "bg-status-open-bg text-status-open-fg",
  },
  EVALUATION: {
    label: "Evaluation",
    dot: "bg-status-evaluation",
    badge: "bg-status-evaluation-bg text-status-evaluation-fg",
  },
  AWARDED: {
    label: "Awarded",
    dot: "bg-status-awarded",
    badge: "bg-status-awarded-bg text-status-awarded-fg",
  },
  CLOSED: {
    label: "Closed",
    dot: "bg-status-closed",
    badge: "bg-status-closed-bg text-status-closed-fg",
  },
  PENDING: {
    label: "Pending",
    dot: "bg-status-evaluation",
    badge: "bg-status-evaluation-bg text-status-evaluation-fg",
  },
  ACCEPTED: {
    label: "Accepted",
    dot: "bg-status-open",
    badge: "bg-status-open-bg text-status-open-fg",
  },
  REJECTED: {
    label: "Rejected",
    dot: "bg-status-rejected",
    badge: "bg-status-rejected-bg text-status-rejected-fg",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.badge,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
