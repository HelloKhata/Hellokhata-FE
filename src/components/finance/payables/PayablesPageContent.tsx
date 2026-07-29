"use client";

import React, { useState, useMemo } from "react";
import { SupplierBill, PayableFilterState, PayableStatus } from "@/types/payable";
import { PayableSummaryCards } from "./PayableSummaryCards";
import { PayableAgingChart } from "./PayableAgingChart";
import { PayableFilterBar } from "./PayableFilterBar";
import { SupplierBillsTable } from "./SupplierBillsTable";
import { SupplierDetailDrawer } from "./SupplierDetailDrawer";
import { AddSupplierBillModal } from "./AddSupplierBillModal";
import { PayBillModal } from "./PayBillModal";
import { PayableEmptyState } from "./PayableEmptyState";
import { BranchSelector } from "../deposits-withdrawals/BranchSelector";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isWithinInterval, subDays, parseISO, addDays } from "date-fns";
import { CreditCard, RefreshCw, Calendar as CalendarIcon, Plus } from "lucide-react";
import { toast } from "sonner";

const MOCK_SUPPLIER_BILLS: SupplierBill[] = [
  {
    id: "bill-1001",
    billNumber: "BILL-1025",
    supplierId: "sup-1",
    supplierName: "ABC Traders Ltd",
    supplierPhone: "01711998877",
    supplierEmail: "sales@abctraders.com",
    totalAmount: 35000,
    paidAmount: 20000,
    outstandingAmount: 15000,
    issueDate: "2026-07-01",
    dueDate: "2026-08-10",
    agingBucket: "current",
    agingDays: 12,
    branchId: "b-main",
    branchName: "Main Branch",
    status: "partial",
    linkedPurchaseId: "pur-1052",
    linkedPurchaseNo: "#PUR-1052",
    notes: "Raw materials batch order #1052",
    paymentHistory: [
      {
        id: "pay-101",
        amount: 20000,
        date: "2026-07-10",
        method: "bank",
        referenceNo: "TXN-88219",
        note: "Initial advance payment",
      },
    ],
    createdAt: new Date(),
  },
  {
    id: "bill-1002",
    billNumber: "BILL-1026",
    supplierId: "sup-2",
    supplierName: "Apex Chemical Industries",
    supplierPhone: "01899776655",
    totalAmount: 68000,
    paidAmount: 0,
    outstandingAmount: 68000,
    issueDate: "2026-05-15",
    dueDate: "2026-06-15",
    agingBucket: "30_days",
    agingDays: 43,
    branchId: "b-mirpur",
    branchName: "Mirpur Branch",
    status: "overdue",
    linkedPurchaseNo: "#PUR-0988",
    notes: "Urgent vendor payment reminder",
    paymentHistory: [],
    createdAt: new Date(Date.now() - 86400000 * 43),
  },
  {
    id: "bill-1003",
    billNumber: "BILL-1027",
    supplierId: "sup-3",
    supplierName: "Metro Packaging Solution",
    supplierPhone: "01912345678",
    totalAmount: 48000,
    paidAmount: 0,
    outstandingAmount: 48000,
    issueDate: "2026-04-20",
    dueDate: "2026-05-20",
    agingBucket: "60_days",
    agingDays: 69,
    branchId: "b-gulshan",
    branchName: "Gulshan Branch",
    status: "overdue",
    linkedPurchaseNo: "#PUR-0840",
    notes: "Custom corrugated box supply",
    paymentHistory: [],
    createdAt: new Date(Date.now() - 86400000 * 69),
  },
  {
    id: "bill-1004",
    billNumber: "BILL-1028",
    supplierId: "sup-4",
    supplierName: "Delta Logistics & Machinery",
    supplierPhone: "01755443322",
    totalAmount: 25000,
    paidAmount: 0,
    outstandingAmount: 25000,
    issueDate: "2026-03-10",
    dueDate: "2026-04-10",
    agingBucket: "90_days",
    agingDays: 109,
    branchId: "b-main",
    branchName: "Main Branch",
    status: "overdue",
    notes: "Warehouse equipment spare parts",
    paymentHistory: [],
    createdAt: new Date(Date.now() - 86400000 * 109),
  },
  {
    id: "bill-1005",
    billNumber: "BILL-1029",
    supplierId: "sup-5",
    supplierName: "Kazi Hardware & Tools",
    supplierPhone: "01611882233",
    totalAmount: 42500,
    paidAmount: 0,
    outstandingAmount: 42500,
    issueDate: "2026-07-20",
    dueDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
    agingBucket: "current",
    agingDays: 8,
    branchId: "b-main",
    branchName: "Main Branch",
    status: "unpaid",
    notes: "Maintenance toolkit purchase",
    paymentHistory: [],
    createdAt: new Date(),
  },
  {
    id: "bill-1006",
    billNumber: "BILL-1030",
    supplierId: "sup-6",
    supplierName: "Bismillah Printing Press",
    supplierPhone: "01788776655",
    totalAmount: 126500,
    paidAmount: 0,
    outstandingAmount: 126500,
    issueDate: "2026-07-22",
    dueDate: "2026-08-22",
    agingBucket: "current",
    agingDays: 6,
    branchId: "b-main",
    branchName: "Main Branch",
    status: "unpaid",
    notes: "Marketing catalog print order",
    paymentHistory: [],
    createdAt: new Date(),
  },
];

export function PayablesPageContent() {
  const { isBangla } = useAppTranslation();

  // State
  const [bills, setBills] = useState<SupplierBill[]>(MOCK_SUPPLIER_BILLS);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<PayableFilterState>({
    searchQuery: "",
    selectedStatus: "all",
    selectedAging: "all",
    selectedBranch: "all",
    selectedSupplier: "all",
    dateRange: "all",
  });

  // Drawer & Modal Control States
  const [selectedDrawerBill, setSelectedDrawerBill] = useState<SupplierBill | null>(null);
  const [selectedPayBill, setSelectedPayBill] = useState<SupplierBill | null>(null);
  const [selectedEditBill, setSelectedEditBill] = useState<SupplierBill | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleFilterChange = (updated: Partial<PayableFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  // Unique suppliers list for filter dropdown
  const suppliersList = useMemo(() => {
    const map = new Map<string, string>();
    bills.forEach((b) => map.set(b.supplierId, b.supplierName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [bills]);

  // Filtered Bills List
  const filteredBills = useMemo(() => {
    return bills
      .filter((b) => {
        // Top Header Branch Filter
        if (selectedBranch !== "all" && b.branchName !== selectedBranch) {
          return false;
        }

        // Toolbar Branch Filter
        if (filters.selectedBranch !== "all" && b.branchName !== filters.selectedBranch) {
          return false;
        }

        // Status Filter
        if (filters.selectedStatus !== "all" && b.status !== filters.selectedStatus) {
          return false;
        }

        // Aging Filter
        if (filters.selectedAging !== "all" && b.agingBucket !== filters.selectedAging) {
          return false;
        }

        // Supplier Filter
        if (filters.selectedSupplier !== "all" && b.supplierId !== filters.selectedSupplier) {
          return false;
        }

        // Search Filter (Supplier Name, Bill Number, Purchase Ref)
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchSupplier = b.supplierName.toLowerCase().includes(q);
          const matchBillNo = b.billNumber.toLowerCase().includes(q);
          const matchPurchaseNo = b.linkedPurchaseNo?.toLowerCase().includes(q);
          if (!matchSupplier && !matchBillNo && !matchPurchaseNo) return false;
        }

        return true;
      })
      .sort((a, b) => b.outstandingAmount - a.outstandingAmount);
  }, [bills, filters, selectedBranch]);

  // Aggregated Summary KPI Data
  const { totalPayables, totalSuppliersCount, overdueAmount, dueThisWeekAmount, agingBreakdown } =
    useMemo(() => {
      const activeBills = bills.filter((b) => b.outstandingAmount > 0);
      const totPay = activeBills.reduce((sum, b) => sum + b.outstandingAmount, 0);

      const uniqueSuppliers = new Set(activeBills.map((b) => b.supplierId)).size;

      const ovd = activeBills
        .filter((b) => b.status === "overdue" || b.agingBucket !== "current")
        .reduce((sum, b) => sum + b.outstandingAmount, 0);

      // Bills due within 7 days
      const now = new Date();
      const nextWeek = addDays(now, 7);
      const dueWeek = activeBills
        .filter((b) => {
          try {
            const d = parseISO(b.dueDate);
            return d >= now && d <= nextWeek;
          } catch {
            return false;
          }
        })
        .reduce((sum, b) => sum + b.outstandingAmount, 0);

      const currentSum = activeBills
        .filter((b) => b.agingBucket === "current")
        .reduce((sum, b) => sum + b.outstandingAmount, 0);

      const days30Sum = activeBills
        .filter((b) => b.agingBucket === "30_days")
        .reduce((sum, b) => sum + b.outstandingAmount, 0);

      const days60Sum = activeBills
        .filter((b) => b.agingBucket === "60_days")
        .reduce((sum, b) => sum + b.outstandingAmount, 0);

      const days90Sum = activeBills
        .filter((b) => b.agingBucket === "90_days")
        .reduce((sum, b) => sum + b.outstandingAmount, 0);

      return {
        totalPayables: totPay,
        totalSuppliersCount: uniqueSuppliers,
        overdueAmount: ovd,
        dueThisWeekAmount: dueWeek,
        agingBreakdown: {
          current: currentSum,
          days30: days30Sum,
          days60: days60Sum,
          days90: days90Sum,
        },
      };
    }, [bills]);

  // Payment Recording Success Handler (Optimistic Update)
  const handlePaymentSuccess = (
    billId: string,
    amountPaid: number,
    method: string,
    referenceNo?: string,
    note?: string
  ) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          const newPaid = b.paidAmount + amountPaid;
          const newOutstanding = Math.max(0, b.totalAmount - newPaid);

          let newStatus: PayableStatus = b.status;
          if (newOutstanding === 0) {
            newStatus = "paid";
          } else if (newPaid > 0) {
            newStatus = "partial";
          }

          const newPaymentRecord = {
            id: `pay-${Date.now()}`,
            amount: amountPaid,
            date: new Date().toISOString().split("T")[0],
            method: method as any,
            referenceNo,
            note,
          };

          return {
            ...b,
            paidAmount: newPaid,
            outstandingAmount: newOutstanding,
            status: newStatus,
            paymentHistory: [newPaymentRecord, ...b.paymentHistory],
          };
        }
        return b;
      })
    );
  };

  // Add Manual Bill Handler
  const handleBillCreated = (newBill: SupplierBill) => {
    setBills((prev) => [newBill, ...prev]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isBangla ? "প্রদেয় হিসাব তথ্য হালনাগাদ করা হয়েছে" : "Payables data refreshed");
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <span>{isBangla ? "প্রদেয় হিসাব (Payables)" : "Payables"}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isBangla
              ? "সরবরাহকারীদের প্রদেয় বিল, পরিশোধের সময়সীমা এবং ব্যবসা পরিষদের পেমেন্ট পরিচালনা করুন।"
              : "Track supplier bills, monitor due dates, and manage business payments."}
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

          {/* Add Supplier Bill Button */}
          <Button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-3 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>{isBangla ? "বিল যোগ করুন" : "Add Supplier Bill"}</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <PayableSummaryCards
        totalPayables={totalPayables}
        totalSuppliers={totalSuppliersCount}
        overdueAmount={overdueAmount}
        dueThisWeekAmount={dueThisWeekAmount}
        isBangla={isBangla}
      />

      {/* Aging Overview Chart */}
      <PayableAgingChart data={agingBreakdown} isBangla={isBangla} />

      {/* Supplier Bills Filter Toolbar & Table */}
      <div className="space-y-4">
        <PayableFilterBar
          filters={filters}
          onChange={handleFilterChange}
          suppliersList={suppliersList}
          isBangla={isBangla}
        />

        {filteredBills.length === 0 ? (
          <PayableEmptyState onActionClick={() => setIsAddModalOpen(true)} isBangla={isBangla} />
        ) : (
          <SupplierBillsTable
            bills={filteredBills}
            onViewDetails={(bill) => setSelectedDrawerBill(bill)}
            onPayNow={(bill) => setSelectedPayBill(bill)}
            onEditBill={(bill) => setSelectedEditBill(bill)}
            isBangla={isBangla}
          />
        )}
      </div>

      {/* Supplier Detail Side Drawer */}
      <SupplierDetailDrawer
        bill={selectedDrawerBill}
        isOpen={!!selectedDrawerBill}
        onClose={() => setSelectedDrawerBill(null)}
        onPayNow={(bill) => setSelectedPayBill(bill)}
        onEditBill={(bill) => setSelectedEditBill(bill)}
        isBangla={isBangla}
      />

      {/* Add Supplier Bill Modal */}
      <AddSupplierBillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBillCreated={handleBillCreated}
        isBangla={isBangla}
      />

      {/* Pay Bill Modal */}
      <PayBillModal
        bill={selectedPayBill}
        isOpen={!!selectedPayBill}
        onClose={() => setSelectedPayBill(null)}
        onPaymentSuccess={handlePaymentSuccess}
        isBangla={isBangla}
      />
    </div>
  );
}
