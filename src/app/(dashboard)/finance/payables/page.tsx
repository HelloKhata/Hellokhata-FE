'use client';

import React, { useState } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';

interface SupplierDue {
  id: string;
  name: string;
  nameBn: string;
  totalDue: number;
  lastPaymentDate: string;
  phone: string;
  status: 'normal' | 'warning' | 'critical';
  ledger: Array<{
    date: string;
    ref: string;
    desc: string;
    descBn: string;
    debit: number;  // decreases due (our payments)
    credit: number; // increases due (our purchases)
  }>;
}

interface PayoutLog {
  id: string;
  date: string;
  supplierName: string;
  supplierNameBn: string;
  amount: number;
  discount: number;
  method: string;
  methodBn: string;
  ref: string;
}

export default function FinancePayablesPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  // State Management: Supplier Outstanding Balances
  const [suppliers, setSuppliers] = useState<SupplierDue[]>([
    {
      id: 'SUP-001',
      name: 'Apex Distributers',
      nameBn: 'এপেক্স ডিস্ট্রিবিউটর',
      totalDue: 180000,
      lastPaymentDate: '2026-08-01',
      phone: '+8801722334455',
      status: 'normal',
      ledger: [
        { date: '2026-07-12', ref: 'INV-AP-492', desc: 'Credit purchase of leather batches', descBn: 'বাকিতে চামড়া সরবরাহ', debit: 0, credit: 280000 },
        { date: '2026-08-01', ref: 'PAY-AP-101', desc: 'Vendor partial payment payout', descBn: 'সরবরাহকারী আংশিক বিল পরিশোধ', debit: 100000, credit: 0 },
      ],
    },
    {
      id: 'SUP-002',
      name: 'Bata Wholesale Hub',
      nameBn: 'বাটা পাইকারি হাব',
      totalDue: 142300,
      lastPaymentDate: '2026-07-25',
      phone: '+8801822334455',
      status: 'normal',
      ledger: [
        { date: '2026-07-15', ref: 'INV-BT-902', desc: 'Wholesale footwear stock delivery', descBn: 'বাকিতে জুতো স্টক সরবরাহ', debit: 0, credit: 192300 },
        { date: '2026-07-25', ref: 'PAY-BT-094', desc: 'Bata invoice settlement payment', descBn: 'বাটা ইনভয়েস বিল পরিশোধ', debit: 50000, credit: 0 },
      ],
    },
    {
      id: 'SUP-003',
      name: 'National Leather Co.',
      nameBn: 'ন্যাশনাল লেদার কোং',
      totalDue: 90000,
      lastPaymentDate: '2026-06-10',
      phone: '+8801922334455',
      status: 'critical',
      ledger: [
        { date: '2026-06-10', ref: 'INV-NL-231', desc: 'Raw synthetic chemicals delivery', descBn: 'বাকিতে সিন্থেটিক রাসায়নিক সরবরাহ', debit: 0, credit: 90000 },
      ],
    },
  ]);

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
  const [selectedSupId, setSelectedSupId] = useState('');

  // Form Fields: Record Payout
  const [formAmount, setFormAmount] = useState('');
  const [formDiscount, setFormDiscount] = useState('0');
  const [formMethod, setFormMethod] = useState('Bank Transfer');
  const [formDesc, setFormDesc] = useState('');

  // Form Fields: New Bill Due
  const [newSupName, setNewSupName] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupAmount, setNewSupAmount] = useState('');
  const [newSupInv, setNewSupInv] = useState('');
  const [newSupTerm, setNewSupTerm] = useState('Net 30');

  const [alertMessage, setAlertMessage] = useState('');

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupId);

  // Totals
  const totalPayables = suppliers.reduce((acc, s) => acc + s.totalDue, 0);
  const criticalCount = suppliers.filter((s) => s.status === 'critical' && s.totalDue > 0).length;
  const warningCount = suppliers.filter((s) => s.status === 'warning' && s.totalDue > 0).length;

  const handleOpenPay = (id: string) => {
    setSelectedSupId(id);
    setIsPayOpen(true);
  };

  const handleOpenLedger = (id: string) => {
    setSelectedSupId(id);
    setIsLedgerOpen(true);
  };

  const handleRecordPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;

    const amountNum = parseFloat(formAmount) || 0;
    const discountNum = parseFloat(formDiscount) || 0;
    const totalReduction = amountNum + discountNum;

    if (amountNum <= 0) return;

    if (selectedSupplier.totalDue < totalReduction) {
      alert(isBangla ? 'ভুল এন্ট্রি! পরিশোধ পরিমাণ সরবরাহকারীর বকেয়া থেকে বেশি।' : 'Incorrect entry! Payout amount exceeds supplier outstanding balance.');
      return;
    }

    const payoutRef = `PAY-SUP-${(payoutLogs.length + 100).toString()}`;
    const today = new Date().toISOString().split('T')[0];

    // Update Supplier list state
    setSuppliers(
      suppliers.map((s) => {
        if (s.id === selectedSupplier.id) {
          const updatedDue = Math.max(0, s.totalDue - totalReduction);
          return {
            ...s,
            totalDue: updatedDue,
            lastPaymentDate: today,
            status: updatedDue > 150000 ? 'critical' : updatedDue > 80000 ? 'warning' : 'normal',
            ledger: [
              ...s.ledger,
              {
                date: today,
                ref: payoutRef,
                desc: formDesc || 'Vendor invoice settlement payout',
                descBn: formDesc || 'সরবরাহকারী বিল পরিশোধ সম্পন্ন',
                debit: totalReduction,
                credit: 0,
              },
            ],
          };
        }
        return s;
      })
    );

    // Append to Payout history state
    const newLog: PayoutLog = {
      id: payoutRef,
      date: today,
      supplierName: selectedSupplier.name,
      supplierNameBn: selectedSupplier.nameBn,
      amount: amountNum,
      discount: discountNum,
      method: formMethod,
      methodBn: isBangla ? (formMethod === 'Cash' ? 'নগদ টাকা' : formMethod === 'Bank Transfer' ? 'ব্যাংক স্থানান্তর' : 'মোবাইল ওয়ালেট') : formMethod,
      ref: formDesc || 'Invoice Settlement',
    };

    setPayoutLogs([newLog, ...payoutLogs]);
    setIsPayOpen(false);

    // Reset Form
    setFormAmount('');
    setFormDiscount('0');
    setFormDesc('');

    setAlertMessage(isBangla ? 'সরবরাহকারী পেমেন্ট আউট সফলভাবে সম্পন্ন হয়েছে!' : 'Vendor payout payment saved successfully!');
    setTimeout(() => setAlertMessage(''), 4000);
  };

  const handleRecordCreditPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newSupAmount) || 0;

    if (!newSupName.trim() || amountNum <= 0) return;

    const today = new Date().toISOString().split('T')[0];
    const invoiceRef = newSupInv || `INV-SUP-${(Math.floor(Math.random() * 900) + 100)}`;

    const existingSup = suppliers.find((s) => s.name.toLowerCase() === newSupName.toLowerCase());

    if (existingSup) {
      setSuppliers(
        suppliers.map((s) => {
          if (s.id === existingSup.id) {
            const updatedDue = s.totalDue + amountNum;
            return {
              ...s,
              totalDue: updatedDue,
              status: updatedDue > 150000 ? 'critical' : updatedDue > 80000 ? 'warning' : 'normal',
              ledger: [
                ...s.ledger,
                {
                  date: today,
                  ref: invoiceRef,
                  desc: `Credit Purchase (${newSupTerm})`,
                  descBn: `বাকিতে ক্রয় (${newSupTerm})`,
                  debit: 0,
                  credit: amountNum,
                },
              ],
            };
          }
          return s;
        })
      );
    } else {
      const newSupId = `SUP-${(suppliers.length + 1).toString().padStart(3, '0')}`;
      const newSupObj: SupplierDue = {
        id: newSupId,
        name: newSupName,
        nameBn: newSupName,
        totalDue: amountNum,
        lastPaymentDate: 'N/A',
        phone: newSupPhone || '+8801700000000',
        status: amountNum > 150000 ? 'critical' : amountNum > 80000 ? 'warning' : 'normal',
        ledger: [
          {
            date: today,
            ref: invoiceRef,
            desc: `Initial Credit Purchase (${newSupTerm})`,
            descBn: `প্রারম্ভিক বাকিতে ক্রয় (${newSupTerm})`,
            debit: 0,
            credit: amountNum,
          },
        ],
      };
      setSuppliers([newSupObj, ...suppliers]);
    }

    setIsNewDueOpen(false);

    // Reset Form
    setNewSupName('');
    setNewSupPhone('');
    setNewSupAmount('');
    setNewSupInv('');

    setAlertMessage(isBangla ? 'ক্রেডিট পারচেস/বকেয়া বিল সফলভাবে এন্ট্রি হয়েছে!' : 'Credit purchase bill logged successfully!');
    setTimeout(() => setAlertMessage(''), 4000);
  };

  const handleSchedule = (sup: SupplierDue) => {
    const name = isBangla ? sup.nameBn : sup.name;
    setAlertMessage(
      isBangla
        ? `${name} এর বকেয়া পরিশোধ করার জন্য পেমেন্ট গেটওয়েতে সিডিউল করা হয়েছে!`
        : `Configured automated payout scheduler for ${name} (${formatCurrency(sup.totalDue)}) successfully!`
    );
    setTimeout(() => setAlertMessage(''), 4000);
  };

  // Filter & Search Logic
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk =
      riskFilter === 'all' ||
      s.status === riskFilter;

    return matchesSearch && matchesRisk;
  });

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
                  {filteredSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-muted-foreground font-semibold">
                        {isBangla ? 'কোনো বকেয়া সরবরাহকারী পাওয়া যায়নি।' : 'No supplier outstanding balances found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredSuppliers.map((sup) => (
                      <tr key={sup.id} className="hover:bg-muted/5">
                        <td className="p-3 font-mono text-muted-foreground">{sup.id}</td>
                        <td className="p-3 font-bold text-foreground">
                          {isBangla ? sup.nameBn : sup.name}
                        </td>
                        <td className="p-3 font-mono text-muted-foreground">{sup.phone}</td>
                        <td className="p-3 font-mono text-muted-foreground">{sup.lastPaymentDate}</td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[9px] py-0.5 px-2 rounded-md border-transparent font-bold capitalize',
                              sup.status === 'normal' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500',
                              sup.status === 'warning' && 'bg-amber-500/10 text-amber-600 dark:text-amber-500',
                              sup.status === 'critical' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            )}
                          >
                            {sup.status === 'normal' && (isBangla ? 'স্বাভাবিক' : 'Normal')}
                            {sup.status === 'warning' && (isBangla ? 'ঝুঁকিপূর্ণ' : 'Warning')}
                            {sup.status === 'critical' && (isBangla ? 'উচ্চ ঝুঁকি' : 'Critical')}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-foreground text-sm">
                          {sup.totalDue > 0 ? formatCurrency(sup.totalDue) : '—'}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenPay(sup.id)}
                              disabled={sup.totalDue === 0}
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
                              onClick={() => handleSchedule(sup)}
                              disabled={sup.totalDue === 0}
                              className="h-7 text-[10px] px-2 text-primary hover:bg-primary/10 gap-1"
                            >
                              <CalendarDays className="h-3 w-3" />
                              <span>{isBangla ? 'সিডিউল' : 'Schedule'}</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Tab 2: Payout Logs */}
        {activeTab === 'logs' && (
          <Card className="border-border/50 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/30 font-bold text-muted-foreground">
                    <th className="p-3">{isBangla ? 'ভাউচার আইডি' : 'Payout Ref'}</th>
                    <th className="p-3">{isBangla ? 'তারিখ' : 'Date'}</th>
                    <th className="p-3">{isBangla ? 'সরবরাহকারী' : 'Supplier'}</th>
                    <th className="p-3">{isBangla ? 'পেমেন্ট পদ্ধতি' : 'Method'}</th>
                    <th className="p-3">{isBangla ? 'নোট' : 'Remarks'}</th>
                    <th className="p-3 text-right">{isBangla ? 'প্রাপ্ত ডিসকাউন্ট' : 'Discount Recd'}</th>
                    <th className="p-3 text-right">{isBangla ? 'মোট পরিশোধিত পরিমাণ' : 'Payout Net'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {payoutLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/5">
                      <td className="p-3 font-mono font-bold text-primary">{log.id}</td>
                      <td className="p-3 font-mono text-muted-foreground">{log.date}</td>
                      <td className="p-3 font-semibold text-foreground">{isBangla ? log.supplierNameBn : log.supplierName}</td>
                      <td className="p-3 text-muted-foreground">{isBangla ? log.methodBn : log.method}</td>
                      <td className="p-3 text-muted-foreground">{log.ref}</td>
                      <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-500">
                        {log.discount > 0 ? formatCurrency(log.discount) : '—'}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                        {formatCurrency(log.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* 5. Pay Supplier (Payment Voucher) Dialog Popup */}
      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleRecordPayout} className="space-y-4">
            <DialogHeader className="border-b pb-2">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-rose-600" />
                <span>{isBangla ? 'সরবরাহকারী বিল পরিশোধ ভাউচার' : 'Record Supplier Payout'}</span>
              </DialogTitle>
            </DialogHeader>

            {selectedSupplier && (
              <div className="bg-muted/40 p-2.5 rounded-lg text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isBangla ? 'সরবরাহকারী:' : 'Vendor:'}</span>
                  <span className="font-bold text-foreground">{isBangla ? selectedSupplier.nameBn : selectedSupplier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isBangla ? 'বর্তমান বকেয়া (Outstanding):' : 'Current Outstanding:'}</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">{formatCurrency(selectedSupplier.totalDue)}</span>
                </div>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'পরিশোধের পরিমাণ' : 'Payout Amount'}</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    required
                    className="font-mono h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">{isBangla ? 'প্রাপ্ত ডিসকাউন্ট' : 'Discount Recd'}</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value)}
                    className="font-mono h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'উৎস তহবিল পদ্ধতি' : 'Source Cash/Bank Method'}</label>
                <select
                  value={formMethod}
                  onChange={(e) => setFormMethod(e.target.value)}
                  className="w-full h-9 rounded-lg border bg-background px-3 text-xs focus:outline-none"
                >
                  <option value="Bank Transfer">{isBangla ? 'ব্যাংক স্থানান্তর (Operating Account)' : 'Bank Transfer'}</option>
                  <option value="Cash">{isBangla ? 'ক্যাশ অন হ্যান্ড (Cash Box)' : 'Cash Box'}</option>
                  <option value="Mobile Wallet">{isBangla ? 'মোবাইল ওয়ালেট (bKash/Nagad)' : 'Mobile Wallet'}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'বিবরণ / ন্যারেশন' : 'Memo / Remarks'}</label>
                <Input
                  placeholder={isBangla ? 'যেমন: চেক নাম্বার বা বিলের রেফারেন্স...' : 'e.g. Cleared bill invoice INV-AP-492'}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <DialogFooter className="border-t pt-3">
              <Button type="button" variant="outline" onClick={() => setIsPayOpen(false)} className="text-xs h-9">
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button type="submit" className="text-xs h-9">
                {isBangla ? 'পরিশোধ সংরক্ষণ করুন' : 'Submit Payment Voucher'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                  <span className="text-sm font-bold text-foreground block mt-0.5">{isBangla ? selectedSupplier.nameBn : selectedSupplier.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block">{isBangla ? 'মোট বকেয়া পাওনা (Outstanding):' : 'Total Outstanding Balance:'}</span>
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400 block mt-0.5 font-mono">{formatCurrency(selectedSupplier.totalDue)}</span>
                </div>
              </div>

              {/* Entries list table */}
              <div className="border border-border/50 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
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
                    {selectedSupplier.ledger.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-muted/5">
                        <td className="p-2.5 text-muted-foreground">{entry.date}</td>
                        <td className="p-2.5 text-primary font-bold">{entry.ref}</td>
                        <td className="p-2.5 text-foreground truncate max-w-[150px]">{isBangla ? entry.descBn : entry.desc}</td>
                        <td className="p-2.5 text-right text-emerald-600 dark:text-emerald-500">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : '—'}
                        </td>
                        <td className="p-2.5 text-right text-rose-600 dark:text-rose-400">
                          {entry.credit > 0 ? formatCurrency(entry.credit) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
    </div>
  );
}
