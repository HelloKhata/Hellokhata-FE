'use client';

import React from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { FinancePlaceholderCard } from '@/components/finance/FinancePlaceholderCard';
import { TrendingUp } from 'lucide-react';

export default function FinanceIncomePage() {
  return (
    <div className="space-y-6">
      <FinancePageHeader
        pageName="Income"
        pageNameBn="আয়"
        description="Record non-sales income streams and revenues"
        descriptionBn="অ-বিক্রয় ভিত্তিক আয়ের উৎস এবং রাজস্ব লিপিবদ্ধ করুন"
        icon={TrendingUp}
      />

      <FinancePlaceholderCard
        title="Income Management"
        titleBn="আয় ব্যবস্থাপনা"
        description="Manual non-POS income entries will be added here."
        descriptionBn="ম্যানুয়াল নন-পিওএস (POS) আয়ের এন্ট্রিগুলি এখানে যোগ করা হবে।"
        badgeText="Revenue tracking"
      />
    </div>
  );
}
