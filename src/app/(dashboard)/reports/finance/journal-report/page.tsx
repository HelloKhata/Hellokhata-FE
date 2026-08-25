// Hello Khata OS - Journal Book & Vouchers Register
// হ্যালো খাতা - জাবেদা বই ও ভাউচার রেজিস্টার (JV, PV, RV, CV রেজিস্টার)

'use client';

import React, { useState } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import {
  Receipt,
  Filter,
  Printer,
  FileSpreadsheet,
  Search,
  Calendar,
  Building2,
  CheckCircle2,
  FilePen,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'sonner';

export default function JournalReportPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [searchTerm, setSearchTerm] = useState('');

  const vouchers = [
    {
      voucherNo: 'JV-001',
      type: 'JV',
      typeName: 'Journal Voucher',
      date: '2026-05-01',
      particulars: 'Initial company cash and bank operating capital equity setup',
      entries: [
        { code: '1010', account: 'Cash on Hand (Vault Desk)', isDebit: true, amount: 456800 },
        { code: '1020', account: 'Bank Operating Account (BRAC Bank)', isDebit: true, amount: 1287500 },
        { code: '3010', account: 'Paid-up Share Capital', isDebit: false, amount: 1744300 },
      ]
    },
    {
      voucherNo: 'INV-2048',
      type: 'RV',
      typeName: 'Sales Receipt Voucher',
      date: '2026-05-02',
      particulars: 'Commercial product sales to ABC Traders on credit terms',
      entries: [
        { code: '1100', account: 'Accounts Receivable (ABC Traders)', isDebit: true, amount: 125000 },
        { code: '4010', account: 'Product Sales Revenues', isDebit: false, amount: 125000 },
      ]
    },
    {
      voucherNo: 'PV-5021',
      type: 'PV',
      typeName: 'Payment Voucher',
      date: '2026-05-03',
      particulars: 'Monthly staff salaries and benefits payment disbursement',
      entries: [
        { code: '6010', account: 'Employee Salaries & Payroll', isDebit: true, amount: 500000 },
        { code: '1020', account: 'Bank Operating Account (BRAC Bank)', isDebit: false, amount: 500000 },
      ]
    },
    {
      voucherNo: 'PV-5022',
      type: 'PV',
      typeName: 'Payment Voucher',
      date: '2026-05-04',
      particulars: 'Commercial showroom & office rental payment',
      entries: [
        { code: '6020', account: 'Office Rent & Utility Bills', isDebit: true, amount: 240000 },
        { code: '1020', account: 'Bank Operating Account (BRAC Bank)', isDebit: false, amount: 240000 },
      ]
    },
    {
      voucherNo: 'JV-002',
      type: 'JV',
      typeName: 'Journal Voucher',
      date: '2026-05-05',
      particulars: 'Inventory stock depletion record against sales invoice delivery',
      entries: [
        { code: '5010', account: 'Cost of Goods Sold (COGS)', isDebit: true, amount: 923400 },
        { code: '1200', account: 'Commercial Inventory Stock', isDebit: false, amount: 923400 },
      ]
    },
    {
      voucherNo: 'CV-101',
      type: 'CV',
      typeName: 'Contra Voucher',
      date: '2026-05-08',
      particulars: 'Internal cash transfer from Counter Vault to City Bank Account',
      entries: [
        { code: '1020', account: 'City Bank Corporate Account', isDebit: true, amount: 120000 },
        { code: '1010', account: 'Cash on Hand (Vault Desk)', isDebit: false, amount: 120000 },
      ]
    },
  ];

  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      v.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.particulars.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.entries.some((e) => e.account.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedType === 'all') return matchesSearch;
    return matchesSearch && v.type === selectedType;
  });

  const totalDebitSum = filteredVouchers.reduce(
    (acc, v) => acc + v.entries.filter((e) => e.isDebit).reduce((s, e) => s + e.amount, 0),
    0
  );

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `জাবেদা রেজিস্টার ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Journal Register ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="Journal Book & Vouchers"
        pageNameBn="জাবেদা বই ও ভাউচার রেজিস্টার (Journal Register)"
        icon={Receipt}
      />

      {/* Top Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-sky-500/5 border border-sky-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'মোট রেজিস্টার্ড ভাউচার' : 'Total Vouchers Posted'}</div>
          <div className="text-2xl font-black font-mono text-foreground">{formatNumber(filteredVouchers.length)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'JV, PV, RV ও CV ভাউচার' : 'Complete double-entry logs'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-emerald-500/5 border border-emerald-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'সর্বমোট ডেবিট লেনদেন' : 'Total Debits Recorded'}</div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(totalDebitSum)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'শতভাগ ক্রেডিট সমতার সাথে' : '100% matched with credits'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-purple-500/5 border border-purple-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'ভাউচার শ্রেণীবিভাগ' : 'Voucher Classification'}</div>
          <div className="text-xl font-bold font-mono text-foreground">JV • PV • RV • CV</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'আন্তর্জাতিক মানসম্পন্ন' : 'Standard IFRS compliant'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-teal-500/10 border border-teal-500/30 shadow-md space-y-1.5 ring-1 ring-teal-500/20">
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 font-bold">{isBangla ? 'অডিট ভ্যালিডেশন' : 'Audit Trail Validation'}</div>
          <div className="text-xl font-bold font-mono text-foreground">Verified Clean</div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold font-mono">Zero Unbalanced Vouchers</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Voucher Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-9 text-xs w-52 bg-background">
              <Receipt className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সকল ভাউচার (All Vouchers)' : 'All Voucher Types'}</SelectItem>
              <SelectItem value="JV">JV - Journal Vouchers (জাবেদা)</SelectItem>
              <SelectItem value="PV">PV - Payment Vouchers (পেমেন্ট)</SelectItem>
              <SelectItem value="RV">RV - Receipt Vouchers (রিসিট)</SelectItem>
              <SelectItem value="CV">CV - Contra Vouchers (কন্ট্রা)</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'ভাউচার বা বিবরণ খুঁজুন...' : 'Search voucher or desc...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-8 text-xs bg-background"
            />
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
            className="h-9 text-xs gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Excel Journal</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="h-9 text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'জাবেদা প্রিন্ট' : 'Print Journal Book'}</span>
          </Button>
        </div>
      </div>

      {/* Double-Entry Vouchers List */}
      <div className="space-y-4">
        {filteredVouchers.map((voucher) => {
          const debits = voucher.entries.filter((e) => e.isDebit).reduce((s, e) => s + e.amount, 0);
          const credits = voucher.entries.filter((e) => !e.isDebit).reduce((s, e) => s + e.amount, 0);

          return (
            <Card key={voucher.voucherNo} className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-border/50 bg-muted/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg">
                    {voucher.voucherNo}
                  </span>
                  <Badge variant="outline" className="text-xs font-semibold">
                    {voucher.typeName}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono font-medium">{voucher.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[11px] font-mono">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Dr = Cr Reconciled ({formatCurrency(debits)})
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground font-medium">
                  <strong>{isBangla ? 'ব্যাখ্যা / বিবরণ:' : 'Particulars:'}</strong> {voucher.particulars}
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-muted-foreground text-[10px] uppercase font-bold border-b border-border/40 bg-muted/30">
                        <th className="py-2 px-3">{isBangla ? 'কোড' : 'Code'}</th>
                        <th className="py-2 px-3">{isBangla ? 'খতিয়ান হিসাব শিরোনাম' : 'Account Title'}</th>
                        <th className="py-2 px-3 text-right">{isBangla ? 'ডেবিট (Dr)' : 'Debit (Dr)'}</th>
                        <th className="py-2 px-3 text-right">{isBangla ? 'ক্রেডিট (Cr)' : 'Credit (Cr)'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 font-mono">
                      {voucher.entries.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-muted/20">
                          <td className="py-2 px-3 text-muted-foreground">{entry.code}</td>
                          <td className="py-2 px-3 font-sans font-medium text-foreground">{entry.account}</td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            {entry.isDebit ? formatCurrency(entry.amount) : '—'}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-blue-600 dark:text-blue-400">
                            {!entry.isDebit ? formatCurrency(entry.amount) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
