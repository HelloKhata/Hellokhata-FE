import React, { useState } from 'react';
import { Role } from '@/types/role';
import { PermissionRow, GranularPermissionsState } from '@/types/permission';
import { StatusBadge } from '../Shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Shield, Copy, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OverviewTab } from './OverviewTab';
import { PermissionsTab } from './PermissionsTab';
import { RestrictionsTab } from './RestrictionsTab';
import { UsersTab } from './UsersTab';

interface RoleDetailsProps {
  role: Role;
  permissions: PermissionRow[];
  matrixState: GranularPermissionsState;
  onUpdatePermission: (permissionId: string, action: any, isAllowed: boolean) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export function RoleDetails({
  role,
  permissions,
  matrixState,
  onUpdatePermission,
  onDuplicate,
  onDelete,
  onEdit
}: RoleDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'restrictions' | 'users' | 'activity'>('overview');

  return (
    <div className="flex-1 min-w-0">
      {/* Hero Section */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex gap-3.5 min-w-0">
          <div className="w-[44px] h-[44px] rounded-[11px] flex-none grid place-items-center bg-primary/10 text-primary border border-primary/20">
             {role.isProtected ? <ShieldCheck className="w-[22px] h-[22px]" /> : <Shield className="w-[22px] h-[22px]" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-[clamp(18px,1.8vw,21px)] font-bold tracking-[-0.025em]">{role.name}</h2>
              {role.status === 'active' && <StatusBadge status="active">Active</StatusBadge>}
              {role.status === 'inactive' && <StatusBadge status="inactive">Inactive</StatusBadge>}
              {role.isSystem && <StatusBadge status="system">System Role</StatusBadge>}
            </div>
            <p className="text-muted-foreground mt-1 max-w-[560px] text-[13.5px]">{role.description}</p>
            <div className="mt-2 text-[12.5px] text-muted-foreground tabular-nums">
              Assigned to {role.employeeCount} {role.employeeCount === 1 ? 'user' : 'users'}
              <span className="mx-2 text-border">·</span>
              Last updated {role.updatedAt || 'Recently'}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="sm" className="h-9 gap-1.5" onClick={onDuplicate}>
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Duplicate</span>
          </Button>
          {!role.isProtected && (
            <>
              <Button variant="ghost" size="sm" className="h-9 gap-1.5" onClick={onEdit}>
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-[2px] border-b border-border mt-6 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'permissions', label: 'Permissions' },
          { id: 'restrictions', label: 'Restrictions' },
          { id: 'users', label: 'Users' },
          { id: 'activity', label: 'Activity' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-1 py-[11px] mr-5 text-[13.5px] font-semibold border-b-2 mb-[-1px] whitespace-nowrap transition-colors",
              activeTab === tab.id 
                ? "text-foreground border-primary" 
                : "text-muted-foreground border-transparent hover:text-foreground/80"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="pt-6 pb-4">
        {activeTab === 'overview' && <OverviewTab role={role} permissions={permissions} matrixState={matrixState} />}
        {activeTab === 'permissions' && (
          <PermissionsTab 
            role={role} 
            permissions={permissions} 
            matrixState={matrixState} 
            onUpdatePermission={onUpdatePermission} 
          />
        )}
        {activeTab === 'restrictions' && <RestrictionsTab role={role} />}
        {activeTab === 'users' && <UsersTab role={role} />}
        {activeTab === 'activity' && (
          <div className="text-center p-8 text-muted-foreground text-[13px]">
            Activity logs for this role will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
