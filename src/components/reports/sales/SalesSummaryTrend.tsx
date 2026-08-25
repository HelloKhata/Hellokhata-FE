// Hello Khata OS - 02 + 03 Combined Summary & Trend Section
// হ্যালো খাতা - বিক্রয় সারসংক্ষেপ ও ট্রেন্ড সেকশন

'use client';

import React from 'react';
import { SalesSummary } from './SalesSummary';
import { SalesTrend } from './SalesTrend';

export function SalesSummaryTrend() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Sales Summary (Visual Anchor - 5 cols on large desktop) */}
      <div className="lg:col-span-5 flex flex-col">
        <SalesSummary />
      </div>

      {/* Sales Trend Chart (7 cols on large desktop) */}
      <div className="lg:col-span-7 flex flex-col">
        <SalesTrend />
      </div>
    </div>
  );
}
