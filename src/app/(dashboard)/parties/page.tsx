// Hello Khata OS - Parties Page
// হ্যালো খাতা - পার্টি পেজ

'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  Plus,
  Search,
  User,
  Building2,
  Loader2,
  ArrowUpDown,
  Check,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  TrendingDown,
  ArrowUpRight,
  Wallet,
  FileText,
  BarChart3,
  Coins,
} from 'lucide-react';
import { PageHeader } from '@/components/common';
import { useCurrency, useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import type { Party } from '@/types';
import { useRouter } from 'next/navigation';
import { useParties, useDeleteParty, usePartyStats } from '@/hooks/api/useParties';
import { getInitials } from '@/components/parties/utils';
import { PartyDetailsAndTransactions } from '@/components/parties/PartyDetailsAndTransactions';
import { toast } from 'sonner';

// Helper for consistent vibrant avatar colors
const AVATAR_COLORS = [
  'bg-blue-600 text-white',
  'bg-purple-600 text-white',
  'bg-emerald-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-indigo-600 text-white',
  'bg-teal-600 text-white',
  'bg-cyan-600 text-white',
];

const getAvatarBg = (name: string, index: number) => {
  if (!name) return AVATAR_COLORS[index % AVATAR_COLORS.length];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export default function PartiesPage() {
  const { t, isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'customer' | 'supplier' | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'receivable' | 'payable' | 'all'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'name_asc' | 'name_desc' | 'newest' | 'oldest'>('default');
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const deletePartyMutation = useDeleteParty();
  const router = useRouter();

  const { data: parties = [], isLoading } = useParties({
    type: typeFilter === 'all' ? undefined : typeFilter,
    search: searchTerm === '' ? undefined : searchTerm,
    balanceType: paymentFilter === 'all' ? undefined : paymentFilter,
    sortBy: sortBy === 'default' ? undefined : sortBy,

  });
  const { data: partyStats } = usePartyStats();

  const handleEditParty = (party: Party) => {
    router.push(`/parties/edit/${party.id}`);
  };

  const handleDeleteParty = (partyId: string, partyName: string) => {
    if (
      confirm(
        isBangla
          ? `আপনি কি নিশ্চিত "${partyName}" ডিলিট করতে চান?`
          : `Are you sure you want to delete "${partyName}"?`
      )
    ) {
      deletePartyMutation.mutate(partyId, {
        onSuccess: () => {
          toast.success(isBangla ? 'পার্টি মুছে ফেলা হয়েছে' : 'Party deleted successfully');
          if (selectedParty?.id === partyId) {
            setSelectedParty(null);
          }
        },
      });
    }
  };


  return (
    <div className="space-y-6 pb-12">
      {/* =========================================================================
          1. HEADER SECTION
         ========================================================================= */}
      <PageHeader
        title={t('parties.title') || 'Parties'}
        subtitle={isBangla ? 'গ্রাহক ও সরবরাহকারী ব্যবস্থাপনা' : 'Customer & supplier management'}
        showBack
      >
        <Button
          onClick={() => router.push('/parties/new')}
          className="shrink-0 h-9 sm:h-10 px-3 sm:px-4 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5 sm:gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="whitespace-nowrap">{isBangla ? 'পার্টি যোগ করুন' : 'Add Party'}</span>
        </Button>
      </PageHeader>

      {/* =========================================================================
          2. TOP STATS CARDS (4 METRICS IN ROW WITH GLOW & WAVES)
         ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Customers (Blue theme) */}
        <div
          onClick={() => setTypeFilter(typeFilter === 'customer' ? 'all' : 'customer')}
          className="rounded-2xl border border-blue-500/20 hover:border-blue-500/50 hover:-translate-y-0.5 p-3 sm:p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group transition-all duration-200 cursor-pointer select-none bg-gradient-to-br from-[#0c1c44] via-[#091535] to-[#040b1e]"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/40 shrink-0">
                <User className="h-4 w-4 sm:h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-none font-mono">
                  {partyStats?.customers ?? 0}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 truncate">
                  {t('parties.customers') || (isBangla ? 'গ্রাহক' : 'Customers')}
                </p>
              </div>
            </div>
            {/* Watermark Icon */}
            <Users className="w-8 h-8 text-blue-400/20 shrink-0 pointer-events-none hidden sm:block" />
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-center justify-between z-10">
            <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="truncate">+12% vs last month</span>
            </p>
          </div>

          {/* Glowing Wave SVG */}
          <div className="hidden sm:block absolute right-0 bottom-0 w-36 h-16 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity">
            <svg viewBox="0 0 140 60" className="w-full h-full fill-none">
              <path
                d="M0,50 C40,45 60,20 90,30 C120,40 130,10 140,5 L140,60 L0,60 Z"
                fill="url(#blue-gradient-fill)"
                opacity="0.3"
              />
              <path
                d="M0,50 C40,45 60,20 90,30 C120,40 130,10 140,5"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              />
              <defs>
                <linearGradient id="blue-gradient-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Card 2: Suppliers (Purple theme) */}
        <div
          onClick={() => setTypeFilter(typeFilter === 'supplier' ? 'all' : 'supplier')}
          className="rounded-2xl border border-purple-500/20 hover:border-purple-500/50 hover:-translate-y-0.5 p-3 sm:p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group transition-all duration-200 cursor-pointer select-none bg-gradient-to-br from-[#240e48] via-[#180933] to-[#0b031b]"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/40 shrink-0">
                <Building2 className="h-4 w-4 sm:h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-none font-mono">
                  {partyStats?.suppliers ?? 0}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 truncate">
                  {t('parties.suppliers') || (isBangla ? 'সরবরাহকারী' : 'Suppliers')}
                </p>
              </div>
            </div>
            {/* Watermark Icon */}
            <FileText className="w-8 h-8 text-purple-400/20 shrink-0 pointer-events-none hidden sm:block" />
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-center justify-between z-10">
            <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="truncate">+8% vs last month</span>
            </p>
          </div>

          {/* Glowing Wave SVG */}
          <div className="hidden sm:block absolute right-0 bottom-0 w-36 h-16 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity">
            <svg viewBox="0 0 140 60" className="w-full h-full fill-none">
              <path
                d="M0,45 C35,40 55,15 85,28 C115,40 125,12 140,8 L140,60 L0,60 Z"
                fill="url(#purple-gradient-fill)"
                opacity="0.3"
              />
              <path
                d="M0,45 C35,40 55,15 85,28 C115,40 125,12 140,8"
                stroke="#c084fc"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]"
              />
              <defs>
                <linearGradient id="purple-gradient-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Card 3: Receivable (Teal/Emerald theme) */}
        <div
          onClick={() => setPaymentFilter(paymentFilter === 'receivable' ? 'all' : 'receivable')}
          className="rounded-2xl border border-teal-500/20 hover:border-teal-500/50 hover:-translate-y-0.5 p-3 sm:p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group transition-all duration-200 cursor-pointer select-none bg-gradient-to-br from-[#06302a] via-[#04201c] to-[#02100e]"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/40 shrink-0">
                <Coins className="h-4 w-4 sm:h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-none font-mono">
                  {formatCurrency(partyStats?.totalReceivable ?? 0)}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 truncate">
                  {t('dashboard.receivable') || (isBangla ? 'পাওনা' : 'Receivable')}
                </p>
              </div>
            </div>
            {/* Watermark Icon */}
            <BarChart3 className="w-8 h-8 text-teal-400/20 shrink-0 pointer-events-none hidden sm:block" />
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-center justify-between z-10">
            <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="truncate">+15% vs last month</span>
            </p>
          </div>

          {/* Glowing Wave SVG */}
          <div className="hidden sm:block absolute right-0 bottom-0 w-36 h-16 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity">
            <svg viewBox="0 0 140 60" className="w-full h-full fill-none">
              <path
                d="M0,52 C30,48 55,25 85,35 C115,45 128,15 140,6 L140,60 L0,60 Z"
                fill="url(#teal-gradient-fill)"
                opacity="0.3"
              />
              <path
                d="M0,52 C30,48 55,25 85,35 C115,45 128,15 140,6"
                stroke="#2dd4bf"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]"
              />
              <defs>
                <linearGradient id="teal-gradient-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#134e4a" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Card 4: Payable (Rose/Crimson theme) */}
        <div
          onClick={() => setPaymentFilter(paymentFilter === 'payable' ? 'all' : 'payable')}
          className="rounded-2xl border border-rose-500/20 hover:border-rose-500/50 hover:-translate-y-0.5 p-3 sm:p-4.5 shadow-sm relative overflow-hidden flex flex-col justify-between group transition-all duration-200 cursor-pointer select-none bg-gradient-to-br from-[#3b0d18] via-[#26070f] to-[#140207]"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/40 shrink-0">
                <TrendingDown className="h-4 w-4 sm:h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-none font-mono">
                  {formatCurrency(partyStats?.totalPayable ?? 0)}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 truncate">
                  {t('dashboard.payable') || (isBangla ? 'দেনা' : 'Payable')}
                </p>
              </div>
            </div>
            {/* Watermark Icon */}
            <Wallet className="w-8 h-8 text-rose-400/20 shrink-0 pointer-events-none hidden sm:block" />
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-center justify-between z-10">
            <p className="text-[10px] sm:text-[11px] font-semibold text-rose-400 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="truncate">+5% vs last month</span>
            </p>
          </div>

          {/* Glowing Wave SVG */}
          <div className="hidden sm:block absolute right-0 bottom-0 w-36 h-16 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity">
            <svg viewBox="0 0 140 60" className="w-full h-full fill-none">
              <path
                d="M0,48 C35,42 60,18 90,32 C120,44 130,12 140,5 L140,60 L0,60 Z"
                fill="url(#rose-gradient-fill)"
                opacity="0.3"
              />
              <path
                d="M0,48 C35,42 60,18 90,32 C120,44 130,12 140,5"
                stroke="#fb7185"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]"
              />
              <defs>
                <linearGradient id="rose-gradient-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#881337" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN CONTENT: SPLIT CONTAINER & PARTIES TABLE (FOLLOWS INVENTORY TABLE)
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row min-h-[600px] items-stretch gap-6">
        {/* Left Column / Full Table: Parties List */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out flex flex-col shrink-0",
            selectedParty
              ? "hidden lg:flex w-full lg:w-[38%]"
              : "w-full"
          )}
        >
          <div className="rounded-2xl border border-border/60 bg-[#12161f] shadow-sm overflow-hidden flex flex-col h-full flex-1">
            {/* Header with Title & Add Party button */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-border/40">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                  {isBangla
                    ? `পার্টি (${partyStats?.total ?? 0})`
                    : `Parties (${partyStats?.total ?? 0})`}
                </h2>
                <p className="text-[11px] sm:text-xs text-muted-foreground/80 mt-0.5">
                  {isBangla ? 'আপনার গ্রাহক ও সরবরাহকারী তালিকা' : 'Manage your customers and suppliers'}
                </p>
              </div>
              <Button
                onClick={() => router.push('/parties/new')}
                className="h-8 sm:h-8.5 px-3 sm:px-3.5 rounded-xl font-semibold shadow-sm cursor-pointer flex items-center gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isBangla ? 'পার্টি যোগ করুন' : 'Add Party'}</span>
              </Button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-3 bg-[#161a23]/30 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/70 pointer-events-none" />
                  <Input
                    placeholder={isBangla ? 'পার্টি খুঁজুন...' : 'Search parties...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 h-9 sm:h-10 rounded-xl bg-background/80 hover:bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs sm:text-sm placeholder:text-muted-foreground/60"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-background/80 hover:bg-background border-border/60 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-medium"
                      title={isBangla ? "সাজান" : "Sort options"}
                    >
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                      <span className="whitespace-nowrap font-medium text-foreground/90">
                        {!sortBy && (isBangla ? 'সাজান' : 'Sort')}
                        {sortBy === 'name_asc' && (isBangla ? 'নাম (A-Z)' : 'Name A-Z')}
                        {sortBy === 'name_desc' && (isBangla ? 'নাম (Z-A)' : 'Name Z-A')}
                        {sortBy === 'newest' && (isBangla ? 'নতুন' : 'Newest')}
                        {sortBy === 'oldest' && (isBangla ? 'পুরাতন' : 'Oldest')}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 text-xs bg-popover border-border">
                    <DropdownMenuItem
                      onClick={() => setSortBy('default')}
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
                        !sortBy && "font-semibold text-primary"
                      )}
                    >
                      <span>{isBangla ? 'ডিফল্ট (কোনোটি নয়)' : 'Default (None)'}</span>
                      {!sortBy && <Check className="h-3.5 w-3.5 ml-2 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy('name_asc')}
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
                        sortBy === 'name_asc' && "font-semibold text-primary"
                      )}
                    >
                      <span>{isBangla ? 'নাম (A-Z)' : 'Name A-Z'}</span>
                      {sortBy === 'name_asc' && <Check className="h-3.5 w-3.5 ml-2 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy('name_desc')}
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
                        sortBy === 'name_desc' && "font-semibold text-primary"
                      )}
                    >
                      <span>{isBangla ? 'নাম (Z-A)' : 'Name Z-A'}</span>
                      {sortBy === 'name_desc' && <Check className="h-3.5 w-3.5 ml-2 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy('newest')}
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
                        sortBy === 'newest' && "font-semibold text-primary"
                      )}
                    >
                      <span>{isBangla ? 'নতুন' : 'Newest'}</span>
                      {sortBy === 'newest' && <Check className="h-3.5 w-3.5 ml-2 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy('oldest')}
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
                        sortBy === 'oldest' && "font-semibold text-primary"
                      )}
                    >
                      <span>{isBangla ? 'পুরাতন' : 'Oldest'}</span>
                      {sortBy === 'oldest' && <Check className="h-3.5 w-3.5 ml-2 text-primary" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 shrink-0 no-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    setTypeFilter('all');
                    setPaymentFilter('all');
                  }}
                  className={cn(
                    "rounded-full px-3.5 py-1 text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                    typeFilter === 'all' && paymentFilter === 'all'
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-[#161a23]/80 hover:bg-muted/60 border border-border/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isBangla ? 'সব' : 'All'}
                </button>

                <button
                  type="button"
                  onClick={() => setTypeFilter(typeFilter === 'customer' ? 'all' : 'customer')}
                  className={cn(
                    "rounded-full px-3.5 py-1 text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                    typeFilter === 'customer'
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-[#161a23]/80 hover:bg-muted/60 border border-border/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isBangla ? 'গ্রাহক' : 'Customer'}
                </button>

                <button
                  type="button"
                  onClick={() => setTypeFilter(typeFilter === 'supplier' ? 'all' : 'supplier')}
                  className={cn(
                    "rounded-full px-3.5 py-1 text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                    typeFilter === 'supplier'
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-[#161a23]/80 hover:bg-muted/60 border border-border/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isBangla ? 'সরবরাহকারী' : 'Supplier'}
                </button>

                <Select
                  value={paymentFilter}
                  onValueChange={(value: any) => setPaymentFilter(value)}
                >
                  <SelectTrigger className="w-auto h-7 sm:h-8 rounded-full px-3 text-xs font-medium bg-[#161a23]/80 hover:bg-muted/60 border-border/60 text-muted-foreground hover:text-foreground focus:ring-0 cursor-pointer whitespace-nowrap">
                    <SelectValue placeholder={isBangla ? 'সব পেমেন্ট' : 'All Payment'} />
                  </SelectTrigger>
                  <SelectContent className="text-xs bg-popover border-border">
                    <SelectItem value="all">{isBangla ? 'সব পেমেন্ট' : 'All Payment'}</SelectItem>
                    <SelectItem value="receivable">{isBangla ? 'পাওনা' : 'Receivable'}</SelectItem>
                    <SelectItem value="payable">{isBangla ? 'দেনা' : 'Payable'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table Content */}
            {isLoading ? (
              <div className="flex items-center justify-center flex-1 py-16">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : parties?.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-16 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {isBangla ? 'কোনো পার্টি পাওয়া যায়নি' : 'No parties found'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isBangla ? 'নতুন পার্টি যোগ করুন' : 'Add your first party'}
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/parties/new')}
                  className="rounded-xl h-8.5 px-4 text-xs font-semibold shadow-xs cursor-pointer mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span>{isBangla ? 'পার্টি যোগ করুন' : 'Add Party'}</span>
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop View: Full Table (md and up) */}
                <div className="hidden md:block flex-1 overflow-x-auto">
                  <table className={cn("w-full text-left text-xs border-collapse", selectedParty ? "min-w-0" : "min-w-[720px]")}>
                    <thead>
                      <tr className="bg-[#161a23]/60 text-muted-foreground/80 border-b border-border/40 font-medium">
                        <th className="px-5 py-3 whitespace-nowrap">{isBangla ? 'পার্টি' : 'Party'}</th>
                        <th className="px-4 py-3 whitespace-nowrap">{isBangla ? 'ফোন' : 'Phone'}</th>
                        {!selectedParty && <th className="px-4 py-3 whitespace-nowrap">{isBangla ? 'ইমেইল' : 'Email'}</th>}
                        {!selectedParty && <th className="px-4 py-3 whitespace-nowrap">{isBangla ? 'ঠিকানা' : 'Address'}</th>}
                        <th className="px-4 py-3 text-right whitespace-nowrap">{isBangla ? 'মোট পরিশোধ' : 'Total Paid'}</th>
                        <th className="px-4 py-3 text-right whitespace-nowrap">{isBangla ? 'মোট বাকি' : 'Total Due'}</th>
                        <th className="px-5 py-3 text-right whitespace-nowrap">{isBangla ? 'অ্যাকশন' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {parties.map((party: any, index: number) => {
                        const isCustomer = party.type === 'customer';
                        const totalPaid = party.totalPaid ?? party.totalPayments ?? 0;
                        const totalDue = party.totalDue ?? party.dueAmount ?? party.currentBalance ?? 0;
                        const avatarBg = getAvatarBg(party?.name || '', index);

                        return (
                          <tr
                            key={party.id || index}
                            onClick={() => setSelectedParty(party)}
                            className={cn(
                              "hover:bg-muted/30 transition-colors cursor-pointer group border-b border-border/30 last:border-b-0",
                              selectedParty?.id === party.id
                                ? "bg-primary/10 border-l-2 border-primary"
                                : ""
                            )}
                          >
                            {/* Party Avatar + Name + Type Badge */}
                            <td className="px-5 py-3.5 align-middle">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs",
                                    avatarBg
                                  )}
                                >
                                  {getInitials(party?.name)}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-foreground truncate text-xs group-hover:text-primary transition-colors">
                                    {party?.name}
                                  </p>
                                  <span
                                    className={cn(
                                      "inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-medium border shrink-0 mt-0.5",
                                      isCustomer
                                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                        : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                    )}
                                  >
                                    {isCustomer
                                      ? isBangla ? 'গ্রাহক' : 'Customer'
                                      : isBangla ? 'সরবরাহকারী' : 'Supplier'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Phone */}
                            <td className="px-4 py-3.5 align-middle text-slate-300 font-mono text-xs whitespace-nowrap">
                              {party?.phone || '—'}
                            </td>

                            {/* Email */}
                            {!selectedParty && (
                              <td
                                className="px-4 py-3.5 align-middle text-muted-foreground text-xs truncate max-w-[160px]"
                                title={party?.email}
                              >
                                {party?.email || '—'}
                              </td>
                            )}

                            {/* Address */}
                            {!selectedParty && (
                              <td
                                className="px-4 py-3.5 align-middle text-muted-foreground text-xs truncate max-w-[180px]"
                                title={party?.address}
                              >
                                {party?.address || '—'}
                              </td>
                            )}

                            {/* Total Paid */}
                            <td className="px-4 py-3.5 align-middle text-right font-medium text-slate-200 text-xs font-mono whitespace-nowrap">
                              {formatCurrency(totalPaid)}
                            </td>

                            {/* Total Due */}
                            <td className="px-4 py-3.5 align-middle text-right font-bold text-xs font-mono whitespace-nowrap">
                              <span
                                className={cn(
                                  totalDue > 0
                                    ? "text-rose-500 font-bold"
                                    : totalDue < 0
                                    ? "text-emerald-400 font-bold"
                                    : "text-muted-foreground font-medium"
                                )}
                              >
                                {formatCurrency(Math.abs(totalDue))}
                              </span>
                            </td>

                            {/* Actions */}
                            <td
                              className="px-5 py-3.5 align-middle text-right whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-end gap-1">
                                {!selectedParty && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                                    onClick={() => setSelectedParty(party)}
                                    title={isBangla ? "বিস্তারিত দেখুন" : "View Details"}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                                  onClick={() => handleEditParty(party)}
                                  title={isBangla ? "এডিট করুন" : "Edit Party"}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                                      title="More Options"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-40 bg-popover border-border text-popover-foreground shadow-xl">
                                    <DropdownMenuItem
                                      onClick={() => setSelectedParty(party)}
                                      className="text-xs gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                    >
                                      <Eye className="h-3.5 w-3.5 text-primary" />
                                      <span>{isBangla ? "বিস্তারিত" : "View Details"}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleEditParty(party)}
                                      className="text-xs gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                    >
                                      <Pencil className="h-3.5 w-3.5 text-primary" />
                                      <span>{isBangla ? "এডিট" : "Edit"}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteParty(party.id, party.name)}
                                      className="text-xs gap-2 text-destructive cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                      <span>{isBangla ? "মুছে ফেলুন" : "Delete"}</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View: Slim & Smart Cards (md:hidden) */}
                <div className="md:hidden flex-1 divide-y divide-border/30 overflow-y-auto">
                  {parties.map((party: any, index: number) => {
                    const isCustomer = party.type === 'customer';
                    const totalPaid = party.totalPaid ?? party.totalPayments ?? 0;
                    const totalDue = party.totalDue ?? party.dueAmount ?? party.currentBalance ?? 0;
                    const avatarBg = getAvatarBg(party?.name || '', index);

                    return (
                      <div
                        key={party.id || index}
                        onClick={() => setSelectedParty(party)}
                        className={cn(
                          "p-3 transition-colors cursor-pointer space-y-2 hover:bg-muted/20 active:bg-muted/30",
                          selectedParty?.id === party.id ? "bg-primary/10 border-l-2 border-primary" : ""
                        )}
                      >
                        {/* Main Row: Avatar + Name + Type + Balance */}
                        <div className="flex items-center gap-2.5 justify-between">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className={cn(
                                "h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs",
                                avatarBg
                              )}
                            >
                              {getInitials(party?.name)}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="font-bold text-foreground truncate text-xs">
                                  {party?.name}
                                </p>
                                <span
                                  className={cn(
                                    "inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-medium border shrink-0",
                                    isCustomer
                                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                      : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                  )}
                                >
                                  {isCustomer
                                    ? isBangla ? 'গ্রাহক' : 'Customer'
                                    : isBangla ? 'সরবরাহকারী' : 'Supplier'}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground/90 font-mono mt-0.5 truncate">
                                {party?.phone || '—'}
                              </p>
                            </div>
                          </div>

                          {/* Right: Due and Paid */}
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold font-mono">
                              <span
                                className={cn(
                                  totalDue > 0
                                    ? "text-rose-500"
                                    : totalDue < 0
                                    ? "text-emerald-400"
                                    : "text-muted-foreground"
                                )}
                              >
                                {formatCurrency(Math.abs(totalDue))}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-normal ml-1">
                                {totalDue > 0 ? (isBangla ? 'বাকি' : 'Due') : totalDue < 0 ? (isBangla ? 'অগ্রিম' : 'Adv') : ''}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                              {isBangla ? 'পরিশোধ:' : 'Paid:'} {formatCurrency(totalPaid)}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Row: Address/Email & Quick Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-border/20 text-[11px] text-muted-foreground gap-2">
                          <div className="truncate flex-1 max-w-[200px]">
                            {party?.address || party?.email ? (
                              <span className="truncate block text-[10px]">
                                {party?.address || party?.email}
                              </span>
                            ) : (
                              <span className="text-[10px] text-muted-foreground/50">
                                {isBangla ? 'কোনো ঠিকানা নেই' : 'No address'}
                              </span>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div
                            className="flex items-center gap-1 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                              onClick={() => setSelectedParty(party)}
                              title={isBangla ? "বিস্তারিত" : "View"}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                              onClick={() => handleEditParty(party)}
                              title={isBangla ? "এডিট" : "Edit"}
                            >
                              <Pencil className="h-3.5 w-3.5 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                              onClick={() => handleDeleteParty(party.id, party.name)}
                              title={isBangla ? "মুছে ফেলুন" : "Delete"}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Transaction History & Details Drawer */}
        {selectedParty && (
          <div className="w-full lg:w-[62%] flex flex-col transition-all duration-300 ease-in-out">
            <div className="rounded-2xl border border-border/60 bg-[#12161f] shadow-sm p-4 sm:p-6 flex flex-col h-full flex-1">
              <PartyDetailsAndTransactions
                partyId={selectedParty.id}
                onClose={() => setSelectedParty(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

