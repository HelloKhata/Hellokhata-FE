import { toast } from "@/hooks/use-toast";

export const downloadInvoiceAsPdf = async (
  element: HTMLElement,
  filename: string = "Invoice",
  paperSize: "A4" | "A5" = "A4"
) => {
  if (typeof window === "undefined" || !element) return;

  try {
    toast({
      title: "Generating PDF...",
      description: "Please wait a moment while your invoice PDF is created.",
    });

    // Dynamic import to prevent SSR issues in Next.js
    const html2pdfModule = await import("html2pdf.js");
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const isThermal = element.classList.contains("thermal-receipt");

    const options = {
      margin: isThermal ? [2, 2, 2, 2] : [8, 8, 8, 8],
      filename: `${filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc: Document) => {
          // Sanitize any computed or inline colors that use oklab/oklch
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((node) => {
            const el = node as HTMLElement;
            if (el.style) {
              if (el.style.color && el.style.color.includes("okl")) {
                el.style.color = "#0f172a";
              }
              if (el.style.backgroundColor && el.style.backgroundColor.includes("okl")) {
                el.style.backgroundColor = "#ffffff";
              }
              if (el.style.borderColor && el.style.borderColor.includes("okl")) {
                el.style.borderColor = "#e2e8f0";
              }
            }
          });
        },
      },
      jsPDF: isThermal
        ? { unit: "mm", format: [80, 200], orientation: "portrait" }
        : { unit: "mm", format: paperSize.toLowerCase(), orientation: "portrait" },
    };

    await html2pdf().set(options).from(element).save();

    toast({
      title: "PDF Downloaded",
      description: `${filename}.pdf has been saved successfully.`,
    });
  } catch (error: any) {
    console.error("PDF Download Error:", error);
    toast({
      title: "PDF Download Failed",
      description: error?.message || "Failed to generate invoice PDF.",
      variant: "destructive",
    });
  }
};
