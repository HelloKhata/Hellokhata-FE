"use client";

import React from "react";
import { SystemPreferences } from "@/types/finance-settings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Bell, Globe, FileCode } from "lucide-react";

interface SystemPreferencesCardProps {
  preferences: SystemPreferences;
  onChange: (updated: Partial<SystemPreferences>) => void;
  isBangla?: boolean;
}

export function SystemPreferencesCard({
  preferences,
  onChange,
  isBangla = false,
}: SystemPreferencesCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-5 shadow-2xs">
      <div className="border-b border-border/80 pb-3">
        <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          <span>{isBangla ? "সিস্টেম প্রিফারেন্স (System Preferences)" : "System Preferences"}</span>
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Configure system notifications, transaction rules, date formats, and language.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Transaction Rules Group */}
        <div className="space-y-3">
          <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-border/50 pb-1.5">
            <FileCode className="h-3.5 w-3.5 text-primary" />
            <span>Transaction Rules</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Auto Number Transactions
              </Label>
              <Switch
                checked={preferences.autoNumberTxns}
                onCheckedChange={(checked) => onChange({ autoNumberTxns: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Prevent Duplicate Entries
              </Label>
              <Switch
                checked={preferences.preventDuplicates}
                onCheckedChange={(checked) => onChange({ preventDuplicates: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Require Transaction Memo
              </Label>
              <Switch
                checked={preferences.requireMemo}
                onCheckedChange={(checked) => onChange({ requireMemo: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Auto Save Drafts
              </Label>
              <Switch
                checked={preferences.autoSaveDrafts}
                onCheckedChange={(checked) => onChange({ autoSaveDrafts: checked })}
              />
            </div>
          </div>
        </div>

        {/* Notifications Group */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-border/50 pb-1.5">
            <Bell className="h-3.5 w-3.5 text-amber-500" />
            <span>Notifications & Alerts</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Failed Sync Alert
              </Label>
              <Switch
                checked={preferences.notifyFailedSync}
                onCheckedChange={(checked) => onChange({ notifyFailedSync: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Large Transaction Warning
              </Label>
              <Switch
                checked={preferences.notifyLargeTxns}
                onCheckedChange={(checked) => onChange({ notifyLargeTxns: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/50 border border-border/70 rounded-xl">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Reconciliation Alert
              </Label>
              <Switch
                checked={preferences.notifyReconciliationDiff}
                onCheckedChange={(checked) => onChange({ notifyReconciliationDiff: checked })}
              />
            </div>
          </div>
        </div>

        {/* Localization & Formats Group */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-border/50 pb-1.5">
            <Globe className="h-3.5 w-3.5 text-emerald-500" />
            <span>Localization & Formats</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Date Format</Label>
              <Select
                value={preferences.dateFormat}
                onValueChange={(val) => onChange({ dateFormat: val })}
              >
                <SelectTrigger className="h-9 text-xs bg-background/50 border-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY" className="text-xs font-mono">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD" className="text-xs font-mono">YYYY-MM-DD</SelectItem>
                  <SelectItem value="MMM DD, YYYY" className="text-xs font-mono">MMM DD, YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Decimal Precision</Label>
              <Select
                value={preferences.decimalPrecision.toString()}
                onValueChange={(val) => onChange({ decimalPrecision: parseInt(val, 10) })}
              >
                <SelectTrigger className="h-9 text-xs bg-background/50 border-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2" className="text-xs font-mono">2 Decimals (৳ 0.00)</SelectItem>
                  <SelectItem value="0" className="text-xs font-mono">0 Decimals (৳ 0)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Language</Label>
              <Select
                value={preferences.language}
                onValueChange={(val: any) => onChange({ language: val })}
              >
                <SelectTrigger className="h-9 text-xs bg-background/50 border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en" className="text-xs">English</SelectItem>
                  <SelectItem value="bn" className="text-xs">বাংলা (Bengali)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
