import { useEffect, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PrivatePdfViewerProps {
  endpoint: string;
  hasDocument: boolean;
  title: string;
}

export function PrivatePdfViewer({
  endpoint,
  hasDocument,
  title,
}: PrivatePdfViewerProps) {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => () => {
    if (documentUrl) URL.revokeObjectURL(documentUrl);
  }, [documentUrl]);

  const closeDocument = () => {
    if (documentUrl) URL.revokeObjectURL(documentUrl);
    setDocumentUrl(null);
  };

  const viewDocument = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Unable to load PDF");
      }

      const file = await response.blob();
      setDocumentUrl(URL.createObjectURL(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {hasDocument ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1.5"
          onClick={viewDocument}
          disabled={loading}
        >
          {loading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Eye className="w-3.5 h-3.5" />}
          View PDF
        </Button>
      ) : (
        <span className="text-xs text-muted-foreground">No PDF</span>
      )}
      {error && <p className="mt-1 text-xs text-destructive" role="alert">{error}</p>}

      <Dialog open={Boolean(documentUrl)} onOpenChange={(open) => !open && closeDocument()}>
        <DialogContent className="flex h-[85vh] max-w-5xl flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {documentUrl && (
            <iframe
              src={documentUrl}
              title={title}
              className="min-h-0 flex-1 rounded-md border border-border"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
