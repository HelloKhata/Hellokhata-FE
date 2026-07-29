"use client";

import React, { useState } from "react";
import { Employee } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCurrency } from "@/hooks/useAppTranslation";
import {
  User,
  Building2,
  CalendarCheck,
  Receipt,
  FileText,
  History,
  QrCode,
  Printer,
  Pencil,
  UserX,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ShieldCheck,
  Download,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EmployeeProfileDashboardProps {
  employee: Employee;
  onEdit?: (emp: Employee) => void;
  onDeactivate?: (emp: Employee) => void;
  isBangla?: boolean;
}

export function EmployeeProfileDashboard({
  employee,
  onEdit,
  onDeactivate,
  isBangla = false,
}: EmployeeProfileDashboardProps) {
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState("overview");

  const handleGenerateIdCard = () => {
    toast.success(`ID Card generated for ${employee.fullName}`);
  };

  const handlePrintProfile = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/hrm/employees"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isBangla ? "কর্মীবৃন্দ তালিকায় ফিরে যান" : "Back to Employees Roster"}</span>
        </Link>
      </div>

      {/* Profile Banner & Header Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-primary/20 shadow-xs">
              <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg rounded-2xl">
                {employee.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  {employee.fullName}
                </h1>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted/60 border border-border/70 text-foreground">
                  {employee.id}
                </span>
                {employee.status === "active" ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px] font-bold">
                    Inactive
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap pt-0.5">
                <span className="font-semibold text-foreground">{employee.role}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-primary" /> {employee.branchName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Joined {employee.joiningDate}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateIdCard}
              className="h-8 text-xs font-semibold gap-1.5 bg-background/50 cursor-pointer"
            >
              <QrCode className="h-3.5 w-3.5 text-primary" />
              <span>Generate ID Card</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrintProfile}
              className="h-8 text-xs font-semibold gap-1.5 bg-background/50 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Print Profile</span>
            </Button>

            {onEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit(employee)}
                className="h-8 text-xs font-semibold gap-1.5 bg-background/50 cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Edit</span>
              </Button>
            )}

            {onDeactivate && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDeactivate(employee)}
                className="h-8 text-xs font-semibold gap-1.5 text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
              >
                <UserX className="h-3.5 w-3.5" />
                <span>{employee.status === "active" ? "Deactivate" : "Activate"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Quick KPI Overview Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-medium">Monthly Attendance</span>
            <strong className="text-base font-mono font-bold text-emerald-600 block">98.5%</strong>
          </div>

          <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-medium">Leave Days Taken</span>
            <strong className="text-base font-mono font-bold text-blue-600 block">3 Days</strong>
          </div>

          <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-medium">Net Salary</span>
            <strong className="text-base font-mono font-bold text-foreground block">
              {formatCurrency(employee.salaryStructure.netSalary)}
            </strong>
          </div>

          <div className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-medium">Reporting Manager</span>
            <strong className="text-xs font-bold text-foreground block truncate">
              {employee.managerName || "N/A"}
            </strong>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card border border-border/80 p-1 rounded-xl h-auto flex flex-wrap gap-1">
          <TabsTrigger value="overview" className="text-xs font-semibold px-3.5 py-1.5 cursor-pointer">
            Overview
          </TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs font-semibold px-3.5 py-1.5 cursor-pointer">
            Attendance History
          </TabsTrigger>
          <TabsTrigger value="leave" className="text-xs font-semibold px-3.5 py-1.5 cursor-pointer">
            Leave History
          </TabsTrigger>
          <TabsTrigger value="payslips" className="text-xs font-semibold px-3.5 py-1.5 cursor-pointer">
            Payslips
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs font-semibold px-3.5 py-1.5 cursor-pointer">
            Documents
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs font-semibold px-3.5 py-1.5 cursor-pointer">
            Activity Log
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 Cols: Detailed Profile Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
                <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/80 pb-2.5">
                  <User className="h-4 w-4 text-primary" />
                  <span>Personal & Employment Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Full Name</span>
                    <strong className="text-foreground text-xs">{employee.fullName}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Employee ID</span>
                    <strong className="text-foreground font-mono text-xs">{employee.id}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Phone Number</span>
                    <strong className="text-foreground font-mono text-xs">{employee.phone}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Email Address</span>
                    <strong className="text-foreground font-mono text-xs">{employee.email}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">National ID (NID)</span>
                    <strong className="text-foreground font-mono text-xs">{employee.nid || "N/A"}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Emergency Contact</span>
                    <strong className="text-foreground text-xs">
                      {employee.emergencyContactName ? `${employee.emergencyContactName} (${employee.emergencyContactPhone})` : "N/A"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Salary Structure Breakdown Table Card */}
              <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs">
                <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/80 pb-2.5">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  <span>Salary Structure Breakdown</span>
                </h3>

                <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
                        <TableHead>Component</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Monthly Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-bold">Basic Salary</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-[11px]">Base</TableCell>
                        <TableCell className="text-right font-mono font-bold">
                          {formatCurrency(employee.salaryStructure.basicSalary)}
                        </TableCell>
                      </TableRow>

                      {employee.salaryStructure.allowances.map((al) => (
                        <TableRow key={al.id}>
                          <TableCell className="font-semibold text-emerald-600">{al.name}</TableCell>
                          <TableCell className="text-emerald-600 font-mono text-[11px]">Allowance (+)</TableCell>
                          <TableCell className="text-right font-mono font-semibold text-emerald-600">
                            +{formatCurrency(al.amount)}
                          </TableCell>
                        </TableRow>
                      ))}

                      {employee.salaryStructure.deductions.map((de) => (
                        <TableRow key={de.id}>
                          <TableCell className="font-semibold text-rose-600">{de.name}</TableCell>
                          <TableCell className="text-rose-600 font-mono text-[11px]">Deduction (-)</TableCell>
                          <TableCell className="text-right font-mono font-semibold text-rose-600">
                            -{formatCurrency(de.amount)}
                          </TableCell>
                        </TableRow>
                      ))}

                      <TableRow className="bg-muted/30 font-bold">
                        <TableCell className="text-foreground font-bold">Net Monthly Salary</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-[11px]">Total Net</TableCell>
                        <TableCell className="text-right font-mono font-bold text-foreground text-sm">
                          {formatCurrency(employee.salaryStructure.netSalary)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Branch & Manager Info */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-2xs">
                <h4 className="font-bold text-foreground text-xs border-b border-border/60 pb-2">
                  Branch Assignment
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Primary Branch</span>
                    <strong className="text-foreground">{employee.branchName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                      Assigned
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: ATTENDANCE HISTORY */}
        <TabsContent value="attendance">
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/80 pb-2.5">
              <CalendarCheck className="h-4 w-4 text-blue-500" />
              <span>Monthly Attendance History Log</span>
            </h3>

            <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employee.attendanceHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No attendance records logged for this month.
                      </TableCell>
                    </TableRow>
                  ) : (
                    employee.attendanceHistory.map((att) => (
                      <TableRow key={att.id}>
                        <TableCell className="font-mono font-bold">{att.date}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">{att.clockIn}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">{att.clockOut}</TableCell>
                        <TableCell className="font-mono font-bold text-foreground">{att.hoursWorked} hrs</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 text-[10px] capitalize">
                            {att.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: LEAVE HISTORY */}
        <TabsContent value="leave">
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/80 pb-2.5">
              <FileText className="h-4 w-4 text-amber-500" />
              <span>Leave Applications & Absence History</span>
            </h3>

            <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Total Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employee.leaveHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No leave records logged yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    employee.leaveHistory.map((lv) => (
                      <TableRow key={lv.id}>
                        <TableCell className="font-bold text-foreground">{lv.leaveType}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {lv.startDate} to {lv.endDate}
                        </TableCell>
                        <TableCell className="font-mono font-bold">{lv.daysCount} Days</TableCell>
                        <TableCell className="text-muted-foreground">{lv.reason}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 text-[10px] capitalize">
                            {lv.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: PAYSLIPS */}
        <TabsContent value="payslips">
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/80 pb-2.5">
              <Receipt className="h-4 w-4 text-emerald-500" />
              <span>Historical Monthly Payslips</span>
            </h3>

            <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 text-[10px] uppercase font-semibold">
                    <TableHead>Month & Year</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Net Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employee.payslipHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No payslips issued yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    employee.payslipHistory.map((pay) => (
                      <TableRow key={pay.id}>
                        <TableCell className="font-bold text-foreground">{pay.monthYear}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">{pay.issueDate}</TableCell>
                        <TableCell className="font-mono font-bold text-emerald-600">
                          {formatCurrency(pay.netPaid)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 text-[10px] capitalize">
                            {pay.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.success(`Downloading payslip for ${pay.monthYear}`)}
                            className="h-7 text-xs font-semibold gap-1 text-primary cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5" /> PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 5: DOCUMENTS */}
        <TabsContent value="documents">
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/80 pb-2.5">
              <FileText className="h-4 w-4 text-primary" />
              <span>Employee HR Documents & NID</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-background/50 border border-border/70 rounded-xl space-y-2">
                <span className="font-bold text-foreground block">National ID Card (NID)</span>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  {employee.nid ? `NID: ${employee.nid}` : "Uploaded"}
                </span>
                <Button variant="outline" size="sm" className="h-7 text-[11px] w-full gap-1">
                  <Download className="h-3 w-3" /> View Document
                </Button>
              </div>

              <div className="p-3.5 bg-background/50 border border-border/70 rounded-xl space-y-2">
                <span className="font-bold text-foreground block">Appointment Letter</span>
                <span className="text-[10px] text-muted-foreground block">Signed Contract PDF</span>
                <Button variant="outline" size="sm" className="h-7 text-[11px] w-full gap-1">
                  <Download className="h-3 w-3" /> View Document
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 6: ACTIVITY LOG */}
        <TabsContent value="activity">
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/80 pb-2.5">
              <History className="h-4 w-4 text-primary" />
              <span>Employee Profile Audit Activity Log</span>
            </h3>

            <div className="space-y-3 text-xs">
              {employee.activityLogs.map((log) => (
                <div key={log.id} className="p-3 bg-background/50 border border-border/70 rounded-xl flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="space-y-0.5 flex-1">
                    <strong className="text-foreground text-xs block">{log.title}</strong>
                    <p className="text-muted-foreground text-[11px]">{log.description}</p>
                    <span className="text-[10px] text-muted-foreground font-mono block">
                      {log.timestamp} • By {log.performedBy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
