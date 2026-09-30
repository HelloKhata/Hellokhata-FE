import React from "react";
import { format } from "date-fns";
import {
  ShoppingBag,
  Briefcase,
  Package,
  Home,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Building2,
  Receipt,
  Tag,
  Layers,
} from "lucide-react";

// --- Types ---
export interface CategoryItem {
  id: string;
  name?: string;
  nameEn: string;
  nameBn: string;
  percentage: number;
  amount: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}

export interface IncomeRecord {
  id: string;
  voucherCode: string;
  categoryId: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  dateEn: string;
  dateBn: string;
  branch: string;
  paymentMethod: string;
  isRecurring: boolean;
  recurringFrequency?: string;
  attachmentName?: string | null;
  amount: number;
  color: string;
  bgColor: string;
  icon: React.ElementType;
}

// Income Category Icons & Presets
export const INCOME_CATEGORY_ICONS = [
  { id: "shopping-bag", labelEn: "Sales", labelBn: "বিক্রয়", icon: ShoppingBag },
  { id: "briefcase", labelEn: "Services", labelBn: "সার্ভিস", icon: Briefcase },
  { id: "package", labelEn: "Wholesale", labelBn: "পাইকারি", icon: Package },
  { id: "home", labelEn: "Rental", labelBn: "ভাড়া", icon: Home },
  { id: "piggy-bank", labelEn: "Investment", labelBn: "বিনিয়োগ", icon: PiggyBank },
  { id: "trending-up", labelEn: "Profit", labelBn: "মুনাফা", icon: TrendingUp },
  { id: "credit-card", labelEn: "Card/POS", labelBn: "কার্ড", icon: CreditCard },
  { id: "building", labelEn: "Corporate", labelBn: "কর্পোরেট", icon: Building2 },
  { id: "receipt", labelEn: "Receipt", labelBn: "রসিদ", icon: Receipt },
  { id: "tag", labelEn: "Commission", labelBn: "কমিশন", icon: Tag },
  { id: "layers", labelEn: "Other", labelBn: "অন্যান্য", icon: Layers },
];

export const CATEGORY_COLOR_PRESETS = [
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#f43f5e",
  "#14b8a6",
];

export const getCategoryColorStyles = (hexColor: string) => {
  const color = hexColor.toLowerCase();
  switch (color) {
    case "#10b981":
      return { bgColor: "bg-emerald-500/15 text-emerald-400", borderColor: "border-emerald-500/20" };
    case "#06b6d4":
      return { bgColor: "bg-cyan-500/15 text-cyan-400", borderColor: "border-cyan-500/20" };
    case "#3b82f6":
      return { bgColor: "bg-blue-500/15 text-blue-400", borderColor: "border-blue-500/20" };
    case "#8b5cf6":
      return { bgColor: "bg-purple-500/15 text-purple-400", borderColor: "border-purple-500/20" };
    case "#f59e0b":
      return { bgColor: "bg-amber-500/15 text-amber-400", borderColor: "border-amber-500/20" };
    case "#ec4899":
      return { bgColor: "bg-pink-500/15 text-pink-400", borderColor: "border-pink-500/20" };
    case "#f43f5e":
      return { bgColor: "bg-rose-500/15 text-rose-400", borderColor: "border-rose-500/20" };
    case "#14b8a6":
      return { bgColor: "bg-teal-500/15 text-teal-400", borderColor: "border-teal-500/20" };
    default:
      return { bgColor: "bg-emerald-500/15 text-emerald-400", borderColor: "border-emerald-500/20" };
  }
};

export const getIconComponentById = (iconId: string): React.ElementType => {
  const match = INCOME_CATEGORY_ICONS.find((item) => item.id === iconId);
  return match ? match.icon : ShoppingBag;
};

export const findIconIdByComponent = (iconComp: React.ElementType): string => {
  const match = INCOME_CATEGORY_ICONS.find((item) => item.icon === iconComp);
  return match ? match.id : "shopping-bag";
};

export const PAYMENT_METHOD_MAP: Record<
  string,
  { en: string; bn: string; badgeColor: string }
> = {
  cash: {
    en: "Cash in Hand",
    bn: "ক্যাশ / নগদ",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  bank: {
    en: "Bank Transfer",
    bn: "ব্যাংক ট্রান্সফার",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  bkash: {
    en: "bKash Pay",
    bn: "বিকাশ",
    badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  nagad: {
    en: "Nagad Wallet",
    bn: "নগদ",
    badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  card: {
    en: "Credit/Debit Card",
    bn: "কার্ড",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  cheque: {
    en: "Bank Cheque",
    bn: "চেক",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
};

export const toBnNum = (num: number | string): string => {
  const bnDigits: { [key: string]: string } = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  return num.toString().replace(/\d/g, (d) => bnDigits[d] || d);
};

export const formatBnDate = (date: Date): string => {
  const bnMonths = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  const day = toBnNum(format(date, "dd"));
  const month = bnMonths[date.getMonth()];
  const year = toBnNum(format(date, "yyyy"));
  return `${day} ${month}, ${year}`;
};

export const INITIAL_INCOME_CATEGORIES: CategoryItem[] = [
  {
    id: "sales",
    nameEn: "Product Sales",
    nameBn: "পণ্য বিক্রয়",
    percentage: 45,
    amount: 82890,
    color: "#10b981",
    bgColor: "bg-emerald-500/15 text-emerald-400",
    borderColor: "border-emerald-500/20",
    icon: ShoppingBag,
  },
  {
    id: "services",
    nameEn: "Services & Support",
    nameBn: "সার্ভিস ও সেবা",
    percentage: 22,
    amount: 40520,
    color: "#06b6d4",
    bgColor: "bg-cyan-500/15 text-cyan-400",
    borderColor: "border-cyan-500/20",
    icon: Briefcase,
  },
  {
    id: "wholesale",
    nameEn: "Wholesale Delivery",
    nameBn: "পাইকারি সরবরাহ",
    percentage: 16,
    amount: 29470,
    color: "#3b82f6",
    bgColor: "bg-blue-500/15 text-blue-400",
    borderColor: "border-blue-500/20",
    icon: Package,
  },
  {
    id: "rental",
    nameEn: "Rental Income",
    nameBn: "ভাড়া বাবদ আয়",
    percentage: 10,
    amount: 18420,
    color: "#8b5cf6",
    bgColor: "bg-purple-500/15 text-purple-400",
    borderColor: "border-purple-500/20",
    icon: Home,
  },
  {
    id: "investment",
    nameEn: "Investment & Profit",
    nameBn: "বিনিয়োগ ও লভ্যাংশ",
    percentage: 7,
    amount: 12900,
    color: "#f59e0b",
    bgColor: "bg-amber-500/15 text-amber-400",
    borderColor: "border-amber-500/20",
    icon: PiggyBank,
  },
];

export const INITIAL_INCOME_RECORDS: IncomeRecord[] = [
  {
    id: "inc-1",
    voucherCode: "INC-2026-0901",
    categoryId: "sales",
    titleEn: "Product Sales",
    titleBn: "পণ্য বিক্রয়",
    subtitleEn: "Showroom retail cash sales batch #14",
    subtitleBn: "শোরুমের খুচরা ক্যাশ বিক্রয় ব্যাচ #১৪",
    dateEn: "Aug 22, 2026",
    dateBn: "২২ আগস্ট, ২০২৬",
    branch: "Main Branch",
    paymentMethod: "cash",
    isRecurring: false,
    attachmentName: "pos_sales_receipt_0901.pdf",
    amount: 18500,
    color: "#10b981",
    bgColor: "bg-emerald-500/15 text-emerald-400",
    icon: ShoppingBag,
  },
  {
    id: "inc-2",
    voucherCode: "INC-2026-0900",
    categoryId: "services",
    titleEn: "Services & Support",
    titleBn: "সার্ভিস ও সেবা",
    subtitleEn: "Corporate maintenance service retainer fee",
    subtitleBn: "কর্পোরেট মেইনটেন্যান্স সার্ভিস ফি",
    dateEn: "Aug 21, 2026",
    dateBn: "২১ আগস্ট, ২০২৬",
    branch: "Gulshan Store",
    paymentMethod: "bank",
    isRecurring: true,
    recurringFrequency: "monthly",
    attachmentName: "retainer_invoice_aug.pdf",
    amount: 35000,
    color: "#06b6d4",
    bgColor: "bg-cyan-500/15 text-cyan-400",
    icon: Briefcase,
  },
  {
    id: "inc-3",
    voucherCode: "INC-2026-0899",
    categoryId: "wholesale",
    titleEn: "Wholesale Delivery",
    titleBn: "পাইকারি সরবরাহ",
    subtitleEn: "Bulk order dispatch to Chittagong dealer",
    subtitleBn: "চট্টগ্রাম ডিলারকে পাইকারি মালামাল সরবরাহ",
    dateEn: "Aug 20, 2026",
    dateBn: "২০ আগস্ট, ২০২৬",
    branch: "Tejgaon Central Depot",
    paymentMethod: "bkash",
    isRecurring: false,
    attachmentName: "dealer_challan_899.pdf",
    amount: 54000,
    color: "#3b82f6",
    bgColor: "bg-blue-500/15 text-blue-400",
    icon: Package,
  },
  {
    id: "inc-4",
    voucherCode: "INC-2026-0898",
    categoryId: "rental",
    titleEn: "Rental Income",
    titleBn: "ভাড়া বাবদ আয়",
    subtitleEn: "Warehouse 2nd floor sublet monthly rent",
    subtitleBn: "গুদামের ২য় তলার সাবলেট মাসিক ভাড়া",
    dateEn: "Aug 18, 2026",
    dateBn: "১৮ আগস্ট, ২০২৬",
    branch: "Main Branch",
    paymentMethod: "bank",
    isRecurring: true,
    recurringFrequency: "monthly",
    attachmentName: "lease_sublet_receipt.pdf",
    amount: 22000,
    color: "#8b5cf6",
    bgColor: "bg-purple-500/15 text-purple-400",
    icon: Home,
  },
  {
    id: "inc-5",
    voucherCode: "INC-2026-0897",
    categoryId: "investment",
    titleEn: "Investment & Profit",
    titleBn: "বিনিয়োগ ও লভ্যাংশ",
    subtitleEn: "Q2 dividend payout from joint partner venture",
    subtitleBn: "যৌথ বিনিয়োগ থেকে ২য় প্রান্তিক লভ্যাংশ",
    dateEn: "Aug 15, 2026",
    dateBn: "১৫ আগস্ট, ২০২৬",
    branch: "Main Branch",
    paymentMethod: "card",
    isRecurring: false,
    attachmentName: "dividend_credit_advice.pdf",
    amount: 45000,
    color: "#f59e0b",
    bgColor: "bg-amber-500/15 text-amber-400",
    icon: PiggyBank,
  },
  {
    id: "inc-6",
    voucherCode: "INC-2026-0896",
    categoryId: "sales",
    titleEn: "Product Sales",
    titleBn: "পণ্য বিক্রয়",
    subtitleEn: "Direct corporate supplies supply invoice #441",
    subtitleBn: "কর্পোরেট সরবরাহ বিক্রয় ইনভয়েস #৪৪১",
    dateEn: "Aug 12, 2026",
    dateBn: "১২ আগস্ট, ২০২৬",
    branch: "Uttara Branch",
    paymentMethod: "cheque",
    isRecurring: false,
    attachmentName: null,
    amount: 12500,
    color: "#10b981",
    bgColor: "bg-emerald-500/15 text-emerald-400",
    icon: ShoppingBag,
  },
];
