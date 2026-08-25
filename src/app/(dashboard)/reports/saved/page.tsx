'use client';

import React, { useState } from 'react';
import { FinancePageHeader } from '@/components/finance/FinancePageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppTranslation, useCurrency } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  FileSpreadsheet,
  Star,
  Clock,
  Plus,
  Search,
  Trash2,
  Play,
  Mail,
  Share2,
  Calendar,
  Layers,
  Settings,
  BellRing,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SavedReport {
  id: string;
  title: string;
  titleBn: string;
  baseReport: string;
  baseReportBn: string;
  filters: string;
  filtersBn: string;
  createdDate: string;
  schedule: string;
  scheduleBn: string;
  scheduleActive: boolean;
  path: string;
  category: 'financial' | 'ledger' | 'inventory' | 'sales';
}

export default function SavedReportsPage() {
  const { isBangla } = useAppTranslation();
  const router = useRouter();

  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([
    {
      id: 'saved-monthly-sales',
      title: 'My Custom Monthly Sales Report',
      titleBn: 'কাস্টম মাসিক বিক্রয় রিপোর্ট',
      baseReport: 'Sales Report',
      baseReportBn: 'বিক্রয় রিপোর্ট',
      filters: 'Branch: Dhaka, Period: Last 30 Days',
      filtersBn: 'শাখা: ঢাকা, সময়কাল: শেষ ৩০ দিন',
      createdDate: '2026-08-01',
      schedule: 'Weekly (Sunday 9 AM)',
      scheduleBn: 'সাপ্তাহিক (রবিবার সকাল ৯টা)',
      scheduleActive: true,
      path: '/reports/sales',
      category: 'sales',
    },
    {
      id: 'saved-q2-finance',
      title: 'Q2 Financial Overview',
      titleBn: 'দ্বিতীয় প্রান্তিকের আর্থিক ওভারভিউ',
      baseReport: 'Profit & Loss Statement',
      baseReportBn: 'লাভ ও ক্ষতি বিবরণী',
      filters: 'Branch: All, Period: Q2 (Apr-Jun)',
      filtersBn: 'শাখা: সব, সময়কাল: ২য় প্রান্তিক (এপ্রিল-জুন)',
      createdDate: '2026-07-15',
      schedule: 'None',
      scheduleBn: 'কোনোটিই নয়',
      scheduleActive: false,
      path: '/finance/reports/profit-loss',
      category: 'financial',
    },
    {
      id: 'saved-dead-stock',
      title: 'Dead Stock Alert List',
      titleBn: 'অচল পণ্য অ্যালার্ট তালিকা',
      baseReport: 'Inventory Stock Report',
      baseReportBn: 'ইনভেন্টরি স্টক রিপোর্ট',
      filters: 'Category: Footwear, Movement: < 10%',
      filtersBn: 'ক্যাটাগরি: জুতো, গতিশীলতা: < ১০%',
      createdDate: '2026-07-28',
      schedule: 'Monthly (1st Day 10 AM)',
      scheduleBn: 'মাসিক (১ম দিন সকাল ১০টা)',
      scheduleActive: true,
      path: '/reports/stock',
      category: 'inventory',
    },
  ]);

  // Form Fields for New Preset
  const [newTitle, setNewTitle] = useState('');
  const [newBaseReport, setNewBaseReport] = useState('profit-loss');
  const [newFilters, setNewFilters] = useState('');
  const [newSchedule, setNewSchedule] = useState('none');

  // Stats calculation
  const totalPresets = savedReports.length;
  const activeSchedules = savedReports.filter((r) => r.scheduleActive).length;

  // Handles adding a new preset
  const handleCreatePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let path = '/finance/reports/profit-loss';
    let baseReport = 'Profit & Loss Statement';
    let baseReportBn = 'লাভ ও ক্ষতি বিবরণী';
    let category: 'financial' | 'ledger' | 'inventory' | 'sales' = 'financial';

    if (newBaseReport === 'balance-sheet') {
      path = '/finance/reports/balance-sheet';
      baseReport = 'Balance Sheet';
      baseReportBn = 'ব্যালেন্স শীট';
    } else if (newBaseReport === 'sales') {
      path = '/reports/sales';
      baseReport = 'Sales Report';
      baseReportBn = 'বিক্রয় রিপোর্ট';
      category = 'sales';
    } else if (newBaseReport === 'stock') {
      path = '/reports/stock';
      baseReport = 'Inventory Stock Report';
      baseReportBn = 'ইনভেন্টরি স্টক রিপোর্ট';
      category = 'inventory';
    }

    let scheduleLabel = 'None';
    let scheduleLabelBn = 'কোনোটিই নয়';
    if (newSchedule === 'daily') {
      scheduleLabel = 'Daily (8 AM)';
      scheduleLabelBn = 'দৈনিক (সকাল ৮টা)';
    } else if (newSchedule === 'weekly') {
      scheduleLabel = 'Weekly (Monday 9 AM)';
      scheduleLabelBn = 'সাপ্তাহিক (সোমবার সকাল ৯টা)';
    } else if (newSchedule === 'monthly') {
      scheduleLabel = 'Monthly (1st Day)';
      scheduleLabelBn = 'মাসিক (১ম দিন)';
    }

    const newPreset: SavedReport = {
      id: `saved-${Date.now()}`,
      title: newTitle,
      titleBn: newTitle,
      baseReport,
      baseReportBn,
      filters: newFilters || 'Branch: All',
      filtersBn: newFilters || 'শাখা: সব',
      createdDate: new Date().toISOString().split('T')[0],
      schedule: scheduleLabel,
      scheduleBn: scheduleLabelBn,
      scheduleActive: newSchedule !== 'none',
      path,
      category,
    };

    setSavedReports([newPreset, ...savedReports]);
    setIsModalOpen(false);
    // Reset Form
    setNewTitle('');
    setNewFilters('');
    setNewSchedule('none');
  };

  const handleToggleSchedule = (id: string) => {
    setSavedReports(
      savedReports.map((report) =>
        report.id === id ? { ...report, scheduleActive: !report.scheduleActive } : report
      )
    );
  };

  const handleDelete = (id: string) => {
    setSavedReports(savedReports.filter((report) => report.id !== id));
  };

  const handleRunReport = (path: string) => {
    router.push(path);
  };

  const handleShare = (title: string) => {
    alert(isBangla ? `"${title}" শেয়ার লিংক কপি করা হয়েছে!` : `Share link for "${title}" copied to clipboard!`);
  };

  const filteredReports = savedReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.titleBn.includes(searchTerm) ||
      report.baseReport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <FinancePageHeader
        pageName="Saved Reports"
        pageNameBn="সংরক্ষিত রিপোর্টসমূহ"
        description="Quick access to customized reports and filtered configurations saved by you."
        descriptionBn="আপনার কাস্টমাইজ করা এবং সংরক্ষণ করা রিপোর্ট কনফিগারেশনগুলোতে দ্রুত অ্যাক্সেস পান।"
        icon={Star}
        parentName="Reports"
        parentNameBn="রিপোর্ট"
        parentHref="/reports/dashboard"
      />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'মোট সংরক্ষিত কনফিগারেশন' : 'Total Saved Presets'}</p>
              <h3 className="text-xl font-bold text-foreground mt-1 font-mono">{totalPresets}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Star className="h-5 w-5 fill-indigo-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{isBangla ? 'সক্রিয় অটো-মেইল সময়সূচী' : 'Active Automated Schedules'}</p>
              <h3 className="text-xl font-bold text-foreground mt-1 font-mono">{activeSchedules}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-indigo-500/[0.02]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{isBangla ? 'রিয়েল-টাইম সিঙ্ক' : 'Cloud Sync Status'}</p>
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
                {isBangla ? 'সিঙ্ক করা হয়েছে' : 'Fully Synced'}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Settings className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Categories Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3.5 rounded-xl border border-border/50 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isBangla ? 'সংরক্ষিত রিপোর্ট খুঁজুন...' : 'Search saved presets...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex gap-1 bg-muted/40 p-1 rounded-lg w-full sm:w-auto justify-start overflow-x-auto">
            {[
              { id: 'all', label: 'All', labelBn: 'সব' },
              { id: 'financial', label: 'Financials', labelBn: 'ফাইন্যান্সিয়াল' },
              { id: 'sales', label: 'Sales', labelBn: 'বিক্রয়' },
              { id: 'inventory', label: 'Inventory', labelBn: 'স্টক' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all',
                  selectedCategory === cat.id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isBangla ? cat.labelBn : cat.label}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-2 h-9 text-xs w-full lg:w-auto">
          <Plus className="h-4 w-4" />
          {isBangla ? 'নতুন সংরক্ষিত রিপোর্ট' : 'Save New Preset'}
        </Button>
      </div>

      {/* Grid of Saved Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="border-border/50 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <CardHeader className="pb-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="outline" className="text-[10px] py-0 px-2 font-normal rounded-md mb-2 bg-muted/30">
                    {isBangla ? report.baseReportBn : report.baseReport}
                  </Badge>
                  <CardTitle className="text-sm font-bold leading-tight">
                    {isBangla ? report.titleBn : report.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1.5 font-medium text-muted-foreground flex items-center gap-1.5">
                    <Settings className="h-3 w-3 shrink-0" />
                    {isBangla ? report.filtersBn : report.filters}
                  </CardDescription>
                </div>
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="h-4.5 w-4.5" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 border-t border-border/10 p-4 space-y-4 bg-muted/[0.01]">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-muted-foreground/60">{isBangla ? 'তৈরির তারিখ:' : 'Created:'}</span>
                <span className="font-mono text-muted-foreground">{report.createdDate}</span>
              </div>

              {/* Automated dispatch schedule toggler */}
              <div className="flex justify-between items-center text-xs font-medium bg-muted/40 p-2.5 rounded-lg border border-border/20">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-foreground">
                      {isBangla ? 'ইমেইল শিডিউল' : 'Email Schedule'}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      {isBangla ? report.scheduleBn : report.schedule}
                    </p>
                  </div>
                </div>
                {report.schedule !== 'None' && report.schedule !== 'কোনোটিই নয়' && (
                  <button
                    onClick={() => handleToggleSchedule(report.id)}
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                      report.scheduleActive ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out',
                        report.scheduleActive ? 'translate-x-4' : 'translate-x-0'
                      )}
                    />
                  </button>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <Button onClick={() => handleRunReport(report.path)} className="flex-1 gap-1 text-[11px] h-8" size="sm">
                  <Play className="h-3 w-3 fill-current" />
                  {isBangla ? 'রিপোর্ট চালান' : 'Run Report'}
                </Button>
                <Button onClick={() => handleShare(report.title)} variant="outline" className="h-8 w-8 p-0" size="sm">
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
                <Button onClick={() => handleDelete(report.id)} variant="ghost" className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" size="sm">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReports.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground font-semibold">
            {isBangla ? 'কোনো সংরক্ষিত রিপোর্ট পাওয়া যায়নি।' : 'No saved presets found matching search criteria.'}
          </div>
        )}
      </div>

      {/* Save Preset Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreatePreset} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                {isBangla ? 'রিপোর্ট কনফিগারেশন সংরক্ষণ করুন' : 'Save Custom Report Preset'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'রিপোর্টের শিরোনাম' : 'Preset Title'}</label>
                <Input
                  placeholder={isBangla ? 'উদাহরণ: ১ম প্রান্তিক লাভ-ক্ষতি' : 'e.g. Q1 Profit & Loss View'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'মূল রিপোর্ট টাইপ' : 'Base Report Type'}</label>
                <select
                  value={newBaseReport}
                  onChange={(e) => setNewBaseReport(e.target.value)}
                  className="w-full h-9 rounded-lg border bg-background px-3 text-xs font-semibold focus:outline-none"
                >
                  <option value="profit-loss">{isBangla ? 'লাভ ও ক্ষতি বিবরণী' : 'Profit & Loss Statement'}</option>
                  <option value="balance-sheet">{isBangla ? 'ব্যালেন্স শীট' : 'Balance Sheet'}</option>
                  <option value="sales">{isBangla ? 'বিক্রয় রিপোর্ট' : 'Sales Report'}</option>
                  <option value="stock">{isBangla ? 'স্টক ইনভেন্টরি রিপোর্ট' : 'Inventory Stock Report'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'ফিল্টারসমূহ (ঐচ্ছিক)' : 'Filters Narrative (Optional)'}</label>
                <Input
                  placeholder={isBangla ? 'উদাহরণ: শাখা: ঢাকা, সময়: ৩০ দিন' : 'e.g. Branch: Dhaka, Date: 30 Days'}
                  value={newFilters}
                  onChange={(e) => setNewFilters(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">{isBangla ? 'স্বয়ংক্রিয় ইমেল প্রেরণের সময়সূচী' : 'Automated Email Schedule'}</label>
                <select
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  className="w-full h-9 rounded-lg border bg-background px-3 text-xs font-semibold focus:outline-none"
                >
                  <option value="none">{isBangla ? 'কোনোটিই নয়' : 'None'}</option>
                  <option value="daily">{isBangla ? 'দৈনিক' : 'Daily'}</option>
                  <option value="weekly">{isBangla ? 'সাপ্তাহিক' : 'Weekly'}</option>
                  <option value="monthly">{isBangla ? 'মাসিক' : 'Monthly'}</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs h-9">
                {isBangla ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button type="submit" className="text-xs h-9">
                {isBangla ? 'সংরক্ষণ করুন' : 'Save Config'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
