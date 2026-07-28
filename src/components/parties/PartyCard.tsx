'use client';

import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { Party } from '@/types';
import { getInitials } from './utils';
import {
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Building2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PartyCardProps {
  party: Party;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
}

export function PartyCard({ party, onView, onEdit, onDelete, isSelected }: PartyCardProps) {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();

  const typeConfig = {
    customer: {
      label: isBangla ? 'গ্রাহক' : 'Customer',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: User,
    },
    supplier: {
      label: isBangla ? 'সরবরাহকারী' : 'Supplier',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: Building2,
    },
    both: {
      label: isBangla ? 'উভয়' : 'Both',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: User,
    },
  };

  const currentType = typeConfig[party.type as keyof typeof typeConfig] || typeConfig.customer;

  return (
    <div
      onClick={onView}
      className={cn(
        "flex items-center justify-between p-3.5 rounded-xl border transition-all gap-3 cursor-pointer group relative",
        isSelected
          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
          : "border-border/60 bg-card hover:bg-muted/40 hover:border-border"
      )}
    >
      {/* Left Section: Initials Avatar + Party Name + Type Badge + Contact Subtitle */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
          {getInitials(party.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground truncate text-sm leading-tight">
              {party.name}
            </p>
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border shrink-0", currentType.color)}>
              {currentType.label}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 truncate flex-wrap">
            {party.phone && (
              <span className="truncate">{party.phone}</span>
            )}
            {party.email && (
              <span className="truncate hidden sm:inline">• {party.email}</span>
            )}
            {party.creditLimit ? (
              <span className="truncate text-[11px] text-amber-500 font-medium hidden md:inline">
                • Limit: {formatCurrency(party.creditLimit)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Right Section: Balance Amount & Receivable/Payable Status */}
      <div className="text-right shrink-0">
        <p
          className={cn(
            "font-bold text-sm font-mono",
            party.currentBalance > 0
              ? "text-emerald-500"
              : party.currentBalance < 0
              ? "text-rose-500"
              : "text-foreground"
          )}
        >
          {formatCurrency(Math.abs(party.currentBalance))}
        </p>
        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
          {party.currentBalance > 0
            ? (isBangla ? "পাওনা" : "Receivable")
            : party.currentBalance < 0
            ? (isBangla ? "দেনা" : "Payable")
            : (isBangla ? "মিমাংসিত" : "Settled")}
        </p>
      </div>

      {/* Action Controls: 3-dot for mobile, Edit & Delete for desktop */}
      <div className="flex items-center gap-1 shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
        {/* Large Devices (MD+): Explicit View, Edit, Delete Icon Buttons */}
        <div className="hidden md:flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg cursor-pointer"
            onClick={onView}
            title={isBangla ? "বিস্তারিত দেখুন" : "View Details"}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
              onClick={onEdit}
              title={isBangla ? "এডিট করুন" : "Edit Party"}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
              onClick={onDelete}
              title={isBangla ? "মুছে ফেলুন" : "Delete Party"}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Mobile Devices (<MD): Three-Dot Dropdown Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onView} className="gap-2 text-xs cursor-pointer">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{isBangla ? "বিস্তারিত দেখুন" : "View Details"}</span>
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={onEdit} className="gap-2 text-xs cursor-pointer">
                  <Pencil className="h-3.5 w-3.5 text-primary" />
                  <span>{isBangla ? "এডিট করুন" : "Edit Party"}</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={onDelete} className="gap-2 text-xs text-rose-500 focus:text-rose-500 cursor-pointer">
                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  <span>{isBangla ? "মুছে ফেলুন" : "Delete Party"}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
