import React, { useState } from 'react';
import { Role } from '@/types/role';
import { PermissionRow, GranularPermissionsState } from '@/types/permission';
import { Search, Package, Users, FileText, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ActionToggle } from '../Shared/ActionToggle';
import { Box } from 'lucide-react';

// Mock icons for modules
const MODULE_ICONS: Record<string, React.ElementType> = {
  inventory: Package,
  hrm: Users,
  sales: FileText,
  purchases: FileText,
};

export function PermissionsTab({ role, permissions, matrixState, onUpdatePermission }: any) {
  const [search, setSearch] = useState('');
  
  // Group permissions by category (assuming `permissions` array has items with `moduleName` and `category`)
  const grouped = permissions.reduce((acc: any, p: any) => {
    const mod = p.category || p.moduleName || 'System';
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(p);
    return acc;
  }, {});

  const modules = Object.keys(grouped);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search permissions..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 rounded-[9px] bg-card border-border/70"
        />
      </div>

      <div className="space-y-2">
        {modules.map((mod: string) => {
          const modPerms = grouped[mod];
          const Icon = MODULE_ICONS[mod.toLowerCase()] || Box;
          
          return (
            <PermissionGroup 
              key={mod}
              title={mod}
              icon={Icon}
              permissions={modPerms}
              matrixState={matrixState}
              onUpdatePermission={onUpdatePermission}
              search={search}
            />
          );
        })}
      </div>
    </div>
  );
}

function PermissionGroup({ title, icon: Icon, permissions, matrixState, onUpdatePermission, search }: any) {
  const [isOpen, setIsOpen] = useState(false);
  
  const filtered = permissions.filter((p: any) => 
    (p.feature || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  if (search && filtered.length === 0) return null;

  const totalActions = filtered.length * 4; // Simplified, assuming view/create/edit/delete
  let activeActions = 0;
  
  filtered.forEach((p: any) => {
    const st = matrixState[p.id];
    if (st?.view) activeActions++;
    if (st?.create) activeActions++;
    if (st?.edit) activeActions++;
    if (st?.delete) activeActions++;
  });

  const isAll = activeActions === totalActions && totalActions > 0;
  const isNone = activeActions === 0;

  return (
    <div className={cn("border border-border rounded-[10px] bg-card overflow-hidden", isOpen ? "shadow-sm" : "")}>
      <div 
        className="w-full flex items-center gap-3 p-[11px_14px] text-left transition-colors cursor-pointer hover:bg-secondary/50 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-[30px] h-[30px] rounded-lg flex-none bg-secondary text-muted-foreground grid place-items-center border border-border group-hover:bg-primary/5 group-hover:text-primary">
          <Icon className="w-[15px] h-[15px]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-[650] text-[13.5px] flex items-center gap-2">
            <span className="capitalize">{title}</span>
          </div>
          <div className="text-[11.5px] text-muted-foreground tabular-nums mt-0.5">
            {activeActions} of {totalActions} permissions active
          </div>
        </div>

        {/* Quick segment control for bulk actions */}
        <div className="hidden sm:flex bg-secondary border border-border rounded-lg p-0.5 gap-0.5" onClick={e => e.stopPropagation()}>
           <button className={cn("text-[11px] font-[650] px-2 py-1 rounded-md transition-colors", isNone ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
             None
           </button>
           <button className={cn("text-[11px] font-[650] px-2 py-1 rounded-md transition-colors", !isNone && !isAll ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
             Some
           </button>
           <button className={cn("text-[11px] font-[650] px-2 py-1 rounded-md transition-colors", isAll ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}>
             All
           </button>
        </div>

        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="border-t border-border p-[4px_14px_10px] bg-secondary/30">
          {filtered.map((p: any) => {
            const st = matrixState[p.id] || {};
            return (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-dashed border-border last:border-0">
                <div className="text-[13px] font-[550] text-foreground">
                  {p.feature}
                  {p.description && <small className="text-muted-foreground font-medium ml-2">{p.description}</small>}
                </div>
                
                <div className="flex gap-1.5 flex-wrap">
                  {['view', 'create', 'edit', 'delete'].map(act => (
                    <ActionToggle
                      key={act}
                      label={act.charAt(0).toUpperCase() + act.slice(1)}
                      isOn={st[act]}
                      onToggle={(val) => onUpdatePermission(p.id, act, val)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
