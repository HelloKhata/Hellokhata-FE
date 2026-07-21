import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function SalesChartPlaceholder() {
  const points = [
    { label: "Mon", top: "top-[70%]", sales: "14 units" },
    { label: "Tue", top: "top-[55%]", sales: "22 units" },
    { label: "Wed", top: "top-[60%]", sales: "19 units" },
    { label: "Thu", top: "top-[40%]", sales: "31 units" },
    { label: "Fri", top: "top-[15%]", sales: "52 units", highlighted: true },
    { label: "Sat", top: "top-[30%]", sales: "38 units" },
    { label: "Sun", top: "top-[80%]", sales: "8 units" },
  ];

  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col h-[280px]">
      <CardHeader className="p-5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Daily Transaction Count
          </span>
          <CardTitle className="text-sm font-bold text-foreground">
            Sales Frequency
          </CardTitle>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-2 py-0.5 border border-primary/20 rounded-md font-semibold">
          <TrendingUp className="h-3.5 w-3.5" />
          High Rate
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1 flex flex-col justify-end">
        {/* Graph Area simulating a line graph */}
        <div className="relative w-full h-32 flex items-end justify-between px-4">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-t border-dashed border-border w-full" />
            <div className="border-t border-dashed border-border w-full" />
            <div className="border-t border-dashed border-border w-full" />
            <div className="border-t border-dashed border-border w-full" />
          </div>

          {/* Simulated Line Segment SVG Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
            <path
              d="M 20 90 L 80 70 L 140 78 L 200 50 L 260 20 L 320 38 L 380 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
          </svg>

          {/* Dot loops */}
          {points.map((pt, idx) => (
            <div key={idx} className="flex flex-col items-center justify-end h-full w-8 relative group/pt z-10 pb-4">
              {/* Tooltip on hover */}
              <div className="absolute -top-4 bg-foreground text-background text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover/pt:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                {pt.sales}
              </div>

              {/* Point Node on path */}
              <div className={`absolute ${pt.top} left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 transition-transform group-hover/pt:scale-125 cursor-pointer shadow-sm ${
                pt.highlighted
                  ? "bg-primary border-background scale-110"
                  : "bg-background border-primary hover:bg-primary/15"
              }`} />

              {/* Label */}
              <span className="text-[9px] font-bold text-muted-foreground font-sans">
                {pt.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
