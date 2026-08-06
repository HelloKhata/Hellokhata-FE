import React from 'react';
import { Role } from '@/types/role';
import { Shield, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleSidebarProps {
  roles: Role[];
  selectedRole: Role | null;
  onSelectRole: (role: Role) => void;
}

export function RoleSidebar({ roles, selectedRole, onSelectRole }: RoleSidebarProps) {
  return (
    <aside className="bg-card border border-border rounded-[14px] overflow-hidden sticky top-20 max-h-[calc(100vh-96px)] flex flex-col shadow-sm">
      <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-border text-[13px] font-semibold text-muted-foreground">
        <span><span className="tabular-nums text-foreground font-bold">{roles.length}</span> roles</span>
      </div>
      
      <ul className="list-none overflow-y-auto p-2 flex flex-col gap-0.5">
        {roles.map(role => {
          const isSelected = selectedRole?.id === role.id;
          
          return (
            <li key={role.id}>
              <button
                onClick={() => onSelectRole(role)}
                className={cn(
                  "w-full flex items-center gap-2.5 text-left px-2.5 py-[9px] rounded-[9px] border border-transparent transition-colors relative group",
                  isSelected 
                    ? "bg-primary/10 border-primary/30" 
                    : "hover:bg-secondary/50"
                )}
              >
                {isSelected && (
                  <span className="absolute -left-px top-[9px] bottom-[9px] w-[3px] rounded-[3px] bg-primary" />
                )}
                
                <div className={cn(
                  "w-[34px] h-[34px] rounded-[9px] flex-none grid place-items-center border",
                  isSelected 
                    ? "bg-primary/10 text-primary border-primary/20" 
                    : "bg-secondary text-muted-foreground border-border group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/10"
                )}>
                  {role.isProtected ? <ShieldCheck className="w-[17px] h-[17px]" /> : <Shield className="w-[17px] h-[17px]" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <span className="font-[650] text-[13.5px] block tracking-[-0.01em] text-foreground truncate">
                    {role.name}
                  </span>
                  <span className="text-[12px] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis block">
                    {role.description}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 flex-none">
                  <span className="tabular-nums text-[12px] text-muted-foreground bg-secondary/50 border border-border px-1.5 py-px rounded-full">
                    {role.employeeCount}
                  </span>
                  <div className={cn(
                    "w-[7px] h-[7px] rounded-full",
                    role.status === 'active' ? "bg-emerald-500" : "bg-border"
                  )} />
                </div>
              </button>
            </li>
          );
        })}
        {roles.length === 0 && (
          <div className="p-6 text-center text-muted-foreground text-[13px]">
            No roles found.
          </div>
        )}
      </ul>
    </aside>
  );
}
