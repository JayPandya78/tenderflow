import { PrivatePdfViewer } from "@/components/PrivatePdfViewer";

interface QuotationDocumentButtonProps {
  quotationId: string;
  hasDocument: boolean;
}

export function QuotationDocumentButton({
  quotationId,
  hasDocument,
}: QuotationDocumentButtonProps) {
  return (
    <PrivatePdfViewer
      endpoint={`/quotation/${quotationId}/document`}
      hasDocument={hasDocument}
      title="Quotation PDF"
    />
  );
}
