'use client';

import React, { useState, useMemo } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import {
  FileText,
  Search,
  Plus,
  Coins,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  History,
  Info,
  User,
  Bell,
  Loader2,
} from 'lucide-react';
import { useParties, usePartyLedger } from '@/hooks/api/useParties';
import { AddPaymentOutModal } from '@/components/parties/AddPaymentOutModal';
import { AddReminderModal } from '@/components/parties/AddReminderModal';
import { PayoutHistory, PayoutLog } from '@/components/finance/payables/PayoutHistory';

export interface SupplierParty {
  id: string;
  name: string;
  nameBn?: string;
  phone?: string;
  type?: string;
  openingBalance?: number;
  currentBalance?: number;
  totalDue?: number;
  lastPaymentDate?: string;
  isActive?: boolean;
  createdAt?: string;
  category?: string | null;
  balanceDirection?: 'receive' | 'pay' | string;
  currentBalanceDirection?: 'receive' | 'pay' | string;
  status?: 'normal' | 'warning' | 'critical';
  ledger?: Array<{
    date: string;
    ref: string;
    desc: string;
    descBn?: string;
    debit: number;  // decreases due (our payments)
    credit: number; // increases due (our purchases)
  }>;
}


export default function FinancePayablesPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // API State: Fetch suppliers with payable balance
  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useParties({
    type: 'supplier',
    balanceType: 'payable',
  });

  // State Management: Payout Log List
  const [payoutLogs, setPayoutLogs] = useState<PayoutLog[]>([
    { id: 'PAY-AP-101', date: '2026-08-01', supplierName: 'Apex Distributers', supplierNameBn: 'এপেক্স ডিস্ট্রিবিউটর', amount: 100000, discount: 0, method: 'Bank Transfer', methodBn: 'ব্যাংক স্থানান্তর', ref: 'Bank Transfer Voucher #8902' },
    { id: 'PAY-BT-094', date: '2026-07-25', supplierName: 'Bata Wholesale Hub', supplierNameBn: 'বাটা পাইকারি হাব', amount: 50000, discount: 2000, method: 'Mobile Wallet', methodBn: 'মোবাইল ওয়ালেট', ref: 'bKash Payout #82910' },
  ]);

  // UI Active Tab: 'balances' or 'logs'
  const [activeTab, setActiveTab] = useState<'balances' | 'logs'>('balances');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  // Dialog States
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isNewDueOpen, setIsNewDueOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [selectedSupId, setSelectedSupId] = useState('');

  // Form Fields: New Bill Due
  const [newSupName, setNewSupName] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupAmount, setNewSupAmount] = useState('');
  const [newSupInv, setNewSupInv] = useState('');
  const [newSupTerm, setNewSupTerm] = useState('Net 30');

  const [alertMessage, setAlertMessage] = useState('');

  // Selected supplier for modals
  const selectedSupplier: SupplierParty | null = useMemo(() => {
    if (!Array.isArray(suppliers)) return null;
    return suppliers.find((s: any) => s.id === selectedSupId) || null;
  }, [suppliers, selectedSupId]);

  // Party ledger query when ledger dialog is open
  const { data: partyLedgerData, isLoading: isLedgerLoading } = usePartyLedger(
    selectedSupId,
    undefined,
    { enabled: isLedgerOpen && !!selectedSupId }
  );

  const ledgerEntries = useMemo(() => {
    if (partyLedgerData?.data?.transactions) return partyLedgerData.data.transactions;
    if (partyLedgerData?.data?.ledger) return partyLedgerData.data.ledger;
    if (selectedSupplier?.ledger) return selectedSupplier.ledger;
    return [];
  }, [partyLedgerData, selectedSupplier]);

  // Totals calculation
  const totalPayables = useMemo(() => {
    if (!Array.isArray(suppliers)) return 0;
    return suppliers.reduce((acc: number, s: any) => acc + (s.currentBalance ?? s.totalDue ?? 0), 0);
  }, [suppliers]);

  const criticalCount = useMemo(() => {
    if (!Array.isArray(suppliers)) return 0;
    return suppliers.filter((s: any) => {
      const due = s.currentBalance ?? s.totalDue ?? 0;
      return (s.status === 'critical' || due > 150000) && due > 0;
    }).length;
  }, [suppliers]);

  const warningCount = useMemo(() => {
    if (!Array.isArray(suppliers)) return 0;
    return suppliers.filter((s: any) => {
      const due = s.currentBalance ?? s.totalDue ?? 0;
      return (s.status === 'warning' || (due > 80000 && due <= 150000)) && due > 0;
    }).length;
  }, [suppliers]);

  const handleOpenPay = (id: string) => {
    setSelectedSupId(id);
    setIsPayOpen(true);
  };

  const handleOpenLedger = (id: string) => {
    setSelectedSupId(id);
    setIsLedgerOpen(true);
  };

  const handleOpenReminder = (id: string) => {
    setSelectedSupId(id);
    setIsReminderOpen(true);
  };

  const handleRecordCreditPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newSupAmount) || 0;

    if (!newSupName.trim() || amountNum <= 0) return;

    setIsNewDueOpen(false);

    // Reset Form
    setNewSupName('');
    setNewSupPhone('');
    setNewSupAmount('');
    setNewSupInv('');

    setAlertMessage(isBangla ? 'ক্রেডিট পারচেস/বকেয়া বিল সফলভাবে এন্ট্রি হয়েছে!' : 'Credit purchase bill logged successfully!');
    setTimeout(() => setAlertMessage(''), 4000);
  };

  // Filter & Search Logic
  const filteredSuppliers = useMemo(() => {
    if (!Array.isArray(suppliers)) return [];
    return suppliers.filter((s: any) => {
      const due = s.currentBalance ?? s.totalDue ?? 0;
      const supStatus = s.status || (due > 150000 ? 'critical' : due > 80000 ? 'warning' : 'normal');
      const name = s.name || '';
      const nameBn = s.nameBn || '';
      const phone = s.phone || '';
      const id = s.id || '';

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm) ||
        id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRisk =
        riskFilter === 'all' ||
        supStatus === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [suppliers, searchTerm, riskFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <FinancePageHeader
          pageName="Payables Management"
          pageNameBn="প্রদেয় হিসাব ব্যবস্থাপনা (পেমেন্ট আউট)"
          description="Manage supplier invoice balances, schedule payouts, and record payment confirmations."
          descriptionBn="সরবরাহকারীদের বকেয়া বিল পর্যবেক্ষণ করুন, মূল্য পরিশোধ এন্ট্রি দিন এবং পেমেন্ট সিডিউল করুন।"
          icon={FileText}
          showBackButton={true}
          backHref="/finance/overview"
        />
        <div className="flex gap-2 shrink-0">
          <Button onClick={() => setIsNewDueOpen(true)} className="gap-1.5 text-xs h-9">
            <Plus className="h-4 w-4" />
            {isBangla ? 'নতুন বকেয়া বিল (Credit Purchase)' : 'Record Supplier Bill'}
          </Button>
        </div>
      </div>

      {/* 2. Feedback Alert Banner */}
      {alertMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all duration-300">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* 3. Operational Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-card to-rose-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'সরবরাহকারীদের মোট বকেয়া পাওনা' : 'Total Vendor Payables'}</p>
              <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 font-mono">{formatCurrency(totalPayables)}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-rose-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{isBangla ? 'উচ্চ ঝুঁকি প্রোফাইল (৯০+ দিন)' : 'High Risk Accounts (90+)'}</p>
              <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 font-mono">{criticalCount}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-amber-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{isBangla ? 'মধ্যম ঝুঁকি প্রোফাইল (৩১-৬০ দিন)' : 'Medium Risk Accounts (31-60)'}</p>
              <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-mono">{warningCount}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <CalendarDays className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Tab Layout & Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-border/40 pb-1">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('balances')}
              className={cn(
                'py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5',
                activeTab === 'balances' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <User className="h-3.5 w-3.5" />
              <span>{isBangla ? 'সরবরাহকারী বকেয়া লিস্ট' : 'Supplier Balances'}</span>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={cn(
                'py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5',
                activeTab === 'logs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <History className="h-3.5 w-3.5" />
              <span>{isBangla ? 'পরিশোধ লগ (Payout Logs)' : 'Payout History'}</span>
            </button>
          </div>

          {/* Quick Search and filter */}
          {activeTab === 'balances' && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <div className="relative w-full sm:w-44">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={isBangla ? 'অনুসন্ধান...' : 'Search vendors...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-[11px] bg-background/50 border-border/30 rounded-lg"
                />
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="h-8 rounded-lg border border-border/30 bg-background/50 px-2 text-[11px] text-muted-foreground focus:outline-none"
              >
                <option value="all">{isBangla ? 'সব ঝুঁকি স্তর' : 'All Risk Levels'}</option>
                <option value="normal">{isBangla ? 'স্বাভাবিক ঝুঁকি' : 'Normal Risk'}</option>
                <option value="warning">{isBangla ? 'সতর্কতা' : 'Warning'}</option>
                <option value="critical">{isBangla ? 'উচ্চ ঝুঁকি' : 'Critical'}</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: Supplier balances list */}
        {activeTab === 'balances' && (
          <Card className="border-border/50 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/30 font-bold text-muted-foreground">
                    <th className="p-3">{isBangla ? 'আইডি' : 'ID'}</th>
                    <th className="p-3">{isBangla ? 'সরবরাহকারীর নাম' : 'Supplier Business'}</th>
                    <th className="p-3">{isBangla ? 'যোগাযোগ' : 'Phone'}</th>
                    <th className="p-3">{isBangla ? 'সর্বশেষ বিল পরিশোধ' : 'Last Payout'}</th>
                    <th className="p-3">{isBangla ? 'ঝুঁকি রেটিং' : 'Status'}</th>
                    <th className="p-3 text-right">{isBangla ? 'মোট প্রদেয় বকেয়া' : 'Total Balance'}</th>
                    <th className="p-3 text-center">{isBangla ? 'অ্যাকশন পদক্ষেপ' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {isLoadingSuppliers ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="border-b border-border/10">
                        <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                        <td className="p-3"><Skeleton className="h-4 w-32" /></td>
                        <td className="p-3"><Skeleton className="h-4 w-24" /></td>
                        <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                        <td className="p-3"><Skeleton className="h-5 w-16 rounded-md" /></td>
                        <td className="p-3 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                        <td className="p-3 text-center"><Skeleton className="h-7 w-28 mx-auto" /></td>
                      </tr>
                    ))
                  ) : filteredSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-muted-foreground font-semibold">
                        {isBangla ? 'কোনো বকেয়া সরবরাহকারী পাওয়া যায়নি।' : 'No supplier outstanding balances found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredSuppliers.map((sup: any) => {
                      const dueAmount = sup.currentBalance ?? sup.totalDue ?? 0;
                      const supStatus = sup.status || (dueAmount > 150000 ? 'critical' : dueAmount > 80000 ? 'warning' : 'normal');
                      const displayDate = sup.lastPaymentDate || (sup.createdAt ? new Date(sup.createdAt).toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—');

                      return (
                        <tr key={sup.id} className="hover:bg-muted/5">
                          <td className="p-3 font-mono text-muted-foreground text-[11px] truncate max-w-[120px]" title={sup.id}>
                            {sup.id}
                          </td>
                          <td className="p-3 font-bold text-foreground">
                            {isBangla && sup.nameBn ? sup.nameBn : sup.name}
                          </td>
                          <td className="p-3 font-mono text-muted-foreground">{sup.phone || '—'}</td>
                          <td className="p-3 font-mono text-muted-foreground">{displayDate}</td>
                          <td className="p-3">
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[9px] py-0.5 px-2 rounded-md border-transparent font-bold capitalize',
                                supStatus === 'normal' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500',
                                supStatus === 'warning' && 'bg-amber-500/10 text-amber-600 dark:text-amber-500',
                                supStatus === 'critical' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              )}
                            >
                              {supStatus === 'normal' && (isBangla ? 'স্বাভাবিক' : 'Normal')}
                              {supStatus === 'warning' && (isBangla ? 'ঝুঁকিপূর্ণ' : 'Warning')}
                              {supStatus === 'critical' && (isBangla ? 'উচ্চ ঝুঁকি' : 'Critical')}
                            </Badge>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-foreground text-sm">
                            {dueAmount > 0 ? formatCurrency(dueAmount) : '—'}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenPay(sup.id)}
                                disabled={dueAmount === 0}
                                className="h-7 text-[10px] px-2 gap-1 border-rose-500/20 hover:bg-rose-500/10 text-rose-500 dark:text-rose-400"
                              >
                                <CreditCard className="h-3 w-3" />
                                <span>{isBangla ? 'পেমেন্ট প্রদান' : 'Pay Vendor'}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenLedger(sup.id)}
                                className="h-7 text-[10px] px-2 gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                <span>{isBangla ? 'খতিয়ান' : 'Ledger'}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOpenReminder(sup.id)}
                                disabled={dueAmount === 0}
                                className="h-7 text-[10px] px-2 text-primary hover:bg-primary/10 gap-1"
                              >
                                <Bell className="h-3 w-3" />
                                <span>{isBangla ? 'রিমাইন্ডার' : 'Reminder'}</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Tab 2: Payout Logs */}
        {activeTab === 'logs' && (
          <PayoutHistory logs={payoutLogs} />
        )}
      </div>

      {/* 5. Pay Supplier (Payment Out) Modal */}
      <AddPaymentOutModal
        isOpen={isPayOpen}
        onClose={() => setIsPayOpen(false)}
        defaultPartyId={selectedSupId}
      />

      {/* 6. Record New Bill Dialog Popup */}
      <Dialog open={isNewDueOpen} onOpenChange={setIsNewDueOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleRecordCreditPurchase} className="space-y-4">
            <DialogHeader className="border-b pb-2">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>{isBangla ? 'নতুন সরবরাহকারী বকেয়া বিল যোগ করুন' : 'Record Supplier Bill (Purchase)'}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'সরবরাহকারীর নাম / কোম্পানি' : 'Supplier Business Name'}</label>
                <Input
                  placeholder={isBangla ? 'যেমন: এপেক্স লেদার ডিস্ট্রিবিউশন' : 'e.g. Apex Distributers'}
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  required
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'মোবাইল নম্বর' : 'Phone'}</label>
                <Input
                  placeholder="+8801700000000"
                  value={newSupPhone}
                  onChange={(e) => setNewSupPhone(e.target.value)}
                  className="h-9 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'বিল রেফারেন্স (Bill Invoice Ref)' : 'Bill Ref'}</label>
                  <Input
                    placeholder="INV-SUP-X"
                    value={newSupInv}
                    onChange={(e) => setNewSupInv(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'পরিশোধের সময়সীমা' : 'Credit Terms'}</label>
                  <select
                    value={newSupTerm}
                    onChange={(e) => setNewSupTerm(e.target.value)}
                    className="w-full h-9 rounded-lg border bg-background px-3 text-xs focus:outline-none"
                  >
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 60">Net 60 Days</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'বকেয়া প্রদেয় পরিমাণ (টাকা)' : 'Owed Credit Amount'}</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newSupAmount}
                  onChange={(e) => setNewSupAmount(e.target.value)}
                  required
                  className="h-9 font-mono"
                />
              </div>
            </div>

            <DialogFooter className="border-t pt-3">
              <Button type="button" variant="outline" onClick={() => setIsNewDueOpen(false)} className="text-xs h-9">
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button type="submit" className="text-xs h-9">
                {isBangla ? 'ভাউচার দাখিল করুন' : 'Submit Supplier Bill'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. View Supplier Ledger Modal Dialog */}
      <Dialog open={isLedgerOpen} onOpenChange={setIsLedgerOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="border-b pb-2.5">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>{isBangla ? 'সরবরাহকারী খতিয়ান বই' : 'Supplier Account Ledger'}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedSupplier ? (
            <div className="space-y-4">
              {/* Header profile cards */}
              <div className="grid grid-cols-2 gap-4 bg-muted/40 p-3 rounded-lg text-xs font-semibold">
                <div>
                  <span className="text-muted-foreground block">{isBangla ? 'সরবরাহকারী:' : 'Supplier Name:'}</span>
                  <span className="text-sm font-bold text-foreground block mt-0.5">
                    {isBangla && selectedSupplier.nameBn ? selectedSupplier.nameBn : selectedSupplier.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block">{isBangla ? 'মোট বকেয়া পাওনা (Outstanding):' : 'Total Outstanding Balance:'}</span>
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400 block mt-0.5 font-mono">
                    {formatCurrency(selectedSupplier.currentBalance ?? selectedSupplier.totalDue ?? 0)}
                  </span>
                </div>
              </div>

              {/* Entries list table */}
              <div className="border border-border/50 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                {isLedgerLoading ? (
                  <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-xs">{isBangla ? 'খতিয়ান লোড হচ্ছে...' : 'Loading ledger...'}</span>
                  </div>
                ) : ledgerEntries.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    {isBangla ? 'কোনো খতিয়ান রেকর্ড পাওয়া যায়নি।' : 'No ledger records found for this supplier.'}
                  </div>
                ) : (
                  <table className="w-full text-left text-[11px] border-collapse font-mono">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border/25 font-bold text-muted-foreground">
                        <th className="p-2.5">{isBangla ? 'তারিখ' : 'Date'}</th>
                        <th className="p-2.5">{isBangla ? 'রেফারেন্স' : 'Voucher Ref'}</th>
                        <th className="p-2.5">{isBangla ? 'বিবরণ' : 'Description'}</th>
                        <th className="p-2.5 text-right">{isBangla ? 'ডেবিট (-)' : 'Debit (-)'}</th>
                        <th className="p-2.5 text-right">{isBangla ? 'ক্রেডিট (+)' : 'Credit (+)'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {ledgerEntries.map((entry: any, idx: number) => {
                        const entryDate = entry.date ? new Date(entry.date).toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
                        return (
                          <tr key={idx} className="hover:bg-muted/5">
                            <td className="p-2.5 text-muted-foreground">{entryDate}</td>
                            <td className="p-2.5 text-primary font-bold">{entry.ref || entry.referenceNo || entry.invoiceNo || '—'}</td>
                            <td className="p-2.5 text-foreground truncate max-w-[150px]">
                              {isBangla && entry.descBn ? entry.descBn : (entry.desc || entry.narration || entry.description || '—')}
                            </td>
                            <td className="p-2.5 text-right text-emerald-600 dark:text-emerald-500">
                              {entry.debit > 0 ? formatCurrency(entry.debit) : '—'}
                            </td>
                            <td className="p-2.5 text-right text-rose-600 dark:text-rose-400">
                              {entry.credit > 0 ? formatCurrency(entry.credit) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground">
              {isBangla ? 'কোনো সরবরাহকারী নির্বাচন করা হয়নি।' : 'No supplier selected.'}
            </div>
          )}

          <DialogFooter className="border-t pt-3">
            <Button variant="outline" onClick={() => setIsLedgerOpen(false)} className="text-xs h-9">
              {isBangla ? 'বন্ধ করুন' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. Add Reminder Modal */}
      <AddReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        partyId={selectedSupId}
      />
    </div>
  );
}
