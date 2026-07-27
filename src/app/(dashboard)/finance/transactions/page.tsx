"use client";

import React from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Button } from "@/components/ui/premium";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Home,
  Landmark,
  Plus,
  Upload,
  Download,
} from "lucide-react";
import { TransactionSummaryCard } from "@/components/finance/transactions/TransactionSummaryCard";
import { TransactionToolbar } from "@/components/finance/transactions/TransactionToolbar";
import { TransactionFilters } from "@/components/finance/transactions/TransactionFilters";
import { EmptyTransactionsTable } from "@/components/finance/transactions/EmptyTransactionsTable";
import { TransactionLegend } from "@/components/finance/transactions/TransactionLegend";
import { RecentActivityCard } from "@/components/finance/transactions/RecentActivityCard";
import { TransactionQuickActions } from "@/components/finance/transactions/TransactionQuickActions";
import { TransactionInsightsCard } from "@/components/finance/transactions/TransactionInsightsCard";
import { TransactionComingSoonCard } from "@/components/finance/transactions/TransactionComingSoonCard";

export default function TransactionsPage() {
  const { isBangla } = useAppTranslation();

  return (
    <div className="space-y-6 mx-auto pb-24">
      {/* ── Breadcrumb ── */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {isBangla ? "হোম" : "Home"}
              </span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/finance"
              className="flex items-center gap-1.5"
            >
              <Landmark className="h-3.5 w-3.5" />
              <span>
                {isBangla
                  ? "অর্থায়ন ও হিসাববিজ্ঞান"
                  : "Finance & Accounting"}
              </span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isBangla ? "লেনদেন" : "Transactions"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ── Page Header ── */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {isBangla ? "লেনদেন" : "Transactions"}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {isBangla
                    ? "আপনার ব্যবসার প্রতিটি আর্থিক লেনদেন দেখুন এবং পরিচালনা করুন।"
                    : "View and manage every financial transaction across your business."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Action Buttons (Disabled) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              type="button"
              disabled
              className="h-10 rounded-xl text-xs font-medium gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              {isBangla ? "লেনদেন যোগ করুন" : "Add Transaction"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled
              className="h-10 rounded-xl text-xs font-medium gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              {isBangla ? "ইম্পোর্ট" : "Import"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled
              className="h-10 rounded-xl text-xs font-medium gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              {isBangla ? "এক্সপোর্ট" : "Export"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <TransactionSummaryCard isBangla={isBangla} />

      {/* ── Toolbar ── */}
      <TransactionToolbar isBangla={isBangla} />

      {/* ── Advanced Filters ── */}
      <TransactionFilters isBangla={isBangla} />

      {/* ── Main Content: Table + Sidebar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left: Table + Legend */}
        <div className="space-y-4 min-w-0">
          <EmptyTransactionsTable isBangla={isBangla} />
          <TransactionLegend isBangla={isBangla} />
        </div>

        {/* Right: Sidebar (Desktop) / Below table (Mobile) */}
        <div className="space-y-4 order-first xl:order-last">
          <RecentActivityCard isBangla={isBangla} />
          <TransactionQuickActions isBangla={isBangla} />
          <TransactionInsightsCard isBangla={isBangla} />
          <TransactionComingSoonCard isBangla={isBangla} />
        </div>
      </div>
    </div>
  );
}
