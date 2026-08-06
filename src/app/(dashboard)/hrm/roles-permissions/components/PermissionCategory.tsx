import React, { useState } from 'react';
import { PermissionRow, ActionType, GranularPermissionsState } from '@/types/permission';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PermissionCategoryProps {
  category: string;
  rows: PermissionRow[];
  roleCode: string;
  matrixState: GranularPermissionsState;
  onUpdate: (permissionId: string, action: ActionType, isAllowed: boolean) => void;
  isProtected: boolean;
}

const ACTION_LABELS: Record<ActionType, string> = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  approve: 'Approve',
  export: 'Export',
  print: 'Print',
  import: 'Import'
};

export function PermissionCategory({ category, rows, roleCode, matrixState, onUpdate, isProtected }: PermissionCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card transition-all">
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
        className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-md bg-background shadow-xs border border-border/50 text-muted-foreground">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          <span className="font-medium text-sm text-foreground">{category}</span>
          <Badge count={rows.length} />
        </div>
      </div>

      {isExpanded && (
        <div className="divide-y divide-border/40">
          {rows.map((row) => {
            const currentActions = matrixState[row.id]?.[roleCode] || [];
            return (
              <div key={row.id} className="p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{row.feature}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs">
                          {row.description}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{row.description}</p>
                </div>
                
                <div className="shrink-0">
                  <ToggleGroup 
                    type="multiple" 
                    value={currentActions}
                    onValueChange={(values) => {
                      // We need to calculate diff since ToggleGroup gives us the new array of strings.
                      // Or better, just handle individual toggles if we want strict control. 
                      // ToggleGroup allows us to manage it entirely, but we have an onUpdate that takes a single action.
                      // Let's implement individual buttons instead to exactly match requirements.
                    }}
                    className="justify-start xl:justify-end gap-1 flex-wrap"
                  >
                    {(row.availableActions || []).map((action) => {
                      const isAllowed = currentActions.includes(action);
                      return (
                        <button
                          key={action}
                          disabled={isProtected}
                          onClick={() => onUpdate(row.id, action, !isAllowed)}
                          className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                            isAllowed 
                              ? "bg-primary text-primary-foreground border-primary shadow-2xs" 
                              : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {ACTION_LABELS[action]}
                        </button>
                      );
                    })}
                  </ToggleGroup>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center justify-center bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
      {count}
    </span>
  );
}
