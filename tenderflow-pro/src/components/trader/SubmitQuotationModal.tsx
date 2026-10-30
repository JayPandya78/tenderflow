// src/components/trader/SubmitQuotationModal.tsx — Submit quotation form modal

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Upload, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SubmitQuotationModalProps {
  open: boolean;
  onClose: () => void;
  tenderTitle: string;
  tenderBudget: number;
  tenderid: string
}

export function SubmitQuotationModal({
  open,
  onClose,
  tenderTitle,
  tenderBudget,
  tenderid, 
}: SubmitQuotationModalProps) {
  const {toast} = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [price, setPrice] = useState(0);
  const [timeline, setTimeline] = useState("");
  const [proposal, setProposal] = useState("");
  const [document, setDocument] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const formData = new FormData();
    formData.append("tenderId", tenderid);
    formData.append("price", String(price));
    formData.append("timeline", timeline);
    formData.append("proposal", proposal);
    if (document) formData.append("document", document);

    setSubmitting(true);
    try {
      const response = await fetch(`${url}/quotation`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to submit quotation");
      }

      toast({
        title: "Quotation submitted",
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        navigate("/trader/quotations");
      }, 1500);
    } catch (err) {
      toast({
        title: "Quotation not submitted",
        description: err instanceof Error ? err.message : "Unable to submit quotation",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-status-open-bg flex items-center justify-center mb-4">
              <Check className="w-7 h-7 text-status-open-fg" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1">
              Quotation Submitted!
            </h2>
            <p className="text-sm text-muted-foreground">
              Your proposal has been sent to the organization for review.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Submit Quotation
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {tenderTitle}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Your Price (USD) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  type="number"
                  required
                  // placeholder={`Max: ${tenderBudget.toLocaleString()}`}
                  className="h-9 pl-7"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Budget: ${tenderBudget.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Delivery Timeline *</Label>
              <Select required value={timeline} onValueChange={(value) => {setTimeline(value)}}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "1 month",
                    "2 months",
                    "3 months",
                    "4 months",
                    "6 months",
                    "8 months",
                    "12 months",
                    "Custom",
                  ].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">Proposal Summary *</Label>
            <Textarea
              required
              placeholder="Describe your approach, methodology, team expertise, past similar projects, and why you're the best fit for this tender..."
              className="min-h-[110px] resize-none"
              value={proposal}
              onChange={(e) => {setProposal(e.target.value)}}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">Supporting Documents</Label>
            <label
              htmlFor="quotation-document"
              className="block border-2 border-dashed border-border rounded-lg p-5 text-center cursor-pointer hover:border-primary/40 transition-colors"
            >
              <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-xs text-muted-foreground">
                {document ? document.name : "Choose a supporting PDF"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                PDF up to 10 MB
              </p>
              <Input
                id="quotation-document"
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];
                  if (!selectedFile) return;

                  if (selectedFile.type !== "application/pdf" &&
                    !selectedFile.name.toLowerCase().endsWith(".pdf")) {
                    toast({ title: "Choose a PDF file" });
                    event.target.value = "";
                    return;
                  }

                  if (selectedFile.size > 10 * 1024 * 1024) {
                    toast({ title: "PDF must be 10 MB or smaller" });
                    event.target.value = "";
                    return;
                  }

                  setDocument(selectedFile);
                }}
              />
            </label>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={submitting}>
              Submit Quotation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
