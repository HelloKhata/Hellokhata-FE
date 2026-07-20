import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

export function RevenueChartPlaceholder() {
  const bars = [
    { label: "Jan", val: "h-[30%]", amount: "৳45k" },
    { label: "Feb", val: "h-[45%]", amount: "৳68k" },
    { label: "Mar", val: "h-[35%]", amount: "৳52k" },
    { label: "Apr", val: "h-[60%]", amount: "৳90k" },
    { label: "May", val: "h-[75%]", amount: "৳112k" },
    { label: "Jun", val: "h-[90%]", amount: "৳135k", highlighted: true },
    { label: "Jul", val: "h-[50%]", amount: "৳73k" },
  ];

  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col h-[280px]">
      <CardHeader className="p-5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Monthly Earnings Flow
          </span>
          <CardTitle className="text-sm font-bold text-foreground">
            Revenue Analytics
          </CardTitle>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded-md font-semibold">
          <ArrowUpRight className="h-3.5 w-3.5" />
          +12.4%
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1 flex flex-col justify-end">
        {/* Graph Area */}
        <div className="relative w-full h-32 flex items-end justify-between px-2 group">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-t border-dashed border-border w-full" />
            <div className="border-t border-dashed border-border w-full" />
            <div className="border-t border-dashed border-border w-full" />
            <div className="border-t border-dashed border-border w-full" />
          </div>

          {/* Bar loops */}
          {bars.map((bar, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 w-8 relative group/bar z-10">
              {/* Tooltip on hover */}
              <div className="absolute -top-8 bg-foreground text-background text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                {bar.amount}
              </div>

              {/* Bar filled shape */}
              <div className={`w-full rounded-t-md transition-all duration-300 ${bar.val} ${
                bar.highlighted 
                  ? "bg-primary shadow-sm" 
                  : "bg-primary/30 hover:bg-primary/50"
              }`} />

              {/* Label */}
              <span className="text-[9px] font-bold text-muted-foreground font-sans">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
