import React from 'react';
import { Role, AccessScope } from '@/types/role';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building2, MapPin, Store, FileText, Database } from 'lucide-react';

interface AccessScopePanelProps {
  role: Role;
  onChange: (scope: AccessScope) => void;
  disabled?: boolean;
}

const SCOPE_OPTIONS = [
  { value: 'entire_company', label: 'Entire Company', icon: Building2, desc: 'Access data across all branches and warehouses.' },
  { value: 'selected_branches', label: 'Selected Branches', icon: MapPin, desc: 'Access data only for specific branches.' },
  { value: 'own_branch_only', label: 'Own Branch Only', icon: Store, desc: 'Access data only for the branch the user is assigned to.' },
  { value: 'selected_warehouses', label: 'Selected Warehouses', icon: Database, desc: 'Access data only for specific warehouses.' },
  { value: 'own_records_only', label: 'Own Records Only', icon: FileText, desc: 'User can only see and edit data they created.' },
] as const;

export function AccessScopePanel({ role, onChange, disabled }: AccessScopePanelProps) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">Data Access Scope</h3>
        <p className="text-xs text-muted-foreground mt-1">Determine where this role can operate and view data.</p>
      </div>

      <RadioGroup 
        value={role.scope || 'entire_company'} 
        onValueChange={(val) => onChange(val as AccessScope)}
        disabled={disabled}
        className="gap-3"
      >
        {SCOPE_OPTIONS.map((opt) => (
          <div key={opt.value} className="flex items-start space-x-3 space-y-0 p-3 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors">
            <RadioGroupItem value={opt.value} id={`scope-${opt.value}`} className="mt-1" />
            <div className="grid gap-1.5 flex-1 cursor-pointer">
              <Label htmlFor={`scope-${opt.value}`} className="font-medium cursor-pointer flex items-center gap-2">
                <opt.icon className="w-4 h-4 text-muted-foreground" />
                {opt.label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {opt.desc}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
