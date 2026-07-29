"use client";

import React from "react";
import {
  SlidersHorizontal,
  FolderTree,
  Receipt,
  GraduationCap,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsSection = "general" | "coa" | "vat" | "advanced" | "system";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  isBangla?: boolean;
}

export function SettingsSidebar({
  activeSection,
  onSectionChange,
  isBangla = false,
}: SettingsSidebarProps) {
  const navItems: { id: SettingsSection; label: string; labelBn: string; icon: any }[] = [
    {
      id: "general",
      label: "General Settings",
      labelBn: "সাধারণ সেটিংস",
      icon: SlidersHorizontal,
    },
    {
      id: "coa",
      label: "Chart of Accounts",
      labelBn: "হিসাব খাত (COA)",
      icon: FolderTree,
    },
    {
      id: "vat",
      label: "VAT Settings",
      labelBn: "ভ্যাট সেটিংস",
      icon: Receipt,
    },
    {
      id: "advanced",
      label: "Advanced View",
      labelBn: "অ্যাডভান্সড ভিউ",
      icon: GraduationCap,
    },
    {
      id: "system",
      label: "System Preferences",
      labelBn: "সিস্টেম প্রিফারেন্স",
      icon: Settings,
    },
  ];

  return (
    <div>
      {/* Desktop Left Navigation Sidebar */}
      <div className="hidden lg:block bg-card border border-border/80 rounded-xl p-2.5 shadow-2xs space-y-1">
        <div className="px-3 py-2 border-b border-border/60 mb-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {isBangla ? "সেটিংস বিভাগ" : "Accounting Settings"}
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer select-none",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-2xs font-bold"
                  : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{isBangla ? item.labelBn : item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Responsive Segmented Tab Bar */}
      <div className="lg:hidden bg-card border border-border/80 rounded-xl p-1.5 shadow-2xs overflow-x-auto no-scrollbar flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:bg-muted/40"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{isBangla ? item.labelBn : item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
