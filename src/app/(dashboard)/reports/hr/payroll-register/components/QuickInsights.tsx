'use client';

import React, { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Sparkles, TrendingUp, Award, Calculator, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PayrollSummary } from '@/types/payroll-register';

interface QuickInsightsProps {
  summary: PayrollSummary;
}

export const QuickInsights: React.FC<QuickInsightsProps> = ({ summary }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatCurrency = (val: number) => {
    return `৳${val.toLocaleString('en-BD')}`;
  };

  const insights = [
    {
      label: 'Highest Net Salary',
      value: formatCurrency(summary.highestSalary),
      icon: ArrowUpRight,
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Lowest Net Salary',
      value: formatCurrency(summary.lowestSalary),
      icon: ArrowDownRight,
      iconColor: 'text-amber-500',
    },
    {
      label: 'Total Overtime Paid',
      value: formatCurrency(summary.totalOvertimePaid),
      icon: TrendingUp,
      iconColor: 'text-blue-500',
    },
    {
      label: 'Total Bonuses Paid',
      value: formatCurrency(summary.totalBonusesPaid),
      icon: Award,
      iconColor: 'text-purple-500',
    },
    {
      label: 'Average Employee Salary',
      value: formatCurrency(summary.averageSalary),
      icon: Calculator,
      iconColor: 'text-indigo-500',
    },
    {
      label: 'Average Deduction',
      value: formatCurrency(summary.averageDeduction),
      icon: Calculator,
      iconColor: 'text-rose-500',
    },
  ];

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border border-border/60 rounded-xl bg-card shadow-2xs overflow-hidden print:hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-foreground">
            Quick Payroll Insights & Analytics
          </span>
        </div>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{isOpen ? 'Hide Insights' : 'Show Insights'}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="p-4 bg-card">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {insights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-lg bg-muted/30 border border-border/40 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground truncate">
                    {item.label}
                  </span>
                  <Icon className={`h-3.5 w-3.5 ${item.iconColor} shrink-0`} />
                </div>
                <p className="text-sm font-bold text-foreground truncate">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
