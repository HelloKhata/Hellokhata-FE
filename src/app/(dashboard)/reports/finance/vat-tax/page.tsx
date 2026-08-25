// Hello Khata OS - VAT & Tax Compliance Register (NBR Mushak 9.1)
// হ্যালো খাতা - মূসক ও ভ্যাট রিটার্ন রেজিস্টার (ভ্যাট ৯.১ ও এআইটি অডিট)

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
  ShieldCheck,
  Filter,
  Download,
  Printer,
  FileSpreadsheet,
  Search,
  Receipt,
  Percent,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'sonner';

export default function VatTaxCompliancePage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedQuarter, setSelectedQuarter] = useState('q2_2026');
  const [searchTerm, setSearchTerm] = useState('');

  // Realistic NBR VAT & Tax mock data
  const vatSummary = {
    outputVatCollected: 142500, // VAT collected on sales
    inputVatRebate: 86400,      // Rebate on purchases & raw materials
    netVatPayable: 56100,       // Output - Input
    advanceIncomeTaxAit: 18500, // AIT deducted by clients at source
    taxWithholdingVds: 12400,   // VDS deducted by banks/parties
    finalTaxLiability: 37600,   // Net payable after AIT
  };

  const vatTransactions = [
    {
      id: 'vat-1',
      date: '2026-05-18',
      type: 'output',
      voucherNo: 'INV-2048',
      party: 'ABC Traders & Pharmacy',
      binTin: 'BIN-184920194',
      taxableAmount: 10870,
      vatRate: 15,
      vatAmount: 1630,
      aitAmount: 0,
      mushakForm: 'Mushak 6.3',
      status: 'verified',
    },
    {
      id: 'vat-2',
      date: '2026-05-18',
      type: 'output',
      voucherNo: 'INV-2047',
      party: 'Walk-in Retail POS',
      binTin: 'Retail POS',
      taxableAmount: 3652,
      vatRate: 15,
      vatAmount: 548,
      aitAmount: 0,
      mushakForm: 'Mushak 6.3',
      status: 'verified',
    },
    {
      id: 'vat-3',
      date: '2026-05-16',
      type: 'input',
      voucherNo: 'BILL-4012',
      party: 'Square Pharmaceuticals Ltd.',
      binTin: 'BIN-000192847',
      taxableAmount: 85000,
      vatRate: 15,
      vatAmount: 12750,
      aitAmount: 4250,
      mushakForm: 'Mushak 6.1 (Purchase)',
      status: 'rebate_eligible',
    },
    {
      id: 'vat-4',
      date: '2026-05-15',
      type: 'output',
      voucherNo: 'INV-2046',
      party: 'Rahim General Store',
      binTin: 'BIN-382910482',
      taxableAmount: 16174,
      vatRate: 15,
      vatAmount: 2426,
      aitAmount: 0,
      mushakForm: 'Mushak 6.3',
      status: 'verified',
    },
    {
      id: 'vat-5',
      date: '2026-05-12',
      type: 'input',
      voucherNo: 'BILL-4010',
      party: 'Beximco Pharma Distribution',
      binTin: 'BIN-000281940',
      taxableAmount: 120000,
      vatRate: 15,
      vatAmount: 18000,
      aitAmount: 6000,
      mushakForm: 'Mushak 6.1 (Purchase)',
      status: 'rebate_eligible',
    },
    {
      id: 'vat-6',
      date: '2026-05-10',
      type: 'vds_deduction',
      voucherNo: 'VDS-084',
      party: 'City Bank Corporate Desk',
      binTin: 'BIN-000119283',
      taxableAmount: 45000,
      vatRate: 7.5,
      vatAmount: 3375,
      aitAmount: 0,
      mushakForm: 'Mushak 6.6 (VDS Certificate)',
      status: 'deposited',
    },
  ];

  const filteredTransactions = vatTransactions.filter(
    (t) =>
      t.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.binTin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.mushakForm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `মূসক ৯.১ ভ্যাট রিটার্ন ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে`
        : `NBR Mushak 9.1 VAT return ${type.toUpperCase()} exported successfully`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <FinancePageHeader
        pageName="VAT & Tax Compliance Register"
        pageNameBn="মূসক ও ভ্যাট রিটার্ন রেজিস্টার"
        icon={ShieldCheck}
      />

      {/* Quick Statutory Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Output VAT */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-emerald-500/5 border border-emerald-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'আউটপুট ভ্যাট (বিক্রয়ের উপর)' : 'Output VAT (Sales)'}</span>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
              Mushak 6.3
            </Badge>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {formatCurrency(vatSummary.outputVatCollected)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? 'সর্বমোট বিক্রয়ে সংগৃহীত ভ্যাট' : 'Collected on customer invoices'}
          </div>
        </div>

        {/* Input VAT Rebate */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-blue-500/5 border border-blue-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'ইনপুট ভ্যাট রেয়াত (ক্রয়ের উপর)' : 'Input VAT Rebate'}</span>
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">
              Mushak 6.1
            </Badge>
          </div>
          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
            −{formatCurrency(vatSummary.inputVatRebate)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? 'অনুমোদিত ক্রয়ে সমন্বয়কৃত রেয়াত' : 'Rebatable on verified supplier bills'}
          </div>
        </div>

        {/* AIT / VDS Credits */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-purple-500/5 border border-purple-500/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'অগ্রিম আয়কর (AIT) ও VDS' : 'AIT & VDS Credits'}</span>
            <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]">
              Mushak 6.6
            </Badge>
          </div>
          <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
            −{formatCurrency(vatSummary.advanceIncomeTaxAit + vatSummary.taxWithholdingVds)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? 'উৎসে কর্তিত কর ও ভ্যাট সনদ' : 'Advance source tax deductions'}
          </div>
        </div>

        {/* Net Tax Payable to NBR */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-amber-500/5 border border-amber-500/30 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>{isBangla ? 'এনবিআর এ প্রদেয় নিট কর' : 'Net NBR Payable'}</span>
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
              Form 9.1
            </Badge>
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {formatCurrency(vatSummary.finalTaxLiability)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {isBangla ? 'চালানের মাধ্যমে প্রদেয় চূড়ান্ত অর্থ' : 'Net treasury challan liability'}
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Quarter selector */}
          <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
            <SelectTrigger className="h-9 text-xs w-44 bg-background">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q2_2026">Q2 2026 (Apr – Jun)</SelectItem>
              <SelectItem value="q1_2026">Q1 2026 (Jan – Mar)</SelectItem>
              <SelectItem value="q4_2025">Q4 2025 (Oct – Dec)</SelectItem>
              <SelectItem value="q3_2025">Q3 2025 (Jul – Sep)</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'পার্টি বা চালান খুঁজুন...' : 'Search voucher or BIN...'}
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
            <span>Excel 9.1</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="h-9 text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'মূসক ৯.১ প্রিন্ট' : 'Print Mushak 9.1'}</span>
          </Button>
        </div>
      </div>

      {/* Granular Statutory Tax Register Table */}
      <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isBangla ? 'মূসক ও কর লেনদেন লেজার অডিট' : 'Statutory VAT & Tax Ledger Audit'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla
                  ? 'সকল ইনভয়েস, চালান এবং মূসক ৬.১/৬.৩/৬.৬ এর সমন্বিত তালিকা'
                  : 'Verified schedule of output vouchers, purchase rebates, and withholding certificates'}
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {formatNumber(filteredTransactions.length)} {isBangla ? 'টি রেকর্ড' : 'entries'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider bg-muted/40">
                  <th className="py-3 px-4">{isBangla ? 'তারিখ' : 'Date'}</th>
                  <th className="py-3 px-4">{isBangla ? 'চালান নং' : 'Voucher No'}</th>
                  <th className="py-3 px-4">{isBangla ? 'পার্টি ও বিআইএন' : 'Party & BIN'}</th>
                  <th className="py-3 px-4">{isBangla ? 'মূসক ফরম' : 'Mushak Form'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'করযোগ্য মূল্য' : 'Taxable Value'}</th>
                  <th className="py-3 px-4 text-center">{isBangla ? 'হার' : 'Rate'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'ভ্যাট (৳)' : 'VAT Amount'}</th>
                  <th className="py-3 px-4 text-center">{isBangla ? 'স্ট্যাটাস' : 'Compliance'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-muted-foreground font-medium">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {tx.voucherNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{tx.party}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{tx.binTin}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] font-mono border-border/70">
                        {tx.mushakForm}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      {formatCurrency(tx.taxableAmount)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-muted-foreground">
                      {tx.vatRate}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                      {tx.type === 'input' ? (
                        <span className="text-blue-600 dark:text-blue-400">
                          −{formatCurrency(tx.vatAmount)}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          +{formatCurrency(tx.vatAmount)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {tx.status === 'verified' && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {isBangla ? 'যাচাইকৃত' : 'Verified'}
                        </span>
                      )}
                      {tx.status === 'rebate_eligible' && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          {isBangla ? 'রেয়াতযোগ্য' : 'Rebate OK'}
                        </span>
                      )}
                      {tx.status === 'deposited' && (
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                          {isBangla ? 'জমা সম্পন্ন' : 'Deposited'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
