import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl bg-muted/10">
      {Icon && (
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
        {description}
      </p>
      {actionText && onAction && (
        <Button
          size="sm"
          variant="outline"
          onClick={onAction}
          className="mt-4 h-8 text-xs border-input font-medium cursor-pointer"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
