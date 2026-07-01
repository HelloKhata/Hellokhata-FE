'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/stores/sessionStore';
import { useUiStore, type PageRoute } from '@/stores/uiStore';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Receipt,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  LogOut,
  Store,
  HelpCircle,
  Zap,
  FileText,
  Truck,
  RotateCcw,
  Lock,
  CheckCircle,
  Trash2,
  Icon,
  CreditCard,
  LayoutList,
  Tag,
  ChevronDown,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SubnavItem {
  page: string;
  icon?: any;
  labelKey: string;
  labelBn: string;
}

export interface NavItem {
  labelKey: string;
  labelBn: string;
  icon: any;
  page?: string;
  submenu?: SubnavItem[];
}

const navGroups: NavItem[] = [
  { page: '/', icon: LayoutDashboard, labelKey: 'Dashboard', labelBn: 'ড্যাশবোর্ড' },
  {
    labelKey: 'Sales',
    labelBn: 'বিক্রি',
    icon: ShoppingCart,
    submenu: [
      { page: '/sales', icon: ShoppingCart, labelKey: 'Sales List', labelBn: 'বিক্রয় তালিকা' },
      { page: '/sales/quotations', icon: FileText, labelKey: 'Quotations', labelBn: 'কোটেশন' },
      { page: '/sales/payment-in', icon: CreditCard, labelKey: 'Payment In', labelBn: 'পেমেন্ট ইন' },
      { page: '/returns/sales', icon: RotateCcw, labelKey: 'Sales Return', labelBn: 'বিক্রয় ফেরত' },
    ],
  },
  {
    labelKey: 'Purchases',
    labelBn: 'ক্রয়',
    icon: Truck,
    submenu: [
      { page: '/purchases', icon: Truck, labelKey: 'Purchase List', labelBn: 'ক্রয় তালিকা' },
      { page: '/purchases/payment-out', icon: CreditCard, labelKey: 'Payment Out', labelBn: 'পেমেন্ট আউট' },
      { page: '/returns/purchases', icon: RotateCcw, labelKey: 'Purchase Return', labelBn: 'ক্রয় ফেরত' },
    ],
  },
  { page: '/parties', icon: Users, labelKey: 'Parties', labelBn: 'পার্টি' },
  {
    labelKey: 'Inventory',
    labelBn: 'ইনভেন্টরি',
    icon: Package,
    submenu: [
      { page: '/inventory', icon: Package, labelKey: 'Inventory List', labelBn: 'ইনভেন্টরি তালিকা' },
      { page: '/inventory/batches', icon: Tag, labelKey: 'Batches', labelBn: 'ব্যাচ' },
    ],
  },
  // {
  //   labelKey: 'Finance',
  //   labelBn: 'অর্থায়ন',
  //   icon: Receipt,
  //   submenu: [
  //     { page: '/expenses', icon: Receipt, labelKey: 'Expenses', labelBn: 'খরচ' },
  //     { page: '/collection', icon: LayoutList, labelKey: 'Collection Center', labelBn: 'কালেকশন সেন্টার' },
  //     { page: '/payment-plans', icon: CreditCard, labelKey: 'Payment Plans', labelBn: 'পেমেন্ট প্ল্যান' },
  //   ],
  // },
  { page: '/expenses', icon: Receipt, labelKey: 'Expenses', labelBn: 'খরচ' },
  { page: '/reminders', icon: Bell, labelKey: 'Reminders', labelBn: 'রিমাইন্ডার' },
  {
    labelKey: 'Reports',
    labelBn: 'রিপোর্ট',
    icon: BarChart3,
    page: '/reports',
    submenu: [
      { page: '/reports/sales', icon: ShoppingCart, labelKey: 'Sales Report', labelBn: 'বিক্রয় রিপোর্ট' },
      { page: '/reports/purchase', icon: Truck, labelKey: 'Purchase Reports', labelBn: 'ক্রয় রিপোর্ট' },
      { page: '/reports/profit-loss', icon: Receipt, labelKey: 'Profit/Loss', labelBn: 'লাভ-লোকসান' },
      { page: '/reports/stock', icon: Package, labelKey: 'Stock', labelBn: 'স্টক' },
      { page: '/reports/health-score', icon: Sparkles, labelKey: 'Health Score', labelBn: 'হেলথ স্কোর' },
    ],
  },
];

const bottomNavItems = [
  { page: '/ai', icon: Sparkles, labelKey: 'AI', labelBn: 'AI সহায়ক', isPro: true },
  { page: '/settings/profile', icon: Settings, labelKey: 'Settings', labelBn: 'সেটিংস' },
];

export function Sidebar() {
  const { t, isBangla } = useAppTranslation();
  const { business, logout, plan, features } = useSessionStore();
  const { sidebarCollapsed, setSidebarCollapsed, currentPage, navigateTo } = useUiStore();
  const path = usePathname();
  const language = useUiStore((state) => state.language);

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(() => {
    // Initialize with the submenu that is active based on path
    const initialOpen: Record<string, boolean> = {};
    navGroups.forEach((group) => {
      if (group.submenu && group.submenu.some((sub) => path === sub.page)) {
        initialOpen[group.labelKey] = true;
      }
    });
    return initialOpen;
  });

  const toggleSubmenu = (labelKey: string) => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
      setOpenSubmenus((prev) => ({ ...prev, [labelKey]: true }));
      return;
    }
    setOpenSubmenus((prev) => ({
      ...prev,
      [labelKey]: !prev[labelKey],
    }));
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen',
          'bg-sidebar border-r border-sidebar-border',
          'flex flex-col transition-all duration-300 ease-smooth',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header */}
        <div className={cn(
          'flex h-16 items-center border-b border-border-subtle px-4',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-emerald flex items-center justify-center">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-foreground">Hello Khata</span>
                <span className="text-[10px] text-muted-foreground">হ্যালো খাতা</span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground p-0 flex items-center justify-center"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform duration-200', sidebarCollapsed && 'rotate-180')} />
          </Button>
        </div>

        {/* Business Name */}
        {!sidebarCollapsed && business && (
          <div className="px-4 py-3 border-b border-border-subtle bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-subtle flex items-center justify-center">
                <Zap className="h-4 w-4 text-indigo" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {business.nameBn || business.name}
                </p>
                <p className="text-xs text-muted-foreground">{business.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <ScrollArea className="flex-1 px-3 py-4 scrollbar-premium overflow-y-auto">
          <nav className="space-y-1.5">
            {navGroups.map((item, index) => {
              const isGroupActive = item.submenu
                ? item.submenu.some((sub) => path === sub.page) || (item.page && path === item.page)
                : path === item.page;

              const element = item.submenu ? (
                // Group with submenu
                <div className="space-y-1">
                  <Link
                    href={item.page || '#'}
                    onClick={(e) => {
                      toggleSubmenu(item.labelKey);
                      if (!item.page) {
                        e.preventDefault();
                      }
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full text-left',
                      'relative group',
                      'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                      isGroupActive && !openSubmenus[item.labelKey] && 'text-primary bg-primary-subtle',
                      sidebarCollapsed && 'justify-center px-2',
                    )}
                  >
                    {isGroupActive && !openSubmenus[item.labelKey] && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                    <item.icon className={cn(
                      'h-5 w-5 flex-shrink-0 transition-all duration-200',
                      isGroupActive && 'text-primary',
                      'group-hover:scale-105'
                    )} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="truncate">{language === 'en' ? item.labelKey : item.labelBn}</span>
                        <span className="ml-auto flex-shrink-0">
                          {openSubmenus[item.labelKey] ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                          )}
                        </span>
                      </>
                    )}
                  </Link>

                  {/* Submenu list */}
                  {!sidebarCollapsed && openSubmenus[item.labelKey] && (
                    <div className="mt-1 ml-4 pl-3 border-l border-sidebar-border space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.page}
                          href={subItem.page}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 w-full relative group',
                            'text-muted-foreground hover:text-foreground hover:bg-muted/30',
                            path === subItem.page && 'text-primary bg-primary-subtle font-semibold',
                          )}
                        >
                          {path === subItem.page && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />
                          )}
                          {subItem.icon && (
                            <subItem.icon className={cn(
                              'h-4 w-4 flex-shrink-0 transition-all duration-200',
                              path === subItem.page && 'text-primary'
                            )} />
                          )}
                          <span className="truncate">{language === 'en' ? subItem.labelKey : subItem.labelBn}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Direct Link
                <Link
                  href={item.page || '/'}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full',
                    'relative group',
                    'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                    path === item.page && 'text-primary bg-primary-subtle',
                    sidebarCollapsed && 'justify-center px-2',
                  )}
                >
                  {path === item.page && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                  <item.icon className={cn(
                    'h-5 w-5 flex-shrink-0 transition-all duration-200',
                    path === item.page && 'text-primary',
                    'group-hover:scale-105'
                  )} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{language === 'en' ? item.labelKey : item.labelBn}</span>
                  )}
                </Link>
              );

              return (
                <div key={item.labelKey} className="stagger-item" style={{ animationDelay: `${index * 30}ms` }}>
                  {sidebarCollapsed ? (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div className="w-full">{element}</div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-popover border border-border text-popover-foreground">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-xs">{language === 'en' ? item.labelKey : item.labelBn}</span>
                          {item.submenu && (
                            <div className="flex flex-col gap-0.5 pl-2 border-l border-border text-[11px] text-muted-foreground">
                              {item.submenu.map((sub) => (
                                <span key={sub.page}>• {language === 'en' ? sub.labelKey : sub.labelBn}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    element
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Bottom Navigation */}
        <div className="border-t border-border-subtle p-3 space-y-1">
          {bottomNavItems?.map((item, index) => (
            <div key={item.page} className="stagger-item" style={{ animationDelay: `${(navGroups.length + index) * 30}ms` }}>
              <Link href={item.page}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full',
                  'relative group',
                  'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  path === item.page && [
                    'text-primary bg-primary-subtle',
                  ],
                  sidebarCollapsed && 'justify-center px-2',
                )}
              >
                {/* Active indicator dot */}
                {path === item.page && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}

                <item.icon className={cn(
                  'h-5 w-5 flex-shrink-0 transition-all duration-200',
                  path === item.page && 'text-primary',
                  'group-hover:scale-105'
                )} />

                {!sidebarCollapsed && (
                  <>
                    <span className="truncate">{language === 'en' ? item.labelKey : item.labelBn}</span>
                  </>
                )}
              </Link>
            </div>
          ))}

          {/* Logout */}
          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium w-full',
              'text-destructive hover:bg-destructive-subtle transition-all duration-200',
              sidebarCollapsed && 'justify-center px-2 mt-2'
            )}
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span>{isBangla ? 'লগআউট' : 'Logout'}</span>}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
