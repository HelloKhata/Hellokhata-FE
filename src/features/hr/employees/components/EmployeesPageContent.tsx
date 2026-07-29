"use client";

import React, { useState, useMemo } from "react";
import { Employee, EmployeeFilterState } from "../types";
import { MOCK_EMPLOYEES } from "../constants";
import { EmployeeKPICards } from "./EmployeeKPICards";
import { EmployeeFiltersBar } from "./EmployeeFiltersBar";
import { EmployeeDataTable } from "./EmployeeDataTable";
import { AddEmployeeWizard } from "./AddEmployeeWizard";
import { DeactivateConfirmDialog } from "./DeactivateConfirmDialog";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Download, Upload, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function EmployeesPageContent() {
  const { isBangla } = useAppTranslation();
  const router = useRouter();

  // Employee State
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);

  // Filters State
  const [filters, setFilters] = useState<EmployeeFilterState>({
    searchQuery: "",
    selectedBranch: "Main Branch",
    selectedRole: "all",
    selectedStatus: "all",
    salaryRange: "all",
  });

  // Modals State
  const [isAddWizardOpen, setIsAddWizardOpen] = useState(false);
  const [deactivatingEmployee, setDeactivatingEmployee] = useState<Employee | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered Employees calculation
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Branch Filter
      if (filters.selectedBranch !== "All Branches" && filters.selectedBranch !== "all") {
        if (emp.branchName !== filters.selectedBranch) return false;
      }

      // Role Filter
      if (filters.selectedRole !== "all" && emp.role !== filters.selectedRole) {
        return false;
      }

      // Status Filter
      if (filters.selectedStatus !== "all" && emp.status !== filters.selectedStatus) {
        return false;
      }

      // Salary Range Filter
      if (filters.salaryRange === "0-20k" && emp.salaryStructure.netSalary >= 20000) return false;
      if (filters.salaryRange === "20k-50k" && (emp.salaryStructure.netSalary < 20000 || emp.salaryStructure.netSalary > 50000)) return false;
      if (filters.salaryRange === "50k+" && emp.salaryStructure.netSalary <= 50000) return false;

      // Global Search Input
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = emp.fullName.toLowerCase().includes(q);
        const matchPhone = emp.phone.includes(q);
        const matchId = emp.id.toLowerCase().includes(q);
        const matchRole = emp.role.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchId && !matchRole) return false;
      }

      return true;
    });
  }, [employees, filters]);

  // KPI Metrics Calculation
  const { totalCount, activeCount, inactiveCount, newCount, totalBranches } = useMemo(() => {
    const tot = employees.length;
    const act = employees.filter((e) => e.status === "active").length;
    const inact = employees.filter((e) => e.status === "inactive").length;
    const branches = new Set(employees.map((e) => e.branchName)).size;
    return {
      totalCount: tot,
      activeCount: act,
      inactiveCount: inact,
      newCount: 2,
      totalBranches: branches,
    };
  }, [employees]);

  // Handlers
  const handleEmployeeCreated = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
  };

  const handleDeactivateConfirm = (emp: Employee) => {
    setEmployees((prev) =>
      prev.map((item) =>
        item.id === emp.id
          ? { ...item, status: item.status === "active" ? "inactive" : "active" }
          : item
      )
    );
    toast.success(
      isBangla
        ? `কর্মী ${emp.fullName}-এর স্ট্যাটাস পরিবর্তন করা হয়েছে`
        : `Employee ${emp.fullName} status updated`
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isBangla ? "কর্মীবৃন্দ তালিকা রিফ্রেশ করা হয়েছে" : "Employee roster refreshed");
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <span>{isBangla ? "কর্মীবৃন্দ (Employees)" : "Employees"}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isBangla
              ? "কর্মীদের তথ্য, রোল, বেতন কাঠামো ও শাখা নির্ধারণ পরিচালনা করুন।"
              : "Manage employee information, roles, salary structures, and branch assignments."}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            type="button"
            onClick={() => setIsAddWizardOpen(true)}
            className="h-9 px-3.5 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
          >
            <UserPlus className="h-4 w-4" />
            <span>{isBangla ? "কর্মী যোগ করুন" : "Add Employee"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => toast.info("Exporting employee list...")}
            className="h-9 px-3 text-xs font-semibold gap-1.5 border-input text-foreground hover:bg-muted cursor-pointer bg-background/50"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            <span>{isBangla ? "এক্সপোর্ট" : "Export"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => toast.info("Import employee CSV...")}
            className="h-9 px-3 text-xs font-semibold gap-1.5 border-input text-foreground hover:bg-muted cursor-pointer bg-background/50"
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span>{isBangla ? "ইমপোর্ট" : "Import"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 w-9 bg-background/50 border-input text-muted-foreground hover:text-foreground cursor-pointer"
            title="Refresh Roster"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <EmployeeKPICards
        totalEmployees={totalCount}
        activeEmployees={activeCount}
        inactiveEmployees={inactiveCount}
        newThisMonth={newCount}
        totalBranches={totalBranches}
        isBangla={isBangla}
      />

      {/* Search Toolbar & Filters */}
      <EmployeeFiltersBar
        filters={filters}
        onFilterChange={(upd) => setFilters((prev) => ({ ...prev, ...upd }))}
        onResetFilters={() =>
          setFilters({
            searchQuery: "",
            selectedBranch: "Main Branch",
            selectedRole: "all",
            selectedStatus: "all",
            salaryRange: "all",
          })
        }
        isBangla={isBangla}
      />

      {/* Employee Data Table */}
      <EmployeeDataTable
        employees={filteredEmployees}
        onAddEmployee={() => setIsAddWizardOpen(true)}
        onViewProfile={(emp) => router.push(`/hrm/employees/${emp.id}`)}
        onEdit={(emp) => toast.info(`Editing ${emp.fullName}`)}
        onDeactivate={(emp) => setDeactivatingEmployee(emp)}
        onResetPassword={(emp) => toast.success(`Password reset link sent to ${emp.email}`)}
        onViewAttendance={(emp) => router.push(`/hrm/employees/${emp.id}?tab=attendance`)}
        onViewPayroll={(emp) => router.push(`/hrm/employees/${emp.id}?tab=payslips`)}
        isBangla={isBangla}
      />

      {/* Add Employee Multi-Step Wizard */}
      <AddEmployeeWizard
        isOpen={isAddWizardOpen}
        onClose={() => setIsAddWizardOpen(false)}
        onEmployeeCreated={handleEmployeeCreated}
        isBangla={isBangla}
      />

      {/* Deactivate Safety Confirm Dialog */}
      <DeactivateConfirmDialog
        employee={deactivatingEmployee}
        isOpen={!!deactivatingEmployee}
        onClose={() => setDeactivatingEmployee(null)}
        onConfirm={handleDeactivateConfirm}
        isBangla={isBangla}
      />
    </div>
  );
}
