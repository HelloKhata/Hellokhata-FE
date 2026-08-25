// Hello Khata OS - Employee Reports Dashboard Page
// হ্যালো খাতা - কর্মচারী রিপোর্ট ড্যাশবোর্ড পেজ

'use client';

import { useState, useMemo } from 'react';
import { PageHeader, StatCard } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Calendar as CalendarIcon,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Printer,
  Download,
  FileSpreadsheet,
  FileText,
  Clock,
  ShoppingCart,
  Wallet,
  Trophy,
  ScrollText,
  ReceiptText,
  CircleDollarSign,
  Target,
  Zap,
  CalendarCheck,
  AlarmClock,
  Timer,
  Banknote,
  Landmark,
  Calculator,
  Award,
  FilePlus2,
  Pencil,
  MonitorSmartphone,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useCurrency, useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/stores/sessionStore';
import { PrintReportPreview, type ReportColumn } from '@/components/reports/PrintReportPreview';

// Mock Types
type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive';
type EmployeeRole = 'owner' | 'manager' | 'staff';

interface EmployeeRecord {
  id: string;
  code: string;
  name: string;
  phone: string;
  designation: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  shift: string;
  branchId: string;
  baseSalary: number;
  commissionRate: number; // decimal fraction, e.g. 0.02
  target: number;
  rating: number;
  joinedAt: string;
}

interface PerformanceRecord extends EmployeeRecord {
  totalSales: number;
  ordersHandled: number;
}

interface SalesByEmployeeRecord {
  employeeId: string;
  name: string;
  branchName: string;
  invoices: number;
  grossSales: number;
  discountsGiven: number;
  netRevenue: number;
  targetAchievement: number; // percent
}

interface AttendanceRecord {
  employeeId: string;
  name: string;
  branchName: string;
  shift: string;
  daysPresent: number;
  daysAbsent: number;
  lateCount: number;
  workedHours: number;
  overtimeHours: number;
  todayStatus: 'Present' | 'Late' | 'Absent' | 'On Leave';
}

interface PayrollRecord {
  employeeId: string;
  name: string;
  baseSalary: number;
  totalSales: number;
  commissionRate: number; // percent
  earnedCommission: number;
  deductions: number;
  netPay: number;
}

interface TopPerformerRecord {
  rank: number;
  name: string;
  designation: string;
  primaryOutlet: string;
  salesVolume: number;
  ordersCompleted: number;
  satisfaction: number;
  growthIndex: number; // percent
}

type LogActionType =
  | 'invoice_created'
  | 'invoice_edited'
  | 'invoice_deleted'
  | 'login'
  | 'payment'
  | 'stock_adjustment'
  | 'expense';

interface ActivityLogRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  actionType: LogActionType;
  module: string;
  details: string;
  timestamp: string;
  device: string;
}

// Default fallback branches used when the API returns no data
const DEFAULT_BRANCHES = [
  { id: 'branch-1', name: 'Main Branch' },
  { id: 'branch-2', name: 'Dhanmondi Branch' },
  { id: 'branch-3', name: 'Gulshan Branch' },
  { id: 'branch-4', name: 'Mirpur Branch' },
  { id: 'branch-5', name: 'Uttara Branch' },
];

// Base employee roster used for the demo / fallback experience
const MOCK_EMPLOYEES: EmployeeRecord[] = [
  { id: 'user-1', code: 'EMP-001', name: 'Abdur Rahman', phone: '01811112222', designation: 'Branch Manager', role: 'manager', status: 'Active', shift: 'Morning (8 AM - 4 PM)', branchId: 'branch-1', baseSalary: 45000, commissionRate: 0.015, target: 600000, rating: 4.8, joinedAt: '2022-03-01' },
  { id: 'user-2', code: 'EMP-002', name: 'Karim Uddin', phone: '01822223333', designation: 'Sales Executive', role: 'staff', status: 'Active', shift: 'Morning (8 AM - 4 PM)', branchId: 'branch-2', baseSalary: 22000, commissionRate: 0.02, target: 350000, rating: 4.5, joinedAt: '2023-01-15' },
  { id: 'user-3', code: 'EMP-003', name: 'Nazmul Islam', phone: '01833334444', designation: 'Sales Executive', role: 'staff', status: 'Active', shift: 'Evening (2 PM - 10 PM)', branchId: 'branch-1', baseSalary: 20000, commissionRate: 0.02, target: 300000, rating: 4.1, joinedAt: '2023-06-01' },
  { id: 'user-4', code: 'EMP-004', name: 'Farhana Akter', phone: '01844445555', designation: 'Cashier', role: 'staff', status: 'Active', shift: 'Morning (8 AM - 4 PM)', branchId: 'branch-3', baseSalary: 18000, commissionRate: 0.01, target: 150000, rating: 4.3, joinedAt: '2023-09-10' },
  { id: 'user-5', code: 'EMP-005', name: 'Rashed Chowdhury', phone: '01855556666', designation: 'Storekeeper', role: 'staff', status: 'On Leave', shift: 'Night (10 PM - 6 AM)', branchId: 'branch-4', baseSalary: 19000, commissionRate: 0, target: 0, rating: 4.0, joinedAt: '2024-01-05' },
  { id: 'user-6', code: 'EMP-006', name: 'Salma Begum', phone: '01866667777', designation: 'Accountant', role: 'staff', status: 'Active', shift: 'Morning (8 AM - 4 PM)', branchId: 'branch-1', baseSalary: 30000, commissionRate: 0.005, target: 0, rating: 4.6, joinedAt: '2022-11-20' },
  { id: 'user-7', code: 'EMP-007', name: 'Tanvir Hossain', phone: '01877778888', designation: 'Sales Representative', role: 'staff', status: 'Active', shift: 'Evening (2 PM - 10 PM)', branchId: 'branch-5', baseSalary: 17000, commissionRate: 0.025, target: 280000, rating: 4.2, joinedAt: '2024-03-12' },
  { id: 'user-8', code: 'EMP-008', name: 'Mitu Sarker', phone: '01888889999', designation: 'Receptionist', role: 'staff', status: 'Inactive', shift: 'Morning (8 AM - 4 PM)', branchId: 'branch-3', baseSalary: 16000, commissionRate: 0, target: 0, rating: 3.8, joinedAt: '2023-04-18' },
];

// ─── Shared Filter Helpers ─────────────────────────────────────────────────────

function getDateRange(filters: any): { start?: Date; end?: Date } {
  if (filters.period === 'custom') {
    return { start: filters.dateRange?.from, end: filters.dateRange?.to };
  }
  const end = new Date();
  const start = new Date();
  if (filters.period === '7d') start.setDate(start.getDate() - 7);
  else if (filters.period === '90d') start.setDate(start.getDate() - 90);
  else if (filters.period === '1y') start.setFullYear(start.getFullYear() - 1);
  else start.setDate(start.getDate() - 30);
  return { start, end };
}

function inRange(dateStr: string, start?: Date, end?: Date): boolean {
  if (!start || !end) return true;
  const d = new Date(dateStr).getTime();
  return d >= start.getTime() && d <= end.getTime();
}

function getBranchName(branches: any[], branchId: string): string {
  return (
    branches.find((b: any) => b.id === branchId)?.name ||
    DEFAULT_BRANCHES.find((b: any) => b.id === branchId)?.name ||
    'Main Branch'
  );
}

function passesFilters(e: EmployeeRecord, filters: any, search: string): boolean {
  if (filters.branchId !== 'all' && e.branchId !== filters.branchId) return false;
  if (filters.role !== 'all' && e.role !== filters.role) return false;
  if (filters.status === 'active' && e.status !== 'Active') return false;
  if (filters.status === 'onleave' && e.status !== 'On Leave') return false;
  if (filters.status === 'inactive' && e.status !== 'Inactive') return false;
  if (search.trim() !== '') {
    const q = search.toLowerCase();
    if (
      !e.name.toLowerCase().includes(q) &&
      !e.code.toLowerCase().includes(q) &&
      !e.designation.toLowerCase().includes(q)
    ) {
      return false;
    }
  }
  return true;
}

// ─── Data Builders ─────────────────────────────────────────────────────────────

function buildEmployeeRoster(sales: any[], staffPerf: any[], branches: any[]): EmployeeRecord[] {
  const roster = MOCK_EMPLOYEES.map((e) => ({ ...e }));
  const byId = new Map(roster.map((e) => [e.id, e]));

  (staffPerf || []).forEach((sp: any) => {
    const existing = byId.get(sp.staffId);
    if (existing) {
      if (sp.staffName) existing.name = sp.staffName;
      if (sp.branchId) existing.branchId = sp.branchId;
    } else {
      byId.set(sp.staffId, {
        id: sp.staffId,
        code: `EMP-${String(byId.size + 1).padStart(3, '0')}`,
        name: sp.staffName || `Staff ${sp.staffId}`,
        phone: '—',
        designation: 'Sales Staff',
        role: 'staff',
        status: 'Active',
        shift: 'Morning (8 AM - 4 PM)',
        branchId: sp.branchId || 'branch-1',
        baseSalary: 18000,
        commissionRate: 0.02,
        target: 250000,
        rating: 4.0,
        joinedAt: '2024-01-01',
      });
    }
  });

  sales.forEach((s: any) => {
    const sid = s.staffId;
    if (!sid || byId.has(sid)) return;
    byId.set(sid, {
      id: sid,
      code: `EMP-${String(byId.size + 1).padStart(3, '0')}`,
      name: s.staffName || `Staff ${sid}`,
      phone: '—',
      designation: 'Sales Staff',
      role: 'staff',
      status: 'Active',
      shift: 'Morning (8 AM - 4 PM)',
      branchId: s.branchId || 'branch-1',
      baseSalary: 18000,
      commissionRate: 0.02,
      target: 250000,
      rating: 4.0,
      joinedAt: '2024-01-01',
    });
  });

  return Array.from(byId.values());
}

// Fallback Mock Data Generator for Employee Sales
function generateMockSales(items: any[], branches: any[], roster: EmployeeRecord[]): any[] {
  const sales: any[] = [];
  const start = new Date();
  start.setDate(start.getDate() - 30);

  const paymentMethods = ['cash', 'card', 'mobile_banking', 'credit'];
  const statuses = ['completed', 'completed', 'completed', 'completed', 'pending', 'returned', 'cancelled'];

  const defaultItems = [
    { id: 'item-1', name: 'Coca-Cola 250ml', price: 35, cost: 28, categoryId: 'cat-1' },
    { id: 'item-2', name: 'PRAN Spice Mix 100g', price: 45, cost: 36, categoryId: 'cat-1' },
  ];

  const useItems = items.length > 0 ? items : defaultItems;
  const useBranches = branches.length > 0 ? branches : DEFAULT_BRANCHES;
  const useRoster = roster.length > 0 ? roster : MOCK_EMPLOYEES;

  for (let i = 0; i < 60; i++) {
    const date = new Date(start.getTime());
    date.setDate(date.getDate() + Math.floor(i / 2));

    const employee = useRoster[i % useRoster.length];
    const branch = useBranches[i % useBranches.length];
    const pm = paymentMethods[i % paymentMethods.length];
    const status = statuses[i % statuses.length];
    const item = useItems[i % useItems.length];
    const qty = 3 + (i % 12);
    const unitPrice = item.price || 30;
    const subtotal = qty * unitPrice;
    const discount = i % 4 === 0 ? 80 : 0;
    const tax = i % 4 === 0 ? 40 : 20;
    const total = subtotal - discount + tax;

    sales.push({
      id: `sale-${100 + i}`,
      branchId: branch.id,
      invoiceNo: `INV-2024-${1000 + i}`,
      items: [
        {
          id: `si-${i}-0`,
          itemId: item.id,
          itemName: item.name,
          quantity: qty,
          unitPrice,
          total: subtotal,
        },
      ],
      subtotal,
      discount,
      tax,
      total,
      paidAmount: status === 'completed' ? total : 0,
      dueAmount: status === 'completed' ? 0 : total,
      status,
      paymentMethod: pm,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
      partyName: 'Walk-in Customer',
      partyPhone: null,
      partyId: null,
      staffId: employee.id,
      createdBy: employee.id,
    });
  }
  return sales;
}

interface EmployeeSalesAgg {
  invoices: number;
  gross: number;
  discounts: number;
  net: number;
}

function aggregateEmployeeSales(sales: any[], filters: any): Record<string, EmployeeSalesAgg> {
  const { start, end } = getDateRange(filters);
  const agg: Record<string, EmployeeSalesAgg> = {};

  sales.forEach((s: any) => {
    if (!inRange(s.createdAt, start, end)) return;
    if (filters.branchId !== 'all' && s.branchId !== filters.branchId) return;

    const sid = s.staffId || 'unassigned';
    if (!agg[sid]) agg[sid] = { invoices: 0, gross: 0, discounts: 0, net: 0 };
    const total = Number(s.total) || 0;
    const discount = Number(s.discount) || 0;
    agg[sid].invoices++;
    agg[sid].gross += total;
    agg[sid].discounts += discount;
    agg[sid].net += total - discount;
  });

  return agg;
}

// Tab 1: Employee Performance
function generatePerformanceRecords(
  roster: EmployeeRecord[],
  sales: any[],
  filters: any,
  search: string
): PerformanceRecord[] {
  const agg = aggregateEmployeeSales(sales, filters);

  return roster
    .filter((e) => passesFilters(e, filters, search))
    .map((e) => {
      const a = agg[e.id] || { invoices: 0, gross: 0, discounts: 0, net: 0 };
      return { ...e, totalSales: a.gross, ordersHandled: a.invoices };
    })
    .sort((x, y) => y.totalSales - x.totalSales);
}

// Tab 2: Sales by Employee
function generateSalesByEmployee(
  roster: EmployeeRecord[],
  sales: any[],
  branches: any[],
  filters: any,
  search: string
): SalesByEmployeeRecord[] {
  const agg = aggregateEmployeeSales(sales, filters);

  return roster
    .filter((e) => passesFilters(e, filters, search))
    .map((e) => {
      const a = agg[e.id] || { invoices: 0, gross: 0, discounts: 0, net: 0 };
      return {
        employeeId: e.id,
        name: e.name,
        branchName: getBranchName(branches, e.branchId),
        invoices: a.invoices,
        grossSales: a.gross,
        discountsGiven: a.discounts,
        netRevenue: a.net,
        targetAchievement: e.target > 0 ? (a.gross / e.target) * 100 : 0,
      };
    })
    .sort((x, y) => y.grossSales - x.grossSales);
}

// Tab 3: Attendance & Shifts
function generateAttendanceRecords(
  roster: EmployeeRecord[],
  branches: any[],
  filters: any,
  search: string
): AttendanceRecord[] {
  const todayStatuses: AttendanceRecord['todayStatus'][] = ['Present', 'Present', 'Late', 'Present', 'Absent', 'On Leave', 'Present', 'Late'];

  return roster
    .filter((e) => passesFilters(e, filters, search))
    .map((e, i) => {
      const ts = todayStatuses[i % todayStatuses.length];
      const daysPresent = 18 + (i % 6);
      const daysAbsent = 3 + ((i * 7) % 4);
      const lateCount = 1 + (i % 5);
      const workedHours = 160 + i * 4;
      const overtimeHours = i % 3 === 0 ? 8 + i * 2 : 0;
      return {
        employeeId: e.id,
        name: e.name,
        branchName: getBranchName(branches, e.branchId),
        shift: e.shift,
        daysPresent,
        daysAbsent,
        lateCount,
        workedHours,
        overtimeHours,
        todayStatus: ts,
      };
    });
}

// Tab 4: Payroll & Commission
function generatePayrollRecords(
  roster: EmployeeRecord[],
  sales: any[],
  filters: any,
  search: string
): PayrollRecord[] {
  const agg = aggregateEmployeeSales(sales, filters);

  return roster
    .filter((e) => passesFilters(e, filters, search))
    .map((e) => {
      const a = agg[e.id] || { invoices: 0, gross: 0, discounts: 0, net: 0 };
      const earnedCommission = a.gross * e.commissionRate;
      const deductions = Math.round(e.baseSalary * 0.05) + (e.status === 'On Leave' ? 1000 : 0);
      const netPay = e.baseSalary + earnedCommission - deductions;
      return {
        employeeId: e.id,
        name: e.name,
        baseSalary: e.baseSalary,
        totalSales: a.gross,
        commissionRate: e.commissionRate * 100,
        earnedCommission,
        deductions,
        netPay,
      };
    })
    .sort((x, y) => y.netPay - x.netPay);
}

// Tab 5: Top Performers
function generateTopPerformers(
  roster: EmployeeRecord[],
  sales: any[],
  branches: any[],
  filters: any,
  search: string
): TopPerformerRecord[] {
  const agg = aggregateEmployeeSales(sales, filters);

  return roster
    .filter((e) => passesFilters(e, filters, search))
    .map((e) => {
      const idx = roster.indexOf(e);
      const a = agg[e.id] || { invoices: 0, gross: 0, discounts: 0, net: 0 };
      const growth = 5 + ((idx * 13) % 25) - (idx % 3 === 0 ? 8 : 0);
      return {
        rank: 0,
        name: e.name,
        designation: e.designation,
        primaryOutlet: getBranchName(branches, e.branchId),
        salesVolume: a.gross,
        ordersCompleted: a.invoices,
        satisfaction: e.rating,
        growthIndex: growth,
      };
    })
    .sort((x, y) => y.salesVolume - x.salesVolume)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

// Tab 6: Activity & Audit Logs
const LOG_ACTION_LABELS: Record<LogActionType, string> = {
  invoice_created: 'Invoice Created',
  invoice_edited: 'Invoice Edited',
  invoice_deleted: 'Invoice Deleted',
  login: 'Login',
  payment: 'Payment',
  stock_adjustment: 'Stock Adjustment',
  expense: 'Expense Recorded',
};

function generateActivityLogs(
  roster: EmployeeRecord[],
  sales: any[],
  filters: any,
  search: string
): ActivityLogRecord[] {
  const { start, end } = getDateRange(filters);
  const devices = ['Chrome / Windows', 'Mobile App / Android', 'Safari / macOS', 'Chrome / Android'];
  const logs: ActivityLogRecord[] = [];

  const filteredSales = sales.filter(
    (s: any) =>
      inRange(s.createdAt, start, end) &&
      (filters.branchId === 'all' || s.branchId === filters.branchId)
  );

  filteredSales.forEach((s: any, i: number) => {
    const emp = roster.find((e) => e.id === s.staffId);
    logs.push({
      id: `log-sale-${i}-0`,
      employeeId: s.staffId || 'unassigned',
      employeeName: emp?.name || s.staffName || 'Unassigned Staff',
      actionType: 'invoice_created',
      module: 'Sales',
      details: `Invoice ${s.invoiceNo} issued · ${s.partyName || 'Walk-in Customer'} · ${s.paymentMethod || 'N/A'}`,
      timestamp: s.createdAt,
      device: devices[i % devices.length],
    });
  });

  const mockActions: { type: LogActionType; module: string; details: string }[] = [
    { type: 'login', module: 'System', details: 'Signed in to HelloKhata workspace' },
    { type: 'invoice_edited', module: 'Sales', details: 'Updated invoice INV-2024-1087 discount & tax' },
    { type: 'login', module: 'System', details: 'Signed in via mobile application' },
    { type: 'payment', module: 'Receivables', details: 'Collected payment BDT 12,500 from Alim Grocery' },
    { type: 'stock_adjustment', module: 'Inventory', details: 'Adjusted stock: +50 units Coca-Cola 250ml' },
    { type: 'invoice_deleted', module: 'Sales', details: 'Voided invoice INV-2024-1023 (duplicate entry)' },
    { type: 'login', module: 'System', details: 'Signed in to HelloKhata workspace' },
    { type: 'expense', module: 'Expenses', details: 'Recorded transportation expense BDT 800' },
  ];

  for (let i = 0; i < 24; i++) {
    const emp = roster[i % roster.length];
    const action = mockActions[i % mockActions.length];
    const base = new Date();
    base.setHours(9 + (i % 10), (i * 13) % 60, (i * 7) % 60);
    base.setDate(base.getDate() - (i % 7));
    logs.push({
      id: `log-mock-${i}`,
      employeeId: emp.id,
      employeeName: emp.name,
      actionType: action.type,
      module: action.module,
      details: action.details,
      timestamp: base.toISOString(),
      device: devices[(i + 1) % devices.length],
    });
  }

  return logs
    .filter((log) => {
      const emp = roster.find((e) => e.id === log.employeeId);
      if (emp && !passesFilters(emp, filters, search)) return false;
      if (search.trim() !== '') {
        const q = search.toLowerCase();
        if (
          !log.employeeName.toLowerCase().includes(q) &&
          !log.module.toLowerCase().includes(q) &&
          !log.details.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export default function EmployeeReportsDashboard() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency, formatNumber } = useCurrency();
  const { toast } = useToast();
  const { business, user } = useSessionStore();

  // Static dummy datasets
  const branches = DEFAULT_BRANCHES;
  const employeeRoster = MOCK_EMPLOYEES;
  const salesData = useMemo(() => generateMockSales([], DEFAULT_BRANCHES, MOCK_EMPLOYEES), []);
  const isPageLoading = false;

  // Active Tab state
  const [activeTab, setActiveTab] = useState<string>('performance');

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  // Show advanced filters panel state
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Print Preview Dialog State
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Filter States
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });

  // Advanced Filter Selects
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Local filter copy for "Apply Filters" pattern
  const [activeFilters, setActiveFilters] = useState<{
    period: '7d' | '30d' | '90d' | '1y' | 'custom';
    dateRange: { from?: Date; to?: Date };
    branchId: string;
    role: string;
    status: string;
  }>({
    period: '30d',
    dateRange: { from: undefined, to: undefined },
    branchId: 'all',
    role: 'all',
    status: 'all',
  });

  // Sync handles when period dropdown shifts
  const handlePeriodChange = (val: '7d' | '30d' | '90d' | '1y' | 'custom') => {
    setPeriod(val);
    if (val !== 'custom') {
      setDateRange({ from: undefined, to: undefined });
    }
  };

  // Submit active selections
  const handleApplyFilters = () => {
    setActiveFilters({
      period,
      dateRange,
      branchId: selectedBranchId,
      role: selectedRole,
      status: selectedStatus,
    });
    toast({
      title: isBangla ? 'ফিল্টার প্রয়োগ করা হয়েছে' : 'Filters Applied',
      description: isBangla
        ? 'আপনার নির্বাচিত ফিল্টারের ভিত্তিতে কর্মচারী রিপোর্ট আপডেট করা হয়েছে।'
        : 'Employee report filters refreshed against new filter set.',
    });
  };

  // Reset filters action
  const handleResetFilters = () => {
    setSearchQuery('');
    setPeriod('30d');
    setDateRange({ from: undefined, to: undefined });
    setSelectedBranchId('all');
    setSelectedRole('all');
    setSelectedStatus('all');

    setActiveFilters({
      period: '30d',
      dateRange: { from: undefined, to: undefined },
      branchId: 'all',
      role: 'all',
      status: 'all',
    });

    toast({
      title: isBangla ? 'রিসেট সম্পন্ন' : 'Filters Cleared',
      description: isBangla ? 'সকল ফিল্টার ডিফল্ট মানে রিসেট করা হয়েছে।' : 'All employee reporting filters returned to baseline.',
    });
  };

  // Refresh simulation
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: isBangla ? 'রিলোড সম্পন্ন' : 'Sync Completed',
        description: isBangla ? 'কর্মচারী ডেটা সফলভাবে রিলোড করা হয়েছে।' : 'Employee report data refreshed successfully.',
      });
    }, 400);
  };

  // Tab Data Generators
  const performanceRecords = useMemo(() => {
    return generatePerformanceRecords(employeeRoster, salesData, activeFilters, searchQuery);
  }, [employeeRoster, salesData, activeFilters, searchQuery]);

  const salesByEmployee = useMemo(() => {
    return generateSalesByEmployee(employeeRoster, salesData, branches, activeFilters, searchQuery);
  }, [employeeRoster, salesData, branches, activeFilters, searchQuery]);

  const attendanceRecords = useMemo(() => {
    return generateAttendanceRecords(employeeRoster, branches, activeFilters, searchQuery);
  }, [employeeRoster, branches, activeFilters, searchQuery]);

  const payrollRecords = useMemo(() => {
    return generatePayrollRecords(employeeRoster, salesData, activeFilters, searchQuery);
  }, [employeeRoster, salesData, activeFilters, searchQuery]);

  const topPerformers = useMemo(() => {
    return generateTopPerformers(employeeRoster, salesData, branches, activeFilters, searchQuery);
  }, [employeeRoster, salesData, branches, activeFilters, searchQuery]);

  const activityLogs = useMemo(() => {
    return generateActivityLogs(employeeRoster, salesData, activeFilters, searchQuery);
  }, [employeeRoster, salesData, activeFilters, searchQuery]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const activeEmployees = employeeRoster.filter((e) => e.status === 'Active').length;
    const totalSalesContribution = performanceRecords.reduce((sum, r) => sum + r.totalSales, 0);
    const avgSales = activeEmployees > 0 ? totalSalesContribution / activeEmployees : 0;
    const avgRating = performanceRecords.length > 0
      ? performanceRecords.reduce((sum, r) => sum + r.rating, 0) / performanceRecords.length
      : 0;

    const totalInvoices = salesByEmployee.reduce((sum, r) => sum + r.invoices, 0);
    const grossRevenue = salesByEmployee.reduce((sum, r) => sum + r.grossSales, 0);
    const avgTicket = totalInvoices > 0 ? grossRevenue / totalInvoices : 0;
    const totalTargets = employeeRoster.reduce((sum, e) => sum + e.target, 0);
    const targetAchievement = totalTargets > 0 ? (grossRevenue / totalTargets) * 100 : 0;

    const presentToday = attendanceRecords.filter((r) => r.todayStatus === 'Present').length;
    const lateArrivals = attendanceRecords.reduce((sum, r) => sum + r.lateCount, 0);
    const totalWorkedHours = attendanceRecords.reduce((sum, r) => sum + r.workedHours, 0);
    const overtimeHours = attendanceRecords.reduce((sum, r) => sum + r.overtimeHours, 0);

    const baseSalaryExpense = payrollRecords.reduce((sum, r) => sum + r.baseSalary, 0);
    const totalCommission = payrollRecords.reduce((sum, r) => sum + r.earnedCommission, 0);
    const totalDeductions = payrollRecords.reduce((sum, r) => sum + r.deductions, 0);
    const netPayrollCost = payrollRecords.reduce((sum, r) => sum + r.netPay, 0);

    const topSalesRep = topPerformers[0]?.name || '—';
    const highestOrderVol = topPerformers.length
      ? [...topPerformers].sort((a, b) => b.ordersCompleted - a.ordersCompleted)[0].name
      : '—';
    const efficiencyChampion = topPerformers.length
      ? [...topPerformers].sort(
          (a, b) =>
            (b.ordersCompleted > 0 ? b.salesVolume / b.ordersCompleted : 0) -
            (a.ordersCompleted > 0 ? a.salesVolume / a.ordersCompleted : 0)
        )[0].name
      : '—';
    const growthIndex = topPerformers.length
      ? Math.max(...topPerformers.map((r) => r.growthIndex))
      : 0;

    const totalActions = activityLogs.length;
    const invoicesCreated = activityLogs.filter((l) => l.actionType === 'invoice_created').length;
    const editsDeletions = activityLogs.filter(
      (l) => l.actionType === 'invoice_edited' || l.actionType === 'invoice_deleted'
    ).length;
    const systemAccesses = activityLogs.filter((l) => l.actionType === 'login').length;

    return {
      activeEmployees,
      totalSalesContribution,
      avgSales,
      avgRating,
      totalInvoices,
      grossRevenue,
      avgTicket,
      targetAchievement,
      presentToday,
      lateArrivals,
      totalWorkedHours,
      overtimeHours,
      baseSalaryExpense,
      totalCommission,
      totalDeductions,
      netPayrollCost,
      topSalesRep,
      highestOrderVol,
      efficiencyChampion,
      growthIndex,
      totalActions,
      invoicesCreated,
      editsDeletions,
      systemAccesses,
    };
  }, [employeeRoster, performanceRecords, salesByEmployee, attendanceRecords, payrollRecords, topPerformers, activityLogs]);

  // Pagination states
  const [performancePage, setPerformancePage] = useState(1);
  const [salesPage, setSalesPage] = useState(1);
  const [attendancePage, setAttendancePage] = useState(1);
  const [payrollPage, setPayrollPage] = useState(1);
  const [topPage, setTopPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedPerformance = useMemo(() => {
    const start = (performancePage - 1) * itemsPerPage;
    return performanceRecords.slice(start, start + itemsPerPage);
  }, [performanceRecords, performancePage]);

  const paginatedSales = useMemo(() => {
    const start = (salesPage - 1) * itemsPerPage;
    return salesByEmployee.slice(start, start + itemsPerPage);
  }, [salesByEmployee, salesPage]);

  const paginatedAttendance = useMemo(() => {
    const start = (attendancePage - 1) * itemsPerPage;
    return attendanceRecords.slice(start, start + itemsPerPage);
  }, [attendanceRecords, attendancePage]);

  const paginatedPayroll = useMemo(() => {
    const start = (payrollPage - 1) * itemsPerPage;
    return payrollRecords.slice(start, start + itemsPerPage);
  }, [payrollRecords, payrollPage]);

  const paginatedTop = useMemo(() => {
    const start = (topPage - 1) * itemsPerPage;
    return topPerformers.slice(start, start + itemsPerPage);
  }, [topPerformers, topPage]);

  const paginatedLogs = useMemo(() => {
    const start = (logsPage - 1) * itemsPerPage;
    return activityLogs.slice(start, start + itemsPerPage);
  }, [activityLogs, logsPage]);

  // Active Advanced Count
  const activeAdvancedCount = useMemo(() => {
    let count = 0;
    if (activeFilters.role !== 'all') count++;
    if (activeFilters.status !== 'all') count++;
    return count;
  }, [activeFilters]);

  // Active Filter Chips
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; valueText: string }[] = [];

    if (activeFilters.branchId !== 'all') {
      const name = getBranchName(branches, activeFilters.branchId);
      chips.push({ key: 'branchId', label: isBangla ? 'শাখা' : 'Branch', valueText: name });
    }
    if (activeFilters.role !== 'all') {
      const label = activeFilters.role === 'manager'
        ? isBangla ? 'ম্যানেজার' : 'Manager'
        : activeFilters.role === 'owner'
          ? isBangla ? 'মালিক' : 'Owner'
          : isBangla ? 'কর্মচারী' : 'Staff';
      chips.push({ key: 'role', label: isBangla ? 'ভূমিকা' : 'Role', valueText: label });
    }
    if (activeFilters.status !== 'all') {
      const label = activeFilters.status === 'active'
        ? isBangla ? 'সক্রিয়' : 'Active'
        : activeFilters.status === 'onleave'
          ? isBangla ? 'ছুটিতে' : 'On Leave'
          : isBangla ? 'নিষ্ক্রিয়' : 'Inactive';
      chips.push({ key: 'status', label: isBangla ? 'অবস্থা' : 'Status', valueText: label });
    }

    return chips;
  }, [activeFilters, branches, isBangla]);

  const handleRemoveFilter = (key: string) => {
    if (key === 'branchId') {
      setSelectedBranchId('all');
      setActiveFilters((prev) => ({ ...prev, branchId: 'all' }));
    } else if (key === 'role') {
      setSelectedRole('all');
      setActiveFilters((prev) => ({ ...prev, role: 'all' }));
    } else if (key === 'status') {
      setSelectedStatus('all');
      setActiveFilters((prev) => ({ ...prev, status: 'all' }));
    }
  };

  // Dynamic Print Columns mapping based on activeTab
  const printColumns = useMemo<ReportColumn<any>[]>(() => {
    if (activeTab === 'performance') {
      return [
        { header: 'Employee Name', headerBn: 'কর্মচারীর নাম', accessor: (row: PerformanceRecord) => row.name },
        { header: 'Code / ID', headerBn: 'কোড / আইডি', accessor: (row: PerformanceRecord) => row.code },
        { header: 'Designation', headerBn: 'পদবি', accessor: (row: PerformanceRecord) => row.designation },
        { header: 'Branch', headerBn: 'শাখা', accessor: (row: PerformanceRecord) => getBranchName(branches, row.branchId) },
        { header: 'Total Sales', headerBn: 'মোট বিক্রয়', accessor: (row: PerformanceRecord) => formatCurrency(row.totalSales), align: 'right', footer: formatCurrency(kpis.totalSalesContribution) },
        { header: 'Orders Handled', headerBn: 'অর্ডার সংখ্যা', accessor: (row: PerformanceRecord) => row.ordersHandled.toString(), align: 'center' },
        { header: 'Rating', headerBn: 'রেটিং', accessor: (row: PerformanceRecord) => `${row.rating.toFixed(1)} ★`, align: 'center' },
        { header: 'Status', headerBn: 'অবস্থা', accessor: (row: PerformanceRecord) => row.status, align: 'center' },
      ];
    } else if (activeTab === 'sales') {
      return [
        { header: 'Employee Name', headerBn: 'কর্মচারীর নাম', accessor: (row: SalesByEmployeeRecord) => row.name },
        { header: 'Branch', headerBn: 'শাখা', accessor: (row: SalesByEmployeeRecord) => row.branchName },
        { header: 'Invoices Count', headerBn: 'চালান সংখ্যা', accessor: (row: SalesByEmployeeRecord) => row.invoices.toString(), align: 'center', footer: kpis.totalInvoices.toString() },
        { header: 'Gross Sales', headerBn: 'মোট বিক্রয়', accessor: (row: SalesByEmployeeRecord) => formatCurrency(row.grossSales), align: 'right', footer: formatCurrency(kpis.grossRevenue) },
        { header: 'Discounts Given', headerBn: 'ছাড়', accessor: (row: SalesByEmployeeRecord) => formatCurrency(row.discountsGiven), align: 'right' },
        { header: 'Net Revenue', headerBn: 'নিট রাজস্ব', accessor: (row: SalesByEmployeeRecord) => formatCurrency(row.netRevenue), align: 'right' },
        { header: 'Target vs Actual', headerBn: 'লক্ষ্য বনাম অর্জন', accessor: (row: SalesByEmployeeRecord) => `${row.targetAchievement.toFixed(1)}%`, align: 'right' },
      ];
    } else if (activeTab === 'attendance') {
      return [
        { header: 'Employee Name', headerBn: 'কর্মচারীর নাম', accessor: (row: AttendanceRecord) => row.name },
        { header: 'Branch', headerBn: 'শাখা', accessor: (row: AttendanceRecord) => row.branchName },
        { header: 'Shift', headerBn: 'শিফট', accessor: (row: AttendanceRecord) => row.shift },
        { header: 'Days Present', headerBn: 'উপস্থিত দিন', accessor: (row: AttendanceRecord) => row.daysPresent.toString(), align: 'center' },
        { header: 'Days Absent', headerBn: 'অনুপস্থিত দিন', accessor: (row: AttendanceRecord) => row.daysAbsent.toString(), align: 'center' },
        { header: 'Late Count', headerBn: 'দেরি সংখ্যা', accessor: (row: AttendanceRecord) => row.lateCount.toString(), align: 'center', footer: kpis.lateArrivals.toString() },
        { header: 'Worked Hours', headerBn: 'কাজের ঘন্টা', accessor: (row: AttendanceRecord) => `${row.workedHours}h`, align: 'right' },
        { header: 'Overtime Hours', headerBn: 'ওভারটাইম', accessor: (row: AttendanceRecord) => `${row.overtimeHours}h`, align: 'right' },
      ];
    } else if (activeTab === 'payroll') {
      return [
        { header: 'Employee Name', headerBn: 'কর্মচারীর নাম', accessor: (row: PayrollRecord) => row.name },
        { header: 'Base Salary', headerBn: 'মূল বেতন', accessor: (row: PayrollRecord) => formatCurrency(row.baseSalary), align: 'right', footer: formatCurrency(kpis.baseSalaryExpense) },
        { header: 'Total Sales', headerBn: 'মোট বিক্রয়', accessor: (row: PayrollRecord) => formatCurrency(row.totalSales), align: 'right' },
        { header: 'Commission Rate', headerBn: 'কমিশনের হার', accessor: (row: PayrollRecord) => `${row.commissionRate.toFixed(1)}%`, align: 'center' },
        { header: 'Earned Commission', headerBn: 'কমিশন', accessor: (row: PayrollRecord) => formatCurrency(row.earnedCommission), align: 'right', footer: formatCurrency(kpis.totalCommission) },
        { header: 'Deductions', headerBn: 'কর্তন', accessor: (row: PayrollRecord) => formatCurrency(row.deductions), align: 'right', footer: formatCurrency(kpis.totalDeductions) },
        { header: 'Net Pay', headerBn: 'নিট বেতন', accessor: (row: PayrollRecord) => formatCurrency(row.netPay), align: 'right', footer: formatCurrency(kpis.netPayrollCost) },
      ];
    } else if (activeTab === 'top-performers') {
      return [
        { header: 'Rank', headerBn: 'র‌্যাংক', accessor: (row: TopPerformerRecord) => `#${row.rank}`, align: 'center' },
        { header: 'Employee Name', headerBn: 'কর্মচারীর নাম', accessor: (row: TopPerformerRecord) => row.name },
        { header: 'Primary Outlet', headerBn: 'প্রধান শাখা', accessor: (row: TopPerformerRecord) => row.primaryOutlet },
        { header: 'Sales Volume', headerBn: 'বিক্রয় পরিমাণ', accessor: (row: TopPerformerRecord) => formatCurrency(row.salesVolume), align: 'right', footer: formatCurrency(kpis.totalSalesContribution) },
        { header: 'Orders Completed', headerBn: 'সম্পন্ন অর্ডার', accessor: (row: TopPerformerRecord) => row.ordersCompleted.toString(), align: 'center' },
        { header: 'Customer Satisfaction', headerBn: 'গ্রাহক সন্তুষ্টি', accessor: (row: TopPerformerRecord) => `${row.satisfaction.toFixed(1)} ★`, align: 'center' },
        { header: 'Growth Index', headerBn: 'গ্রোথ ইনডেক্স', accessor: (row: TopPerformerRecord) => `${row.growthIndex.toFixed(1)}%`, align: 'right' },
      ];
    } else if (activeTab === 'logs') {
      return [
        { header: 'Employee Name', headerBn: 'কর্মচারীর নাম', accessor: (row: ActivityLogRecord) => row.employeeName },
        { header: 'Action Type', headerBn: 'ক্রিয়ার ধরন', accessor: (row: ActivityLogRecord) => LOG_ACTION_LABELS[row.actionType] },
        { header: 'Module', headerBn: 'মডিউল', accessor: (row: ActivityLogRecord) => row.module },
        { header: 'Details', headerBn: 'বিস্তারিত', accessor: (row: ActivityLogRecord) => row.details },
        { header: 'Timestamp', headerBn: 'সময়', accessor: (row: ActivityLogRecord) => format(new Date(row.timestamp), 'dd MMM yyyy, hh:mm a') },
        { header: 'IP / Device', headerBn: 'আইপি / ডিভাইস', accessor: (row: ActivityLogRecord) => row.device },
      ];
    }
    return [];
  }, [activeTab, kpis, branches, formatCurrency]);

  const printDataArray = useMemo(() => {
    if (activeTab === 'performance') return performanceRecords;
    if (activeTab === 'sales') return salesByEmployee;
    if (activeTab === 'attendance') return attendanceRecords;
    if (activeTab === 'payroll') return payrollRecords;
    if (activeTab === 'top-performers') return topPerformers;
    if (activeTab === 'logs') return activityLogs;
    return [];
  }, [activeTab, performanceRecords, salesByEmployee, attendanceRecords, payrollRecords, topPerformers, activityLogs]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Employee Reports"
        titleBn="কর্মচারী রিপোর্ট"
        subtitle="Track staff productivity, sales contributions, attendance, commissions, and activity audit logs."
        subtitleBn="কর্মচারীদের উৎপাদনশীলতা, বিক্রয় অবদান, উপস্থিতি, কমিশন এবং কার্যকলাপ অডিট লগ মনিটর করুন।"
        icon={Users}
        isBangla={isBangla}
      >
        <div className="flex gap-2 flex-wrap justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrintOpen(true)}
            disabled={isPageLoading}
          >
            <FileText className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-foreground" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: isBangla ? 'এক্সপোর্ট সম্পন্ন' : 'Export Completed',
                description: `Excel export completed for employee ${activeTab.toUpperCase()} report.`,
              });
            }}
            disabled={isPageLoading}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-foreground" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: isBangla ? 'এক্সপোর্ট সম্পন্ন' : 'Export Completed',
                description: `CSV export completed for employee ${activeTab.toUpperCase()} report.`,
              });
            }}
            disabled={isPageLoading}
          >
            <Download className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-foreground" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrintOpen(true)}
            disabled={isPageLoading}
          >
            <Printer className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-foreground" />
            {isBangla ? 'প্রিন্ট' : 'Print'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isPageLoading}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", (isRefreshing || isPageLoading) && "animate-spin")} />
            {isBangla ? 'রিফ্রেশ' : 'Refresh'}
          </Button>
        </div>
      </PageHeader>

      {/* Global Filter Bar */}
      <Card className="border-border/60 shadow-sm overflow-hidden bg-background">
        <CardContent className="p-4 space-y-3">
          {/* Main Primary Filters Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full">

            {/* Left side: Search & Core Selects */}
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              {/* Search Employee */}
              <div className="relative w-full md:w-60 shrink-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isBangla ? 'কর্মচারীর নাম, আইডি বা পদবি...' : 'Search employee name, ID, designation...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-9 bg-background w-full"
                />
              </div>

              {/* Period Selector */}
              <div className="shrink-0">
                <Select value={period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="bg-background text-xs h-9 min-w-[130px] w-auto flex items-center justify-start gap-1">
                    <span className="text-muted-foreground mr-0.5">{isBangla ? 'সময়:' : 'Period:'}</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">{isBangla ? 'গত ৭ দিন' : 'Last 7 days'}</SelectItem>
                    <SelectItem value="30d">{isBangla ? 'গত ৩০ দিন' : 'Last 30 days'}</SelectItem>
                    <SelectItem value="90d">{isBangla ? 'গত ৯০ দিন' : 'Last 90 days'}</SelectItem>
                    <SelectItem value="1y">{isBangla ? 'গত ১ বছর' : 'Last year'}</SelectItem>
                    <SelectItem value="custom">{isBangla ? 'কাস্টম রেঞ্জ' : 'Custom Range'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range Popover */}
              {period === 'custom' && (
                <div className="shrink-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 text-xs justify-start font-normal bg-background flex items-center gap-1 min-w-[155px] w-auto">
                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground mr-0.5">{isBangla ? 'তারিখ:' : 'Dates:'}</span>
                        <span className="truncate">
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>{format(dateRange.from, 'dd LLL')} - {format(dateRange.to, 'dd LLL')}</>
                            ) : (
                              format(dateRange.from, 'dd LLL')
                            )
                          ) : (
                            isBangla ? 'বাছুন' : 'Select'
                          )}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from || new Date()}
                        selected={dateRange as any}
                        onSelect={(range: any) => {
                          setDateRange(range || { from: undefined, to: undefined });
                        }}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Branch Selector */}
              <div className="shrink-0">
                <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                  <SelectTrigger className="bg-background text-xs h-9 min-w-[140px] w-auto flex items-center justify-start gap-1">
                    <span className="text-muted-foreground mr-0.5">{isBangla ? 'শাখা:' : 'Branch:'}</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব শাখা' : 'All Branches'}</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right side: Expand Toggle, Apply/Reset Actions */}
            <div className="flex items-center gap-1.5 shrink-0 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={cn(
                  "h-9 gap-1.5 text-xs font-semibold shrink-0 transition-all",
                  showAdvanced && "bg-primary/5 text-primary border-primary/30"
                )}
              >
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                {isBangla ? 'আরো ফিল্টার' : 'More Filters'}
                {activeAdvancedCount > 0 && (
                  <Badge variant="default" className="ml-1 h-5 min-w-5 rounded-full px-1 flex items-center justify-center text-[10px] bg-primary text-primary-foreground font-black">
                    {activeAdvancedCount}
                  </Badge>
                )}
              </Button>
              <Button onClick={handleApplyFilters} className="bg-primary hover:bg-primary/95 text-xs h-9 px-3 gap-1 shrink-0 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isBangla ? 'প্রয়োগ' : 'Apply'}
              </Button>
              <Button variant="outline" onClick={handleResetFilters} className="text-xs h-9 px-2.5 shrink-0">
                {isBangla ? 'রিসেট' : 'Reset'}
              </Button>
            </div>

          </div>

          {/* Advanced Filters Expandable Grid Section */}
          {showAdvanced && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-muted/50 mt-3 animate-fadeIn">

              {/* Role Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground">{isBangla ? 'ভূমিকা' : 'Employee Role'}</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="bg-background text-xs h-9 w-full flex items-center justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব ভূমিকা' : 'All Roles'}</SelectItem>
                    <SelectItem value="owner">{isBangla ? 'মালিক' : 'Owner'}</SelectItem>
                    <SelectItem value="manager">{isBangla ? 'ম্যানেজার' : 'Manager'}</SelectItem>
                    <SelectItem value="staff">{isBangla ? 'কর্মচারী' : 'Staff'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground">{isBangla ? 'কর্মচারীর অবস্থা' : 'Employment Status'}</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-background text-xs h-9 w-full flex items-center justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isBangla ? 'সব অবস্থা' : 'All Statuses'}</SelectItem>
                    <SelectItem value="active">{isBangla ? 'সক্রিয়' : 'Active'}</SelectItem>
                    <SelectItem value="onleave">{isBangla ? 'ছুটিতে' : 'On Leave'}</SelectItem>
                    <SelectItem value="inactive">{isBangla ? 'নিষ্ক্রিয়' : 'Inactive'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          )}

          {/* Active Filters Badges / Tags Row */}
          {activeFilterChips.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-muted/30">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mr-1">
                {isBangla ? 'সক্রিয় ফিল্টারসমূহ:' : 'Active Filters:'}
              </span>
              {activeFilterChips.map((chip) => (
                <Badge
                  key={chip.key}
                  variant="secondary"
                  className="h-6 gap-1 text-[10px] font-semibold bg-indigo-50 text-indigo-950 hover:bg-indigo-100 border border-indigo-100 pl-2 pr-1 rounded-full shrink-0"
                >
                  <span>{chip.label}:</span>
                  <span className="font-bold text-foreground">{chip.valueText}</span>
                  <button
                    onClick={() => handleRemoveFilter(chip.key)}
                    className="h-4 w-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors ml-0.5 shrink-0"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-6 text-[10px] px-2 font-bold text-red-600 hover:text-red-700 hover:bg-red-50/50 ml-auto shrink-0"
              >
                {isBangla ? 'সব পরিষ্কার করুন' : 'Clear All'}
              </Button>
            </div>
          )}

        </CardContent>
      </Card>

      {isPageLoading ? (
        <div className="space-y-6">
          <div className="h-[350px] bg-card animate-pulse rounded-lg border border-border/50" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          {/* Tabs header list - 6 triggers */}
          <TabsList className="bg-muted text-muted-foreground border p-1 rounded-lg w-full flex overflow-x-auto select-none scrollbar-none h-auto flex-nowrap shrink-0">
            <TabsTrigger value="performance" className="text-xs font-bold gap-1 px-4 py-2 shrink-0">
              <Users className="h-3.5 w-3.5" />
              {isBangla ? 'পারফরম্যান্স' : 'Performance'}
            </TabsTrigger>
            <TabsTrigger value="sales" className="text-xs font-bold gap-1 px-4 py-2 shrink-0">
              <ShoppingCart className="h-3.5 w-3.5" />
              {isBangla ? 'বিক্রয়' : 'Sales by Employee'}
            </TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs font-bold gap-1 px-4 py-2 shrink-0">
              <CalendarCheck className="h-3.5 w-3.5" />
              {isBangla ? 'উপস্থিতি' : 'Attendance & Shifts'}
            </TabsTrigger>
            <TabsTrigger value="payroll" className="text-xs font-bold gap-1 px-4 py-2 shrink-0">
              <Wallet className="h-3.5 w-3.5" />
              {isBangla ? 'বেতন ও কমিশন' : 'Payroll & Commission'}
            </TabsTrigger>
            <TabsTrigger value="top-performers" className="text-xs font-bold gap-1 px-4 py-2 shrink-0">
              <Trophy className="h-3.5 w-3.5" />
              {isBangla ? 'শীর্ষ কর্মচারী' : 'Top Performers'}
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs font-bold gap-1 px-4 py-2 shrink-0">
              <ScrollText className="h-3.5 w-3.5" />
              {isBangla ? 'অডিট লগ' : 'Activity & Audit Logs'}
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: EMPLOYEE PERFORMANCE */}
          <TabsContent value="performance" className="outline-none">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeIn">
                <StatCard title={isBangla ? 'সক্রিয় কর্মচারী' : 'Active Employees'} value={kpis.activeEmployees.toString()} icon={Users} iconColor="text-indigo-600" />
                <StatCard title={isBangla ? 'মোট বিক্রয় অবদান' : 'Total Sales Contribution'} value={formatCurrency(Math.round(kpis.totalSalesContribution))} icon={DollarSign} iconColor="text-emerald-600" />
                <StatCard title={isBangla ? 'গড় বিক্রয়/কর্মচারী' : 'Avg Sales / Employee'} value={formatCurrency(Math.round(kpis.avgSales))} icon={TrendingUp} iconColor="text-blue-600" />
                <StatCard title={isBangla ? 'স্টাফ রেটিং' : 'Staff Rating'} value={`${kpis.avgRating.toFixed(1)} / 5`} icon={Star} iconColor="text-amber-600" />
              </div>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold">{isBangla ? 'কর্মচারী পারফরম্যান্স ম্যাট্রিক্স' : 'Employee Performance Matrix'}</CardTitle>
                  <CardDescription className="text-xs">{isBangla ? 'বিক্রয় অবদান, হ্যান্ডেল করা অর্ডার এবং রেটিং অনুযায়ী কর্মচারীদের সারসংক্ষেপ।' : 'Consolidated staff productivity summarizing sales contribution, orders handled, and ratings.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>{isBangla ? 'কর্মচারী' : 'Employee Name'}</TableHead>
                          <TableHead>{isBangla ? 'কোড / আইডি' : 'Code / ID'}</TableHead>
                          <TableHead>{isBangla ? 'পদবি' : 'Designation'}</TableHead>
                          <TableHead>{isBangla ? 'শাখা' : 'Branch'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'মোট বিক্রয়' : 'Total Sales'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'অর্ডার সংখ্যা' : 'Orders Handled'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'রেটিং' : 'Rating'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'অবস্থা' : 'Status'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedPerformance.length > 0 ? (
                          paginatedPerformance.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="font-bold text-foreground">{row.name}</TableCell>
                              <TableCell className="font-mono text-xs">{row.code}</TableCell>
                              <TableCell className="text-slate-700">{row.designation}</TableCell>
                              <TableCell>{getBranchName(branches, row.branchId)}</TableCell>
                              <TableCell className="text-right font-bold text-indigo-650 font-mono">{formatCurrency(row.totalSales)}</TableCell>
                              <TableCell className="text-center font-medium">{row.ordersHandled}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-amber-50 border-amber-200 text-amber-700">
                                  {row.rating.toFixed(1)} ★
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={cn(
                                  "text-[10px] font-black rounded-full px-2 py-0.5 uppercase",
                                  row.status === 'Active' ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : row.status === 'On Leave' ? "bg-amber-50 text-amber-700 hover:bg-amber-50" : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                                )}>
                                  {row.status.toUpperCase()}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground text-xs font-semibold">
                              {isBangla ? 'কোনো কর্মচারী পাওয়া যায়নি।' : 'No employees found for the selected filters.'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {performanceRecords.length > itemsPerPage && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground font-semibold">
                        {isBangla ? `পৃষ্ঠা ${performancePage} এর ${Math.ceil(performanceRecords.length / itemsPerPage)}` : `Page ${performancePage} of ${Math.ceil(performanceRecords.length / itemsPerPage)}`}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={performancePage === 1} onClick={() => setPerformancePage(p => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={performancePage >= Math.ceil(performanceRecords.length / itemsPerPage)} onClick={() => setPerformancePage(p => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: SALES BY EMPLOYEE */}
          <TabsContent value="sales" className="outline-none">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeIn">
                <StatCard title={isBangla ? 'মোট চালান' : 'Total Invoices Handled'} value={kpis.totalInvoices.toString()} icon={ReceiptText} iconColor="text-indigo-600" />
                <StatCard title={isBangla ? 'মোট আয়' : 'Gross Revenue'} value={formatCurrency(Math.round(kpis.grossRevenue))} icon={CircleDollarSign} iconColor="text-emerald-600" />
                <StatCard title={isBangla ? 'গড় টিকিট সাইজ' : 'Average Ticket Size'} value={formatCurrency(Math.round(kpis.avgTicket))} icon={Target} iconColor="text-blue-600" />
                <StatCard title={isBangla ? 'লক্ষ্য অর্জন' : 'Target Achievement'} value={`${kpis.targetAchievement.toFixed(1)}%`} icon={Zap} iconColor="text-amber-600" />
              </div>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold">{isBangla ? 'কর্মচারী বিক্রয় বিশ্লেষণ' : 'Sales by Employee'}</CardTitle>
                  <CardDescription className="text-xs">{isBangla ? 'কর্মচারী অনুযায়ী চালান, মোট বিক্রয়, ছাড় এবং লক্ষ্য অর্জনের হার।' : 'Per-employee invoice volumes, gross sales, discounts, and target achievement percentages.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>{isBangla ? 'কর্মচারী' : 'Employee Name'}</TableHead>
                          <TableHead>{isBangla ? 'শাখা' : 'Branch'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'চালান সংখ্যা' : 'Invoices Count'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'মোট বিক্রয়' : 'Gross Sales'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'ছাড়' : 'Discounts Given'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'নিট আয়' : 'Net Revenue'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'লক্ষ্য বনাম অর্জন' : 'Target vs Actual %'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedSales.length > 0 ? (
                          paginatedSales.map((row) => (
                            <TableRow key={row.employeeId}>
                              <TableCell className="font-bold text-foreground">{row.name}</TableCell>
                              <TableCell>{row.branchName}</TableCell>
                              <TableCell className="text-center font-medium">{row.invoices}</TableCell>
                              <TableCell className="text-right font-bold text-indigo-650 font-mono">{formatCurrency(row.grossSales)}</TableCell>
                              <TableCell className="text-right font-mono text-red-600">{formatCurrency(row.discountsGiven)}</TableCell>
                              <TableCell className="text-right font-bold font-mono text-emerald-600">{formatCurrency(row.netRevenue)}</TableCell>
                              <TableCell className={cn("text-right font-black font-mono", row.targetAchievement >= 100 ? "text-emerald-700" : row.targetAchievement >= 80 ? "text-amber-600" : "text-red-650")}>
                                {row.targetAchievement.toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-xs font-semibold">
                              {isBangla ? 'কোনো বিক্রয় রেকর্ড পাওয়া যায়নি।' : 'No sales records found for the selected filters.'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {salesByEmployee.length > itemsPerPage && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground font-semibold">
                        {isBangla ? `পৃষ্ঠা ${salesPage} এর ${Math.ceil(salesByEmployee.length / itemsPerPage)}` : `Page ${salesPage} of ${Math.ceil(salesByEmployee.length / itemsPerPage)}`}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={salesPage === 1} onClick={() => setSalesPage(p => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={salesPage >= Math.ceil(salesByEmployee.length / itemsPerPage)} onClick={() => setSalesPage(p => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 3: ATTENDANCE & SHIFTS */}
          <TabsContent value="attendance" className="outline-none">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeIn">
                <StatCard title={isBangla ? 'আজ উপস্থিত' : 'Present Today'} value={kpis.presentToday.toString()} icon={CalendarCheck} iconColor="text-emerald-600" />
                <StatCard title={isBangla ? 'দেরিতে আসা' : 'Late Arrivals'} value={kpis.lateArrivals.toString()} icon={AlarmClock} iconColor="text-amber-600" />
                <StatCard title={isBangla ? 'মোট কাজের ঘন্টা' : 'Total Working Hours'} value={formatNumber(kpis.totalWorkedHours)} icon={Clock} iconColor="text-indigo-600" />
                <StatCard title={isBangla ? 'ওভারটাইম ঘন্টা' : 'Overtime Hours'} value={formatNumber(kpis.overtimeHours)} icon={Timer} iconColor="text-blue-600" />
              </div>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold">{isBangla ? 'উপস্থিতি ও শিফট রেজিস্টার' : 'Attendance & Shift Register'}</CardTitle>
                  <CardDescription className="text-xs">{isBangla ? 'উপস্থিতি, অনুপস্থিতি, দেরি এবং কাজের ঘন্টার হিসাব কর্মচারী অনুযায়ী।' : 'Attendance, absence, lateness, and worked-hours registers grouped by employee.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>{isBangla ? 'কর্মচারী' : 'Employee Name'}</TableHead>
                          <TableHead>{isBangla ? 'শাখা' : 'Branch'}</TableHead>
                          <TableHead>{isBangla ? 'শিফট' : 'Shift'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'উপস্থিত দিন' : 'Days Present'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'অনুপস্থিত দিন' : 'Days Absent'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'দেরি সংখ্যা' : 'Late Count'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'কাজের ঘন্টা' : 'Total Worked Hours'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'ওভারটাইম' : 'Overtime Hours'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'আজকের অবস্থা' : 'Today'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedAttendance.length > 0 ? (
                          paginatedAttendance.map((row) => (
                            <TableRow key={row.employeeId}>
                              <TableCell className="font-bold text-foreground">{row.name}</TableCell>
                              <TableCell>{row.branchName}</TableCell>
                              <TableCell className="text-slate-700 text-xs">{row.shift}</TableCell>
                              <TableCell className="text-center font-medium text-emerald-700">{row.daysPresent}</TableCell>
                              <TableCell className="text-center font-medium text-red-650">{row.daysAbsent}</TableCell>
                              <TableCell className="text-center font-medium text-amber-600">{row.lateCount}</TableCell>
                              <TableCell className="text-right font-mono font-semibold">{row.workedHours}h</TableCell>
                              <TableCell className={cn("text-right font-mono font-semibold", row.overtimeHours > 0 ? "text-indigo-650" : "text-slate-400")}>
                                {row.overtimeHours > 0 ? `${row.overtimeHours}h` : '—'}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={cn(
                                  "text-[10px] font-black rounded-full px-2 py-0.5",
                                  row.todayStatus === 'Present' ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : row.todayStatus === 'Late' ? "bg-amber-50 text-amber-700 hover:bg-amber-50" : row.todayStatus === 'Absent' ? "bg-red-50 text-red-700 hover:bg-red-50" : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                                )}>
                                  {row.todayStatus.toUpperCase()}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center text-muted-foreground text-xs font-semibold">
                              {isBangla ? 'কোনো উপস্থিতি রেকর্ড পাওয়া যায়নি।' : 'No attendance records found for the selected filters.'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {attendanceRecords.length > itemsPerPage && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground font-semibold">
                        {isBangla ? `পৃষ্ঠা ${attendancePage} এর ${Math.ceil(attendanceRecords.length / itemsPerPage)}` : `Page ${attendancePage} of ${Math.ceil(attendanceRecords.length / itemsPerPage)}`}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={attendancePage === 1} onClick={() => setAttendancePage(p => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={attendancePage >= Math.ceil(attendanceRecords.length / itemsPerPage)} onClick={() => setAttendancePage(p => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 4: PAYROLL & COMMISSION */}
          <TabsContent value="payroll" className="outline-none">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeIn">
                <StatCard title={isBangla ? 'মূল বেতন ব্যয়' : 'Base Salary Expense'} value={formatCurrency(Math.round(kpis.baseSalaryExpense))} icon={Wallet} iconColor="text-indigo-600" />
                <StatCard title={isBangla ? 'মোট কমিশন' : 'Total Commission Earned'} value={formatCurrency(Math.round(kpis.totalCommission))} icon={Banknote} iconColor="text-emerald-600" />
                <StatCard title={isBangla ? 'কর্তন' : 'Deductions'} value={formatCurrency(Math.round(kpis.totalDeductions))} icon={Landmark} iconColor="text-red-600" />
                <StatCard title={isBangla ? 'নিট বেতন ব্যয়' : 'Net Payroll Cost'} value={formatCurrency(Math.round(kpis.netPayrollCost))} icon={Calculator} iconColor="text-amber-600" />
              </div>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold">{isBangla ? 'বেতন ও কমিশন হিসাব' : 'Payroll & Commission Statement'}</CardTitle>
                  <CardDescription className="text-xs">{isBangla ? 'মূল বেতন, কমিশন, কর্তন এবং নিট প্রদেয় পরিমাণ কর্মচারী অনুযায়ী।' : 'Base salary, earned commission, deductions, and net payable amounts per employee.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>{isBangla ? 'কর্মচারী' : 'Employee Name'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'মূল বেতন' : 'Base Salary'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'মোট বিক্রয়' : 'Total Sales'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'কমিশন হার' : 'Commission Rate %'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'কমিশন' : 'Earned Commission'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'কর্তন' : 'Deductions'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'নিট বেতন' : 'Net Pay'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedPayroll.length > 0 ? (
                          paginatedPayroll.map((row) => (
                            <TableRow key={row.employeeId}>
                              <TableCell className="font-bold text-foreground">{row.name}</TableCell>
                              <TableCell className="text-right font-mono">{formatCurrency(row.baseSalary)}</TableCell>
                              <TableCell className="text-right font-mono font-semibold text-indigo-650">{formatCurrency(row.totalSales)}</TableCell>
                              <TableCell className="text-center font-medium">{row.commissionRate.toFixed(1)}%</TableCell>
                              <TableCell className="text-right font-mono font-bold text-emerald-600">{formatCurrency(row.earnedCommission)}</TableCell>
                              <TableCell className="text-right font-mono text-red-600">{formatCurrency(row.deductions)}</TableCell>
                              <TableCell className="text-right font-black font-mono">{formatCurrency(row.netPay)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-xs font-semibold">
                              {isBangla ? 'কোনো বেতন রেকর্ড পাওয়া যায়নি।' : 'No payroll records found for the selected filters.'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {payrollRecords.length > itemsPerPage && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground font-semibold">
                        {isBangla ? `পৃষ্ঠা ${payrollPage} এর ${Math.ceil(payrollRecords.length / itemsPerPage)}` : `Page ${payrollPage} of ${Math.ceil(payrollRecords.length / itemsPerPage)}`}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={payrollPage === 1} onClick={() => setPayrollPage(p => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={payrollPage >= Math.ceil(payrollRecords.length / itemsPerPage)} onClick={() => setPayrollPage(p => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 5: TOP PERFORMERS */}
          <TabsContent value="top-performers" className="outline-none">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeIn">
                <StatCard title={isBangla ? 'শীর্ষ বিক্রয়কর্মী' : 'Top Sales Rep'} value={kpis.topSalesRep} icon={Trophy} iconColor="text-amber-600" />
                <StatCard title={isBangla ? 'সর্বাধিক অর্ডার' : 'Highest Order Volume'} value={kpis.highestOrderVol} icon={Award} iconColor="text-indigo-600" />
                <StatCard title={isBangla ? 'দক্ষতার চ্যাম্পিয়ন' : 'Efficiency Champion'} value={kpis.efficiencyChampion} icon={Zap} iconColor="text-emerald-600" />
                <StatCard title={isBangla ? 'গ্রোথ ইনডেক্স' : 'Growth Index'} value={`${kpis.growthIndex.toFixed(1)}%`} icon={TrendingUp} iconColor="text-blue-600" />
              </div>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold">{isBangla ? 'শীর্ষ পারফর্মার লিডারবোর্ড' : 'Top Performers Leaderboard'}</CardTitle>
                  <CardDescription className="text-xs">{isBangla ? 'বিক্রয় পরিমাণ, অর্ডার, সন্তুষ্টি এবং গ্রোথ ইনডেক্সের ভিত্তিতে র‌্যাংকিং।' : 'Ranked employees by sales volume, order completion, satisfaction, and growth index.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="text-center">{isBangla ? 'র‌্যাংক' : 'Rank'}</TableHead>
                          <TableHead>{isBangla ? 'কর্মচারী' : 'Employee Name'}</TableHead>
                          <TableHead>{isBangla ? 'প্রধান শাখা' : 'Primary Outlet'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'বিক্রয় পরিমাণ' : 'Sales Volume'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'সম্পন্ন অর্ডার' : 'Orders Completed'}</TableHead>
                          <TableHead className="text-center">{isBangla ? 'সন্তুষ্টি' : 'Customer Satisfaction'}</TableHead>
                          <TableHead className="text-right">{isBangla ? 'গ্রোথ ইনডেক্স' : 'Growth Index'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTop.length > 0 ? (
                          paginatedTop.map((row) => (
                            <TableRow key={row.rank}>
                              <TableCell className="text-center font-bold">
                                <Badge variant="outline" className={cn(
                                  "text-xs h-6 w-6 p-0 rounded-full flex items-center justify-center font-bold",
                                  row.rank === 1 ? "bg-amber-50 border-amber-300 text-amber-700" : row.rank === 2 ? "bg-slate-100 border-slate-300 text-slate-700" : row.rank === 3 ? "bg-orange-50 border-orange-300 text-orange-700" : "bg-indigo-50 border-indigo-250 text-indigo-950"
                                )}>
                                  {row.rank}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-bold text-foreground">
                                <div className="flex flex-col">
                                  <span>{row.name}</span>
                                  <span className="text-[10px] text-muted-foreground font-medium">{row.designation}</span>
                                </div>
                              </TableCell>
                              <TableCell>{row.primaryOutlet}</TableCell>
                              <TableCell className="text-right font-bold text-indigo-650 font-mono">{formatCurrency(row.salesVolume)}</TableCell>
                              <TableCell className="text-center font-medium">{row.ordersCompleted}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-amber-50 border-amber-200 text-amber-700">
                                  {row.satisfaction.toFixed(1)} ★
                                </Badge>
                              </TableCell>
                              <TableCell className={cn("text-right font-black font-mono", row.growthIndex >= 0 ? "text-emerald-600" : "text-red-650")}>
                                {row.growthIndex > 0 ? '+' : ''}{row.growthIndex.toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-xs font-semibold">
                              {isBangla ? 'কোনো পারফরম্যান্স রেকর্ড পাওয়া যায়নি।' : 'No performance records found for the selected filters.'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {topPerformers.length > itemsPerPage && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground font-semibold">
                        {isBangla ? `পৃষ্ঠা ${topPage} এর ${Math.ceil(topPerformers.length / itemsPerPage)}` : `Page ${topPage} of ${Math.ceil(topPerformers.length / itemsPerPage)}`}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={topPage === 1} onClick={() => setTopPage(p => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={topPage >= Math.ceil(topPerformers.length / itemsPerPage)} onClick={() => setTopPage(p => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 6: ACTIVITY & AUDIT LOGS */}
          <TabsContent value="logs" className="outline-none">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeIn">
                <StatCard title={isBangla ? 'মোট কার্যকলাপ' : 'Total Actions Logged'} value={kpis.totalActions.toString()} icon={ScrollText} iconColor="text-indigo-600" />
                <StatCard title={isBangla ? 'তৈরি চালান' : 'Invoices Created'} value={kpis.invoicesCreated.toString()} icon={FilePlus2} iconColor="text-emerald-600" />
                <StatCard title={isBangla ? 'সম্পাদনা/মুছে ফেলা' : 'Edits / Deletions'} value={kpis.editsDeletions.toString()} icon={Pencil} iconColor="text-amber-600" />
                <StatCard title={isBangla ? 'সিস্টেম অ্যাক্সেস' : 'System Accesses'} value={kpis.systemAccesses.toString()} icon={MonitorSmartphone} iconColor="text-blue-600" />
              </div>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold">{isBangla ? 'কার্যকলাপ ও অডিট ট্রেইল' : 'Activity & Audit Trail'}</CardTitle>
                  <CardDescription className="text-xs">{isBangla ? 'চালান তৈরি, সম্পাদনা, লগইন এবং সিস্টেম অ্যাক্সেসের সম্পূর্ণ লগ।' : 'Full trail of invoice creations, edits, logins, and system access events.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>{isBangla ? 'কর্মচারী' : 'Employee Name'}</TableHead>
                          <TableHead>{isBangla ? 'ক্রিয়ার ধরন' : 'Action Type'}</TableHead>
                          <TableHead>{isBangla ? 'মডিউল' : 'Module'}</TableHead>
                          <TableHead>{isBangla ? 'বিস্তারিত' : 'Details'}</TableHead>
                          <TableHead>{isBangla ? 'সময়' : 'Timestamp'}</TableHead>
                          <TableHead>{isBangla ? 'আইপি / ডিভাইস' : 'IP / Device'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedLogs.length > 0 ? (
                          paginatedLogs.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="font-bold text-foreground">{row.employeeName}</TableCell>
                              <TableCell>
                                <Badge className={cn(
                                  "text-[10px] font-black rounded-full px-2 py-0.5",
                                  row.actionType === 'invoice_created' ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : row.actionType === 'invoice_edited' ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : row.actionType === 'invoice_deleted' ? "bg-red-50 text-red-700 hover:bg-red-50" : row.actionType === 'login' ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-50" : row.actionType === 'payment' ? "bg-teal-50 text-teal-700 hover:bg-teal-50" : row.actionType === 'stock_adjustment' ? "bg-amber-50 text-amber-700 hover:bg-amber-50" : "bg-violet-50 text-violet-700 hover:bg-violet-50"
                                )}>
                                  {LOG_ACTION_LABELS[row.actionType]}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-700 text-xs">{row.module}</TableCell>
                              <TableCell className="text-xs max-w-[280px] truncate text-slate-600">{row.details}</TableCell>
                              <TableCell className="font-mono text-xs">{format(new Date(row.timestamp), 'dd MMM yyyy, hh:mm a')}</TableCell>
                              <TableCell className="text-xs text-slate-700">{row.device}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-xs font-semibold">
                              {isBangla ? 'কোনো অডিট লগ পাওয়া যায়নি।' : 'No audit logs found for the selected filters.'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {activityLogs.length > itemsPerPage && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground font-semibold">
                        {isBangla ? `পৃষ্ঠা ${logsPage} এর ${Math.ceil(activityLogs.length / itemsPerPage)}` : `Page ${logsPage} of ${Math.ceil(activityLogs.length / itemsPerPage)}`}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={logsPage === 1} onClick={() => setLogsPage(p => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={logsPage >= Math.ceil(activityLogs.length / itemsPerPage)} onClick={() => setLogsPage(p => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      )}

      {/* Printable A4 Report Preview overlay */}
      <PrintReportPreview
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        title={isBangla ? `কর্মচারী রিপোর্ট (${activeTab.toUpperCase()})` : `Employee Report (${activeTab.toUpperCase()})`}
        titleBn={`কর্মচারী রিপোর্ট (${activeTab.toUpperCase()})`}
        subtitle="SME Staff Productivity & Payroll Ledger Summary"
        subtitleBn="ক্ষুদ্র ও মাঝারি ব্যবসা কর্মচারী উৎপাদনশীলতা ও বেতন রেজিস্ট্রি"
        businessName={business?.name || 'HelloKhata Business'}
        branchName={selectedBranchId === 'all' ? (isBangla ? 'সকল শাখা' : 'All Branches') : getBranchName(branches, selectedBranchId)}
        businessAddress={(business as any)?.address || (isBangla ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh')}
        contactInfo={business?.phone || '+৮৮০ ১৭০০০-০০০০০'}
        userName={user?.name || 'Owner'}
        dateRange={{
          start: activeFilters.dateRange.from ? format(activeFilters.dateRange.from, 'dd MMM yyyy') : undefined,
          end: activeFilters.dateRange.to ? format(activeFilters.dateRange.to, 'dd MMM yyyy') : undefined,
          period: activeFilters.period
        }}
        activeFilters={{
          period: activeFilters.period,
          branch: selectedBranchId === 'all' ? 'All' : getBranchName(branches, selectedBranchId),
          role: selectedRole === 'all' ? 'All' : selectedRole,
          status: selectedStatus === 'all' ? 'All' : selectedStatus,
        }}
        kpis={[]}
        data={printDataArray}
        columns={printColumns}
        paymentBreakdown={[]}
        branchBreakdown={[]}
        productBreakdown={[]}
        isBangla={isBangla}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}
