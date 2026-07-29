"use client";

import React, { useState, useMemo } from "react";
import { COAAccount, AccountCategory } from "@/types/finance-settings";
import { AccountRow } from "./AccountRow";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderTree, Plus, Search, ChevronRight, ChevronDown } from "lucide-react";

interface ChartOfAccountsTreeViewProps {
  accounts: COAAccount[];
  onAddAccount: () => void;
  onView: (acc: COAAccount) => void;
  onEdit: (acc: COAAccount) => void;
  onDisable: (acc: COAAccount) => void;
  onDuplicate: (acc: COAAccount) => void;
  onDelete: (acc: COAAccount) => void;
  isBangla?: boolean;
}

export function ChartOfAccountsTreeView({
  accounts,
  onAddAccount,
  onView,
  onEdit,
  onDisable,
  onDuplicate,
  onDelete,
  isBangla = false,
}: ChartOfAccountsTreeViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Track expanded parent account IDs
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["cat-assets", "cat-liabilities", "cat-equity", "cat-income", "cat-expenses", "1000", "2000", "4000", "5000"])
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const addAll = (items: COAAccount[]) => {
      items.forEach((item) => {
        allIds.add(item.id);
        if (item.children) addAll(item.children);
      });
    };
    addAll(accounts);
    setExpandedIds(allIds);
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const categories: { id: AccountCategory; title: string; titleBn: string; color: string }[] = [
    { id: "assets", title: "1000 - Assets", titleBn: "১০১০ - সম্পদসমূহ", color: "text-emerald-500" },
    { id: "liabilities", title: "2000 - Liabilities", titleBn: "২০১০ - দায়সমূহ", color: "text-rose-500" },
    { id: "equity", title: "3000 - Equity", titleBn: "৩০১০ - মূলধন", color: "text-purple-500" },
    { id: "income", title: "4000 - Income", titleBn: "৪০১০ - আয়সমূহ", color: "text-blue-500" },
    { id: "expenses", title: "5000 - Expenses", titleBn: "৫০১০ - ব্যয়সমূহ", color: "text-amber-500" },
  ];

  // Helper recursive component for account rows
  const renderAccountTree = (items: COAAccount[], level = 0) => {
    return items.map((acc) => {
      const isExpanded = expandedIds.has(acc.id);

      return (
        <React.Fragment key={acc.id}>
          <AccountRow
            account={acc}
            level={level}
            isExpanded={isExpanded}
            onToggleExpand={toggleExpand}
            onView={onView}
            onEdit={onEdit}
            onDisable={onDisable}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            isBangla={isBangla}
          />
          {isExpanded && acc.children && acc.children.length > 0 && (
            renderAccountTree(acc.children, level + 1)
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-primary" />
            <span>{isBangla ? "হিসাব খাত তালিকা (Chart of Accounts)" : "Chart of Accounts (COA)"}</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isBangla
              ? "ব্যবসার সম্পদ, দায়, মূলধন, আয় ও ব্যয়ের হিসাব খাত পরিচালনা করুন।"
              : "Manage tree structure for Assets, Liabilities, Equity, Income, and Expenses."}
          </p>
        </div>

        <Button
          type="button"
          onClick={onAddAccount}
          className="h-9 px-3 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{isBangla ? "নতুন হিসাব খাত যোগ করুন" : "Add Account"}</span>
        </Button>
      </div>

      {/* Toolbar Controls */}
      <div className="bg-muted/20 border border-border/70 rounded-xl p-3 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBangla ? "হিসাবের নাম বা কোড দিয়ে খুঁজুন..." : "Search account code or name..."}
            className="pl-8 h-8 text-xs bg-background/50 border-input"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 text-xs bg-background/50 border-input w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all" className="text-xs">All Categories</SelectItem>
              <SelectItem value="assets" className="text-xs">Assets</SelectItem>
              <SelectItem value="liabilities" className="text-xs">Liabilities</SelectItem>
              <SelectItem value="equity" className="text-xs">Equity</SelectItem>
              <SelectItem value="income" className="text-xs">Income</SelectItem>
              <SelectItem value="expenses" className="text-xs">Expenses</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="h-8 text-[11px] px-2.5 text-muted-foreground hover:text-foreground cursor-pointer bg-background/50"
          >
            Expand All
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="h-8 text-[11px] px-2.5 text-muted-foreground hover:text-foreground cursor-pointer bg-background/50"
          >
            Collapse All
          </Button>
        </div>
      </div>

      {/* Tree Data Table */}
      <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground border-b border-border/80 font-semibold text-[11px] uppercase tracking-wider">
              <th className="px-3 py-2.5">{isBangla ? "কোড ও হিসাবের নাম" : "Account Code & Name"}</th>
              <th className="px-3 py-2.5">{isBangla ? "টাইপ" : "Account Type"}</th>
              <th className="px-3 py-2.5">{isBangla ? "বর্তমান ব্যালেন্স" : "Current Balance"}</th>
              <th className="px-3 py-2.5">{isBangla ? "স্ট্যাটাস" : "Status"}</th>
              <th className="px-3 py-2.5 text-right">{isBangla ? "অ্যাকশন" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {categories.map((cat) => {
              const categoryAccounts = accounts.filter((a) => a.category === cat.id);
              if (categoryFilter !== "all" && categoryFilter !== cat.id) return null;

              const isCatExpanded = expandedIds.has(`cat-${cat.id}`);

              return (
                <React.Fragment key={cat.id}>
                  {/* Category Header Row */}
                  <tr className="bg-muted/20 font-bold border-b border-border/70 text-xs">
                    <td colSpan={5} className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => toggleExpand(`cat-${cat.id}`)}
                        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors cursor-pointer select-none"
                      >
                        {isCatExpanded ? (
                          <ChevronDown className="h-4 w-4 text-primary" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={cat.color}>
                          {isBangla ? cat.titleBn : cat.title}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground font-semibold px-2 py-0.5 rounded-full bg-background border">
                          {categoryAccounts.length}
                        </span>
                      </button>
                    </td>
                  </tr>

                  {/* Render Nested Accounts */}
                  {isCatExpanded && renderAccountTree(categoryAccounts, 1)}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
