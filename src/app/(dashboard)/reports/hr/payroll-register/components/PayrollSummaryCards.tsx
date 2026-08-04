'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Banknote, TrendingDown, CheckCircle2, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PayrollSummary } from '@/types/payroll-register';

interface PayrollSummaryCardsProps {
  summary: PayrollSummary;
  totalRecordsCount: number;
  isLoading?: boolean;
}

export const PayrollSummaryCards: React.FC<PayrollSummaryCardsProps> = ({
  summary,
  totalRecordsCount,
  isLoading = false,
}) => {
  const formatCurrency = (val: number) => {
    return `৳${val.toLocaleString('en-BD')}`;
  };

  const cards = [
    {
      title: 'Total Employees Paid',
      value: `${summary.totalEmployeesPaid} / ${totalRecordsCount}`,
      subtitle: 'Processed payroll staff',
      icon: Users,
      iconColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40',
    },
    {
      title: 'Gross Payroll',
      value: formatCurrency(summary.grossPayroll),
      subtitle: 'Basic + Allowances + Bonus',
      icon: Banknote,
      iconColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40',
    },
    {
      title: 'Total Deductions',
      value: formatCurrency(summary.totalDeductions),
      subtitle: 'Tax + Leave + Late fees',
      icon: TrendingDown,
      iconColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40',
    },
    {
      title: 'Net Payroll Paid',
      value: formatCurrency(summary.netPayrollPaid),
      subtitle: 'Cleared net disbursal',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
    },
    {
      title: 'Pending Payments',
      value: formatCurrency(summary.pendingPaymentsAmount),
      subtitle: `${summary.pendingPaymentsCount} pending disbursals`,
      icon: Clock,
      iconColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="border border-border/60 shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="border border-border/60 shadow-xs hover:border-border transition-colors bg-card"
          >
            <CardContent className="p-4 flex items-start justify-between">
              <div className="space-y-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                  {card.title}
                </p>
                <div className="text-lg font-bold tracking-tight text-foreground truncate">
                  {card.value}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {card.subtitle}
                </p>
              </div>
              <div
                className={`p-2.5 rounded-xl border shrink-0 ${card.iconColor}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
