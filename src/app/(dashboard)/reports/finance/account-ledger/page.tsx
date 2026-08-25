'use client';

import React, { useState } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { Notebook, Filter, Printer, FileSpreadsheet, Layers } from 'lucide-react';

export default function AccountLedgerPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const [selectedAccount, setSelectedAccount] = useState('1100');

  const accounts = [
    { code: '1000', name: 'Cash on Hand', nameBn: 'হাতে নগদ হিসাব' },
    { code: '1100', name: 'Bank Operating Account', nameBn: 'ব্যাংক পরিচালন হিসাব' },
    { code: '1200', name: 'Accounts Receivable', nameBn: 'প্রাপ্য হিসাব' },
    { code: '4000', name: 'Product Sales Revenues', nameBn: 'পণ্য বিক্রয় রাজস্ব' },
    { code: '6000', name: 'Employee Salaries', nameBn: 'কর্মচারীদের বেতন হিসাব' },
  ];

  // Specific mock logs per account
  const accountsData: Record<string, { date: string; voucher: string; desc: string; debit: number; credit: number; balance: number }[]> = {
    '1000': [
      { date: '2026-08-01', voucher: 'JV-001', desc: 'Opening balance setup', debit: 456800, credit: 0, balance: 456800 },
      { date: '2026-08-04', voucher: 'PV-901', desc: 'Office stationary cash buy', debit: 0, credit: 5000, balance: 451800 },
    ],
    '1100': [
      { date: '2026-08-01', voucher: 'JV-001', desc: 'Capital bank deposit', debit: 1287500, credit: 0, balance: 1287500 },
      { date: '2026-08-03', voucher: 'PV-5021', desc: 'Salary bank withdrawal', debit: 0, credit: 120000, balance: 1167500 },
      { date: '2026-08-05', voucher: 'RV-102', desc: 'Customer invoice wire payment', debit: 85000, credit: 0, balance: 1252500 },
    ],
    '1200': [
      { date: '2026-08-02', voucher: 'INV-1024', desc: 'Sales invoice entry', debit: 85000, credit: 0, balance: 85000 },
      { date: '2026-08-05', voucher: 'RV-102', desc: 'Customer collection receipt', debit: 0, credit: 85000, balance: 0 },
    ],
    '4000': [
      { date: '2026-08-02', voucher: 'INV-1024', desc: 'Sales to Client X', debit: 0, credit: 85000, balance: 85000 },
    ],
    '6000': [
      { date: '2026-08-03', voucher: 'PV-5021', desc: 'July salary payroll ledger', debit: 120000, credit: 0, balance: 120000 },
    ],
  };

  const selectedEntries = accountsData[selectedAccount] || [];
  const selectedAccountInfo = accounts.find((a) => a.code === selectedAccount);

  const totalDebit = selectedEntries.reduce((acc, entry) => acc + entry.debit, 0);
  const totalCredit = selectedEntries.reduce((acc, entry) => acc + entry.credit, 0);

  const handleExport = (type: string) => {
    alert(isBangla ? `${type} এক্সপোর্ট সিমুলেশন সম্পন্ন!` : `${type} export simulation completed!`);
  };

  return (
    <div className="space-y-6">
      <FinancePageHeader
        pageName="Account Ledger"
        pageNameBn="হিসাব খতিয়ান"
        description="Individual account-wise transaction ledger with running balance."
        descriptionBn="একাউন্টভিত্তিক লেনদেন খতিয়ান ও চলমান ব্যালেন্স।"
        icon={Notebook}
        parentName="Finance Reports"
        parentNameBn="আর্থিক রিপোর্ট"
        parentHref="/reports/finance"
      />

      {/* Toolbar - Selector */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3.5 rounded-xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            {isBangla ? 'হিসাবখাত নির্বাচন করুন:' : 'Select Ledger Account:'}
          </span>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="h-8 rounded-lg border bg-background px-3 text-xs font-semibold focus:outline-none"
          >
            {accounts.map((acc) => (
              <option key={acc.code} value={acc.code}>
                [{acc.code}] {isBangla ? acc.nameBn : acc.name}
              </option>
            ))}
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

      {/* Main Ledger Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3 border-b border-border/30 bg-muted/10">
          <CardTitle className="text-sm font-bold">
            {isBangla ? 'খতিয়ান হিসাব খাতা বিবরণী' : 'Account Transactions Statement'}
            <span className="text-primary font-mono ml-2 font-semibold">
              ({selectedAccountInfo?.code} - {isBangla ? selectedAccountInfo?.nameBn : selectedAccountInfo?.name})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border/35 font-bold">
                  <th className="p-3">{isBangla ? 'তারিখ' : 'Transaction Date'}</th>
                  <th className="p-3">{isBangla ? 'ভাউচার' : 'Voucher No'}</th>
                  <th className="p-3">{isBangla ? 'বিবরণ' : 'Narration / Description'}</th>
                  <th className="p-3 text-right">{isBangla ? 'ডেবিট' : 'Debit'}</th>
                  <th className="p-3 text-right">{isBangla ? 'ক্রেডিট' : 'Credit'}</th>
                  <th className="p-3 text-right">{isBangla ? 'চলতি জের (Balance)' : 'Running Balance'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {selectedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground font-semibold">
                      {isBangla ? 'এই হিসাবখাতে কোনো লেনদেন পাওয়া যায়নি।' : 'No transaction logs found for this account.'}
                    </td>
                  </tr>
                ) : (
                  selectedEntries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-muted/5">
                      <td className="p-3 font-mono text-muted-foreground">{entry.date}</td>
                      <td className="p-3 font-mono text-primary">{entry.voucher}</td>
                      <td className="p-3 text-muted-foreground">{entry.desc}</td>
                      <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                      </td>
                      <td className="p-3 text-right font-mono text-rose-600 dark:text-rose-400">
                        {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                      </td>
                      <td className="p-3 text-right font-mono font-semibold">
                        {formatCurrency(entry.balance)}
                      </td>
                    </tr>
                  ))
                )}
                
                {/* Account totals */}
                {selectedEntries.length > 0 && (
                  <tr className="font-bold bg-muted/15">
                    <td className="p-3" colSpan={3}>{isBangla ? 'সর্বমোট যোগফল' : 'Summary Ledger Totals'}</td>
                    <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(totalDebit)}</td>
                    <td className="p-3 text-right font-mono text-rose-600 dark:text-rose-400">{formatCurrency(totalCredit)}</td>
                    <td className="p-3 text-right font-mono text-primary">
                      {formatCurrency(totalDebit - totalCredit)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
