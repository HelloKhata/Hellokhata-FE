"use client";

import React, { useState, useEffect } from "react";
import { MoneyFlowPoint } from "@/types/finance";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface MoneyFlowChartProps {
  data: MoneyFlowPoint[];
  isBangla?: boolean;
}

export function MoneyFlowChart({ data, isBangla = false }: MoneyFlowChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {isBangla ? "ক্যাশ প্রবাহ (Money In vs Money Out)" : "Money In vs Money Out"}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isBangla
              ? "চলতি সপ্তাহের দৈনন্দিন আয় ও ব্যয়ের গ্রাফিক্যাল তুলনা"
              : "Daily comparison of income vs operational expenditure"}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">{isBangla ? "আয় (In)" : "Money In"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="text-muted-foreground">{isBangla ? "ব্যয় (Out)" : "Money Out"}</span>
          </div>
        </div>
      </div>

      <div className="h-56 w-full pt-2">
        {!mounted ? (
          <div className="h-full w-full bg-muted/20 animate-pulse rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={4}
              barCategoryGap="25%"
            >
              <XAxis
                dataKey="dayLabel"
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `৳${value / 1000}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-border bg-popover/95 backdrop-blur-md p-3 shadow-lg text-xs space-y-1.5">
                        <p className="font-semibold text-popover-foreground">{label}</p>
                        <p className="text-emerald-600 font-mono font-medium">
                          {isBangla ? "আয়: " : "Money In: "}৳
                          {(payload[0].value as number).toLocaleString()}
                        </p>
                        <p className="text-rose-600 font-mono font-medium">
                          {isBangla ? "ব্যয়: " : "Money Out: "}৳
                          {(payload[1].value as number).toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="moneyIn"
                name="Money In"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="moneyOut"
                name="Money Out"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
