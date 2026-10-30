// src/components/org/ComparisonModal.tsx — Side-by-side quotation comparison modal

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Quotation } from "@/types";
import { DollarSign, Clock, Star, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonModalProps {
  open: boolean;
  onClose: () => void;
  quotations: Quotation[];
  tenderBudget: number;
}

const ROWS = [
  { key: "traderCompany", label: "Company" },
  { key: "price", label: "Price", format: (v: number) => `$${v.toLocaleString()}` },
  { key: "timeline", label: "Timeline" },
  { key: "rating", label: "Rating" },
  { key: "submittedAt", label: "Submitted" },
];

export function ComparisonModal({
  open,
  onClose,
  quotations,
  tenderBudget,
}: ComparisonModalProps) {
  if (quotations.length === 0) return null;

  const lowestPrice = Math.min(...quotations.map((q) => q.price));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Quotation Comparison
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          {/* Header row */}
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `160px repeat(${quotations.length}, 1fr)`,
            }}
          >
            <div />
            {quotations.map((q) => (
              <div
                key={q.id}
                className={cn(
                  "text-center p-3 rounded-xl border",
                  q.price === lowestPrice
                    ? "border-primary bg-primary-light"
                    : "border-border bg-muted/20"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-1.5">
                  <span className="text-xs font-bold text-accent-foreground">
                    {q.traderName.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">{q.traderName}</p>
                {q.price === lowestPrice && (
                  <span className="inline-block mt-1 text-[10px] font-medium text-accent-foreground bg-primary/15 px-1.5 py-0.5 rounded-full">
                    Best Price
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Data rows */}
          <div className="mt-3 space-y-1">
            {[
              { label: "Company", render: (q: Quotation) => q.traderCompany },
              {
                label: "Price",
                render: (q: Quotation) => (
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "font-semibold",
                        q.price === lowestPrice ? "text-status-open-fg" : "text-foreground"
                      )}
                    >
                      ${q.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {((q.price / tenderBudget) * 100).toFixed(0)}% of budget
                    </span>
                  </div>
                ),
              },
              { label: "Timeline", render: (q: Quotation) => q.timeline },
              {
                label: "Rating",
                render: (q: Quotation) =>
                  q.rating ? (
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 text-status-evaluation fill-status-evaluation" />
                      <span className="font-medium text-foreground">{q.rating}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  ),
              },
              { label: "Submitted", render: (q: Quotation) => q.submittedAt },
            ].map((row) => (
              <div
                key={row.label}
                className="grid gap-3 py-2.5 border-b border-border last:border-0"
                style={{
                  gridTemplateColumns: `160px repeat(${quotations.length}, 1fr)`,
                }}
              >
                <span className="text-xs font-medium text-muted-foreground flex items-center">
                  {row.label}
                </span>
                {quotations.map((q) => (
                  <div key={q.id} className="text-center text-sm text-foreground">
                    {row.render(q)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div
            className="grid gap-3 mt-4"
            style={{
              gridTemplateColumns: `160px repeat(${quotations.length}, 1fr)`,
            }}
          >
            <div />
            {quotations.map((q) => (
              <Button
                key={q.id}
                size="sm"
                className="gap-1.5"
                variant={q.price === lowestPrice ? "default" : "outline"}
              >
                <Check className="w-3.5 h-3.5" />
                Accept
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
