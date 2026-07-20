import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function MarginChartPlaceholder() {
  const branches = [
    { name: "Dhaka Banani", margin: 20.4, profit: "৳89,200", color: "bg-primary" },
    { name: "Chittagong GEC", margin: 18.2, profit: "৳58,100", color: "bg-emerald-500" },
    { name: "Sylhet Zindabazar", margin: 19.5, profit: "৳62,400", color: "bg-indigo-500" },
    { name: "Dhaka Uttara", margin: 16.8, profit: "৳28,900", color: "bg-amber-500" },
  ];

  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col h-[280px]">
      <CardHeader className="p-5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Branch Net Returns
          </span>
          <CardTitle className="text-sm font-bold text-foreground">
            Profit Margin Breakdown
          </CardTitle>
        </div>
        <Badge variant="outline" className="text-[10px] font-bold text-foreground bg-muted border border-border/40 py-0.5 px-2">
          Avg: 19.1%
        </Badge>
      </CardHeader>

      <CardContent className="p-6 flex-1 flex flex-col justify-center space-y-4">
        {branches.map((branch, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-foreground truncate max-w-[150px]">{branch.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-[10px]">{branch.profit} Profit</span>
                <span className="text-foreground font-mono font-bold text-[10px]">{branch.margin}%</span>
              </div>
            </div>
            {/* Custom styled progress bars */}
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${branch.color}`}
                style={{ width: `${branch.margin * 4}%` }} // Adjusted multiplier to visually scale bars
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
