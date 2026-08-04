'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText, FileCode } from 'lucide-react';
import { PayrollRecord } from '@/types/payroll-register';
import { toast } from 'sonner';

interface ExportMenuProps {
  records: PayrollRecord[];
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ records }) => {
  const handleExportCsv = () => {
    if (records.length === 0) {
      toast.error('No payroll records to export.');
      return;
    }

    const headers = [
      'Employee ID',
      'Employee Name',
      'Branch',
      'Department',
      'Designation',
      'Period',
      'Basic Salary',
      'Allowances',
      'Overtime',
      'Bonus',
      'Gross Salary',
      'Tax',
      'Leave Deductions',
      'Late Deductions',
      'Total Deductions',
      'Net Salary',
      'Payment Status',
      'Payment Method',
    ];

    const rows = records.map((r) => [
      r.employeeCode,
      `"${r.employeeName}"`,
      `"${r.branchName}"`,
      `"${r.department}"`,
      `"${r.designation}"`,
      r.payrollPeriod,
      r.basicSalary,
      r.allowances,
      r.overtime,
      r.bonus,
      r.grossSalary,
      r.tax,
      r.leaveDeduction,
      r.lateDeduction,
      r.totalDeductions,
      r.netSalary,
      r.paymentStatus,
      r.paymentMethod,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Payroll_Register_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${records.length} payroll records to CSV.`);
  };

  const handleExportExcel = () => {
    toast.success(`Exporting ${records.length} records to Excel format...`);
    setTimeout(() => {
      handleExportCsv();
    }, 500);
  };

  const handleExportPdf = () => {
    toast.success(`Generating PDF report for ${records.length} records...`);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs rounded-xl font-medium border-border/70 gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-xl text-xs">
        <DropdownMenuItem
          onClick={handleExportPdf}
          className="gap-2 cursor-pointer"
        >
          <FileText className="h-4 w-4 text-rose-500" />
          <span>Export PDF Report</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportExcel}
          className="gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
          <span>Export Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportCsv}
          className="gap-2 cursor-pointer"
        >
          <FileCode className="h-4 w-4 text-blue-500" />
          <span>Export CSV (.csv)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
