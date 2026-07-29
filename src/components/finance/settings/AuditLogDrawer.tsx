"use client";

import React, { useState } from "react";
import { AuditLogEntry } from "@/types/finance-settings";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, Download, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-1",
    date: "2026-07-28 14:10",
    user: "Kazi Shohel (Owner)",
    action: "Updated Accounting Method",
    module: "General Settings",
    oldValue: "Cash Basis",
    newValue: "Accrual Basis",
    status: "success",
  },
  {
    id: "log-2",
    date: "2026-07-28 12:45",
    user: "Anisur Rahman (Accountant)",
    action: "Added COA Account",
    module: "Chart of Accounts",
    oldValue: "-",
    newValue: "1025 - Petty Cash Box",
    status: "success",
  },
  {
    id: "log-3",
    date: "2026-07-27 16:20",
    user: "Kazi Shohel (Owner)",
    action: "Enabled Advanced View",
    module: "Advanced View",
    oldValue: "Disabled",
    newValue: "Enabled",
    status: "success",
  },
  {
    id: "log-4",
    date: "2026-07-25 11:30",
    user: "Anisur Rahman (Accountant)",
    action: "Attempted Delete Transaction COA",
    module: "Chart of Accounts",
    oldValue: "Account 1010",
    newValue: "Blocked (Has Txns)",
    status: "warning",
  },
];

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isBangla?: boolean;
}

export function AuditLogDrawer({
  isOpen,
  onClose,
  isBangla = false,
}: AuditLogDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = MOCK_AUDIT_LOGS.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.user.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.module.toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    toast.success(
      isBangla
        ? "অডিট লগ সফলভাবে এক্সপোর্ট করা হয়েছে"
        : "Audit log history exported successfully"
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col h-full bg-card">
        <SheetHeader className="p-4 border-b border-border bg-muted/20 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                <History className="h-4 w-4" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold text-foreground text-left">
                  {isBangla ? "অডিট লগ হিস্ট্রি (Audit Log)" : "Finance Audit Log History"}
                </SheetTitle>
                <SheetDescription className="text-[10px] text-muted-foreground text-left font-mono">
                  Track all settings changes & administrative actions
                </SheetDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-8 text-xs font-semibold gap-1 bg-background/50 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          </div>
        </SheetHeader>

        <div className="p-3 border-b border-border/60 bg-background/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, action, or module..."
              className="pl-8 h-8 text-xs bg-background border-input"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          <div className="border border-border/80 rounded-xl overflow-hidden bg-background/50">
            <Table className="text-left text-xs">
              <TableHeader>
                <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
                  <TableHead className="py-2">Date & User</TableHead>
                  <TableHead className="py-2">Action / Module</TableHead>
                  <TableHead className="py-2">Old → New</TableHead>
                  <TableHead className="py-2 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/15">
                    <TableCell className="py-2.5 font-mono text-[11px] align-top">
                      <strong className="text-foreground block">{log.user}</strong>
                      <span className="text-[10px] text-muted-foreground">{log.date}</span>
                    </TableCell>
                    <TableCell className="py-2.5 align-top">
                      <strong className="text-foreground text-xs block">{log.action}</strong>
                      <span className="text-[10px] text-primary font-semibold">{log.module}</span>
                    </TableCell>
                    <TableCell className="py-2.5 font-mono text-[10px] align-top">
                      <span className="text-rose-500 line-through block">{log.oldValue || "-"}</span>
                      <span className="text-emerald-600 font-bold block">{log.newValue || "-"}</span>
                    </TableCell>
                    <TableCell className="py-2.5 text-right align-top">
                      {log.status === "success" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px]">
                          Success
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px]">
                          Warning
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
