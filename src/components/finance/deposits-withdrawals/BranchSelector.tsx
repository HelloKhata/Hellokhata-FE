"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBranchStore } from "@/stores/branchStore";

interface BranchSelectorProps {
  value: string;
  onChange: (val: string) => void;
  isBangla?: boolean;
  error?: string;
  label?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export function BranchSelector({
  value,
  onChange,
  isBangla = false,
  error,
  label,
  showIcon = false,
  compact = false,
}: BranchSelectorProps) {
  const { branches } = useBranchStore();

  const defaultBranches = branches.length > 0 ? branches : [
    { id: "b-main", name: "Main Branch" },
    { id: "b-mirpur", name: "Mirpur Branch" },
    { id: "b-gulshan", name: "Gulshan Branch" },
  ];

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <Label className="text-xs font-semibold text-foreground">
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "bg-background/50 border-input w-full transition-colors text-xs",
            compact ? "h-9 px-2.5 text-[11px]" : "h-10 px-3",
            error && "border-destructive ring-1 ring-destructive/30"
          )}
        >
          <div className="flex items-center gap-1.5 truncate">
            {showIcon && <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
            <SelectValue placeholder={isBangla ? "শাখা নির্বাচন করুন" : "Select Branch"} />
          </div>
        </SelectTrigger>
        <SelectContent align="start">
          {defaultBranches.map((b) => (
            <SelectItem key={b.id} value={b.name} className="text-xs cursor-pointer">
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-[10px] text-destructive font-medium pl-0.5">{error}</p>}
    </div>
  );
}
