'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { PermissionRow, MatrixPermissionsState, PermissionValue } from '@/types/permission';
import { Role, RoleCode } from '@/types/role';
import { PermissionCell } from './PermissionCell';
import { Lock, Info, SearchX, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface RoleTableProps {
  roles: Role[];
  permissions: PermissionRow[];
  matrixState: MatrixPermissionsState;
  isLoading?: boolean;
  onUpdatePermission: (
    permissionId: string,
    roleCode: RoleCode,
    value: PermissionValue
  ) => void;
  onSelectRole: (role: Role) => void;
  onClearFilters?: () => void;
}

const columnHelper = createColumnHelper<PermissionRow>();

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  permissions,
  matrixState,
  isLoading = false,
  onUpdatePermission,
  onSelectRole,
  onClearFilters,
}) => {
  const columns = useMemo(() => {
    const cols = [
      columnHelper.accessor('feature', {
        id: 'feature_module',
        header: () => (
          <div className="text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground px-2 py-1">
            Module & Feature
          </div>
        ),
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="space-y-0.5 max-w-[280px]">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono uppercase bg-muted/50 border-border/60 px-1.5 py-0 rounded-md shrink-0"
                >
                  {row.moduleName}
                </Badge>
                <span className="font-semibold text-xs text-foreground truncate">
                  {row.feature}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
                {row.description}
              </p>
            </div>
          );
        },
      }),
    ];

    roles.forEach((role) => {
      cols.push(
        columnHelper.display({
          id: `role_${role.code}`,
          header: () => (
            <div className="flex flex-col items-center justify-center gap-1 group py-1">
              <button
                type="button"
                onClick={() => onSelectRole(role)}
                className="flex items-center gap-1.5 hover:text-primary transition-colors text-xs font-semibold text-foreground group/btn focus:outline-none"
                title={`Click to view ${role.name} role details`}
              >
                <span>{role.name}</span>
                {role.isProtected ? (
                  <Lock className="h-3 w-3 text-amber-500 shrink-0" />
                ) : (
                  <Info className="h-3 w-3 text-muted-foreground opacity-60 group-hover/btn:opacity-100 group-hover/btn:text-primary transition-all shrink-0" />
                )}
              </button>
              <span className="text-[10px] text-muted-foreground font-normal">
                {role.employeeCount} assigned
              </span>
            </div>
          ),
          cell: (info) => {
            const rowId = info.row.original.id;
            const currentVal: PermissionValue =
              matrixState[rowId]?.[role.code] || info.row.original.rolePermissions[role.code] || 'none';

            return (
              <PermissionCell
                permissionId={rowId}
                roleCode={role.code}
                value={currentVal}
                isOwner={role.isProtected}
                onChange={(newVal) =>
                  onUpdatePermission(rowId, role.code, newVal)
                }
              />
            );
          },
        })
      );
    });

    return cols;
  }, [roles, matrixState, onUpdatePermission, onSelectRole]);

  const table = useReactTable({
    data: permissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-2xs">
        <div className="p-4 space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="border border-border/60 rounded-xl p-12 text-center bg-card shadow-2xs flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          No permissions found
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mb-4">
          No permission areas match your current search query or module filter.
        </p>
        {onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs rounded-lg gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear Search & Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-2xs relative">
      <div className="overflow-x-auto max-h-[620px] scrollbar-thin">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 z-20 bg-muted/80 backdrop-blur-xs border-b border-border/70 shadow-2xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <th
                    key={header.id}
                    className={`p-3 font-medium transition-colors ${
                      idx === 0
                        ? 'sticky left-0 z-30 bg-muted/95 border-r border-border/60 min-w-[240px] max-w-[280px]'
                        : 'text-center min-w-[140px]'
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border/50">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-muted/40 transition-colors group"
              >
                {row.getVisibleCells().map((cell, idx) => (
                  <td
                    key={cell.id}
                    className={`p-3 align-middle ${
                      idx === 0
                        ? 'sticky left-0 z-10 bg-card group-hover:bg-muted/40 border-r border-border/60'
                        : 'text-center'
                    }`}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
