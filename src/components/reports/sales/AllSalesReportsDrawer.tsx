// Hello Khata OS - All Sales Reports Directory Drawer
// হ্যালো খাতা - সকল বিক্রয় রিপোর্ট ডিরেক্টরি ড্রয়ার

'use client';

import React from 'react';
import { useSalesFocus } from './SalesFocusContext';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Package,
  Layers,
  Users,
  UserCheck,
  Building2,
  CreditCard,
  RotateCcw,
  FileText,
  ArrowRight,
  Download,
  Printer,
  Sparkles,
} from 'lucide-react';
import { DriverDimension } from '@/types/sales-report';

interface AllSalesReportsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onExportCsv?: () => void;
  onPrintReport?: () => void;
}

export function AllSalesReportsDrawer({
  isOpen,
  onClose,
  onExportCsv,
  onPrintReport,
}: AllSalesReportsDrawerProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const {
    setActiveDimension,
    setBreakdownDrawerOpen,
    clearFocus,
    reportData,
  } = useSalesFocus();

  const reportsList: {
    id: string;
    titleEn: string;
    titleBn: string;
    descriptionEn: string;
    descriptionBn: string;
    icon: any;
    tagEn: string;
    tagBn: string;
    metricValue: string;
    action: () => void;
  }[] = [
    {
      id: 'overview',
      titleEn: 'Executive Sales Summary Report',
      titleBn: 'কার্যনির্বাহী বিক্রয় সারসংক্ষেপ রিপোর্ট',
      descriptionEn: 'High-level business overview with net revenue, growth comparison, and order pulse.',
      descriptionBn: 'নিট আয়, প্রবৃদ্ধি তুলনা এবং মোট অর্ডার সহ সামগ্রিক ব্যবসায়িক চিত্র।',
      icon: BarChart3,
      tagEn: 'Primary',
      tagBn: 'প্রধান',
      metricValue: formatCurrency(reportData.summary.netSales),
      action: () => {
        clearFocus();
        onClose();
      },
    },
    {
      id: 'products',
      titleEn: 'Item & Product Sales Report',
      titleBn: 'আইটেম ও পণ্যভিত্তিক বিক্রয় রিপোর্ট',
      descriptionEn: 'SKU-level sales volume, fast-moving items, revenue share, and stock velocity.',
      descriptionBn: 'প্রতিটি পণ্যের মোট বিক্রয় সংখ্যা, দ্রুত চলমান পণ্য ও আয়ের অংশ।',
      icon: Package,
      tagEn: 'Driver',
      tagBn: 'পণ্য',
      metricValue: `${formatNumber(reportData.drivers.products.length)} Items`,
      action: () => {
        setActiveDimension('products');
        onClose();
      },
    },
    {
      id: 'categories',
      titleEn: 'Category Performance Report',
      titleBn: 'ক্যাটাগরিভিত্তিক বিক্রয় পারফরম্যান্স',
      descriptionEn: 'Revenue distribution and growth rate across different product categories.',
      descriptionBn: 'বিভিন্ন ক্যাটাগরির পণ্য থেকে অর্জিত রাজস্ব ও প্রবৃদ্ধির হার।',
      icon: Layers,
      tagEn: 'Analytics',
      tagBn: 'অ্যানালিটিক্স',
      metricValue: `${formatNumber(reportData.drivers.categories.length)} Categories`,
      action: () => {
        setActiveDimension('categories');
        onClose();
      },
    },
    {
      id: 'customers',
      titleEn: 'Customer Sales & Ledger Report',
      titleBn: 'গ্রাহকভিত্তিক বিক্রয় ও লেজার রিপোর্ট',
      descriptionEn: 'Top purchasing clients, B2B wholesale buyers, transaction frequency, and receivables.',
      descriptionBn: 'শীর্ষ ক্রেতা, পাইকারি কাস্টমার ও তাদের কেনাকাটার ফ্রিকোয়েন্সি।',
      icon: Users,
      tagEn: 'Parties',
      tagBn: 'পার্টি',
      metricValue: `${formatNumber(reportData.drivers.customers.length)} Buyers`,
      action: () => {
        setActiveDimension('customers');
        onClose();
      },
    },
    {
      id: 'salespeople',
      titleEn: 'Salesperson & Staff Performance Report',
      titleBn: 'বিক্রয়কর্মী ও স্টাফ পারফরম্যান্স রিপোর্ট',
      descriptionEn: 'Individual sales rep revenue targets, orders converted, and performance ranking.',
      descriptionBn: 'প্রতিটি সেলস প্রতিনিধির অর্জিত সেলস এবং টার্গেট পূরণের হিসাব।',
      icon: UserCheck,
      tagEn: 'Staff',
      tagBn: 'স্টাফ',
      metricValue: `${formatNumber(reportData.drivers.salespeople.length)} Staff`,
      action: () => {
        setActiveDimension('salespeople');
        onClose();
      },
    },
    {
      id: 'branches',
      titleEn: 'Branch & Counter Performance Report',
      titleBn: 'শাখা ও কাউন্টারভিত্তিক বিক্রয় রিপোর্ট',
      descriptionEn: 'Multi-branch comparison, regional sales contributions, and branch growth.',
      descriptionBn: 'বিভিন্ন ব্রাঞ্চের মধ্যে বিক্রয় তুলনা এবং আঞ্চলিক অবদান।',
      icon: Building2,
      tagEn: 'Multi-Branch',
      tagBn: 'শাখা',
      metricValue: `${formatNumber(reportData.drivers.branches.length)} Branches`,
      action: () => {
        setActiveDimension('branches');
        onClose();
      },
    },
    {
      id: 'payments',
      titleEn: 'Payment Methods & Collection Report',
      titleBn: 'পেমেন্ট মেথড ও কালেকশন রিপোর্ট',
      descriptionEn: 'Breakdown across Cash, bKash, Nagad, Bank Transfer, and Customer Credit.',
      descriptionBn: 'নগদ ক্যাশ, বিকাশ, নগদ ও ব্যাংক মাধ্যমে মোট আদায়কৃত টাকার হিসাব।',
      icon: CreditCard,
      tagEn: 'Settlement',
      tagBn: 'পেমেন্ট',
      metricValue: `${formatNumber(reportData.drivers.payments.length)} Methods`,
      action: () => {
        setActiveDimension('payments');
        onClose();
      },
    },
    {
      id: 'returns',
      titleEn: 'Sales Returns & Deductions Breakdown',
      titleBn: 'বিক্রয় ফেরত ও ডিসকাউন্ট বিশদ বিবরণী',
      descriptionEn: 'Detailed waterfall audit of Gross Sales, Discounts (−৳), and Customer Returns (−৳).',
      descriptionBn: 'মোট চালান মূল্য, ডিসকাউন্ট এবং পণ্য ফেরতের সম্পূর্ণ হিসাব প্রবাহ।',
      icon: RotateCcw,
      tagEn: 'Audit',
      tagBn: 'অডিট',
      metricValue: `−${formatCurrency(reportData.summary.returns)}`,
      action: () => {
        onClose();
        setBreakdownDrawerOpen(true);
      },
    },
    {
      id: 'transactions',
      titleEn: 'Sales Invoice Audit Ledger',
      titleBn: 'বিক্রয় ইনভয়েস অডিট লেজার',
      descriptionEn: 'Full granular transaction log with customer, items, salesperson, and payment status.',
      descriptionBn: 'প্রতিটি চালানের বিশদ বিবরণী ও প্রিন্ট সুবিধা।',
      icon: FileText,
      tagEn: 'Invoices',
      tagBn: 'চালান',
      metricValue: `${formatNumber(reportData.records.length)} Invoices`,
      action: () => {
        onClose();
        const recordsEl = document.querySelector('#sales-records-section');
        if (recordsEl) {
          recordsEl.scrollIntoView({ behavior: 'smooth' });
        }
      },
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-6 overflow-y-auto flex flex-col justify-between">
        <div className="space-y-5">
          <SheetHeader className="space-y-1 text-left pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>{isBangla ? 'সকল বিক্রয় রিপোর্ট ডিরেক্টরি' : 'All Sales Reports Directory'}</span>
              </SheetTitle>
            </div>
            <SheetDescription className="text-xs text-muted-foreground">
              {isBangla
                ? 'হ্যালো খাতার সকল বিক্রয় সংক্রান্ত রিপোর্ট এখান থেকেই সরাসরি এক্সেস ও এক্সপোর্ট করুন'
                : 'Access, view, and export every sales report dimension directly from here'}
            </SheetDescription>
          </SheetHeader>

          {/* Report Directory Cards */}
          <div className="space-y-2.5">
            {reportsList.map((rep) => {
              const Icon = rep.icon;
              return (
                <div
                  key={rep.id}
                  onClick={rep.action}
                  className="p-3.5 rounded-xl border border-border/60 bg-card hover:bg-muted/50 hover:border-primary/40 cursor-pointer transition-all group flex items-center justify-between gap-3 select-none"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {isBangla ? rep.titleBn : rep.titleEn}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                        {isBangla ? rep.descriptionBn : rep.descriptionEn}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right flex items-center gap-2">
                    <div className="hidden sm:block">
                      <div className="text-xs font-bold text-foreground font-mono">
                        {rep.metricValue}
                      </div>
                      <span className="text-[10px] bg-muted px-1.5 py-0.2 rounded text-muted-foreground">
                        {isBangla ? rep.tagBn : rep.tagEn}
                      </span>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="text-xs gap-1.5 w-full"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{isBangla ? 'সম্পূর্ণ CSV ডাউনলোড' : 'Export Full CSV'}</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onPrintReport}
            className="text-xs gap-1.5 w-full font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'রিপোর্ট প্রিন্ট / PDF' : 'Print / PDF Report'}</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
