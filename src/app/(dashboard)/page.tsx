'use client';
// HelloKhata — Business Command Center
// Award-winning Dashboard · Stripe × Linear × Notion aesthetic

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAccounts } from '@/hooks/queries';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import {
  Bell, Settings, RefreshCw, ChevronRight, ChevronDown,
  TrendingUp, TrendingDown, Wallet, Package, ShoppingCart, Receipt,
  ArrowDownLeft, ArrowUpRight, Sparkles, AlertCircle, Landmark,
  Building2, Target, FileText, Send, UserPlus, Box, Repeat2, Bot,
  Clock, AlertTriangle, Zap, CreditCard, Eye, EyeOff, Circle,
} from 'lucide-react';
// ── MOCK DATA ──────────────────────────────────────────────
const MOCK_STATS = {
  todaySales: 42750,      todaySalesChange: 18.4,
  todayProfit: 12300,     todayProfitChange: 6.2,
  cashBalance: 75500,     cashChange: -3.1,
  bankBalance: 1432500,   bankChange: 12.8,
  receivables: 285000,    receivablesChange: -4.5,
  payables: 98000,        payablesChange: 2.1,
  inventoryValue: 645000, inventoryChange: 1.8,
  pendingOrders: 14,      ordersChange: -21.4,
};

const MOCK_HEALTH = {
  score: 84,
  indicators: [
    { key:'cashflow',   label:'Cash Flow',     labelBn:'নগদ প্রবাহ',    status:'Excellent',  statusBn:'চমৎকার',         trendVal:'+8%',  color:'#10b981', icon:'wallet'   },
    { key:'inventory',  label:'Inventory',     labelBn:'ইনভেন্টরি',     status:'Healthy',    statusBn:'সুস্থ',           trendVal:'+2%',  color:'#3b82f6', icon:'box'      },
    { key:'sales',      label:'Sales Growth',  labelBn:'বিক্রি বৃদ্ধি',  status:'Strong',     statusBn:'শক্তিশালী',      trendVal:'+18%', color:'#8b5cf6', icon:'trending' },
    { key:'margin',     label:'Profit Margin', labelBn:'লাভ মার্জিন',   status:'Good',       statusBn:'ভালো',            trendVal:'+3%',  color:'#f59e0b', icon:'target'   },
    { key:'receivable', label:'Receivables',   labelBn:'পাওনা',          status:'Attention',  statusBn:'মনোযোগ প্রয়োজন', trendVal:'+12%', color:'#ef4444', icon:'users'    },
    { key:'expenses',   label:'Expenses',      labelBn:'খরচ',            status:'Controlled', statusBn:'নিয়ন্ত্রিত',    trendVal:'-2%',  color:'#06b6d4', icon:'receipt'  },
  ],
};

const buildChart = () => Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (13 - i));
  const s = [28,32,29,35,31,38,42,36,44,40,47,43,51,42.75].map(v=>v*1000);
  const p = [7.2,8.8,7.5,9.6,8.2,10.5,11.8,9.7,12.2,11,13.4,11.9,14.6,12.3].map(v=>v*1000);
  return {
    date:   d.toLocaleDateString('en-US',{month:'short',day:'numeric'}),
    dateBn: d.toLocaleDateString('bn-BD',{month:'short',day:'numeric'}),
    sales: s[i], profit: p[i], expenses: s[i]-p[i],
  };
});

const MOCK_ALERTS = [
  {id:'a1',priority:'high',  icon:'alert',   count:3,label:'Overdue Receivables',     labelBn:'মেয়াদোত্তীর্ণ পাওনা',   detail:'35,000 overdue',   detailBn:'৩৫,০০০ বকেয়া',      href:'/finance/receivables',  status:'critical'},
  {id:'a2',priority:'high',  icon:'pkg',     count:5,label:'Low Stock Items',         labelBn:'কম মজুদ পণ্য',            detail:'Reorder needed',   detailBn:'পুনঃঅর্ডার প্রয়োজন',href:'/inventory',            status:'critical'},
  {id:'a3',priority:'medium',icon:'bank',    count:2,label:'Bank Reconciliation',     labelBn:'ব্যাংক সমন্বয়',          detail:'DBBL + Sonali',    detailBn:'DBBL + সোনালী',      href:'/finance/bank-wallets', status:'warning' },
  {id:'a4',priority:'medium',icon:'vat',     count:1,label:'VAT Return Due',          labelBn:'ভ্যাট রিটার্ন বকেয়া',   detail:'Due Aug 15, 2026', detailBn:'১৫ আগস্ট, ২০২৬',    href:'/finance/settings',     status:'warning' },
  {id:'a5',priority:'low',   icon:'purchase',count:4,label:'Pending Purchase Orders', labelBn:'অপেক্ষমান ক্রয় আদেশ',   detail:'68,200 pending',   detailBn:'৬৮,২০০ অপেক্ষমান',  href:'/purchases',            status:'info'    },
  {id:'a6',priority:'low',   icon:'hrm',     count:7,label:'Attendance Not Marked',   labelBn:'উপস্থিতি চিহ্নিত নয়',   detail:'Today attendance', detailBn:'আজকের উপস্থিতি',    href:'/hrm/attendance',       status:'info'    },
];

const MOCK_TIMELINE = [
  {id:'t1',time:'10:42',type:'sale',    ref:'INV-5542',party:'Rahman Traders',  amount:6500, flow:'in' },
  {id:'t2',time:'09:48',type:'payment', ref:'RCP-1891',party:'ABC Distributors',amount:18000,flow:'in' },
  {id:'t3',time:'09:15',type:'purchase',ref:'PO-0892', party:'Karim Brothers',  amount:12400,flow:'out'},
  {id:'t4',time:'09:02',type:'expense', ref:'EXP-0341',party:'DESCO',           amount:2350, flow:'out'},
  {id:'t5',time:'08:30',type:'sale',    ref:'INV-5541',party:'Nova Pharma',     amount:9200, flow:'in' },
  {id:'t6',time:'08:15',type:'payment', ref:'RCP-1890',party:'Dhaka Traders',   amount:45000,flow:'in' },
  {id:'t7',time:'Yest.',type:'sale',    ref:'INV-5540',party:'Metro Store',     amount:14800,flow:'in' },
  {id:'t8',time:'Yest.',type:'expense', ref:'EXP-0340',party:'Fuel Station',    amount:1800, flow:'out'},
];

const AI_INSIGHTS = [
  {id:'i1',impact:'positive',text:'Sales up 18% vs last week. Medicine category leads.',textBn:'বিক্রি ১৮% বৃদ্ধি। মেডিসিন ক্যাটাগরি শীর্ষে।',           action:'View',      href:'/reports/sales'       },
  {id:'i2',impact:'alert',   text:'3 customers overdue totaling 35,000.',             textBn:'৩ জন গ্রাহকের মোট ৳৩৫,০০০ মেয়াদোত্তীর্ণ।',           action:'Follow Up', href:'/finance/receivables' },
  {id:'i3',impact:'neutral', text:'Profit margin improved to 28.7% this week.',       textBn:'এই সপ্তাহে লাভ মার্জিন ২৮.৭%-এ উন্নীত হয়েছে।',        action:'Details',   href:'/reports/dashboard'  },
  {id:'i4',impact:'positive',text:'Cash flow positive. 1.5M liquid assets.',          textBn:'নগদ প্রবাহ ইতিবাচক। ৳১৫ লক্ষ তরল সম্পদ।',              action:'Manage',    href:'/finance/bank-wallets'},
  {id:'i5',impact:'alert',   text:'5 inventory items below reorder level.',           textBn:'৫টি পণ্য পুনঃঅর্ডার সীমার নিচে।',                       action:'Reorder',   href:'/inventory'           },
];

const AI_PROMPTS = [
  'Show today sales breakdown','Who owes me money?','Low stock items',
  'Generate VAT report','Cash flow this month','Show payroll summary',
];

const QUICK_ACTIONS = [
  {label:'New Sale',        labelBn:'নতুন বিক্রি',     href:'/sales/new',                  Icon:ShoppingCart, color:'emerald'},
  {label:'Receive Payment', labelBn:'পেমেন্ট গ্রহণ',   href:'/finance/receivables',        Icon:ArrowDownLeft,color:'blue'   },
  {label:'New Purchase',    labelBn:'নতুন ক্রয়',       href:'/purchases/new',              Icon:Package,      color:'violet' },
  {label:'Record Expense',  labelBn:'খরচ রেকর্ড',      href:'/expenses/new',               Icon:Receipt,      color:'rose'   },
  {label:'Transfer Money',  labelBn:'অর্থ স্থানান্তর', href:'/finance/deposit-withdrawal', Icon:Repeat2,      color:'amber'  },
  {label:'Add Customer',    labelBn:'গ্রাহক যুক্ত',    href:'/parties/new?type=customer',  Icon:UserPlus,     color:'cyan'   },
  {label:'Add Product',     labelBn:'পণ্য যুক্ত',      href:'/inventory/new',              Icon:Box,          color:'indigo' },
  {label:'AI Assistant',    labelBn:'AI সহকারী',       href:'/ai',                         Icon:Bot,          color:'fuchsia'},
];

const BRANCHES = ['Dhaka HQ','Chattogram','Sylhet','Rajshahi','Khulna'];

// ── COLOR MAP
const KPI_COL: Record<string,{bg:string;text:string}> = {
  emerald:{bg:'rgba(16,185,129,0.08)', text:'#10b981'},
  blue:   {bg:'rgba(59,130,246,0.08)', text:'#3b82f6'},
  violet: {bg:'rgba(139,92,246,0.08)',text:'#8b5cf6'},
  amber:  {bg:'rgba(245,158,11,0.08)',text:'#f59e0b'},
  rose:   {bg:'rgba(239,68,68,0.08)', text:'#ef4444'},
  cyan:   {bg:'rgba(6,182,212,0.08)', text:'#06b6d4'},
  slate:  {bg:'rgba(100,116,139,0.08)',text:'#64748b'},
  fuchsia:{bg:'rgba(217,70,239,0.08)',text:'#d946ef'},
  indigo: {bg:'rgba(99,102,241,0.08)',text:'#6366f1'},
};
const ALERT_CLR: Record<string,string> = {critical:'#ef4444',warning:'#f59e0b',info:'#3b82f6'};
const INSIGHT_CLR: Record<string,string> = {positive:'#10b981',alert:'#ef4444',neutral:'#3b82f6'};
const STATUS_CLR: Record<string,string> = {
  Excellent:'text-emerald-500',Healthy:'text-blue-500',Strong:'text-violet-500',
  Good:'text-amber-500',Attention:'text-rose-500',Controlled:'text-cyan-500',
};
const TL_STYLE: Record<string,{color:string;bg:string;Icon:any;label:string;labelBn:string}> = {
  sale:    {color:'#10b981',bg:'#10b98112',Icon:ShoppingCart,label:'Sale',    labelBn:'বিক্রি'  },
  payment: {color:'#3b82f6',bg:'#3b82f612',Icon:CreditCard,  label:'Payment', labelBn:'পেমেন্ট'},
  purchase:{color:'#8b5cf6',bg:'#8b5cf612',Icon:Package,     label:'Purchase',labelBn:'ক্রয়'   },
  expense: {color:'#ef4444',bg:'#ef444412',Icon:Receipt,     label:'Expense', labelBn:'খরচ'    },
};

// ── COUNT-UP HOOK
function useCountUp(target: number, ms = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const p = Math.min((Date.now()-start)/ms, 1);
      const e = 1 - Math.pow(1-p, 3);
      setVal(Math.round(target*e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return val;
}

// ── MINI SPARKLINE
function Sparkline({ positive }: { positive: boolean }) {
  const data = [5,8,6,9,7,11,8,13,10,15].map(v=>({v: positive ? v : 15-v+2}));
  const c = positive ? '#10b981' : '#ef4444';
  return (
    <div className="h-8 w-14 opacity-60">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={positive?'spp':'spn'} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity={0.3}/>
              <stop offset="100%" stopColor={c} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={c} strokeWidth={1.5} fill={positive?'url(#spp)':'url(#spn)'} dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── KPI CARD
interface KPIProps {
  label:string; labelBn:string; value:number; change:number;
  prefix?:string; color:string; icon:React.ReactNode;
  href:string; isBangla:boolean; hide:boolean;
}
function KPICard({label,labelBn,value,change,prefix='',color,icon,href,isBangla,hide}:KPIProps) {
  const n = useCountUp(value);
  const pos = change >= 0;
  const c = KPI_COL[color] || KPI_COL.slate;
  const fmt = (v:number) => new Intl.NumberFormat(isBangla?'bn-BD':'en-US').format(v);
  return (
    <Link href={href}>
      <motion.div
        initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} whileHover={{y:-2}}
        className="relative rounded-2xl border p-4 cursor-pointer overflow-hidden transition-all duration-200"
        style={{background:'var(--card)',borderColor:'var(--border)'}}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{background:'linear-gradient(90deg,'+c.text+',transparent)'}}/>
        <div className="flex items-start justify-between mb-3">
          <div className="h-7 w-7 rounded-xl flex items-center justify-center" style={{background:c.bg}}>
            <span style={{color:c.text}} className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
          </div>
          <Sparkline positive={pos}/>
        </div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{isBangla?labelBn:label}</p>
        <p className="text-2xl font-bold text-foreground font-mono mb-2">{hide?'':prefix+fmt(n)}</p>
        <div className={cn('flex items-center gap-1 text-xs font-semibold',pos?'text-emerald-500':'text-rose-500')}>
          {pos?<TrendingUp className="h-3 w-3"/>:<TrendingDown className="h-3 w-3"/>}
          {pos?'+':''}{change.toFixed(1)}%
        </div>
      </motion.div>
    </Link>
  );
}

// ── HEALTH PILL
function HealthPill({ind,isBangla}:{ind:typeof MOCK_HEALTH.indicators[0];isBangla:boolean}) {
  const tc = STATUS_CLR[ind.status]||'text-muted-foreground';
  const IconMap: Record<string,any> = {wallet:Wallet,box:Box,trending:TrendingUp,target:Target,users:UserPlus,receipt:Receipt};
  const Icon = IconMap[ind.icon]||Circle;
  const isUp = ind.trendVal.startsWith('+');
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-border/40 hover:border-border bg-muted/20 transition-all text-center">
      <div className="h-7 w-7 rounded-xl flex items-center justify-center" style={{background:ind.color+'15'}}>
        <Icon className="h-3.5 w-3.5" style={{color:ind.color}}/>
      </div>
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">{isBangla?ind.labelBn:ind.label}</p>
      <p className={cn('text-[11px] font-bold',tc)}>{isBangla?ind.statusBn:ind.status}</p>
      <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
        {isUp?<TrendingUp className="h-2.5 w-2.5 text-emerald-500"/>:<TrendingDown className="h-2.5 w-2.5 text-rose-500"/>}
        {ind.trendVal}
      </div>
    </div>
  );
}

// ── ALERT ROW
function AlertRow({item,isBangla}:{item:typeof MOCK_ALERTS[0];isBangla:boolean}) {
  const clr = ALERT_CLR[item.status]||'#64748b';
  const IconMap: Record<string,any> = {alert:AlertTriangle,pkg:Package,bank:Landmark,vat:FileText,purchase:ShoppingCart,hrm:UserPlus};
  const Icon = IconMap[item.icon]||AlertCircle;
  return (
    <Link href={item.href}>
      <motion.div whileHover={{x:3}} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-all cursor-pointer">
        <div className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0" style={{background:clr+'12'}}>
          <Icon className="h-3.5 w-3.5" style={{color:clr}}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{background:clr}}>{item.count}</span>
            <p className="text-[11px] font-semibold text-foreground truncate">{isBangla?item.labelBn:item.label}</p>
          </div>
          <p className="text-[10px] text-muted-foreground">{isBangla?item.detailBn:item.detail}</p>
        </div>
        <ChevronRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground shrink-0 transition-colors"/>
      </motion.div>
    </Link>
  );
}

// ── INSIGHT ROW
function InsightRow({item,isBangla}:{item:typeof AI_INSIGHTS[0];isBangla:boolean}) {
  const clr = INSIGHT_CLR[item.impact];
  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-border/25 last:border-0">
      <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{background:clr}}/>
      <p className="flex-1 text-[11px] text-foreground/80 leading-relaxed">{isBangla?item.textBn:item.text}</p>
      <Link href={item.href} className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-lg hover:bg-muted transition-all" style={{color:clr}}>{item.action}</Link>
    </div>
  );
}

// ── TIMELINE ROW (REPLACED BY TABLE)

// ══════════════════════════════════════════════════════════
// MAIN DASHBOARD PAGE
// ══════════════════════════════════════════════════════════
export default function DashboardPage() {
  const router = useRouter();
  const { isBangla } = useAppTranslation();
  const { data: accountsData } = useAccounts();

  const [aiPrompt,   setAiPrompt]   = useState('');
  const [promptIdx,  setPromptIdx]  = useState(0);
  const [branch,     setBranch]     = useState('Dhaka HQ');
  const [branchOpen, setBranchOpen] = useState(false);
  const [metric,     setMetric]     = useState<'sales'|'profit'|'expenses'>('sales');
  const [range,      setRange]      = useState<'week'|'month'>('week');
  const [hide,       setHide]       = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hoverQA,    setHoverQA]    = useState<string|null>(null);
  const aiRef = useRef<HTMLInputElement>(null);
  const CHART_DATA = buildChart();

  useEffect(() => {
    const id = setInterval(() => setPromptIdx(i => (i+1) % AI_PROMPTS.length), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault(); aiRef.current?.focus();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const handleAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    router.push('/ai?q=' + encodeURIComponent(aiPrompt));
  };

  const fmt = useCallback((v:number) => new Intl.NumberFormat(isBangla?'bn-BD':'en-US').format(v), [isBangla]);

  const cashBal = accountsData?.filter((a:any)=>a.type==='cash').reduce((s:number,a:any)=>s+a.currentBalance,0) || MOCK_STATS.cashBalance;
  const bankBal = accountsData?.filter((a:any)=>a.type!=='cash').reduce((s:number,a:any)=>s+a.currentBalance,0) || MOCK_STATS.bankBalance;

  const chartData = CHART_DATA.slice(range==='week'?-7:-14).map(d=>({...d,date:isBangla?d.dateBn:d.date}));
  const chartColor = metric==='sales'?'#4F5BFF':metric==='profit'?'#10b981':'#ef4444';
  const chartName  = metric==='sales'?(isBangla?'বিক্রি':'Sales'):metric==='profit'?(isBangla?'লাভ':'Profit'):(isBangla?'খরচ':'Expenses');
  const chartPeak  = Math.max(...chartData.map(d=>d[metric]));
  const chartAvg   = Math.round(chartData.reduce((s,d)=>s+d[metric],0)/chartData.length);
  const totalSales = chartData.reduce((sum, d) => sum + d.sales, 0);
  const totalProfit = chartData.reduce((sum, d) => sum + d.profit, 0);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
  const lastSync   = new Date().toLocaleTimeString(isBangla?'bn-BD':'en-US',{hour:'2-digit',minute:'2-digit'});

  return (
    <div className="min-h-screen space-y-6 pb-12">

      {/* S1: COMMAND HEADER */}
      <div className="flex items-center gap-4 rounded-2xl border px-5 py-3" style={{background:'var(--card)',borderColor:'var(--border)'}}>
        <div className="relative shrink-0">
          <button onClick={()=>setBranchOpen(v=>!v)} className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors">
            <Building2 className="h-4 w-4 text-muted-foreground"/>
            {branch}
            <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform',branchOpen&&'rotate-180')}/>
          </button>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"/>
            {isBangla?'সিঙ্ক:':'Sync:'} {lastSync}
          </div>
          <AnimatePresence>
            {branchOpen && (
              <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}
                className="absolute top-full left-0 mt-1 z-50 rounded-xl border border-border shadow-xl overflow-hidden min-w-[140px]"
                style={{background:'var(--card)'}}>
                {BRANCHES.map(b=>(
                  <button key={b} onClick={()=>{setBranch(b);setBranchOpen(false);}}
                    className={cn('w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors',branch===b?'text-primary font-bold':'text-foreground')}>
                    {b}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form onSubmit={handleAI} className="flex-1">
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-2 border border-border bg-muted/40 hover:border-primary/30 focus-within:border-primary/40 focus-within:bg-card transition-all">
            <Sparkles className="h-4 w-4 text-primary shrink-0"/>
            <input ref={aiRef} type="text" value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)}
              placeholder={AI_PROMPTS[promptIdx]}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"/>
            <kbd className="hidden sm:block text-[10px] text-muted-foreground/40 border border-border/40 rounded px-1.5 py-0.5">/</kbd>
            <button type="submit" className="h-6 w-6 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
              <Send className="h-3 w-3"/>
            </button>
          </div>
        </form>

        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={()=>setHide(v=>!v)} className="h-8 w-8 rounded-xl flex items-center justify-center border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
            {hide?<Eye className="h-4 w-4"/>:<EyeOff className="h-4 w-4"/>}
          </button>
          <button onClick={async()=>{setRefreshing(true);await new Promise(r=>setTimeout(r,700));setRefreshing(false);}}
            className="h-8 w-8 rounded-xl flex items-center justify-center border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
            <RefreshCw className={cn('h-4 w-4',refreshing&&'animate-spin')}/>
          </button>
          <Link href="/notifications" className="relative h-8 w-8 rounded-xl flex items-center justify-center border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
            <Bell className="h-4 w-4"/>
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-rose-500 border border-card"/>
          </Link>
          <Link href="/settings" className="h-8 w-8 rounded-xl flex items-center justify-center border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
            <Settings className="h-4 w-4"/>
          </Link>
        </div>
      </div>

      {/* S2: BUSINESS HEALTH CENTER */}
      <div className="rounded-2xl border p-5" style={{background:'var(--card)',borderColor:'var(--border)'}}>
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="flex items-center gap-5 shrink-0">
            <div className="relative">
              <svg width="88" height="88" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(79,91,255,0.1)" strokeWidth="7"/>
                <motion.circle cx="44" cy="44" r="36" fill="none" stroke="url(#hg)" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={2*Math.PI*36}
                  initial={{strokeDashoffset:2*Math.PI*36}}
                  animate={{strokeDashoffset:2*Math.PI*36*(1-MOCK_HEALTH.score/100)}}
                  transition={{duration:1.2,ease:'easeOut'}} transform="rotate(-90 44 44)"/>
                <defs>
                  <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F5BFF"/><stop offset="100%" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-foreground">{MOCK_HEALTH.score}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-foreground">{isBangla?'ব্যবসার স্বাস্থ্য':'Business Health'}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">A · {isBangla?'উন্নতি':'Improving'}</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                {isBangla?'সামগ্রিক অবস্থা ভালো। পাওনা সংগ্রহে মনোযোগ দিন।':'Overall strong. Focus on receivables.'}
              </p>
              <Link href="/reports/health-score" className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-1.5 hover:underline">
                {isBangla?'বিশ্লেষণ':'Full Analysis'} <ChevronRight className="h-3 w-3"/>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block w-px self-stretch bg-border/40"/>
          <div className="flex-1 grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {MOCK_HEALTH.indicators.map(ind=><HealthPill key={ind.key} ind={ind} isBangla={isBangla}/>)}
          </div>
        </div>
      </div>

      {/* S3: KPI GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{isBangla?'মূল পরিসংখ্যান':'Key Metrics'}</p>
          <p className="text-xs text-muted-foreground">{isBangla?'আজকের তথ্য':"Today's data"} · {lastSync}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
          <KPICard label="Today's Sales"   labelBn="আজকের বিক্রি"    value={MOCK_STATS.todaySales}     change={MOCK_STATS.todaySalesChange}   prefix="৳" color="emerald" icon={<ShoppingCart/>} href="/sales"                isBangla={isBangla} hide={hide}/>
          <KPICard label="Today's Profit"  labelBn="আজকের লাভ"       value={MOCK_STATS.todayProfit}    change={MOCK_STATS.todayProfitChange}  prefix="৳" color="blue"    icon={<TrendingUp/>}    href="/reports/dashboard"    isBangla={isBangla} hide={hide}/>
          <KPICard label="Cash Balance"    labelBn="নগদ ব্যালেন্স"    value={cashBal}                   change={MOCK_STATS.cashChange}         prefix="৳" color="violet"  icon={<Wallet/>}        href="/finance/bank-wallets" isBangla={isBangla} hide={hide}/>
          <KPICard label="Bank Balance"    labelBn="ব্যাংক ব্যালেন্স" value={bankBal}                   change={MOCK_STATS.bankChange}         prefix="৳" color="cyan"    icon={<Landmark/>}      href="/finance/bank-wallets" isBangla={isBangla} hide={hide}/>
          <KPICard label="Receivables"     labelBn="পাওনা"             value={MOCK_STATS.receivables}    change={MOCK_STATS.receivablesChange}  prefix="৳" color="amber"   icon={<ArrowDownLeft/>} href="/finance/receivables"  isBangla={isBangla} hide={hide}/>
          <KPICard label="Payables"        labelBn="দেনা"              value={MOCK_STATS.payables}       change={MOCK_STATS.payablesChange}     prefix="৳" color="rose"    icon={<ArrowUpRight/>}  href="/finance/payables"     isBangla={isBangla} hide={hide}/>
          <KPICard label="Inventory Value" labelBn="স্টক মূল্য"        value={MOCK_STATS.inventoryValue} change={MOCK_STATS.inventoryChange}    prefix="৳" color="slate"   icon={<Package/>}       href="/inventory"            isBangla={isBangla} hide={hide}/>
        </div>
      </div>

      {/* S4: WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quick Actions */}
        <div className="rounded-2xl border overflow-hidden" style={{background:'var(--card)',borderColor:'var(--border)'}}>
          <div className="px-5 py-3 border-b border-border/40">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-primary"/>{isBangla?'দ্রুত কার্যক্রম':'Quick Actions'}
            </h3>
          </div>
          <div className="grid grid-cols-4 gap-1 p-2">
            {QUICK_ACTIONS.map(a=>{
              const c = KPI_COL[a.color]||KPI_COL.slate;
              const active = hoverQA===a.label;
              return (
                <Link key={a.label} href={a.href}>
                  <motion.div whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all"
                    onMouseEnter={()=>setHoverQA(a.label)} onMouseLeave={()=>setHoverQA(null)}
                    style={{background:active?c.bg:'transparent'}}>
                    <div className="h-9 w-9 rounded-2xl flex items-center justify-center transition-all" style={{background:active?c.text:c.bg}}>
                      <a.Icon className="h-4 w-4 transition-colors" style={{color:active?'#fff':c.text}}/>
                    </div>
                    <p className="text-[10px] font-semibold text-center leading-tight text-muted-foreground">{isBangla?a.labelBn:a.label}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action Required */}
        <div className="rounded-2xl border overflow-hidden" style={{background:'var(--card)',borderColor:'var(--border)'}}>
          <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500"/>{isBangla?'পদক্ষেপ প্রয়োজন':'Action Required'}
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500">
              {MOCK_ALERTS.filter(a=>a.priority==='high').length} {isBangla?'জরুরি':'urgent'}
            </span>
          </div>
          <div className="p-2 space-y-0.5">
            {MOCK_ALERTS.map(item=><AlertRow key={item.id} item={item} isBangla={isBangla}/>)}
          </div>
        </div>

        {/* AI Brief */}
        <div className="rounded-2xl border overflow-hidden flex flex-col" style={{background:'var(--card)',borderColor:'var(--border)'}}>
          <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary"/>{isBangla?'AI বিশ্লেষণ':'AI Daily Brief'}
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{background:'rgba(79,91,255,0.1)',color:'#4F5BFF'}}>
              <Bot className="h-2.5 w-2.5"/>AI
            </span>
          </div>
          <div className="flex-1 px-4 pt-1 pb-2">
            {AI_INSIGHTS.map(item=><InsightRow key={item.id} item={item} isBangla={isBangla}/>)}
          </div>
          <div className="px-4 pb-4">
            <Link href="/ai" className="flex items-center justify-center gap-2 w-full h-8 rounded-xl text-xs font-bold border border-border hover:bg-muted transition-all text-muted-foreground hover:text-foreground">
              <Bot className="h-3.5 w-3.5"/>{isBangla?'AI সহকারী':'Open AI Assistant'}
            </Link>
          </div>
        </div>
      </div>

      {/* S5: BUSINESS INTELLIGENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border p-5" style={{background:'var(--card)',borderColor:'var(--border)'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground">{isBangla?'ব্যবসার কার্যক্ষমতা':'Business Performance'}</h3>
            <div className="flex gap-2">
              <div className="flex gap-0.5 bg-muted rounded-xl p-0.5">
                {(['sales','profit','expenses'] as const).map(m=>(
                  <button key={m} onClick={()=>setMetric(m)}
                    className={cn('px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all',metric===m?'bg-card text-foreground shadow-sm':'text-muted-foreground hover:text-foreground')}>
                    {m==='sales'?(isBangla?'বিক্রি':'Sales'):m==='profit'?(isBangla?'লাভ':'Profit'):(isBangla?'খরচ':'Exp')}
                  </button>
                ))}
              </div>
              <div className="flex gap-0.5 bg-muted rounded-xl p-0.5">
                {(['week','month'] as const).map(r=>(
                  <button key={r} onClick={()=>setRange(r)}
                    className={cn('px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all',range===r?'bg-card text-foreground shadow-sm':'text-muted-foreground hover:text-foreground')}>
                    {r==='week'?(isBangla?'সপ্তাহ':'Week'):(isBangla?'মাস':'Month')}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 mb-4 px-1 py-1 border-b border-border/20 pb-3">
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[#4F5BFF]"/>
                {isBangla ? 'বিক্রি' : 'Sales'}: <span className="font-bold text-foreground font-mono">৳{fmt(totalSales)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[#10b981]"/>
                {isBangla ? 'লাভ' : 'Profit'}: <span className="font-bold text-emerald-500 font-mono">৳{fmt(totalProfit)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[#ef4444]"/>
                {isBangla ? 'খরচ' : 'Expenses'}: <span className="font-bold text-rose-500 font-mono">৳{fmt(totalExpenses)}</span>
              </div>
            </div>
            <div className="flex gap-4">
              {[{l:isBangla?'সর্বোচ্চ':'Peak',v:chartPeak},{l:isBangla?'গড়':'Avg',v:chartAvg}].map(p=>(
                <div key={p.l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full" style={{background:chartColor}}/>
                  {p.l}: <span className="font-bold text-foreground font-mono">৳{fmt(p.v)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{top:4,right:4,bottom:0,left:0}}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F5BFF" stopOpacity={0.12}/>
                    <stop offset="100%" stopColor="#4F5BFF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.10}/>
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
                <XAxis dataKey="date" fontSize={9} stroke="#6B7A8D" tickLine={false} axisLine={false}/>
                <YAxis fontSize={9} stroke="#6B7A8D" tickLine={false} axisLine={false} tickFormatter={v=>''+Math.round(v/1000)+'k'} width={28}/>
                <Tooltip
                  contentStyle={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',fontSize:'11px'}}
                  labelStyle={{color:'var(--foreground)',fontWeight:600}}
                  formatter={(v:number, name:string)=>['৳'+fmt(v), name]}
                />
                
                {/* Sales series */}
                <Area type="monotone" dataKey="sales" name={isBangla ? 'বিক্রি' : 'Sales'}
                  stroke="#4F5BFF" strokeWidth={metric === 'sales' ? 2.5 : 1.2} strokeOpacity={metric === 'sales' ? 1 : 0.35}
                  fill={metric === 'sales' ? 'url(#salesGrad)' : 'none'}
                  dot={metric === 'sales' ? { r: 3, fill: '#4F5BFF', strokeWidth: 0 } : false}
                  activeDot={{ r: 5, stroke: '#fff', strokeWidth: 1.5, fill: '#4F5BFF' }}/>

                {/* Profit series */}
                <Area type="monotone" dataKey="profit" name={isBangla ? 'লাভ' : 'Profit'}
                  stroke="#10b981" strokeWidth={metric === 'profit' ? 2.5 : 1.2} strokeOpacity={metric === 'profit' ? 1 : 0.35}
                  fill={metric === 'profit' ? 'url(#profitGrad)' : 'none'}
                  dot={metric === 'profit' ? { r: 3, fill: '#10b981', strokeWidth: 0 } : false}
                  activeDot={{ r: 5, stroke: '#fff', strokeWidth: 1.5, fill: '#10b981' }}/>

                {/* Expenses series */}
                <Area type="monotone" dataKey="expenses" name={isBangla ? 'খরচ' : 'Expenses'}
                  stroke="#ef4444" strokeWidth={metric === 'expenses' ? 2.5 : 1.2} strokeOpacity={metric === 'expenses' ? 1 : 0.35}
                  fill={metric === 'expenses' ? 'url(#expensesGrad)' : 'none'}
                  dot={metric === 'expenses' ? { r: 3, fill: '#ef4444', strokeWidth: 0 } : false}
                  activeDot={{ r: 5, stroke: '#fff', strokeWidth: 1.5, fill: '#ef4444' }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border p-5 flex flex-col" style={{background:'var(--card)',borderColor:'var(--border)'}}>
          <h3 className="text-sm font-bold text-foreground mb-4">{isBangla?'নগদ প্রবাহ':'Cash Flow'}</h3>
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="11"/>
                <motion.circle cx="55" cy="55" r="44" fill="none" stroke="#10b981" strokeWidth="11" strokeLinecap="round"
                  strokeDasharray={2*Math.PI*44} initial={{strokeDashoffset:2*Math.PI*44}}
                  animate={{strokeDashoffset:2*Math.PI*44*0.38}} transition={{duration:1,ease:'easeOut',delay:0.1}}
                  transform="rotate(-90 55 55)"/>
                <motion.circle cx="55" cy="55" r="44" fill="none" stroke="#ef4444" strokeWidth="11" strokeLinecap="round"
                  strokeDasharray={2*Math.PI*44} initial={{strokeDashoffset:2*Math.PI*44}}
                  animate={{strokeDashoffset:2*Math.PI*44*0.62}} transition={{duration:1,ease:'easeOut',delay:0.3}}
                  transform="rotate(37 55 55)"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[9px] text-muted-foreground">{isBangla?'নিট':'Net'}</p>
                <p className="text-base font-bold text-emerald-500">+৳{fmt(73400)}</p>
              </div>
            </div>
            <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> {isBangla?'আয়':'In'}</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500"/> {isBangla?'ব্যয়':'Out'}</span>
            </div>
          </div>
          <div className="space-y-2.5 flex-1">
            {[
              {l:isBangla?'আয়':'Cash In',       v:195400,Icon:ArrowDownLeft,c:'#10b981'},
              {l:isBangla?'ব্যয়':'Cash Out',     v:122000,Icon:ArrowUpRight, c:'#ef4444'},
              {l:isBangla?'নগদে':'Cash in Hand', v:cashBal,Icon:Wallet,      c:'#3b82f6'},
              {l:isBangla?'ব্যাংকে':'Bank',      v:bankBal,Icon:Landmark,    c:'#8b5cf6'},
            ].map(r=>(
              <div key={r.l} className="flex items-center justify-between py-2 border-b border-border/25 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg flex items-center justify-center" style={{background:r.c+'12'}}>
                    <r.Icon className="h-3 w-3" style={{color:r.c}}/>
                  </div>
                  <span className="text-sm text-muted-foreground">{r.l}</span>
                </div>
                <span className="text-sm font-bold text-foreground font-mono">{hide?'':fmt(r.v)}</span>
              </div>
            ))}
          </div>
          <Link href="/finance/bank-wallets" className="flex items-center justify-center gap-1 text-sm font-semibold text-primary hover:underline mt-3">
            {isBangla?'বিস্তারিত':'View Report'} <ChevronRight className="h-3 w-3"/>
          </Link>
        </div>
      </div>

      {/* S6: TIMELINE */}
      <div className="rounded-2xl border overflow-hidden" style={{background:'var(--card)',borderColor:'var(--border)'}}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary"/>{isBangla?'সাম্প্রতিক কার্যক্রম':'Recent Activity'}
          </h3>
          <Link href="/reports/dashboard" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            {isBangla?'সব দেখুন':'View All'} <ChevronRight className="h-3 w-3"/>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{isBangla ? 'ধরণ' : 'Type'}</th>
                <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{isBangla ? 'রেফারেন্স' : 'Ref'}</th>
                <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{isBangla ? 'গ্রাহক/পার্টি' : 'Party'}</th>
                <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
                <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">{isBangla ? 'সময়' : 'Time'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {MOCK_TIMELINE.map((item) => {
                const s = TL_STYLE[item.type] || TL_STYLE.sale;
                return (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors text-sm">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0" style={{background:s.bg}}>
                          <s.Icon className="h-3 w-3" style={{color:s.color}}/>
                        </div>
                        <span className="font-bold uppercase tracking-wide text-[10px]" style={{color:s.color}}>
                          {isBangla ? s.labelBn : s.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap font-mono text-muted-foreground text-xs">
                      {item.ref}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap font-semibold text-foreground truncate max-w-[150px]">
                      {item.party}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right font-mono font-bold">
                      <span className={item.flow === 'in' ? 'text-emerald-500' : 'text-rose-500'}>
                        {item.flow === 'in' ? '+' : '-'}৳{fmt(item.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right text-muted-foreground text-xs">
                      {item.time}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
