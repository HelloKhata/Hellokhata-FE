// Hello Khata OS - Advanced Filter Sheet (Progressive Disclosure)
// হ্যালো খাতা - অ্যাডভান্সড ফিল্টার শিট

'use client';

import React, { useState } from 'react';
import { useSalesFocus } from './SalesFocusContext';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { AdvancedFilterState } from '@/types/sales-report';

export function AdvancedFiltersSheet() {
  const { isBangla } = useAppTranslation();
  const {
    filtersSheetOpen,
    setFiltersSheetOpen,
    advancedFilters,
    setAdvancedFilters,
    clearAdvancedFilters,
  } = useSalesFocus();

  const [localFilters, setLocalFilters] = useState<AdvancedFilterState>(advancedFilters);

  const handleApply = () => {
    setAdvancedFilters(localFilters);
    setFiltersSheetOpen(false);
  };

  const handleReset = () => {
    setLocalFilters({});
    clearAdvancedFilters();
    setFiltersSheetOpen(false);
  };

  return (
    <Sheet open={filtersSheetOpen} onOpenChange={setFiltersSheetOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto flex flex-col justify-between">
        <div className="space-y-6">
          <SheetHeader className="space-y-1 text-left pb-4 border-b border-border/50">
            <SheetTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span>{isBangla ? 'অ্যাডভান্সড ফিল্টার' : 'Advanced Filters'}</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {isBangla
                ? 'নির্দিষ্ট শর্ত অনুযায়ী বিক্রয় তথ্য ফিল্টার করুন'
                : 'Narrow down sales records by specific attributes'}
            </SheetDescription>
          </SheetHeader>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Payment Method */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
              </Label>
              <Select
                value={localFilters.paymentMethod || 'all'}
                onValueChange={(val) =>
                  setLocalFilters((prev) => ({ ...prev, paymentMethod: val === 'all' ? undefined : val }))
                }
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder={isBangla ? 'সকল মাধ্যম' : 'All Methods'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isBangla ? 'সকল মাধ্যম' : 'All Methods'}</SelectItem>
                  <SelectItem value="Cash">{isBangla ? 'ক্যাশ (নগদ)' : 'Cash'}</SelectItem>
                  <SelectItem value="bKash">bKash (বিকাশ)</SelectItem>
                  <SelectItem value="Nagad">Nagad (নগদ)</SelectItem>
                  <SelectItem value="Bank Transfer">{isBangla ? 'ব্যাংক ট্রান্সফার' : 'Bank Transfer'}</SelectItem>
                  <SelectItem value="Credit">{isBangla ? 'বাকি / ক্রেডিট' : 'Credit'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? 'পেমেন্ট স্ট্যাটাস' : 'Payment Status'}
              </Label>
              <Select
                value={localFilters.status || 'all'}
                onValueChange={(val) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    status: val === 'all' ? undefined : (val as 'paid' | 'partial' | 'due'),
                  }))
                }
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder={isBangla ? 'সকল স্ট্যাটাস' : 'All Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isBangla ? 'সকল স্ট্যাটাস' : 'All Status'}</SelectItem>
                  <SelectItem value="paid">{isBangla ? 'পরিশোধিত (Paid)' : 'Paid'}</SelectItem>
                  <SelectItem value="partial">{isBangla ? 'আংশিক পরিশোধ (Partial)' : 'Partial'}</SelectItem>
                  <SelectItem value="due">{isBangla ? 'বকেয়া (Due)' : 'Due'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salesperson */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? 'বিক্রয়কর্মী' : 'Salesperson'}
              </Label>
              <Select
                value={localFilters.salesperson || 'all'}
                onValueChange={(val) =>
                  setLocalFilters((prev) => ({ ...prev, salesperson: val === 'all' ? undefined : val }))
                }
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder={isBangla ? 'সকল বিক্রয়কর্মী' : 'All Salespeople'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isBangla ? 'সকল বিক্রয়কর্মী' : 'All Salespeople'}</SelectItem>
                  <SelectItem value="Rahim Ahmed">Rahim Ahmed</SelectItem>
                  <SelectItem value="Karim Ullah">Karim Ullah</SelectItem>
                  <SelectItem value="Tanvir Hasan">Tanvir Hasan</SelectItem>
                  <SelectItem value="Farhana Akter">Farhana Akter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Range */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                {isBangla ? 'চালানের পরিমাণ সীমা (৳)' : 'Invoice Amount Range (৳)'}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder={isBangla ? 'সর্বনিম্ন' : 'Min'}
                  value={localFilters.minAmount || ''}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      minAmount: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="h-9 text-xs"
                />
                <Input
                  type="number"
                  placeholder={isBangla ? 'সর্বোচ্চ' : 'Max'}
                  value={localFilters.maxAmount || ''}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      maxAmount: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-border/50 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-muted-foreground gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isBangla ? 'রিসেট' : 'Reset'}</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            className="text-xs font-semibold gap-1.5 px-4"
          >
            <Check className="h-3.5 w-3.5" />
            <span>{isBangla ? 'প্রয়োগ করুন' : 'Apply Filters'}</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
