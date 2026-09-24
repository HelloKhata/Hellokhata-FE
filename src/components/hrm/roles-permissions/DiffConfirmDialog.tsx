// Hello Khata OS - Diff Confirm Dialog Component
// হ্যালো খাতা - অ্যাক্সেস পরিবর্তন নিশ্চিতকরণ ও ডিফারেন্স ডায়ালগ

'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
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
import type { PermissionDiff } from './types';
import { MODULE_BY_PERMISSION_ID_MAP } from './mock-data';

interface DiffConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
  diff: PermissionDiff;
  onConfirm: () => void;
}

export function DiffConfirmDialog({
  open,
  onOpenChange,
  userName = 'User',
  diff,
  onConfirm,
}: DiffConfirmDialogProps) {
  const { isBangla } = useAppTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg rounded-2xl bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-foreground font-bold">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>{isBangla ? 'অ্যাক্সেস পরিবর্তন নিশ্চিত করুন' : 'Confirm Access Control Changes'}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground">
            {isBangla
              ? `${userName} এর জন্য নিম্নলিখিত অনুমতি ও শাখা পরিবর্তন কার্যকর হতে চলেছে:`
              : `The following access and permission modifications will be applied to ${userName}:`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-2 text-xs max-h-60 overflow-y-auto">
          {/* Added Permissions */}
          {diff.added.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 space-y-1">
              <span className="font-bold text-[11px] block">
                + {diff.added.length} {isBangla ? 'নতুন অনুমতি যুক্ত' : 'Permissions Added'}:
              </span>
              <ul className="list-disc list-inside text-[11px] space-y-0.5">
                {diff.added.map((p) => (
                  <li key={p.id}>
                    {MODULE_BY_PERMISSION_ID_MAP.get(p.id)?.name} → {p.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Removed Permissions */}
          {diff.removed.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 space-y-1">
              <span className="font-bold text-[11px] block">
                - {diff.removed.length} {isBangla ? 'অনুমতি প্রত্যাহার' : 'Permissions Revoked'}:
              </span>
              <ul className="list-disc list-inside text-[11px] space-y-0.5">
                {diff.removed.map((p) => (
                  <li key={p.id}>
                    {MODULE_BY_PERMISSION_ID_MAP.get(p.id)?.name} → {p.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* High-risk sensitive warning */}
          {diff.sensitiveGranted.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <div>
                <p className="font-bold text-[11px]">{isBangla ? 'উচ্চ ঝুঁকিপূর্ণ সংবেদনশীল অনুমতি!' : 'High-Privilege Sensitive Permissions!'}</p>
                <p className="text-[10px] mt-0.5">
                  {diff.sensitiveGranted.map((p) => p.name).join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl cursor-pointer text-xs">
            {isBangla ? 'বাতিল' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold cursor-pointer"
          >
            {isBangla ? 'নিশ্চিত ও সংরক্ষণ করুন' : 'Confirm & Save Access'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
