// src/pages/org/TenderDetails.tsx — Org view of a specific tender with quotations

import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Tag,
  Users,
  Star,
  Check,
  X,
  BarChart2,
  Clock,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuotationStatus, TenderStatus } from "@/types";
import { QuotationDocumentButton } from "@/components/QuotationDocumentButton";
import { PrivatePdfViewer } from "@/components/PrivatePdfViewer";
import { useToast } from "@/hooks/use-toast";

type Tab = "quotations" | "details" | "activity";
type TenderDetailsData = {
  _id: string;
  title: string;
  description?: string;
  budget: number;
  category?: string;
  deadline: string;
  status: TenderStatus;
  document?: { originalName: string };
};

type QuotationRow = {
  _id: string;
  trader: { name: string; email: string };
  price: number;
  timeline: string;
  status: QuotationStatus;
  updatedAt?: string;
  document?: { originalName: string };
};

const awardTender = async (tenderid: string, quotationid: string) => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const response = await fetch(`${url}/tender/${tenderid}/award`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      quotationId: quotationid
    })
  });

  const data = await response.json();

  return {
    success: data.success,
    message: data.message
  }

};

export default function TenderDetails() {
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [tender1, setTender] = useState<TenderDetailsData | null>(null);
  const [quotations1, setQuotations] = useState<QuotationRow[]>([]);
  const [quotationError, setQuotationError] = useState("");
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "true");
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    deadline: "",
  });

  useEffect(() => {

    const fetchData = async () => {

      const tenderRes = await fetch(`${url}/tender/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      const tenderData = await tenderRes.json();
      setTender(tenderData.data);
      setEditForm({
        title: tenderData.data.title || "",
        description: tenderData.data.description || "",
        budget: String(tenderData.data.budget || ""),
        category: tenderData.data.category || "",
        deadline: tenderData.data.deadline?.slice(0, 10) || "",
      });

      const quoteRes = await fetch(`${url}/quotation/tender/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      const quoteData = await quoteRes.json();
      if (!quoteRes.ok || !quoteData.success) {
        setQuotationError(quoteData.message || "Unable to load quotations");
        setQuotations([]);
      } else {
        setQuotationError("");
        setQuotations(quoteData.data || []);
      }

    };

    fetchData();

  }, [id, url]);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("quotations");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [selectedQuotations, setSelectedQuotations] = useState<string[]>([]);

  const tender = tender1;
  const quotations = quotations1;

  const saveTender = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(`${url}/tender/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ ...editForm, budget: Number(editForm.budget) }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      toast({ title: "Tender not updated", description: result.message });
      return;
    }
    setTender(result.data);
    setIsEditing(false);
    toast({ title: "Tender updated" });
  };

  const awardSelectedTender = async () => {
    if (selectedQuotations.length !== 1) {
      toast({ title: "Select one quotation", description: "Choose one quotation before awarding this tender." });
      return;
    }
    const result = await awardTender(tender._id, selectedQuotations[0]);
    toast({ title: result.success ? "Tender awarded" : "Tender not awarded", description: result.message });
    if (result.success) window.location.reload();
  };


  if (!tender) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Tender not found</p>
      </div>
    );
  }

  const toggleSelect = (qId: string) => {
    setSelectedQuotations((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "quotations", label: `Quotations (${quotations.length})` },
    { key: "details", label: "Details" },
    { key: "activity", label: "Activity Log" },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Tenders
        </button>

        <div className="bg-card rounded-xl shadow-card border border-border p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-lg font-semibold text-foreground">{tender.title}</h1>
                <StatusBadge status={tender.status} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {tender.description}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setIsEditing((value) => !value)}>
                Edit Tender
              </Button>
              <Button size="sm" onClick={awardSelectedTender}>Award Tender</Button>
            </div>
          </div>

          {isEditing && (
            <form onSubmit={saveTender} className="mt-5 grid gap-3 border-t border-border pt-4">
              <input className="h-9 rounded-md border border-border bg-background px-3 text-sm" value={editForm.title} onChange={(event) => setEditForm({ ...editForm, title: event.target.value })} placeholder="Tender title" required />
              <textarea className="min-h-20 rounded-md border border-border bg-background px-3 py-2 text-sm" value={editForm.description} onChange={(event) => setEditForm({ ...editForm, description: event.target.value })} placeholder="Description" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input type="number" className="h-9 rounded-md border border-border bg-background px-3 text-sm" value={editForm.budget} onChange={(event) => setEditForm({ ...editForm, budget: event.target.value })} placeholder="Budget" required />
                <input className="h-9 rounded-md border border-border bg-background px-3 text-sm" value={editForm.category} onChange={(event) => setEditForm({ ...editForm, category: event.target.value })} placeholder="Category" />
                <input type="date" className="h-9 rounded-md border border-border bg-background px-3 text-sm" value={editForm.deadline} onChange={(event) => setEditForm({ ...editForm, deadline: event.target.value })} required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5" />
              Budget: <span className="font-medium text-foreground">0</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Deadline: <span className="font-medium text-foreground">{tender.deadline}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Tag className="w-3.5 h-3.5" />
              <span className="font-medium text-foreground">{tender.category}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span className="font-medium text-foreground">{quotations1.length}</span> quotations received
            </div>

            {tender.document && (
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                <p className="truncate text-sm text-muted-foreground">
                  Tender document: {tender.document.originalName}
                </p>
                <PrivatePdfViewer
                  endpoint={`/tender/${tender._id}/document`}
                  hasDocument
                  title="Tender Supporting Document"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      {/* <div className="flex items-center gap-0.5 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div> */}

      {/* Tab Content */}
        <QuotationsTab
          quotations={quotations}
          selected={selectedQuotations}
          onToggle={toggleSelect}
          onCompare={() => setComparisonOpen(true)}
          tender={tender}
          error={quotationError}
        />

      {/* Comparison Modal */}
      {/* <ComparisonModal
        open={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        quotations={quotations.filter((q) => selectedQuotations.includes(q.id))}
        tenderBudget={tender.budget}
      /> */}
    </div>
  );
}

// ---- Sub-components ----

function QuotationsTab({
  quotations,
  selected,
  onToggle,
  onCompare,
  tender,
  error
}: {
  quotations: QuotationRow[];
  selected: string[];
  onToggle: (id: string) => void;
  onCompare: () => void;
  tender: TenderDetailsData;
  error: string;
}) {


  const {toast} = useToast();
  if (error || quotations.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-card border border-border">
        <div className="py-16 text-center">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">{error || "No quotations yet"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Quotations will appear here once traders submit them
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {selected.length >= 2 && (
        <div className="flex items-center justify-between bg-accent rounded-lg px-4 py-2.5">
          <p className="text-sm text-accent-foreground">
            {selected.length} quotations selected for comparison
          </p>
          <Button size="sm" onClick={onCompare} className="gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" />
            Compare Selected
          </Button>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="w-8 px-4 py-3" />
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Trader</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Timeline</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Rating</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Submitted</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Supporting PDF</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {quotations.map((q) => (
              <tr key={q._id} className={cn("hover:bg-muted/30 transition-colors", selected.includes(q._id) && "bg-accent/30")}>
                <td className="px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={selected.includes(q._id)}
                    onChange={() => onToggle(q._id)}
                    aria-label={`Select quotation from ${q.trader.email}`}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-accent-foreground">
                        {q.trader.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{q.trader.name}</p>
                      <p className="text-xs text-muted-foreground">{q.trader.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm font-semibold text-foreground">
                    ${q.price}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {q.timeline}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3.5 h-3.5 text-status-evaluation fill-status-evaluation" />
                      <span className="font-medium text-foreground">4.7</span>
                    </div>
                </td>
                <td className="px-4 py-3.5">
                  {/* {q.status} */}
                  <StatusBadge status={q.status} />
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-muted-foreground">{q.updatedAt?.slice(0, 10)}</span>
                </td>
                <td className="px-4 py-3.5">
                  <QuotationDocumentButton
                    quotationId={q._id}
                    hasDocument={Boolean(q.document)}
                  />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Button
                      size="sm"
                      className="h-7 px-2 gap-1 bg-status-open-bg text-status-open-fg hover:bg-status-open/20"
                      aria-label={`Award quotation from ${q.trader.email}`}
                      title={`Award quotation from ${q.trader.email}`}
                      onClick={async () => {

                        const {success, message }= await awardTender(tender._id, q._id);

                        if (success == true) {
                          toast({
                            title: "Tender awarded",
                          });
                          setTimeout(() => window.location.reload(), 500)
                        } else {
                          toast({
                            title: "Tender not awarded",
                            description: message
                          })

                        }




                      }} 
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="sr-only">Award</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 gap-1 text-status-rejected hover:bg-status-rejected-bg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// function DetailsTab({ tender }: { tender: ReturnType<typeof MOCK_TENDERS.find> }) {
//   if (!tender) return null;
//   return (
//     <div className="bg-card rounded-xl shadow-card border border-border p-6 space-y-5">
//       <div className="grid sm:grid-cols-2 gap-5">
//         {[
//           { label: "Title", value: tender.title },
//           { label: "Category", value: tender.category },
//           { label: "Budget", value: `$${tender.budget.toLocaleString()}` },
//           { label: "Deadline", value: tender.deadline },
//           { label: "Visibility", value: tender.visibility === "public" ? "Public" : "Private" },
//           { label: "Created", value: tender.createdAt },
//         ].map((row) => (
//           <div key={row.label}>
//             <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{row.label}</p>
//             <p className="text-sm font-medium text-foreground">{row.value}</p>
//           </div>
//         ))}
//       </div>
//       <div>
//         <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Description</p>
//         <p className="text-sm text-foreground leading-relaxed">{tender.description}</p>
//       </div>
//     </div>
//   );
// }

// function ActivityTab() {
//   return (
//     <div className="bg-card rounded-xl shadow-card border border-border p-5">
//       <div className="space-y-5">
//         {MOCK_ACTIVITY.map((activity, i) => (
//           <div key={activity.id} className="flex gap-4">
//             <div className="flex flex-col items-center">
//               <div
//                 className={cn(
//                   "w-2 h-2 rounded-full mt-1.5 shrink-0",
//                   activity.type === "success"
//                     ? "bg-status-open"
//                     : activity.type === "warning"
//                     ? "bg-status-evaluation"
//                     : "bg-primary"
//                 )}
//               />
//               {i < MOCK_ACTIVITY.length - 1 && (
//                 <div className="w-px flex-1 bg-border mt-1.5" />
//               )}
//             </div>
//             <div className="pb-5">
//               <p className="text-sm text-foreground">{activity.message}</p>
//               <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
