// Hello Khata OS - 04. What Drove Sales (Vibrant, Colorful Driver Ranking)
// হ্যালো খাতা - বিক্রয় চালক উপাদান (রঙিন ও দৃষ্টিনন্দন)

'use client';

import React from 'react';
import { useSalesFocus } from './SalesFocusContext';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { DriverDimension, DriverItem } from '@/types/sales-report';
import {
  ArrowRight,
  Package,
  Layers,
  Users,
  UserCheck,
  Building2,
  CreditCard,
  ChevronRight,
  Sparkles,
  Trophy,
} from 'lucide-react';

export function SalesDrivers() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const {
    activeDimension,
    setActiveDimension,
    reportData,
    focus,
    setFocus,
    clearFocus,
    setViewAllDriversOpen,
    isSingleBranchBusiness,
  } = useSalesFocus();

  const dimensions: {
    id: DriverDimension;
    labelEn: string;
    labelBn: string;
    icon: any;
    color: string;
    gradient: string;
  }[] = [
    {
      id: 'products',
      labelEn: 'Products',
      labelBn: 'পণ্যসমূহ',
      icon: Package,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'categories',
      labelEn: 'Categories',
      labelBn: 'ক্যাটাগরি',
      icon: Layers,
      color: 'indigo',
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      id: 'customers',
      labelEn: 'Customers',
      labelBn: 'গ্রাহকগণ',
      icon: Users,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'salespeople',
      labelEn: 'Salespeople',
      labelBn: 'বিক্রয়কর্মী',
      icon: UserCheck,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500',
    },
    ...(!isSingleBranchBusiness
      ? [
          {
            id: 'branches' as DriverDimension,
            labelEn: 'Branches',
            labelBn: 'শাখা',
            icon: Building2,
            color: 'cyan',
            gradient: 'from-cyan-500 to-teal-500',
          },
        ]
      : []),
    {
      id: 'payments',
      labelEn: 'Payment Methods',
      labelBn: 'পেমেন্ট মাধ্যম',
      icon: CreditCard,
      color: 'rose',
      gradient: 'from-rose-500 to-red-500',
    },
  ];

  const currentDimConfig = dimensions.find((d) => d.id === activeDimension) || dimensions[0];
  const items: DriverItem[] = reportData.drivers[activeDimension] || [];
  const topItems = items.slice(0, 5);

  const handleItemClick = (item: DriverItem) => {
    if (focus && focus.id === item.id) {
      clearFocus();
    } else {
      let type: 'product' | 'category' | 'customer' | 'salesperson' | 'branch' | 'payment' = 'product';
      if (activeDimension === 'categories') type = 'category';
      if (activeDimension === 'customers') type = 'customer';
      if (activeDimension === 'salespeople') type = 'salesperson';
      if (activeDimension === 'branches') type = 'branch';
      if (activeDimension === 'payments') type = 'payment';

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
  };

  const getRankBadgeColor = (idx: number) => {
    if (idx === 0) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    if (idx === 1) return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
    if (idx === 2) return 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30';
    return 'bg-muted text-muted-foreground border-border/60';
  };

  return (
    <div className="p-5 sm:p-6 bg-gradient-to-br from-card via-card to-muted/30 rounded-3xl border border-border/70 shadow-lg shadow-black/5 space-y-4">
      {/* Header: Section Title + Dimension Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-xl bg-gradient-to-tr ${currentDimConfig.gradient} text-white shadow-xs`}>
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground tracking-tight">
              {isBangla ? 'শীর্ষ বিক্রয় অবদানকারী (ড্রাইভারস)' : 'What Drove Sales'}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {isBangla ? 'যেকোনো আইটেমে ক্লিক করে পুরো পেজটি ফিল্টার করুন' : 'Click any driver to enter Sales Focus mode'}
            </div>
          </div>
        </div>

        {/* Colorful Dimension Tabs: Products | Categories | Customers | Salespeople | Branches | Payment Methods */}
        <div className="flex items-center bg-muted/80 p-1 rounded-xl border border-border/60 overflow-x-auto gap-1">
          {dimensions.map((dim) => {
            const Icon = dim.icon;
            const isActive = activeDimension === dim.id;

            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => setActiveDimension(dim.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-r ${dim.gradient} text-white shadow-xs`
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{isBangla ? dim.labelBn : dim.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ranked Driver List with Rich Colorful Bars */}
      <div className="space-y-2.5">
        {topItems.map((item, index) => {
          const isFocused = focus?.id === item.id;
          const rankStr = String(index + 1).padStart(2, '0');

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer select-none overflow-hidden ${
                isFocused
                  ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-teal-500/10 border-primary shadow-md shadow-primary/10'
                  : 'bg-background/60 hover:bg-muted/70 border-border/50 hover:border-border/90'
              }`}
            >
              <div className="flex items-center justify-between gap-3 relative z-10">
                {/* Left: Rank Pill + Name + Subtitle */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-1 rounded-lg border shrink-0 ${getRankBadgeColor(
                      index
                    )}`}
                  >
                    #{rankStr}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {isBangla && item.nameBn ? item.nameBn : item.name}
                      </span>
                      {isFocused && (
                        <span className="text-[10px] bg-gradient-to-r from-primary to-teal-500 text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                          {isBangla ? 'ফোকাসড' : 'Active Focus'}
                        </span>
                      )}
                    </div>

                    {(item.subtitle || item.subtitleBn) && (
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {isBangla && item.subtitleBn ? item.subtitleBn : item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Amount + Share % */}
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div>
                    <div className="text-xs sm:text-sm font-black text-foreground font-mono">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="text-[11px] font-semibold text-muted-foreground flex items-center justify-end gap-1">
                      <span className="text-primary font-bold">{item.sharePercentage}%</span>
                      <span>{isBangla ? 'অংশ' : 'share'}</span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>

              {/* Colorful Dynamic Proportional Gradient Bar Background */}
              <div
                className={`absolute left-0 bottom-0 top-0 rounded-2xl transition-all duration-300 pointer-events-none opacity-20 group-hover:opacity-30 ${
                  isFocused
                    ? 'bg-gradient-to-r from-primary via-teal-400 to-indigo-400 opacity-40'
                    : `bg-gradient-to-r ${currentDimConfig.gradient}`
                }`}
                style={{ width: `${Math.min(100, Math.max(10, item.sharePercentage * 2.2))}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Footer: View All Link */}
      {items.length > 5 && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => setViewAllDriversOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors py-1.5 px-3 rounded-full hover:bg-primary/10 border border-primary/20 cursor-pointer"
          >
            <span>
              {isBangla
                ? `সকল ${currentDimConfig.labelBn} বিস্তারিত দেখুন (${items.length})`
                : `View all ${currentDimConfig.labelEn} (${items.length})`}
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
