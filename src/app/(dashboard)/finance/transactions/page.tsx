'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/common';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { useGetTransactions } from '@/hooks/api/useFinance';
import { useGetBranches } from '@/hooks/api/useBranches';
import { PaginationHelper } from '@/components/shared/PaginationHelper';
import { cn } from '@/lib/utils';
import {
  ArrowLeftRight,
  RefreshCw,
  Search,
  Download,
  Coins,
  FileClock,
  FileText,
  Eye,
  Loader2,
  Scale,
  Calendar,
  Banknote,
  Landmark,
  Wallet,
} from 'lucide-react';
import { useGetPaymentMethodStatus } from '@/hooks/api/usePaymentMethod';

export interface Transaction {
  id: string;
  transactionType: string;
  flow: 'IN' | 'OUT' | string;
  amount: number;
  date: string;
  title?: string | null;
  description?: string | null;
  reference?: string | null;
  partyId?: string | null;
  partyName?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  branchId?: string | null;
  accountId?: string | null;
  mode?: string | null;
  receipt?: string | null;
  createdAt?: string;
}

export default function FinanceTransactionsPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedFlow, setSelectedFlow] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API Hooks
  const { data: branches } = useGetBranches();
  const {data:stats,isLoading:isLoadingStats}=useGetPaymentMethodStatus();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data: responseData, isLoading, isError, refetch, isFetching } = useGetTransactions({
    search: debouncedSearch || undefined,
    type: selectedType === 'all' ? undefined : selectedType,
    flow: selectedFlow === 'all' ? undefined : selectedFlow,
    branchId: selectedBranch === 'all' ? undefined : selectedBranch,
    page: currentPage,
    limit: itemsPerPage,
  });

  const transactionsList = responseData?.data || [];
  const meta = responseData?.meta || { totalPages: 1, total: 0, totalIn: 0, totalOut: 0, netFlow: 0 };
  const totalPages = meta.totalPages || 1;

  // const {data:stats, isLoading:isLoadingStats}=();


  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedMethod, selectedFlow, selectedBranch]);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  const handleOpenDetails = (txn: Transaction) => {
    setActiveTransaction(txn);
    setIsDetailsOpen(true);
  };

  // Helper date formatter
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toISOString().split('T')[0];
    } catch {
      return dateStr || '-';
    }
  };

  // Stats from API
  const totalLiquid = stats.totalLiquidity ?? 0;
  const totalCash = stats.cashLiquidity ?? 0;
  const totalBank = stats.bankLiquidity ?? 0;
  const totalWallet = stats.walletLiquidity ?? 0;
  const activeAccounts = stats.totalAccounts ?? 0;

  const handleExport = (type: string) => {
    alert(isBangla ? `${type} এক্সপোর্ট সিমুলেশন সম্পন্ন!` : `${type} export simulation completed!`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumbs Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          {/* <Breadcrumb>
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
                  {isBangla ? 'লেনদেন রেজিস্টার' : 'Transactions Ledger'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
          <div className="flex items-center gap-3">
            <BackButton fallbackHref="/finance" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {isBangla ? 'লেনদেন খাতা রেজিস্টার' : 'Transactions Ledger'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isBangla
                  ? 'আপনার ব্যবসায়ের সমস্ত আর্থিক লেনদেন দেখুন, রেকর্ড করুন এবং পরিচালনা করুন।'
                  : 'View, record, and manage every financial transaction ledger across your business.'}
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 text-xs h-9"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            <span>{isBangla ? 'রিফ্রেশ' : 'Refresh'}</span>
          </Button>
          <Button variant="outline" onClick={() => handleExport('Excel')} className="gap-1.5 text-xs h-9">
            <Download className="h-3.5 w-3.5" />
            <span>{isBangla ? 'এক্সপোর্ট' : 'Export'}</span>
          </Button>
        </div>
      </div>

      {/* 2. Dynamic Summary Cards (Liquidity Overview) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl border border-border bg-zinc-900/30 shadow-inner">
        {/* Total */}
        <div className="rounded-2xl p-5 border bg-emerald-500/10 border-emerald-500/20 shadow-xs relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1 relative z-10">
            {isBangla ? 'সর্বমোট তারল্য' : 'Total Liquidity'}
          </p>
          <div className="relative z-10 min-h-[36px] flex items-center">
            {isLoading ? (
              <div className="h-8 w-32 bg-emerald-500/20 animate-pulse rounded" />
            ) : (
              <p className="text-2xl sm:text-3xl font-bold text-foreground font-mono truncate">
                {formatCurrency(totalLiquid)}
              </p>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 relative z-10">
            {activeAccounts} {isBangla ? 'টি অ্যাকাউন্ট' : 'accounts active'}
          </p>
        </div>

        {/* Cash Vault */}
        <div className="rounded-2xl p-5 border bg-amber-500/10 border-amber-500/20 shadow-xs relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1 flex items-center gap-1 relative z-10">
            <Banknote className="h-3 w-3" />
            {isBangla ? 'ক্যাশ ভল্ট' : 'Cash Vault'}
          </p>
          <div className="relative z-10 min-h-[32px] flex items-center">
            {isLoading ? (
              <div className="h-7 w-28 bg-amber-500/20 animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold text-foreground font-mono truncate">
                {formatCurrency(totalCash)}
              </p>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 relative z-10">
            {isBangla ? 'নগদ তহবিল' : 'Physical Cash'}
          </p>
        </div>

        {/* Bank */}
        <div className="rounded-2xl p-5 border bg-blue-500/10 border-blue-500/20 shadow-xs relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1 flex items-center gap-1 relative z-10">
            <Landmark className="h-3 w-3" />
            {isBangla ? 'ব্যাংক ব্যালেন্স' : 'Bank Balance'}
          </p>
          <div className="relative z-10 min-h-[32px] flex items-center">
            {isLoading ? (
              <div className="h-7 w-28 bg-blue-500/20 animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold text-foreground font-mono truncate">
                {formatCurrency(totalBank)}
              </p>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 relative z-10">
            {isBangla ? 'ব্যাংক হিসাব' : 'Bank Accounts'}
          </p>
        </div>

        {/* Wallet */}
        <div className="rounded-2xl p-5 border bg-pink-500/10 border-pink-500/20 shadow-xs relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-pink-500 mb-1 flex items-center gap-1 relative z-10">
            <Wallet className="h-3 w-3" />
            {isBangla ? 'ওয়ালেট ব্যালেন্স' : 'Wallet Balance'}
          </p>
          <div className="relative z-10 min-h-[32px] flex items-center">
            {isLoading ? (
              <div className="h-7 w-28 bg-pink-500/20 animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold text-foreground font-mono truncate">
                {formatCurrency(totalWallet)}
              </p>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 relative z-10">
            {isBangla ? 'মোবাইল ব্যাংকিং' : 'Mobile Banking'}
          </p>
        </div>
      </div>

      {/* 3. Filters Bar */}
      <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" />
            <Input
              placeholder={
                isBangla
                  ? "লেনদেন খুঁজুন (আইডি, নাম, পার্টি)..."
                  : "Search (ID, name, party)..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
             <SelectTrigger className="w-full md:w-[140px]">
               <SelectValue placeholder={isBangla ? "শাখা" : "Branch"} />
             </SelectTrigger>
             <SelectContent>
                <SelectItem value="all">{isBangla ? "সব শাখা" : "All Branches"}</SelectItem>
                {branches?.map((b: any) => (
                   <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
             </SelectContent>
          </Select>

          <Select value={selectedFlow} onValueChange={setSelectedFlow}>
             <SelectTrigger className="w-full md:w-[140px]">
               <SelectValue placeholder={isBangla ? "ফ্লো" : "Flow"} />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">{isBangla ? "সব ফ্লো" : "All Flows"}</SelectItem>
               <SelectItem value="IN">{isBangla ? 'ইনফ্লো (IN)' : 'Inflow (IN)'}</SelectItem>
               <SelectItem value="OUT">{isBangla ? 'আউটফ্লো (OUT)' : 'Outflow (OUT)'}</SelectItem>
             </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder={isBangla ? "ধরণ" : "Type"} />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="all">{isBangla ? 'সব ধরণ' : 'All Types'}</SelectItem>
               <SelectItem value="INCOME">{isBangla ? 'আয় (Income)' : 'Income'}</SelectItem>
               <SelectItem value="EXPENSE">{isBangla ? 'ব্যয় (Expense)' : 'Expense'}</SelectItem>
               <SelectItem value="PAYMENT">{isBangla ? 'পেমেন্ট (Payment)' : 'Payment'}</SelectItem>
               <SelectItem value="PAYMENT_IN">{isBangla ? 'পেমেন্ট গ্রহণ (Payment In)' : 'Payment In'}</SelectItem>
               <SelectItem value="PAYMENT_OUT">{isBangla ? 'পেমেন্ট প্রদান (Payment Out)' : 'Payment Out'}</SelectItem>
               <SelectItem value="SALE">{isBangla ? 'বিক্রয় (Sale)' : 'Sale'}</SelectItem>
               <SelectItem value="PURCHASE">{isBangla ? 'ক্রয় (Purchase)' : 'Purchase'}</SelectItem>
            </SelectContent>
          </Select>

          <button
            type="button"
            className="flex items-center gap-2 border border-input rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted shrink-0 cursor-pointer h-10"
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="whitespace-nowrap">
              {isBangla ? "তারিখ" : "Date"}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Table view registry */}
      <Card className="border-border/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/20 text-muted-foreground font-semibold">
              <TableRow>
                <TableHead className="p-3">{isBangla ? 'তারিখ' : 'Date'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'লেনদেন আইডি' : 'TXN ID'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'লেনদেনের ধরণ' : 'Type'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'হিসাবের নাম' : 'Title'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'বিবরণ' : 'Description'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'পার্টি' : 'Particulars/Party'}</TableHead>
                <TableHead className="p-3 text-right">{isBangla ? 'পরিমাণ' : 'Amount'}</TableHead>
                <TableHead className="p-3">{isBangla ? 'পদ্ধতি' : 'Method'}</TableHead>
                <TableHead className="p-3 text-center">{isBangla ? 'অ্যাকশন' : 'Action'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/10">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-64 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p className="text-sm font-medium">
                        {isBangla ? 'লেনদেন লোড হচ্ছে...' : 'Loading transactions...'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-64 text-center text-rose-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm font-medium">
                        {isBangla ? 'লেনদেন লোড করতে সমস্যা হয়েছে।' : 'Failed to load transactions.'}
                      </p>
                      <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 text-xs">
                        {isBangla ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactionsList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-64 text-center text-muted-foreground font-semibold">
                    {isBangla ? 'কোনো লেনদেন এন্ট্রি পাওয়া যায়নি।' : 'No financial transaction records found.'}
                  </TableCell>
                </TableRow>
              ) : (
                transactionsList.map((txn) => {
                  const isInflow = txn.flow === 'IN' || ['INCOME', 'SALE', 'PAYMENT_IN'].includes(txn.transactionType?.toUpperCase());
                  const accountName = txn.categoryName || txn.title || txn.accountId || '-';
                  const description = txn.description || txn.title || '-';
                  const party = txn.partyName || txn.reference || '-';
                  const method = txn.mode || '-';

                  return (
                    <TableRow key={txn.id} className="hover:bg-muted/5">
                      <td className="p-3 font-mono text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(txn.date)}
                      </td>
                      <td className="p-3 font-mono font-bold text-primary text-xs" title={txn.id}>
                        #{txn.id.length > 10 ? txn.id.slice(-8) : txn.id}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[9px] py-0.5 px-2 rounded-md border-transparent font-bold uppercase',
                            isInflow
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          )}
                        >
                          {txn.transactionType}
                        </Badge>
                      </td>
                      <td className="p-3 font-semibold text-foreground text-xs">{accountName}</td>
                      <td className="p-3 text-muted-foreground text-xs max-w-[220px] truncate" title={description}>
                        {description}
                      </td>
                      <td className="p-3 font-medium text-foreground text-xs">{party}</td>
                      <td className={cn(
                        'p-3 text-right font-mono font-medium text-xs whitespace-nowrap',
                        isInflow ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      )}>
                        {isInflow ? `+${formatCurrency(txn.amount)}` : `-${formatCurrency(txn.amount)}`}
                      </td>
                      <td className="p-3 text-muted-foreground text-xs">{method}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleOpenDetails(txn)}
                            className="h-7 w-7 text-primary hover:bg-primary/10"
                            title={isBangla ? 'বিস্তারিত দেখুন' : 'View Details'}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-border">
            <PaginationHelper
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isBangla={isBangla}
            />
          </div>
        )}
      </Card>

      {/* 5. Transaction Details dialog popup */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>{isBangla ? 'লেনদেনের বিবরণ ভাউচার' : 'Transaction Details'}</span>
            </DialogTitle>
          </DialogHeader>

          {activeTransaction && (
            <div className="space-y-4 text-xs font-medium border-t pt-3 border-border/20">
              <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-lg border">
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'ভাউচার / লেনদেন আইডি' : 'TRANSACTION ID'}</p>
                  <p className="font-bold text-primary font-mono text-xs mt-0.5 break-all">{activeTransaction.id}</p>
                </div>
                <Badge
                  className={cn(
                    'rounded-md text-[10px] py-0.5 px-2 font-bold border-transparent uppercase',
                    activeTransaction.flow === 'IN' || ['INCOME', 'SALES', 'DEPOSIT'].includes(activeTransaction.transactionType?.toUpperCase())
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  )}
                >
                  {activeTransaction.transactionType} ({activeTransaction.flow || 'N/A'})
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'লেনদেনের তারিখ' : 'DATE'}</p>
                  <p className="font-semibold text-foreground mt-0.5 font-mono">{formatDate(activeTransaction.date)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'হিসাবের নাম / ক্যাটাগরি' : 'ACCOUNT / CATEGORY'}</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {activeTransaction.categoryName || activeTransaction.title || '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'পেমেন্ট পদ্ধতি' : 'PAYMENT METHOD'}</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {activeTransaction.mode || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'সংশ্লিষ্ট পার্টি' : 'PARTICULARS / PARTY'}</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {activeTransaction.partyName || '-'}
                  </p>
                </div>
              </div>

              {activeTransaction.reference && (
                <div>
                  <p className="text-[10px] text-muted-foreground">{isBangla ? 'রেফারেন্স' : 'REFERENCE'}</p>
                  <p className="font-semibold text-foreground mt-0.5">{activeTransaction.reference}</p>
                </div>
              )}

              <div className="border-t pt-3 border-border/10">
                <p className="text-[10px] text-muted-foreground">{isBangla ? 'লেনদেনের বিবরণ' : 'DESCRIPTION'}</p>
                <p className="text-muted-foreground mt-0.5 italic leading-relaxed">
                  {activeTransaction.description || activeTransaction.title || '-'}
                </p>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg border flex justify-between items-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{isBangla ? 'মোট পরিমাণ' : 'TOTAL AMOUNT'}</p>
                <p className={cn(
                  'text-base font-bold font-mono',
                  activeTransaction.flow === 'IN' || ['INCOME', 'SALE', 'PAYMENT_IN'].includes(activeTransaction.transactionType?.toUpperCase())
                    ? 'text-emerald-600 dark:text-emerald-500'
                    : 'text-rose-600 dark:text-rose-400'
                )}>
                  {formatCurrency(activeTransaction.amount)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button onClick={() => setIsDetailsOpen(false)} className="text-xs h-9 w-full sm:w-auto">
              {isBangla ? 'বন্ধ করুন' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
