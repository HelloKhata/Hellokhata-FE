import React from 'react';
import { cn } from '@/lib/utils';

interface ActionToggleProps {
  label: string;
  isOn: boolean;
  onToggle: (state: boolean) => void;
  disabled?: boolean;
}

export function ActionToggle({ label, isOn, onToggle, disabled }: ActionToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(!isOn)}
      className={cn(
        "text-[11.5px] font-semibold px-3 py-1 rounded-full border transition-all duration-150 select-none",
        isOn
          ? "bg-primary border-primary text-primary-foreground shadow-sm"
          : "bg-transparent border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground",
        disabled && "opacity-50 cursor-not-allowed hover:border-border hover:text-muted-foreground"
      )}
    >
      {label}
    </button>
  );
}
