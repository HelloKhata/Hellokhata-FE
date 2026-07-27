"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AmountInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  autoFocus?: boolean;
  isBangla?: boolean;
}

export function AmountInput({
  value,
  onChange,
  error,
  autoFocus = true,
  isBangla = false,
}: AmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
        {isBangla ? "টাকার পরিমাণ (Amount) *" : "Amount *"}
      </label>

      <div
        className={cn(
          "relative flex items-center rounded-2xl border bg-card px-4 py-3 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-primary/20",
          error ? "border-destructive ring-1 ring-destructive/30" : "border-border focus-within:border-primary"
        )}
      >
        <span className="text-2xl sm:text-3xl font-bold text-muted-foreground mr-3 font-mono shrink-0 select-none">
          ৳
        </span>

        <input
          ref={inputRef}
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-2xl sm:text-3xl font-bold font-mono text-foreground placeholder:text-muted-foreground/40 outline-none border-none p-0"
        />
      </div>

      {error && (
        <p className="text-[11px] text-destructive font-medium pl-1">{error}</p>
      )}
    </div>
  );
}
