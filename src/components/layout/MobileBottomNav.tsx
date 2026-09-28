// Hello Khata OS - Mobile Bottom Navigation
// Unified Two-Layer Navigation + "ALL" Modules & Pages Drawer Slider
// Page-specific colorful circular icon buttons matching reference design

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Receipt,
  Truck,
  Users,
  Wallet,
  Package,
  UsersRound,
  BarChart3,
  LayoutDashboard,
  LayoutGrid,
  Search,
  X,
  Sparkles,
  Settings,
  Tag,
  CreditCard,
  Building2,
  SlidersHorizontal,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Shield,
  UserSquare2,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  BookPlus,
  Plus,
  BadgeDollarSign,
  UserCheck,
  Bell,
} from 'lucide-react';

import { useAppTranslation } from '@/hooks/useAppTranslation';
import { navGroups } from '@/lib/nav-config';
import { cn } from '@/lib/utils';

// Page-specific color themes for vibrant circular icon styling
const getPageTheme = (pageUrl: string) => {
  switch (pageUrl) {
    // Sales
    case '/sales/new':
      return { bg: 'bg-primary/20 border-primary/40 text-primary', iconColor: 'text-primary' };
    case '/sales':
      return { bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400', iconColor: 'text-emerald-400' };
    case '/sales/quotations':
      return { bg: 'bg-teal-500/20 border-teal-500/40 text-teal-400', iconColor: 'text-teal-400' };
    case '/sales/returns':
      return { bg: 'bg-rose-500/20 border-rose-500/40 text-rose-400', iconColor: 'text-rose-400' };

    // Purchases
    case '/purchases/new':
      return { bg: 'bg-amber-500/20 border-amber-500/40 text-amber-400', iconColor: 'text-amber-400' };
    case '/purchases':
      return { bg: 'bg-orange-500/20 border-orange-500/40 text-orange-400', iconColor: 'text-orange-400' };
    case '/purchases/returns':
      return { bg: 'bg-red-500/20 border-red-500/40 text-red-400', iconColor: 'text-red-400' };

    // Parties
    case '/parties/new':
      return { bg: 'bg-sky-500/20 border-sky-500/40 text-sky-400', iconColor: 'text-sky-400' };
    case '/parties':
      return { bg: 'bg-blue-500/20 border-blue-500/40 text-blue-400', iconColor: 'text-blue-400' };
    case '/parties/payment-in':
      return { bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400', iconColor: 'text-emerald-400' };
    case '/parties/payment-out':
      return { bg: 'bg-rose-500/20 border-rose-500/40 text-rose-400', iconColor: 'text-rose-400' };

    // Inventory
    case '/inventory/new':
      return { bg: 'bg-violet-500/20 border-violet-500/40 text-violet-400', iconColor: 'text-violet-400' };
    case '/inventory':
      return { bg: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400', iconColor: 'text-indigo-400' };
    case '/inventory/batches':
      return { bg: 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-400', iconColor: 'text-fuchsia-400' };
    case '/inventory/warehouse':
      return { bg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400', iconColor: 'text-cyan-400' };
    case '/inventory/stock-adjustment':
      return { bg: 'bg-amber-500/20 border-amber-500/40 text-amber-400', iconColor: 'text-amber-400' };
    case '/inventory/stock-transfer':
      return { bg: 'bg-blue-500/20 border-blue-500/40 text-blue-400', iconColor: 'text-blue-400' };

    // Finance
    case '/finance/overview':
      return { bg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400', iconColor: 'text-cyan-400' };
    case '/finance/transactions':
      return { bg: 'bg-blue-500/20 border-blue-500/40 text-blue-400', iconColor: 'text-blue-400' };
    case '/finance/income':
      return { bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400', iconColor: 'text-emerald-400' };
    case '/finance/expenses':
      return { bg: 'bg-rose-500/20 border-rose-500/40 text-rose-400', iconColor: 'text-rose-400' };
    case '/finance/deposits-withdrawals':
      return { bg: 'bg-amber-500/20 border-amber-500/40 text-amber-400', iconColor: 'text-amber-400' };
    case '/finance/receivables':
      return { bg: 'bg-teal-500/20 border-teal-500/40 text-teal-400', iconColor: 'text-teal-400' };
    case '/finance/payables':
      return { bg: 'bg-pink-500/20 border-pink-500/40 text-pink-400', iconColor: 'text-pink-400' };
    case '/finance/banks':
      return { bg: 'bg-sky-500/20 border-sky-500/40 text-sky-400', iconColor: 'text-sky-400' };
    case '/finance/settings':
      return { bg: 'bg-slate-500/20 border-slate-500/40 text-slate-300', iconColor: 'text-slate-300' };

    // HRM
    case '/hrm/employees':
      return { bg: 'bg-pink-500/20 border-pink-500/40 text-pink-400', iconColor: 'text-pink-400' };
    case '/hrm/roles-permissions':
      return { bg: 'bg-purple-500/20 border-purple-500/40 text-purple-400', iconColor: 'text-purple-400' };

    // Reports
    case '/reports/dashboard':
      return { bg: 'bg-purple-500/20 border-purple-500/40 text-purple-400', iconColor: 'text-purple-400' };
    case '/reports/sales':
      return { bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400', iconColor: 'text-emerald-400' };
    case '/reports/purchase':
      return { bg: 'bg-amber-500/20 border-amber-500/40 text-amber-400', iconColor: 'text-amber-400' };
    case '/reports/inventory':
      return { bg: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400', iconColor: 'text-indigo-400' };
    case '/reports/finance':
      return { bg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400', iconColor: 'text-cyan-400' };
    case '/reports/customers':
      return { bg: 'bg-blue-500/20 border-blue-500/40 text-blue-400', iconColor: 'text-blue-400' };
    case '/reports/suppliers':
      return { bg: 'bg-orange-500/20 border-orange-500/40 text-orange-400', iconColor: 'text-orange-400' };
    case '/reports/branches':
      return { bg: 'bg-teal-500/20 border-teal-500/40 text-teal-400', iconColor: 'text-teal-400' };
    case '/reports/employees':
      return { bg: 'bg-pink-500/20 border-pink-500/40 text-pink-400', iconColor: 'text-pink-400' };
    case '/reports/ai':
      return { bg: 'bg-violet-500/20 border-violet-500/40 text-violet-400', iconColor: 'text-violet-400' };
    case '/reports/saved':
      return { bg: 'bg-sky-500/20 border-sky-500/40 text-sky-400', iconColor: 'text-sky-400' };

    // Settings & Others
    case '/settings':
      return { bg: 'bg-slate-500/20 border-slate-500/40 text-slate-300', iconColor: 'text-slate-300' };
    case '/reminders':
      return { bg: 'bg-amber-500/20 border-amber-500/40 text-amber-400', iconColor: 'text-amber-400' };
    case '/ai':
      return { bg: 'bg-violet-500/20 border-violet-500/40 text-violet-400', iconColor: 'text-violet-400' };
    case '/':
      return { bg: 'bg-primary/20 border-primary/40 text-primary', iconColor: 'text-primary' };

    default:
      return { bg: 'bg-muted/40 border-border/40 text-foreground', iconColor: 'text-foreground' };
  }
};

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isBangla } = useAppTranslation();
  const [isAllOpen, setIsAllOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isPosActive = pathname === '/sales/new';

  // Close slider on route change
  useEffect(() => {
    setIsAllOpen(false);
    setSearchQuery('');
  }, [pathname]);

  // Lock body scroll when ALL drawer is open
  useEffect(() => {
    if (isAllOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAllOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAllOpen) {
        setIsAllOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAllOpen]);

  const handleNavigate = (href: string) => {
    setIsAllOpen(false);
    router.push(href);
  };

  // Filter groups and pages based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return navGroups;
    const query = searchQuery.toLowerCase();

    return navGroups
      .map((group) => {
        const groupMatches =
          group.labelKey.toLowerCase().includes(query) ||
          group.labelBn.toLowerCase().includes(query);

        if (group.submenu) {
          const matchingSubmenu = group.submenu.filter(
            (sub) =>
              sub.labelKey.toLowerCase().includes(query) ||
              sub.labelBn.toLowerCase().includes(query)
          );
          if (matchingSubmenu.length > 0 || groupMatches) {
            return {
              ...group,
              submenu: matchingSubmenu.length > 0 ? matchingSubmenu : group.submenu,
            };
          }
        } else if (groupMatches) {
          return group;
        }
        return null;
      })
      .filter(Boolean) as typeof navGroups;
  }, [searchQuery]);

  return (
    <>
      {/* ========================================================================= */}
      {/* "ALL" MODULES & PAGES SLIDER DRAWER                                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAllOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="all-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsAllOpen(false)}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm md:hidden"
              style={{ position: 'fixed', inset: 0 }}
              aria-hidden="true"
            />

            {/* Slider Bottom Sheet */}
            <motion.div
              key="all-modal-slider"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E131F] border-t border-border/80 rounded-t-[26px] shadow-2xl flex flex-col max-h-[85vh] w-full max-w-[100vw] overflow-x-hidden box-border md:hidden"
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                maxWidth: '100vw',
                boxSizing: 'border-box',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              }}
            >
              {/* Header & Search */}
              <div className="p-4 pb-3 border-b border-border/60 shrink-0 w-full max-w-full box-border">
                <div className="w-12 h-1 rounded-full bg-muted/60 mx-auto mb-3" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                      <LayoutGrid className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-foreground">
                        {isBangla ? 'সব মডিউল ও পেজ' : 'All Modules & Pages'}
                      </h2>
                      <p className="text-[11px] text-muted-foreground">
                        {isBangla ? 'দ্রুত শর্টকাট ডিরেক্টরি' : 'Quick navigation directory'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAllOpen(false)}
                    className="p-1.5 rounded-full bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Quick Search Bar */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isBangla ? 'মডিউল বা পেজ খুঁজুন...' : 'Search modules & pages...'}
                    className="w-full h-9.5 pl-9 pr-8 text-xs bg-muted/30 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary box-border"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grouped Modules & Pages (4-Column Circular Icon Buttons) */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-5 scrollbar-thin w-full max-w-full box-border">
                {filteredGroups.map((group) => {
                  const GroupIcon = group.icon;
                  const groupTitle = isBangla ? group.labelBn : group.labelKey;

                  return (
                    <div key={group.labelKey} className="space-y-3 w-full max-w-full box-border">
                      {/* Section Title */}
                      <div className="flex items-center gap-2 px-1">
                        <GroupIcon className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {groupTitle}
                        </span>
                        {group.submenu && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-muted/50 rounded text-muted-foreground ml-auto">
                            {group.submenu.length}
                          </span>
                        )}
                      </div>

                      {/* 4-Column Circular Icon Buttons Grid (Reference Style) */}
                      {group.submenu ? (
                        <div
                          className="grid grid-cols-4 gap-y-3.5 gap-x-1.5 w-full max-w-full box-border"
                          style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
                        >
                          {group.submenu.map((sub) => {
                            const SubIcon = sub.icon || GroupIcon;
                            const isActive = pathname === sub.page;
                            const subTitle = isBangla ? sub.labelBn : sub.labelKey;
                            const theme = getPageTheme(sub.page);

                            return (
                              <button
                                key={sub.page}
                                type="button"
                                onClick={() => handleNavigate(sub.page)}
                                className="min-w-0 w-full flex flex-col items-center justify-center text-center group focus:outline-none"
                              >
                                {/* Circular Icon Container */}
                                <div
                                  className={cn(
                                    'h-12 w-12 sm:h-13 sm:w-13 rounded-full flex items-center justify-center shadow-md border transition-all duration-150',
                                    'group-active:scale-90',
                                    theme.bg,
                                    isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-[#0E131F]'
                                  )}
                                >
                                  <SubIcon className={cn('h-5 w-5', theme.iconColor)} />
                                </div>

                                {/* Label Underneath */}
                                <span
                                  className={cn(
                                    'text-[10px] tracking-tight font-semibold mt-1 truncate w-full text-center px-0.5 block',
                                    isActive ? 'text-primary font-bold' : 'text-foreground/90'
                                  )}
                                >
                                  {subTitle}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div
                          className="grid grid-cols-4 gap-y-3.5 gap-x-1.5 w-full max-w-full box-border"
                          style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
                        >
                          {(() => {
                            const theme = getPageTheme(group.page || '/');
                            const isActive = pathname === group.page;
                            return (
                              <button
                                type="button"
                                onClick={() => handleNavigate(group.page || '/')}
                                className="min-w-0 w-full flex flex-col items-center justify-center text-center group focus:outline-none"
                              >
                                <div
                                  className={cn(
                                    'h-12 w-12 sm:h-13 sm:w-13 rounded-full flex items-center justify-center shadow-md border transition-all duration-150',
                                    'group-active:scale-90',
                                    theme.bg,
                                    isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-[#0E131F]'
                                  )}
                                >
                                  <GroupIcon className={cn('h-5 w-5', theme.iconColor)} />
                                </div>
                                <span
                                  className={cn(
                                    'text-[10px] tracking-tight font-semibold mt-1 truncate w-full text-center px-0.5 block',
                                    isActive ? 'text-primary font-bold' : 'text-foreground/90'
                                  )}
                                >
                                  {groupTitle}
                                </span>
                              </button>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2-LAYER FIXED BOTTOM NAVIGATION BAR                                       */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 w-full max-w-[100vw] z-40 md:hidden bg-[#0B0F19] border-t border-border/80 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] overflow-visible box-border"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          maxWidth: '100vw',
          zIndex: 40,
          transform: 'translateZ(0)',
          boxSizing: 'border-box',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Unified 5-Column Grid */}
        <div
          className="grid grid-cols-5 w-full max-w-full box-border px-1 py-1 items-center overflow-visible"
          style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}
        >
          {/* ── ROW 1 ── */}

          {/* 1. Home */}
          <Link
            href="/"
            className={cn(
              'min-w-0 w-full overflow-hidden flex flex-col items-center justify-center h-13 py-0.5 text-center transition-colors',
              pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
            <span
              className={cn(
                'text-[9.5px] tracking-tight mt-0.5 font-medium truncate w-full text-center px-0.5 block',
                pathname === '/' && 'font-bold text-primary'
              )}
            >
              {isBangla ? 'হোম' : 'Home'}
            </span>
          </Link>

          {/* 2. Sales */}
          <Link
            href="/sales"
            className={cn(
              'min-w-0 w-full overflow-hidden flex flex-col items-center justify-center h-13 py-0.5 text-center transition-colors',
              pathname.startsWith('/sales') && !isPosActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Receipt className="h-4.5 w-4.5 shrink-0" />
            <span
              className={cn(
                'text-[9.5px] tracking-tight mt-0.5 font-medium truncate w-full text-center px-0.5 block',
                pathname.startsWith('/sales') && !isPosActive && 'font-bold text-primary'
              )}
            >
              {isBangla ? 'বিক্রয়' : 'Sales'}
            </span>
          </Link>

          {/* 3. CENTER ELEVATED POS BUTTON */}
          <div className="min-w-0 w-full overflow-visible flex flex-col items-center justify-center h-13 relative">
            <Link
              href="/sales/new"
              id="mobile-pos-center-btn"
              aria-label="POS Billing"
              className={cn(
                'absolute -top-5.5 h-13.5 w-13.5 rounded-full flex flex-col items-center justify-center shrink-0',
                'bg-gradient-to-br from-primary via-primary to-indigo text-white',
                'shadow-[0_8px_20px_rgba(79,91,255,0.5)] border-[3.5px] border-[#0B0F19]',
                'transition-transform active:scale-90',
                isPosActive && 'ring-2 ring-primary ring-offset-2 ring-offset-[#0B0F19]'
              )}
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              <span className="text-[9px] font-extrabold tracking-widest text-white leading-none mt-0.5">
                POS
              </span>
            </Link>
            <span
              className={cn(
                'text-[9.5px] font-bold tracking-tight mt-6 truncate w-full text-center px-0.5 block',
                isPosActive ? 'text-primary' : 'text-foreground'
              )}
            >
              {isBangla ? 'পিওএস' : 'POS'}
            </span>
          </div>

          {/* 4. Parties */}
          <Link
            href="/parties"
            className={cn(
              'min-w-0 w-full overflow-hidden flex flex-col items-center justify-center h-13 py-0.5 text-center transition-colors',
              pathname.startsWith('/parties') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Users className="h-4.5 w-4.5 shrink-0" />
            <span
              className={cn(
                'text-[9.5px] tracking-tight mt-0.5 font-medium truncate w-full text-center px-0.5 block',
                pathname.startsWith('/parties') && 'font-bold text-primary'
              )}
            >
              {isBangla ? 'পার্টি' : 'Parties'}
            </span>
          </Link>

          {/* 5. Purchases */}
          <Link
            href="/purchases"
            className={cn(
              'min-w-0 w-full overflow-hidden flex flex-col items-center justify-center h-13 py-0.5 text-center transition-colors',
              pathname.startsWith('/purchases') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Truck className="h-4.5 w-4.5 shrink-0" />
            <span
              className={cn(
                'text-[9.5px] tracking-tight mt-0.5 font-medium truncate w-full text-center px-0.5 block',
                pathname.startsWith('/purchases') && 'font-bold text-primary'
              )}
            >
              {isBangla ? 'ক্রয়' : 'Purchases'}
            </span>
          </Link>

          {/* ── ROW 2 ── */}

          {/* 6. Payments */}
          <Link
            href="/finance/transactions"
            className={cn(
              'min-w-0 w-full overflow-hidden flex flex-col items-center justify-center h-11 py-0.5 text-center transition-colors',
              pathname.startsWith('/finance') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Wallet className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                'text-[9px] tracking-tight mt-0.5 font-medium truncate w-full text-center px-0.5 block',
                pathname.startsWith('/finance') && 'font-bold text-primary'
              )}
            >
              {isBangla ? 'লেনদেন' : 'Payments'}
            </span>
          </Link>

          {/* 7. Inventory */}
          <Link
            href="/inventory"
            className={cn(
              'min-w-0 w-full overflow-hidden flex flex-col items-center justify-center h-11 py-0.5 text-center transition-colors',
              pathname.startsWith('/inventory') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Package className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                'text-[9px] tracking-tight mt-0.5 font-medium truncate w-full text-center px-0.5 block',
                pathname.startsWith('/inventory') && 'font-bold text-primary'
              )}
            >
              {isBangla ? 'ইনভেন্টরি' : 'Inventory'}
            </span>
          </Link>

          {/* 8. HRM */}
          <Link
            href="/hrm/employees"
            className={cn(
              'min-w-0 w-full overflow-hidden flex flex-col items-center justify-center h-11 py-0.5 text-center transition-colors',
              pathname.startsWith('/hrm') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <UsersRound className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                'text-[9px] tracking-tight mt-0.5 font-medium truncate w-full text-center px-0.5 block',
                pathname.startsWith('/hrm') && 'font-bold text-primary'
              )}
            >
              {isBangla ? 'এইচআরএম' : 'HRM'}
            </span>
          </Link>

          {/* 9. Reports */}
          <Link
            href="/reports/dashboard"
            className={cn(
              'min-w-0 w-full overflow-hidden flex flex-col items-center justify-center h-11 py-0.5 text-center transition-colors',
              pathname.startsWith('/reports') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                'text-[9px] tracking-tight mt-0.5 font-medium truncate w-full text-center px-0.5 block',
                pathname.startsWith('/reports') && 'font-bold text-primary'
              )}
            >
              {isBangla ? 'রিপোর্ট' : 'Reports'}
            </span>
          </Link>

          {/* 10. ALL BUTTON */}
          <button
            type="button"
            onClick={() => setIsAllOpen(true)}
            className={cn(
              'min-w-0 w-full overflow-hidden flex flex-col items-center justify-center h-11 py-0.5 text-center transition-colors',
              isAllOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <LayoutGrid className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                'text-[9px] tracking-tight mt-0.5 font-medium truncate w-full text-center px-0.5 block',
                isAllOpen && 'font-bold text-primary'
              )}
            >
              {isBangla ? 'সব' : 'ALL'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default MobileBottomNav;
