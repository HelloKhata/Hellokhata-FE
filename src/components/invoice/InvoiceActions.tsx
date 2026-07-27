"use client";

import React, { useRef } from "react";
import { InvoiceData } from "@/types/invoice";
import { InvoiceTemplate } from "./InvoiceTemplate";
import { downloadInvoiceAsPdf } from "@/utils/downloadPdf";
import { Button } from "@/components/ui/premium";
import { Download, Printer } from "lucide-react";

interface InvoicePreviewWrapperProps {
  data: InvoiceData;
  isBangla?: boolean;
  showActions?: boolean;
  className?: string;
}

export function InvoicePreviewWrapper({
  data,
  isBangla = true,
  showActions = true,
  className,
}: InvoicePreviewWrapperProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = () => {
    if (invoiceRef.current) {
      downloadInvoiceAsPdf(
        invoiceRef.current,
        data.invoiceNumber || "Invoice",
        data.paperSize || "A4"
      );
    }
  };

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${data.invoiceNumber || "Invoice"}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { background-color: #ffffff; padding: 16px; font-family: system-ui, -apple-system, sans-serif; }
                @media print {
                  body { padding: 0; }
                  @page { margin: 5mm; }
                }
              </style>
            </head>
            <body>
              ${invoiceRef.current.outerHTML}
              <script>
                window.onload = () => {
                  setTimeout(() => {
                    window.print();
                    window.close();
                  }, 300);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className="space-y-3 w-full">
      {showActions && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            className="rounded-xl border-primary/30 text-primary hover:bg-primary/10"
          >
            <Download className="h-4 w-4 mr-2" />
            {isBangla ? "PDF ডাউনলোড করুন" : "Download PDF"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="rounded-xl"
          >
            <Printer className="h-4 w-4 mr-2" />
            {isBangla ? "প্রিন্ট করুন" : "Print"}
          </Button>
        </div>
      )}

      <div className={className}>
        <InvoiceTemplate ref={invoiceRef} data={data} isBangla={isBangla} />
      </div>
    </div>
  );
}
