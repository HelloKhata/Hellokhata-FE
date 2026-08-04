'use client';

import React from 'react';
import { PayrollRecord } from '@/types/payroll-register';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface MobilePayrollCardsProps {
  records: PayrollRecord[];
  onSelectRecord: (record: PayrollRecord) => void;
}

export const MobilePayrollCards: React.FC<MobilePayrollCardsProps> = ({
  records,
  onSelectRecord,
}) => {
  const formatCurrency = (val: number) => `৳${val.toLocaleString('en-BD')}`;

  const getStatusBadge = (status: PayrollRecord['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
          </Badge>
        );
      case 'partially_paid':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
            <Clock className="h-3 w-3 mr-1" /> Partial
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
            <AlertTriangle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-3 md:hidden">
      {records.map((r) => (
        <div
          key={r.id}
          className="border border-border/60 rounded-xl bg-card p-3.5 shadow-2xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9 border border-border/60">
                <AvatarImage src={r.photoUrl} alt={r.employeeName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {r.employeeName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-bold text-xs text-foreground">
                  {r.employeeName}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  {r.designation} • {r.branchName}
                </p>
              </div>
            </div>
            {getStatusBadge(r.paymentStatus)}
          </div>

          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/40 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase">
                Payroll Period
              </span>
              <span className="font-semibold text-foreground">
                {r.payrollPeriod}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground block uppercase">
                Net Payable
              </span>
              <span className="font-extrabold text-primary">
                {formatCurrency(r.netSalary)}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSelectRecord(r)}
            className="w-full h-8 text-xs rounded-lg gap-1.5 font-medium border-border/70"
          >
            <FileText className="h-3.5 w-3.5 text-primary" />
            View Payslip Statement
          </Button>
        </div>
      ))}
    </div>
  );
};
