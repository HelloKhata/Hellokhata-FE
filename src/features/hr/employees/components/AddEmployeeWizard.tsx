"use client";

import React, { useState } from "react";
import { Employee, SalaryComponent } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Briefcase,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Loader2,
  Building2,
} from "lucide-react";
import { font_ROLES } from "../constants";
import { BranchSelector } from "@/components/finance/deposits-withdrawals/BranchSelector";
import { useCurrency } from "@/hooks/useAppTranslation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddEmployeeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeCreated: (newEmp: Employee) => void;
  isBangla?: boolean;
}

export function AddEmployeeWizard({
  isOpen,
  onClose,
  onEmployeeCreated,
  isBangla = false,
}: AddEmployeeWizardProps) {
  const { formatCurrency } = useCurrency();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/avatars/default.png");

  const [employeeId, setEmployeeId] = useState(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [branchName, setBranchName] = useState("Main Branch");
  const [role, setRole] = useState<any>("Sales Associate");
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split("T")[0]);

  const [basicSalary, setBasicSalary] = useState<number>(25000);
  const [allowances, setAllowances] = useState<SalaryComponent[]>([
    { id: "al-1", name: "House Rent", amount: 5000, type: "allowance" },
  ]);
  const [deductions, setDeductions] = useState<SalaryComponent[]>([
    { id: "de-1", name: "Provident Fund", amount: 1000, type: "deduction" },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Allowances/Deductions handlers
  const addAllowanceRow = () => {
    setAllowances((prev) => [
      ...prev,
      { id: `al-${Date.now()}`, name: "Allowance", amount: 1000, type: "allowance" },
    ]);
  };

  const removeAllowanceRow = (id: string) => {
    setAllowances((prev) => prev.filter((a) => a.id !== id));
  };

  const addDeductionRow = () => {
    setDeductions((prev) => [
      ...prev,
      { id: `de-${Date.now()}`, name: "Deduction", amount: 500, type: "deduction" },
    ]);
  };

  const removeDeductionRow = (id: string) => {
    setDeductions((prev) => prev.filter((d) => d.id !== id));
  };

  // Salary Calculations
  const totalAllowances = allowances.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
  const totalDeductions = deductions.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const grossSalary = basicSalary + totalAllowances;
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  // Stepper Validations
  const handleNext = () => {
    if (currentStep === 1) {
      if (!fullName.trim() || !phone.trim()) {
        setErrors({ fullName: !fullName ? "Name is required" : "", phone: !phone ? "Phone is required" : "" });
        return;
      }
    }
    setErrors({});
    if (currentStep < 4) setCurrentStep((s) => (s + 1) as any);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((s) => (s - 1) as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created: Employee = {
        id: employeeId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || `${employeeId.toLowerCase()}@hellokhata.com`,
        nid: nid.trim() || undefined,
        avatarUrl: avatarUrl,
        role: role,
        branchId: "b-main",
        branchName: branchName,
        joiningDate: joiningDate,
        status: "active",
        salaryStructure: {
          basicSalary,
          allowances,
          deductions,
          grossSalary,
          netSalary,
        },
        attendanceHistory: [],
        leaveHistory: [],
        payslipHistory: [],
        activityLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
            title: "Employee Onboarded",
            description: "Profile created via Employee Wizard",
            performedBy: "HR Admin",
          },
        ],
        createdAt: new Date(),
      };

      setIsSubmitting(false);
      onEmployeeCreated(created);
      onClose();
      toast.success(
        isBangla
          ? `কর্মী ${created.fullName} সফলভাবে সিস্টেমে যুক্ত হয়েছে`
          : `Employee ${created.fullName} onboarded successfully`
      );
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-5 bg-card">
        <DialogHeader className="space-y-1 border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>{isBangla ? "নতুন কর্মী যুক্ত করুন (Add Employee Wizard)" : "Add Employee Wizard"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Multi-step employee creation wizard for Attendance, Leave, Payroll, and Role Assignment.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Stepper Indicator */}
        <div className="grid grid-cols-4 gap-2 pt-1 pb-3 text-[11px] font-semibold border-b border-border/60">
          <div
            className={cn(
              "flex items-center gap-1.5 pb-1 border-b-2 transition-all",
              currentStep >= 1 ? "border-primary text-primary" : "border-muted text-muted-foreground"
            )}
          >
            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">1</span>
            <span className="hidden sm:inline">General</span>
          </div>

          <div
            className={cn(
              "flex items-center gap-1.5 pb-1 border-b-2 transition-all",
              currentStep >= 2 ? "border-primary text-primary" : "border-muted text-muted-foreground"
            )}
          >
            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">2</span>
            <span className="hidden sm:inline">Employment</span>
          </div>

          <div
            className={cn(
              "flex items-center gap-1.5 pb-1 border-b-2 transition-all",
              currentStep >= 3 ? "border-primary text-primary" : "border-muted text-muted-foreground"
            )}
          >
            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">3</span>
            <span className="hidden sm:inline">Salary</span>
          </div>

          <div
            className={cn(
              "flex items-center gap-1.5 pb-1 border-b-2 transition-all",
              currentStep === 4 ? "border-primary text-primary" : "border-muted text-muted-foreground"
            )}
          >
            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">4</span>
            <span className="hidden sm:inline">Review</span>
          </div>
        </div>

        {/* Form Body Steps */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-2">
          {/* STEP 1: General Information */}
          {currentStep === 1 && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Full Name *</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kazi Shohel"
                  className={cn("h-9 bg-background/50 text-xs border-input", errors.fullName && "border-destructive")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Phone Number *</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01711223344"
                    className="h-9 bg-background/50 text-xs border-input font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Email Address</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shohel@hellokhata.com"
                    className="h-9 bg-background/50 text-xs border-input font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">National ID (NID)</Label>
                <Input
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  placeholder="e.g. 1992288331199"
                  className="h-9 bg-background/50 text-xs border-input font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Employment */}
          {currentStep === 2 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Employee ID *</Label>
                  <Input
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="EMP-1001"
                    className="h-9 bg-background/50 text-xs border-input font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Joining Date *</Label>
                  <Input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="h-9 bg-background/50 text-xs border-input font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <BranchSelector
                    value={branchName}
                    onChange={setBranchName}
                    isBangla={isBangla}
                    compact
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Employee Role *</Label>
                  <Select value={role} onValueChange={(val: any) => setRole(val)}>
                    <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {font_ROLES.map((r) => (
                        <SelectItem key={r} value={r} className="text-xs">
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Salary Structure */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Basic Monthly Salary (৳) *</Label>
                <Input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)}
                  className="h-9 bg-background/50 text-xs border-input font-mono font-bold text-lg"
                />
              </div>

              {/* Dynamic Allowances */}
              <div className="space-y-2 border-t border-border/60 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-emerald-600">Allowances (+)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAllowanceRow}
                    className="h-7 text-[10px] gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Allowance
                  </Button>
                </div>

                {allowances.map((al, idx) => (
                  <div key={al.id} className="flex items-center gap-2">
                    <Input
                      value={al.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAllowances((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                        );
                      }}
                      placeholder="Name (e.g. House Rent)"
                      className="h-8 bg-background/50 text-xs border-input flex-1"
                    />
                    <Input
                      type="number"
                      value={al.amount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setAllowances((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, amount: val } : item))
                        );
                      }}
                      placeholder="Amount"
                      className="h-8 bg-background/50 text-xs border-input w-28 font-mono font-bold"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAllowanceRow(al.id)}
                      className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Dynamic Deductions */}
              <div className="space-y-2 border-t border-border/60 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-rose-600">Deductions (-)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDeductionRow}
                    className="h-7 text-[10px] gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Deduction
                  </Button>
                </div>

                {deductions.map((de, idx) => (
                  <div key={de.id} className="flex items-center gap-2">
                    <Input
                      value={de.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDeductions((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                        );
                      }}
                      placeholder="Name (e.g. PF)"
                      className="h-8 bg-background/50 text-xs border-input flex-1"
                    />
                    <Input
                      type="number"
                      value={de.amount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setDeductions((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, amount: val } : item))
                        );
                      }}
                      placeholder="Amount"
                      className="h-8 bg-background/50 text-xs border-input w-28 font-mono font-bold"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDeductionRow(de.id)}
                      className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Calculated Total Box */}
              <div className="p-3 bg-muted/30 border border-border/70 rounded-xl flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase">Calculated Net Salary</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(netSalary)}
                  </span>
                </div>
                <div className="text-right text-[11px] text-muted-foreground">
                  <span>Gross: {formatCurrency(grossSalary)}</span>
                  <span className="block">Deductions: -{formatCurrency(totalDeductions)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-3.5">
              <div className="p-4 bg-background/50 border border-border/80 rounded-xl space-y-3">
                <h4 className="font-bold text-foreground text-xs border-b border-border/60 pb-2">
                  Employee Onboarding Summary
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Name</span>
                    <strong className="text-foreground">{fullName}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Employee ID</span>
                    <strong className="text-foreground font-mono">{employeeId}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Role</span>
                    <strong className="text-foreground">{role}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Branch</span>
                    <strong className="text-foreground">{branchName}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Joining Date</span>
                    <strong className="text-foreground font-mono">{joiningDate}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Net Monthly Salary</span>
                    <strong className="text-emerald-600 font-mono font-bold">
                      {formatCurrency(netSalary)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
              className="h-9 text-xs px-3 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1 cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Onboarding...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Submit & Create Employee</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
