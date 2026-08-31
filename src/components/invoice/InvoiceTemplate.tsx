"use client";

import React, { forwardRef } from "react";
import { InvoiceData } from "@/types/invoice";
import { MapPin, Phone, User, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvoiceTemplateProps {
  data: InvoiceData;
  isBangla?: boolean;
  className?: string;
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ data, isBangla = true, className }, ref) => {
    const {
      invoiceNumber,
      date,
      status = "DUE",
      business,
      customer,
      items,
      subtotal,
      discount = 0,
      tax = 0,
      paidAmount = 0,
      dueAmount = subtotal,
      changeAmount = 0,
      returnPolicy,
      footerNote,
      paperSize = "A4",
      printerType = "normal",
      inWords = "Twenty Six Thousand Taka Only",
    } = data;

    const isThermal = printerType === "thermal";

    if (isThermal) {
      return (
        <div
          ref={ref}
          className={cn(
            "thermal-receipt w-full max-w-[290px] mx-auto bg-[#ffffff] text-[#0f172a] rounded-md p-4 text-[11px] font-mono space-y-3 border border-[#e2e8f0] relative shadow-sm",
            className
          )}
        >
          {/* Thermal Header */}
          <div className="text-center space-y-1 pb-2 border-b border-dashed border-[#cbd5e1]">
            {business.logoUrl && (
              <img
                src={business.logoUrl}
                alt="Business logo"
                className="h-8 max-w-[100px] object-contain mx-auto mb-1 grayscale contrast-125"
              />
            )}
            <h2 className="font-bold text-sm text-[#0f172a] uppercase tracking-tight">
              {business.name || (isBangla ? "ব্যবসার নাম" : "Business Name")}
            </h2>
            <p className="text-[10px] text-[#475569] font-sans">
              {business.address || (isBangla ? "ঠিকানা" : "Address")}
            </p>
            <p className="text-[10px] text-[#475569] font-sans">
              {isBangla ? "মোবাইল: " : "Tel: "}
              {business.phone || "01XXXXXXXXX"}
            </p>
          </div>

          {/* Metadata */}
          <div className="space-y-0.5 text-[10.5px]">
            <div className="flex justify-between">
              <span className="text-[#64748b]">{isBangla ? "ইনভয়েস:" : "INV:"}</span>
              <span className="font-semibold text-[#0f172a]">{invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">{isBangla ? "তারিখ:" : "Date:"}</span>
              <span className="text-[#0f172a]">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">{isBangla ? "অবস্থা:" : "Status:"}</span>
              <span className="font-bold text-[#e11d48] uppercase">{status}</span>
            </div>
          </div>

          {/* Customer Info */}
          {(customer?.name || customer?.phone) && (
            <div className="space-y-0.5 text-[10px] bg-[#f8fafc] p-1.5 rounded border border-[#e2e8f0]">
              <div className="flex justify-between">
                <span className="text-[#64748b]">{isBangla ? "গ্রাহক:" : "Customer:"}</span>
                <span className="font-semibold text-[#1e293b]">{customer.name || "-"}</span>
              </div>
              {customer.phone && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">{isBangla ? "মোবাইল:" : "Phone:"}</span>
                  <span className="text-[#334155]">{customer.phone}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">{isBangla ? "ঠিকানা:" : "Address:"}</span>
                  <span className="text-[#334155] truncate max-w-[130px]">
                    {customer.address}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="border-b border-dashed border-[#cbd5e1] my-2" />

          {/* Items Listing */}
          <div className="space-y-2 text-[10.5px]">
            <div className="flex justify-between font-bold border-b border-[#e2e8f0] pb-1 text-[#334155]">
              <span>{isBangla ? "বিবরণ" : "ITEM"}</span>
              <span>{isBangla ? "মোট" : "AMOUNT"}</span>
            </div>
            {items.map((item, idx) => (
              <div key={item.id || idx} className="space-y-0.5">
                <div className="font-medium text-[#1e293b]">{item.name}</div>
                <div className="flex justify-between text-[10px] text-[#475569]">
                  <span>
                    {item.qty} x ৳{item.price.toLocaleString()}
                  </span>
                  <span className="font-semibold text-[#0f172a]">
                    ৳{(item.qty * item.price).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-b border-dashed border-[#cbd5e1] my-2" />

          {/* Totals */}
          <div className="space-y-1 text-[10.5px]">
            <div className="flex justify-between text-[#0f172a]">
              <span>{isBangla ? "মোট:" : "Subtotal:"}</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#e11d48]">
                <span>{isBangla ? "ডিসকাউন্ট:" : "Discount:"}</span>
                <span>-৳{discount.toLocaleString()}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between text-[#0f172a]">
                <span>{isBangla ? "ট্যাক্স:" : "Tax:"}</span>
                <span>৳{tax.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xs pt-1 border-t border-[#cbd5e1] text-[#0f172a]">
              <span>{isBangla ? "সর্বমোট:" : "NET TOTAL:"}</span>
              <span>৳{(subtotal - discount + tax).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#475569]">
              <span>{isBangla ? "পরিশোধ:" : "Paid:"}</span>
              <span>৳{paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#e11d48]">
              <span>{isBangla ? "বকেয়া:" : "Due:"}</span>
              <span>৳{dueAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-b border-dashed border-[#cbd5e1] my-2" />

          {/* Thermal Barcode & Footer */}
          <div className="text-center space-y-1.5 pt-1">
            {returnPolicy && (
              <div className="pt-2 border-t border-dashed border-[#cbd5e1] text-center space-y-0.5">
                <p className="text-[9.5px] font-bold text-[#334155]">
                  {isBangla ? "রিটার্ন ও এক্সচেঞ্জ পলিসি:" : "Return & Exchange Policy:"}
                </p>
                <p className="text-[9px] text-[#475569] font-sans leading-tight">
                  {returnPolicy}
                </p>
              </div>
            )}
            <svg
              className="w-3/5 h-10 mx-auto"
              viewBox="0 0 200 40"
              preserveAspectRatio="none"
            >
              <rect width="200" height="40" fill="#ffffff" />
              <path
                d="M 5 0 V 40 M 8 0 V 40 M 12 0 V 40 M 18 0 V 40 M 20 0 V 40 M 26 0 V 40 M 30 0 V 40 M 32 0 V 40 M 38 0 V 40 M 42 0 V 40 M 48 0 V 40 M 50 0 V 40 M 56 0 V 40 M 60 0 V 40 M 64 0 V 40 M 70 0 V 40 M 72 0 V 40 M 78 0 V 40 M 82 0 V 40 M 88 0 V 40 M 90 0 V 40 M 96 0 V 40 M 100 0 V 40 M 104 0 V 40 M 110 0 V 40 M 114 0 V 40 M 118 0 V 40 M 124 0 V 40 M 128 0 V 40 M 132 0 V 40 M 138 0 V 40 M 142 0 V 40 M 148 0 V 40 M 150 0 V 40 M 156 0 V 40 M 160 0 V 40 M 164 0 V 40 M 170 0 V 40 M 174 0 V 40 M 180 0 V 40 M 184 0 V 40 M 188 0 V 40 M 194 0 V 40"
                stroke="#0f172a"
                strokeWidth="2"
              />
            </svg>
            <p className="font-mono text-[10px] text-[#475569] tracking-wider">
              {invoiceNumber}
            </p>
            {footerNote && (
              <p className="text-[10.5px] text-[#64748b] italic pt-2 border-t border-dashed border-[#e2e8f0]">
                {footerNote}
              </p>
            )}
            <p className="text-[9px] text-[#94a3b8] font-sans pt-1">
              *** {isBangla ? "ধন্যবাদ, আবার আসবেন" : "Thank You, Come Again"} ***
            </p>
          </div>
        </div>
      );
    }

    // Normal A4/A5 Printable Invoice Component
    return (
      <div
        ref={ref}
        className={cn(
          "normal-invoice w-full bg-[#ffffff] text-[#0f172a] rounded-lg shadow-sm p-6 space-y-4 text-xs transition-all duration-300 border border-[#e2e8f0] mx-auto",
          paperSize === "A5" ? "max-w-[400px]" : "max-w-[550px]",
          className
        )}
      >
        {/* Business Header */}
        <div className="text-center space-y-1 pb-3 border-b border-[#f1f5f9]">
          {business.logoUrl && (
            <img
              src={business.logoUrl}
              alt="Business logo"
              className="h-10 max-w-[130px] object-contain mx-auto mb-1"
            />
          )}
          <h2 className="font-bold text-base text-[#0f172a] leading-tight">
            {business.name || (isBangla ? "ব্যবসার নাম" : "Business Name")}
          </h2>
          <div className="text-[11px] text-[#64748b] flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0 text-[#94a3b8]" />
              {business.address || (isBangla ? "ঠিকানা" : "Address")}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3 shrink-0 text-[#94a3b8]" />
              {business.phone || "01XXXXXXXXX"}
            </span>
          </div>
        </div>

        {/* Customer & Invoice Details */}
        <div className="grid grid-cols-2 gap-3 text-[11px] bg-[#f8fafc] p-3 rounded-lg border border-[#f1f5f9]">
          <div className="space-y-1">
            <h3 className="font-semibold text-[#1e293b] text-xs flex items-center gap-1">
              <User className="h-3 w-3 text-[#64748b]" />
              {isBangla ? "গ্রাহকের তথ্য:" : "Bill To / Customer:"}
            </h3>
            <p className="font-medium text-[#0f172a]">
              {customer?.name || (isBangla ? "গ্রাহকের নাম" : "Customer Name")}
            </p>
            {customer?.phone && (
              <p className="text-[#475569] flex items-center gap-1 text-[10.5px]">
                <Phone className="h-2.5 w-2.5 text-[#94a3b8] shrink-0" /> {customer.phone}
              </p>
            )}
            {customer?.address && (
              <p className="text-[#475569] flex items-center gap-1 text-[10.5px]">
                <MapPin className="h-2.5 w-2.5 text-[#94a3b8] shrink-0" /> {customer.address}
              </p>
            )}
          </div>

          <div className="space-y-1 text-right">
            <h3 className="font-semibold text-[#1e293b] text-xs mb-1">
              {isBangla ? "ইনভয়েস তথ্য" : "Invoice Info"}
            </h3>
            <p className="text-[#475569] font-mono text-[10.5px]">
              <span className="text-[#94a3b8] font-sans">
                {isBangla ? "ইনভয়েস নম্বর:" : "Invoice No:"}
              </span>{" "}
              {invoiceNumber}
            </p>
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-[#94a3b8] text-[10.5px]">
                {isBangla ? "স্ট্যাটাস:" : "Status:"}
              </span>
              <span className="bg-[#fff1f2] text-[#e11d48] font-medium px-1.5 py-0.5 rounded text-[9.5px] border border-[#fecdd3] uppercase">
                {status}
              </span>
            </div>
            <p className="text-[#64748b] text-[10.5px]">
              <span className="text-[#94a3b8]">
                {isBangla ? "তারিখ:" : "Date:"}
              </span>{" "}
              {date}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-[#1e293b] text-xs">
            {isBangla ? "পণ্যসমূহ" : "Products"}
          </h3>
          <div className="border border-[#e2e8f0] rounded-md overflow-hidden">
            <div className="grid grid-cols-12 font-semibold text-[#475569] bg-[#f8fafc] px-2.5 py-1.5 border-b border-[#e2e8f0] text-[10.5px]">
              <span className="col-span-5">{isBangla ? "পণ্য" : "Product"}</span>
              <span className="col-span-3 text-right">
                {isBangla ? "একক মূল্য" : "Unit Price"}
              </span>
              <span className="col-span-2 text-center">
                {isBangla ? "পরিমাণ" : "Qty"}
              </span>
              <span className="col-span-2 text-right">{isBangla ? "মোট" : "Total"}</span>
            </div>

            <div className="divide-y divide-[#f1f5f9]">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="grid grid-cols-12 text-[#334155] px-2.5 py-1.5 text-[11px] items-center"
                >
                  <span className="col-span-5 font-medium truncate">{item.name}</span>
                  <span className="col-span-3 text-right">
                    ৳{item.price.toLocaleString()}
                  </span>
                  <span className="col-span-2 text-center">
                    {item.qty} {item.unit || "pc"}
                  </span>
                  <span className="col-span-2 text-right font-medium text-[#0f172a]">
                    ৳{(item.qty * item.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subtotal & Calculations */}
        <div className="space-y-1 text-[11px] pt-1">
          <div className="flex justify-between text-[#475569]">
            <span>{isBangla ? "সাবটোটাল" : "Subtotal"}</span>
            <span>৳{subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[#f43f5e]">
              <span>{isBangla ? "ডিসকাউন্ট" : "Discount"}</span>
              <span>-৳{discount.toLocaleString()}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between text-[#475569]">
              <span>{isBangla ? "ট্যাক্স" : "Tax"}</span>
              <span>৳{tax.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-[#0f172a] text-sm pt-2 mt-1 border-t border-[#e2e8f0]">
            <span>{isBangla ? "সর্বমোট" : "Grand Total"}</span>
            <span className="text-[#0f172a]">
              ৳{(subtotal - discount + tax).toLocaleString()}
            </span>
          </div>

          <div className="pt-1.5 space-y-1 border-t border-[#f1f5f9] text-[10.5px]">
            {inWords && (
              <div className="flex justify-between text-[#64748b]">
                <span>{isBangla ? "কথায়:" : "In Words:"}</span>
                <span className="italic font-medium text-[#334155]">{inWords}</span>
              </div>
            )}
            <div className="flex justify-between text-[#475569]">
              <span>{isBangla ? "পরিশোধিত:" : "Paid Amount:"}</span>
              <span className="text-[#059669] font-semibold">
                ৳{paidAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[#475569]">
              <span>{isBangla ? "বকেয়া:" : "Due Amount:"}</span>
              <span className="text-[#e11d48] font-semibold">
                ৳{dueAmount.toLocaleString()}
              </span>
            </div>
            {changeAmount > 0 && (
              <div className="flex justify-between text-[#475569]">
                <span>{isBangla ? "ফেরত দেওয়া পরিমাণ:" : "Change Amount:"}</span>
                <span className="text-[#d97706]">৳{changeAmount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Policy */}
        {returnPolicy && (
          <div className="pt-2.5 pb-1 border-t border-[#f1f5f9] space-y-1">
            <h4 className="font-semibold text-[10.5px] text-[#334155] flex items-center gap-1">
              <RotateCcw className="h-3 w-3 text-[#64748b]" />
              {isBangla ? "রিটার্ন ও এক্সচেঞ্জ পলিসি:" : "Return & Exchange Policy:"}
            </h4>
            <p className="text-[10px] text-[#64748b] leading-relaxed bg-[#f8fafc] p-2 rounded border border-[#f1f5f9]">
              {returnPolicy}
            </p>
          </div>
        )}

        {/* Barcode */}
        <div className="pt-3 border-t border-[#f1f5f9] text-center space-y-1">
          <div className="inline-block w-full max-w-[280px]">
            <svg className="w-full h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
              <rect width="200" height="40" fill="#ffffff" />
              <path
                d="M 5 0 V 40 M 8 0 V 40 M 12 0 V 40 M 18 0 V 40 M 20 0 V 40 M 26 0 V 40 M 30 0 V 40 M 32 0 V 40 M 38 0 V 40 M 42 0 V 40 M 48 0 V 40 M 50 0 V 40 M 56 0 V 40 M 60 0 V 40 M 64 0 V 40 M 70 0 V 40 M 72 0 V 40 M 88 0 V 40 M 90 0 V 40 M 96 0 V 40 M 100 0 V 40 M 104 0 V 40 M 110 0 V 40 M 114 0 V 40 M 118 0 V 40 M 124 0 V 40 M 128 0 V 40 M 132 0 V 40 M 138 0 V 40 M 142 0 V 40 M 148 0 V 40 M 150 0 V 40 M 156 0 V 40 M 160 0 V 40 M 164 0 V 40 M 170 0 V 40 M 174 0 V 40 M 180 0 V 40 M 184 0 V 40 M 188 0 V 40 M 194 0 V 40"
                stroke="#0f172a"
                strokeWidth="2"
              />
            </svg>
          </div>
          <p className="font-mono text-[10px] text-[#475569] tracking-wider">
            {invoiceNumber}
          </p>
        </div>

        {/* Footer Note */}
        {footerNote && (
          <div className="pt-3 border-t border-dashed border-[#e2e8f0] text-center">
            <p className="text-[10.5px] text-[#64748b] italic">{footerNote}</p>
          </div>
        )}
      </div>
    );
  }
);

InvoiceTemplate.displayName = "InvoiceTemplate";
