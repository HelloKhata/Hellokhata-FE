"use client";

import React, { useState } from "react";
import { Employee } from "../types";
import { EmployeeRow } from "./EmployeeRow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Building2, Eye, MoreVertical } from "lucide-react";
import { useCurrency } from "@/hooks/useAppTranslation";
import { EmployeeEmptyState } from "./EmployeeEmptyState";

interface EmployeeDataTableProps {
  employees: Employee[];
  onAddEmployee: () => void;
  onViewProfile: (emp: Employee) => void;
  onEdit: (emp: Employee) => void;
  onDeactivate: (emp: Employee) => void;
  onResetPassword: (emp: Employee) => void;
  onViewAttendance: (emp: Employee) => void;
  onViewPayroll: (emp: Employee) => void;
  isBangla?: boolean;
}

export function EmployeeDataTable({
  employees,
  onAddEmployee,
  onViewProfile,
  onEdit,
  onDeactivate,
  onResetPassword,
  onViewAttendance,
  onViewPayroll,
  isBangla = false,
}: EmployeeDataTableProps) {
  const { formatCurrency } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.max(1, Math.ceil(employees.length / pageSize));
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (employees.length === 0) {
    return <EmployeeEmptyState onAddEmployee={onAddEmployee} isBangla={isBangla} />;
  }

  return (
    <div className="space-y-3">
      {/* Desktop Responsive DataTable Container */}
      <div className="hidden md:block bg-card border border-border/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground border-b border-border/80 font-semibold text-[11px] uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
                <th className="px-3 py-3">Employee Name</th>
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Branch</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Net Salary</th>
                <th className="px-3 py-3">Joining Date</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-card">
              {paginatedEmployees.map((emp) => (
                <EmployeeRow
                  key={emp.id}
                  employee={emp}
                  onViewProfile={onViewProfile}
                  onEdit={onEdit}
                  onDeactivate={onDeactivate}
                  onResetPassword={onResetPassword}
                  onViewAttendance={onViewAttendance}
                  onViewPayroll={onViewPayroll}
                  isBangla={isBangla}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View (No horizontal scrolling on small screens) */}
      <div className="md:hidden space-y-3">
        {paginatedEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-card border border-border/80 rounded-xl p-3.5 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-9 w-9 rounded-xl border">
                  <AvatarImage src={emp.avatarUrl} alt={emp.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {emp.fullName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-foreground text-xs">{emp.fullName}</h4>
                  <span className="font-mono text-[10px] text-muted-foreground">{emp.id}</span>
                </div>
              </div>

              {emp.status === "active" ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]">
                  Inactive
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-background/50 p-2 rounded-lg border border-border/50">
              <div>
                <span className="text-muted-foreground block text-[10px]">Role</span>
                <strong className="text-foreground">{emp.role}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Branch</span>
                <strong className="text-foreground">{emp.branchName}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Phone</span>
                <strong className="text-foreground font-mono">{emp.phone}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Net Salary</span>
                <strong className="text-emerald-600 font-mono font-bold">
                  {formatCurrency(emp.salaryStructure.netSalary)}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(emp)}
                className="flex-1 h-8 text-xs font-semibold gap-1 bg-background/50 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-primary" />
                <span>View Profile</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
        <span>
          Showing {Math.min(employees.length, (currentPage - 1) * pageSize + 1)} to{" "}
          {Math.min(employees.length, currentPage * pageSize)} of {employees.length} employees
        </span>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-8 w-8 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="px-2 font-mono font-semibold text-foreground">
            {currentPage} / {totalPages}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 w-8 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
