"use client";

import React from "react";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeaveEmptyStateProps {
  onRequestLeave: () => void;
  isManager?: boolean;
  isBangla?: boolean;
}

export function LeaveEmptyState({
  onRequestLeave,
  isManager = false,
  isBangla = false,
}: LeaveEmptyStateProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-2xs my-4 flex flex-col items-center justify-center">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
        <Calendar className="h-8 w-8" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-bold text-foreground">
          {isManager ? "No pending leave requests." : "No leave requests yet."}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isManager
            ? "All employee leave applications for this branch have been reviewed."
            : "Apply for casual, sick, or festival leave when needed."}
        </p>
      </div>

      {!isManager && (
        <Button
          type="button"
          onClick={onRequestLeave}
          className="h-9 px-4 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs rounded-lg"
        >
          <Plus className="h-4 w-4" />
          <span>{isBangla ? "নতুন ছুটি আবেদন করুন" : "Request Leave"}</span>
        </Button>
      )}
    </div>
  );
}
