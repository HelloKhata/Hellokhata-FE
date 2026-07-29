"use client";

import React, { useState, useMemo } from "react";
import { ReceivableCustomer, ReceivableFilterState, AgingBucket } from "@/types/receivable";
import { ReceivableSummaryCards } from "./ReceivableSummaryCards";
import { ReceivableAgingChart } from "./ReceivableAgingChart";
import { ReceivableFilterBar } from "./ReceivableFilterBar";
import { ReceivableTable } from "./ReceivableTable";
import { CustomerDetailDrawer } from "./CustomerDetailDrawer";
import { PartialPaymentDialog } from "./PartialPaymentDialog";
import { SendReminderDialog } from "./SendReminderDialog";
import { ReceivableEmptyState } from "./ReceivableEmptyState";
import { BranchSelector } from "../deposits-withdrawals/BranchSelector";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Receipt, RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

const MOCK_RECEIVABLE_CUSTOMERS: ReceivableCustomer[] = [
  {
    id: "cust-1",
    name: "Rahim Traders",
    phone: "01711223344",
    email: "rahim@traders.bd",
    address: "Station Road, Chattogram",
    branchId: "b-main",
    branchName: "Main Branch",
    totalOutstanding: 18500,
    agingBucket: "30_days",
    agingDays: 42,
    lastPaymentDate: "2026-06-15",
    lastPaymentAmount: 5000,
    dueDate: "2026-07-15",
    riskScore: 35,
    invoices: [
      {
        id: "inv-101",
        invoiceNo: "INV-2026-0891",
        issueDate: "2026-06-01",
        dueDate: "2026-07-01",
        totalAmount: 23500,
        paidAmount: 5000,
        dueAmount: 18500,
        status: "overdue",
      },
    ],
    paymentHistory: [
      {
        id: "pay-501",
        amount: 5000,
        date: "2026-06-15",
        method: "bkash",
        note: "Partial settlement for INV-2026-0891",
      },
    ],
  },
  {
    id: "cust-2",
    name: "Standard Supermart",
    phone: "01899887766",
    email: "accounts@standardsuper.com",
    address: "Gulshan-2, Dhaka",
    branchId: "b-gulshan",
    branchName: "Gulshan Branch",
    totalOutstanding: 45000,
    agingBucket: "60_days",
    agingDays: 68,
    lastPaymentDate: "2026-05-10",
    lastPaymentAmount: 15000,
    dueDate: "2026-06-20",
    riskScore: 65,
    invoices: [
      {
        id: "inv-102",
        invoiceNo: "INV-2026-0745",
        issueDate: "2026-05-01",
        dueDate: "2026-06-01",
        totalAmount: 60000,
        paidAmount: 15000,
        dueAmount: 45000,
        status: "overdue",
      },
    ],
    paymentHistory: [
      {
        id: "pay-502",
        amount: 15000,
        date: "2026-05-10",
        method: "bank",
        note: "Cheque clearance",
      },
    ],
  },
  {
    id: "cust-3",
    name: "Al-Madina Enterprise",
    phone: "01912345678",
    address: "Agrabad, Chattogram",
    branchId: "b-main",
    branchName: "Main Branch",
    totalOutstanding: 12500,
    agingBucket: "current",
    agingDays: 14,
    lastPaymentDate: "2026-07-10",
    lastPaymentAmount: 8000,
    dueDate: "2026-08-10",
    riskScore: 10,
    invoices: [
      {
        id: "inv-103",
        invoiceNo: "INV-2026-0920",
        issueDate: "2026-07-10",
        dueDate: "2026-08-10",
        totalAmount: 20500,
        paidAmount: 8000,
        dueAmount: 12500,
        status: "partial",
      },
    ],
    paymentHistory: [
      {
        id: "pay-503",
        amount: 8000,
        date: "2026-07-10",
        method: "cash",
      },
    ],
  },
  {
    id: "cust-4",
    name: "Apex Electronics",
    phone: "01755443322",
    address: "Mirpur-10, Dhaka",
    branchId: "b-mirpur",
    branchName: "Mirpur Branch",
    totalOutstanding: 28500,
    agingBucket: "90_days",
    agingDays: 105,
    lastPaymentDate: "2026-03-30",
    lastPaymentAmount: 10000,
    dueDate: "2026-04-30",
    riskScore: 85,
    invoices: [
      {
        id: "inv-104",
        invoiceNo: "INV-2026-0412",
        issueDate: "2026-03-15",
        dueDate: "2026-04-15",
        totalAmount: 38500,
        paidAmount: 10000,
        dueAmount: 28500,
        status: "overdue",
      },
    ],
    paymentHistory: [
      {
        id: "pay-504",
        amount: 10000,
        date: "2026-03-30",
        method: "nagad",
      },
    ],
  },
  {
    id: "cust-5",
    name: "Desh General Store",
    phone: "01611882233",
    address: "Dhanmondi, Dhaka",
    branchId: "b-main",
    branchName: "Main Branch",
    totalOutstanding: 62000,
    agingBucket: "current",
    agingDays: 8,
    lastPaymentDate: "2026-07-20",
    lastPaymentAmount: 25000,
    dueDate: "2026-08-20",
    riskScore: 15,
    invoices: [
      {
        id: "inv-105",
        invoiceNo: "INV-2026-0988",
        issueDate: "2026-07-20",
        dueDate: "2026-08-20",
        totalAmount: 87000,
        paidAmount: 25000,
        dueAmount: 62000,
        status: "partial",
      },
    ],
    paymentHistory: [
      {
        id: "pay-505",
        amount: 25000,
        date: "2026-07-20",
        method: "bank",
      },
    ],
  },
  {
    id: "cust-6",
    name: "Bhai Bhai Wholesale",
    phone: "01788776655",
    address: "Khatunganj, Chattogram",
    branchId: "b-main",
    branchName: "Main Branch",
    totalOutstanding: 82000,
    agingBucket: "30_days",
    agingDays: 38,
    lastPaymentDate: "2026-06-05",
    lastPaymentAmount: 20000,
    dueDate: "2026-07-05",
    riskScore: 40,
    invoices: [
      {
        id: "inv-106",
        invoiceNo: "INV-2026-0810",
        issueDate: "2026-05-20",
        dueDate: "2026-06-20",
        totalAmount: 102000,
        paidAmount: 20000,
        dueAmount: 82000,
        status: "overdue",
      },
    ],
    paymentHistory: [
      {
        id: "pay-506",
        amount: 20000,
        date: "2026-06-05",
        method: "bank",
      },
    ],
  },
];

export function ReceivablesPageContent() {
  const { isBangla } = useAppTranslation();

  // State
  const [customers, setCustomers] = useState<ReceivableCustomer[]>(MOCK_RECEIVABLE_CUSTOMERS);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<ReceivableFilterState>({
    searchQuery: "",
    selectedAging: "all",
    selectedBranch: "all",
    dateRange: "all",
  });

  // Modal / Drawer Control States
  const [selectedDrawerCustomer, setSelectedDrawerCustomer] = useState<ReceivableCustomer | null>(null);
  const [selectedPaymentCustomer, setSelectedPaymentCustomer] = useState<ReceivableCustomer | null>(null);
  const [selectedReminderCustomer, setSelectedReminderCustomer] = useState<ReceivableCustomer | null>(null);

  const handleFilterChange = (updated: Partial<ReceivableFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  // Filtered Customers List
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        // Exclude fully paid customers
        if (c.totalOutstanding <= 0) return false;

        // Top Header Branch Filter
        if (selectedBranch !== "all" && c.branchName !== selectedBranch) {
          return false;
        }

        // Toolbar Branch Filter
        if (filters.selectedBranch !== "all" && c.branchName !== filters.selectedBranch) {
          return false;
        }

        // Aging Filter
        if (filters.selectedAging !== "all" && c.agingBucket !== filters.selectedAging) {
          return false;
        }

        // Search Filter (Name, Phone, or Invoice No)
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = c.name.toLowerCase().includes(q);
          const matchPhone = c.phone.includes(q);
          const matchInvoice = c.invoices.some((inv) => inv.invoiceNo.toLowerCase().includes(q));
          if (!matchName && !matchPhone && !matchInvoice) return false;
        }

        return true;
      })
      .sort((a, b) => b.totalOutstanding - a.totalOutstanding);
  }, [customers, filters, selectedBranch]);

  // Aggregated Summary Data
  const { totalReceivables, totalCustomersCount, overdueAmount, collectionRate, agingBreakdown } =
    useMemo(() => {
      const activeCustomers = customers.filter((c) => c.totalOutstanding > 0);
      const totRec = activeCustomers.reduce((sum, c) => sum + c.totalOutstanding, 0);
      const count = activeCustomers.length;

      const ovd = activeCustomers
        .filter((c) => c.agingBucket !== "current")
        .reduce((sum, c) => sum + c.totalOutstanding, 0);

      const currentSum = activeCustomers
        .filter((c) => c.agingBucket === "current")
        .reduce((sum, c) => sum + c.totalOutstanding, 0);

      const days30Sum = activeCustomers
        .filter((c) => c.agingBucket === "30_days")
        .reduce((sum, c) => sum + c.totalOutstanding, 0);

      const days60Sum = activeCustomers
        .filter((c) => c.agingBucket === "60_days")
        .reduce((sum, c) => sum + c.totalOutstanding, 0);

      const days90Sum = activeCustomers
        .filter((c) => c.agingBucket === "90_days")
        .reduce((sum, c) => sum + c.totalOutstanding, 0);

      const rate = 82; // Collection rate standard metric

      return {
        totalReceivables: totRec,
        totalCustomersCount: count,
        overdueAmount: ovd,
        collectionRate: rate,
        agingBreakdown: {
          current: currentSum,
          days30: days30Sum,
          days60: days60Sum,
          days90: days90Sum,
        },
      };
    }, [customers]);

  // Payment Recording Success Handler (Optimistic Update)
  const handlePaymentSuccess = (
    customerId: string,
    amountPaid: number,
    method: string,
    note?: string
  ) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newOutstanding = Math.max(0, c.totalOutstanding - amountPaid);

          // Update invoices
          let remainingPayment = amountPaid;
          const updatedInvoices = c.invoices.map((inv) => {
            if (remainingPayment <= 0) return inv;
            const payForThisInv = Math.min(inv.dueAmount, remainingPayment);
            remainingPayment -= payForThisInv;
            const newDue = inv.dueAmount - payForThisInv;
            return {
              ...inv,
              paidAmount: inv.paidAmount + payForThisInv,
              dueAmount: newDue,
              status: (newDue === 0 ? "unpaid" : "partial") as any,
            };
          });

          // Add to payment history
          const newPaymentRecord = {
            id: `pay-${Date.now()}`,
            amount: amountPaid,
            date: new Date().toISOString().split("T")[0],
            method: method as any,
            note: note,
          };

          return {
            ...c,
            totalOutstanding: newOutstanding,
            lastPaymentAmount: amountPaid,
            lastPaymentDate: new Date().toISOString().split("T")[0],
            invoices: updatedInvoices,
            paymentHistory: [newPaymentRecord, ...c.paymentHistory],
          };
        }
        return c;
      })
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isBangla ? "প্রাপ্য হিসাব তথ্য হালনাগাদ করা হয়েছে" : "Receivables data refreshed");
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Receipt className="h-5 w-5" />
            </div>
            <span>{isBangla ? "প্রাপ্য হিসাব (Receivables)" : "Receivables"}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isBangla
              ? "গ্রাহকদের বাকি পাওনা টাকা এবং ওভারডিউ ইনভয়েস পরিচালনা করুন।"
              : "Track outstanding customer payments and monitor overdue balances."}
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Branch Selector */}
          <div className="w-36 sm:w-44">
            <BranchSelector
              value={selectedBranch}
              onChange={setSelectedBranch}
              isBangla={isBangla}
              showIcon
              compact
            />
          </div>

          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 text-xs px-2.5 bg-background/50 border-input text-foreground font-normal gap-1.5"
              >
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">
                  {filterDate ? format(filterDate, "dd MMM yyyy") : isBangla ? "তারিখ 필터" : "Date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={filterDate}
                onSelect={setFilterDate}
                initialFocus
              />
              {filterDate && (
                <div className="p-2 border-t border-border text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setFilterDate(undefined)}
                  >
                    {isBangla ? "মুছে ফেলুন" : "Clear Filter"}
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 w-9 bg-background/50 border-input text-muted-foreground hover:text-foreground cursor-pointer"
            title={isBangla ? "রিফ্রেশ" : "Refresh"}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <ReceivableSummaryCards
        totalReceivables={totalReceivables}
        totalCustomers={totalCustomersCount}
        overdueAmount={overdueAmount}
        collectionRate={collectionRate}
        isBangla={isBangla}
      />

      {/* Aging Overview Chart */}
      <ReceivableAgingChart data={agingBreakdown} isBangla={isBangla} />

      {/* Receivables Toolbar & List Section */}
      <div className="space-y-4">
        <ReceivableFilterBar filters={filters} onChange={handleFilterChange} isBangla={isBangla} />

        {filteredCustomers.length === 0 ? (
          <ReceivableEmptyState isBangla={isBangla} />
        ) : (
          <ReceivableTable
            customers={filteredCustomers}
            onViewDetails={(c) => setSelectedDrawerCustomer(c)}
            onRecordPayment={(c) => setSelectedPaymentCustomer(c)}
            onSendReminder={(c) => setSelectedReminderCustomer(c)}
            isBangla={isBangla}
          />
        )}
      </div>

      {/* Customer Detail Side Drawer */}
      <CustomerDetailDrawer
        customer={selectedDrawerCustomer}
        isOpen={!!selectedDrawerCustomer}
        onClose={() => setSelectedDrawerCustomer(null)}
        onRecordPayment={(c) => setSelectedPaymentCustomer(c)}
        onSendReminder={(c) => setSelectedReminderCustomer(c)}
        isBangla={isBangla}
      />

      {/* Partial Payment Dialog */}
      <PartialPaymentDialog
        customer={selectedPaymentCustomer}
        isOpen={!!selectedPaymentCustomer}
        onClose={() => setSelectedPaymentCustomer(null)}
        onPaymentSuccess={handlePaymentSuccess}
        isBangla={isBangla}
      />

      {/* Send SMS Reminder Dialog */}
      <SendReminderDialog
        customer={selectedReminderCustomer}
        isOpen={!!selectedReminderCustomer}
        onClose={() => setSelectedReminderCustomer(null)}
        isBangla={isBangla}
      />
    </div>
  );
}
