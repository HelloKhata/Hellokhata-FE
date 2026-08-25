'use client';

import React, { useState } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  LineChart,
  Activity,
  CheckCircle2,
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

export default function AiInsightsReportsPage() {
  const { isBangla } = useAppTranslation();
  const { formatCurrency } = useCurrency();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulated AI responses
  const aiAnalyses: Record<string, { title: string; titleBn: string; text: string; textBn: string; score?: string }> = {
    runway: {
      title: 'Cash Runway Prediction & Analysis',
      titleBn: 'ক্যাশ রানওয়ে পূর্বাভাস ও বিশ্লেষণ',
      text: 'Based on current cash reserves (1,744,300) and average monthly operating expenses (880,000), your business has a runway of approximately 1.98 months. To extend the runway, we recommend: 1. Speeding up accounts receivable collections (634,200 outstanding), 2. Optimizing inventory holdings to free up tied-up working capital.',
      textBn: 'বর্তমান নগদ অর্থ (১,৭৪৪,৩০০) এবং গড় মাসিক পরিচালন ব্যয়ের (৮৮০,০০০) ওপর ভিত্তি করে ব্যবসার আনুমানিক ক্যাশ রানওয়ে ১.৯৮ মাস। রানওয়ে বাড়ানোর জন্য সুপারিশ: ১. বকেয়া পাওনা (৬৩৪,২০০) দ্রুত আদায় করা, ২. অবিক্রিত ইনভেন্টরি স্টক হ্রাস করে মূলধন অবমুক্ত করা।',
    },
    deadstock: {
      title: 'Dead Stock Inventory Scan',
      titleBn: 'অচল ও ধীর গতির পণ্য স্ক্যান',
      text: 'AI Scan detected that footwear items (value: 120,000) have shown zero turnover in the last 45 days. Recommendation: Offer a promotional clearance bundle (15-20% discount) to clear space and recover working capital, shifting allocations to higher velocity products.',
      textBn: 'এআই স্ক্যানে দেখা গেছে যে জুতো পণ্যসমূহ (মূল্য: ১২০,০০০) গত ৪৫ দিনে কোনো বিক্রি হয়নি। সুপারিশ: অবমুক্ত মূলধন অন্য আবর্তক পণ্যে বিনিয়োগ করার জন্য ১৫-২০% ডিসকাউন্ট বান্ডেল অফার করে দ্রুত স্টক খালি করুন।',
    },
    margins: {
      title: 'Profit Margin Optimization Factors',
      titleBn: 'লাভের অনুপাত বৃদ্ধি ও বিশ্লেষণ',
      text: 'Gross Profit Margin stands strong at 60.3%, driven by service revenues (654,000) yielding high markup. However, Net Profit Margin (31.1%) is impacted by employee salary costs (500,000) which represent 56% of total operating expenses. Recommendation: Monitor payroll utility margins against branch revenues.',
      textBn: 'সেবা আয়ের (৬৫৪,০০০) উচ্চ লাভ সীমার কারণে মোট মুনাফা অনুপাত ৬০.৩% এ খুব ভালো অবস্থানে আছে। তবে বেতন খরচের (৫০০,০০০) কারণে নিট মুনাফা (৩১.১%) কিছুটা প্রভাবিত, যা মোট পরিচালন ব্যয়ের ৫৬%। সুপারিশ: শাখা আয়ের সাথে সামঞ্জস্য রেখে বেতন উপযোগিতা বৃদ্ধি করুন।',
    },
  };

  const handlePromptClick = (id: string) => {
    setIsAnalyzing(true);
    setSelectedPrompt(id);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <FinancePageHeader
        pageName="AI Insights Dashboard"
        pageNameBn="এআই ইনসাইটস ড্যাশবোর্ড"
        description="Leverage machine learning algorithms to assess business health and forecast sales."
        descriptionBn="ব্যবসায়িক স্বাস্থ্য বিশ্লেষণ এবং বিক্রির পূর্বাভাস পেতে মেশিন লার্নিং ব্যবহার করুন।"
        icon={Sparkles}
        parentName="Reports"
        parentNameBn="রিপোর্ট"
        parentHref="/reports/dashboard"
      />

      {/* AI Score Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-card to-emerald-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'ব্যবসায়িক স্বাস্থ্য স্কোর' : 'Business Health Score'}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 font-mono">84/100</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/15 border-transparent text-[10px] font-bold rounded-md">
                  Grade A
                </Badge>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-primary/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'বিক্রির পূর্বাভাস প্রবৃদ্ধি' : 'Forecasted Sales Growth'}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-primary font-mono">+14.2%</span>
                <span className="text-[10px] text-muted-foreground font-semibold">{isBangla ? 'আগামী ৩ মাস' : 'Next 3 months'}</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-rose-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'শনাক্তকৃত পরিচালন ঝুঁকি' : 'Detected Operations Risk'}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono">1 Active</span>
                <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 border-transparent text-[10px] font-bold rounded-md">
                  Low Risk
                </Badge>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & Drivers Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: SVGArea Sales Forecasting Chart */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="pb-3 border-b border-border/30 bg-muted/10">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <CardTitle className="text-sm font-bold">{isBangla ? 'এআই সেলস পূর্বাভাস গ্রাফ' : 'AI Sales Projection & Forecast Curve'}</CardTitle>
                <CardDescription className="text-xs">{isBangla ? 'বিগত ৪ মাসের প্রকৃত বিক্রির সাথে আগামী ৩ মাসের পূর্বাভাস' : 'Historical actual sales alongside next 3 months predictions'}</CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-transparent text-[9px] font-bold rounded-md">
                Confidence Interval: 95%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* SVG area chart representation */}
            <div className="w-full h-64 relative bg-card/50 rounded-lg overflow-hidden border border-border/30">
              <svg className="w-full h-full px-4 pt-4 pb-8" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Confidence Interval Shaded Shading */}
                <polygon
                  points="280,110 350,90 420,80 420,120 350,135 280,110"
                  fill="rgba(99, 102, 241, 0.08)"
                />
                
                {/* Grid Lines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                {/* Actual Sales Line (Solid) */}
                <path
                  d="M 20 160 L 80 150 L 140 130 L 200 120 L 280 110"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Forecast Sales Line (Dashed) */}
                <path
                  d="M 280 110 L 350 112 L 420 100"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeDasharray="4"
                  strokeLinecap="round"
                />

                {/* Data point anchors */}
                <circle cx="20" cy="160" r="3.5" fill="#10b981" />
                <circle cx="80" cy="150" r="3.5" fill="#10b981" />
                <circle cx="140" cy="130" r="3.5" fill="#10b981" />
                <circle cx="200" cy="120" r="3.5" fill="#10b981" />
                <circle cx="280" cy="110" r="3.5" fill="#10b981" />
                <circle cx="350" cy="112" r="3.5" fill="#6366f1" />
                <circle cx="420" cy="100" r="3.5" fill="#6366f1" />

                {/* X Axis Labels */}
                <text x="20" y="190" fill="currentColor" opacity="0.4" fontSize="9" textAnchor="middle">May</text>
                <text x="80" y="190" fill="currentColor" opacity="0.4" fontSize="9" textAnchor="middle">Jun</text>
                <text x="140" y="190" fill="currentColor" opacity="0.4" fontSize="9" textAnchor="middle">Jul</text>
                <text x="200" y="190" fill="currentColor" opacity="0.4" fontSize="9" textAnchor="middle">Aug (Act)</text>
                <text x="280" y="190" fill="currentColor" opacity="0.4" fontSize="9" textAnchor="middle">Sep (Fct)</text>
                <text x="350" y="190" fill="currentColor" opacity="0.4" fontSize="9" textAnchor="middle">Oct (Fct)</text>
                <text x="420" y="190" fill="currentColor" opacity="0.4" fontSize="9" textAnchor="middle">Nov (Fct)</text>
              </svg>
              
              {/* Legend overlay */}
              <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm border rounded-lg p-2 flex gap-3 text-[10px] font-semibold shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{isBangla ? 'প্রকৃত বিক্রি' : 'Actual Sales'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0 border border-dashed border-indigo-600" />
                  <span>{isBangla ? 'এআই পূর্বাভাস' : 'AI Forecast'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Key Business Drivers */}
        <Card className="border-border/50">
          <CardHeader className="pb-3 border-b border-border/30 bg-muted/10">
            <CardTitle className="text-sm font-bold">{isBangla ? 'পজিটিভ ও নেগেটিভ ড্রাইভারস' : 'Key Performance Drivers'}</CardTitle>
            <CardDescription className="text-xs">{isBangla ? 'ব্যবসার প্রবৃদ্ধি ও সংকোচনের মূল কারণসমূহ' : 'AI-extracted factors affecting margins'}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Positive Drivers */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {isBangla ? 'পজিটিভ চালিকাশক্তি' : 'Positive Drivers'}
              </p>
              <div className="space-y-2">
                <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-xs flex gap-2.5">
                  <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">{isBangla ? 'কাউন্টার পণ্য বিক্রয় গতি' : 'Counter Sales Velocity'}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{isBangla ? 'গত সপ্তাহের চেয়ে ১৮% বৃদ্ধি পেয়েছে।' : 'In-store retail counter flows increased by +18%.'}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-xs flex gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">{isBangla ? 'পাওনা আদায় কার্যকারিতা' : 'Receivables Recovery'}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{isBangla ? 'রিমাইন্ডার প্রেরণের পর পাওনা পরিশোধ হার বেড়েছে।' : 'Weekly aging collections recovered +12% faster.'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Negative Drivers */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                {isBangla ? 'নেগেটিভ ও বাধা চালক' : 'Drag Factors'}
              </p>
              <div className="space-y-2">
                <div className="p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg text-xs flex gap-2.5">
                  <TrendingDown className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">{isBangla ? 'ওয়ালেট কমিশন ফি' : 'MFS Fee commissions'}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{isBangla ? 'বিকাশ/নগদ ফি বৃদ্ধি নিট লাভ কমায়।' : 'MFS payments fee overheads created a -2.1% drag.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anomalies Logs Grid */}
      <Card className="border-border/50">
        <CardHeader className="pb-3 border-b border-border/30 bg-muted/10">
          <CardTitle className="text-sm font-bold">{isBangla ? 'এআই অসঙ্গতি ও ঝুঁকি শনাক্তকরণ লগ' : 'AI Anomalies & Risk Detection Log'}</CardTitle>
          <CardDescription className="text-xs">{isBangla ? 'অস্বাভাবিক লেনদেন বা বকেয়া ঝুঁকি সনাক্তকরণ তালিকা' : 'Flagged system anomalies or accounts risk indicators'}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border/35 font-bold">
                  <th className="p-3">{isBangla ? 'তারিখ' : 'Date Detected'}</th>
                  <th className="p-3">{isBangla ? 'ঝুঁকি ধরন' : 'Risk Type'}</th>
                  <th className="p-3">{isBangla ? 'বিবরণ' : 'Anomaly Narration'}</th>
                  <th className="p-3 text-right">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
                  <th className="p-3 text-center">{isBangla ? 'ঝুঁকি মাত্রা' : 'Severity'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                <tr className="hover:bg-muted/5">
                  <td className="p-3 font-mono text-muted-foreground">2026-08-05</td>
                  <td className="p-3 font-semibold text-foreground">{isBangla ? 'বকেয়া ঋণখেলাপী ঝুঁকি' : 'Account Overdue Risk'}</td>
                  <td className="p-3 text-muted-foreground">{isBangla ? 'দেশ এন্টারপ্রাইজের বকেয়া ৯০ দিন অতিক্রম করেছে।' : 'Receivables outstanding for Desh Enterprise exceeded 90 days.'}</td>
                  <td className="p-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">{formatCurrency(30000)}</td>
                  <td className="p-3 text-center">
                    <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 border-transparent py-0 px-2 rounded-md text-[9px] font-bold">
                      {isBangla ? 'উচ্চ' : 'High'}
                    </Badge>
                  </td>
                </tr>

                <tr className="hover:bg-muted/5">
                  <td className="p-3 font-mono text-muted-foreground">2026-08-04</td>
                  <td className="p-3 font-semibold text-foreground">{isBangla ? 'অস্বাভাবিক বিপণন খরচ' : 'Unusual Expenditure'}</td>
                  <td className="p-3 text-muted-foreground">{isBangla ? 'গত মাসের চেয়ে ৩ গুণ বেশি মার্কেটিং বাজেট খরচ।' : 'Marketing budgets exceeded average monthly trends by 3x.'}</td>
                  <td className="p-3 text-right font-mono font-semibold">{formatCurrency(110000)}</td>
                  <td className="p-3 text-center">
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-500 hover:bg-amber-500/15 border-transparent py-0 px-2 rounded-md text-[9px] font-bold">
                      {isBangla ? 'মাঝারি' : 'Medium'}
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Analyst Prompts Hub */}
      <Card className="border-border/50">
        <CardHeader className="pb-3 border-b border-border/30 bg-muted/10">
          <CardTitle className="text-sm font-bold flex items-center gap-1.5">
            <BrainCircuit className="h-4.5 w-4.5 text-primary" />
            <span>{isBangla ? 'এআই আর্থিক বিশ্লেষক হাব' : 'AI Financial Analyst Hub'}</span>
          </CardTitle>
          <CardDescription className="text-xs">{isBangla ? 'যেকোনো বাটন নির্বাচন করে তাৎক্ষণিক এআই পূর্বাভাস ও বিশ্লেষণ পরিচালনা করুন' : 'Select quick chips to trigger instant financial forecasts and audit runs'}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePromptClick('runway')}
              className={cn('text-xs gap-1.5 h-8 rounded-lg', selectedPrompt === 'runway' && 'border-primary bg-primary/5 text-primary')}
            >
              <Activity className="h-3.5 w-3.5" />
              {isBangla ? 'ক্যাশ রানওয়ে পূর্বাভাস চালান' : 'Run Cash Runway Forecast'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePromptClick('deadstock')}
              className={cn('text-xs gap-1.5 h-8 rounded-lg', selectedPrompt === 'deadstock' && 'border-primary bg-primary/5 text-primary')}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {isBangla ? 'অচল স্টক পণ্য স্ক্যান করুন' : 'Scan Dead Stock Items'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePromptClick('margins')}
              className={cn('text-xs gap-1.5 h-8 rounded-lg', selectedPrompt === 'margins' && 'border-primary bg-primary/5 text-primary')}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {isBangla ? 'মুনাফা অনুপাত বৃদ্ধি সূচক বিশ্লেষণ' : 'Analyze Profit Margin Factors'}
            </Button>
          </div>

          {/* AI Response Output Block */}
          {selectedPrompt && (
            <div className="p-4 bg-muted/30 border border-border/20 rounded-xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  {isBangla ? aiAnalyses[selectedPrompt].titleBn : aiAnalyses[selectedPrompt].title}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {isBangla ? 'বিশ্লেষণ সম্পন্ন' : 'Analysis Complete'}
                </span>
              </div>
              {isAnalyzing ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2 font-medium">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>{isBangla ? 'এআই হিসাবপত্র বিশ্লেষণ করছে...' : 'AI is processing ledger indices...'}</span>
                </div>
              ) : (
                <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                  {isBangla ? aiAnalyses[selectedPrompt].textBn : aiAnalyses[selectedPrompt].text}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
