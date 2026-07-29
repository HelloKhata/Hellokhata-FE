"use client";

import React, { useState, useMemo } from "react";
import {
  AttendanceRecord,
  AttendanceMatrixRow,
  AttendanceMatrixCell,
} from "../types";
import {
  MOCK_ATTENDANCE_RECORDS,
  MOCK_MATRIX_ROWS,
} from "../constants";
import { useAttendanceStore } from "../store/useAttendanceStore";
import { AttendanceBranchHeader } from "./AttendanceBranchHeader";
import { AttendanceOfflineBanner } from "./AttendanceOfflineBanner";
import { AttendanceKPICards } from "./AttendanceKPICards";
import { AttendanceViewTabs } from "./AttendanceViewTabs";
import { AttendanceToolbar } from "./AttendanceToolbar";
import { AttendanceMatrixGrid } from "./AttendanceMatrixGrid";
import { AttendanceTable } from "./AttendanceTable";
import { AttendanceDrawer } from "./AttendanceDrawer";
import { AttendanceKioskGrid } from "./AttendanceKioskGrid";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { toast } from "sonner";

export function AttendancePageContent() {
  const { isBangla } = useAppTranslation();
  const { viewMode, setViewMode, selectedBranch } = useAttendanceStore();

  // Attendance Records State
  const [records, setRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE_RECORDS);
  const [matrixRows, setMatrixRows] = useState<AttendanceMatrixRow[]>(MOCK_MATRIX_ROWS);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Drawer Inspection / Correction State
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedBranch !== "All Branches" && r.branchName !== selectedBranch) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.employeeName.toLowerCase().includes(q);
        const matchId = r.employeeId.toLowerCase().includes(q);
        if (!matchName && !matchId) return false;
      }

      return true;
    });
  }, [records, selectedBranch, statusFilter, searchQuery]);

  // Summary Metrics Calculation
  const { present, late, absent, leave, checkedInToday } = useMemo(() => {
    const p = records.filter((r) => r.status === "present").length;
    const l = records.filter((r) => r.status === "late").length;
    const a = records.filter((r) => r.status === "absent").length;
    const lv = records.filter((r) => r.status === "leave").length;
    const chk = records.filter((r) => r.checkIn !== "-").length;
    return { present: p, late: l, absent: a, leave: lv, checkedInToday: chk };
  }, [records]);

  // Handlers
  const handleSaveCorrection = (updated: Partial<AttendanceRecord>) => {
    setRecords((prev) =>
      prev.map((item) => (item.id === updated.id ? ({ ...item, ...updated } as AttendanceRecord) : item))
    );
  };

  const handleSelectMatrixCell = (empName: string, cell: AttendanceMatrixCell) => {
    const existing = records.find((r) => r.id === cell.recordId) || {
      id: cell.recordId || `att-${Date.now()}`,
      employeeId: "EMP-1001",
      employeeName: empName,
      role: "Staff",
      branchName: selectedBranch,
      date: cell.date,
      checkIn: cell.checkIn || "09:00",
      checkOut: cell.checkOut || "18:00",
      workingHours: 9,
      status: cell.status,
    };

    setEditingRecord(existing);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Branch Header & Actions */}
      <AttendanceBranchHeader
        onOpenKiosk={() => setViewMode("kiosk")}
        isBangla={isBangla}
      />

      {/* Offline Sync Status Banner */}
      <AttendanceOfflineBanner />

      {/* KPI Cards */}
      <AttendanceKPICards
        presentCount={present}
        lateCount={late}
        absentCount={absent}
        leaveCount={leave}
        checkedInToday={checkedInToday}
        isBangla={isBangla}
      />

      {/* View Mode Switcher Tabs */}
      <AttendanceViewTabs />

      {/* View 1: Manager View */}
      {viewMode === "manager" && (
        <div className="space-y-6">
          {/* Toolbar */}
          <AttendanceToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            isBangla={isBangla}
          />

          {/* Matrix Grid */}
          <AttendanceMatrixGrid
            matrixRows={matrixRows}
            onSelectCell={handleSelectMatrixCell}
            isBangla={isBangla}
          />

          {/* Daily Log Register Table */}
          <AttendanceTable
            records={filteredRecords}
            onEditRecord={(rec) => setEditingRecord(rec)}
            isBangla={isBangla}
          />
        </div>
      )}

      {/* View 2: Touchscreen Kiosk Mode */}
      {viewMode === "kiosk" && (
        <AttendanceKioskGrid isBangla={isBangla} />
      )}

      {/* Manual Correction Audit Drawer */}
      <AttendanceDrawer
        record={editingRecord}
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        onSaveCorrection={handleSaveCorrection}
        isBangla={isBangla}
      />
    </div>
  );
}
