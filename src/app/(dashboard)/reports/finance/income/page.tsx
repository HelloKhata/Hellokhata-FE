'use client';

import React, { useState } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { TrendingUp, Filter, Printer, FileSpreadsheet, Percent, DollarSign } from 'lucide-react';

export default function IncomeReportPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const [selectedBranch, setSelectedBranch] = useState('all');

  const incomeCategories = [
    { name: 'Product Counter Sales', nameBn: 'কাউন্টার পণ্য বিক্রয়', amount: 1250000, percentage: 47, color: 'bg-emerald-500' },
    { name: 'Wholesale Client Billings', nameBn: 'পাইকারি ক্লায়েন্ট বিলিং', amount: 595600, percentage: 23, color: 'bg-blue-500' },
    { name: 'On-site Technical Services', nameBn: 'অন-সাইট প্রযুক্তিগত সেবা', amount: 480000, percentage: 18, color: 'bg-teal-500' },
    { name: 'Remote Maintenance Subscriptions', nameBn: 'রিমোট রক্ষণাবেক্ষণ সাবস্ক্রিপশন', amount: 174000, percentage: 7, color: 'bg-indigo-500' },
    { name: 'Non-Operating Interest Revenues', nameBn: 'পরিচালন বহির্ভূত সুদ আয়', amount: 140000, percentage: 5, color: 'bg-violet-500' },
  ];

  const totalIncome = incomeCategories.reduce((acc, cat) => acc + cat.amount, 0);

  const handleExport = (type: string) => {
    alert(isBangla ? `${type} এক্সপোর্ট সিমুলেশন সম্পন্ন!` : `${type} export simulation completed!`);
  };

  return (
    <div className="space-y-6">
      <FinancePageHeader
        pageName="Income Report"
        pageNameBn="আয় রিপোর্ট"
        description="Breakdown of all income sources and revenue streams."
        descriptionBn="সব আয়ের উৎস ও রাজস্ব ধারার বিশদ বিবরণী।"
        icon={TrendingUp}
        parentName="Finance Reports"
        parentNameBn="আর্থিক রিপোর্ট"
        parentHref="/reports/finance"
      />

      {/* Action Sub-Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3.5 rounded-xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground mr-2">
            {isBangla ? 'শাখা:' : 'Branch:'}
          </span>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="h-8 rounded-lg border bg-background px-3 text-xs font-semibold focus:outline-none"
          >
            <option value="all">{isBangla ? 'সব শাখা' : 'All Branches'}</option>
            <option value="dhaka">{isBangla ? 'ঢাকা শাখা' : 'Dhaka Branch'}</option>
            <option value="chittagong">{isBangla ? 'চট্টগ্রাম শাখা' : 'Chittagong Branch'}</option>
          </select>
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')} className="text-xs h-8">
            <Printer className="h-3.5 w-3.5 mr-1.5" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Excel')} className="text-xs h-8">
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" /> Excel
          </Button>
        </div>
      </div>

      {/* Total Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'সর্বমোট অর্জিত আয়' : 'Total Consolidated Revenue'}</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 mt-1 font-mono">{formatCurrency(totalIncome)}</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'সবচেয়ে বড় আয়ের খাত' : 'Primary Income Stream'}</p>
              <h3 className="text-lg font-bold text-foreground mt-1">
                {isBangla ? 'কাউন্টার পণ্য বিক্রয়' : 'Product Counter Sales'} (47%)
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Percent className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Income breakdown details */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/30 bg-muted/10">
          <CardTitle className="text-sm font-bold">{isBangla ? 'আয়ের অনুপাত ও বিবরণী' : 'Income Streams Distribution'}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-5">
          {incomeCategories.map((cat, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-foreground">{isBangla ? cat.nameBn : cat.name}</span>
                <div className="flex gap-4 font-mono">
                  <span className="text-muted-foreground">({cat.percentage}%)</span>
                  <span className="text-primary">{formatCurrency(cat.amount)}</span>
                </div>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full', cat.color)} style={{ width: `${cat.percentage}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
