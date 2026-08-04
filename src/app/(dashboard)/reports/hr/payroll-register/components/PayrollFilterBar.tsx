'use client';

import React from 'react';
import { PayrollFilters } from '@/types/payroll-register';
import { Search, X, RotateCcw, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PayrollFilterBarProps {
  filters: PayrollFilters;
  onUpdateFilter: (key: keyof PayrollFilters, val: string) => void;
  onResetFilters: () => void;
}

export const PayrollFilterBar: React.FC<PayrollFilterBarProps> = ({
  filters,
  onUpdateFilter,
  onResetFilters,
}) => {
  return (
    <div className="space-y-3 bg-card p-3.5 rounded-xl border border-border/60 shadow-2xs print:hidden">
      {/* Top Search & Presets Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={filters.search}
            onChange={(e) => onUpdateFilter('search', e.target.value)}
            placeholder="Search employee by name, code, or designation..."
            className="pl-9 pr-9 h-9 text-xs rounded-lg border-border/70 focus-visible:ring-1 focus-visible:ring-primary bg-background"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onUpdateFilter('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Date Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            type="button"
            variant={filters.payrollPeriod === 'July 2026' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdateFilter('payrollPeriod', 'July 2026')}
            className="h-8 text-xs rounded-lg font-medium px-2.5"
          >
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Current Month
          </Button>
          <Button
            type="button"
            variant={filters.payrollPeriod === 'June 2026' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdateFilter('payrollPeriod', 'June 2026')}
            className="h-8 text-xs rounded-lg font-medium px-2.5"
          >
            Last Month
          </Button>
          <Button
            type="button"
            variant={filters.payrollPeriod === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdateFilter('payrollPeriod', 'all')}
            className="h-8 text-xs rounded-lg font-medium px-2.5"
          >
            All Periods
          </Button>
        </div>
      </div>

      {/* Select Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {/* Branch Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Branch
          </label>
          <Select
            value={filters.branch}
            onValueChange={(val) => onUpdateFilter('branch', val)}
          >
            <SelectTrigger className="h-8 text-xs rounded-lg border-border/70 bg-background">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent className="rounded-lg text-xs">
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="dhaka-main">Main Branch (Dhaka)</SelectItem>
              <SelectItem value="ctg-branch">Chittagong Outlet</SelectItem>
              <SelectItem value="sylhet-branch">Sylhet Branch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Department
          </label>
          <Select
            value={filters.department}
            onValueChange={(val) => onUpdateFilter('department', val)}
          >
            <SelectTrigger className="h-8 text-xs rounded-lg border-border/70 bg-background">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent className="rounded-lg text-xs">
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="accounts">Accounts</SelectItem>
              <SelectItem value="management">Management</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Role
          </label>
          <Select
            value={filters.role}
            onValueChange={(val) => onUpdateFilter('role', val)}
          >
            <SelectTrigger className="h-8 text-xs rounded-lg border-border/70 bg-background">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="rounded-lg text-xs">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="branch manager">Branch Manager</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Payment Status
          </label>
          <Select
            value={filters.paymentStatus}
            onValueChange={(val) => onUpdateFilter('paymentStatus', val)}
          >
            <SelectTrigger className="h-8 text-xs rounded-lg border-border/70 bg-background">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-lg text-xs">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partially_paid">Partially Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Method Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Payment Method
          </label>
          <Select
            value={filters.paymentMethod}
            onValueChange={(val) => onUpdateFilter('paymentMethod', val)}
          >
            <SelectTrigger className="h-8 text-xs rounded-lg border-border/70 bg-background">
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent className="rounded-lg text-xs">
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bkash">bKash</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Actions */}
        <div className="flex items-end pb-0.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="w-full h-8 text-xs font-medium rounded-lg gap-1.5 border-border/70"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
