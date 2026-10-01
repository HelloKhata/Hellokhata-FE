"use client";

import React, { useMemo } from "react";
import { Plus, Edit2, Trash2, ArrowRight, Loader2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/premium";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";
import {
  IncomeRecord,
  toBnNum,
  getIconComponentById,
  getCategoryColorStyles,
} from "./types";

interface IncomeCategoriesCardProps {
  incomeCategories?: any[];
  loadingCategories?: boolean;
  incomes?: IncomeRecord[] | any[];
  onOpenAddCategory: () => void;
  onOpenEditCategory: (cat: any) => void;
  onPromptDeleteCategory: (cat: any) => void;
  onOpenViewAllCategories: () => void;
  isBangla: boolean;
}

export const IncomeCategoriesCard: React.FC<IncomeCategoriesCardProps> = ({
  incomeCategories = [],
  loadingCategories,
  incomes = [],
  onOpenAddCategory,
  onOpenEditCategory,
  onPromptDeleteCategory,
  onOpenViewAllCategories,
  isBangla,
}) => {
  // Chart Data calculation
  const totalAmount = useMemo(() => {
    return (incomes || []).reduce((sum, inc) => sum + (Number(inc.amount) || 0), 0);
  }, [incomes]);

  const overviewChartData = useMemo(() => {
    if (!incomes || incomes.length === 0) {
      return [
        {
          name: isBangla ? "আয়ের হিসাব" : "Direct Income",
          value: 100,
          color: "#10b981",
          percentage: 100,
        },
      ];
    }

    const map = new Map<string, { name: string; value: number; color: string }>();

    incomes.forEach((inc: any) => {
      const catId = inc.categoryId || inc.category?.id || "other";
      const catName = isBangla
        ? inc.category?.nameBn || inc.titleBn || inc.category?.name || "আয়"
        : inc.category?.name || inc.titleEn || "Income";
      const catColor = inc.category?.color || inc.color || "#10b981";
      const val = Number(inc.amount) || 0;

      const existing = map.get(catId);
      if (existing) {
        existing.value += val;
      } else {
        map.set(catId, {
          name: catName,
          value: val,
          color: catColor,
        });
      }
    });

    const total = Array.from(map.values()).reduce((s, c) => s + c.value, 0);

    return Array.from(map.values()).map((c) => ({
      name: c.name,
      value: c.value,
      color: c.color,
      percentage: total > 0 ? Math.round((c.value / total) * 100) : 0,
    }));
  }, [incomes, isBangla]);


  return (
    <div className="space-y-6">
      {/* CARD 1: Income Categories */}
      <div className="rounded-2xl border border-border/80 bg-card/95 p-5 shadow-sm space-y-4 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-sm font-bold text-foreground">
            {isBangla ? "আয় ক্যাটাগরি সমূহ" : "Income Categories"}
          </h3>
          <Button
            type="button"
            size="sm"
            onClick={onOpenAddCategory}
            className="h-7.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isBangla ? "ক্যাটাগরি যোগ করুন" : "Add Category"}</span>
          </Button>
        </div>

        {/* Category List */}
        <div className="space-y-3">
          {loadingCategories ? (
            <div className="flex items-center justify-center py-6 text-xs text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              <span>{isBangla ? "ক্যাটাগরি লোড হচ্ছে..." : "Loading categories..."}</span>
            </div>
          ) : !incomeCategories || incomeCategories.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              {isBangla ? "কোনো ক্যাটাগরি যোগ করা হয়নি" : "No categories added yet"}
            </div>
          ) : (
            incomeCategories.slice(0, 3).map((cat: any) => {
              const { bgColor, borderColor } = getCategoryColorStyles(
                cat.color || "#10b981"
              );

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-3 text-xs group"
                >
                  {/* Left: Icon + Names */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "p-1.5 rounded-lg border shrink-0",
                        bgColor,
                        borderColor
                      )}
                    >
                      {React.createElement(getIconComponentById(cat.icon), {
                        className: "h-3.5 w-3.5",
                      })}
                    </div>
                    <div className="min-w-0 truncate">
                      <p className="font-bold text-foreground truncate">
                        {isBangla ? cat.nameBn || cat.name : cat.name}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onOpenEditCategory(cat)}
                      className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                      title={isBangla ? "সম্পাদনা" : "Edit"}
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onPromptDeleteCategory(cat)}
                      className="p-1 text-muted-foreground hover:text-rose-400 rounded transition-colors cursor-pointer"
                      title={isBangla ? "মুছে ফেলুন" : "Delete"}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 border-t border-border/40">
          <button
            type="button"
            onClick={onOpenViewAllCategories}
            className="text-[11.5px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{isBangla ? "সব ক্যাটাগরি দেখুন" : "View all categories"}</span>
            {incomeCategories && incomeCategories.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-semibold">
                {isBangla ? toBnNum(incomeCategories.length) : incomeCategories.length}
              </span>
            )}
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* CARD 2: Income Overview */}
      <div className="rounded-2xl border border-border/80 bg-card/95 p-5 shadow-sm space-y-4 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-sm font-bold text-foreground">
            {isBangla ? "আয় সংক্ষিপ্ত বিবরণ" : "Income Overview"}
          </h3>
          <Select defaultValue="this-month">
            <SelectTrigger className="h-7 text-[11px] w-28 bg-muted/20 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="this-month">
                {isBangla ? "এই মাস" : "This Month"}
              </SelectItem>
              <SelectItem value="last-month">
                {isBangla ? "গত মাস" : "Last Month"}
              </SelectItem>
              <SelectItem value="this-year">
                {isBangla ? "এই বছর" : "This Year"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Donut Chart & Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
          <div className="sm:col-span-5 h-[140px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overviewChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={62}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {overviewChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {isBangla ? "মোট আয়" : "Total"}
              </span>
              <span className="font-mono font-bold text-xs text-foreground">
                {isBangla
                  ? `৳${toBnNum(totalAmount.toLocaleString())}`
                  : `৳${totalAmount.toLocaleString()}`}
              </span>
            </div>
          </div>

          <div className="sm:col-span-7 space-y-2 text-xs">
            {overviewChartData.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11.5px]">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono shrink-0">
                  <span className="font-bold text-foreground">
                    {isBangla
                      ? `৳${toBnNum(item.value.toLocaleString())}`
                      : `৳${item.value.toLocaleString()}`}
                  </span>
                  <span className="text-muted-foreground/80 text-[10px]">
                    ({isBangla ? toBnNum(item.percentage) : item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
