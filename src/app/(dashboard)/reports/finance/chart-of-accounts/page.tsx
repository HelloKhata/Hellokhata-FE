// Hello Khata OS - Chart of Accounts (COA Master Hierarchy)
// হ্যালো খাতা - হিসাবের তালিকা ও কোড (চার্ট অফ অ্যাকাউন্টস মাস্টার কাঠামো)

'use client';

import React, { useState } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import {
  FolderTree,
  Printer,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ChartOfAccountsPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    'assets',
    'liabilities',
    'equity',
    'revenue',
    'expense',
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const accountStructure = [
    {
      groupId: 'assets',
      name: 'Assets',
      nameBn: '১. সম্পদসমূহ (Assets)',
      range: '1000 - 1999',
      color: 'purple',
      accounts: [
        { code: '1010', name: 'Cash on Hand (Vault & Petty)', nameBn: 'হাতে নগদ হিসাব', type: 'Current Asset', balance: 456800 },
        { code: '1020', name: 'Bank Operating Account (BRAC/City)', nameBn: 'ব্যাংক হিসাব', type: 'Current Asset', balance: 1287500 },
        { code: '1030', name: 'MFS Digital Wallets (bKash/Nagad)', nameBn: 'ডিজিটাল ওয়ালেট হিসাব', type: 'Current Asset', balance: 85000 },
        { code: '1100', name: 'Accounts Receivable (Customer Dues)', nameBn: 'প্রাপ্য হিসাব (কাস্টমার বাকি)', type: 'Current Asset', balance: 634200 },
        { code: '1200', name: 'Commercial Inventory Stock', nameBn: 'মজুদ পণ্য হিসাব', type: 'Current Asset', balance: 850000 },
        { code: '1500', name: 'Office Equipment, IT & Furniture', nameBn: 'অফিস সরঞ্জাম ও আসবাবপত্র', type: 'Fixed Asset', balance: 450000 },
        { code: '1600', name: 'Delivery Transport & Vehicles', nameBn: 'কোম্পানি যানবাহন হিসাব', type: 'Fixed Asset', balance: 715000 },
      ],
    },
    {
      groupId: 'liabilities',
      name: 'Liabilities',
      nameBn: '২. দায়সমূহ (Liabilities)',
      range: '2000 - 2999',
      color: 'rose',
      accounts: [
        { code: '2010', name: 'Accounts Payable (Trade Suppliers)', nameBn: 'প্রদেয় হিসাব (সাপ্লায়ার দেনা)', type: 'Current Liability', balance: 412300 },
        { code: '2020', name: 'Accrued Operating Rent & Salaries', nameBn: 'বকেয়া পরিচালন ব্যয়', type: 'Current Liability', balance: 185000 },
        { code: '2030', name: 'Statutory VAT & Tax Payable (NBR)', nameBn: 'প্রদেয় মূসক ও ভ্যাট হিসাব', type: 'Current Liability', balance: 56100 },
        { code: '2500', name: 'Outstanding Bank SME Term Loan', nameBn: 'বকেয়া ব্যাংক ঋণ হিসাব', type: 'Long-term Liability', balance: 608800 },
      ],
    },
    {
      groupId: 'equity',
      name: 'Equity',
      nameBn: '৩. মালিকানাস্বত্ব (Equity)',
      range: '3000 - 3999',
      color: 'teal',
      accounts: [
        { code: '3010', name: 'Paid-up Share Capital', nameBn: 'পরিশোধিত শেয়ার মূলধন', type: 'Equity', balance: 2500000 },
        { code: '3020', name: 'Retained Earnings & Reserves', nameBn: 'সংরক্ষিত আয় ও ব্যবসায়িক মুনাফা', type: 'Equity', balance: 716300 },
      ],
    },
    {
      groupId: 'revenue',
      name: 'Revenue & Income',
      nameBn: '৪. রাজস্ব ও আয়সমূহ (Revenues)',
      range: '4000 - 4999',
      color: 'emerald',
      accounts: [
        { code: '4010', name: 'Product Sales Revenues (Wholesale/Retail)', nameBn: 'পণ্য বিক্রয় রাজস্ব', type: 'Operating Revenue', balance: 1845600 },
        { code: '4020', name: 'Services Contract Revenues', nameBn: 'সেবামূলক আয় হিসাব', type: 'Operating Revenue', balance: 654000 },
        { code: '4090', name: 'Other Non-Operating Revenues', nameBn: 'অন্যান্য আয় হিসাব', type: 'Non-Operating Revenue', balance: 346000 },
      ],
    },
    {
      groupId: 'expense',
      name: 'Expenses & COGS',
      nameBn: '৫. ব্যয় ও খরচের হিসাব (Expenses)',
      range: '5000 - 6999',
      color: 'amber',
      accounts: [
        { code: '5010', name: 'Cost of Goods Sold (COGS)', nameBn: 'বিক্রিত পণ্যের ব্যয়', type: 'Direct Cost', balance: 923400 },
        { code: '6010', name: 'Employee Salaries & Wages', nameBn: 'কর্মচারীদের বেতন ও ভাতা', type: 'Operating Expense', balance: 500000 },
        { code: '6020', name: 'Office Rent & Utilities', nameBn: 'অফিস ভাড়া ও ইউটিলিটি', type: 'Operating Expense', balance: 240000 },
        { code: '6030', name: 'Marketing & Digital Campaigns', nameBn: 'বিজ্ঞাপন ও প্রচারণা খরচ', type: 'Operating Expense', balance: 110000 },
        { code: '6090', name: 'General Administrative Overheads', nameBn: 'প্রশাসনিক ওভারহেড খরচ', type: 'Operating Expense', balance: 30000 },
      ],
    },
  ];

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleExport = (type: string) => {
    toast.success(
      isBangla
        ? `হিসাব কাঠামো ${type.toUpperCase()} এক্সপোর্ট সম্পন্ন হয়েছে!`
        : `Chart of Accounts ${type.toUpperCase()} exported successfully!`
    );
  };

  const totalAccountsCount = accountStructure.reduce((acc, g) => acc + g.accounts.length, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <FinancePageHeader
        pageName="Chart of Accounts Master"
        pageNameBn="হিসাবের তালিকা ও কোড (COA Master Hierarchy)"
        icon={FolderTree}
      />

      {/* Top Architecture Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-violet-500/5 border border-violet-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'সর্বমোট লেজার অ্যাকাউন্ট' : 'Active Ledger Accounts'}</div>
          <div className="text-2xl font-black font-mono text-foreground">{formatNumber(totalAccountsCount)} Accounts</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? '৫টি প্রধান প্রাতিষ্ঠানিক স্তরে' : 'Categorized across 5 tiers'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-purple-500/5 border border-purple-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'সম্পদ অ্যাকাউন্টস (1000s)' : 'Assets (1000 - 1999)'}</div>
          <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">7 Ledgers</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'নগদ, ব্যাংক, স্টক ও স্থায়ী' : 'Cash, bank, stock & fixed'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-rose-500/5 border border-rose-500/20 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground">{isBangla ? 'দায় ও মূলধন (2000s-3000s)' : 'Liabilities & Equity'}</div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">6 Ledgers</div>
          <div className="text-[11px] text-muted-foreground">{isBangla ? 'সাপ্লায়ার, ব্যাংক ঋণ ও ইকুইটি' : 'Payables, debt & capital'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-teal-500/10 border border-teal-500/30 shadow-md space-y-1.5 ring-1 ring-teal-500/20">
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 font-bold">{isBangla ? 'কাঠামো কমপ্লায়েন্স' : 'COA Standard'}</div>
          <div className="text-xl font-bold font-mono text-foreground">IFRS 5-Tier</div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold font-mono">100% Fully Configured</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Expand/Collapse Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setExpandedGroups(
                  expandedGroups.length === accountStructure.length ? [] : accountStructure.map((g) => g.groupId)
                )
              }
              className="h-9 text-xs"
            >
              {expandedGroups.length === accountStructure.length
                ? isBangla
                  ? 'সব ফোল্ডার গুটিয়ে নিন'
                  : 'Collapse All'
                : isBangla
                ? 'সব ফোল্ডার খুলুন'
                : 'Expand All'}
            </Button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'হিসাবের নাম বা কোড খুঁজুন...' : 'Search account or code...'}
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
            <span>Excel COA</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="h-9 text-xs gap-1.5 font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isBangla ? 'কাঠামো প্রিন্ট' : 'Print COA Master'}</span>
          </Button>
        </div>
      </div>

      {/* 5-Tier Hierarchical Account Groups */}
      <div className="space-y-4">
        {accountStructure.map((group) => {
          const isExpanded = expandedGroups.includes(group.groupId);
          const filteredAccounts = group.accounts.filter(
            (acc) =>
              acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              acc.code.includes(searchTerm) ||
              acc.type.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (searchTerm && filteredAccounts.length === 0) return null;

          return (
            <Card key={group.groupId} className="rounded-2xl border-border/70 shadow-xs overflow-hidden">
              <div
                onClick={() => toggleGroup(group.groupId)}
                className="p-4 bg-muted/30 border-b border-border/50 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-lg bg-background border border-border/60">
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {isBangla ? group.nameBn : group.name}
                    </h3>
                    <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      Code Range: {group.range}
                    </div>
                  </div>
                </div>

                <Badge variant="outline" className="font-mono text-xs font-bold">
                  {filteredAccounts.length} {isBangla ? 'টি অ্যাকাউন্ট' : 'ledgers'}
                </Badge>
              </div>

              {isExpanded && (
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border/40 text-muted-foreground font-bold uppercase text-[10px] bg-muted/20">
                        <th className="py-2.5 px-4 w-28">{isBangla ? 'কোড' : 'Code'}</th>
                        <th className="py-2.5 px-4">{isBangla ? 'হিসাবের নাম' : 'Account Name'}</th>
                        <th className="py-2.5 px-4">{isBangla ? 'উপ-শ্রেণী' : 'Sub-Type'}</th>
                        <th className="py-2.5 px-4 text-right">{isBangla ? 'বর্তমান ব্যালেন্স (৳)' : 'Current Balance (BDT)'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 font-mono">
                      {filteredAccounts.map((acc) => (
                        <tr key={acc.code} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-primary">{acc.code}</td>
                          <td className="py-2.5 px-4 font-sans font-medium text-foreground">
                            {isBangla ? acc.nameBn : acc.name}
                          </td>
                          <td className="py-2.5 px-4 font-sans text-muted-foreground">{acc.type}</td>
                          <td className="py-2.5 px-4 text-right font-bold text-foreground">
                            {formatCurrency(acc.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
