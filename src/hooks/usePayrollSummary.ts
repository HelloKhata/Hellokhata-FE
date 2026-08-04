import { useMemo } from 'react';
import { PayrollRecord, PayrollSummary } from '@/types/payroll-register';

export const usePayrollSummary = (records: PayrollRecord[]): PayrollSummary => {
  return useMemo(() => {
    if (!records || records.length === 0) {
      return {
        totalEmployeesPaid: 0,
        grossPayroll: 0,
        totalDeductions: 0,
        netPayrollPaid: 0,
        pendingPaymentsAmount: 0,
        pendingPaymentsCount: 0,
        highestSalary: 0,
        lowestSalary: 0,
        totalOvertimePaid: 0,
        totalBonusesPaid: 0,
        averageSalary: 0,
        averageDeduction: 0,
      };
    }

    let grossPayroll = 0;
    let totalDeductions = 0;
    let netPayrollPaid = 0;
    let pendingPaymentsAmount = 0;
    let pendingPaymentsCount = 0;
    let totalEmployeesPaid = 0;
    let totalOvertimePaid = 0;
    let totalBonusesPaid = 0;

    let highestSalary = 0;
    let lowestSalary = Infinity;

    records.forEach((rec) => {
      grossPayroll += rec.grossSalary;
      totalDeductions += rec.totalDeductions;
      totalOvertimePaid += rec.overtime;
      totalBonusesPaid += rec.bonus;

      if (rec.netSalary > highestSalary) highestSalary = rec.netSalary;
      if (rec.netSalary < lowestSalary) lowestSalary = rec.netSalary;

      if (rec.paymentStatus === 'paid') {
        netPayrollPaid += rec.netSalary;
        totalEmployeesPaid += 1;
      } else if (rec.paymentStatus === 'pending' || rec.paymentStatus === 'failed') {
        pendingPaymentsAmount += rec.netSalary;
        pendingPaymentsCount += 1;
      } else if (rec.paymentStatus === 'partially_paid') {
        // Assume 50% paid, 50% pending for summary visualization
        netPayrollPaid += rec.netSalary / 2;
        pendingPaymentsAmount += rec.netSalary / 2;
        pendingPaymentsCount += 1;
        totalEmployeesPaid += 1;
      }
    });

    if (lowestSalary === Infinity) lowestSalary = 0;

    const count = records.length;
    const averageSalary = Math.round(netPayrollPaid / (totalEmployeesPaid || 1));
    const averageDeduction = Math.round(totalDeductions / count);

    return {
      totalEmployeesPaid,
      grossPayroll,
      totalDeductions,
      netPayrollPaid,
      pendingPaymentsAmount,
      pendingPaymentsCount,
      highestSalary,
      lowestSalary,
      totalOvertimePaid,
      totalBonusesPaid,
      averageSalary,
      averageDeduction,
    };
  }, [records]);
};
