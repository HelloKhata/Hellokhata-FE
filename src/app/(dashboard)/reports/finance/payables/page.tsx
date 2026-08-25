// Hello Khata OS - Accounts Payable & Supplier Dues
// হ্যালো খাতা - সরবরাহকারী প্রদেয় ও দেনা পরিশোধ রিপোর্ট

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
  Building2,
  Filter,
  Printer,
  FileSpreadsheet,
  Search,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function PayablesReportPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [selectedMaturity, setSelectedMaturity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const supplierAging = [
    { id: 's-1', name: 'Square Pharmaceuticals Distribution', nameBn: 'স্কয়ার ফার্মাসিউটিক্যালস', billNo: 'BILL-4012', dueDate: '2026-05-25', total: 180000, current: 150000, days30: 30000, days60: 0, status: 'maturing_soon' },
    { id: 's-2', name: 'Beximco Pharma Logistics Hub', nameBn: 'বেক্সিমকো ফার্মা হাব', billNo: 'BILL-4010', dueDate: '2026-05-28', total: 142300, current: 100000, days30: 42300, days60: 0, status: 'maturing_soon' },
    { id: 's-3', name: 'Incepta Medical Wholesale', nameBn: 'ইনসেপ্টা মেডিকেল সাপ্লাই', billNo: 'BILL-3890', dueDate: '2026-05-10', total: 90000, current: 0, days30: 40000, days60: 50000, status: 'overdue' },
  ];

  const filteredSuppliers = supplierAging.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.billNo.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedMaturity === 'all') return matchesSearch;
    return matchesSearch && s.status === selectedMaturity;
  });

  const totalPayable = supplierAging.reduce((acc, s) => acc + s.total, 0);
  const totalMaturingSoon = supplierAging.filter((s) => s.status === 'maturing_soon').reduce((acc, s) => acc + s.total, 0);
  const totalOverdue = supplierAging.filter((s) => s.status === 'overdue').reduce((acc, s) => acc + s.total, 0);

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `প্রদেয় দেনা রিপোর্ট ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Accounts Payable Report ${type.toUpperCase()} exported successfully!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="Accounts Payable & Supplier Dues"
        pageNameBn="সাপ্লায়ার বকেয়া ও দেনা রিপোর্ট (Accounts Payable)"
        icon={Building2}
      />

      {/* Top Payables KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-rose-500/5 border border-rose-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'সর্বমোট সাপ্লায়ার দেনা' : 'Total Accounts Payable'}</div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">{formatCurrency(totalPayable)}</div>
          <div className="text-[11px] text-muted-foreground">{supplierAging.length} Verified Trade Creditors</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-amber-500/5 border border-amber-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 font-bold">{isBangla ? 'আসন্ন ৭ দিনে প্রদেয়' : 'Maturing in 7 Days'}</div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">{formatCurrency(totalMaturingSoon)}</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? '২টি ইনভয়েস পরিশোধযোগ্য' : '2 upcoming supplier bills'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-red-500/10 border border-red-500/30 shadow-md space-y-1.5 ring-1 ring-red-500/20">
          <div className="text-xs font-semibold text-red-600 dark:text-red-400 font-bold">{isBangla ? 'মেয়াদোত্তীর্ণ বকেয়া' : 'Overdue Supplier Dues'}</div>
          <div className="text-2xl font-black font-mono text-red-600 dark:text-red-400">{formatCurrency(totalOverdue)}</div>
          <div className="text-[11px] text-red-600 font-semibold">{isBangla ? 'জরুরি পরিশোধ আবশ্যক' : 'Urgent payout priority'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-teal-500/10 border border-teal-500/30 shadow-md space-y-1.5 ring-1 ring-teal-500/20">
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 font-bold">{isBangla ? 'ক্রেডিট রেটিং ও শর্ত' : 'Supplier Credit Terms'}</div>
          <div className="text-xl font-bold font-mono text-foreground">30-Day Net Terms</div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold font-mono">Good Trade Standing</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Maturity Filter */}
          <Select value={selectedMaturity} onValueChange={setSelectedMaturity}>
            <SelectTrigger className="h-9 text-xs w-52 bg-background">
              <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সকল দেনা (All Dues)' : 'All Maturing Bills'}</SelectItem>
              <SelectItem value="maturing_soon">{isBangla ? 'আসন্ন পরিশোধ (Maturing Soon)' : 'Maturing in 7 Days'}</SelectItem>
              <SelectItem value="overdue">{isBangla ? 'মেয়াদোত্তীর্ণ (Overdue)' : 'Overdue Invoices'}</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'সাপ্লায়ার বা বিল নং খুঁজুন...' : 'Search supplier or bill...'}
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
            <span>Excel Payables</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="h-9 text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'দেনা শিট প্রিন্ট' : 'Print Payables'}</span>
          </Button>
        </div>
      </div>

      {/* Supplier Aging Table */}
      <Card className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isBangla ? 'সরবরাহকারী প্রদেয় বিল ও পরিশোধ তালিকা' : 'Trade Payables & Maturity Schedule'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {isBangla ? 'ক্রয় বিল নম্বর, নির্ধারিত পরিশোধ তারিখ ও বকেয়া বিশ্লেষণ' : 'Supplier purchase invoices, payment maturity dates, and aging status'}
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {formatNumber(filteredSuppliers.length)} {isBangla ? 'টি সাপ্লায়ার' : 'vendors'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider bg-muted/40">
                  <th className="py-3 px-4">{isBangla ? 'সাপ্লায়ার কোম্পানি' : 'Supplier Name'}</th>
                  <th className="py-3 px-4">{isBangla ? 'ক্রয় বিল নং' : 'Purchase Bill'}</th>
                  <th className="py-3 px-4">{isBangla ? 'পরিশোধের শেষ তারিখ' : 'Maturity Date'}</th>
                  <th className="py-3 px-4 text-center">{isBangla ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'চলতি (০-৩০ দিন)' : 'Current (0-30d)'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? '৩১-৬০ দিন' : '31-60 Days'}</th>
                  <th className="py-3 px-4 text-right">{isBangla ? 'মোট প্রদেয় (৳)' : 'Total Payable (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 font-mono">
                {filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-sans font-bold text-foreground">
                      {isBangla ? s.nameBn : s.name}
                    </td>
                    <td className="py-3 px-4 text-primary font-bold">{s.billNo}</td>
                    <td className="py-3 px-4 text-muted-foreground font-medium">{s.dueDate}</td>
                    <td className="py-3 px-4 text-center font-sans">
                      {s.status === 'maturing_soon' ? (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                          Due Soon
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]">
                          Overdue
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-foreground">
                      {s.current > 0 ? formatCurrency(s.current) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600">
                      {s.days30 > 0 ? formatCurrency(s.days30) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-rose-600 text-sm">
                      {formatCurrency(s.total)}
                    </td>
                  </tr>
                ))}

                {/* Totals */}
                <tr className="bg-muted/40 font-bold border-t-2 border-border/80">
                  <td colSpan={6} className="py-3.5 px-4 uppercase text-xs font-sans">
                    {isBangla ? 'সর্বমোট সাপ্লায়ার দেনা' : 'TOTAL TRADE PAYABLES'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-base font-black text-rose-600">
                    {formatCurrency(totalPayable)}
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
