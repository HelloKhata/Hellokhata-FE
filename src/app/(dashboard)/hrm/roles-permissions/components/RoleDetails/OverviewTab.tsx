import React from 'react';
import { Box, Database, Settings, Activity, CheckCircle2 } from 'lucide-react';

export function OverviewTab({ role, permissions, matrixState }: any) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Summary Box */}
      <div className="p-[13px_16px] border border-dashed border-border/80 rounded-[10px] bg-secondary/30 flex items-center gap-2.5 flex-wrap">
        <span className="text-[12px] text-muted-foreground font-semibold">CAPABILITIES:</span>
        <div className="flex gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-card border border-border rounded-full px-2.5 py-1 text-foreground tabular-nums shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Accounting
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-card border border-border rounded-full px-2.5 py-1 text-foreground tabular-nums shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Inventory
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-card border border-border rounded-full px-2.5 py-1 text-foreground tabular-nums shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Reports
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-4 items-start">
        {/* Access Distribution */}
        <div className="border border-border rounded-[14px] bg-card p-[18px_20px] shadow-sm">
          <div className="flex items-center justify-between gap-2.5 mb-4">
            <h3 className="text-[14px] font-bold tracking-[-0.01em]">Access Distribution</h3>
          </div>
          
          <div className="space-y-0">
            {[
              { name: 'Core Modules', icon: Box, val: 85 },
              { name: 'Finance & Accounts', icon: Database, val: 60 },
              { name: 'Administration', icon: Settings, val: 20 },
              { name: 'Reports & Analytics', icon: Activity, val: 100 },
            ].map(item => (
              <div key={item.name} className="flex items-center gap-2.5 py-2 border-b border-border last:border-0">
                <div className="flex-none w-[130px] text-[13px] font-semibold flex items-center gap-2 text-foreground">
                  <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70" style={{ width: `${item.val}%` }} />
                </div>
                <div className="flex-none w-[30px] text-right text-[12px] text-muted-foreground tabular-nums">
                  {item.val}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Identity & Limits */}
        <div className="border border-border rounded-[14px] bg-card p-[18px_20px] shadow-sm">
          <div className="flex items-center justify-between gap-2.5 mb-4">
            <h3 className="text-[14px] font-bold tracking-[-0.01em]">Configuration Summary</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-y-[14px] gap-x-[18px]">
            <div className="col-span-2">
              <div className="text-[11.5px] text-muted-foreground font-semibold uppercase tracking-[0.04em]">Hierarchy Level</div>
              <div className="text-[13.5px] mt-0.5 font-semibold">Tier 2 - Management</div>
            </div>
            <div>
              <div className="text-[11.5px] text-muted-foreground font-semibold uppercase tracking-[0.04em]">Security Policy</div>
              <div className="text-[13.5px] mt-0.5 font-semibold">Standard</div>
            </div>
            <div>
              <div className="text-[11.5px] text-muted-foreground font-semibold uppercase tracking-[0.04em]">Access Scope</div>
              <div className="text-[13.5px] mt-0.5 font-semibold">All Branches</div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-dashed border-border/80">
             <div className="text-[11.5px] text-muted-foreground font-semibold uppercase tracking-[0.04em] mb-2">Enabled Modules</div>
             <div className="flex flex-wrap gap-2">
               <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">Sales</span>
               <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">Purchases</span>
               <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">HRM</span>
               <span className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">Payroll</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
