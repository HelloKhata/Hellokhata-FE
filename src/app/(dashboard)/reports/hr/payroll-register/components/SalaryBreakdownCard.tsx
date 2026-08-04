'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PayrollRecord } from '@/types/payroll-register';

interface SalaryBreakdownCardProps {
  record: PayrollRecord;
}

export const SalaryBreakdownCard: React.FC<SalaryBreakdownCardProps> = ({
  record,
}) => {
  const formatCurrency = (val: number) => `৳${val.toLocaleString('en-BD')}`;

  return (
    <Card className="border border-border/70 shadow-2xs bg-card">
      <CardContent className="p-4 space-y-3.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
          Salary Breakdown Statement
        </h4>

        {/* Income Items */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Basic Salary</span>
            <span className="font-medium text-foreground">
              {formatCurrency(record.basicSalary)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Allowances</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(record.allowances)}
            </span>
          </div>
          {record.overtime > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Overtime</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(record.overtime)}
              </span>
            </div>
          )}
          {record.bonus > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Performance Bonus</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(record.bonus)}
              </span>
            </div>
          )}
        </div>

        <Separator className="bg-border/60" />

        {/* Gross Salary */}
        <div className="flex items-center justify-between text-xs font-bold text-foreground">
          <span>Gross Salary</span>
          <span className="text-sm">{formatCurrency(record.grossSalary)}</span>
        </div>

        <Separator className="bg-border/60" />

        {/* Deductions Items */}
        <div className="space-y-2 text-xs">
          {record.tax > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Income Tax</span>
              <span className="font-medium text-rose-600 dark:text-rose-400">
                -{formatCurrency(record.tax)}
              </span>
            </div>
          )}
          {record.leaveDeduction > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Unpaid Leave Deduction</span>
              <span className="font-medium text-rose-600 dark:text-rose-400">
                -{formatCurrency(record.leaveDeduction)}
              </span>
            </div>
          )}
          {record.lateDeduction > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Late Fine Deduction</span>
              <span className="font-medium text-rose-600 dark:text-rose-400">
                -{formatCurrency(record.lateDeduction)}
              </span>
            </div>
          )}
          {record.otherDeductions > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Other Deductions</span>
              <span className="font-medium text-rose-600 dark:text-rose-400">
                -{formatCurrency(record.otherDeductions)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between font-semibold pt-1">
            <span className="text-muted-foreground">Total Deductions</span>
            <span className="text-rose-600 dark:text-rose-400">
              -{formatCurrency(record.totalDeductions)}
            </span>
          </div>
        </div>

        {/* Net Disbursal Banner */}
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
          <span className="font-bold text-foreground">Net Salary Payable</span>
          <span className="text-base font-extrabold text-primary">
            {formatCurrency(record.netSalary)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
