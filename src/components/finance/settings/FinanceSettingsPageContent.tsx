"use client";

import React, { useState } from "react";
import {
  COAAccount,
  GeneralSettings,
  AdvancedViewSettings,
  SystemPreferences,
} from "@/types/finance-settings";
import { SettingsSidebar, SettingsSection } from "./SettingsSidebar";
import { GeneralSettingsCard } from "./GeneralSettingsCard";
import { ChartOfAccountsTreeView } from "./ChartOfAccountsTreeView";
import { AddAccountDialog } from "./AddAccountDialog";
import { VATSettingsCard } from "./VATSettingsCard";
import { AdvancedViewCard } from "./AdvancedViewCard";
import { SystemPreferencesCard } from "./SystemPreferencesCard";
import { AuditLogDrawer } from "./AuditLogDrawer";
import { ConfirmDialog } from "./ConfirmDialog";
import { PermissionOverlay } from "./PermissionOverlay";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Save,
  RotateCcw,
  History,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

const INITIAL_COA_ACCOUNTS: COAAccount[] = [
  {
    id: "cat-assets",
    code: "1000",
    name: "Current & Fixed Assets",
    category: "assets",
    accountType: "Header Category",
    openingBalance: 0,
    currentBalance: 742000,
    status: "active",
    hasTransactions: true,
    children: [
      {
        id: "1010",
        code: "1010",
        name: "Main Store Cash Vault",
        category: "assets",
        accountType: "Cash Account",
        openingBalance: 50000,
        currentBalance: 125000,
        status: "active",
        hasTransactions: true, // Cannot delete
      },
      {
        id: "1020",
        code: "1020",
        name: "Dutch-Bangla Bank - Main",
        category: "assets",
        accountType: "Bank Account",
        openingBalance: 200000,
        currentBalance: 525000,
        status: "active",
        hasTransactions: true, // Cannot delete
      },
      {
        id: "1030",
        code: "1030",
        name: "Petty Cash Box",
        category: "assets",
        accountType: "Cash Account",
        openingBalance: 10000,
        currentBalance: 12000,
        status: "active",
        hasTransactions: false, // Can delete
      },
      {
        id: "1040",
        code: "1040",
        name: "Inventory Asset Stock",
        category: "assets",
        accountType: "Stock Account",
        openingBalance: 80000,
        currentBalance: 80000,
        status: "active",
        hasTransactions: true, // Cannot delete
      },
    ],
  },
  {
    id: "cat-liabilities",
    code: "2000",
    name: "Current Liabilities",
    category: "liabilities",
    accountType: "Header Category",
    openingBalance: 0,
    currentBalance: 325000,
    status: "active",
    hasTransactions: true,
    children: [
      {
        id: "2010",
        code: "2010",
        name: "Accounts Payable Dues",
        category: "liabilities",
        accountType: "Payable Account",
        openingBalance: 0,
        currentBalance: 325000,
        status: "active",
        hasTransactions: true,
      },
      {
        id: "2020",
        code: "2020",
        name: "Output VAT Payable",
        category: "liabilities",
        accountType: "Tax Liability",
        openingBalance: 0,
        currentBalance: 0,
        status: "active",
        hasTransactions: false,
      },
    ],
  },
  {
    id: "cat-equity",
    code: "3000",
    name: "Owner's Equity",
    category: "equity",
    accountType: "Header Category",
    openingBalance: 0,
    currentBalance: 500000,
    status: "active",
    hasTransactions: true,
    children: [
      {
        id: "3010",
        code: "3010",
        name: "Capital Investment Account",
        category: "equity",
        accountType: "Equity Account",
        openingBalance: 500000,
        currentBalance: 500000,
        status: "active",
        hasTransactions: true,
      },
    ],
  },
  {
    id: "cat-income",
    code: "4000",
    name: "Revenue & Sales Income",
    category: "income",
    accountType: "Header Category",
    openingBalance: 0,
    currentBalance: 850000,
    status: "active",
    hasTransactions: true,
    children: [
      {
        id: "4010",
        code: "4010",
        name: "General Sales Income",
        category: "income",
        accountType: "Revenue Account",
        openingBalance: 0,
        currentBalance: 850000,
        status: "active",
        hasTransactions: true,
      },
    ],
  },
  {
    id: "cat-expenses",
    code: "5000",
    name: "Operating Expenses",
    category: "expenses",
    accountType: "Header Category",
    openingBalance: 0,
    currentBalance: 120000,
    status: "active",
    hasTransactions: true,
    children: [
      {
        id: "5010",
        code: "5010",
        name: "Inventory Cost of Goods Sold",
        category: "expenses",
        accountType: "COGS Account",
        openingBalance: 0,
        currentBalance: 95000,
        status: "active",
        hasTransactions: true,
      },
      {
        id: "5020",
        code: "5020",
        name: "Office Utility & Internet Expense",
        category: "expenses",
        accountType: "Expense Account",
        openingBalance: 0,
        currentBalance: 25000,
        status: "active",
        hasTransactions: true,
      },
    ],
  },
];

export function FinanceSettingsPageContent() {
  const { isBangla } = useAppTranslation();

  // Role Access State (Demo toggle: Owner/Accountant vs Staff)
  const [currentRole, setCurrentRole] = useState<"owner" | "staff">("owner");
  const hasPermission = currentRole === "owner";

  // Section Navigation State
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    currency: "BDT",
    fiscalYearStart: "July 1st",
    accountingMethod: "accrual",
    financialYearClosingMonth: "June",
    defaultBranch: "Main Branch",
    defaultCashAccount: "1010 - Main Store Cash Vault",
    defaultIncomeAccount: "4010 - Sales Income",
    defaultExpenseAccount: "5010 - Inventory Cost of Goods Sold",
    defaultTaxAccount: "2030 - Output VAT Payable",
    autoPostTransactions: true,
    requireConfirmOnDelete: true,
  });

  // COA State
  const [coaAccounts, setCoaAccounts] = useState<COAAccount[]>(INITIAL_COA_ACCOUNTS);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<COAAccount | null>(null);

  // Advanced View Settings State
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedViewSettings>({
    enableAdvancedView: true,
    showJournalEntries: true,
    showLedgerAccounts: true,
    showDebitCreditLabels: true,
    enableTrialBalance: true,
    enableBalanceSheet: true,
    enableCashFlowReports: true,
    displayAccountCodes: true,
    showInternalTxnIds: false,
  });

  // System Preferences State
  const [systemPreferences, setSystemPreferences] = useState<SystemPreferences>({
    autoNumberTxns: true,
    preventDuplicates: true,
    requireMemo: false,
    autoSaveDrafts: true,
    notifyFailedSync: true,
    notifyLargeTxns: true,
    notifyReconciliationDiff: true,
    dateFormat: "DD/MM/YYYY",
    currencyFormat: "৳ #,##,###",
    decimalPrecision: 2,
    language: "en",
  });

  // Modals & Drawers
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    isDangerous?: boolean;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const [isSaving, setIsSaving] = useState(false);

  // Handlers
  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(
        isBangla
          ? "আর্থিক সেটিংস সফলভাবে আপডেট করা হয়েছে!"
          : "Finance & Accounting settings saved successfully!"
      );
    }, 400);
  };

  const handleResetSettings = () => {
    setConfirmDialogData({
      isOpen: true,
      title: isBangla ? "সেটিংস রিসেট করবেন?" : "Reset Accounting Settings?",
      description: isBangla
        ? "আপনি কি সেটিংসগুলোকে পূর্বে নির্ধারিত ডিফোল্ট মানে রিসেট করতে চান?"
        : "Are you sure you want to reset all accounting preferences to system defaults?",
      isDangerous: true,
      onConfirm: () => {
        toast.info(isBangla ? "সেটিংস রিসেট করা হয়েছে" : "Settings reset to default");
      },
    });
  };

  // COA Account Operations
  const handleSaveAccountData = (accData: Partial<COAAccount>) => {
    toast.success(`Account ${accData.name} saved successfully`);
  };

  const handleDisableAccount = (acc: COAAccount) => {
    toast.info(`Account ${acc.name} status toggled`);
  };

  const handleDeleteAccount = (acc: COAAccount) => {
    setConfirmDialogData({
      isOpen: true,
      title: `Delete Account ${acc.code}?`,
      description: `Are you sure you want to permanently delete account ${acc.name}?`,
      isDangerous: true,
      onConfirm: () => {
        toast.success(`Account ${acc.name} deleted`);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Settings className="h-5 w-5" />
              </div>
              <span>
                {isBangla ? "আর্থিক সেটিংস (Finance Settings)" : "Finance & Accounting Settings"}
              </span>
            </h1>

            {/* Role Access Indicator & Demo Switcher */}
            <button
              type="button"
              onClick={() => setCurrentRole(hasPermission ? "staff" : "owner")}
              className="text-[10px] text-muted-foreground hover:underline font-mono ml-2 flex items-center gap-1 cursor-pointer"
              title="Click to toggle role permission simulation"
            >
              {hasPermission ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-bold">
                  <UserCheck className="h-2.5 w-2.5 mr-0.5" /> Owner Mode
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[9px] font-bold">
                  <UserX className="h-2.5 w-2.5 mr-0.5" /> Staff Mode
                </Badge>
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isBangla
              ? "অ্যাকাউন্টিং পদ্ধতি, হিসাব খাত (COA), ভ্যাট কনফিগারেশন ও সিস্টেম সেটিংস পরিচালনা করুন।"
              : "Configure your accounting preferences, chart of accounts, VAT settings, and advanced accounting options."}
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAuditDrawerOpen(true)}
            className="h-9 px-3 text-xs font-semibold gap-1.5 border-input text-foreground hover:bg-muted cursor-pointer bg-background/50"
          >
            <History className="h-4 w-4 text-muted-foreground" />
            <span>{isBangla ? "অডিট লগ" : "View Audit Log"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleResetSettings}
            className="h-9 px-3 text-xs font-semibold gap-1.5 border-input text-muted-foreground hover:text-foreground cursor-pointer bg-background/50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isBangla ? "রিসেট" : "Reset"}</span>
          </Button>

          <Button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving || !hasPermission}
            className="h-9 px-4 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : "Save Changes"}</span>
          </Button>
        </div>
      </div>

      {/* Permission Overlay Wrapper (Enforces Owner/Accountant Role) */}
      <PermissionOverlay
        hasAccess={hasPermission}
        onSwitchRoleToOwner={() => setCurrentRole("owner")}
        isBangla={isBangla}
      >
        {/* Main Settings Two-Column Layout (Sidebar + Active Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-3">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isBangla={isBangla}
            />
          </div>

          {/* Right Section Display Area */}
          <div className="lg:col-span-9 space-y-6">
            {activeSection === "general" && (
              <GeneralSettingsCard
                settings={generalSettings}
                onChange={(upd) => setGeneralSettings((prev) => ({ ...prev, ...upd }))}
                isBangla={isBangla}
              />
            )}

            {activeSection === "coa" && (
              <ChartOfAccountsTreeView
                accounts={coaAccounts}
                onAddAccount={() => {
                  setEditingAccount(null);
                  setIsAddAccountOpen(true);
                }}
                onView={(acc) => toast.info(`Viewing ${acc.name}`)}
                onEdit={(acc) => {
                  setEditingAccount(acc);
                  setIsAddAccountOpen(true);
                }}
                onDisable={handleDisableAccount}
                onDuplicate={(acc) => toast.info(`Duplicated ${acc.name}`)}
                onDelete={handleDeleteAccount}
                isBangla={isBangla}
              />
            )}

            {activeSection === "vat" && (
              <VATSettingsCard isBangla={isBangla} />
            )}

            {activeSection === "advanced" && (
              <AdvancedViewCard
                settings={advancedSettings}
                onChange={(upd) => setAdvancedSettings((prev) => ({ ...prev, ...upd }))}
                isBangla={isBangla}
              />
            )}

            {activeSection === "system" && (
              <SystemPreferencesCard
                preferences={systemPreferences}
                onChange={(upd) => setSystemPreferences((prev) => ({ ...prev, ...upd }))}
                isBangla={isBangla}
              />
            )}
          </div>
        </div>
      </PermissionOverlay>

      {/* Add / Edit COA Account Dialog */}
      <AddAccountDialog
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onSaveAccount={handleSaveAccountData}
        initialAccount={editingAccount}
        isBangla={isBangla}
      />

      {/* Audit Log Side Drawer */}
      <AuditLogDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        isBangla={isBangla}
      />

      {/* Safety Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialogData.isOpen}
        onClose={() => setConfirmDialogData({ ...confirmDialogData, isOpen: false })}
        onConfirm={confirmDialogData.onConfirm}
        title={confirmDialogData.title}
        description={confirmDialogData.description}
        isDangerous={confirmDialogData.isDangerous}
      />
    </div>
  );
}
