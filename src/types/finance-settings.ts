import { z } from "zod";

export type AccountCategory = "assets" | "liabilities" | "equity" | "income" | "expenses";

export interface COAAccount {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  accountType: string;
  parentAccountId?: string;
  openingBalance: number;
  currentBalance: number;
  description?: string;
  branchName?: string;
  status: "active" | "disabled";
  hasTransactions: boolean; // if true, delete button is disabled
  children?: COAAccount[];
}

export interface VATRate {
  id: string;
  name: string;
  percentage: number;
  appliesTo: "all" | "products" | "services";
  isDefault: boolean;
  status: "active" | "disabled";
  isUsed: boolean;
}

export interface BranchVATConfig {
  branchId: string;
  branchName: string;
  pricingMode: "inclusive" | "exclusive";
  defaultVatRateId: string;
  taxNumber?: string; // TIN / BIN
  invoiceVatLabel: string;
}

export interface GeneralSettings {
  currency: string;
  fiscalYearStart: string;
  accountingMethod: "cash" | "accrual";
  financialYearClosingMonth: string;
  defaultBranch: string;
  defaultCashAccount: string;
  defaultIncomeAccount: string;
  defaultExpenseAccount: string;
  defaultTaxAccount: string;
  autoPostTransactions: boolean;
  requireConfirmOnDelete: boolean;
}

export interface AdvancedViewSettings {
  enableAdvancedView: boolean;
  showJournalEntries: boolean;
  showLedgerAccounts: boolean;
  showDebitCreditLabels: boolean;
  enableTrialBalance: boolean;
  enableBalanceSheet: boolean;
  enableCashFlowReports: boolean;
  displayAccountCodes: boolean;
  showInternalTxnIds: boolean;
}

export interface SystemPreferences {
  autoNumberTxns: boolean;
  preventDuplicates: boolean;
  requireMemo: boolean;
  autoSaveDrafts: boolean;
  notifyFailedSync: boolean;
  notifyLargeTxns: boolean;
  notifyReconciliationDiff: boolean;
  dateFormat: string;
  currencyFormat: string;
  decimalPrecision: number;
  language: "en" | "bn";
}

export interface AuditLogEntry {
  id: string;
  date: string;
  user: string;
  action: string;
  module: string;
  oldValue?: string;
  newValue?: string;
  status: "success" | "warning" | "error";
}

// Zod Schema for Adding / Editing Account
export const accountFormSchema = z.object({
  name: z.string().min(2, "Account name must be at least 2 characters"),
  code: z.string().min(2, "Account code is required"),
  category: z.enum(["assets", "liabilities", "equity", "income", "expenses"]),
  accountType: z.string().min(1, "Account type is required"),
  parentAccountId: z.string().optional(),
  openingBalance: z.number().default(0),
  description: z.string().optional(),
  branchName: z.string().optional(),
  status: z.enum(["active", "disabled"]).default("active"),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
