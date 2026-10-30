// src/components/StatsCard.tsx — Reusable stats card component

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  className?: string;
  accent?: string;
}

export function StatsCard({
  label,
  value,
  change,
  trend,
  icon,
  className,
  accent = "text-primary",
}: StatsCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-status-open"
      : trend === "down"
      ? "text-status-rejected"
      : "text-muted-foreground";

  return (
    <div
      className={cn(
        "bg-card rounded-xl p-5 shadow-card hover:shadow-soft transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center",
            accent === "text-primary" ? "bg-primary-light" : ""
          )}
        >
          <span className={cn("w-4 h-4", accent)}>{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      {change && (
        <div className={cn("flex items-center gap-1 mt-1.5 text-xs", trendColor)}>
          <TrendIcon className="w-3 h-3" />
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}
