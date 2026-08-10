'use client';

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, KPICard, Badge } from '@/components/ui/premium';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import {
  Wallet,
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  FileClock,
  Landmark,
  BarChart3,
  Activity,
  Scale,
  Calendar,
  Download,
  RefreshCw,
  ClipboardList,
  CalendarClock,
  Sparkles,
  ChevronRight,
  CheckSquare,
  ReceiptText,
  FolderTree,
  ArrowRight,
  Plus,
  Minus,
  ArrowLeftRight,
  Sliders,
  Settings,
} from 'lucide-react';

export default function FinanceOverviewPage() {
  const { isBangla } = useAppTranslation();

  // Quick Action card details
  const quickActions = [
    {
      title: 'Add Expense',
      titleBn: 'খরচ যোগ করুন',
      desc: 'Record a new operational expense',
      descBn: 'একটি নতুন পরিচালন ব্যয় রেকর্ড করুন',
      icon: Minus,
      iconColor: 'text-warning bg-warning-subtle',
    },
    {
      title: 'Record Income',
      titleBn: 'আয় রেকর্ড করুন',
      desc: 'Log non-POS business income stream',
      descBn: 'নন-পিওএস ব্যবসায়ের আয়ের উৎস রেকর্ড করুন',
      icon: Plus,
      iconColor: 'text-emerald bg-emerald-subtle',
    },
    {
      title: 'Deposit Cash',
      titleBn: 'নগদ জমা',
      desc: 'Deposit cash into a bank account',
      descBn: 'ব্যাংক অ্যাকাউন্টে নগদ জমা করুন',
      icon: ArrowRight,
      iconColor: 'text-indigo bg-indigo-subtle',
    },
    {
      title: 'Withdraw Cash',
      titleBn: 'নগদ উত্তোলন',
      desc: 'Withdraw cash from bank or wallet',
      descBn: 'ব্যাংক বা ওয়ালেট থেকে নগদ উত্তোলন করুন',
      icon: Wallet,
      iconColor: 'text-indigo bg-indigo-subtle',
    },
    {
      title: 'View Reports',
      titleBn: 'রিপোর্ট দেখুন',
      desc: 'Analyze P&L and Balance Sheet',
      descBn: 'লাভ-ক্ষতি ও ব্যালেন্স শীট বিশ্লেষণ করুন',
      icon: FileSpreadsheet,
      iconColor: 'text-indigo bg-indigo-subtle',
    },
    {
      title: 'Manage Loans',
      titleBn: 'ঋণ পরিচালনা',
      desc: 'Manage liabilities and repayments',
      descBn: 'দায় ও ঋণ পরিশোধ পরিচালনা করুন',
      icon: Landmark,
      iconColor: 'text-destructive bg-destructive-subtle',
    },
    {
      title: 'Manage Bank Accounts',
      titleBn: 'ব্যাংক হিসাব',
      desc: 'Configure connected accounts',
      descBn: 'সংযুক্ত অ্যাকাউন্টগুলি কনফিগার করুন',
      icon: Building2,
      iconColor: 'text-indigo bg-indigo-subtle',
    },
    {
      title: 'Manage Chart of Accounts',
      titleBn: 'হিসাব তালিকা',
      desc: 'Structure your ledger categories',
      descBn: 'আপনার খতিয়ান ক্যাটাগরিগুলি সাজান',
      icon: FolderTree,
      iconColor: 'text-indigo bg-indigo-subtle',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground">
                  {isBangla ? 'ড্যাশবোর্ড' : 'Dashboard'}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-muted-foreground">
                  {isBangla ? 'অর্থায়ন ও হিসাববিজ্ঞান' : 'Finance & Accounting'}
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground">
                  {isBangla ? 'ওভারভিউ' : 'Overview'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isBangla ? 'অর্থায়ন ও হিসাববিজ্ঞান' : 'Finance & Accounting'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isBangla
              ? 'এক নজরে আপনার ব্যবসায়ের সম্পূর্ণ আর্থিক স্বাস্থ্য পর্যবেক্ষণ করুন।'
              : 'Monitor your complete business financial health in one place.'}
          </p>
        </div>

        {/* Header Controls (Date range, Export, Refresh placeholders) */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="h-9 px-3 bg-muted/30 border border-border-subtle rounded-xl flex items-center gap-2 text-xs font-semibold text-muted-foreground cursor-not-allowed">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{isBangla ? 'গত ৩০ দিন' : 'Last 30 Days'}</span>
          </div>
          <button className="h-9 px-3 bg-muted/30 border border-border-subtle rounded-xl flex items-center gap-2 text-xs font-semibold text-muted-foreground cursor-not-allowed" disabled>
            <Download className="h-3.5 w-3.5 shrink-0" />
            <span>{isBangla ? 'রপ্তানি' : 'Export'}</span>
          </button>
          <button className="h-9 w-9 bg-muted/30 border border-border-subtle rounded-xl flex items-center justify-center text-muted-foreground cursor-not-allowed" disabled>
            <RefreshCw className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      </div>

      {/* 2. FINANCIAL HEALTH SUMMARY BANNER */}
      <Card className="border border-[rgba(255,255,255,0.06)] bg-gradient-to-br from-primary/5 to-indigo/5 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-indigo/5 to-transparent pointer-events-none" />
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>{isBangla ? 'আর্থিক স্বাস্থ্য' : 'Financial Health'}</span>
          </CardTitle>
          <CardDescription>
            {isBangla ? 'আপনার ব্যবসায়ের আর্থিক অবস্থানের দ্রুত সারাংশ।' : 'Quick summary of your business financial position.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <HealthIndicator
              title={isBangla ? 'নগদ অবস্থান' : 'Cash Position'}
              status="healthy"
              statusLabel={isBangla ? 'স্বাস্থ্যকর' : 'Healthy'}
            />
            <HealthIndicator
              title={isBangla ? 'প্রাপ্য স্বাস্থ্য' : 'Receivable Health'}
              status="warning"
              statusLabel={isBangla ? 'সতর্কতা' : 'Warning'}
            />
            <HealthIndicator
              title={isBangla ? 'ব্যয় নিয়ন্ত্রণ' : 'Expense Control'}
              status="attention"
              statusLabel={isBangla ? 'মনোযোগ প্রয়োজন' : 'Attention'}
            />
            <HealthIndicator
              title={isBangla ? 'লাভজনকতা' : 'Profitability'}
              status="comingSoon"
              statusLabel={isBangla ? 'শীঘ্রই আসছে' : 'Coming Soon'}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. KPI CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialStatCard
          title={isBangla ? 'নগদ ব্যালেন্স' : 'Cash Balance'}
          desc={isBangla ? 'বর্তমানে উপলব্ধ নগদ টাকা' : 'Current available cash'}
          icon={Wallet}
          iconColor="indigo"
          isBangla={isBangla}
        />
        <FinancialStatCard
          title={isBangla ? 'ব্যাংক ব্যালেন্স' : 'ব্যাংক ব্যালেন্স'}
          desc={isBangla ? 'সব ব্যাংক হিসাবের মোট ব্যালেন্স' : 'Combined balance across bank accounts'}
          icon={Building2}
          iconColor="indigo"
          isBangla={isBangla}
        />
        <FinancialStatCard
          title={isBangla ? 'মাসিক আয়' : 'Monthly Income'}
          desc={isBangla ? 'চলতি মাসে রেকর্ডকৃত মোট আয়' : 'Income recorded this month'}
          icon={TrendingUp}
          iconColor="emerald"
          isBangla={isBangla}
        />
        <FinancialStatCard
          title={isBangla ? 'মাসিক ব্যয়' : 'Monthly Expenses'}
          desc={isBangla ? 'চলতি মাসে রেকর্ডকৃত মোট ব্যয়' : 'Expenses recorded this month'}
          icon={TrendingDown}
          iconColor="warning"
          isBangla={isBangla}
        />
        <FinancialStatCard
          title={isBangla ? 'নিট মুনাফা' : 'Net Profit'}
          desc={isBangla ? 'চলতি মাসে নিট আয় বা লাভ' : 'Net profit recorded this month'}
          icon={DollarSign}
          iconColor="emerald"
          isBangla={isBangla}
        />
        <FinancialStatCard
          title={isBangla ? 'প্রাপ্য হিসাব' : 'Receivables'}
          desc={isBangla ? 'গ্রাহকের নিকট মোট বকেয়া বকেয়া' : 'Outstanding customer invoice balances'}
          icon={Receipt}
          iconColor="warning"
          isBangla={isBangla}
        />
        <FinancialStatCard
          title={isBangla ? 'প্রদেয় হিসাব' : 'Payables'}
          desc={isBangla ? 'সরবরাহকারীকে প্রদেয় বকেয়া' : 'Outstanding vendor balances due'}
          icon={FileClock}
          iconColor="destructive"
          isBangla={isBangla}
        />
        <FinancialStatCard
          title={isBangla ? 'ঋণ ব্যালেন্স' : 'Loan Balance'}
          desc={isBangla ? 'ব্যবসায়ের বর্তমান মোট ঋণের পরিমাণ' : 'Combined outstanding business liabilities'}
          icon={Landmark}
          iconColor="destructive"
          isBangla={isBangla}
        />
      </div>

      {/* 4. FINANCIAL SNAPSHOT SECTION */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          {isBangla ? 'আর্থিক বিবরণী স্ন্যাপশট' : 'Financial Snapshot'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SnapshotCard
            title={isBangla ? 'লাভ ও ক্ষতি' : 'Profit & Loss'}
            desc={isBangla ? 'লাভ ও ক্ষতি সারাংশ এখানে প্রদর্শিত হবে।' : 'Profit & Loss summary will appear here.'}
            icon={BarChart3}
            btnLabel={isBangla ? 'রিপোর্ট দেখুন' : 'View Report'}
            isBangla={isBangla}
          />
          <SnapshotCard
            title={isBangla ? 'ক্যাশ ফ্লো' : 'Cash Flow'}
            desc={isBangla ? 'নগদ প্রবাহের বিবরণী ও কার্যক্রম।' : 'Cash movement overview.'}
            icon={Activity}
            btnLabel={isBangla ? 'রিপোর্ট দেখুন' : 'View Report'}
            isBangla={isBangla}
          />
          <SnapshotCard
            title={isBangla ? 'ব্যালেন্স শীট' : 'Balance Sheet'}
            desc={isBangla ? 'ব্যবসায়ের মোট সম্পদ, দায় এবং ইকুইটি।' : 'Assets, liabilities and equity.'}
            icon={Scale}
            btnLabel={isBangla ? 'রিপোর্ট দেখুন' : 'View Report'}
            isBangla={isBangla}
          />
        </div>
      </div>

      {/* 5. VISUALIZATIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Preview */}
        <Card className="lg:col-span-1 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              {isBangla ? 'ক্যাশ ফ্লো' : 'Cash Flow'}
            </CardTitle>
            <CardDescription className="text-xs">
              {isBangla ? 'ব্যবসায়ের নগদ অর্থের আগমন ও নির্গমন।' : 'Money moving in and out.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6 border-t border-[rgba(255,255,255,0.04)]">
            <div className="h-16 w-16 rounded-full bg-muted/40 flex items-center justify-center mb-4 relative">
              <Activity className="h-6 w-6 text-muted-foreground/60 animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-dashed border-muted-foreground/20 animate-spin-slow" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              {isBangla ? 'এখনো কোনো আর্থিক কার্যক্রম নেই' : 'No financial activity yet'}
            </h4>
            <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
              {isBangla
                ? 'লেনদেন পাওয়া গেলে নগদ প্রবাহের চিত্র এখানে দেখা যাবে।'
                : 'Cash flow visualization will appear once transactions are available.'}
            </p>
          </CardContent>
        </Card>

        {/* Income vs Expense Placeholder Chart */}
        <Card className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
              <span>{isBangla ? 'আয় বনাম ব্যয়' : 'Income vs Expense'}</span>
              <Badge variant="outline" className="text-[10px] py-0 px-2 font-normal text-muted-foreground uppercase tracking-wider">
                {isBangla ? 'আসন্ন' : 'Coming Soon'}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              {isBangla ? 'মাসিক আয় ও ব্যয়ের তুলনামূলক চিত্র।' : 'Monthly comparison of incoming vs outgoing cash.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 border-t border-[rgba(255,255,255,0.04)]">
            <div className="h-60 rounded-xl border border-dashed border-border-subtle flex flex-col items-center justify-center p-4 relative overflow-hidden bg-muted/10">
              {/* Premium Background Gridlines */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10 pointer-events-none">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="border-t border-l border-white" />
                ))}
              </div>
              
              {/* Fake Premium SVG Visual */}
              <svg className="w-full h-32 text-indigo opacity-30 mt-2" fill="none" viewBox="0 0 100 50">
                <path d="M0,50 L20,40 L40,45 L60,25 L80,30 L100,5" stroke="currentColor" strokeWidth="2" strokeDasharray="3" />
                <path d="M0,50 L20,30 L40,35 L60,10 L80,20 L100,2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              </svg>

              <span className="text-xs font-semibold text-muted-foreground mt-4 z-10">
                {isBangla ? 'আয় বনাম ব্যয় চার্ট' : 'Income vs Expense Chart'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Receivable vs Payable Placeholder Chart */}
        <Card className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
              <span>{isBangla ? 'প্রাপ্য বনাম প্রদেয়' : 'Receivable vs Payable'}</span>
              <Badge variant="outline" className="text-[10px] py-0 px-2 font-normal text-muted-foreground uppercase tracking-wider">
                {isBangla ? 'আসন্ন' : 'Coming Soon'}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              {isBangla ? 'বকেয়া আদায় বনাম বকেয়া পরিশোধের অনুপাত।' : 'Dues outstanding to collect vs bills to pay.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 border-t border-[rgba(255,255,255,0.04)]">
            <div className="h-60 rounded-xl border border-dashed border-border-subtle flex flex-col items-center justify-center p-4 relative overflow-hidden bg-muted/10">
              {/* Premium Background Gridlines */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10 pointer-events-none">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="border-t border-l border-white" />
                ))}
              </div>

              {/* Fake Premium SVG Visual */}
              <svg className="w-full h-32 text-warning opacity-30 mt-2" fill="none" viewBox="0 0 100 50">
                <rect x="10" y="25" width="8" height="25" fill="currentColor" opacity="0.7" />
                <rect x="25" y="15" width="8" height="35" fill="currentColor" opacity="0.3" />
                <rect x="40" y="30" width="8" height="20" fill="currentColor" opacity="0.7" />
                <rect x="55" y="10" width="8" height="40" fill="currentColor" opacity="0.3" />
                <rect x="70" y="20" width="8" height="30" fill="currentColor" opacity="0.7" />
                <rect x="85" y="5" width="8" height="45" fill="currentColor" opacity="0.3" />
              </svg>

              <span className="text-xs font-semibold text-muted-foreground mt-4 z-10">
                {isBangla ? 'প্রাপ্য বনাম প্রদেয়' : 'Receivable vs Payable'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6. ACTIVITIES & DUE PAYMENTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Financial Activity */}
        <Card className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">
              {isBangla ? 'সাম্প্রতিক আর্থিক লেনদেন' : 'Recent Activity'}
            </CardTitle>
            <CardDescription>
              {isBangla ? 'আপনার সর্বশেষ আর্থিক কার্যক্রমের তালিকা।' : 'Latest financial transactions.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6 border-t border-[rgba(255,255,255,0.04)]">
            <ClipboardList className="h-10 w-10 text-muted-foreground/60 mb-2 animate-pulse" />
            <h4 className="text-sm font-semibold text-foreground">
              {isBangla ? 'কোনো লেনদেন বিবরণী পাওয়া যায়নি' : 'No financial activity available'}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mb-4">
              {isBangla
                ? 'লেনদেন শুরু করতে প্রথম পেমেন্ট অথবা খরচ যোগ করুন।'
                : 'Start recording transactions by creating your first entry.'}
            </p>
            <button className="h-8 px-4 bg-muted text-muted-foreground border border-border-subtle rounded-xl text-xs font-semibold cursor-not-allowed" disabled>
              {isBangla ? 'প্রথম লেনদেন যোগ করুন' : 'Add First Transaction'}
            </button>
          </CardContent>
        </Card>

        {/* Upcoming Due Payments */}
        <Card className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">
              {isBangla ? 'আসন্ন প্রদেয় কিস্তি ও বিল' : 'Upcoming Due Payments'}
            </CardTitle>
            <CardDescription>
              {isBangla ? 'আসন্ন বিল এবং ঋণের কিস্তি পরিশোধের সময়সূচী।' : 'Bills and loan repayments.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6 border-t border-[rgba(255,255,255,0.04)]">
            <CalendarClock className="h-10 w-10 text-muted-foreground/60 mb-2 animate-pulse" />
            <h4 className="text-sm font-semibold text-foreground">
              {isBangla ? 'আসন্ন কোনো প্রদেয় বিল নেই' : 'Nothing due'}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              {isBangla
                ? 'আপনার পরিশোধের কিস্তি তালিকা এখানে স্বয়ংক্রিয়ভাবে আপডেট হবে।'
                : 'All scheduled repayments and outstanding bills will show up here.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 7. PREVIEWS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank & Wallets Preview */}
        <Card className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">
              {isBangla ? 'ব্যাংক ও মোবাইল ওয়ালেট' : 'Bank & Wallets'}
            </CardTitle>
            <CardDescription>
              {isBangla ? 'সংযুক্ত আর্থিক ব্যাংক হিসাব এবং পেমেন্ট গেটওয়ে।' : 'Connected financial accounts.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 border-t border-[rgba(255,255,255,0.04)] space-y-4">
            <BankPreviewRow label="Cash Account" labelBn="নগদ ক্যাশ" type="Cash" />
            <BankPreviewRow label="Primary Bank Account" labelBn="প্রধান ব্যাংক হিসাব" type="Bank" />
            <BankPreviewRow label="bKash Wallet" labelBn="বিকাশ ওয়ালেট" type="MFS" />
            <BankPreviewRow label="Nagad Wallet" labelBn="নগদ ওয়ালেট" type="MFS" />
            <BankPreviewRow label="Rocket Wallet" labelBn="রকেট ওয়ালেট" type="MFS" />
          </CardContent>
        </Card>

        {/* Expense Categories Chart */}
        <Card className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">
              {isBangla ? 'ব্যয় ক্যাটাগরি' : 'Expense Categories'}
            </CardTitle>
            <CardDescription>
              {isBangla ? 'বিভিন্ন ক্যাটাগরিতে ব্যয়ের শতকরা অনুপাত।' : 'Distribution of expenses by category.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6 border-t border-[rgba(255,255,255,0.04)] relative overflow-hidden">
            <div className="relative h-28 w-28 mb-3 flex items-center justify-center">
              {/* Premium Fake Pie Chart Vector */}
              <div className="absolute inset-0 rounded-full border-[10px] border-muted/30" />
              <div className="absolute inset-0 rounded-full border-[10px] border-indigo border-r-transparent border-b-transparent border-l-transparent transform rotate-45" />
              <div className="absolute inset-0 rounded-full border-[10px] border-emerald border-t-transparent border-b-transparent border-l-transparent" />
              <div className="absolute inset-0 rounded-full border-[10px] border-warning border-t-transparent border-r-transparent border-l-transparent" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{isBangla ? 'ব্যয়' : 'Expenses'}</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-[240px]">
              {isBangla
                ? 'খরচ রেকর্ড করা শুরু হলে ব্যয়ের ক্যাটাগরি পাই-চার্ট এখানে প্রদর্শিত হবে।'
                : 'Expense category breakdown will appear here once expenses are recorded.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 8. BUSINESS HEALTH SCORE & AI INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Health Score */}
        <Card className="lg:col-span-1 border border-[rgba(255,255,255,0.06)] bg-gradient-to-b from-card to-card/50 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo shrink-0" />
              <span>{isBangla ? 'আর্থিক স্কোর' : 'Business Health Score'}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {isBangla ? 'ব্যবসায়ের সামগ্রিক আর্থিক পারফরম্যান্স স্কোর।' : 'AI-powered metric of your overall financial standing.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6 border-t border-[rgba(255,255,255,0.04)] relative">
            {/* Elegant Radial Progress Skeleton */}
            <div className="h-32 w-32 rounded-full border border-dashed border-border-subtle flex flex-col items-center justify-center p-6 mb-2">
              <span className="text-3xl font-extrabold text-foreground/40">—</span>
              <span className="text-[9px] font-bold text-primary tracking-wider uppercase mt-1">{isBangla ? 'আসন্ন' : 'Coming Soon'}</span>
            </div>
            <p className="text-[11px] text-muted-foreground max-w-[200px]">
              {isBangla
                ? 'পর্যাপ্ত ডাটা সংগৃহীত হওয়ার পর AI আপনার ব্যবসার আর্থিক অবস্থা বিশ্লেষণ করবে।'
                : 'AI will analyze your financial health after enough data is available.'}
            </p>
          </CardContent>
        </Card>

        {/* AI Financial Insights */}
        <Card className="lg:col-span-2 border border-[rgba(255,255,255,0.06)] bg-gradient-to-br from-card to-indigo/5 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              <span>{isBangla ? 'কাস্টম এআই আর্থিক অন্তর্দৃষ্টি' : 'AI Financial Insights'}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {isBangla ? 'কৃত্রিম বুদ্ধিমত্তা দ্বারা পরিচালিত স্বয়ংক্রিয় পর্যবেক্ষণ।' : 'Automated detections by HelloKhata intelligent engine.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-t border-[rgba(255,255,255,0.04)]">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {isBangla ? 'স্বয়ংক্রিয়ভাবে চিহ্নিত হবে' : 'HelloKhata AI will automatically detect'}
              </h4>
              <ul className="space-y-2 text-xs text-foreground/90">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{isBangla ? 'মুনাফার সুযোগসমূহ' : 'Profit opportunities'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{isBangla ? 'অস্বাভাবিক ব্যয় সনাক্তকরণ' : 'Expense anomalies'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{isBangla ? 'নগদ অর্থের ঘাটতি বা পূর্বাভাস' : 'Cash shortages'}</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3 md:pt-7">
              <ul className="space-y-2 text-xs text-foreground/90">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{isBangla ? 'দীর্ঘমেয়াদী বকেয়া আদায়ের তাগিদ' : 'Outstanding dues'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{isBangla ? 'ব্যবসায়িক ট্রেন্ড বিশ্লেষণ' : 'Business trends'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{isBangla ? 'আর্থিক ঝুঁকি পর্যালোচনা' : 'Financial risks'}</span>
                </li>
              </ul>
            </div>
          </CardContent>

          <div className="p-4 border-t border-[rgba(255,255,255,0.04)] flex justify-end">
            <button className="h-9 px-4 bg-muted text-muted-foreground border border-border-subtle rounded-xl text-xs font-semibold flex items-center gap-2 cursor-not-allowed" disabled>
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isBangla ? 'বিশ্লেষণ করুন' : 'Generate Insights'}</span>
            </button>
          </div>
        </Card>
      </div>

      {/* 9. QUICK ACTIONS GRID */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          {isBangla ? 'দ্রুত অ্যাকশন প্যানেল' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-all cursor-not-allowed group flex items-start gap-3 relative overflow-hidden"
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${action.iconColor}`}>
                  <ActionIcon className="h-4 w-4 shrink-0" />
                </div>
                <div className="space-y-1 pr-6">
                  <h3 className="text-xs font-semibold text-foreground">
                    {isBangla ? action.titleBn : action.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground leading-normal line-clamp-2">
                    {isBangla ? action.descBn : action.desc}
                  </p>
                </div>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 10. BOTTOM SETUP / INFORMATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <BottomInfoCard
          title={isBangla ? 'হিসাববিজ্ঞান সেটআপ' : 'Accounting Setup'}
          desc={isBangla ? 'আপনার হিসাব মডিউল সেটিংস সম্পন্ন করুন।' : 'Finish setting up your accounting module.'}
          icon={CheckSquare}
          isBangla={isBangla}
        />
        <BottomInfoCard
          title={isBangla ? 'কর ও ভ্যাট' : 'Tax & VAT'}
          desc={isBangla ? 'ভ্যাট এবং ট্যাক্স প্রাধিকার হার সেট করুন।' : 'Configure VAT and tax preferences.'}
          icon={ReceiptText}
          isBangla={isBangla}
        />
        <BottomInfoCard
          title={isBangla ? 'চার্ট অফ অ্যাকাউন্টস' : 'Chart of Accounts'}
          desc={isBangla ? 'আপনার হিসাবের কাঠামো পরিচালনা করুন।' : 'Manage your accounting structure.'}
          icon={FolderTree}
          isBangla={isBangla}
        />
      </div>
    </div>
  );
}

// Reusable HealthIndicator component
function HealthIndicator({
  title,
  status,
  statusLabel,
}: {
  title: string;
  status: 'healthy' | 'warning' | 'attention' | 'comingSoon';
  statusLabel: string;
}) {
  const badgeColors = {
    healthy: 'bg-emerald/10 text-emerald border-emerald/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    attention: 'bg-destructive/10 text-destructive border-destructive/20',
    comingSoon: 'bg-muted text-muted-foreground border-border-subtle',
  };

  return (
    <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-card flex flex-col justify-between gap-3">
      <span className="text-xs font-semibold text-muted-foreground">{title}</span>
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${badgeColors[status]}`}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

// Reusable FinancialStatCard component
function FinancialStatCard({
  title,
  desc,
  icon: Icon,
  iconColor,
  isBangla,
}: {
  title: string;
  desc: string;
  icon: any;
  iconColor: 'indigo' | 'emerald' | 'warning' | 'destructive';
  isBangla: boolean;
}) {
  const iconColorClasses = {
    indigo: 'text-primary bg-primary-subtle',
    emerald: 'text-emerald bg-emerald-subtle',
    warning: 'text-warning bg-warning-subtle',
    destructive: 'text-destructive bg-destructive-subtle',
  };

  return (
    <Card className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] flex flex-col justify-between h-36">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-muted-foreground">{title}</span>
          <p className="text-[10px] text-muted-foreground/80 leading-normal line-clamp-1">{desc}</p>
        </div>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${iconColorClasses[iconColor]}`}>
          <Icon className="h-4.5 w-4.5 shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-lg font-bold text-foreground">—</div>
        <div className="text-[10px] text-muted-foreground mt-1 border-t border-[rgba(255,255,255,0.04)] pt-1">
          {isBangla ? 'সেটআপ সম্পন্ন করার পর উপলব্ধ হবে' : 'Will be available after setup'}
        </div>
      </CardContent>
    </Card>
  );
}

// Reusable SnapshotCard component
function SnapshotCard({
  title,
  desc,
  icon: Icon,
  btnLabel,
  isBangla,
}: {
  title: string;
  desc: string;
  icon: any;
  btnLabel: string;
  isBangla: boolean;
}) {
  return (
    <Card className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] flex flex-col justify-between">
      <CardHeader className="pb-3 flex flex-row items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-indigo-subtle flex items-center justify-center shrink-0">
          <Icon className="h-4.5 w-4.5 text-primary shrink-0" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-sm font-bold text-foreground">{title}</CardTitle>
          <CardDescription className="text-xs leading-normal">{desc}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4 pr-4 flex justify-end">
        <button className="h-7 px-3 bg-muted text-muted-foreground border border-border-subtle rounded-lg text-[10px] font-semibold cursor-not-allowed" disabled>
          {btnLabel}
        </button>
      </CardContent>
    </Card>
  );
}

// Reusable BottomInfoCard component
function BottomInfoCard({
  title,
  desc,
  icon: Icon,
  isBangla,
}: {
  title: string;
  desc: string;
  icon: any;
  isBangla: boolean;
}) {
  return (
    <div className="p-4 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-all cursor-not-allowed group flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-indigo-subtle flex items-center justify-center shrink-0">
          <Icon className="h-4.5 w-4.5 text-primary shrink-0" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-xs font-semibold text-foreground">{title}</h3>
          <p className="text-[10px] text-muted-foreground leading-normal">{desc}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
    </div>
  );
}

// Simple local FileSpreadsheet placeholder icon definition since it's not imported
function FileSpreadsheet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 13h2" />
      <path d="M14 13h2" />
      <path d="M8 17h2" />
      <path d="M14 17h2" />
    </svg>
  );
}

// Local BankPreviewRow helper component
function BankPreviewRow({
  label,
  labelBn,
  type,
}: {
  label: string;
  labelBn: string;
  type: string;
}) {
  const { isBangla } = useAppTranslation();
  return (
    <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.03)] last:border-0 last:pb-0 first:pt-0">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-muted/40 flex items-center justify-center shrink-0">
          <Wallet className="h-4 w-4 text-muted-foreground/60" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground">
            {isBangla ? labelBn : label}
          </p>
          <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[8px] font-medium text-muted-foreground uppercase">
            {type}
          </span>
        </div>
      </div>
      
      {/* Premium Skeleton Indicator */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 bg-muted/30 rounded-md animate-pulse" />
        <span className="text-xs font-bold text-muted-foreground/40">৳—</span>
      </div>
    </div>
  );
}
