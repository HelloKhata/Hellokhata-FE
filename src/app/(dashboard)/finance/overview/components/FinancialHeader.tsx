'use client';

import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  RefreshCw,
  Download,
  PlusCircle,
  MinusCircle,
  ArrowLeftRight,
  Info,
  X,
  FileSpreadsheet,
  FileText,
  FileCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface FinancialHeaderProps {
  selectedBranch: string;
  onBranchChange: (val: string) => void;
  selectedPeriod: string;
  onPeriodChange: (val: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onQuickAction: (action: 'income' | 'expense' | 'deposit' | 'withdraw') => void;
}

export const FinancialHeader: React.FC<FinancialHeaderProps> = ({
  selectedBranch,
  onBranchChange,
  selectedPeriod,
  onPeriodChange,
  isRefreshing,
  onRefresh,
  onQuickAction,
}) => {
  const [showAlert, setShowAlert] = useState(true);

  const handleExport = (type: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exporting Financial Dashboard as ${type.toUpperCase()}...`);
    if (type === 'pdf') {
      setTimeout(() => window.print(), 300);
    }
  };

  return (
    <div className="space-y-4 print:hidden">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border/60 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Financial Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor real-time income, expenses, cash flow trends, and bank account balances.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Branch Selector */}
          <div className="flex items-center gap-1.5 bg-background border border-border/70 rounded-xl px-2.5 py-1 shadow-2xs">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <Select value={selectedBranch} onValueChange={onBranchChange}>
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-[140px] px-1 font-medium">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent className="rounded-xl text-xs">
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="dhaka-main">Main Branch (Dhaka)</SelectItem>
                <SelectItem value="ctg-branch">Chittagong Outlet</SelectItem>
                <SelectItem value="sylhet-branch">Sylhet Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-1.5 bg-background border border-border/70 rounded-xl px-2.5 py-1 shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-[130px] px-1 font-medium">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent className="rounded-xl text-xs">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="this_quarter">This Quarter</SelectItem>
                <SelectItem value="fy_2026">Financial Year 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-xl text-xs font-medium border-border/70 gap-1.5"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl text-xs">
              <DropdownMenuItem
                onClick={() => handleExport('pdf')}
                className="gap-2 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-rose-500" />
                <span>Export PDF Report</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport('excel')}
                className="gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                <span>Export Excel Sheet</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport('csv')}
                className="gap-2 cursor-pointer"
              >
                <FileCode className="h-4 w-4 text-blue-500" />
                <span>Export CSV Data</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh Button */}
          {/* <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-10 rounded-xl text-xs font-medium border-border/70"
            title="Refresh Financial Data"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isRefreshing ? 'animate-spin text-primary' : 'text-muted-foreground'
              }`}
            />
          </Button> */}

          {/* Quick Transaction Action Buttons */}
          {/* <Button
            type="button"
            size="sm"
            onClick={() => onQuickAction('income')}
            className="h-10 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-2xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add Income
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => onQuickAction('expense')}
            className="h-10 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white gap-1.5 shadow-2xs"
          >
            <MinusCircle className="h-3.5 w-3.5" />
            Add Expense
          </Button> */}
        </div>
      </div>
    </div>
  );
};
