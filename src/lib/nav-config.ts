// Hello Khata - Navigation Configuration
// হ্যালো খাতা - নেভিগেশন কনফিগারেশন

import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Receipt,
  BarChart3,
  Settings,
  Sparkles,
  FileText,
  Truck,
  RotateCcw,
  CreditCard,
  Tag,
  Bell,
  Plus,
} from 'lucide-react';

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

export const navGroups: NavItem[] = [
  { page: '/', icon: LayoutDashboard, labelKey: 'Dashboard', labelBn: 'ড্যাশবোর্ড' },
  {
    labelKey: 'Sales',
    labelBn: 'বিক্রি',
    icon: ShoppingCart,
    submenu: [
      { page: '/sales/new', icon: Plus , labelKey: 'New Sales', labelBn: 'নতুন বিক্রয়' },
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
      { page: '/inventory/promotions', icon: Sparkles, labelKey: 'Promotions', labelBn: 'প্রমোশন ও অফার' },
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

export const bottomNavItems = [
  { page: '/ai', icon: Sparkles, labelKey: 'AI', labelBn: 'AI সহায়ক', isPro: true },
  { page: '/settings/profile', icon: Settings, labelKey: 'Settings', labelBn: 'সেটিংস' },
];
