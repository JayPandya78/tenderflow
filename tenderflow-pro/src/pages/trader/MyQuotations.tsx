// src/pages/trader/MyQuotations.tsx — Trader's submitted quotations
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { Clock, Building2, DollarSign, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuotationDocumentButton } from "@/components/QuotationDocumentButton";
import { QuotationStatus } from "@/types";

type TraderQuotation = {
  _id: string;
  tender?: { title: string; organization?: { name: string } };
  price: number;
  timeline: string;
  status: QuotationStatus;
  createdAt?: string;
  document?: { originalName: string };
};


export default function MyQuotations() {
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [traderQuotations, setTraderQuotations] = useState<TraderQuotation[]>([]);

  useEffect(() => {
    fetch(`${url}/quotation/my`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((response) => response.json())
      .then((result) => setTraderQuotations(result.success ? result.data || [] : []));
  }, [url]);

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="My Quotations"
        description={`${traderQuotations.length} submitted quotations`}
      />

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Tender</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Organization</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Timeline</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Submitted</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Supporting PDF</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {traderQuotations.map((q) => (
              <tr key={q._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-foreground line-clamp-1 max-w-[220px]">
                    {q.tender?.title || "Tender"}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    {q.tender?.organization?.name || "Organization"}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                    {Number(q.price).toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {q.timeline}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={q.status} />
                </td>
                <td className="px-4 py-3.5 text-sm text-muted-foreground">
                  {q.createdAt?.slice(0, 10)}
                </td>
                <td className="px-4 py-3.5">
                  <QuotationDocumentButton
                    quotationId={q._id}
                    hasDocument={Boolean(q.document)}
                  />
                </td>
                <td className="px-4 py-3.5">
                  <Button variant="ghost" size="sm" className="h-7 gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
