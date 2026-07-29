"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { cn } from "@/lib/utils";

export type BatchSourceType = "purchase" | "return" | "adjustment" | "legacy" | "legacy_merge";

interface BatchSourceBadgeProps {
  source?: BatchSourceType | string;
  className?: string;
}

export function BatchSourceBadge({ source = "purchase", className }: BatchSourceBadgeProps) {
  const { isBangla } = useAppTranslation();

  const sourceConfig: Record<string, { en: string; bn: string; cls: string }> = {
    purchase: {
      en: "Purchase",
      bn: "ক্রয়",
      cls: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    },
    return: {
      en: "Return",
      bn: "ফেরত",
      cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    },
    adjustment: {
      en: "Adjustment",
      bn: "সংশোধন",
      cls: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    },
    legacy: {
      en: "Legacy",
      bn: "পুরাতন",
      cls: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    },
    legacy_merge: {
      en: "Merged",
      bn: "একত্রিত",
      cls: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    },
  };

  const config = sourceConfig[source] || sourceConfig.purchase;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-semibold py-0.5 px-2 border w-max",
        config.cls,
        className
      )}
    >
      {isBangla ? config.bn : config.en}
    </Badge>
  );
}
