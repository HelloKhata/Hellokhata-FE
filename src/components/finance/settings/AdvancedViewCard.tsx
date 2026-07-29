"use client";

import React from "react";
import { AdvancedViewSettings } from "@/types/finance-settings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedViewCardProps {
  settings: AdvancedViewSettings;
  onChange: (updated: Partial<AdvancedViewSettings>) => void;
  isBangla?: boolean;
}

export function AdvancedViewCard({
  settings,
  onChange,
  isBangla = false,
}: AdvancedViewCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-5 shadow-2xs">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>{isBangla ? "অ্যাডভান্সড একাউন্টেন্ট মোড (Advanced Accountant View)" : "Advanced Accountant View"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isBangla
              ? "ডেবিট, ক্রেডিট, লেজার ও জার্নাল এন্ট্রি পরিভাষা সক্রিয় করুন।"
              : "Toggle technical accounting terminology (Debit/Credit, Ledger, Journal Entries) across HelloKhata."}
          </p>
        </div>

        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
          Accountant Mode
        </Badge>
      </div>

      {/* Main Switch Banner Card */}
      <div
        className={cn(
          "p-4 rounded-xl border transition-all space-y-2",
          settings.enableAdvancedView
            ? "bg-primary/5 border-primary/30"
            : "bg-muted/20 border-border/60"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 max-w-lg">
            <Label className="text-sm font-extrabold text-foreground cursor-pointer flex items-center gap-2">
              <span>{isBangla ? "অ্যাডভান্সড ভিউ সক্রিয় করুন" : "Enable Advanced (Accountant) View"}</span>
              {settings.enableAdvancedView && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded">
                  Active
                </span>
              )}
            </Label>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isBangla
                ? "এটি সক্রিয় থাকলে সিস্টেম জুড়ে ডেবিট, ক্রেডিট, ট্রায়াল ব্যালেন্স ও লেজার এন্ট্রি অপশনগুলো প্রকাশ পাবে। বন্ধ থাকলে সহজ ভাষা দেখানো হবে।"
                : "Show accounting terminology including Debit, Credit, Ledger Accounts, and Journal Entries throughout the Finance module."}
            </p>
          </div>

          <Switch
            checked={settings.enableAdvancedView}
            onCheckedChange={(checked) => onChange({ enableAdvancedView: checked })}
            className="scale-110"
          />
        </div>
      </div>

      {/* Additional Accounting Features Sub-Toggles */}
      <div className={cn("space-y-3 transition-all", !settings.enableAdvancedView && "opacity-50 pointer-events-none")}>
        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider border-b border-border/50 pb-2">
          {isBangla ? "অতিরিক্ত হিসাব বিজ্ঞানের ফিচারসমূহ" : "Additional Accountant Modules"}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Toggle 1: Journal Entries */}
          <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
            <Label className="text-xs font-semibold text-foreground cursor-pointer">
              Show Journal Entries
            </Label>
            <Switch
              checked={settings.showJournalEntries}
              onCheckedChange={(checked) => onChange({ showJournalEntries: checked })}
            />
          </div>

          {/* Toggle 2: Ledger Accounts */}
          <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
            <Label className="text-xs font-semibold text-foreground cursor-pointer">
              Show Ledger Accounts
            </Label>
            <Switch
              checked={settings.showLedgerAccounts}
              onCheckedChange={(checked) => onChange({ showLedgerAccounts: checked })}
            />
          </div>

          {/* Toggle 3: Debit/Credit Labels */}
          <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
            <Label className="text-xs font-semibold text-foreground cursor-pointer">
              Show Debit / Credit Labels
            </Label>
            <Switch
              checked={settings.showDebitCreditLabels}
              onCheckedChange={(checked) => onChange({ showDebitCreditLabels: checked })}
            />
          </div>

          {/* Toggle 4: Trial Balance */}
          <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
            <Label className="text-xs font-semibold text-foreground cursor-pointer">
              Enable Trial Balance Report
            </Label>
            <Switch
              checked={settings.enableTrialBalance}
              onCheckedChange={(checked) => onChange({ enableTrialBalance: checked })}
            />
          </div>

          {/* Toggle 5: Balance Sheet */}
          <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
            <Label className="text-xs font-semibold text-foreground cursor-pointer">
              Enable Balance Sheet Report
            </Label>
            <Switch
              checked={settings.enableBalanceSheet}
              onCheckedChange={(checked) => onChange({ enableBalanceSheet: checked })}
            />
          </div>

          {/* Toggle 6: Cash Flow Reports */}
          <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
            <Label className="text-xs font-semibold text-foreground cursor-pointer">
              Enable Cash Flow Reports
            </Label>
            <Switch
              checked={settings.enableCashFlowReports}
              onCheckedChange={(checked) => onChange({ enableCashFlowReports: checked })}
            />
          </div>

          {/* Toggle 7: Account Codes */}
          <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
            <Label className="text-xs font-semibold text-foreground cursor-pointer">
              Display Account Codes (COA)
            </Label>
            <Switch
              checked={settings.displayAccountCodes}
              onCheckedChange={(checked) => onChange({ displayAccountCodes: checked })}
            />
          </div>

          {/* Toggle 8: Internal Txn IDs */}
          <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
            <Label className="text-xs font-semibold text-foreground cursor-pointer">
              Show Internal Transaction IDs
            </Label>
            <Switch
              checked={settings.showInternalTxnIds}
              onCheckedChange={(checked) => onChange({ showInternalTxnIds: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
