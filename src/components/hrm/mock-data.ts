// Hello Khata OS - HRM Module Mock Data
// হ্যালো খাতা - এইচআরএম মডিউল ডেমো ডেটা

import type {
  ActivityEvent,
  AttendanceRecord,
  AttendanceTrendPoint,
  BirthdayItem,
  DepartmentDist,
  Employee,
  LeaveBalance,
  LeaveRequest,
  PayrollRecord,
  RolePermission,
} from './types';

export const HRM_BRANCHES = [
  { id: 'branch-1', name: 'Main Branch' },
  { id: 'branch-2', name: 'Dhanmondi Branch' },
  { id: 'branch-3', name: 'Gulshan Branch' },
  { id: 'branch-4', name: 'Mirpur Branch' },
  { id: 'branch-5', name: 'Uttara Branch' },
];

export function branchName(id: string): string {
  return HRM_BRANCHES.find((b) => b.id === id)?.name || 'Main Branch';
}

export const HRM_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    employeeId: 'EMP-001',
    name: 'Abdur Rahman',
    nameBn: 'আব্দুর রহমান',
    phone: '01811112222',
    email: 'abdur.rahman@hellokhata.com',
    branchId: 'branch-1',
    department: 'Management',
    designation: 'Managing Director',
    joiningDate: '2019-03-01',
    salary: 95000,
    status: 'Active',
    gender: 'Male',
    address: 'House 12, Road 5, Dhanmondi, Dhaka',
    emergencyContact: '01712345678',
    bloodGroup: 'B+',
    nid: '1990123456789',
    shift: 'Morning (9 AM - 6 PM)',
    roleId: 'role-admin',
  },
  {
    id: 'emp-2',
    employeeId: 'EMP-002',
    name: 'Karim Uddin',
    nameBn: 'করিম উদ্দিন',
    phone: '01822223333',
    email: 'karim.uddin@hellokhata.com',
    branchId: 'branch-2',
    department: 'Sales',
    designation: 'Branch Manager',
    joiningDate: '2020-06-15',
    salary: 52000,
    status: 'Active',
    gender: 'Male',
    address: 'Flat 4B, Green View, Dhanmondi, Dhaka',
    emergencyContact: '01723456789',
    bloodGroup: 'O+',
    nid: '1991123456780',
    shift: 'Morning (9 AM - 6 PM)',
    roleId: 'role-manager',
  },
  {
    id: 'emp-3',
    employeeId: 'EMP-003',
    name: 'Nazmul Islam',
    nameBn: 'নাজমুল ইসলাম',
    phone: '01833334444',
    email: 'nazmul.islam@hellokhata.com',
    branchId: 'branch-1',
    department: 'Sales',
    designation: 'Sales Executive',
    joiningDate: '2021-02-10',
    salary: 28000,
    status: 'Active',
    gender: 'Male',
    address: 'Village Road, Savar, Dhaka',
    emergencyContact: '01734567890',
    bloodGroup: 'A+',
    nid: '1992123456781',
    shift: 'Morning (8 AM - 4 PM)',
    roleId: 'role-staff',
  },
  {
    id: 'emp-4',
    employeeId: 'EMP-004',
    name: 'Farhana Akter',
    nameBn: 'ফারহানা আক্তার',
    phone: '01844445555',
    email: 'farhana.akter@hellokhata.com',
    branchId: 'branch-3',
    department: 'Accounts & Finance',
    designation: 'Accountant',
    joiningDate: '2020-11-20',
    salary: 34000,
    status: 'Active',
    gender: 'Female',
    address: 'House 8, Road 12, Banani, Dhaka',
    emergencyContact: '01745678901',
    bloodGroup: 'AB+',
    nid: '1993123456782',
    shift: 'Morning (9 AM - 6 PM)',
    roleId: 'role-manager',
  },
  {
    id: 'emp-5',
    employeeId: 'EMP-005',
    name: 'Rashed Chowdhury',
    nameBn: 'রাশেদ চৌধুরী',
    phone: '01855556666',
    email: 'rashed.chowdhury@hellokhata.com',
    branchId: 'branch-4',
    department: 'Inventory',
    designation: 'Storekeeper',
    joiningDate: '2022-01-05',
    salary: 22000,
    status: 'On Leave',
    gender: 'Male',
    address: 'Mirpur 10, Dhaka',
    emergencyContact: '01756789012',
    bloodGroup: 'O-',
    nid: '1994123456783',
    shift: 'Night (10 PM - 6 AM)',
    roleId: 'role-staff',
  },
  {
    id: 'emp-6',
    employeeId: 'EMP-006',
    name: 'Salma Begum',
    nameBn: 'সালমা বেগম',
    phone: '01866667777',
    email: 'salma.begum@hellokhata.com',
    branchId: 'branch-1',
    department: 'HR & Admin',
    designation: 'HR Officer',
    joiningDate: '2021-07-01',
    salary: 30000,
    status: 'Active',
    gender: 'Female',
    address: 'Uttara Sector 7, Dhaka',
    emergencyContact: '01767890123',
    bloodGroup: 'B-',
    nid: '1995123456784',
    shift: 'Morning (9 AM - 6 PM)',
    roleId: 'role-hr',
  },
  {
    id: 'emp-7',
    employeeId: 'EMP-007',
    name: 'Tanvir Hossain',
    nameBn: 'তানভীর হোসেন',
    phone: '01877778888',
    email: 'tanvir.hossain@hellokhata.com',
    branchId: 'branch-5',
    department: 'Sales',
    designation: 'Sales Representative',
    joiningDate: '2023-03-12',
    salary: 19000,
    status: 'Probation',
    gender: 'Male',
    address: 'Badda, Dhaka',
    emergencyContact: '01778901234',
    bloodGroup: 'A-',
    nid: '1996123456785',
    shift: 'Evening (2 PM - 10 PM)',
    roleId: 'role-staff',
  },
  {
    id: 'emp-8',
    employeeId: 'EMP-008',
    name: 'Mitu Sarker',
    nameBn: 'মিতু সরকার',
    phone: '01888889999',
    email: 'mitu.sarker@hellokhata.com',
    branchId: 'branch-3',
    department: 'IT & Support',
    designation: 'IT Executive',
    joiningDate: '2022-09-18',
    salary: 32000,
    status: 'Active',
    gender: 'Female',
    address: 'Gulshan 1, Dhaka',
    emergencyContact: '01789012345',
    bloodGroup: 'AB-',
    nid: '1997123456786',
    shift: 'Morning (9 AM - 6 PM)',
    roleId: 'role-staff',
  },
  {
    id: 'emp-9',
    employeeId: 'EMP-009',
    name: 'Sajib Khan',
    nameBn: 'সজীব খান',
    phone: '01899990000',
    email: 'sajib.khan@hellokhata.com',
    branchId: 'branch-2',
    department: 'Marketing',
    designation: 'Marketing Executive',
    joiningDate: '2023-06-01',
    salary: 25000,
    status: 'Active',
    gender: 'Male',
    address: 'Mohammadpur, Dhaka',
    emergencyContact: '01790123456',
    bloodGroup: 'O+',
    nid: '1998123456787',
    shift: 'Morning (9 AM - 6 PM)',
    roleId: 'role-staff',
  },
  {
    id: 'emp-10',
    employeeId: 'EMP-010',
    name: 'Jesmin Nahar',
    nameBn: 'জেসমিন নাহার',
    phone: '01800001111',
    email: 'jesmin.nahar@hellokhata.com',
    branchId: 'branch-4',
    department: 'Sales',
    designation: 'Cashier',
    joiningDate: '2022-04-22',
    salary: 18000,
    status: 'Active',
    gender: 'Female',
    address: 'Kazipara, Mirpur, Dhaka',
    emergencyContact: '01701234567',
    bloodGroup: 'B+',
    nid: '1999123456788',
    shift: 'Morning (8 AM - 4 PM)',
    roleId: 'role-staff',
  },
  {
    id: 'emp-11',
    employeeId: 'EMP-011',
    name: 'Shakil Ahmed',
    nameBn: 'শাকিল আহমেদ',
    phone: '01811110000',
    email: 'shakil.ahmed@hellokhata.com',
    branchId: 'branch-1',
    department: 'Inventory',
    designation: 'Warehouse Supervisor',
    joiningDate: '2020-08-14',
    salary: 26000,
    status: 'Active',
    gender: 'Male',
    address: 'Shyamoli, Dhaka',
    emergencyContact: '01722223333',
    bloodGroup: 'A+',
    nid: '2000123456789',
    shift: 'Evening (2 PM - 10 PM)',
    roleId: 'role-manager',
  },
  {
    id: 'emp-12',
    employeeId: 'EMP-012',
    name: 'Rima Chowdhury',
    nameBn: 'রিমা চৌধুরী',
    phone: '01822220000',
    email: 'rima.chowdhury@hellokhata.com',
    branchId: 'branch-5',
    department: 'Sales',
    designation: 'Sales Executive',
    joiningDate: '2024-01-10',
    salary: 21000,
    status: 'Probation',
    gender: 'Female',
    address: 'Khilkhet, Dhaka',
    emergencyContact: '01733334444',
    bloodGroup: 'O+',
    nid: '2001123456790',
    shift: 'Morning (8 AM - 4 PM)',
    roleId: 'role-staff',
  },
];

export function employeeById(id: string): Employee | undefined {
  return HRM_EMPLOYEES.find((e) => e.id === id);
}

// ── Attendance ────────────────────────────────────────────────────────────────
const TODAY_ATTENDANCE: Omit<AttendanceRecord, 'id'>[] = [
  { employeeId: 'emp-1', name: 'Abdur Rahman', date: '', checkIn: '08:58', checkOut: '18:05', status: 'Present', hoursWorked: 9.1, overtimeHours: 0, branchId: 'branch-1', department: 'Management' },
  { employeeId: 'emp-2', name: 'Karim Uddin', date: '', checkIn: '09:01', checkOut: '18:02', status: 'Present', hoursWorked: 9.0, overtimeHours: 0, branchId: 'branch-2', department: 'Sales' },
  { employeeId: 'emp-3', name: 'Nazmul Islam', date: '', checkIn: '08:41', checkOut: '16:22', status: 'Present', hoursWorked: 7.7, overtimeHours: 0, branchId: 'branch-1', department: 'Sales' },
  { employeeId: 'emp-4', name: 'Farhana Akter', date: '', checkIn: '09:14', checkOut: '18:30', status: 'Late', hoursWorked: 8.9, overtimeHours: 0.5, branchId: 'branch-3', department: 'Accounts & Finance' },
  { employeeId: 'emp-5', name: 'Rashed Chowdhury', date: '', checkIn: '—', checkOut: '—', status: 'Leave', hoursWorked: 0, overtimeHours: 0, branchId: 'branch-4', department: 'Inventory' },
  { employeeId: 'emp-6', name: 'Salma Begum', date: '', checkIn: '08:55', checkOut: '18:10', status: 'Present', hoursWorked: 9.2, overtimeHours: 0, branchId: 'branch-1', department: 'HR & Admin' },
  { employeeId: 'emp-7', name: 'Tanvir Hossain', date: '', checkIn: '—', checkOut: '—', status: 'Absent', hoursWorked: 0, overtimeHours: 0, branchId: 'branch-5', department: 'Sales' },
  { employeeId: 'emp-8', name: 'Mitu Sarker', date: '', checkIn: '08:52', checkOut: '17:40', status: 'Work From Home', hoursWorked: 8.8, overtimeHours: 0, branchId: 'branch-3', department: 'IT & Support' },
  { employeeId: 'emp-9', name: 'Sajib Khan', date: '', checkIn: '09:20', checkOut: '19:05', status: 'Overtime', hoursWorked: 9.7, overtimeHours: 1.0, branchId: 'branch-2', department: 'Marketing' },
  { employeeId: 'emp-10', name: 'Jesmin Nahar', date: '', checkIn: '08:30', checkOut: '15:45', status: 'Half Day', hoursWorked: 7.2, overtimeHours: 0, branchId: 'branch-4', department: 'Sales' },
  { employeeId: 'emp-11', name: 'Shakil Ahmed', date: '', checkIn: '14:05', checkOut: '22:10', status: 'Present', hoursWorked: 8.1, overtimeHours: 0, branchId: 'branch-1', department: 'Inventory' },
  { employeeId: 'emp-12', name: 'Rima Chowdhury', date: '', checkIn: '08:47', checkOut: '16:15', status: 'Present', hoursWorked: 7.5, overtimeHours: 0, branchId: 'branch-5', department: 'Sales' },
];

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayAttendance(date: Date = new Date()): AttendanceRecord[] {
  const iso = toISODate(date);
  return TODAY_ATTENDANCE.map((a, i) => ({ ...a, id: `att-${iso}-${i}`, date: iso }));
}

// Generate attendance history for the last N days
export function generateAttendanceHistory(days = 30, endDate: Date = new Date()): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const statuses: AttendanceRecord['status'][] = [
    'Present',
    'Present',
    'Present',
    'Late',
    'Present',
    'Absent',
    'Leave',
    'Present',
    'Present',
    'Half Day',
    'Present',
    'Work From Home',
    'Present',
    'Overtime',
  ];

  for (let d = 0; d < days; d++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - d);
    if (date.getDay() === 0) continue; // Skip Sundays
    HRM_EMPLOYEES.forEach((emp, i) => {
      const status = statuses[(i + d * 3) % statuses.length];
      const checkInMap: Record<string, string> = {
        Present: '08:45',
        Late: '09:25',
        'Half Day': '08:40',
        'Work From Home': '09:00',
        Overtime: '08:55',
      };
      const checkOutMap: Record<string, string> = {
        Present: '17:55',
        Late: '18:10',
        'Half Day': '13:20',
        'Work From Home': '18:00',
        Overtime: '20:05',
      };
      const isHoliday = status === 'Leave' || status === 'Absent';
      records.push({
        id: `att-${toISODate(date)}-${emp.id}`,
        employeeId: emp.id,
        name: emp.name,
        date: toISODate(date),
        checkIn: isHoliday ? '—' : checkInMap[status] || '08:55',
        checkOut: isHoliday ? '—' : checkOutMap[status] || '17:50',
        status,
        hoursWorked: isHoliday ? 0 : 8 + (status === 'Overtime' ? 1.2 : status === 'Half Day' ? -0.8 : Math.random() * 0.8),
        overtimeHours: status === 'Overtime' ? 1.2 : 0,
        branchId: emp.branchId,
        department: emp.department,
      });
    });
  }
  return records;
}

// ── Leave ─────────────────────────────────────────────────────────────────────
export const HRM_LEAVES: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-5',
    name: 'Rashed Chowdhury',
    type: 'Sick',
    from: toISODate(new Date()),
    to: toISODate(new Date(Date.now() + 2 * 86400000)),
    days: 3,
    reason: 'Fever and doctor advised rest for 3 days.',
    status: 'Pending',
    appliedOn: toISODate(new Date(Date.now() - 86400000)),
    branchId: 'branch-4',
    department: 'Inventory',
  },
  {
    id: 'leave-2',
    employeeId: 'emp-4',
    name: 'Farhana Akter',
    type: 'Casual',
    from: toISODate(new Date(Date.now() + 4 * 86400000)),
    to: toISODate(new Date(Date.now() + 4 * 86400000)),
    days: 1,
    reason: 'Personal family event in the village.',
    status: 'Pending',
    appliedOn: toISODate(new Date(Date.now() - 86400000)),
    branchId: 'branch-3',
    department: 'Accounts & Finance',
  },
  {
    id: 'leave-3',
    employeeId: 'emp-6',
    name: 'Salma Begum',
    type: 'Annual',
    from: toISODate(new Date(Date.now() - 6 * 86400000)),
    to: toISODate(new Date(Date.now() - 3 * 86400000)),
    days: 4,
    reason: 'Planned vacation with family.',
    status: 'Approved',
    appliedOn: toISODate(new Date(Date.now() - 14 * 86400000)),
    reviewedBy: 'Abdur Rahman',
    reviewedOn: toISODate(new Date(Date.now() - 12 * 86400000)),
    branchId: 'branch-1',
    department: 'HR & Admin',
  },
  {
    id: 'leave-4',
    employeeId: 'emp-12',
    name: 'Rima Chowdhury',
    type: 'Casual',
    from: toISODate(new Date(Date.now() - 9 * 86400000)),
    to: toISODate(new Date(Date.now() - 9 * 86400000)),
    days: 1,
    reason: 'Sick child, needed to stay home.',
    status: 'Approved',
    appliedOn: toISODate(new Date(Date.now() - 12 * 86400000)),
    reviewedBy: 'Karim Uddin',
    reviewedOn: toISODate(new Date(Date.now() - 11 * 86400000)),
    branchId: 'branch-5',
    department: 'Sales',
  },
  {
    id: 'leave-5',
    employeeId: 'emp-9',
    name: 'Sajib Khan',
    type: 'Unpaid',
    from: toISODate(new Date(Date.now() + 7 * 86400000)),
    to: toISODate(new Date(Date.now() + 9 * 86400000)),
    days: 3,
    reason: 'Higher studies exam preparation leave.',
    status: 'Pending',
    appliedOn: toISODate(new Date(Date.now() - 2 * 86400000)),
    branchId: 'branch-2',
    department: 'Marketing',
  },
  {
    id: 'leave-6',
    employeeId: 'emp-10',
    name: 'Jesmin Nahar',
    type: 'Sick',
    from: toISODate(new Date(Date.now() - 15 * 86400000)),
    to: toISODate(new Date(Date.now() - 14 * 86400000)),
    days: 2,
    reason: 'Dengue fever, hospitalized.',
    status: 'Rejected',
    appliedOn: toISODate(new Date(Date.now() - 18 * 86400000)),
    reviewedBy: 'Abdur Rahman',
    reviewedOn: toISODate(new Date(Date.now() - 16 * 86400000)),
    branchId: 'branch-4',
    department: 'Sales',
  },
  {
    id: 'leave-7',
    employeeId: 'emp-3',
    name: 'Nazmul Islam',
    type: 'Annual',
    from: toISODate(new Date(Date.now() + 12 * 86400000)),
    to: toISODate(new Date(Date.now() + 16 * 86400000)),
    days: 5,
    reason: 'Eid vacation with family.',
    status: 'Approved',
    appliedOn: toISODate(new Date(Date.now() - 5 * 86400000)),
    reviewedBy: 'Karim Uddin',
    reviewedOn: toISODate(new Date(Date.now() - 4 * 86400000)),
    branchId: 'branch-1',
    department: 'Sales',
  },
  {
    id: 'leave-8',
    employeeId: 'emp-8',
    name: 'Mitu Sarker',
    type: 'Casual',
    from: toISODate(new Date(Date.now() - 20 * 86400000)),
    to: toISODate(new Date(Date.now() - 20 * 86400000)),
    days: 1,
    reason: 'Personal work.',
    status: 'Cancelled',
    appliedOn: toISODate(new Date(Date.now() - 24 * 86400000)),
    branchId: 'branch-3',
    department: 'IT & Support',
  },
];

export const HRM_LEAVE_BALANCES: LeaveBalance[] = [
  { type: 'Casual', total: 10, used: 4, remaining: 6 },
  { type: 'Sick', total: 14, used: 6, remaining: 8 },
  { type: 'Annual', total: 21, used: 9, remaining: 12 },
  { type: 'Maternity', total: 112, used: 0, remaining: 112 },
  { type: 'Paternity', total: 14, used: 0, remaining: 14 },
  { type: 'Unpaid', total: 30, used: 3, remaining: 27 },
];

// ── Payroll ───────────────────────────────────────────────────────────────────
function payrollFor(month: Date): PayrollRecord[] {
  const base = (emp: Employee) => {
    const allowance = Math.round(emp.salary * 0.35);
    const bonus = emp.department === 'Sales' ? Math.round(emp.salary * 0.12) : Math.round(emp.salary * 0.08);
    const deduction = Math.round(emp.salary * 0.05) + 1000;
    const net = emp.salary + allowance + bonus - deduction;
    return { allowance, bonus, deduction, net };
  };
  const monthLabel = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const paymentIndex = month.getMonth();
  return HRM_EMPLOYEES.map((emp, i) => {
    const c = base(emp);
    const status: PayrollRecord['paymentStatus'] =
      emp.status === 'Inactive'
        ? 'Failed'
        : paymentIndex >= 7 || (paymentIndex >= 5 && i % 4 === 0)
          ? 'Paid'
          : i % 3 === 0
            ? 'Processing'
            : 'Pending';
    return {
      id: `pay-${monthLabel}-${emp.id}`,
      employeeId: emp.id,
      name: emp.name,
      branchId: emp.branchId,
      department: emp.department,
      designation: emp.designation,
      basicSalary: emp.salary,
      allowance: c.allowance,
      bonus: c.bonus,
      deduction: c.deduction,
      netSalary: c.net,
      paymentStatus: status,
      paymentDate: status === 'Paid' ? `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-28` : undefined,
      paymentMethod: status === 'Paid' ? 'bKash' : undefined,
    };
  });
}

export function hrmPayroll(month: Date = new Date()): PayrollRecord[] {
  return payrollFor(month);
}

// ── Roles & Permissions ───────────────────────────────────────────────────────
export const HRM_ROLES: RolePermission[] = [
  {
    id: 'role-admin',
    name: 'Administrator',
    description: 'Full access to every module, branch, and setting.',
    employees: 2,
    isSystem: true,
    modules: Object.fromEntries(
      ['Dashboard', 'Sales', 'Purchases', 'Parties', 'Inventory', 'Finance', 'HRM', 'Reports', 'Settings'].map((m) => [
        m,
        { view: true, create: true, edit: true, delete: true, approve: true, export: true },
      ])
    ),
  },
  {
    id: 'role-manager',
    name: 'Branch Manager',
    description: 'Manage operations, staff, and reports for assigned branches.',
    employees: 4,
    modules: {
      Dashboard: { view: true, create: false, edit: false, delete: false, approve: true, export: true },
      Sales: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      Purchases: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      Parties: { view: true, create: true, edit: true, delete: false, approve: false, export: true },
      Inventory: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      Finance: { view: true, create: false, edit: false, delete: false, approve: true, export: true },
      HRM: { view: true, create: true, edit: false, delete: false, approve: true, export: true },
      Reports: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      Settings: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
    },
  },
  {
    id: 'role-hr',
    name: 'HR Officer',
    description: 'Manage employees, attendance, leave, and payroll data.',
    employees: 1,
    modules: {
      Dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Sales: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Purchases: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Parties: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Inventory: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      Finance: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      HRM: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      Reports: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      Settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
    },
  },
  {
    id: 'role-staff',
    name: 'Staff',
    description: 'Day-to-day sales, purchasing, and inventory operations.',
    employees: 5,
    modules: {
      Dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Sales: { view: true, create: true, edit: false, delete: false, approve: false, export: false },
      Purchases: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Parties: { view: true, create: true, edit: false, delete: false, approve: false, export: false },
      Inventory: { view: true, create: true, edit: false, delete: false, approve: false, export: false },
      Finance: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      HRM: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Reports: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      Settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
    },
  },
];

export const ROLE_TEMPLATES = [
  { id: 'tmpl-owner', name: 'Business Owner', description: 'Everything across all branches and settings.', tag: 'Recommended' },
  { id: 'tmpl-manager', name: 'Outlet Manager', description: 'Operational control for a single branch.', tag: null },
  { id: 'tmpl-accountant', name: 'Accountant', description: 'Finance, receivables, and reporting access.', tag: null },
  { id: 'tmpl-cashier', name: 'Cashier', description: 'POS sales and payment collection.', tag: null },
  { id: 'tmpl-readonly', name: 'Read Only', description: 'View-only access across all modules.', tag: 'Safe' },
];

// ── Dashboard aggregates ──────────────────────────────────────────────────────
export function departmentDistribution(): DepartmentDist[] {
  const map = new Map<string, number>();
  HRM_EMPLOYEES.forEach((e) => map.set(e.department, (map.get(e.department) || 0) + 1));
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export function attendanceTrend(): AttendanceTrendPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const points: AttendanceTrendPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    points.push({
      month: `${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
      present: 82 + ((i * 7) % 10),
      late: 5 + ((i * 3) % 5),
      absent: 3 + ((i * 2) % 4),
      leave: 4 + ((i * 5) % 4),
    });
  }
  return points;
}

export function upcomingBirthdays(): BirthdayItem[] {
  return [
    { id: 'emp-6', name: 'Salma Begum', designation: 'HR Officer', day: 12, month: 'Aug', dateLabel: 'Aug 12' },
    { id: 'emp-3', name: 'Nazmul Islam', designation: 'Sales Executive', day: 18, month: 'Aug', dateLabel: 'Aug 18' },
    { id: 'emp-10', name: 'Jesmin Nahar', designation: 'Cashier', day: 27, month: 'Aug', dateLabel: 'Aug 27' },
    { id: 'emp-1', name: 'Abdur Rahman', designation: 'Managing Director', day: 5, month: 'Sep', dateLabel: 'Sep 05' },
  ];
}

export function recentActivities(): ActivityEvent[] {
  return [
    { id: 'act-1', title: 'New employee joined', titleBn: 'নতুন কর্মচারী যোগদান', detail: 'Rima Chowdhury joined as Sales Executive', detailBn: 'রিমা চৌধুরী সেলস এক্সিকিউটিভ হিসেবে যোগদান করেছেন', time: '2h ago', icon: 'join' },
    { id: 'act-2', title: 'Leave request pending', titleBn: 'ছুটির আবেদন অপেক্ষমাণ', detail: 'Rashed Chowdhury applied for 3 days sick leave', detailBn: 'রাশেদ চৌধুরী ৩ দিনের অসুস্থতাজনিত ছুটির আবেদন করেছেন', time: '4h ago', icon: 'leave' },
    { id: 'act-3', title: 'Payroll generated', titleBn: 'বেতন প্রস্তুত', detail: 'August payroll generated for 12 employees', detailBn: '১২ জন কর্মচারীর জন্য আগস্টের বেতন প্রস্তুত হয়েছে', time: 'Yesterday', icon: 'salary' },
    { id: 'act-4', title: 'Overtime approved', titleBn: 'ওভারটাইম অনুমোদিত', detail: 'Sajib Khan earned 1.0h overtime', detailBn: 'সজীব খান ১.০ ঘন্টা ওভারটাইম পেয়েছেন', time: 'Yesterday', icon: 'attendance' },
    { id: 'act-5', title: 'Promotion approved', titleBn: 'পদোন্নতি অনুমোদিত', detail: 'Tanvir Hossain promoted to Sales Executive', detailBn: 'তানভীর হোসেন সেলস এক্সিকিউটিভ হিসেবে পদোন্নতি পেয়েছেন', time: '2 days ago', icon: 'promotion' },
  ];
}
