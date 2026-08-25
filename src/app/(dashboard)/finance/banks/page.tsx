'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { useCreatePaymentMethod } from '@/hooks/api/usePaymentMethod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Building2,
  Landmark,
  Wallet,
  Plus,
  Copy,
  RefreshCw,
  CheckCircle2,
  Trash2,
  History,
  Phone,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Eye,
  EyeOff,
  Signal,
  Wifi,
  Banknote,
  Send,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface BankAccount {
  id: string;
  name: string;
  type: 'bank' | 'wallet' | 'cash';
  provider: string;
  providerBn: string;
  accountNumber: string;
  balance: number;
  branch: string;
  branchBn: string;
  color: string;         // Tailwind gradient classes
  accentColor: string;   // solid hex for chip / chip text
  routingNumber?: string;
  walletType?: 'Merchant' | 'Personal';
}

interface ActivityLog {
  id: string;
  date: string;
  type: 'inflow' | 'outflow';
  amount: number;
  description: string;
  descriptionBn: string;
  accountName: string;
  accountNameBn: string;
}

// ─── Mock Data ─────────────────────────────────────────────
const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'ACC-000',
    name: 'Main Cash Vault',
    type: 'cash',
    provider: 'Cash Vault (Till)',
    providerBn: 'ক্যাশ ভল্ট (নগদ তহবিল)',
    accountNumber: 'CASH-VAULT-01',
    balance: 245000,
    branch: 'Head Office POS Counter',
    branchBn: 'প্রধান কার্যালয় ক্যাশ কাউন্টার',
    color: 'from-[#78350f] via-[#92400e] to-[#d97706]',
    accentColor: '#fbbf24',
  },
  {
    id: 'ACC-001',
    name: 'Corporate Current Account',
    type: 'bank',
    provider: 'Dutch-Bangla Bank',
    providerBn: 'ডাচ-বাংলা ব্যাংক (DBBL)',
    accountNumber: '190.120.984532',
    balance: 1287500,
    branch: 'Motijheel Corporate',
    branchBn: 'মতিঝিল কর্পোরেট শাখা',
    routingNumber: '090152431',
    color: 'from-[#1e3a8a] via-[#1d4ed8] to-[#3b82f6]',
    accentColor: '#60a5fa',
  },
  {
    id: 'ACC-002',
    name: 'Government Payout Ledger',
    type: 'bank',
    provider: 'Sonali Bank PLC',
    providerBn: 'সোনালী ব্যাংক পিএলসি',
    accountNumber: '0019.890432.1',
    balance: 60000,
    branch: 'Dhaka Main',
    branchBn: 'ঢাকা মেইন শাখা',
    routingNumber: '200261490',
    color: 'from-[#064e3b] via-[#065f46] to-[#059669]',
    accentColor: '#34d399',
  },
  {
    id: 'ACC-003',
    name: 'bKash Merchant Wallet',
    type: 'wallet',
    provider: 'bKash',
    providerBn: 'বিকাশ ওয়ালেট (bKash)',
    accountNumber: '+880 1711 223344',
    balance: 85000,
    branch: 'Digital',
    branchBn: 'ডিজিটাল',
    walletType: 'Merchant',
    color: 'from-[#831843] via-[#9d174d] to-[#ec4899]',
    accentColor: '#f9a8d4',
  },
];

const INITIAL_ACTIVITIES: ActivityLog[] = [
  { id: 'ACT-001', date: '2026-08-05', type: 'inflow', amount: 60000, description: 'Cash deposit contra', descriptionBn: 'নগদ জমা স্থানান্তর (কনট্রা)', accountName: 'Sonali Bank PLC', accountNameBn: 'সোনালী ব্যাংক পিএলসি' },
  { id: 'ACT-002', date: '2026-08-04', type: 'inflow', amount: 30000, description: 'Bank statement adjustment', descriptionBn: 'ব্যাংক স্টেটমেন্ট সমন্বয়', accountName: 'Dutch-Bangla Bank', accountNameBn: 'ডাচ-বাংলা ব্যাংক' },
  { id: 'ACT-002', date: '2026-08-04', type: 'inflow', amount: 30000, description: 'Bank statement adjustment', descriptionBn: 'ব্যাংক স্টেটমেন্ট সমন্বয়', accountName: 'Dutch-Bangla Bank', accountNameBn: 'ডাচ-বাংলা ব্যাংক' },
  { id: 'ACT-003', date: '2026-08-03', type: 'outflow', amount: 15000, description: 'Vendor payment transfer', descriptionBn: 'সাপ্লায়ার পেমেন্ট', accountName: 'bKash', accountNameBn: 'বিকাশ' },
  { id: 'ACT-004', date: '2026-08-02', type: 'inflow', amount: 200000, description: 'Sale proceeds deposit', descriptionBn: 'বিক্রয় আয় জমা', accountName: 'Dutch-Bangla Bank', accountNameBn: 'ডাচ-বাংলা ব্যাংক' },
  { id: 'ACT-004', date: '2026-08-02', type: 'inflow', amount: 200000, description: 'Sale proceeds deposit', descriptionBn: 'বিক্রয় আয় জমা', accountName: 'Dutch-Bangla Bank', accountNameBn: 'ডাচ-বাংলা ব্যাংক' },
];

// ─── Virtual Card Component ────────────────────────────────
function VirtualCard({
  account,
  isActive,
  onClick,
  isBangla,
  formatCurrency,
  onCopy,
  onReconcile,
  onDelete,
  hideBalance,
}: {
  account: BankAccount;
  isActive: boolean;
  onClick: () => void;
  isBangla: boolean;
  formatCurrency: (v: number) => string;
  onCopy: (s: string) => void;
  onReconcile: (id: string) => void;
  onDelete: (id: string) => void;
  hideBalance: boolean;
}) {
  const isWallet = account.type === 'wallet';
  const isCash = account.type === 'cash';

  const typeLabel = isCash
    ? (isBangla ? 'ক্যাশ ভল্ট' : 'Cash Vault')
    : isWallet
    ? (isBangla ? 'মোবাইল ওয়ালেট' : 'Mobile Wallet')
    : (isBangla ? 'ব্যাংক অ্যাকাউন্ট' : 'Bank Account');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.28 }}
      onClick={onClick}
      className={cn(
        'relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 select-none',
        isActive ? 'ring-2 ring-white/30 shadow-2xl scale-[1.01]' : 'hover:scale-[1.005] hover:shadow-xl'
      )}
      style={{ perspective: '1000px' }}
    >
      {/* Card face */}
      <div className={cn('bg-gradient-to-br p-5 min-h-[170px] flex flex-col justify-between', account.color)}>
        {/* Top row: provider + type chip */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-0.5">
              {isBangla ? account.providerBn : account.provider}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: 'rgba(255,255,255,0.15)', color: account.accentColor }}
            >
              {isCash && <Banknote className="h-3 w-3" />}
              {typeLabel}
            </span>
            {isCash ? (
              <ShieldCheck className="h-4 w-4 text-white/40" />
            ) : isWallet ? (
              <Wifi className="h-4 w-4 text-white/40" />
            ) : (
              <Signal className="h-4 w-4 text-white/40" />
            )}
          </div>
        </div>

        {/* Account number chip */}
        <div className="flex items-center gap-1.5">
          {isCash && <Banknote className="h-3.5 w-3.5 text-white/60 mr-0.5" />}
          {!isWallet && !isCash && (
            <div className="flex gap-1 mr-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-5 h-3 rounded-sm bg-white/20" />
              ))}
            </div>
          )}
          {isWallet && <Phone className="h-3 w-3 text-white/50" />}
          <span className="font-mono text-[11px] text-white/70 tracking-widest">
            {hideBalance ? '•••• •••• ••••' : account.accountNumber}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(account.accountNumber);
            }}
            className="h-5 w-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Copy className="h-3 w-3 text-white/50" />
          </button>
        </div>

        {/* Bottom row: balance + actions */}
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-[10px] text-white/50 mb-0.5">
              {isBangla ? 'বর্তমান ব্যালেন্স' : 'Current Balance'}
            </p>
            <p className="text-2xl font-bold text-white tracking-tight font-mono">
              {hideBalance ? '৳ ••••••' : formatCurrency(account.balance)}
            </p>
          </div>
          {/* Quick action row */}
          <div className="flex gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReconcile(account.id);
              }}
              className="h-8 px-3 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all hover:scale-105 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}
            >
              <RefreshCw className="h-3 w-3" />
              {isBangla ? 'সমন্বয়' : 'Adjust'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(account.id);
              }}
              className="h-8 w-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 hover:bg-rose-500/30 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <Trash2 className="h-3.5 w-3.5 text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Branch / Vault footer */}
      <div
        className="px-5 py-2 flex items-center justify-between text-[10px]"
        style={{ background: 'rgba(0,0,0,0.3)' }}
      >
        <span className="text-white/40">
          {isBangla ? account.branchBn : account.branch}
        </span>
        {isCash ? (
          <span className="font-mono text-amber-300/70 font-bold tracking-wider text-[9px] uppercase">
            CASH IN HAND
          </span>
        ) : account.routingNumber ? (
          <span className="font-mono text-white/30">
            RT: {account.routingNumber}
          </span>
        ) : account.walletType ? (
          <span className="text-white/40">{account.walletType} Account</span>
        ) : null}
      </div>
    </motion.div>
  );
}

// ─── Main Page Component ──────────────────────────────────
export default function FinanceBankWalletsPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  
  const { mutate: createPaymentMethod, isPending: isCreating } = useCreatePaymentMethod();

  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);

  // UI State
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'bank' | 'wallet' | 'cash'>('all');
  const [hideBalances, setHideBalances] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  // Quick Transfer State
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  // Add Account Form State
  const [formCategory, setFormCategory] = useState<'bank' | 'wallet'>('bank');
  const [bankAccName, setBankAccName] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [bankAccNumber, setBankAccNumber] = useState('');
  const [bankRouting, setBankRouting] = useState('');
  const [bankBalance, setBankBalance] = useState('');
  const [walletTagName, setWalletTagName] = useState('');
  const [walletProvider, setWalletProvider] = useState('bKash');
  const [walletMobile, setWalletMobile] = useState('');
  const [walletAccType, setWalletAccType] = useState<'Merchant' | 'Personal'>('Merchant');
  const [walletBalance, setWalletBalance] = useState('');

  // Reconcile State
  const [reconcileOpen, setReconcileOpen] = useState(false);
  const [reconcileAccId, setReconcileAccId] = useState('');
  const [reconAmount, setReconAmount] = useState('');
  const [reconType, setReconType] = useState<'add' | 'deduct'>('add');
  const [reconMemo, setReconMemo] = useState('');

  // ── Computed ─────────────────────────────────────────────
  const totalLiquid  = accounts.reduce((s, a) => s + a.balance, 0);
  const totalBank    = accounts.filter(a => a.type === 'bank').reduce((s, a) => s + a.balance, 0);
  const totalWallet  = accounts.filter(a => a.type === 'wallet').reduce((s, a) => s + a.balance, 0);
  const totalCash    = accounts.filter(a => a.type === 'cash').reduce((s, a) => s + a.balance, 0);
  const bankPct      = totalLiquid > 0 ? Math.round((totalBank / totalLiquid) * 100) : 0;
  const walletPct    = 100 - bankPct;

  const filteredAccounts = filterType === 'all' ? accounts : accounts.filter(a => a.type === filterType);
  const reconcileAccount = accounts.find(a => a.id === reconcileAccId);

  // ── Helpers ──────────────────────────────────────────────
  const showAlert = (msg: string, type: 'success' | 'error' = 'success') => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(''), 3500);
  };

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    showAlert(isBangla ? 'নম্বর কপি করা হয়েছে!' : 'Copied to clipboard!');
  };

  const handleOpenReconcile = (id: string) => {
    setReconcileAccId(id);
    setReconAmount('');
    setReconMemo('');
    setReconType('add');
    setReconcileOpen(true);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    if (activeCardId === id) setActiveCardId(null);
    showAlert(isBangla ? 'অ্যাকাউন্ট মুছে ফেলা হয়েছে।' : 'Account deleted.');
  };

  const handleQuickTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferFrom) {
      toast.error(isBangla ? 'উৎস অ্যাকাউন্ট নির্বাচন করুন' : 'Please select source account');
      return;
    }
    if (!transferTo) {
      toast.error(isBangla ? 'গন্তব্য অ্যাকাউন্ট নির্বাচন করুন' : 'Please select destination account');
      return;
    }
    if (transferFrom === transferTo) {
      toast.error(isBangla ? 'উৎস ও গন্তব্য অ্যাকাউন্ট ভিন্ন হতে হবে' : 'Source and destination accounts must be different');
      return;
    }
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0) {
      toast.error(isBangla ? 'সঠিক টাকার পরিমাণ লিখুন' : 'Please enter a valid amount');
      return;
    }

    const sourceAcc = accounts.find(a => a.id === transferFrom);
    const destAcc = accounts.find(a => a.id === transferTo);

    if (!sourceAcc || !destAcc) {
      toast.error(isBangla ? 'অ্যাকাউন্ট খুঁজে পাওয়া যায়নি' : 'Account not found');
      return;
    }

    if (sourceAcc.balance < amt) {
      toast.error(isBangla ? 'উৎস অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই' : 'Insufficient balance in source account');
      return;
    }

    setIsTransferring(true);

    setTimeout(() => {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === transferFrom) return { ...acc, balance: acc.balance - amt };
        if (acc.id === transferTo) return { ...acc, balance: acc.balance + amt };
        return acc;
      }));

      const newActivity1: ActivityLog = {
        id: `ACT-${(activities.length + 1).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        type: 'outflow',
        amount: amt,
        description: `Transfer to ${destAcc.provider || destAcc.name}`,
        descriptionBn: `${destAcc.providerBn || destAcc.provider} এ ট্রান্সফার`,
        accountName: sourceAcc.provider,
        accountNameBn: sourceAcc.providerBn,
      };

      const newActivity2: ActivityLog = {
        id: `ACT-${(activities.length + 2).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        type: 'inflow',
        amount: amt,
        description: `Transfer from ${sourceAcc.provider || sourceAcc.name}`,
        descriptionBn: `${sourceAcc.providerBn || sourceAcc.provider} থেকে প্রাপ্ত`,
        accountName: destAcc.provider,
        accountNameBn: destAcc.providerBn,
      };

      setActivities(prev => [newActivity1, newActivity2, ...prev]);
      setTransferAmount('');
      setTransferFrom('');
      setTransferTo('');
      setIsTransferring(false);
      toast.success(isBangla ? 'টাকা সফলভাবে ট্রান্সফার করা হয়েছে!' : 'Money transferred successfully!');
    }, 350);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();


    if (formCategory === 'bank') {
      if (!bankAccName.trim() || !bankName.trim() || !bankAccNumber.trim()) {
        showAlert(isBangla ? 'অনুগ্রহ করে সকল বাধ্যতামূলক ঘর পূরণ করুন।' : 'Please fill all required fields.', 'error');
        return;
      }

      const payload = {
        name: bankAccName,
        type: 'bank',
        bankName: bankName,
        accountNumber: bankAccNumber,
        openingBalance: parseFloat(bankBalance) || 0,
        branchName: bankBranch || 'Main Branch',
        routingNumber: bankRouting,
      };

      createPaymentMethod(payload as any, {
        onSuccess: () => {
          toast.success(isBangla ? 'নতুন অ্যাকাউন্ট সফলভাবে যুক্ত হয়েছে!' : 'Account added successfully!');
        }
      });
    } else {
      if (!walletTagName.trim() || !walletMobile.trim()) {
        showAlert(isBangla ? 'অনুগ্রহ করে সকল বাধ্যতামূলক ঘর পূরণ করুন।' : 'Please fill all required fields.', 'error');
        return;
      }

      const payload = {
        name: walletTagName,
        type: 'mobile_banking',
        provider: walletProvider,
        walletType: walletAccType,
        mobileNumber: walletMobile,
        openingBalance: parseFloat(walletBalance) || 0,
      };

      createPaymentMethod(payload as any, {
        onSuccess: () => {
            toast.success(isBangla ? 'নতুন অ্যাকাউন্ট সফলভাবে যুক্ত হয়েছে!' : 'Account added successfully!');
    }});
    }
  };

  const handleReconcile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reconcileAccount) return;
    const amt = parseFloat(reconAmount) || 0;
    if (amt <= 0) return;

    const newBal = reconType === 'add'
      ? reconcileAccount.balance + amt
      : Math.max(0, reconcileAccount.balance - amt);

    setAccounts(prev => prev.map(a => a.id === reconcileAccount.id ? { ...a, balance: newBal } : a));

    const newLog: ActivityLog = {
      id: `ACT-${(activities.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      type: reconType === 'add' ? 'inflow' : 'outflow',
      amount: amt,
      description: reconMemo || 'Manual reconciliation',
      descriptionBn: reconMemo || 'ম্যানুয়াল সমন্বয়',
      accountName: reconcileAccount.provider,
      accountNameBn: reconcileAccount.providerBn,
    };
    setActivities(prev => [newLog, ...prev]);
    setReconcileOpen(false);
    showAlert(isBangla ? 'অ্যাকাউন্ট সমন্বয় সফলভাবে সম্পন্ন হয়েছে!' : 'Reconciliation completed!');
  };

  // ── Input style helper ────────────────────────────────────
  const inputCls = 'w-full h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 transition';

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-10">

      {/* ══ HEADER ══ */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4.5 w-4.5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {isBangla ? 'ব্যাংক ও ওয়ালেট' : 'Bank & Wallets'}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground ml-10">
            {isBangla
              ? 'ব্যাংক অ্যাকাউন্ট ও মোবাইল ওয়ালেট পরিচালনা এবং ব্যালেন্স সমন্বয় করুন'
              : 'Manage your bank accounts and mobile wallets — reconcile balances in real time'}
          </p>
        </div>
        <button
          onClick={() => setHideBalances(v => !v)}
          className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border/50 bg-card"
        >
          {hideBalances ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {hideBalances ? (isBangla ? 'দেখান' : 'Reveal') : (isBangla ? 'লুকান' : 'Hide')}
        </button>
      </div>

      {/* ══ TOAST ALERT ══ */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold border',
              alertType === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
            )}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ SECTION A: LIQUIDITY OVERVIEW CARDS ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl border border-border bg-zinc-900/30 shadow-inner">
        {/* Total */}
        <div className="rounded-2xl p-5 border bg-emerald-500/10 border-emerald-500/20 shadow-xs relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1 relative z-10">
            {isBangla ? 'সর্বমোট তারল্য' : 'Total Liquidity'}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground font-mono relative z-10 truncate">
            {hideBalances ? '৳ ••••••' : formatCurrency(totalLiquid)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 relative z-10">
            {accounts.length} {isBangla ? 'টি অ্যাকাউন্ট' : 'accounts active'}
          </p>
        </div>

        {/* Bank */}
        <div className="rounded-2xl p-5 border bg-blue-500/10 border-blue-500/20 shadow-xs relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1 flex items-center gap-1 relative z-10">
            <Landmark className="h-3 w-3" />
            {isBangla ? 'ব্যাংক ব্যালেন্স' : 'Bank Balance'}
          </p>
          <p className="text-2xl font-bold text-foreground font-mono relative z-10 truncate">
            {hideBalances ? '৳ ••••••' : formatCurrency(totalBank)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 relative z-10">
            {accounts.filter(a => a.type === 'bank').length} {isBangla ? 'টি ব্যাংক' : 'banks'}
          </p>
        </div>

        {/* Wallet */}
        <div className="rounded-2xl p-5 border bg-pink-500/10 border-pink-500/20 shadow-xs relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-pink-500 mb-1 flex items-center gap-1 relative z-10">
            <Wallet className="h-3 w-3" />
            {isBangla ? 'ওয়ালেট ব্যালেন্স' : 'Wallet Balance'}
          </p>
          <p className="text-2xl font-bold text-foreground font-mono relative z-10 truncate">
            {hideBalances ? '৳ ••••••' : formatCurrency(totalWallet)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 relative z-10">
            {accounts.filter(a => a.type === 'wallet').length} {isBangla ? 'টি ওয়ালেট' : 'wallets'}
          </p>
        </div>

        {/* Cash Vault */}
        <div className="rounded-2xl p-5 border bg-amber-500/10 border-amber-500/20 shadow-xs relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1 flex items-center gap-1 relative z-10">
            <Banknote className="h-3 w-3" />
            {isBangla ? 'ক্যাশ ভল্ট' : 'Cash Vault'}
          </p>
          <p className="text-2xl font-bold text-foreground font-mono relative z-10 truncate">
            {hideBalances ? '৳ ••••••' : formatCurrency(totalCash)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 relative z-10">
            {accounts.filter(a => a.type === 'cash').length} {isBangla ? 'টি ক্যাশ ভল্ট' : 'vault'}
          </p>
        </div>
      </div>

      {/* ══ SECTION B: VIRTUAL CARDS + ADD FORM ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* left: Quick Transfer & Add Account Panels ─────────────────────────── */}
        <div className="space-y-6">
          {/* Quick Transfer Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#121624] p-5 shadow-lg space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {isBangla ? 'দ্রুত ট্রান্সফার' : 'Quick Transfer'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('recent-activity-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {isBangla ? 'সব দেখুন' : 'See All'}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleQuickTransfer} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* From Account */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-300 block">
                    {isBangla ? 'উৎস অ্যাকাউন্ট' : 'From Account'}
                  </label>
                  <div className="relative">
                    <select
                      value={transferFrom}
                      onChange={(e) => setTransferFrom(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-800 bg-[#090d16] px-3.5 pr-8 text-xs text-slate-200 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-all appearance-none cursor-pointer truncate"
                    >
                      <option value="" className="bg-[#090d16] text-slate-500">
                        {isBangla ? 'উৎস অ্যাকাউন্ট নির্বাচন করুন' : 'Select source account'}
                      </option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id} className="bg-[#090d16] text-slate-200">
                          {isBangla ? acc.providerBn : acc.provider} ({acc.accountNumber.slice(-4)}) - ৳{acc.balance.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* To Account */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-300 block">
                    {isBangla ? 'গন্তব্য অ্যাকাউন্ট' : 'To Account'}
                  </label>
                  <div className="relative">
                    <select
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-800 bg-[#090d16] px-3.5 pr-8 text-xs text-slate-200 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-all appearance-none cursor-pointer truncate"
                    >
                      <option value="" className="bg-[#090d16] text-slate-500">
                        {isBangla ? 'গন্তব্য অ্যাকাউন্ট নির্বাচন করুন' : 'Select destination account'}
                      </option>
                      {accounts.map((acc) => (
                        <option
                          key={acc.id}
                          value={acc.id}
                          disabled={acc.id === transferFrom}
                          className="bg-[#090d16] text-slate-200"
                        >
                          {isBangla ? acc.providerBn : acc.provider} ({acc.accountNumber.slice(-4)}) - ৳{acc.balance.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Amount (৳) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-300 block">
                  {isBangla ? 'পরিমাণ (৳)' : 'Amount (৳)'}
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder={isBangla ? 'টাকার পরিমাণ লিখুন' : 'Enter amount'}
                  className="w-full h-10 rounded-xl border border-slate-800 bg-[#090d16] px-3.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-all font-mono"
                />
              </div>

              {/* Transfer Now Button */}
              <button
                type="submit"
                disabled={isTransferring}
                className="w-full h-11 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isTransferring ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{isBangla ? 'ট্রান্সফার হচ্ছে...' : 'Transferring...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 text-white -rotate-12" />
                    <span>{isBangla ? 'এখন ট্রান্সফার করুন' : 'Transfer Now'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Add Account Panel */}
          <div
            className="rounded-2xl border overflow-hidden h-fit"
            style={{ borderColor: 'rgba(79,91,255,0.12)', background: 'rgba(79,91,255,0.02)' }}
          >
          {/* Panel header */}
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: 'rgba(79,91,255,0.12)', background: 'rgba(79,91,255,0.05)' }}
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {isBangla ? 'অ্যাকাউন্ট যুক্ত করুন' : 'Add Account'}
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  {isBangla ? 'ব্যাংক বা মোবাইল ওয়ালেট যোগ করুন' : 'Register a bank or mobile wallet'}
                </p>
              </div>
            </div>

            {/* Category Selector */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                type="button"
                onClick={() => setFormCategory('bank')}
                className={cn(
                  'py-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1.5 transition-all',
                  formCategory === 'bank'
                    ? 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'border-border text-muted-foreground hover:border-blue-500/30 hover:bg-blue-500/5'
                )}
              >
                <Landmark className="h-5 w-5" />
                {isBangla ? 'ব্যাংক হিসাব' : 'Bank Account'}
              </button>
              <button
                type="button"
                onClick={() => setFormCategory('wallet')}
                className={cn(
                  'py-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1.5 transition-all',
                  formCategory === 'wallet'
                    ? 'border-pink-500/40 bg-pink-500/10 text-pink-600 dark:text-pink-400 shadow-sm'
                    : 'border-border text-muted-foreground hover:border-pink-500/30 hover:bg-pink-500/5'
                )}
              >
                <Wallet className="h-5 w-5" />
                {isBangla ? 'মোবাইল ওয়ালেট' : 'Mobile Wallet'}
              </button>
            </div>
          </div>

          {/* Form body */}
          <div className="p-5">
            <AnimatePresence mode="wait">
              {formCategory === 'bank' ? (
                <motion.form
                  key="bank-form"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleAddAccount}
                  className="space-y-3"
                >
                  {/* Bank form preview chip */}
                  <div className="rounded-xl p-3 flex items-center gap-2 mb-1" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
                    <Landmark className="h-4 w-4 text-blue-500 shrink-0" />
                    <p className="text-[10px] text-muted-foreground leading-snug">
                      {isBangla
                        ? 'ব্যাংক অ্যাকাউন্টের তথ্য সঠিকভাবে পূরণ করুন। অ্যাকাউন্ট নম্বর এবং ব্যাংকের নাম আবশ্যক।'
                        : 'Fill in your bank account details. Account number and bank name are required.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      {isBangla ? 'অ্যাকাউন্টের নাম *' : 'Account Name *'}
                    </label>
                    <input className={inputCls} placeholder={isBangla ? 'যেমন: কর্পোরেট কারেন্ট হিসাব' : 'e.g. Corporate Current Acc'} value={bankAccName} onChange={e => setBankAccName(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'ব্যাংকের নাম *' : 'Bank Name *'}</label>
                      <input className={inputCls} placeholder="BRAC Bank PLC" value={bankName} onChange={e => setBankName(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'শাখা' : 'Branch'}</label>
                      <input className={inputCls} placeholder={isBangla ? 'মতিঝিল শাখা' : 'Motijheel'} value={bankBranch} onChange={e => setBankBranch(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'অ্যাকাউন্ট নম্বর *' : 'Account No. *'}</label>
                      <input className={cn(inputCls, 'font-mono')} placeholder="120.902.99" value={bankAccNumber} onChange={e => setBankAccNumber(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'রাউটিং নম্বর' : 'Routing No.'}</label>
                      <input className={cn(inputCls, 'font-mono')} placeholder="090152431" value={bankRouting} onChange={e => setBankRouting(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'প্রারম্ভিক ব্যালেন্স (৳) *' : 'Opening Balance (৳) *'}</label>
                    <input type="number" className={cn(inputCls, 'font-mono')} placeholder="0.00" value={bankBalance} onChange={e => setBankBalance(e.target.value)} required />
                  </div>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full h-10 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/20 mt-2 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    {isBangla ? 'ব্যাংক অ্যাকাউন্ট যুক্ত করুন' : 'Add Bank Account'}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="wallet-form"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleAddAccount}
                  className="space-y-3"
                >
                  {/* Wallet preview chip */}
                  <div className="rounded-xl p-3 flex items-center gap-2 mb-1" style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.12)' }}>
                    <Phone className="h-4 w-4 text-pink-500 shrink-0" />
                    <p className="text-[10px] text-muted-foreground leading-snug">
                      {isBangla
                        ? 'মোবাইল ওয়ালেটের বিবরণ দিন। মোবাইল নম্বর এবং প্রোভাইডার নির্বাচন করুন।'
                        : 'Enter mobile wallet details. Mobile number and provider selection are required.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'ওয়ালেটের নাম *' : 'Wallet Name *'}</label>
                    <input className={inputCls} placeholder={isBangla ? 'যেমন: কালেকশন বিকাশ ওয়ালেট' : 'e.g. Retail bKash Wallet'} value={walletTagName} onChange={e => setWalletTagName(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'সার্ভিস প্রোভাইডার' : 'Provider'}</label>
                      <select
                        value={walletProvider}
                        onChange={e => setWalletProvider(e.target.value)}
                        className={cn(inputCls, 'cursor-pointer')}
                      >
                        <option value="bKash">bKash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Rocket">Rocket</option>
                        <option value="Upay">Upay</option>
                        <option value="SureCash">SureCash</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'অ্যাকাউন্টের ধরন' : 'Account Type'}</label>
                      <select
                        value={walletAccType}
                        onChange={e => setWalletAccType(e.target.value as 'Merchant' | 'Personal')}
                        className={cn(inputCls, 'cursor-pointer')}
                      >
                        <option value="Merchant">Merchant</option>
                        <option value="Personal">Personal</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'মোবাইল নম্বর *' : 'Mobile Number *'}</label>
                    <input className={cn(inputCls, 'font-mono')} placeholder="+880 1711 223344" value={walletMobile} onChange={e => setWalletMobile(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'প্রারম্ভিক ব্যালেন্স (৳) *' : 'Opening Balance (৳) *'}</label>
                    <input type="number" className={cn(inputCls, 'font-mono')} placeholder="0.00" value={walletBalance} onChange={e => setWalletBalance(e.target.value)} required />
                  </div>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full h-10 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-pink-500/20 mt-2 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    {isBangla ? 'মোবাইল ওয়ালেট যুক্ত করুন' : 'Add Mobile Wallet'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
        {/* Right: Virtual Card Carousel */}
        <div className="xl:col-span-2 space-y-4">
          {/* Filter pills */}
          <div className="flex items-center gap-2">
            {(['all', 'bank', 'wallet', 'cash'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer',
                  filterType === type
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'border-border text-muted-foreground hover:text-foreground bg-card'
                )}
              >
                {type === 'all'
                  ? (isBangla ? 'সকল' : 'All')
                  : type === 'bank'
                    ? (isBangla ? 'ব্যাংক' : 'Bank')
                    : type === 'wallet'
                      ? (isBangla ? 'ওয়ালেট' : 'Wallet')
                      : (isBangla ? 'ক্যাশ ভল্ট' : 'Cash Vault')}
                <span className="ml-1.5 opacity-60">
                  {type === 'all' ? accounts.length : accounts.filter(a => a.type === type).length}
                </span>
              </button>
            ))}
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredAccounts.map(acc => (
                <VirtualCard
                  key={acc.id}
                  account={acc}
                  isActive={activeCardId === acc.id}
                  onClick={() => setActiveCardId(prev => prev === acc.id ? null : acc.id)}
                  isBangla={isBangla}
                  formatCurrency={formatCurrency}
                  onCopy={handleCopy}
                  onReconcile={handleOpenReconcile}
                  onDelete={handleDeleteAccount}
                  hideBalance={hideBalances}
                />
              ))}
            </AnimatePresence>
            {filteredAccounts.length === 0 && (
              <div className="sm:col-span-2 flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-border/50 text-muted-foreground gap-3">
                <CreditCard className="h-10 w-10 opacity-20" />
                <p className="text-sm font-medium">
                  {isBangla ? 'কোনো অ্যাকাউন্ট পাওয়া যায়নি' : 'No accounts found'}
                </p>
              </div>
            )}
          </div>

          {/* ── Recent Activity ─────────────────────────────── */}
          <div
            id="recent-activity-section"
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/30">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                {isBangla ? 'সাম্প্রতিক কার্যকলাপ' : 'Recent Activity'}
              </h3>
              <span className="text-[11px] text-muted-foreground">{activities.length} {isBangla ? 'টি এন্ট্রি' : 'entries'}</span>
            </div>
            <div className="divide-y divide-border/30">
              {activities.slice(0, 6).map((act, i) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors"
                >
                  <div className={cn(
                    'h-8 w-8 rounded-xl flex items-center justify-center shrink-0',
                    act.type === 'inflow' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                  )}>
                    {act.type === 'inflow'
                      ? <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
                      : <ArrowUpRight className="h-4 w-4 text-rose-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {isBangla ? act.descriptionBn : act.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {isBangla ? act.accountNameBn : act.accountName} · {act.date}
                    </p>
                  </div>
                  <span className={cn(
                    'text-xs font-bold font-mono shrink-0',
                    act.type === 'inflow' ? 'text-emerald-500' : 'text-rose-500'
                  )}>
                    {act.type === 'inflow' ? '+' : '-'}{formatCurrency(act.amount)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        
      </div>

      {/* ══ RECONCILE DIALOG ══ */}
      <AnimatePresence>
        {reconcileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setReconcileOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
              style={{ background: 'var(--card)', borderColor: 'rgba(255,255,255,0.07)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Dialog header */}
              <div className="px-6 py-4 border-b border-border/30 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{isBangla ? 'ব্যালেন্স সমন্বয়' : 'Reconcile Balance'}</h3>
                  <p className="text-[11px] text-muted-foreground">
                    { reconcileAccount &&  reconcileAccount.name}
                  </p>
                </div>
              </div>

              {/* Current balance display */}
              {reconcileAccount && (
                <div className="mx-6 mt-4 p-3 rounded-xl flex items-center justify-between"
                  style={{ background: 'rgba(79,91,255,0.06)', border: '1px solid rgba(79,91,255,0.12)' }}
                >
                  <span className="text-[11px] text-muted-foreground">{isBangla ? 'বর্তমান ব্যালেন্স' : 'Current Balance'}</span>
                  <span className="text-base font-bold text-foreground font-mono">{formatCurrency(reconcileAccount.balance)}</span>
                </div>
              )}

              <form onSubmit={handleReconcile} className="p-6 space-y-4">
                {/* Add / Deduct toggle */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'সমন্বয়ের ধরন' : 'Adjustment Type'}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReconType('add')}
                      className={cn(
                        'py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all',
                        reconType === 'add'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                          : 'border-border text-muted-foreground'
                      )}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      {isBangla ? 'যোগ করুন' : 'Add Balance'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReconType('deduct')}
                      className={cn(
                        'py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all',
                        reconType === 'deduct'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-600'
                          : 'border-border text-muted-foreground'
                      )}
                    >
                      <TrendingDown className="h-3.5 w-3.5" />
                      {isBangla ? 'কমান' : 'Deduct'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'পরিমাণ (৳)' : 'Amount (৳)'}</label>
                  <input
                    type="number"
                    className={cn(inputCls, 'font-mono text-base h-11')}
                    placeholder="0.00"
                    value={reconAmount}
                    onChange={e => setReconAmount(e.target.value)}
                    required
                    min="0.01"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">{isBangla ? 'সমন্বয়ের কারণ (মেমো)' : 'Memo / Reason'}</label>
                  <input
                    className={inputCls}
                    placeholder={isBangla ? 'যেমন: ব্যাংক স্টেটমেন্ট সংশোধন' : 'e.g. Bank statement correction'}
                    value={reconMemo}
                    onChange={e => setReconMemo(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setReconcileOpen(false)}
                    className="flex-1 h-10 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  >
                    {isBangla ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-lg"
                  >
                    {isBangla ? 'সমন্বয় নিশ্চিত করুন' : 'Confirm Reconcile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
