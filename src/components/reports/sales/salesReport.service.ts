// Hello Khata OS - Minimal Sales Report Service & Dynamic Calculation Engine
// হ্যালো খাতা - মিনিমাল বিক্রয় রিপোর্ট সার্ভিস

import {
  ReportPeriod,
  TrendInterval,
  SalesFocusItem,
  AdvancedFilterState,
  MinimalSalesReportData,
  DriverItem,
  SalesTransactionRecord,
  TimeSeriesTrendPoint,
} from '@/types/sales.-reports';

// Base Master Records
const masterInvoices: SalesTransactionRecord[] = [
  {
    id: 'inv-1001',
    invoiceNo: 'INV-2048',
    date: '18 May 2026',
    rawDate: '2026-05-18',
    customerName: 'ABC Traders & Pharmacy',
    customerPhone: '+880 1711-234567',
    itemsCount: 5,
    amount: 12500,
    paymentStatus: 'paid',
    paymentMethod: 'bKash',
    salesperson: 'Rahim Ahmed',
    branch: 'Dhaka Main Branch',
    items: [
      { id: 'p-1', name: 'Paracetamol 500mg', nameBn: 'প্যারাসিটামল ৫০০ মি.গ্রা.', quantity: 15, unitPrice: 350, discount: 50, total: 5200 },
      { id: 'p-2', name: 'ORS Saline (Pack of 25)', nameBn: 'ওআরএস স্যালাইন ২৫ প্যাক', quantity: 12, unitPrice: 250, discount: 0, total: 3000 },
      { id: 'p-3', name: 'Napa Extra Tablet', nameBn: 'নাপা এক্সট্রা ট্যাবলেট', quantity: 10, unitPrice: 430, discount: 0, total: 4300 },
    ],
  },
  {
    id: 'inv-1002',
    invoiceNo: 'INV-2047',
    date: '18 May 2026',
    rawDate: '2026-05-18',
    customerName: 'Walk-in Customer',
    customerPhone: '+880 1819-000000',
    itemsCount: 3,
    amount: 4200,
    paymentStatus: 'paid',
    paymentMethod: 'Cash',
    salesperson: 'Karim Ullah',
    branch: 'Dhaka Main Branch',
    items: [
      { id: 'p-1', name: 'Paracetamol 500mg', nameBn: 'প্যারাসিটামল ৫০০ মি.গ্রা.', quantity: 6, unitPrice: 350, discount: 0, total: 2100 },
      { id: 'p-4', name: 'Cough Syrup 100ml', nameBn: 'কাফ সিরাপ ১০০ মিলি', quantity: 10, unitPrice: 210, discount: 0, total: 2100 },
    ],
  },
  {
    id: 'inv-1003',
    invoiceNo: 'INV-2046',
    date: '17 May 2026',
    rawDate: '2026-05-17',
    customerName: 'Rahim General Store',
    customerPhone: '+880 1819-876543',
    itemsCount: 8,
    amount: 18600,
    paymentStatus: 'paid',
    paymentMethod: 'Nagad',
    salesperson: 'Tanvir Hasan',
    branch: 'Chattogram Branch',
    items: [
      { id: 'p-2', name: 'ORS Saline (Pack of 25)', nameBn: 'ওআরএস স্যালাইন ২৫ প্যাক', quantity: 30, unitPrice: 250, discount: 100, total: 7400 },
      { id: 'p-5', name: 'Vitamin C 500mg', nameBn: 'ভিটামিন সি ৫০০ মি.গ্রা.', quantity: 50, unitPrice: 120, discount: 0, total: 6000 },
      { id: 'p-3', name: 'Napa Extra Tablet', nameBn: 'নাপা এক্সট্রা ট্যাবলেট', quantity: 12, unitPrice: 430, discount: 0, total: 5200 },
    ],
  },
  {
    id: 'inv-1004',
    invoiceNo: 'INV-2045',
    date: '16 May 2026',
    rawDate: '2026-05-16',
    customerName: 'Noor Enterprise & Clinic',
    customerPhone: '+880 1912-334455',
    itemsCount: 6,
    amount: 15400,
    paymentStatus: 'partial',
    paymentMethod: 'Bank Transfer',
    salesperson: 'Rahim Ahmed',
    branch: 'Dhaka Main Branch',
    items: [
      { id: 'p-1', name: 'Paracetamol 500mg', nameBn: 'প্যারাসিটামল ৫০০ মি.গ্রা.', quantity: 20, unitPrice: 350, discount: 100, total: 6900 },
      { id: 'p-6', name: 'Surgical Face Masks (50pcs)', nameBn: 'সার্জিক্যাল ফেস মাস্ক', quantity: 25, unitPrice: 340, discount: 0, total: 8500 },
    ],
  },
  {
    id: 'inv-1005',
    invoiceNo: 'INV-2044',
    date: '15 May 2026',
    rawDate: '2026-05-15',
    customerName: 'M/S Karim Traders',
    customerPhone: '+880 1622-445566',
    itemsCount: 4,
    amount: 9800,
    paymentStatus: 'paid',
    paymentMethod: 'Cash',
    salesperson: 'Farhana Akter',
    branch: 'Sylhet Branch',
    items: [
      { id: 'p-3', name: 'Napa Extra Tablet', nameBn: 'নাপা এক্সট্রা ট্যাবলেট', quantity: 15, unitPrice: 430, discount: 50, total: 6400 },
      { id: 'p-4', name: 'Cough Syrup 100ml', nameBn: 'কাফ সিরাপ ১০০ মিলি', quantity: 16, unitPrice: 210, discount: 0, total: 3400 },
    ],
  },
  {
    id: 'inv-1006',
    invoiceNo: 'INV-2043',
    date: '14 May 2026',
    rawDate: '2026-05-14',
    customerName: 'Popular Medicine Corner',
    customerPhone: '+880 1715-998877',
    itemsCount: 11,
    amount: 22400,
    paymentStatus: 'paid',
    paymentMethod: 'bKash',
    salesperson: 'Rahim Ahmed',
    branch: 'Dhaka Main Branch',
    items: [
      { id: 'p-1', name: 'Paracetamol 500mg', nameBn: 'প্যারাসিটামল ৫০০ মি.গ্রা.', quantity: 30, unitPrice: 350, discount: 200, total: 10300 },
      { id: 'p-2', name: 'ORS Saline (Pack of 25)', nameBn: 'ওআরএস স্যালাইন ২৫ প্যাক', quantity: 28, unitPrice: 250, discount: 0, total: 7000 },
      { id: 'p-5', name: 'Vitamin C 500mg', nameBn: 'ভিটামিন সি ৫০০ মি.গ্রা.', quantity: 42, unitPrice: 120, discount: 0, total: 5100 },
    ],
  },
  {
    id: 'inv-1007',
    invoiceNo: 'INV-2042',
    date: '13 May 2026',
    rawDate: '2026-05-13',
    customerName: 'Walk-in Customer',
    customerPhone: '+880 1819-000000',
    itemsCount: 2,
    amount: 3100,
    paymentStatus: 'paid',
    paymentMethod: 'Cash',
    salesperson: 'Karim Ullah',
    branch: 'Dhaka Main Branch',
    items: [
      { id: 'p-2', name: 'ORS Saline (Pack of 25)', nameBn: 'ওআরএস স্যালাইন ২৫ প্যাক', quantity: 8, unitPrice: 250, discount: 0, total: 2000 },
      { id: 'p-4', name: 'Cough Syrup 100ml', nameBn: 'কাফ সিরাপ ১০০ মিলি', quantity: 5, unitPrice: 220, discount: 0, total: 1100 },
    ],
  },
  {
    id: 'inv-1008',
    invoiceNo: 'INV-2041',
    date: '12 May 2026',
    rawDate: '2026-05-12',
    customerName: 'Shahjalal Pharmacy',
    customerPhone: '+880 1712-443322',
    itemsCount: 7,
    amount: 14700,
    paymentStatus: 'due',
    paymentMethod: 'Credit',
    salesperson: 'Farhana Akter',
    branch: 'Sylhet Branch',
    items: [
      { id: 'p-1', name: 'Paracetamol 500mg', nameBn: 'প্যারাসিটামল ৫০০ মি.গ্রা.', quantity: 18, unitPrice: 350, discount: 0, total: 6300 },
      { id: 'p-3', name: 'Napa Extra Tablet', nameBn: 'নাপা এক্সট্রা ট্যাবলেট', quantity: 14, unitPrice: 430, discount: 0, total: 6020 },
      { id: 'p-4', name: 'Cough Syrup 100ml', nameBn: 'কাফ সিরাপ ১০০ মিলি', quantity: 11, unitPrice: 216, discount: 0, total: 2380 },
    ],
  },
  {
    id: 'inv-1009',
    invoiceNo: 'INV-2040',
    date: '11 May 2026',
    rawDate: '2026-05-11',
    customerName: 'ABC Traders & Pharmacy',
    customerPhone: '+880 1711-234567',
    itemsCount: 9,
    amount: 19800,
    paymentStatus: 'paid',
    paymentMethod: 'Bank Transfer',
    salesperson: 'Rahim Ahmed',
    branch: 'Dhaka Main Branch',
    items: [
      { id: 'p-1', name: 'Paracetamol 500mg', nameBn: 'প্যারাসিটামল ৫০০ মি.গ্রা.', quantity: 25, unitPrice: 350, discount: 150, total: 8600 },
      { id: 'p-2', name: 'ORS Saline (Pack of 25)', nameBn: 'ওআরএস স্যালাইন ২৫ প্যাক', quantity: 24, unitPrice: 250, discount: 0, total: 6000 },
      { id: 'p-5', name: 'Vitamin C 500mg', nameBn: 'ভিটামিন সি ৫০০ মি.গ্রা.', quantity: 43, unitPrice: 120, discount: 0, total: 5200 },
    ],
  },
  {
    id: 'inv-1010',
    invoiceNo: 'INV-2039',
    date: '10 May 2026',
    rawDate: '2026-05-10',
    customerName: 'Bengal Health Supplies',
    customerPhone: '+880 1933-778899',
    itemsCount: 14,
    amount: 27500,
    paymentStatus: 'paid',
    paymentMethod: 'bKash',
    salesperson: 'Tanvir Hasan',
    branch: 'Chattogram Branch',
    items: [
      { id: 'p-2', name: 'ORS Saline (Pack of 25)', nameBn: 'ওআরএস স্যালাইন ২৫ প্যাক', quantity: 40, unitPrice: 250, discount: 200, total: 9800 },
      { id: 'p-3', name: 'Napa Extra Tablet', nameBn: 'নাপা এক্সট্রা ট্যাবলেট', quantity: 25, unitPrice: 430, discount: 0, total: 10750 },
      { id: 'p-6', name: 'Surgical Face Masks (50pcs)', nameBn: 'সার্জিক্যাল ফেস মাস্ক', quantity: 20, unitPrice: 340, discount: 0, total: 6950 },
    ],
  }
];

// Product master metadata
const masterProducts: DriverItem[] = [
  { id: 'p-1', rank: 1, name: 'Paracetamol 500mg', nameBn: 'প্যারাসিটামল ৫০০ মি.গ্রা.', subtitle: 'Tablet • 500mg Box', subtitleBn: 'ট্যাবলেট • ৫০০ মি.গ্রা. বক্স', amount: 42500, sharePercentage: 17.1, growthPercentage: 22.4, ordersCount: 84, category: 'Medicine' },
  { id: 'p-2', rank: 2, name: 'ORS (Oral Rehydration Salts)', nameBn: 'ওআরএস স্যালাইন', subtitle: 'Electrolyte Pack • 25s', subtitleBn: 'ইলেক্ট্রোলাইট প্যাক • ২৫টি', amount: 38400, sharePercentage: 15.5, growthPercentage: 14.2, ordersCount: 76, category: 'Medicine' },
  { id: 'p-3', rank: 3, name: 'Napa Extra Tablet', nameBn: 'নাপা এক্সট্রা ট্যাবলেট', subtitle: 'Paracetamol + Caffeine', subtitleBn: 'প্যারাসিটামল + ক্যাফেইন', amount: 32700, sharePercentage: 13.2, growthPercentage: 8.5, ordersCount: 68, category: 'Medicine' },
  { id: 'p-4', rank: 4, name: 'Cough Syrup 100ml', nameBn: 'কাফ সিরাপ ১০০ মিলি', subtitle: 'Expectorant • Honey Base', subtitleBn: 'কাশি উপশম সিরাপ • ১০০ মিলি', amount: 28500, sharePercentage: 11.5, growthPercentage: 6.2, ordersCount: 52, category: 'Medicine' },
  { id: 'p-5', rank: 5, name: 'Vitamin C 500mg Chewable', nameBn: 'ভিটামিন সি ৫০০ মি.গ্রা.', subtitle: 'Chewable Orange • Strip', subtitleBn: 'কমলা ফ্লেভার ভিটামিন', amount: 24800, sharePercentage: 10.0, growthPercentage: 11.8, ordersCount: 46, category: 'Supplements' },
  { id: 'p-6', rank: 6, name: 'Surgical Face Masks (50pcs)', nameBn: 'সার্জিক্যাল ফেস মাস্ক ৫০টি', subtitle: '3-Ply Medical Grade', subtitleBn: '৩-প্লাই মেডিকেল গ্রেড', amount: 21600, sharePercentage: 8.7, growthPercentage: 4.1, ordersCount: 38, category: 'Medical Supplies' },
  { id: 'p-7', rank: 7, name: 'Antiseptic Solution 500ml', nameBn: 'অ্যান্টিসেপটিক সলিউশন', subtitle: 'Liquid Disinfectant', subtitleBn: 'তরল জীবাণুনাশক', amount: 16800, sharePercentage: 6.8, growthPercentage: -2.4, ordersCount: 29, category: 'Personal Care' },
];

const masterCategories: DriverItem[] = [
  { id: 'cat-med', rank: 1, name: 'Prescription & OTC Medicine', nameBn: 'ঔষধ ও ফার্মাসিউটিক্যালস', subtitle: '142 SKU items', subtitleBn: '১৪২টি আইটেম', amount: 142100, sharePercentage: 57.2, growthPercentage: 18.6, ordersCount: 224 },
  { id: 'cat-supp', rank: 2, name: 'Vitamins & Health Supplements', nameBn: 'ভিটামিন ও স্বাস্থ্য সাপ্লিমেন্ট', subtitle: '38 SKU items', subtitleBn: '৩৮টি আইটেম', amount: 48500, sharePercentage: 19.5, growthPercentage: 12.3, ordersCount: 68 },
  { id: 'cat-care', rank: 3, name: 'Personal Care & Hygiene', nameBn: 'ব্যক্তিগত যত্ন ও সুরক্ষা', subtitle: '54 SKU items', subtitleBn: '৫৪টি আইটেম', amount: 34200, sharePercentage: 13.8, growthPercentage: 4.5, ordersCount: 52 },
  { id: 'cat-surg', rank: 4, name: 'Medical Equipment & Surgical', nameBn: 'সার্জিক্যাল সামগ্রী', subtitle: '26 SKU items', subtitleBn: '২৬টি আইটেম', amount: 23700, sharePercentage: 9.5, growthPercentage: 7.2, ordersCount: 35 },
];

const masterCustomers: DriverItem[] = [
  { id: 'c-1', rank: 1, name: 'ABC Traders & Pharmacy', nameBn: 'এবিসি ট্রেডার্স ও ফার্মেসি', subtitle: 'Dhanmondi, Dhaka • Platinum B2B', subtitleBn: 'ধানমন্ডি, ঢাকা', amount: 32300, sharePercentage: 13.0, growthPercentage: 24.1, ordersCount: 14 },
  { id: 'c-2', rank: 2, name: 'Rahim General Store', nameBn: 'রহমান জেনারেল স্টোর', subtitle: 'Agrabad, Chattogram • Gold B2B', subtitleBn: 'আগ্রাবাদ, চট্টগ্রাম', amount: 28600, sharePercentage: 11.5, growthPercentage: 9.2, ordersCount: 11 },
  { id: 'c-3', rank: 3, name: 'Popular Medicine Corner', nameBn: 'পপুলার মেডিসিন কর্নার', subtitle: 'Mirpur, Dhaka • Regular', subtitleBn: 'মিরপুর, ঢাকা', amount: 22400, sharePercentage: 9.0, growthPercentage: 15.0, ordersCount: 8 },
  { id: 'c-4', rank: 4, name: 'Bengal Health Supplies', nameBn: 'বেঙ্গল হেলথ সাপ্লাইজ', subtitle: 'GEC Circle, Chattogram', subtitleBn: 'জিইসি, চট্টগ্রাম', amount: 27500, sharePercentage: 11.1, growthPercentage: 8.3, ordersCount: 9 },
  { id: 'c-5', rank: 5, name: 'Shahjalal Pharmacy', nameBn: 'শাহজালাল ফার্মেসি', subtitle: 'Zindabazar, Sylhet', subtitleBn: 'জিন্দাবাজার, সিলেট', amount: 14700, sharePercentage: 5.9, growthPercentage: -3.5, ordersCount: 6 },
  { id: 'c-6', rank: 6, name: 'Walk-in Retail Customers', nameBn: 'কাউন্টার খুচরা গ্রাহক', subtitle: 'Combined Walk-ins (184 visits)', subtitleBn: 'সরাসরি খুচরা ক্রেতা', amount: 78500, sharePercentage: 31.6, growthPercentage: 14.8, ordersCount: 184 },
];

const masterBranches: DriverItem[] = [
  { id: 'br-dhaka', rank: 1, name: 'Dhaka Main Branch', nameBn: 'ঢাকা প্রধান শাখা', subtitle: 'Motijheel & Dhanmondi HUB', subtitleBn: 'মতিঝিল ও ধানমন্ডি', amount: 138400, sharePercentage: 55.7, growthPercentage: 19.4, ordersCount: 192 },
  { id: 'br-ctg', rank: 2, name: 'Chattogram Branch', nameBn: 'চট্টগ্রাম শাখা', subtitle: 'Agrabad Commercial Area', subtitleBn: 'আগ্রাবাদ বাণিজ্যিক এলাকা', amount: 69200, sharePercentage: 27.8, growthPercentage: 14.1, ordersCount: 96 },
  { id: 'br-syl', rank: 3, name: 'Sylhet Branch', nameBn: 'সিলেট শাখা', subtitle: 'Zindabazar Hub', subtitleBn: 'জিন্দাবাজার হাব', amount: 26400, sharePercentage: 10.6, growthPercentage: 3.2, ordersCount: 38 },
  { id: 'br-raj', rank: 4, name: 'Rajshahi Branch', nameBn: 'রাজশাহী শাখা', subtitle: 'Shaheb Bazar', subtitleBn: 'সাহেব বাজার', amount: 14500, sharePercentage: 5.9, growthPercentage: 8.7, ordersCount: 16 },
];

const masterSalespeople: DriverItem[] = [
  { id: 'sp-rahim', rank: 1, name: 'Rahim Ahmed', nameBn: 'রহিম আহমেদ', subtitle: 'Lead Sales Executive • 108% Target', subtitleBn: 'প্রধান বিক্রয় কর্মকর্তা • ১০৮% টার্গেট', amount: 98400, sharePercentage: 39.6, growthPercentage: 24.2, ordersCount: 136 },
  { id: 'sp-tanvir', rank: 2, name: 'Tanvir Hasan', nameBn: 'তানভীর হাসান', subtitle: 'Senior B2B Specialist • 96% Target', subtitleBn: 'সিনিয়র বি২বি স্পেশালিস্ট', amount: 64700, sharePercentage: 26.0, growthPercentage: 18.1, ordersCount: 88 },
  { id: 'sp-karim', rank: 3, name: 'Karim Ullah', nameBn: 'করিম উল্লাহ', subtitle: 'Retail POS Executive • 92% Target', subtitleBn: 'রিটেল পস কর্মকর্তা', amount: 51200, sharePercentage: 20.6, growthPercentage: 11.4, ordersCount: 72 },
  { id: 'sp-farhana', rank: 4, name: 'Farhana Akter', nameBn: 'ফারহানা আক্তার', subtitle: 'Regional Sales Officer • 94% Target', subtitleBn: 'আঞ্চলিক বিক্রয় কর্মকর্তা', amount: 34200, sharePercentage: 13.8, growthPercentage: 15.0, ordersCount: 46 },
];

const masterPayments: DriverItem[] = [
  { id: 'pay-bkash', rank: 1, name: 'bKash Merchant Payment', nameBn: 'বিকাশ মার্চেন্ট পেমেন্ট', subtitle: 'MFS Gateway • 0% fail rate', subtitleBn: 'এমএফএস গেটওয়ে', amount: 98200, sharePercentage: 39.5, growthPercentage: 28.4, ordersCount: 134 },
  { id: 'pay-cash', rank: 2, name: 'Cash on Counter', nameBn: 'নগদ ক্যাশ গ্রহণ', subtitle: 'Direct POS drawer collection', subtitleBn: 'কাউন্টার ক্যাশ', amount: 76400, sharePercentage: 30.7, growthPercentage: 6.2, ordersCount: 118 },
  { id: 'pay-bank', rank: 3, name: 'Bank Transfer / EFTN', nameBn: 'ব্যাংক ট্রান্সফার / এনপিএসবি', subtitle: 'Corporate B2B clearing', subtitleBn: 'করপোরেট ব্যাংক চালান', amount: 43200, sharePercentage: 17.4, growthPercentage: 14.9, ordersCount: 52 },
  { id: 'pay-nagad', rank: 4, name: 'Nagad Digital Payment', nameBn: 'নগদ ডিজিটাল পেমেন্ট', subtitle: 'MFS Instant Payment', subtitleBn: 'নগদ ইনস্ট্যান্ট', amount: 18600, sharePercentage: 7.5, growthPercentage: 21.0, ordersCount: 26 },
  { id: 'pay-credit', rank: 5, name: 'Customer Credit / Due', nameBn: 'বাকি / কাস্টমার ক্রেডিট', subtitle: 'Receivables ledger', subtitleBn: 'বকেয়া হিসাব', amount: 12100, sharePercentage: 4.9, growthPercentage: -8.5, ordersCount: 12 },
];

// Base Time Series trend points (May 1 - May 31, 2026)
const dailyTrendPoints: TimeSeriesTrendPoint[] = [
  { label: 'May 1', labelBn: '১ মে', date: '2026-05-01', sales: 6800, orders: 10, profit: 1420, prevSales: 5800, growthVsPrev: 17.2 },
  { label: 'May 3', labelBn: '৩ মে', date: '2026-05-03', sales: 7400, orders: 11, profit: 1550, prevSales: 6200, growthVsPrev: 19.3 },
  { label: 'May 5', labelBn: '৫ মে', date: '2026-05-05', sales: 8200, orders: 12, profit: 1720, prevSales: 7100, growthVsPrev: 15.5 },
  { label: 'May 7', labelBn: '৭ মে', date: '2026-05-07', sales: 9100, orders: 13, profit: 1910, prevSales: 7900, growthVsPrev: 15.2 },
  { label: 'May 10', labelBn: '১০ মে', date: '2026-05-10', sales: 27500, orders: 36, profit: 5770, prevSales: 23000, growthVsPrev: 19.6 },
  { label: 'May 12', labelBn: '১২ মে', date: '2026-05-12', sales: 14700, orders: 21, profit: 3080, prevSales: 12800, growthVsPrev: 14.8 },
  { label: 'May 14', labelBn: '১৪ মে', date: '2026-05-14', sales: 22400, orders: 31, profit: 4700, prevSales: 19200, growthVsPrev: 16.7 },
  { label: 'May 16', labelBn: '১৬ মে', date: '2026-05-16', sales: 15400, orders: 22, profit: 3230, prevSales: 13100, growthVsPrev: 17.5 },
  { label: 'May 17', labelBn: '১৭ মে', date: '2026-05-17', sales: 18600, orders: 26, profit: 3900, prevSales: 15800, growthVsPrev: 17.7 },
  { label: 'May 18', labelBn: '১৮ মে', date: '2026-05-18', sales: 42500, orders: 58, profit: 8920, prevSales: 34200, growthVsPrev: 24.3 },
  { label: 'May 20', labelBn: '২০ মে', date: '2026-05-20', sales: 21200, orders: 29, profit: 4450, prevSales: 18100, growthVsPrev: 17.1 },
  { label: 'May 23', labelBn: '২৩ মে', date: '2026-05-23', sales: 19800, orders: 27, profit: 4150, prevSales: 17000, growthVsPrev: 16.5 },
  { label: 'May 26', labelBn: '২৬ মে', date: '2026-05-26', sales: 17400, orders: 24, profit: 3650, prevSales: 15100, growthVsPrev: 15.2 },
  { label: 'May 28', labelBn: '২৮ মে', date: '2026-05-28', sales: 13200, orders: 18, profit: 2770, prevSales: 11400, growthVsPrev: 15.8 },
  { label: 'May 31', labelBn: '৩১ মে', date: '2026-05-31', sales: 11300, orders: 16, profit: 2370, prevSales: 9900, growthVsPrev: 14.1 },
];

const weeklyTrendPoints: TimeSeriesTrendPoint[] = [
  { label: 'Week 1 (May 1–7)', labelBn: 'সপ্তাহ ১ (১–৭ মে)', date: '2026-W18', sales: 48500, orders: 68, profit: 10180, prevSales: 41200, growthVsPrev: 17.7 },
  { label: 'Week 2 (May 8–14)', labelBn: 'সপ্তাহ ২ (৮–১৪ মে)', date: '2026-W19', sales: 64600, orders: 88, profit: 13560, prevSales: 55000, growthVsPrev: 17.5 },
  { label: 'Week 3 (May 15–21)', labelBn: 'সপ্তাহ ৩ (১৫–২১ মে)', date: '2026-W20', sales: 77500, orders: 107, profit: 16270, prevSales: 63800, growthVsPrev: 21.5 },
  { label: 'Week 4 (May 22–31)', labelBn: 'সপ্তাহ ৪ (২২–৩১ মে)', date: '2026-W21', sales: 57900, orders: 79, profit: 12150, prevSales: 49800, growthVsPrev: 16.3 },
];

const monthlyTrendPoints: TimeSeriesTrendPoint[] = [
  { label: 'Feb 2026', labelBn: 'ফেব্রুয়ারি', date: '2026-02', sales: 188400, orders: 260, profit: 39500, prevSales: 165000, growthVsPrev: 14.2 },
  { label: 'Mar 2026', labelBn: 'মার্চ', date: '2026-03', sales: 212000, orders: 295, profit: 44500, prevSales: 182000, growthVsPrev: 16.5 },
  { label: 'Apr 2026', labelBn: 'এপ্রিল', date: '2026-04', sales: 224500, orders: 310, profit: 47100, prevSales: 198000, growthVsPrev: 13.4 },
  { label: 'May 2026', labelBn: 'মে (বর্তমান)', date: '2026-05', sales: 248500, orders: 342, profit: 52160, prevSales: 209800, growthVsPrev: 18.4 },
];

export const salesReportService = {
  /**
   * Generates minimal, dynamic report data according to filters and active Sales Focus
   */
  getSalesReportData: ({
    period = 'this_month',
    branchId = 'all',
    interval = 'daily',
    focus = null,
    advancedFilters = {},
  }: {
    period?: ReportPeriod;
    branchId?: string;
    interval?: TrendInterval;
    focus?: SalesFocusItem | null;
    advancedFilters?: AdvancedFilterState;
  }): MinimalSalesReportData => {
    // 1. Filter Records
    let filteredRecords = [...masterInvoices];

    if (branchId !== 'all') {
      const branchNameMap: Record<string, string> = {
        'br-dhaka': 'Dhaka Main Branch',
        'br-ctg': 'Chattogram Branch',
        'br-syl': 'Sylhet Branch',
        'br-raj': 'Rajshahi Branch',
      };
      const targetBranch = branchNameMap[branchId];
      if (targetBranch) {
        filteredRecords = filteredRecords.filter((r) => r.branch === targetBranch);
      }
    }

    // Apply Advanced Filters
    if (advancedFilters.paymentMethod && advancedFilters.paymentMethod !== 'all') {
      filteredRecords = filteredRecords.filter(
        (r) => r.paymentMethod.toLowerCase() === advancedFilters.paymentMethod?.toLowerCase()
      );
    }
    if (advancedFilters.status && advancedFilters.status !== 'all') {
      filteredRecords = filteredRecords.filter((r) => r.paymentStatus === advancedFilters.status);
    }
    if (advancedFilters.salesperson && advancedFilters.salesperson !== 'all') {
      filteredRecords = filteredRecords.filter((r) => r.salesperson === advancedFilters.salesperson);
    }
    if (advancedFilters.minAmount !== undefined && advancedFilters.minAmount > 0) {
      filteredRecords = filteredRecords.filter((r) => r.amount >= (advancedFilters.minAmount || 0));
    }
    if (advancedFilters.maxAmount !== undefined && advancedFilters.maxAmount > 0) {
      filteredRecords = filteredRecords.filter((r) => r.amount <= (advancedFilters.maxAmount || Infinity));
    }

    // 2. Apply SIGNATURE SALES FOCUS (Focus filter on Product, Category, Customer, or Branch)
    if (focus) {
      if (focus.type === 'product') {
        filteredRecords = filteredRecords.filter((r) =>
          r.items.some((item) => item.name.toLowerCase().includes(focus.name.toLowerCase()) || item.id === focus.id)
        );
      } else if (focus.type === 'category') {
        // category matches items
        filteredRecords = filteredRecords.filter((r) =>
          r.items.some((item) => (focus.name.toLowerCase().includes('medicine') ? item.name.includes('500mg') || item.name.includes('Saline') : true))
        );
      } else if (focus.type === 'customer') {
        filteredRecords = filteredRecords.filter((r) =>
          r.customerName.toLowerCase().includes(focus.name.toLowerCase())
        );
      } else if (focus.type === 'salesperson') {
        filteredRecords = filteredRecords.filter((r) =>
          r.salesperson.toLowerCase().includes(focus.name.toLowerCase())
        );
      } else if (focus.type === 'payment') {
        filteredRecords = filteredRecords.filter((r) =>
          focus.name.toLowerCase().includes(r.paymentMethod.toLowerCase()) ||
          r.paymentMethod.toLowerCase().includes(focus.name.toLowerCase())
        );
      } else if (focus.type === 'branch') {
        filteredRecords = filteredRecords.filter((r) =>
          r.branch.toLowerCase().includes(focus.name.toLowerCase())
        );
      }
    }

    // 3. Calculate Summary Metrics
    let netSales = 248500;
    let grossSales = 265600;
    let discounts = 4600;
    let returns = 12500;
    let ordersCount = 342;
    let growth = 18.4;

    if (focus) {
      // Dynamic proportion when in focus mode
      netSales = focus.amount;
      grossSales = Math.round(focus.amount * 1.06);
      discounts = Math.round(focus.amount * 0.02);
      returns = Math.round(focus.amount * 0.04);
      ordersCount = focus.ordersCount || Math.max(1, Math.round(netSales / 726));
      growth = 22.1; // Focused growth rate
    } else if (branchId !== 'all') {
      const bItem = masterBranches.find((b) => b.id === branchId);
      if (bItem) {
        netSales = bItem.amount;
        grossSales = Math.round(bItem.amount * 1.07);
        discounts = Math.round(bItem.amount * 0.02);
        returns = Math.round(bItem.amount * 0.05);
        ordersCount = bItem.ordersCount;
        growth = bItem.growthPercentage;
      }
    }

    const averageOrderValue = ordersCount > 0 ? Math.round(netSales / ordersCount) : 0;
    const grossProfit = Math.round(netSales * 0.21); // ~21% margin

    // 4. Calculate Trend Series
    let baseTrend = dailyTrendPoints;
    if (interval === 'weekly') baseTrend = weeklyTrendPoints;
    if (interval === 'monthly') baseTrend = monthlyTrendPoints;

    const trendMultiplier = focus ? focus.amount / 248500 : branchId !== 'all' ? netSales / 248500 : 1;

    const calculatedTrend: TimeSeriesTrendPoint[] = baseTrend.map((pt) => ({
      ...pt,
      sales: Math.round(pt.sales * trendMultiplier),
      orders: Math.max(1, Math.round(pt.orders * trendMultiplier)),
      profit: Math.round(pt.profit * trendMultiplier),
      prevSales: pt.prevSales ? Math.round(pt.prevSales * trendMultiplier) : undefined,
    }));

    return {
      summary: {
        netSales,
        grossSales,
        discounts,
        returns,
        growthPercentage: growth,
        isGrowthPositive: growth >= 0,
        ordersCount,
        averageOrderValue,
        grossProfit,
        grossMarginPercentage: 21.0,
      },
      trend: calculatedTrend,
      drivers: {
        products: masterProducts,
        categories: masterCategories,
        customers: masterCustomers,
        salespeople: masterSalespeople,
        branches: masterBranches,
        payments: masterPayments,
      },
      records: filteredRecords,
      totalRecordsCount: filteredRecords.length,
    };
  },
};
