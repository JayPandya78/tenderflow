// src/pages/org/QuotationsReceived.tsx — All quotations received by organization

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { QuotationDocumentButton } from "@/components/QuotationDocumentButton";
import { QuotationStatus } from "@/types";

type ReceivedQuotation = {
  _id: string;
  trader?: { name: string; email: string };
  tender?: { _id: string; title: string };
  price: number;
  timeline: string;
  status: QuotationStatus;
  document?: { originalName: string };
};

export default function QuotationsReceived() {
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [quotations, setQuotations] = useState<ReceivedQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchQuotations() {
      try {
        const response = await fetch(`${url}/quotation/organization`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        const result = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error(result.message || "Unable to load quotations");
        }

        setQuotations(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load quotations");
      } finally {
        setLoading(false);
      }
    }

    fetchQuotations();
  }, [url]);

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Quotations Received"
        description={`${quotations.length} total quotations across all tenders`}
      />

      {loading && <p className="py-8 text-center text-sm text-muted-foreground" role="status">Loading quotations...</p>}
      {error && <p className="py-8 text-center text-sm text-destructive" role="alert">{error}</p>}
      {!loading && !error && quotations.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">No quotations received yet.</p>
      )}

      {!loading && !error && quotations.length > 0 && <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Trader</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Tender</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Timeline</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Supporting PDF</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {quotations.map((q) => (
              <tr key={q._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-accent-foreground">
                        {(q.trader?.name || "Trader").split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{q.trader?.name || "Trader"}</p>
                      <p className="text-xs text-muted-foreground">{q.trader?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <Link
                    to={`/org/tenders/${q.tender?._id}`}
                    className="text-sm text-foreground hover:text-primary transition-colors line-clamp-1 max-w-[200px]"
                  >
                    {q.tender?.title || "Tender"}
                  </Link>
                </td>
                <td className="px-4 py-3.5 text-sm font-semibold text-foreground">
                  ${Number(q.price).toLocaleString()}
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
                <td className="px-4 py-3.5">
                  <QuotationDocumentButton
                    quotationId={q._id}
                    hasDocument={Boolean(q.document)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
