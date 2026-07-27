"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  TrendingUp,
  Landmark,
  Building2,
  Coins,
  Percent,
  Home,
  Zap,
  Users,
  Package,
  Truck,
  Receipt,
} from "lucide-react";

export interface CategoryOption {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: React.ElementType;
  bgClass: string;
  selectedBgClass: string;
}

export const INCOME_CATEGORIES: CategoryOption[] = [
  {
    id: "sales",
    nameEn: "Sales",
    nameBn: "বিক্রি (Sales)",
    icon: ShoppingCart,
    bgClass: "bg-teal-600/15 border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-600/25",
    selectedBgClass: "bg-teal-600 text-white border-teal-500 shadow-md ring-2 ring-teal-500/30",
  },
  {
    id: "other_income",
    nameEn: "Other Income",
    nameBn: "অন্যান্য আয়",
    icon: TrendingUp,
    bgClass: "bg-sky-600/15 border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-600/25",
    selectedBgClass: "bg-sky-600 text-white border-sky-500 shadow-md ring-2 ring-sky-500/30",
  },
  {
    id: "investment",
    nameEn: "Investment",
    nameBn: "বিনিয়োগ",
    icon: Landmark,
    bgClass: "bg-purple-600/15 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-600/25",
    selectedBgClass: "bg-purple-600 text-white border-purple-500 shadow-md ring-2 ring-purple-500/30",
  },
  {
    id: "asset_sale",
    nameEn: "Asset Sale",
    nameBn: "সম্পদ বিক্রয়",
    icon: Building2,
    bgClass: "bg-amber-600/15 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-600/25",
    selectedBgClass: "bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30",
  },
  {
    id: "grant",
    nameEn: "Grant",
    nameBn: "অনুদান (Grant)",
    icon: Coins,
    bgClass: "bg-emerald-600/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600/25",
    selectedBgClass: "bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30",
  },
  {
    id: "interest",
    nameEn: "Interest",
    nameBn: "মুনাফা (Interest)",
    icon: Percent,
    bgClass: "bg-pink-600/15 border-pink-500/30 text-pink-600 dark:text-pink-400 hover:bg-pink-600/25",
    selectedBgClass: "bg-pink-600 text-white border-pink-500 shadow-md ring-2 ring-pink-500/30",
  },
];

export const EXPENSE_CATEGORIES: CategoryOption[] = [
  {
    id: "rent",
    nameEn: "Rent",
    nameBn: "দোকান ভাড়া",
    icon: Home,
    bgClass: "bg-rose-600/15 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600/25",
    selectedBgClass: "bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-500/30",
  },
  {
    id: "utilities",
    nameEn: "Utilities",
    nameBn: "বিদ্যুৎ ও বিল",
    icon: Zap,
    bgClass: "bg-amber-600/15 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-600/25",
    selectedBgClass: "bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30",
  },
  {
    id: "salary",
    nameEn: "Salary",
    nameBn: "স্টাফ বেতন",
    icon: Users,
    bgClass: "bg-indigo-600/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/25",
    selectedBgClass: "bg-indigo-600 text-white border-indigo-500 shadow-md ring-2 ring-indigo-500/30",
  },
  {
    id: "inventory",
    nameEn: "Inventory",
    nameBn: "পণ্য ক্রয়",
    icon: Package,
    bgClass: "bg-sky-600/15 border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-600/25",
    selectedBgClass: "bg-sky-600 text-white border-sky-500 shadow-md ring-2 ring-sky-500/30",
  },
  {
    id: "transport",
    nameEn: "Transport",
    nameBn: "পরিবহন খরচ",
    icon: Truck,
    bgClass: "bg-purple-600/15 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-600/25",
    selectedBgClass: "bg-purple-600 text-white border-purple-500 shadow-md ring-2 ring-purple-500/30",
  },
  {
    id: "other",
    nameEn: "Other",
    nameBn: "অন্যান্য খরচ",
    icon: Receipt,
    bgClass: "bg-slate-600/15 border-slate-500/30 text-slate-600 dark:text-slate-400 hover:bg-slate-600/25",
    selectedBgClass: "bg-slate-600 text-white border-slate-500 shadow-md ring-2 ring-slate-500/30",
  },
];

interface CategoryGridProps {
  mode: "income" | "expense";
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  error?: string;
  isBangla?: boolean;
}

export function CategoryGrid({
  mode,
  selectedCategoryId,
  onSelectCategory,
  error,
  isBangla = false,
}: CategoryGridProps) {
  const categories = mode === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "h-24 rounded-2xl border p-3 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group font-semibold text-xs",
                isSelected ? cat.selectedBgClass : cat.bgClass
              )}
            >
              <div className="p-1.5 rounded-lg shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11.5px] tracking-tight text-center leading-none">
                {isBangla ? cat.nameBn : cat.nameEn}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-[11px] text-destructive font-medium pl-1">{error}</p>
      )}
    </div>
  );
}
