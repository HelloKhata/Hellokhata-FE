import React, { useState } from 'react';
import { Role, AccessScope } from '@/types/role';
import { Building2, MapPin, Store, FileText, Database, Settings2, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const SCOPE_OPTIONS = [
  { value: 'entire_company', label: 'Entire Company', icon: Building2, desc: 'Access data across all branches and warehouses.' },
  { value: 'selected_branches', label: 'Selected Branches', icon: MapPin, desc: 'Access data only for specific branches.' },
  { value: 'own_branch_only', label: 'Own Branch Only', icon: Store, desc: 'Access data only for the branch the user is assigned to.' },
  { value: 'selected_warehouses', label: 'Selected Warehouses', icon: Database, desc: 'Access data only for specific warehouses.' },
  { value: 'own_records_only', label: 'Own Records Only', icon: FileText, desc: 'User can only see and edit data they created.' },
] as const;

export function RestrictionsTab({ role }: { role: Role }) {
  const [scopeOpen, setScopeOpen] = useState(true);
  const [limitsOpen, setLimitsOpen] = useState(true);
  const [activeScope, setActiveScope] = useState<string>(role.scope || 'entire_company');
  const limits = role.limits || {};

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Access Scope Section */}
      <div className={cn("border border-border rounded-[14px] bg-card overflow-hidden", scopeOpen && "shadow-sm")}>
        <div 
          className="w-full flex items-center justify-between gap-2.5 p-[14px_18px] text-left cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => setScopeOpen(!scopeOpen)}
        >
          <div className="font-bold text-[14px] tracking-[-0.01em] flex items-center gap-2.5">
            <MapPin className="w-[15px] h-[15px] text-muted-foreground" />
            Data Access Scope
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", scopeOpen && "rotate-180")} />
        </div>
        
        {scopeOpen && (
          <div className="border-t border-border p-[16px_18px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SCOPE_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const isOn = activeScope === opt.value;
                return (
                  <label 
                    key={opt.value} 
                    className={cn(
                      "flex gap-[11px] p-[10px_12px] border rounded-[10px] cursor-pointer transition-colors",
                      isOn 
                        ? "border-primary/40 bg-primary/5" 
                        : "border-border hover:border-border/80"
                    )}
                  >
                    <input 
                      type="radio" 
                      name="scope" 
                      value={opt.value} 
                      checked={isOn}
                      onChange={(e) => setActiveScope(e.target.value)}
                      className="mt-1 accent-primary" 
                    />
                    <div>
                      <div className="text-[13.5px] font-[650] flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        {opt.label}
                      </div>
                      <div className="text-[12.5px] text-muted-foreground mt-0.5">{opt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            
            {(activeScope === 'selected_branches' || activeScope === 'selected_warehouses') && (
               <div className="mt-4 pt-4 border-t border-dashed border-border/80">
                 <div className="text-[13px] font-[650] mb-2">Select {activeScope === 'selected_branches' ? 'Branches' : 'Warehouses'}</div>
                 <div className="flex flex-wrap gap-2">
                    {/* Mock Selected Chips */}
                    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1">
                      Main Branch
                      <button className="grid place-items-center w-4 h-4 rounded-full hover:bg-primary/20 transition-colors">✕</button>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1">
                      Uttara Branch
                      <button className="grid place-items-center w-4 h-4 rounded-full hover:bg-primary/20 transition-colors">✕</button>
                    </span>
                 </div>
               </div>
            )}
          </div>
        )}
      </div>

      {/* Business Limits Section */}
      <div className={cn("border border-border rounded-[14px] bg-card overflow-hidden", limitsOpen && "shadow-sm")}>
        <div 
          className="w-full flex items-center justify-between gap-2.5 p-[14px_18px] text-left cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => setLimitsOpen(!limitsOpen)}
        >
          <div className="font-bold text-[14px] tracking-[-0.01em] flex items-center gap-2.5">
            <Settings2 className="w-[15px] h-[15px] text-muted-foreground" />
            Business Logic Limits
            <span className="text-[12px] text-muted-foreground font-medium ml-2 font-normal hidden sm:inline">Set maximum allowable values for transactions</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", limitsOpen && "rotate-180")} />
        </div>
        
        {limitsOpen && (
          <div className="border-t border-border p-[16px_18px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
              <div>
                <label className="block text-[12.5px] font-semibold text-muted-foreground mb-1.5">Max Sales Discount</label>
                <div className="flex items-center h-[38px] bg-card border border-border/80 rounded-[9px] overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <input type="number" defaultValue={limits.maxSalesDiscount} className="flex-1 w-full bg-transparent border-none outline-none h-full px-3 text-[13.5px] tabular-nums" />
                  <span className="pr-3 text-[12px] text-muted-foreground font-semibold">%</span>
                </div>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-muted-foreground mb-1.5">Max Invoice Amount</label>
                <div className="flex items-center h-[38px] bg-card border border-border/80 rounded-[9px] overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <input type="number" defaultValue={limits.maxInvoiceAmount} className="flex-1 w-full bg-transparent border-none outline-none h-full px-3 text-[13.5px] tabular-nums" />
                  <span className="pr-3 text-[12px] text-muted-foreground font-semibold">BDT</span>
                </div>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-muted-foreground mb-1.5">Backdate Entry Limit</label>
                <div className="flex items-center h-[38px] bg-card border border-border/80 rounded-[9px] overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <input type="number" defaultValue={limits.backdateLimitDays} className="flex-1 w-full bg-transparent border-none outline-none h-full px-3 text-[13.5px] tabular-nums" />
                  <span className="pr-3 text-[12px] text-muted-foreground font-semibold">Days</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-border/80 space-y-1">
              <div className="flex items-center justify-between gap-3 py-[9px] border-b border-dashed border-border/60 last:border-0">
                <div>
                  <div className="text-[13.5px] font-semibold">Allow Deletion of Approved Records</div>
                  <div className="text-[12px] text-muted-foreground">User can delete records even after manager approval</div>
                </div>
                <Switch defaultChecked={false} />
              </div>
              <div className="flex items-center justify-between gap-3 py-[9px] border-b border-dashed border-border/60 last:border-0">
                <div>
                  <div className="text-[13.5px] font-semibold">Require OTP for Export</div>
                  <div className="text-[12px] text-muted-foreground">Mandatory 2FA verification when exporting data</div>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
