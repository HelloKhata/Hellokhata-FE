import React, { useState } from 'react';
import { Role, BusinessLimits } from '@/types/role';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronRight, Settings2 } from 'lucide-react';

interface BusinessLimitsPanelProps {
  role: Role;
  onChange: (limits: BusinessLimits) => void;
  disabled?: boolean;
}

export function BusinessLimitsPanel({ role, onChange, disabled }: BusinessLimitsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const limits = role.limits || {};

  const handleChange = (key: keyof BusinessLimits, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    onChange({ ...limits, [key]: numValue });
  };

  return (
    <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        role="button"
        tabIndex={0}
        className="w-full flex items-center justify-between p-6 hover:bg-muted/20 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Settings2 className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-foreground">Business Limits</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Advanced operational limits and thresholds.</p>
          </div>
        </div>
        <div className="text-muted-foreground">
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 pt-0 border-t border-border/40 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Max Discount (%)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 15" 
                value={limits.maxDiscountPercentage || ''}
                onChange={(e) => handleChange('maxDiscountPercentage', e.target.value)}
                disabled={disabled}
                className="h-9 text-sm"
              />
              <p className="text-[10px] text-muted-foreground">Maximum allowable discount this role can give.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Max Refund Amount (৳)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 5000" 
                value={limits.maxRefundAmount || ''}
                onChange={(e) => handleChange('maxRefundAmount', e.target.value)}
                disabled={disabled}
                className="h-9 text-sm"
              />
              <p className="text-[10px] text-muted-foreground">Limit for processing customer returns/refunds.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Max Credit Sale (৳)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 10000" 
                value={limits.maxCreditSale || ''}
                onChange={(e) => handleChange('maxCreditSale', e.target.value)}
                disabled={disabled}
                className="h-9 text-sm"
              />
              <p className="text-[10px] text-muted-foreground">Maximum due amount allowed on a single invoice.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Cash Drawer Limit (৳)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 50000" 
                value={limits.cashDrawerLimit || ''}
                onChange={(e) => handleChange('cashDrawerLimit', e.target.value)}
                disabled={disabled}
                className="h-9 text-sm"
              />
              <p className="text-[10px] text-muted-foreground">Maximum cash hold before requiring a safe drop.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
