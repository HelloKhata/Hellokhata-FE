'use client';

import React from 'react';
import { PayrollRecord } from '@/types/payroll-register';

interface PayrollTotalsProps {
  records: PayrollRecord[];
}

export const PayrollTotals: React.FC<PayrollTotalsProps> = ({ records }) => {
  const formatCurrency = (val: number) => `৳${val.toLocaleString('en-BD')}`;

  const totals = records.reduce(
    (acc, curr) => {
      acc.basic += curr.basicSalary;
      acc.allowances += curr.allowances;
      acc.overtime += curr.overtime;
      acc.bonus += curr.bonus;
      acc.gross += curr.grossSalary;
      acc.tax += curr.tax;
      acc.leave += curr.leaveDeduction;
      acc.late += curr.lateDeduction;
      acc.other += curr.otherDeductions;
      acc.deductions += curr.totalDeductions;
      acc.net += curr.netSalary;
      return acc;
    },
    {
      basic: 0,
      allowances: 0,
      overtime: 0,
      bonus: 0,
      gross: 0,
      tax: 0,
      leave: 0,
      late: 0,
      other: 0,
      deductions: 0,
      net: 0,
    }
  );

  return (
    <tr className="bg-muted/90 backdrop-blur-xs font-bold border-t-2 border-border/80 text-foreground">
      <td className="p-3 sticky left-0 z-10 bg-muted/95 border-r border-border/60 text-left text-xs uppercase tracking-wider">
        Summary Totals ({records.length} Employees)
      </td>
      <td className="p-3 text-center text-xs">{records.length} Staff</td>
      <td className="p-3 text-center text-xs">-</td>
      <td className="p-3 text-right text-xs font-mono">{formatCurrency(totals.basic)}</td>
      <td className="p-3 text-right text-xs font-mono text-emerald-600 dark:text-emerald-400">
        +{formatCurrency(totals.allowances)}
      </td>
      <td className="p-3 text-right text-xs font-mono text-emerald-600 dark:text-emerald-400">
        +{formatCurrency(totals.overtime)}
      </td>
      <td className="p-3 text-right text-xs font-mono text-emerald-600 dark:text-emerald-400">
        +{formatCurrency(totals.bonus)}
      </td>
      <td className="p-3 text-right text-xs font-mono font-bold text-foreground">
        {formatCurrency(totals.gross)}
      </td>
      <td className="p-3 text-right text-xs font-mono text-rose-600 dark:text-rose-400">
        -{formatCurrency(totals.tax)}
      </td>
      <td className="p-3 text-right text-xs font-mono text-rose-600 dark:text-rose-400">
        -{formatCurrency(totals.leave)}
      </td>
      <td className="p-3 text-right text-xs font-mono text-rose-600 dark:text-rose-400">
        -{formatCurrency(totals.late)}
      </td>
      <td className="p-3 text-right text-xs font-mono text-rose-600 dark:text-rose-400">
        -{formatCurrency(totals.other)}
      </td>
      <td className="p-3 text-right text-xs font-mono font-bold text-rose-700 dark:text-rose-300">
        -{formatCurrency(totals.deductions)}
      </td>
      <td className="p-3 text-right text-xs font-mono font-extrabold text-primary text-sm bg-primary/5">
        {formatCurrency(totals.net)}
      </td>
      <td className="p-3 text-center text-xs">-</td>
      <td className="p-3 text-center text-xs">-</td>
      <td className="p-3 text-center text-xs">-</td>
      <td className="p-3 text-center text-xs">-</td>
    </tr>
  );
};
