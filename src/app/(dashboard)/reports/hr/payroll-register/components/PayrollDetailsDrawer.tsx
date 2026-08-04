'use client';

import React from 'react';
import { PayrollRecord } from '@/types/payroll-register';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SalaryBreakdownCard } from './SalaryBreakdownCard';
import {
  Download,
  Printer,
  Share2,
  Building2,
  CreditCard,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

interface PayrollDetailsDrawerProps {
  record: PayrollRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PayrollDetailsDrawer: React.FC<PayrollDetailsDrawerProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast.success(`Payslip downloaded for ${record.employeeName} (${record.payrollPeriod})`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Payslip link copied to clipboard.');
    }
  };

  const getStatusBadge = (status: PayrollRecord['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 text-[11px]">
            <CheckCircle2 className="h-3 w-3" /> Paid
          </Badge>
        );
      case 'partially_paid':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 text-[11px]">
            <Clock className="h-3 w-3" /> Partially Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 text-[11px]">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 gap-1 text-[11px]">
            <AlertTriangle className="h-3 w-3" /> Failed
          </Badge>
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col h-full bg-card">
        {/* Drawer Header */}
        <div className="p-6 pb-4 border-b border-border/60">
          <SheetHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Employee Payslip Statement
              </span>
              {getStatusBadge(record.paymentStatus)}
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border border-border/60">
                <AvatarImage src={record.photoUrl} alt={record.employeeName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {record.employeeName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  {record.employeeName}
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {record.designation} • {record.department} ({record.employeeCode})
                </p>
              </div>
            </div>

            <SheetDescription className="text-xs text-muted-foreground">
              Period: <span className="font-semibold text-foreground">{record.payrollPeriod}</span> | Branch: <span className="font-semibold text-foreground">{record.branchName}</span>
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
          {/* Visual Salary Breakdown Card */}
          <SalaryBreakdownCard record={record} />

          {/* Payment Details */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-muted-foreground text-[11px]">
              Payment & Bank Metadata
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground">Payment Method</span>
                <p className="font-semibold capitalize text-foreground pt-0.5">
                  {record.paymentMethod.replace('_', ' ')}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Disbursal Date</span>
                <p className="font-semibold text-foreground pt-0.5">
                  {record.paidDate || 'Pending Disbursal'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Generated Date</span>
                <p className="font-semibold text-foreground pt-0.5">
                  {record.generatedDate}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Processed By</span>
                <p className="font-semibold text-foreground pt-0.5">
                  {record.createdBy}
                </p>
              </div>
            </div>

            {record.bankInfo && (
              <>
                <Separator className="bg-border/50 my-2" />
                <div className="space-y-1">
                  <span className="text-muted-foreground">Bank Account Info</span>
                  <p className="font-medium text-foreground">
                    {record.bankInfo.bankName} - Account #{record.bankInfo.accountNumber}
                  </p>
                </div>
              </>
            )}

            {record.notes && (
              <>
                <Separator className="bg-border/50 my-2" />
                <div className="space-y-1">
                  <span className="text-muted-foreground">Internal Notes</span>
                  <p className="text-muted-foreground italic">{record.notes}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Drawer Actions Footer */}
        <div className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-9 text-xs rounded-xl gap-1.5 flex-1"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-9 text-xs rounded-xl gap-1.5 flex-1"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleDownloadPdf}
            className="h-9 text-xs font-semibold rounded-xl gap-1.5 flex-1 bg-primary text-primary-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
