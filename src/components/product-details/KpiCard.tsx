import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    type: "up" | "down";
  };
  description?: string;
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
}: KpiCardProps) {
  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden transition-all hover:bg-muted/10">
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center border border-border/30 shrink-0">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-2xl font-extrabold text-foreground tracking-tight">
            {value}
          </p>
          
          <div className="flex flex-wrap items-center gap-1.5">
            {trend && (
              <span className={`text-[10px] font-bold py-0.5 px-1.5 border rounded-md flex items-center gap-0.5 ${
                trend.type === "up"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-600"
              }`}>
                {trend.type === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {trend.value}
              </span>
            )}
            {description && (
              <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">
                {description}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
