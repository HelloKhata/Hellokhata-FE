'use client';

import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { Party } from '@/types';
import { getInitials } from './utils';

interface PartyCardProps {
  party: Party;
  onView: () => void;
  isSelected?: boolean;
}

export function PartyCard({ party, onView, isSelected }: PartyCardProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  return (
    <div
      onClick={onView}
      className={cn(
        "flex items-center justify-between p-3.5 rounded-xl border transition-all gap-4 cursor-pointer",
        isSelected
          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
          : "border-transparent hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
          {getInitials(party.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground truncate text-sm">{party.name}</p>
          {party.phone && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{party.phone}</p>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={cn(
          'font-bold text-sm',
          party.currentBalance > 0 ? 'text-emerald-600' : party.currentBalance < 0 ? 'text-red-600' : 'text-foreground'
        )}>
          {formatCurrency(party.currentBalance)}
        </p>
        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
          {party.currentBalance > 0 ? (isBangla ? 'পাওনা' : 'Receivable') :
            party.currentBalance < 0 ? (isBangla ? 'দেনা' : 'Payable') :
              (isBangla ? 'মিমাংসিত' : 'Settled')}
        </p>
      </div>
    </div>
  );
}
