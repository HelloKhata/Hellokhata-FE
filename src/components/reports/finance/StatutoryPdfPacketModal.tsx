// Hello Khata OS - Formal Statutory Financial Statements Packet Modal
// হ্যালো খাতা - সংবিধিবদ্ধ অডিট ও বোর্ড-অনুমোদিত আর্থিক বিবরণী প্যাকেট

'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Landmark,
  Printer,
  Download,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  X,
  Share2,
  Scale,
  TrendingUp,
  Wallet,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';

interface StatutoryPdfPacketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isBangla?: boolean;
}

export function StatutoryPdfPacketModal({
  open,
  onOpenChange,
  isBangla = false,
}: StatutoryPdfPacketModalProps) {
  const { formatCurrency } = useCurrency();
  const [activeSection, setActiveSection] = useState<'cover' | 'pnl' | 'balancesheet' | 'cashflow' | 'notes'>('cover');
  const [watermark, setWatermark] = useState<'audited' | 'board' | 'draft'>('audited');
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[96vw] max-h-[92vh] h-[92vh] p-0 overflow-hidden bg-background border-border rounded-2xl flex flex-col shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {isBangla ? 'সংবিধিবদ্ধ আর্থিক বিবরণী প্যাকেট' : 'Statutory Financial Statement Packet'}
          </DialogTitle>
          <DialogDescription>
            {isBangla
              ? 'বোর্ড ও অডিট অনুমোদিত আর্থিক বিবরণী ও কভার পেজ'
              : 'Board & auditor-ready statutory financial statements with cover page'}
          </DialogDescription>
        </DialogHeader>

        {/* Top Modal Navigation & Action Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/80 bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-foreground text-sm">
                  {isBangla ? 'সংবিধিবদ্ধ আর্থিক বিবরণী প্যাকেট' : 'Statutory Financial Statement Packet'}
                </h2>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  IAS/IFRS Compliant
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground block">
                HelloKhata Enterprise Ltd • FY 2025–26 (Period ended 31 August 2026)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Watermark Selector */}
            <div className="hidden sm:flex items-center bg-muted/40 p-0.5 rounded-xl border border-border text-xs">
              <button
                type="button"
                onClick={() => setWatermark('audited')}
                className={cn(
                  'px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer',
                  watermark === 'audited' ? 'bg-card text-emerald-600 font-bold shadow-xs' : 'text-muted-foreground'
                )}
              >
                Audited
              </button>
              <button
                type="button"
                onClick={() => setWatermark('board')}
                className={cn(
                  'px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer',
                  watermark === 'board' ? 'bg-card text-foreground font-bold shadow-xs' : 'text-muted-foreground'
                )}
              >
                Board Review
              </button>
              <button
                type="button"
                onClick={() => setWatermark('draft')}
                className={cn(
                  'px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer',
                  watermark === 'draft' ? 'bg-card text-amber-600 font-bold shadow-xs' : 'text-muted-foreground'
                )}
              >
                Draft
              </button>
            </div>

            <Button
              size="sm"
              onClick={handlePrint}
              className="h-8 px-3 rounded-xl bg-foreground hover:bg-foreground/90 text-background text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBangla ? 'প্রিন্ট / PDF সংরক্ষণ' : 'Print / Save PDF'}</span>
            </Button>
          </div>
        </div>

        {/* Section Tabs Navigation Strip */}
        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-border/60 bg-muted/20 overflow-x-auto shrink-0 text-xs">
          {[
            { id: 'cover', label: 'Cover & Audit Certification', labelBn: 'কভার পেজ ও সনদ' },
            { id: 'pnl', label: '1. Profit or Loss (P&L)', labelBn: '১. লাভ-ক্ষতি বিবরণী' },
            { id: 'balancesheet', label: '2. Balance Sheet', labelBn: '২. ব্যালেন্স শিট' },
            { id: 'cashflow', label: '3. Cash Flow Statement', labelBn: '৩. ক্যাশ ফ্লো' },
            { id: 'notes', label: '4. Significant Policies & Notes', labelBn: '৪. নীতি ও নোটস' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id as any)}
              className={cn(
                'px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap',
                activeSection === sec.id
                  ? 'bg-card text-foreground border border-border shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isBangla ? sec.labelBn : sec.label}
            </button>
          ))}
        </div>

        {/* Scrollable Document Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-muted/10 font-sans flex justify-center">
          {/* Printable Page Canvas (A4 Aspect Ratio) */}
          <div
            ref={printRef}
            className="w-full max-w-[820px] bg-card border border-border/80 shadow-md rounded-2xl p-8 sm:p-12 space-y-6 relative text-foreground"
          >
            {/* Watermark Ribbon */}
            <div className="absolute right-6 top-6 opacity-30 pointer-events-none select-none">
              <span className="font-mono uppercase font-black text-4xl sm:text-5xl text-muted-foreground/40 tracking-widest rotate-[-15deg] block">
                {watermark === 'audited' ? 'CERTIFIED' : watermark === 'board' ? 'BOARD ONLY' : 'DRAFT'}
              </span>
            </div>

            {/* SECTION 1: COVER PAGE & AUDITOR SIGN-OFF */}
            {activeSection === 'cover' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Formal Letterhead */}
                <div className="border-b-2 border-emerald-600 pb-6 text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
                    <Landmark className="w-7 h-7" />
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">
                    HelloKhata Enterprise Limited
                  </h1>
                  <p className="text-xs text-muted-foreground font-mono">
                    Registered Office: Plot 42, Road 11, Banani C/A, Dhaka-1213, Bangladesh
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Incorporation No: C-198420/2026 • Tax Identification No (TIN): 4829-1029-4411 • BIN: 001948290-0101
                  </p>
                </div>

                {/* Packet Title Banner */}
                <div className="text-center space-y-2 py-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold block">
                    Statutory Accounting &amp; Financial Reporting Packet
                  </span>
                  <h2 className="text-3xl font-extrabold text-foreground">
                    FINANCIAL STATEMENTS &amp; AUDIT REVIEW
                  </h2>
                  <span className="inline-block px-3 py-1 rounded-full bg-muted/60 text-xs font-mono font-bold text-foreground">
                    Financial Year: 2025–2026 (Period Ended: 31 August 2026)
                  </span>
                </div>

                {/* Table of Contents Summary */}
                <div className="p-5 rounded-2xl bg-muted/20 border border-border/70 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
                    Table of Statements Included
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-mono font-bold text-[10px]">
                        01
                      </span>
                      <span className="font-semibold">Statement of Profit or Loss (P&amp;L)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-mono font-bold text-[10px]">
                        02
                      </span>
                      <span className="font-semibold">Statement of Financial Position (Balance Sheet)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-mono font-bold text-[10px]">
                        03
                      </span>
                      <span className="font-semibold">Statement of Cash Flows (Direct Method)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-mono font-bold text-[10px]">
                        04
                      </span>
                      <span className="font-semibold">Statement of Changes in Equity</span>
                    </div>
                  </div>
                </div>

                {/* Executive Sign-off Signatures Block */}
                <div className="pt-6 border-t border-border/70 space-y-4">
                  <div className="grid grid-cols-3 gap-6 text-center text-xs">
                    {/* Sign 1: Managing Director */}
                    <div className="space-y-2">
                      <div className="h-16 border-b border-dashed border-border/80 flex items-end justify-center pb-1 font-serif italic text-sm text-foreground/80">
                        Abdur Rahman
                      </div>
                      <span className="font-bold text-foreground block">Abdur Rahman</span>
                      <span className="text-[10px] text-muted-foreground block">Managing Director</span>
                    </div>

                    {/* Sign 2: Chief Financial Officer */}
                    <div className="space-y-2">
                      <div className="h-16 border-b border-dashed border-border/80 flex items-end justify-center pb-1 font-serif italic text-sm text-foreground/80">
                        Tareq Hossain, FCA
                      </div>
                      <span className="font-bold text-foreground block">Tareq Hossain, FCA</span>
                      <span className="text-[10px] text-muted-foreground block">Chief Financial Officer</span>
                    </div>

                    {/* Sign 3: Statutory Audit Seal */}
                    <div className="space-y-2">
                      <div className="h-16 border-b border-dashed border-border/80 flex items-end justify-center pb-1 font-serif italic text-sm text-emerald-600">
                        Certified &amp; Verified
                      </div>
                      <span className="font-bold text-foreground block">A. Qasem &amp; Co.</span>
                      <span className="text-[10px] text-muted-foreground block">Chartered Accountants</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: PROFIT & LOSS STATEMENT */}
            {activeSection === 'pnl' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-border pb-3">
                  <h2 className="text-base font-bold text-foreground uppercase tracking-wide">
                    Statement of Profit or Loss and Other Comprehensive Income
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    For the Period Ended 31 August 2026 • Figures in Bangladeshi Taka (BDT)
                  </p>
                </div>

                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="text-left pb-2">Particulars / Account Head</th>
                      <th className="text-center pb-2">Note</th>
                      <th className="text-right pb-2">31 Aug 2026 (BDT)</th>
                      <th className="text-right pb-2">31 Jul 2026 (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-[11.5px]">
                    <tr className="font-sans font-bold bg-muted/10">
                      <td className="py-2 text-foreground">Gross Operating Revenue</td>
                      <td className="py-2 text-center text-muted-foreground">04</td>
                      <td className="py-2 text-right text-foreground">18,45,200</td>
                      <td className="py-2 text-right text-muted-foreground">17,00,000</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-muted-foreground">Less: Cost of Goods Sold (COGS)</td>
                      <td className="py-1.5 text-center text-muted-foreground">05</td>
                      <td className="py-1.5 text-right text-rose-600">(7,90,395)</td>
                      <td className="py-1.5 text-right text-muted-foreground">(7,58,500)</td>
                    </tr>
                    <tr className="font-bold border-t border-border">
                      <td className="py-2 text-foreground font-sans">GROSS PROFIT</td>
                      <td className="py-2"></td>
                      <td className="py-2 text-right text-foreground font-bold">10,54,805</td>
                      <td className="py-2 text-right text-muted-foreground font-bold">9,41,500</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-muted-foreground">Staff Salaries &amp; Remuneration</td>
                      <td className="py-1.5 text-center text-muted-foreground">06</td>
                      <td className="py-1.5 text-right text-muted-foreground">(2,99,805)</td>
                      <td className="py-1.5 text-right text-muted-foreground">(2,99,805)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-muted-foreground">Shop &amp; Warehouse Rent</td>
                      <td className="py-1.5 text-center text-muted-foreground">07</td>
                      <td className="py-1.5 text-right text-muted-foreground">(1,09,020)</td>
                      <td className="py-1.5 text-right text-muted-foreground">(1,09,020)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-muted-foreground">Utilities, Courier &amp; Administrative</td>
                      <td className="py-1.5 text-center text-muted-foreground">08</td>
                      <td className="py-1.5 text-right text-muted-foreground">(1,63,530)</td>
                      <td className="py-1.5 text-right text-muted-foreground">(1,55,075)</td>
                    </tr>
                    <tr className="font-bold border-t-2 border-b-2 border-border text-sm">
                      <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-sans font-black">
                        NET PROFIT FOR THE PERIOD
                      </td>
                      <td className="py-2.5 text-center"></td>
                      <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-black">
                        ৳4,82,450
                      </td>
                      <td className="py-2.5 text-right text-foreground font-bold">
                        ৳4,04,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SECTION 3: BALANCE SHEET */}
            {activeSection === 'balancesheet' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-border pb-3">
                  <h2 className="text-base font-bold text-foreground uppercase tracking-wide">
                    Statement of Financial Position (Balance Sheet)
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    As of 31 August 2026 • Figures in Bangladeshi Taka (BDT)
                  </p>
                </div>

                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="text-left pb-2">Assets &amp; Liabilities Head</th>
                      <th className="text-center pb-2">Note</th>
                      <th className="text-right pb-2">31 Aug 2026</th>
                      <th className="text-right pb-2">31 Jul 2026</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-[11.5px]">
                    <tr className="font-bold font-sans bg-muted/10">
                      <td className="py-1.5">CURRENT ASSETS</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-muted-foreground">Cash in Hand &amp; Vaults</td>
                      <td className="py-1.5 text-center text-muted-foreground">09</td>
                      <td className="py-1.5 text-right">2,15,000</td>
                      <td className="py-1.5 text-right text-muted-foreground">1,80,000</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-muted-foreground">Bank Balances &amp; MFS Wallets</td>
                      <td className="py-1.5 text-center text-muted-foreground">10</td>
                      <td className="py-1.5 text-right">5,70,900</td>
                      <td className="py-1.5 text-right text-muted-foreground">4,60,000</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-muted-foreground">Trade Receivables (Customer Dues)</td>
                      <td className="py-1.5 text-center text-muted-foreground">11</td>
                      <td className="py-1.5 text-right">3,24,500</td>
                      <td className="py-1.5 text-right text-muted-foreground">3,45,000</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-muted-foreground">Merchandise Inventory Value</td>
                      <td className="py-1.5 text-center text-muted-foreground">12</td>
                      <td className="py-1.5 text-right">21,34,600</td>
                      <td className="py-1.5 text-right text-muted-foreground">20,80,000</td>
                    </tr>
                    <tr className="font-bold border-t border-border">
                      <td className="py-2 text-foreground font-sans">TOTAL ASSETS</td>
                      <td></td>
                      <td className="py-2 text-right text-foreground font-bold">32,45,000</td>
                      <td className="py-2 text-right text-muted-foreground font-bold">30,65,000</td>
                    </tr>

                    <tr className="font-bold font-sans bg-muted/10 pt-2">
                      <td className="py-1.5">LIABILITIES &amp; OWNERS EQUITY</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-muted-foreground">Accounts Payable (Suppliers)</td>
                      <td className="py-1.5 text-center text-muted-foreground">13</td>
                      <td className="py-1.5 text-right">1,95,000</td>
                      <td className="py-1.5 text-right text-muted-foreground">2,10,000</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-muted-foreground">Short-Term Working Capital Loan</td>
                      <td className="py-1.5 text-center text-muted-foreground">14</td>
                      <td className="py-1.5 text-right">2,50,000</td>
                      <td className="py-1.5 text-right text-muted-foreground">2,75,000</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-muted-foreground">Owner Capital &amp; Retained Earnings</td>
                      <td className="py-1.5 text-center text-muted-foreground">15</td>
                      <td className="py-1.5 text-right">27,60,000</td>
                      <td className="py-1.5 text-right text-muted-foreground">25,42,000</td>
                    </tr>
                    <tr className="font-bold border-t-2 border-b-2 border-border text-sm">
                      <td className="py-2.5 text-foreground font-sans font-black">
                        TOTAL LIABILITIES &amp; EQUITY
                      </td>
                      <td></td>
                      <td className="py-2.5 text-right text-foreground font-black">
                        ৳32,45,000
                      </td>
                      <td className="py-2.5 text-right text-muted-foreground font-bold">
                        ৳30,65,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SECTION 4: CASH FLOW */}
            {activeSection === 'cashflow' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-border pb-3">
                  <h2 className="text-base font-bold text-foreground uppercase tracking-wide">
                    Statement of Cash Flows (Direct Method)
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    For the Month Ended 31 August 2026
                  </p>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between font-bold border-b border-border pb-1">
                    <span>Opening Cash &amp; Bank Balance</span>
                    <span>৳6,40,000</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>(+) Operating Cash Inflows</span>
                    <span>+৳14,20,000</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>(-) Operating &amp; Supplier Cash Outflows</span>
                    <span>-৳12,74,100</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm border-t-2 border-border pt-2 text-foreground">
                    <span>Closing Cash &amp; Bank Liquidity</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">৳7,85,900</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: ACCOUNTING POLICIES & NOTES */}
            {activeSection === 'notes' && (
              <div className="space-y-4 animate-in fade-in duration-200 text-xs text-muted-foreground leading-relaxed">
                <h2 className="text-base font-bold text-foreground uppercase">
                  Notes to the Financial Statements
                </h2>
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">1. Legal Status &amp; Accounting Standards</h4>
                  <p>
                    HelloKhata Enterprise Ltd is an incorporated SME in Bangladesh. These financial statements have been prepared in accordance with International Financial Reporting Standards (IFRS for SMEs) and National Board of Revenue (NBR) statutory provisions.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">2. Basis of Preparation &amp; Inventory Valuation</h4>
                  <p>
                    Financial statements are prepared under the historical cost convention on an accrual basis. Merchandise inventory is valued at lower of cost or net realizable value (NRV) using the Weighted Average Cost (WAC) method.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
