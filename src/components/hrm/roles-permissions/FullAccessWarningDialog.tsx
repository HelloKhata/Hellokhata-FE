// Hello Khata OS - Full Access Warning Dialog Component
// হ্যালো খাতা - পূর্ণ সিস্টেম অ্যাক্সেস সতর্কতা ডায়ালগ

'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface FullAccessWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function FullAccessWarningDialog({
  open,
  onOpenChange,
  onConfirm,
}: FullAccessWarningDialogProps) {
  const { isBangla } = useAppTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-rose-500 font-bold">
            <Crown className="w-5 h-5" />
            <span>{isBangla ? 'পূর্ণ সিস্টেম অ্যাক্সেস প্রদান করবেন?' : 'Grant Full System Access?'}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isBangla
              ? 'পূর্ণ সিস্টেম অ্যাক্সেস এই কর্মচারীকে সকল শাখা, সংবেদনশীল আর্থিক লেনদেন, কর্মী বেতন ও নিরাপত্তা সেটিংস নিয়ন্ত্রণের অবাধ ক্ষমতা দেবে। আপনি কি নিশ্চিত?'
              : 'Full system access grants this user unrestricted visibility across ALL branches, financial ledgers, salary calculations, and user permissions. Are you sure you want to proceed?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl cursor-pointer text-xs">
            {isBangla ? 'বাতিল' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
          >
            {isBangla ? 'হ্যাঁ, পূর্ণ অ্যাক্সেস দিন' : 'Grant Full Access'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
