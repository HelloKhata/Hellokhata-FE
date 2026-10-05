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
  HandCoins,
  Search,
  Plus,
  Coins,
  Bell,
  AlertTriangle,
  CheckCircle2,
  FileText,
  User,
  History,
  Loader2,
} from 'lucide-react';
import { useParties, usePartyLedger } from '@/hooks/api/useParties';
import { AddPaymentInModal } from '@/components/parties/AddPaymentInModal';
import { AddReminderModal } from '@/components/parties/AddReminderModal';
import { CollectionHistory, CollectionLog } from '@/components/finance/receivables/CollectionHistory';

export interface CustomerParty {
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
    debit: number;
    credit: number;
  }>;
}

export default function FinanceReceivablesPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // API State: Fetch customers with receivable balance
  const { data: customers = [], isLoading: isLoadingCustomers } = useParties({
    type: 'customer',
    balanceType: 'receivable',
  });

  console.log(customers)
  // State Management: Collection Log List 
  const [collectionLogs, setCollectionLogs] = useState<CollectionLog[]>([
    { id: 'REC-2026-102', date: '2026-08-01', customerName: 'M/S Rahman & Sons', customerNameBn: 'মেসার্স রহমান এন্ড সন্স', amount: 100000, discount: 5000, method: 'Bank Transfer', methodBn: 'ব্যাংক স্থানান্তর', ref: 'Bank Transfer Receipt' },
    { id: 'REC-2026-099', date: '2026-07-28', customerName: 'Jamuna Traders', customerNameBn: 'যমুনা ট্রেডার্স', amount: 50000, discount: 0, method: 'Cash', methodBn: 'নগদ টাকা', ref: 'Counter Receipt' },
  ]);

  
  // UI Active Tab: 'dues' or 'logs'
  const [activeTab, setActiveTab] = useState<'dues' | 'logs'>('dues');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
 
  // Dialog States
  const [isCollectOpen, setIsCollectOpen] = useState(false);
  const [isNewDueOpen, setIsNewDueOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [selectedCustId, setSelectedCustId] = useState('');

  // Form Fields: Log Credit Due
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAmount, setNewCustAmount] = useState('');
  const [newCustInv, setNewCustInv] = useState('');
  const [newCustTerm, setNewCustTerm] = useState('Net 30');

  const [alertMessage, setAlertMessage] = useState('');

  // Selected customer for modals
  const selectedCustomer: CustomerParty | null = useMemo(() => {
    if (!Array.isArray(customers)) return null;
    return customers.find((c: any) => c.id === selectedCustId) || null;
  }, [customers, selectedCustId]);

  // Party ledger query when ledger dialog is open
  const { data: partyLedgerData, isLoading: isLedgerLoading } = usePartyLedger(
    selectedCustId,
    undefined,
    { enabled: isLedgerOpen && !!selectedCustId }
  );

  const ledgerEntries = useMemo(() => {
    if (partyLedgerData?.data?.transactions) return partyLedgerData.data.transactions;
    if (partyLedgerData?.data?.ledger) return partyLedgerData.data.ledger;
    if (selectedCustomer?.ledger) return selectedCustomer.ledger;
    return [];
  }, [partyLedgerData, selectedCustomer]);

  // Totals & Risk Stats calculation
  const totalReceivables = useMemo(() => {
    if (!Array.isArray(customers)) return 0;
    return customers.reduce((acc: number, c: any) => acc + (c.currentBalance ?? c.totalDue ?? 0), 0);
  }, [customers]);

  const criticalCount = useMemo(() => {
    if (!Array.isArray(customers)) return 0;
    return customers.filter((c: any) => {
      const due = c.currentBalance ?? c.totalDue ?? 0;
      return (c.status === 'critical' || due > 150000) && due > 0;
    }).length;
  }, [customers]);

  const warningCount = useMemo(() => {
    if (!Array.isArray(customers)) return 0;
    return customers.filter((c: any) => {
      const due = c.currentBalance ?? c.totalDue ?? 0;
      return (c.status === 'warning' || (due > 80000 && due <= 150000)) && due > 0;
    }).length;
  }, [customers]);

  const handleSendReminder = (cust: CustomerParty) => {
    const name = isBangla && cust.nameBn ? cust.nameBn : cust.name;
    const dueAmount = cust.currentBalance ?? cust.totalDue ?? 0;
    setAlertMessage(
      isBangla
        ? `${name} কে ${formatCurrency(dueAmount)} বকেয়া পরিশোধের জন্য এসএমএস রিমাইন্ডার পাঠানো হয়েছে!`
        : `SMS payment alert for ${formatCurrency(dueAmount)} sent to ${name} (${cust.phone || 'N/A'}) successfully!`
    );
    setTimeout(() => setAlertMessage(''), 4000);
  };

  const handleOpenCollect = (id: string) => {
    setSelectedCustId(id);
    setIsCollectOpen(true);
  };

  const handleOpenLedger = (id: string) => {
    setSelectedCustId(id);
    setIsLedgerOpen(true);
  };

  const handleOpenReminder = (id: string) => {
    setSelectedCustId(id);
    setIsReminderOpen(true);
  };

  const handleRecordCreditSale = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newCustAmount) || 0;

    if (!newCustName.trim() || amountNum <= 0) return;

    setIsNewDueOpen(false);

    // Reset Form
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAmount('');
    setNewCustInv('');

    setAlertMessage(isBangla ? 'ক্রেডিট সেল/বকেয়া এন্ট্রি সফলভাবে যুক্ত হয়েছে!' : 'Credit sale entry logged successfully!');
    setTimeout(() => setAlertMessage(''), 4000);
  };

  // Filter & Search Logic
  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers)) return [];
    return customers.filter((c: any) => {
      const due = c.currentBalance ?? c.totalDue ?? 0;
      const custStatus = c.status || (due > 150000 ? 'critical' : due > 80000 ? 'warning' : 'normal');
      const name = c.name || '';
      const nameBn = c.nameBn || '';
      const phone = c.phone || '';
      const id = c.id || '';

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm) ||
        id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRisk =
        riskFilter === 'all' ||
        custStatus === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [customers, searchTerm, riskFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <FinancePageHeader
          pageName="Receivables Management"
          pageNameBn="প্রাপ্য হিসাব ব্যবস্থাপনা (কালেকশন)"
          description="Record customer due payments, register credit invoices, and manage payment reminders."
          descriptionBn="গ্রাহকদের বকেয়া পর্যবেক্ষণ করুন, পরিশোধ আদায় রেকর্ড করুন এবং পেমেন্ট রিমাইন্ডার পাঠান।"
          icon={HandCoins}
          showBackButton={true}
          backHref="/finance/overview"
        />
        <div className="flex gap-2 shrink-0">
          <Button onClick={() => setIsNewDueOpen(true)} className="gap-1.5 text-xs h-9">
            <Plus className="h-4 w-4" />
            {isBangla ? 'নতুন বকেয়া এন্ট্রি (Credit Sale)' : 'Record Credit Sale'}
          </Button>
        </div>
      </div>

      {/* 2. Feedback Alert banner */}
      {alertMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all duration-300">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* 3. Operational Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-card to-indigo-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'গ্রাহকদের মোট বকেয়া পাওনা' : 'Total Outstanding Dues'}</p>
              <h3 className="text-xl font-bold text-foreground mt-1 font-mono">{formatCurrency(totalReceivables)}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <HandCoins className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-rose-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{isBangla ? 'উচ্চ ঝুঁকি প্রোফাইল (৯০+ দিন)' : 'High Risk Profiles (90+)'}</p>
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
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{isBangla ? 'মধ্যম ঝুঁকি প্রোফাইল (৩১-৬০ দিন)' : 'Medium Risk Profiles (31-60)'}</p>
              <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-mono">{warningCount}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Bell className="h-5 w-5" />
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
              onClick={() => setActiveTab('dues')}
              className={cn(
                'py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5',
                activeTab === 'dues' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <User className="h-3.5 w-3.5" />
              <span>{isBangla ? 'কাস্টমার বকেয়া লিস্ট' : 'Customer Balances'}</span>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={cn(
                'py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5',
                activeTab === 'logs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <History className="h-3.5 w-3.5" />
              <span>{isBangla ? 'আদায় সংগ্রহ লগ' : 'Collection History'}</span>
            </button>
          </div>

          {/* Quick Search and filter (Only for dues tab) */}
          {activeTab === 'dues' && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <div className="relative w-full sm:w-44">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={isBangla ? 'অনুসন্ধান...' : 'Search clients...'}
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

        {/* Tab 1: Customer outstanding dues list */}
        {activeTab === 'dues' && (
          <Card className="border-border/50 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/30 font-bold text-muted-foreground">
                    <th className="p-3">{isBangla ? 'গ্রাহক আইডি' : 'ID'}</th>
                    <th className="p-3">{isBangla ? 'ব্যবসার নাম' : 'Customer Business'}</th>
                    <th className="p-3">{isBangla ? 'যোগাযোগ' : 'Phone'}</th>
                    <th className="p-3">{isBangla ? 'সর্বশেষ আদায় পরিশোধ' : 'Last Payment'}</th>
                    <th className="p-3">{isBangla ? 'ঝুঁকি রেটিং' : 'Status'}</th>
                    <th className="p-3 text-right">{isBangla ? 'মোট বকেয়া পাওনা' : 'Total Due'}</th>
                    <th className="p-3 text-center">{isBangla ? 'অ্যাকশন পদক্ষেপ' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {isLoadingCustomers ? (
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
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-muted-foreground font-semibold">
                        {isBangla ? 'কোনো বকেয়া কাস্টমার পাওয়া যায়নি।' : 'No customer outstanding balances found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust: any) => {
                      const dueAmount = cust.currentBalance ?? cust.totalDue ?? 0;
                      const custStatus = cust.status || (dueAmount > 150000 ? 'critical' : dueAmount > 80000 ? 'warning' : 'normal');
                      const displayDate = cust.lastPaymentDate || (cust.createdAt ? new Date(cust.createdAt).toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—');

                      return (
                        <tr key={cust.id} className="hover:bg-muted/5">
                          <td className="p-3 font-mono text-muted-foreground text-[11px] truncate max-w-[120px]" title={cust.id}>
                            {cust.id}
                          </td>
                          <td className="p-3 font-bold text-foreground">
                            {isBangla && cust.nameBn ? cust.nameBn : cust.name}
                          </td>
                          <td className="p-3 font-mono text-muted-foreground">{cust.phone || '—'}</td>
                          <td className="p-3 font-mono text-muted-foreground">{displayDate}</td>
                          <td className="p-3">
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[9px] py-0.5 px-2 rounded-md border-transparent font-bold capitalize',
                                custStatus === 'normal' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500',
                                custStatus === 'warning' && 'bg-amber-500/10 text-amber-600 dark:text-amber-500',
                                custStatus === 'critical' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              )}
                            >
                              {custStatus === 'normal' && (isBangla ? 'স্বাভাবিক' : 'Normal')}
                              {custStatus === 'warning' && (isBangla ? 'ঝুঁকিপূর্ণ' : 'Warning')}
                              {custStatus === 'critical' && (isBangla ? 'উচ্চ ঝুঁকি' : 'Critical')}
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
                                onClick={() => handleOpenCollect(cust.id)}
                                disabled={dueAmount === 0}
                                className="h-7 text-[10px] px-2 gap-1 border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
                              >
                                <Coins className="h-3 w-3" />
                                <span>{isBangla ? 'টাকা সংগ্রহ' : 'Collect'}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenLedger(cust.id)}
                                className="h-7 text-[10px] px-2 gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                <span>{isBangla ? 'খতিয়ান' : 'Ledger'}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOpenReminder(cust.id)}
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

        {/* Tab 2: Historical Collection Logs */}
        {activeTab === 'logs' && (
          <CollectionHistory />
        )}
      </div>

      {/* 5. Collect Payment (Payment In) Modal */}
      <AddPaymentInModal
        isOpen={isCollectOpen}
        onClose={() => setIsCollectOpen(false)}
        defaultPartyId={selectedCustId}
      />

      {/* 6. Record New Credit Sale / Invoice Dialog Popup */}
      <Dialog open={isNewDueOpen} onOpenChange={setIsNewDueOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleRecordCreditSale} className="space-y-4">
            <DialogHeader className="border-b pb-2">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>{isBangla ? 'নতুন বাকিতে বিক্রি ভাউচার (Credit Sale)' : 'Record Credit Sale Voucher'}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'গ্রাহকের নাম / ব্যবসা প্রতিষ্ঠান' : 'Customer / Business Name'}</label>
                <Input
                  placeholder={isBangla ? 'যেমন: মেসার্স এনাম ব্রাদার্স' : 'e.g. M/S Anam Brothers'}
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  required
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'মোবাইল নম্বর' : 'Phone'}</label>
                <Input
                  placeholder="+8801700000000"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="h-9 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'চালান নম্বর (Invoice Ref)' : 'Invoice Ref'}</label>
                  <Input
                    placeholder="INV-2026-X"
                    value={newCustInv}
                    onChange={(e) => setNewCustInv(e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'পরিশোধের সময়সীমা' : 'Credit Terms'}</label>
                  <select
                    value={newCustTerm}
                    onChange={(e) => setNewCustTerm(e.target.value)}
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
                <label className="font-semibold text-muted-foreground">{isBangla ? 'বকেয়া পাওনা পরিমাণ (টাকা)' : 'Owed Credit Amount'}</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newCustAmount}
                  onChange={(e) => setNewCustAmount(e.target.value)}
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
                {isBangla ? 'ভাউচার দাখিল করুন' : 'Submit Credit Sale'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. View Customer Ledger Modal Dialog */}
      <Dialog open={isLedgerOpen} onOpenChange={setIsLedgerOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="border-b pb-2.5">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>{isBangla ? 'গ্রাহক খতিয়ান বই' : 'Customer Account Ledger'}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedCustomer ? (
            <div className="space-y-4">
              {/* Header profile cards */}
              <div className="grid grid-cols-2 gap-4 bg-muted/40 p-3 rounded-lg text-xs font-semibold">
                <div>
                  <span className="text-muted-foreground block">{isBangla ? 'গ্রাহক:' : 'Customer Name:'}</span>
                  <span className="text-sm font-bold text-foreground block mt-0.5">
                    {isBangla && selectedCustomer.nameBn ? selectedCustomer.nameBn : selectedCustomer.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block">{isBangla ? 'মোট বকেয়া পাওনা:' : 'Total Outstanding Balance:'}</span>
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400 block mt-0.5 font-mono">
                    {formatCurrency(selectedCustomer.currentBalance ?? selectedCustomer.totalDue ?? 0)}
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
                    {isBangla ? 'কোনো খতিয়ান রেকর্ড পাওয়া যায়নি।' : 'No ledger records found for this customer.'}
                  </div>
                ) : (
                  <table className="w-full text-left text-[11px] border-collapse font-mono">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border/25 font-bold text-muted-foreground">
                        <th className="p-2.5">{isBangla ? 'তারিখ' : 'Date'}</th>
                        <th className="p-2.5">{isBangla ? 'রেফারেন্স' : 'Voucher Ref'}</th>
                        <th className="p-2.5">{isBangla ? 'বিবরণ' : 'Description'}</th>
                        <th className="p-2.5 text-right">{isBangla ? 'ডেবিট (+)' : 'Debit (+)'}</th>
                        <th className="p-2.5 text-right">{isBangla ? 'ক্রেডিট (-)' : 'Credit (-)'}</th>
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
                            <td className="p-2.5 text-right text-rose-600 dark:text-rose-400">
                              {entry.debit > 0 ? formatCurrency(entry.debit) : '—'}
                            </td>
                            <td className="p-2.5 text-right text-emerald-600 dark:text-emerald-500">
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
              {isBangla ? 'কোনো গ্রাহক নির্বাচন করা হয়নি।' : 'No customer selected.'}
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
        partyId={selectedCustId}
      />
    </div>
  );
}
