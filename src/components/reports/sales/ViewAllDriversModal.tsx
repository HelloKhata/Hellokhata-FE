// Hello Khata OS - View All Drivers Modal
// হ্যালো খাতা - সম্পূর্ণ চালক উপাদান মোডাল

'use client';

import React, { useState } from 'react';
import { useSalesFocus } from './SalesFocusContext';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight, Check } from 'lucide-react';
import { DriverItem } from '@/types/sales-report';

export function ViewAllDriversModal() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const {
    viewAllDriversOpen,
    setViewAllDriversOpen,
    activeDimension,
    reportData,
    focus,
    setFocus,
    clearFocus,
  } = useSalesFocus();

  const [searchTerm, setSearchTerm] = useState('');

  const items: DriverItem[] = reportData.drivers[activeDimension] || [];

  const titleMap = {
    products: { en: 'All Products Ranking', bn: 'সকল পণ্যের তালিকা ও অবদান' },
    categories: { en: 'All Categories Ranking', bn: 'সকল ক্যাটাগরির অবদান' },
    customers: { en: 'All Customers Ranking', bn: 'সকল গ্রাহকের অবদান' },
    salespeople: { en: 'All Salespeople Performance', bn: 'সকল বিক্রয়কর্মীর পারফরম্যান্স' },
    branches: { en: 'All Branches Ranking', bn: 'সকল শাখার অবদান' },
    payments: { en: 'All Payment Methods Collection', bn: 'সকল পেমেন্ট মাধ্যমের কালেকশন' },
  };

  const filteredItems = items.filter((it) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      it.name.toLowerCase().includes(term) ||
      (it.nameBn && it.nameBn.includes(term)) ||
      (it.subtitle && it.subtitle.toLowerCase().includes(term))
    );
  });

  const handleSelect = (item: DriverItem) => {
    if (focus && focus.id === item.id) {
      clearFocus();
    } else {
      let type: 'product' | 'category' | 'customer' | 'branch' = 'product';
      if (activeDimension === 'categories') type = 'category';
      if (activeDimension === 'customers') type = 'customer';
      if (activeDimension === 'branches') type = 'branch';

      setFocus({
        type,
        id: item.id,
        name: item.name,
        nameBn: item.nameBn,
        amount: item.amount,
        sharePercentage: item.sharePercentage,
        ordersCount: item.ordersCount,
      });
    }
    setViewAllDriversOpen(false);
  };

  return (
    <Dialog open={viewAllDriversOpen} onOpenChange={setViewAllDriversOpen}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="space-y-1 pb-3 border-b border-border/50">
          <DialogTitle className="text-lg font-bold text-foreground">
            {isBangla ? titleMap[activeDimension].bn : titleMap[activeDimension].en}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isBangla
              ? 'যেকোনো আইটেমে ক্লিক করে পুরো পেজটিতে সেলস ফোকাস প্রয়োগ করুন'
              : 'Click any item to activate Sales Focus mode across the entire report'}
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBangla ? 'খুঁজুন...' : 'Search ranking...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-9 text-xs"
            />
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
          {filteredItems.map((item, idx) => {
            const isFocused = focus?.id === item.id;
            const rankStr = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isFocused
                    ? 'bg-primary/10 border-primary shadow-xs'
                    : 'bg-card hover:bg-muted/50 border-border/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-muted-foreground font-mono w-5">
                    {rankStr}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {isBangla && item.nameBn ? item.nameBn : item.name}
                    </div>
                    {(item.subtitle || item.subtitleBn) && (
                      <div className="text-[11px] text-muted-foreground truncate">
                        {isBangla && item.subtitleBn ? item.subtitleBn : item.subtitle}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-foreground font-mono">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {item.sharePercentage}% {isBangla ? 'অংশ' : 'share'}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
