export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  logoUrl?: string | null;
}

export interface CustomerInfo {
  name: string;
  phone?: string;
  address?: string;
}

export interface InvoiceItem {
  id: string | number;
  name: string;
  qty: number;
  price: number;
  unit?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  status?: "PAID" | "DUE" | "PARTIAL";
  business: BusinessInfo;
  customer?: CustomerInfo;
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  tax?: number;
  paidAmount?: number;
  dueAmount?: number;
  changeAmount?: number;
  returnPolicy?: string;
  footerNote?: string;
  paperSize?: "A4" | "A5";
  printerType?: "normal" | "thermal";
  inWords?: string;
}
