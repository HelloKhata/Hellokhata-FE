'use client';

import React from 'react';
import {
  Calendar,
  Building2,
  Printer,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type DateRangePreset = 'today' | 'this_week' | 'this_month' | 'last_month' | 'custom';

interface FinanceDateFilterProps {
  preset: DateRangePreset;
  onPresetChange: (preset: DateRangePreset) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  selectedBranch: string;
  onBranchChange: (branchId: string) => void;
  branches: any[];
  onPrint: () => void;
}

export function FinanceDateFilter({
  preset,
  onPresetChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectedBranch,
  onBranchChange,
  branches,
  onPrint,
}: FinanceDateFilterProps) {
  const { isBangla } = useAppTranslation();

  const presets: { id: DateRangePreset; labelEn: string; labelBn: string }[] = [
    { id: 'today', labelEn: 'Today', labelBn: 'আজ' },
    { id: 'this_week', labelEn: 'This Week', labelBn: 'এই সপ্তাহ' },
    { id: 'this_month', labelEn: 'This Month', labelBn: 'এই মাস' },
    { id: 'last_month', labelEn: 'Last Month', labelBn: 'গত মাস' },
    { id: 'custom', labelEn: 'Custom', labelBn: 'কাস্টম' },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-card/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10 dark:border-white/5 shadow-sm">
      {/* Preset Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
        {presets.map((p) => {
          const isActive = preset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPresetChange(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70"
              )}
            >
              {isBangla ? p.labelBn : p.labelEn}
            </button>
          );
        })}
      </div>

      {/* Right controls: Custom dates (if custom), Branch filter, Print */}
      <div className="flex flex-wrap items-center gap-2">
        {preset === 'custom' && (
          <div className="flex items-center gap-1.5">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="h-8 text-xs bg-background/50 rounded-xl w-32 border-border/60"
            />
            <span className="text-xs text-muted-foreground">-</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="h-8 text-xs bg-background/50 rounded-xl w-32 border-border/60"
            />
          </div>
        )}

        {/* Branch Selector */}
        {branches && branches.length > 0 && (
          <Select value={selectedBranch} onValueChange={onBranchChange}>
            <SelectTrigger className="w-[150px] sm:w-[170px] h-8 text-xs bg-background/50 rounded-xl border-border/60">
              <Building2 className="w-3.5 h-3.5 mr-1.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder={isBangla ? 'সকল শাখা' : 'All Branches'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isBangla ? 'সকল শাখা' : 'All Branches'}</SelectItem>
              {branches.map((b: any) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="h-8 px-2.5 rounded-xl text-xs gap-1.5 border-border/60 bg-background/50 hover:bg-muted"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isBangla ? 'প্রিন্ট' : 'Print'}</span>
        </Button>
      </div>
    </div>
  );
}
