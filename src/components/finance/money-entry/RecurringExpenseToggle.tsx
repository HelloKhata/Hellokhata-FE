"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/premium";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Repeat } from "lucide-react";

interface RecurringExpenseToggleProps {
  isRecurring: boolean;
  onRecurringChange: (val: boolean) => void;
  frequency: "monthly" | "weekly" | "yearly";
  onFrequencyChange: (val: "monthly" | "weekly" | "yearly") => void;
  nextDueDate: string;
  onNextDueDateChange: (val: string) => void;
  isBangla?: boolean;
}

export function RecurringExpenseToggle({
  isRecurring,
  onRecurringChange,
  frequency,
  onFrequencyChange,
  nextDueDate,
  onNextDueDateChange,
  isBangla = false,
}: RecurringExpenseToggleProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
            <Repeat className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              {isBangla ? "পুনরাবৃত্তি খরচ (Recurring Expense)" : "Recurring Expense Toggle"}
            </p>
            <p className="text-[10.5px] text-muted-foreground">
              {isBangla ? "প্রতি মাসে স্বয়ংক্রিয়ভাবে এই খরচটি রিপিট হবে" : "This expense repeats regularly (e.g. monthly rent)"}
            </p>
          </div>
        </div>

        <Switch
          checked={isRecurring}
          onCheckedChange={onRecurringChange}
        />
      </div>

      {isRecurring && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/40 animate-in fade-in duration-200">
          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-muted-foreground">
              {isBangla ? "পুনরাবৃত্তির সময়কাল" : "Repeat Frequency"}
            </Label>
            <Select
              value={frequency}
              onValueChange={(val) => onFrequencyChange(val as any)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">{isBangla ? "প্রতি মাসে (Monthly)" : "Monthly"}</SelectItem>
                <SelectItem value="weekly">{isBangla ? "প্রতি সপ্তাহে (Weekly)" : "Weekly"}</SelectItem>
                <SelectItem value="yearly">{isBangla ? "প্রতি বছরে (Yearly)" : "Yearly"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-muted-foreground">
              {isBangla ? "পরবর্তী পরিশোধ তারিখ" : "Next Due Date"}
            </Label>
            <Input
              type="date"
              value={nextDueDate}
              onChange={(e) => onNextDueDateChange(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
