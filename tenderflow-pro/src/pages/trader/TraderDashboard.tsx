// src/pages/trader/TraderDashboard.tsx — Trader's dashboard

import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  FileCheck,
  Award,
  Clock,
  TrendingUp,
  Search,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";

type TraderContext = {
  data: any;
};

export default function TraderDashboard() {
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { data } = useOutletContext<TraderContext>();
  const [traderQuotations, setTraderQuotations] = useState<any[]>([]);
  const [openTenders, setOpenTenders] = useState<any[]>([]);

  useEffect(() => {
    const headers = { Authorization: "Bearer " + localStorage.getItem("token") };
    Promise.all([
      fetch(`${url}/quotation/my`, { headers }).then((response) => response.json()),
      fetch(`${url}/tender`, { headers }).then((response) => response.json()),
    ]).then(([quotationResult, tenderResult]) => {
      setTraderQuotations(quotationResult.success ? quotationResult.data || [] : []);
      setOpenTenders(tenderResult.success ? (tenderResult.data || []).slice(0, 3) : []);
    });
  }, [url]);

  const wonCount = traderQuotations.filter((quotation) => quotation.status === "ACCEPTED").length;
  const pendingCount = traderQuotations.filter((quotation) => quotation.status === "PENDING").length;
  const stats = [
    { label: "Submitted Quotations", value: traderQuotations.length, change: "All time", trend: "neutral" as const, icon: <FileCheck className="w-full h-full" /> },
    { label: "Won Tenders", value: wonCount, change: "Accepted quotations", trend: "neutral" as const, icon: <Award className="w-full h-full" /> },
    { label: "Pending Decisions", value: pendingCount, change: "Awaiting response", trend: "neutral" as const, icon: <Clock className="w-full h-full" /> },
    { label: "Win Rate", value: traderQuotations.length ? `${Math.round((wonCount / traderQuotations.length) * 100)}%` : "0%", change: "Based on your quotations", trend: "neutral" as const, icon: <TrendingUp className="w-full h-full" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Your quotation activity and tender opportunities"
        actions={
          <Button size="sm" asChild className="gap-1.5">
            <Link to="/trader/browse">
              <Search className="w-3.5 h-3.5" />
              Browse Tenders
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatsCard
            key={s.label}
            label={s.label}
            value={s.value}
            change={s.change}
            trend={s.trend}
            icon={s.icon}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* My Quotations */}
        <div className="lg:col-span-3 bg-card rounded-xl shadow-card border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">My Quotations</h2>
            <Link
              to="/trader/quotations"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {traderQuotations.map((q) => (
              <div
                key={q._id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {q.tender?.title || "Tender"}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs font-semibold text-foreground">
                      ${Number(q.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {q.timeline}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Submitted {q.createdAt?.slice(0, 10)}
                    </span>
                  </div>
                </div>
                <StatusBadge status={q.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Tenders */}
        <div className="lg:col-span-2 bg-card rounded-xl shadow-card border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Open Tenders</h2>
            <Link
              to="/trader/browse"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Browse all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="px-4 py-3 space-y-3">
            {openTenders.map((tender) => (
              <Link
                key={tender._id}
                to={`/trader/tenders/${tender._id}`}
                className="block p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {tender.title}
                  </p>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors mt-0.5" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {tender.organization}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-medium text-foreground">
                    ${Number(tender.budget || 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Due {tender.deadline?.slice(0, 10)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
