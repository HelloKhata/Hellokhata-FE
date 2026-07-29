"use client";

import React, { memo } from "react";
import { Employee } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/hooks/useAppTranslation";
import {
  MoreVertical,
  Eye,
  Pencil,
  UserX,
  KeyRound,
  CalendarCheck,
  Receipt,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeRowProps {
  employee: Employee;
  onViewProfile: (emp: Employee) => void;
  onEdit: (emp: Employee) => void;
  onDeactivate: (emp: Employee) => void;
  onResetPassword: (emp: Employee) => void;
  onViewAttendance: (emp: Employee) => void;
  onViewPayroll: (emp: Employee) => void;
  isBangla?: boolean;
}

export const EmployeeRow = memo(function EmployeeRow({
  employee,
  onViewProfile,
  onEdit,
  onDeactivate,
  onResetPassword,
  onViewAttendance,
  onViewPayroll,
  isBangla = false,
}: EmployeeRowProps) {
  const { formatCurrency } = useCurrency();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <tr
      className={cn(
        "hover:bg-muted/20 transition-colors border-b border-border/50 text-xs",
        employee.status === "inactive" && "opacity-60 bg-muted/10"
      )}
    >
      {/* Avatar & Employee Name */}
      <td className="px-3 py-3 align-middle">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-xl border border-border/60 shrink-0">
            <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs rounded-xl">
              {getInitials(employee.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-0.5">
            <button
              type="button"
              onClick={() => onViewProfile(employee)}
              className="font-bold text-foreground text-xs hover:text-primary transition-colors text-left truncate block cursor-pointer"
            >
              {employee.fullName}
            </button>
            <span className="font-mono text-[10px] text-muted-foreground block">
              {employee.email}
            </span>
          </div>
        </div>
      </td>

      {/* Employee ID */}
      <td className="px-3 py-3 align-middle font-mono text-xs font-bold text-foreground">
        <span className="bg-muted/40 px-2 py-0.5 rounded border border-border/50">
          {employee.id}
        </span>
      </td>

      {/* Role Badge */}
      <td className="px-3 py-3 align-middle">
        <Badge variant="outline" className="text-[10px] font-semibold bg-background border-border/80">
          {employee.role}
        </Badge>
      </td>

      {/* Branch Badge */}
      <td className="px-3 py-3 align-middle">
        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
          <Building2 className="h-3 w-3 text-primary/70 shrink-0" />
          <span>{employee.branchName}</span>
        </span>
      </td>

      {/* Phone */}
      <td className="px-3 py-3 align-middle font-mono text-[11px] text-muted-foreground">
        {employee.phone}
      </td>

      {/* Salary */}
      <td className="px-3 py-3 align-middle font-mono font-bold text-foreground">
        {formatCurrency(employee.salaryStructure.netSalary)}
      </td>

      {/* Joining Date */}
      <td className="px-3 py-3 align-middle font-mono text-[11px] text-muted-foreground">
        {employee.joiningDate}
      </td>

      {/* Status Badge */}
      <td className="px-3 py-3 align-middle">
        {employee.status === "active" ? (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
            Active
          </Badge>
        ) : employee.status === "on_leave" ? (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">
            On Leave
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px] font-bold">
            Inactive
          </Badge>
        )}
      </td>

      {/* Three-Dot Actions Dropdown */}
      <td className="px-3 py-3 align-middle text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 text-xs">
            <DropdownMenuItem onClick={() => onViewProfile(employee)} className="cursor-pointer gap-2">
              <Eye className="h-3.5 w-3.5 text-primary" />
              <span>View Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit(employee)} className="cursor-pointer gap-2">
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Edit Details</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onViewAttendance(employee)} className="cursor-pointer gap-2">
              <CalendarCheck className="h-3.5 w-3.5 text-blue-500" />
              <span>View Attendance</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onViewPayroll(employee)} className="cursor-pointer gap-2">
              <Receipt className="h-3.5 w-3.5 text-emerald-500" />
              <span>View Payroll</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onResetPassword(employee)} className="cursor-pointer gap-2">
              <KeyRound className="h-3.5 w-3.5 text-amber-500" />
              <span>Reset Password</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Soft Deactivation Action (NO DELETE) */}
            <DropdownMenuItem
              onClick={() => onDeactivate(employee)}
              className="cursor-pointer gap-2 text-rose-600 font-semibold focus:text-rose-600"
            >
              <UserX className="h-3.5 w-3.5" />
              <span>{employee.status === "active" ? "Deactivate Employee" : "Activate Employee"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
});
