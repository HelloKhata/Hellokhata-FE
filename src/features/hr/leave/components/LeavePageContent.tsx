"use client";

import React, { useState, useMemo } from "react";
import { LeaveRequest, LeaveBalance } from "../types";
import { INITIAL_LEAVE_BALANCES, MOCK_LEAVE_REQUESTS } from "../constants";
import { useLeaveStore } from "../store/useLeaveStore";
import { LeaveBranchHeader } from "./LeaveBranchHeader";
import { LeaveSummaryCards } from "./LeaveSummaryCards";
import { LeaveViewTabs } from "./LeaveViewTabs";
import { LeaveBalanceCards } from "./LeaveBalanceCards";
import { LeaveRequestDialog } from "./LeaveRequestDialog";
import { LeaveHistoryTable } from "./LeaveHistoryTable";
import { LeaveApprovalCardsGrid } from "./LeaveApprovalCardsGrid";
import { LeaveApprovalDrawer } from "./LeaveApprovalDrawer";
import { LeaveEmptyState } from "./LeaveEmptyState";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "sonner";

export function LeavePageContent() {
  const { isBangla } = useAppTranslation();
  const { activeTab, selectedBranch, inspectingRequest, setInspectingRequest } = useLeaveStore();

  // State
  const [balances, setBalances] = useState<LeaveBalance[]>(INITIAL_LEAVE_BALANCES);
  const [requests, setRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (selectedBranch !== "All Branches" && r.branchName !== selectedBranch) return false;
      return true;
    });
  }, [requests, selectedBranch]);

  const pendingRequests = useMemo(() => {
    return filteredRequests.filter((r) => r.status === "pending");
  }, [filteredRequests]);

  // Metrics Calculation
  const { pending, approved, rejected, onLeaveToday, remainingTotal } = useMemo(() => {
    const p = requests.filter((r) => r.status === "pending").length;
    const a = requests.filter((r) => r.status === "approved").length;
    const rj = requests.filter((r) => r.status === "rejected").length;
    const rem = balances.reduce((sum, b) => sum + b.remainingDays, 0);
    return { pending: p, approved: a, rejected: rj, onLeaveToday: 3, remainingTotal: rem };
  }, [requests, balances]);

  // Handlers
  const handleRequestSubmitted = (newReq: LeaveRequest) => {
    setRequests((prev) => [newReq, ...prev]);

    // Update local balances preview
    setBalances((prev) =>
      prev.map((b) =>
        b.leaveType === newReq.leaveType
          ? { ...b, remainingDays: Math.max(0, b.remainingDays - newReq.totalDays) }
          : b
      )
    );
  };

  const handleCancelRequest = (reqId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    toast.info("Leave request cancelled.");
  };

  const handleApproveLeave = (reqId: string, managerNote?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: "approved",
              managerNote: managerNote || "Approved by Manager",
              reviewedBy: "Manager",
              reviewedAt: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
  };

  const handleRejectLeave = (reqId: string, managerNote?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: "rejected",
              managerNote: managerNote || "Declined by Manager",
              reviewedBy: "Manager",
              reviewedAt: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <LeaveBranchHeader
        onOpenNewLeaveModal={() => setIsRequestModalOpen(true)}
        isBangla={isBangla}
      />

      {/* KPI Cards */}
      <LeaveSummaryCards
        pendingCount={pending}
        approvedCount={approved}
        rejectedCount={rejected}
        onLeaveTodayCount={onLeaveToday}
        remainingBalance={remainingTotal}
        avgApprovalTime="4.2 hrs"
        isBangla={isBangla}
      />

      {/* View Switcher Tabs */}
      <LeaveViewTabs />

      {/* VIEW 1: MY LEAVE (EMPLOYEE PORTAL) */}
      {activeTab === "my_leave" && (
        <div className="space-y-6">
          {/* Leave Balance Quota Cards */}
          <LeaveBalanceCards balances={balances} isBangla={isBangla} />

          {/* Leave Requests History Table */}
          <LeaveHistoryTable
            requests={filteredRequests}
            onCancelRequest={handleCancelRequest}
            isBangla={isBangla}
          />
        </div>
      )}

      {/* VIEW 2: APPROVAL QUEUE (MANAGER DASHBOARD) */}
      {activeTab === "approval_queue" && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <LeaveEmptyState
              onRequestLeave={() => setIsRequestModalOpen(true)}
              isManager
              isBangla={isBangla}
            />
          ) : (
            <LeaveApprovalCardsGrid
              requests={pendingRequests}
              onReviewRequest={(req) => setInspectingRequest(req)}
              isBangla={isBangla}
            />
          )}
        </div>
      )}

      {/* New Leave Request Dialog */}
      <LeaveRequestDialog
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        balances={balances}
        onRequestSubmitted={handleRequestSubmitted}
        isBangla={isBangla}
      />

      {/* Manager Approval Side Drawer */}
      <LeaveApprovalDrawer
        request={inspectingRequest}
        isOpen={!!inspectingRequest}
        onClose={() => setInspectingRequest(null)}
        onApprove={handleApproveLeave}
        onReject={handleRejectLeave}
        isBangla={isBangla}
      />
    </div>
  );
}
