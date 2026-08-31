"use client";

import React, { useRef, useState } from "react";
import { InvoiceData } from "@/types/invoice";
import { InvoiceTemplate } from "./InvoiceTemplate";
import { downloadInvoiceAsPdf } from "@/utils/downloadPdf";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Printer, Receipt, Loader2 } from "lucide-react";

/**
 * Triggers the native browser print / save-as-PDF engine using an isolated iframe
 * with 100% of the active page's CSS, fonts, and vector graphics.
 * Produces a real vector PDF (selectable text, sharp fonts, real SVG barcodes), NOT a raster snapshot.
 */
export function printInvoiceReal(
  element: HTMLElement,
  title: string = "Invoice",
  paperSize: "A4" | "A5" = "A4",
  printerType: "normal" | "thermal" = "normal"
) {
  if (typeof window === "undefined" || !element) return;

  // Remove existing print iframe if any
  const existingFrame = document.getElementById("hk-print-frame");
  if (existingFrame) existingFrame.remove();

  const iframe = document.createElement("iframe");
  iframe.id = "hk-print-frame";
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  const isThermal = printerType === "thermal";

  // Collect all current stylesheets and style tags from document head to preserve 100% exact styling
  let stylesHtml = "";
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    stylesHtml += node.outerHTML;
  });

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${stylesHtml}
        <style>
          @page {
            size: ${isThermal ? "80mm auto" : paperSize};
            margin: ${isThermal ? "2mm" : "8mm"};
          }
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: ${isThermal ? "2px" : "12px"} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .thermal-receipt, .normal-invoice {
            box-shadow: none !important;
            border-color: ${isThermal ? "#cbd5e1" : "#e2e8f0"} !important;
            margin: 0 auto !important;
          }
        </style>
      </head>
      <body>
        <div style="display: flex; justify-content: center; align-items: flex-start; width: 100%;">
          ${element.outerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Wait for fonts and assets to finish rendering in iframe
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error("Print error:", err);
    }
  }, 250);
}

/**
 * Hook providing reusable invoice actions: real vector PDF download / print, and element ref
 */
export function useInvoiceActions(data?: InvoiceData) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    setIsDownloading(true);
    try {
      // Use real vector print-to-PDF with exact CSS and zero snapshot blur
      printInvoiceReal(
        invoiceRef.current,
        data?.invoiceNumber || "Invoice",
        data?.paperSize || "A4",
        data?.printerType || "normal"
      );
    } catch (error) {
      console.error("PDF Download Error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (!invoiceRef.current) {
      window.print();
      return;
    }

    printInvoiceReal(
      invoiceRef.current,
      data?.invoiceNumber || "Invoice",
      data?.paperSize || "A4",
      data?.printerType || "normal"
    );
  };

  return {
    invoiceRef,
    isDownloading,
    handleDownloadPdf,
    handlePrint,
  };
}

/**
 * Offscreen container for invoice rendering ensuring proper coordinates for html2canvas & printing
 */
export function InvoiceOffscreen({
  invoiceRef,
  data,
  isBangla = true,
}: {
  invoiceRef: React.RefObject<HTMLDivElement | null>;
  data: InvoiceData;
  isBangla?: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: data.printerType === "thermal" ? "320px" : "600px",
        pointerEvents: "none",
        opacity: 0,
        zIndex: -100,
        backgroundColor: "#ffffff",
      }}
    >
      <InvoiceTemplate ref={invoiceRef} data={data} isBangla={isBangla} />
    </div>
  );
}

interface InvoicePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: InvoiceData;
  isBangla?: boolean;
}

/**
 * Self-contained modal dialog to preview, download, or print an invoice
 */
export function InvoicePreviewDialog({
  open,
  onOpenChange,
  data,
  isBangla = true,
}: InvoicePreviewDialogProps) {
  const { invoiceRef, isDownloading, handleDownloadPdf, handlePrint } =
    useInvoiceActions(data);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-background text-foreground">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            {isBangla ? "ইনভয়েস প্রিভিউ" : "Invoice Preview"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 flex justify-center bg-muted/20 rounded-xl p-4 overflow-x-auto">
          <InvoiceTemplate ref={invoiceRef} data={data} isBangla={isBangla} />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="gap-1.5 cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isBangla ? "PDF ডাউনলোড" : "Download PDF"}
          </Button>
          <Button onClick={handlePrint} className="gap-1.5 cursor-pointer">
            <Printer className="h-4 w-4" />
            {isBangla ? "প্রিন্ট করুন" : "Print"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InvoicePreviewWrapperProps {
  data: InvoiceData;
  isBangla?: boolean;
  showActions?: boolean;
  className?: string;
}

/**
 * Inline wrapper with template and action buttons
 */
export function InvoicePreviewWrapper({
  data,
  isBangla = true,
  showActions = true,
  className,
}: InvoicePreviewWrapperProps) {
  const { invoiceRef, isDownloading, handleDownloadPdf, handlePrint } =
    useInvoiceActions(data);

  return (
    <div className="space-y-3 w-full">
      {showActions && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isBangla ? "PDF ডাউনলোড করুন" : "Download PDF"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="rounded-xl cursor-pointer"
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
