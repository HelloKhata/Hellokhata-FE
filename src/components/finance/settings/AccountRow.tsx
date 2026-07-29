"use client";

import React, { memo } from "react";
import { COAAccount } from "@/types/finance-settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrency } from "@/hooks/useAppTranslation";
import {
  Eye,
  Pencil,
  Ban,
  Copy,
  Trash2,
  ChevronRight,
  ChevronDown,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountRowProps {
  account: COAAccount;
  level?: number;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onView: (acc: COAAccount) => void;
  onEdit: (acc: COAAccount) => void;
  onDisable: (acc: COAAccount) => void;
  onDuplicate: (acc: COAAccount) => void;
  onDelete: (acc: COAAccount) => void;
  isBangla?: boolean;
}

export const AccountRow = memo(function AccountRow({
  account,
  level = 0,
  isExpanded,
  onToggleExpand,
  onView,
  onEdit,
  onDisable,
  onDuplicate,
  onDelete,
  isBangla = false,
}: AccountRowProps) {
  const { formatCurrency } = useCurrency();
  const hasChildren = (account.children && account.children.length > 0) || false;

  return (
    <tr
      className={cn(
        "hover:bg-muted/20 transition-colors border-b border-border/50 text-xs",
        account.status === "disabled" && "opacity-60 bg-muted/10"
      )}
    >
      {/* Account Code & Name Tree Indentation */}
      <td className="px-3 py-2.5 align-middle">
        <div
          style={{ paddingLeft: `${level * 18}px` }}
          className="flex items-center gap-1.5"
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggleExpand(account.id)}
              className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-primary" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}

          <span className="font-mono font-bold text-foreground text-xs bg-muted/40 px-1.5 py-0.5 rounded border border-border/50 shrink-0">
            {account.code}
          </span>

          <span className="font-bold text-foreground truncate max-w-[200px] sm:max-w-[280px]">
            {account.name}
          </span>
        </div>
      </td>

      {/* Account Type */}
      <td className="px-3 py-2.5 align-middle text-muted-foreground font-mono text-[11px] whitespace-nowrap">
        {account.accountType}
      </td>

      {/* Balance */}
      <td className="px-3 py-2.5 align-middle font-mono font-bold text-foreground">
        {formatCurrency(account.currentBalance)}
      </td>

      {/* Status Badge */}
      <td className="px-3 py-2.5 align-middle">
        {account.status === "active" ? (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold">
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-muted text-muted-foreground text-[10px]">
            Disabled
          </Badge>
        )}
      </td>

      {/* Actions */}
      <td className="px-3 py-2.5 align-middle text-right">
        <div className="flex items-center justify-end gap-1">
          {/* View */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onView(account)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            title="View Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>

          {/* Edit */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(account)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Edit Account"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          {/* Disable */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDisable(account)}
            className="h-7 w-7 text-muted-foreground hover:text-amber-600 cursor-pointer"
            title={account.status === "active" ? "Disable Account" : "Enable Account"}
          >
            <Ban className="h-3.5 w-3.5" />
          </Button>

          {/* Duplicate */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDuplicate(account)}
            className="h-7 w-7 text-muted-foreground hover:text-primary cursor-pointer"
            title="Duplicate Account"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>

          {/* Delete Button with Enforced Business Rule Tooltip */}
          {account.hasTransactions ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled
                      className="h-7 w-7 text-muted-foreground/40 cursor-not-allowed opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent align="end" className="text-xs max-w-xs text-rose-500 font-medium">
                  {isBangla
                    ? "বিদ্যমান লেনদেন থাকার কারণে এই অ্যাকাউন্টটি ডিলিট করা যাবে না। কেবল ডিজেবল করা যাবে।"
                    : "This account cannot be deleted because it contains existing transactions."}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onDelete(account)}
              className="h-7 w-7 text-muted-foreground hover:text-rose-600 cursor-pointer"
              title="Delete Account"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
});
