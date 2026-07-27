'use client';

import { Badge } from '@/components/ui/premium';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { useUiStore, useSessionStore } from '@/stores';
import {
  User,
  Building2,
  Users,
  Shield,
  Database,
  CreditCard,
  HelpCircle,
  Globe,
  Palette,
  LogOut,
  Lock,
  FileText,
  Package,
  Trash2,
  CheckCircle,
  Settings,
  Printer,
  Laptop,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t, isBangla, changeLanguage } = useAppTranslation();
  const { theme, setTheme, language } = useUiStore();
  const logout = useSessionStore((state) => state.logout);

  // Settings items consolidated for top tab navigation
  const settingsItems = [
    { id: 'profile', labelEn: 'Account Settings', labelBn: 'অ্যাকাউন্ট সেটিংস', href: '/settings/accounts', icon: User },
    { id: 'security', labelEn: 'Security Settings', labelBn: 'সিকিউরিটি সেটিংস', href: '/settings/security', icon: Lock },
    { id: 'invoice', labelEn: 'Invoice Settings', labelBn: 'ইনভয়েস সেটিংস', href: '/settings/invoice', icon: FileText },
    { id: 'branches', labelEn: 'Branch Management', labelBn: 'শাখা পরিচালনা', href: '/settings/branches', icon: Building2, isPro: true },
    { id: 'roles', labelEn: 'Roles & Permissions', labelBn: 'ভূমিকা ও অনুমতি', href: '/settings/roles', icon: Lock, isPro: true },
    { id: 'connected-devices', labelEn: 'Connected Devices', labelBn: 'সংযুক্ত ডিভাইস', href: '/settings/connected-devices', icon: Laptop, isPro: true },
  ];

  return (
    <div className="space-y-6">
      {/* Settings Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            {t('settings.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isBangla
              ? 'অ্যাপ ও ব্যবসার সেটিংস পরিচালনা করুন'
              : 'Manage your app and business settings'}
          </p>
        </div>

        {/* Global Controls (Language, Theme, Logout) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Toggle */}
          <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/50 text-xs">
            <Globe className="h-3.5 w-3.5 text-muted-foreground ml-1.5 mr-1" />
            <button
              onClick={() => changeLanguage('bn')}
              className={cn(
                'px-2.5 py-1 font-medium rounded-lg transition-all',
                language === 'bn'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              বাংলা
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={cn(
                'px-2.5 py-1 font-medium rounded-lg transition-all',
                language === 'en'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/50 text-xs">
            <Palette className="h-3.5 w-3.5 text-muted-foreground ml-1.5 mr-1" />
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-2 py-1 font-medium text-muted-foreground hover:text-foreground capitalize transition-all"
            >
              {theme}
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isBangla ? 'লগআউট' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Top Horizontal Navigation Bar */}
      <div className="relative border-b border-border/60">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-1 -mb-px">
          {settingsItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2',
                  isActive
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <span>{isBangla ? item.labelBn : item.labelEn}</span>
                {item.isPro && (
                  <Badge variant="indigo" size="sm" className="ml-1 text-[10px]">
                    Pro
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sub-page Content Render */}
      <div className="pt-2">{children}</div>
    </div>
  );
}