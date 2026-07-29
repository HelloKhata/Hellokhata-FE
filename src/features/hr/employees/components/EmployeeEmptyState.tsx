"use client";

import React from "react";
import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeEmptyStateProps {
  onAddEmployee: () => void;
  isBangla?: boolean;
}

export function EmployeeEmptyState({
  onAddEmployee,
  isBangla = false,
}: EmployeeEmptyStateProps) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-2xs my-4 flex flex-col items-center justify-center">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
        <Users className="h-8 w-8" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-bold text-foreground">
          {isBangla ? "কোনো কর্মী পাওয়া যায়নি" : "No employees yet"}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isBangla
            ? "উপস্থিতি ও পে-রোল ট্র্যাক করতে আপনার প্রথম কর্মী যোগ করুন।"
            : "Create your first employee to start tracking attendance, leaves, payroll, and branch roles."}
        </p>
      </div>

      <Button
        type="button"
        onClick={onAddEmployee}
        className="h-9 px-4 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs rounded-lg"
      >
        <UserPlus className="h-4 w-4" />
        <span>{isBangla ? "কর্মী যোগ করুন" : "Add Employee"}</span>
      </Button>
    </div>
  );
}
