// Hello Khata OS - Print Report Preview Engine
// হ্যালো খাতা - প্রিন্ট রিপোর্ট প্রিভিউ ইঞ্জিন

'use client';

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, X, Eye, FileText, Sliders, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Reusable column definition
export interface ReportColumn<T> {
  header: string;
  headerBn?: string;
  accessor: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  footer?: React.ReactNode;
}

interface PrintReportPreviewProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  businessName: string;
  branchName: string;
  businessAddress?: string;
  contactInfo?: string;
  userName?: string;
  dateRange: { start?: string; end?: string; period: string };
  activeFilters: Record<string, string>;
  kpis: {
    label: string;
    labelBn?: string;
    value: string | number;
  }[];
  data: T[];
  columns: ReportColumn<T>[];
  paymentBreakdown?: { name: string; value: number }[];
  branchBreakdown?: { name: string; revenue: number; orders: number; profit: number }[];
  productBreakdown?: { name: string; qty: number; revenue: number }[];
  isBangla?: boolean;
  formatCurrency: (val: number) => string;
}

export function PrintReportPreview({
  isOpen,
  onClose,
  title,
  titleBn,
  subtitle,
  subtitleBn,
  businessName,
  branchName,
  businessAddress = 'ঢাকা, বাংলাদেশ',
  contactInfo = '+৮৮০ ১৭০০০-০০০০০',
  userName = 'Owner',
  dateRange,
  activeFilters,
  kpis,
  data,
  columns,
  paymentBreakdown = [],
  branchBreakdown = [],
  productBreakdown = [],
  isBangla = false,
  formatCurrency,
}: PrintReportPreviewProps<any>) {
  
  if (!isOpen) return null;

  const displayTitle = isBangla && titleBn ? titleBn : title;
  const displaySubtitle = isBangla && subtitleBn ? subtitleBn : subtitle;
  const timestamp = format(new Date(), 'dd MMM yyyy, hh:mm a');

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-start overflow-y-auto p-4 md:p-8 print:p-0 print:bg-white print:absolute print:inset-0 print:overflow-visible">
      
      {/* Print Preview Top Actions Bar */}
      <div className="flex items-center justify-between gap-4 w-full max-w-[210mm] bg-muted border border-border/80 p-3.5 rounded-t-xl shadow-md print:hidden shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">
            {isBangla ? 'রিপোর্ট প্রিন্ট প্রিভিউ' : 'Report Print Preview'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} className="bg-primary hover:bg-primary/95 text-xs h-8 gap-1.5 font-semibold">
            <Printer className="w-3.5 h-3.5" />
            {isBangla ? 'প্রিন্ট করুন' : 'Print'}
          </Button>
          <Button onClick={handlePrint} variant="secondary" className="text-xs h-8 gap-1.5 font-semibold">
            <Download className="w-3.5 h-3.5" />
            {isBangla ? 'পিডিএফ সেভ' : 'Save PDF'}
          </Button>
          <Button onClick={onClose} variant="ghost" className="h-8 w-8 p-0 hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="w-full max-w-[210mm] bg-white border-x border-b border-slate-300 p-8 shadow-2xl rounded-b-xl min-h-[297mm] overflow-y-auto flex flex-col text-slate-900 select-none print:border-none print:shadow-none print:p-0 print:bg-white print:text-black print:overflow-visible print:w-full print:min-h-0 print:rounded-none">
        
        {/* Style block for A4 page break configuration */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
              font-size: 11px !important;
            }
            header, footer, nav, aside, button, .print\\:hidden {
              display: none !important;
            }
            .print\\:block-doc {
              display: block !important;
              position: static !important;
              width: 100% !important;
              height: auto !important;
              padding: 0 !important;
              box-shadow: none !important;
            }
            @page {
              size: A4 portrait;
              margin: 15mm 12mm 15mm 12mm;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            tr {
              page-break-inside: avoid;
            }
            .page-break {
              page-break-before: always;
            }
          }
        `}} />

        {/* HTML Print Layout Engine wrapper Table (thead/tfoot grouping) */}
        <table className="w-full border-collapse">
          
          {/* Repeating Page Header */}
          <thead>
            <tr>
              <td>
                <div className="border-b-2 border-slate-900 pb-4 mb-6">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    {/* Left: Brand / Business Address */}
                    <div className="space-y-1 text-left">
                      <h2 className="text-xl font-bold text-slate-950 uppercase tracking-tight">{businessName}</h2>
                      <p className="text-xs text-slate-600 font-medium">
                        {isBangla ? 'শাখা:' : 'Branch:'} <span className="font-semibold text-slate-950">{branchName}</span>
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium max-w-[280px] leading-relaxed">
                        {businessAddress}
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {isBangla ? 'যোগাযোগ:' : 'Contact:'} {contactInfo}
                      </p>
                    </div>

                    {/* Right: Report title & Metadata */}
                    <div className="text-right space-y-1">
                      <h1 className="text-2xl font-black uppercase tracking-wider text-slate-950">{displayTitle}</h1>
                      {displaySubtitle && <p className="text-xs text-slate-600 font-medium">{displaySubtitle}</p>}
                      
                      <div className="text-[11px] text-slate-600 font-medium pt-2 space-y-0.5">
                        <div>
                          <span className="font-semibold text-slate-800">{isBangla ? 'তারিখসীমা:' : 'Date Range:'}</span>{' '}
                          {dateRange.start ? `${dateRange.start} - ${dateRange.end}` : (isBangla ? 'সকল সময়' : 'All Time')}
                          {dateRange.period && ` (${dateRange.period})`}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">{isBangla ? 'জেনারেট ডেট:' : 'Generated At:'}</span> {timestamp}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">{isBangla ? 'কর্তৃক:' : 'Generated By:'}</span> {userName}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </thead>

          {/* Main Content Body */}
          <tbody>
            <tr>
              <td>
                <div className="space-y-6">

                  {/* 3. Main Data Details Table */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                      {isBangla ? 'বিক্রয় বিস্তারিত বিবরণী' : 'Sales Details Ledger'}
                    </h3>
                    
                    {data.length > 0 ? (
                      <div className="border border-slate-300 rounded-lg overflow-hidden">
                        <table className="w-full text-[11px] text-left border-collapse">
                          <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-900">
                            <tr>
                              {columns.map((col, idx) => (
                                <th 
                                  key={idx} 
                                  className={cn(
                                    "p-2.5", 
                                    col.align === 'right' ? "text-right" : col.align === 'center' ? "text-center" : "text-left"
                                  )}
                                >
                                  {isBangla && col.headerBn ? col.headerBn : col.header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((row, rowIdx) => (
                              <tr 
                                key={rowIdx} 
                                className="border-b border-slate-200 hover:bg-slate-50/50 bg-white"
                              >
                                {columns.map((col, colIdx) => (
                                  <td 
                                    key={colIdx} 
                                    className={cn(
                                      "p-2.5 font-medium text-slate-800",
                                      col.align === 'right' ? "text-right font-mono" : col.align === 'center' ? "text-center" : "text-left"
                                    )}
                                  >
                                    {col.accessor(row)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                            {/* Totals Row */}
                            {columns.some(c => c.footer !== undefined) && (
                              <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-900">
                                {columns.map((col, idx) => (
                                  <td 
                                    key={idx} 
                                    className={cn(
                                      "p-2.5", 
                                      col.align === 'right' ? "text-right font-mono" : col.align === 'center' ? "text-center" : "text-left"
                                    )}
                                  >
                                    {col.footer || ''}
                                  </td>
                                ))}
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 border border-dashed border-slate-300 text-center text-slate-500 text-xs rounded-lg">
                        {isBangla ? 'নির্বাচিত ফিল্টার সীমার মধ্যে কোনো বিক্রয় পাওয়া যায়নি।' : 'No sales records found for the selected filters.'}
                      </div>
                    )}
                  </div>

                  {/* 4. Optional Breakdown Tables (Only render if has data) */}
                  {(paymentBreakdown.length > 0 || branchBreakdown.length > 0 || productBreakdown.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 page-break">
                      
                      {/* Left side: Payment method & Branch breakdowns */}
                      <div className="space-y-6">
                        {paymentBreakdown.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-wider">
                              {isBangla ? 'পেমেন্ট পদ্ধতি ভিত্তিক সংক্ষেপ' : 'Sales by Payment Method'}
                            </h4>
                            <div className="border border-slate-300 rounded-lg overflow-hidden">
                              <table className="w-full text-[10px] text-left border-collapse">
                                <thead className="bg-slate-50 border-b font-semibold text-slate-700">
                                  <tr>
                                    <th className="p-2">{isBangla ? 'পদ্ধতি' : 'Method'}</th>
                                    <th className="p-2 text-right">{isBangla ? 'বিক্রয়ের পরিমাণ' : 'Revenue'}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {paymentBreakdown.map((pm, idx) => (
                                    <tr key={idx} className="border-b bg-white text-slate-800">
                                      <td className="p-2 font-medium">{pm.name}</td>
                                      <td className="p-2 text-right font-mono font-bold">{formatCurrency(pm.value)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {branchBreakdown.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-wider">
                              {isBangla ? 'শাখাভিত্তিক বিক্রয় সংক্ষেপ' : 'Sales by Branch'}
                            </h4>
                            <div className="border border-slate-300 rounded-lg overflow-hidden">
                              <table className="w-full text-[10px] text-left border-collapse">
                                <thead className="bg-slate-50 border-b font-semibold text-slate-700">
                                  <tr>
                                    <th className="p-2">{isBangla ? 'শাখা' : 'Branch'}</th>
                                    <th className="p-2 text-right">{isBangla ? 'অর্ডার' : 'Orders'}</th>
                                    <th className="p-2 text-right">{isBangla ? 'রাজস্ব' : 'Revenue'}</th>
                                    <th className="p-2 text-right">{isBangla ? 'মুনাফা' : 'Profit'}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {branchBreakdown.map((b, idx) => (
                                    <tr key={idx} className="border-b bg-white text-slate-800">
                                      <td className="p-2 font-medium">{b.name}</td>
                                      <td className="p-2 text-right font-medium">{b.orders}</td>
                                      <td className="p-2 text-right font-mono font-bold">{formatCurrency(b.revenue)}</td>
                                      <td className="p-2 text-right font-mono text-emerald-700 font-bold">{formatCurrency(b.profit)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right side: Top Selling Products */}
                      {productBreakdown.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-wider">
                            {isBangla ? 'শীর্ষ ১০ বিক্রিত পণ্য' : 'Top 10 Selling Products'}
                          </h4>
                          <div className="border border-slate-300 rounded-lg overflow-hidden">
                            <table className="w-full text-[10px] text-left border-collapse">
                              <thead className="bg-slate-50 border-b font-semibold text-slate-700">
                                <tr>
                                  <th className="p-2">{isBangla ? 'পণ্য' : 'Product'}</th>
                                  <th className="p-2 text-right">{isBangla ? 'বিক্রিত পরিমাণ' : 'Qty'}</th>
                                  <th className="p-2 text-right">{isBangla ? 'রাজস্ব' : 'Revenue'}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {productBreakdown.slice(0, 10).map((prod, idx) => (
                                  <tr key={idx} className="border-b bg-white text-slate-800">
                                    <td className="p-2 font-medium">{prod.name}</td>
                                    <td className="p-2 text-right font-semibold">{prod.qty}</td>
                                    <td className="p-2 text-right font-mono font-bold">{formatCurrency(prod.revenue)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </td>
            </tr>
          </tbody>

          {/* Repeating Page Footer */}
          <tfoot>
            <tr>
              <td>
                <div className="border-t border-slate-300 pt-3 mt-6 flex justify-between items-center text-[9px] text-slate-500 font-medium">
                  <div>
                    {isBangla ? 'হ্যালো খাতা ইআরপি দ্বারা জেনারেটকৃত' : 'Generated by HelloKhata ERP'}
                  </div>
                  <div>
                    {isBangla ? 'প্রিন্ট সময়:' : 'Report Time:'} {timestamp}
                  </div>
                  <div className="print:hidden">
                    {isBangla ? 'পৃষ্ঠা প্রিভিউ' : 'Page Preview'}
                  </div>
                  <div className="hidden print:block text-right">
                    {isBangla ? 'পৃষ্ঠা নম্বর' : 'Page '} <span className="after:content-[counter(page)] font-semibold"></span>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>

        </table>

      </div>

    </div>
  );
}
