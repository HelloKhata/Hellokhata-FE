import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Store, BarChart3, Filter } from "lucide-react";

interface AnalyticsToolbarProps {
  branches: string[];
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  selectedRange: { from: Date; to: Date };
  onRangeChange: (range: { from: Date; to: Date }) => void;
  granularity: string;
  onGranularityChange: (val: string) => void;
}

export function AnalyticsToolbar({
  branches,
  selectedBranch,
  onBranchChange,
  selectedRange,
  onRangeChange,
  granularity,
  onGranularityChange,
}: AnalyticsToolbarProps) {
  const [date, setDate] = useState<{ from: Date; to: Date } | undefined>({
    from: selectedRange.from,
    to: selectedRange.to,
  });

  return (
    <div className="sticky top-[64px] z-30 w-full bg-background/80 backdrop-blur-md border-y border-border/40 py-3 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm px-4 rounded-xl">
      {/* Label and branch dropdown */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground shrink-0 uppercase tracking-wider">
          <BarChart3 className="h-4 w-4 text-primary" />
          Analytics Control
        </div>
        <div className="h-4 w-[1px] bg-border/80 hidden sm:block" />
        <Select value={selectedBranch} onValueChange={onBranchChange}>
          <SelectTrigger className="h-9 w-full sm:w-44 bg-background/50 border-input text-xs rounded-xl">
            <Store className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent className="bg-card border border-border rounded-xl">
            {branches.map((br) => (
              <SelectItem key={br} value={br} className="text-xs cursor-pointer">
                {br === "all" ? "All Outlets" : br}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Pickers & Granularity Selector */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 justify-end">
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-full sm:w-60 justify-between text-left font-normal bg-background/50 border-input text-foreground hover:bg-muted text-xs rounded-xl cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">
                  {format(selectedRange.from, "dd MMM")} - {format(selectedRange.to, "dd MMM yyyy")}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-card border border-border rounded-xl" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={selectedRange.from}
              selected={{
                from: selectedRange.from,
                to: selectedRange.to,
              }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onRangeChange({ from: range.from, to: range.to });
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Granularity Tabs */}
        <Tabs value={granularity} onValueChange={onGranularityChange} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 h-9 bg-muted/60 p-0.5 rounded-xl border border-border/20 text-xs">
            <TabsTrigger value="daily" className="text-[10px] font-semibold rounded-lg px-2.5 py-1 text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-[10px] font-semibold rounded-lg px-2.5 py-1 text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-[10px] font-semibold rounded-lg px-2.5 py-1 text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="custom" className="text-[10px] font-semibold rounded-lg px-2.5 py-1 text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              Custom
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
