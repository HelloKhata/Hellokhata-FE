import React, { useMemo, useState } from 'react';
import { Role } from '@/types/role';
import { PermissionRow, GranularPermissionsState, ModuleCategory } from '@/types/permission';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Edit2, ShieldAlert, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PermissionCategory } from './PermissionCategory';
import { Input } from '@/components/ui/input';

interface RoleDetailsPanelProps {
  role: Role;
  permissions: PermissionRow[];
  matrixState: GranularPermissionsState;
  onUpdatePermission: (permissionId: string, action: any, isAllowed: boolean) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function RoleDetailsPanel({ 
  role, 
  permissions, 
  matrixState,
  onUpdatePermission,
  onDuplicate,
  onDelete
}: RoleDetailsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, PermissionRow[]> = {};
    permissions.forEach(p => {
      if (!groups[p.category]) {
        groups[p.category] = [];
      }
      
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          p.feature.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        ) {
          groups[p.category].push(p);
        }
      } else {
        groups[p.category].push(p);
      }
    });
    return groups;
  }, [permissions, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/60 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold text-foreground">{role.name}</h2>
            {role.isProtected && (
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30 gap-1 rounded-full px-2">
                <ShieldAlert className="w-3 h-3" />
                Protected
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {role.description}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg" onClick={onDuplicate}>
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            Duplicate
          </Button>
          {!role.isProtected && (
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={onDelete}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Assigned Users Summary (Mini) */}
      <div className="px-6 py-4 border-b border-border/60 bg-muted/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-foreground">Assigned Users</div>
          <div className="flex -space-x-2">
            {[...Array(Math.min(role.employeeCount, 5))].map((_, i) => (
              <Avatar key={i} className="w-8 h-8 border-2 border-background">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">U{i+1}</AvatarFallback>
              </Avatar>
            ))}
            {role.employeeCount > 5 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background z-10">
                +{role.employeeCount - 5}
              </div>
            )}
            {role.employeeCount === 0 && (
              <span className="text-xs text-muted-foreground ml-2">No users assigned</span>
            )}
          </div>
        </div>
        <Button variant="link" size="sm" className="text-xs h-auto p-0">View Directory</Button>
      </div>

      {/* Permissions Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-semibold">Module Permissions</h3>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search permissions..." 
              className="pl-8 h-8 rounded-lg text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(groupedPermissions).map(([category, rows]) => {
            if (rows.length === 0) return null;
            return (
              <PermissionCategory 
                key={category} 
                category={category} 
                rows={rows} 
                roleCode={role.code}
                matrixState={matrixState}
                onUpdate={onUpdatePermission}
                isProtected={role.isProtected}
              />
            );
          })}
          
          {Object.values(groupedPermissions).every(rows => rows.length === 0) && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No permissions match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
