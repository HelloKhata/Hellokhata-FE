// Hello Khata OS - Accounts Receivable & Aging Analysis
// হ্যালো খাতা - গ্রাহক বকেয়া ও মেয়াদ বিশ্লেষণ (রিসিভেবলস এজিং রিপোর্ট)

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
  Percent,
  Filter,
  Printer,
  FileSpreadsheet,
  Search,
  Calendar,
  Building2,
  AlertTriangle,
  Users,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ReceivablesReportPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const customerAging = [
    { id: 'c-1', name: 'ABC Traders & Pharmacy', nameBn: 'এবিসি ট্রেডার্স এন্ড ফার্মেসি', phone: '+880 1711-229900', total: 145000, current: 95000, days30: 35000, days60: 15000, days90: 0, status: 'warning' },
    { id: 'c-2', name: 'M/S Rahman & Sons Distribution', nameBn: 'মেসার্স রহমান এন্ড সন্স', phone: '+880 1821-448811', total: 245000, current: 180000, days30: 45000, days60: 20000, days90: 0, status: 'warning' },
    { id: 'c-3', name: 'Jamuna Supermarket Ltd.', nameBn: 'যমুনা সুপারমার্কেট লি.', phone: '+880 1912-334455', total: 189200, current: 140200, days30: 49000, days60: 0, days90: 0, status: 'normal' },
    { id: 'c-4', name: 'Desh Departmental Store', nameBn: 'দেশ ডিপার্টমেন্টাল স্টোর', phone: '+880 1610-998877', total: 120000, current: 0, days30: 40000, days60: 50000, days90: 30000, status: 'critical' },
    { id: 'c-5', name: 'Al-Madina Groceries', nameBn: 'আল-মদিনা গ্রোসারি', phone: '+880 1714-556677', total: 80000, current: 80000, days30: 0, days60: 0, days90: 0, status: 'normal' },
  ];

  const filteredCustomers = customerAging.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    if (selectedRisk === 'all') return matchesSearch;
    return matchesSearch && c.status === selectedRisk;
  });

  const totalReceivable = customerAging.reduce((acc, c) => acc + c.total, 0);
  const totalCurrent = customerAging.reduce((acc, c) => acc + c.current, 0);
  const total30d = customerAging.reduce((acc, c) => acc + c.days30, 0);
  const total60d = customerAging.reduce((acc, c) => acc + c.days60, 0);
  const total90d = customerAging.reduce((acc, c) => acc + c.days90, 0);

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `প্রাপ্য হিসাব এজিং ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Receivables Aging ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="Accounts Receivable & Aging"
        pageNameBn="গ্রাহক বকেয়া ও মেয়াদ বিশ্লেষণ (Receivables Aging)"
        icon={Percent}
      />

      {/* Top Aging Buckets KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Receivables */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-card to-purple-500/5 border border-purple-500/20 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-muted-foreground">{isBangla ? 'সর্বমোট কাস্টমার বাকি' : 'Total Receivables'}</div>
          <div className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">{formatCurrency(totalReceivable)}</div>
          <div className="text-[10px] text-muted-foreground">{customerAging.length} Active Accounts</div>
        </div>

        {/* Current 0-30 days */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-card to-emerald-500/5 border border-emerald-500/20 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{isBangla ? 'চলতি (০-৩০ দিন)' : 'Current (0-30 Days)'}</div>
          <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(totalCurrent)}</div>
          <div className="text-[10px] text-muted-foreground">{((totalCurrent / totalReceivable) * 100).toFixed(1)}% of total</div>
        </div>

        {/* 31-60 days */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-card to-blue-500/5 border border-blue-500/20 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{isBangla ? '৩১-৬০ দিন বকেয়া' : '31-60 Days Dues'}</div>
          <div className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">{formatCurrency(total30d)}</div>
          <div className="text-[10px] text-muted-foreground">Follow-up active</div>
        </div>

        {/* 61-90 days */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-card to-amber-500/5 border border-amber-500/20 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{isBangla ? '৬১-৯০ দিন বকেয়া' : '61-90 Days Warning'}</div>
          <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">{formatCurrency(total60d)}</div>
          <div className="text-[10px] text-muted-foreground">High priority tag</div>
        </div>

        {/* 90+ days Overdue */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-card to-rose-500/10 border border-rose-500/30 shadow-md space-y-1 ring-1 ring-rose-500/20">
          <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400">{isBangla ? '৯০+ দিন (ঝুঁকিপূর্ণ)' : '90+ Days Critical'}</div>
          <div className="text-xl font-black font-mono text-rose-600 dark:text-rose-400">{formatCurrency(total90d)}</div>
          <div className="text-[10px] text-rose-600 font-semibold">Immediate collection</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Risk Filter */}
          <Select value={selectedRisk} onValueChange={setSelectedRisk}>
            <SelectTrigger className="h-9 text-xs w-48 bg-background">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সকল ঝুঁকি স্তর (All)' : 'All Risk Profiles'}</SelectItem>
              <SelectItem value="normal">Normal (০-৩০ দিন সময়মত)</SelectItem>
              <SelectItem value="warning">Warning (৩১-৬০ দিন মেয়াদ)</SelectItem>
              <SelectItem value="critical">Critical (৯০+ দিন মেয়াদোত্তীর্ণ)</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'গ্রাহক বা ফোন নম্বর...' : 'Search customer or phone...'}
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
            <span>Excel Aging</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="h-9 text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'এজিং রিপোর্ট প্রিন্ট' : 'Print Aging Report'}</span>
          </Button>
        </div>
      </div>

      {/* Customer Aging Table */}
      <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isBangla ? 'গ্রাহকভিত্তিক বকেয়া এজিং বিশ্লেষণ খতিয়ান' : 'Customer-wise Aging Balance Ledger'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla ? 'সময়ভিত্তিক বকেয়া বিতরণ ও পরিশোধের ঝুঁকি বিশ্লেষণ' : 'Granular 30-day bucket segmentation and recovery status'}
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {formatNumber(filteredCustomers.length)} {isBangla ? 'জন গ্রাহক' : 'clients'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider bg-muted/40">
                  <th className="py-3 px-4">{isBangla ? 'গ্রাহকের নাম ও ফোন' : 'Customer Name & Contact'}</th>
                  <th className="py-3 px-4 text-center">{isBangla ? 'ঝুঁকি স্ট্যাটাস' : 'Risk Profile'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'চলতি (০-৩০ দিন)' : 'Current (0-30d)'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? '৩১-৬০ দিন' : '31-60 Days'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? '৬১-৯০ দিন' : '61-90 Days'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? '৯০+ দিন' : '90+ Days'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'মোট বকেয়া (৳)' : 'Total Due (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 font-mono">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-foreground">{isBangla ? c.nameBn : c.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{c.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-sans">
                      {c.status === 'normal' && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                          Normal
                        </Badge>
                      )}
                      {c.status === 'warning' && (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                          Follow-up
                        </Badge>
                      )}
                      {c.status === 'critical' && (
                        <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]">
                          Critical
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">
                      {c.current > 0 ? formatCurrency(c.current) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right text-blue-600 font-bold">
                      {c.days30 > 0 ? formatCurrency(c.days30) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right text-amber-600 font-bold">
                      {c.days60 > 0 ? formatCurrency(c.days60) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right text-rose-600 font-black">
                      {c.days90 > 0 ? formatCurrency(c.days90) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-sm text-foreground">
                      {formatCurrency(c.total)}
                    </td>
                  </tr>
                ))}

                {/* Totals Row */}
                <tr className="bg-muted/40 font-bold border-t-2 border-border/80">
                  <td colSpan={2} className="py-3.5 px-4 uppercase text-xs font-sans">
                    {isBangla ? 'সর্বমোট এজিং বকেয়া' : 'TOTAL AGING PORTFOLIO'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm text-emerald-600 font-bold">
                    {formatCurrency(totalCurrent)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm text-blue-600 font-bold">
                    {formatCurrency(total30d)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm text-amber-600 font-bold">
                    {formatCurrency(total60d)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm text-rose-600 font-black">
                    {formatCurrency(total90d)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-base font-black text-foreground">
                    {formatCurrency(totalReceivable)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
