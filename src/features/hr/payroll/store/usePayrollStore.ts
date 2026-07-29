import { create } from "zustand";
import { Payslip } from "../types";

export type PayrollTab = "runs" | "structures" | "payslips" | "payments" | "bonuses";

interface PayrollState {
  activeTab: PayrollTab;
  setActiveTab: (tab: PayrollTab) => void;

  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;

  selectedPayPeriod: string;
  setSelectedPayPeriod: (period: string) => void;

  inspectingPayslip: Payslip | null;
  setInspectingPayslip: (payslip: Payslip | null) => void;

  isRunWizardOpen: boolean;
  setIsRunWizardOpen: (open: boolean) => void;
}

export const usePayrollStore = create<PayrollState>((set) => ({
  activeTab: "runs",
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedBranch: "Main Branch",
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),

  selectedPayPeriod: "July 2026",
  setSelectedPayPeriod: (period) => set({ selectedPayPeriod: period }),

  inspectingPayslip: null,
  setInspectingPayslip: (payslip) => set({ inspectingPayslip: payslip }),

  isRunWizardOpen: false,
  setIsRunWizardOpen: (open) => set({ isRunWizardOpen: open }),
}));
