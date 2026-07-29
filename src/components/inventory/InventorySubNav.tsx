"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Layers,
  Building2,
  SlidersHorizontal,
  ArrowRightLeft,
} from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";

interface InventorySubNavProps {
  className?: string;
}

export function InventorySubNav({ className }: InventorySubNavProps) {
  const pathname = usePathname();
  const { isBangla } = useAppTranslation();

  const NAV_ITEMS = [
    {
      href: "/inventory",
      exact: true,
      labelEn: "Products",
      labelBn: "পণ্যসমূহ",
      icon: Package,
    },
    {
      href: "/inventory/batches",
      labelEn: "Batches",
      labelBn: "ব্যাচসমূহ",
      icon: Layers,
    },
    {
      href: "/inventory/warehouse",
      labelEn: "Warehouse",
      labelBn: "ওয়্যারহাউস",
      icon: Building2,
    },
    {
      href: "/inventory/stock-adjustment",
      labelEn: "Stock Adjustment",
      labelBn: "স্টক সংশোধন",
      icon: SlidersHorizontal,
    },
    {
      href: "/inventory/stock-transfer",
      labelEn: "Stock Transfer",
      labelBn: "স্টক ট্রান্সফার",
      icon: ArrowRightLeft,
    },
  ];

  return (
    <div className={cn("w-full border-b border-border/80 bg-card/60 backdrop-blur-xs mb-4", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all select-none border cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                    : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{isBangla ? item.labelBn : item.labelEn}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
