'use client';

import React from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { FinancePlaceholderCard } from '@/components/finance/FinancePlaceholderCard';
import { TrendingDown } from 'lucide-react';

export default function FinanceExpensesPage() {
  return (
    <div className="space-y-6">
      <FinancePageHeader
        pageName="Expenses"
        pageNameBn="ব্যয়"
        description="Track business expenditures and overhead costs"
        descriptionBn="ব্যবসায়িক ব্যয় এবং ওভারহেড খরচ ট্র্যাক করুন"
        icon={TrendingDown}
      />

      <FinancePlaceholderCard
        title="Expense Management"
        titleBn="ব্যয় ব্যবস্থাপনা"
        description="Business expense management will be implemented here."
        descriptionBn="ব্যবসায়িক ব্যয় ব্যবস্থাপনা এখানে প্রয়োগ করা হবে।"
        badgeText="Expenditure tracking"
      />
    </div>
  );
}
