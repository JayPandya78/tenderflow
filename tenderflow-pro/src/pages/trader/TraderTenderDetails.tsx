import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { PrivatePdfViewer } from "@/components/PrivatePdfViewer";
import { TenderStatus } from "@/types";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Send,
  Tag,
} from "lucide-react";
import { SubmitQuotationModal } from "@/components/trader/SubmitQuotationModal";

type TenderDetails = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  budget: number;
  deadline: string;
  status: TenderStatus;
  document?: { originalName: string };
  organization: { name?: string } | null;
  createdAt: string;
};

export default function TraderTenderDetails() {
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const { id } = useParams();
  const [tender, setTender] = useState<TenderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTender() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${url}/tender/${id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const responseData = await response.json();

        if (!response.ok || !responseData.success || !responseData.data) {
          throw new Error(responseData.message || "Unable to load tender");
        }

        setTender(responseData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load tender");
      } finally {
        setLoading(false);
      }
    }

    fetchTender();
  }, [id, url]);

  if (loading) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground" role="status">
        Loading tender...
      </p>
    );
  }

  if (error || !tender) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => navigate("/trader/browse")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Browse
        </button>
        <EmptyState
          title={error ? "Unable to load tender" : "Tender not found"}
          description={error}
        />
      </div>
    );
  }

  const organizationName = tender.organization?.name || "Organization";
  const deadline = new Date(tender.deadline).toLocaleDateString();

  return (
    <div className="max-w-3xl space-y-5 animate-fade-in">
      <button
        onClick={() => navigate("/trader/browse")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Browse
      </button>

      <div className="bg-card rounded-xl shadow-card border border-border p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={tender.status} />
              <span className="text-xs text-muted-foreground">
                Posted {new Date(tender.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">{tender.title}</h1>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <Building2 className="w-3.5 h-3.5" />
              {organizationName}
            </div>
          </div>
          {tender.status === "OPEN" && (
            <Button className="gap-2 shrink-0" onClick={() => setModalOpen(true)}>
              <Send className="w-3.5 h-3.5" />
              Submit Quotation
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/40 rounded-xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="text-xs">Budget</span>
            </div>
            <p className="text-base font-bold text-foreground">
              ${tender.budget.toLocaleString()}
            </p>
          </div>
          <div className="text-center border-l border-border">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">Deadline</span>
            </div>
            <p className="text-base font-bold text-foreground">{deadline}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-card border border-border p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Scope of Work
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {tender.description || "No description provided."}
        </p>
      </div>

      {tender.document && (
        <div className="bg-card rounded-xl shadow-card border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Tender Supporting Document
          </h2>
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm text-muted-foreground">
              {tender.document.originalName}
            </p>
            <PrivatePdfViewer
              endpoint={`/tender/${tender._id}/document`}
              hasDocument
              title="Tender Supporting Document"
            />
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-card border border-border p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Category
            </p>
            <p className="text-sm font-medium text-foreground">
              {tender.category || "Uncategorized"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Organization
            </p>
            <p className="text-sm font-medium text-foreground">{organizationName}</p>
          </div>
        </div>
      </div>

      {tender.status === "OPEN" && (
        <div className="bg-primary-light rounded-xl border border-primary/20 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Ready to submit your quotation?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Deadline: {deadline}
            </p>
          </div>
          <Button className="gap-2" onClick={() => setModalOpen(true)}>
            <Send className="w-3.5 h-3.5" />
            Submit Quotation
          </Button>
        </div>
      )}

      <SubmitQuotationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tenderTitle={tender.title}
        tenderBudget={tender.budget}
        tenderid={tender._id}
      />
    </div>
  );
}
