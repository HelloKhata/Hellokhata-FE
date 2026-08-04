'use client';

import React, { useState } from 'react';
import { useRoles } from '@/hooks/useRoles';
import { usePermissions } from '@/hooks/usePermissions';
import { Role } from '@/types/role';

import { SummaryCards } from './components/SummaryCards';
import { SearchBar } from './components/SearchBar';
import { ModuleFilter } from './components/ModuleFilter';
import { RoleTable } from './components/RoleTable';
import { MobileAccordion } from './components/MobileAccordion';
import { RoleDrawer } from './components/RoleDrawer';
import { StickySaveBar } from './components/StickySaveBar';

import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { Shield, RotateCcw, Save, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function HrmRolesPermissionsPage() {
  const { roles, isLoading: isRolesLoading } = useRoles();
  const {
    permissions,
    filteredPermissions,
    currentMatrix,
    isDirty,
    isLoading: isPermissionsLoading,
    isError,
    isSaving,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    updatePermission,
    saveChanges,
    discardChanges,
    resetChangesToDefault,
    refetch,
  } = usePermissions();

  const [selectedRoleForDrawer, setSelectedRoleForDrawer] = useState<Role | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const isLoading = isRolesLoading || isPermissionsLoading;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  if (isError) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 border border-border/60 rounded-2xl bg-card text-center space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-md">
          <h3 className="text-base font-semibold text-foreground">
            Unable to load permissions
          </h3>
          <p className="text-xs text-muted-foreground">
            An error occurred while communicating with the ERP permission server. Please verify your connection and try again.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          size="sm"
          className="rounded-xl h-9 px-4 gap-2 text-xs font-medium"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header & Breadcrumbs */}
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/hrm/employees" className="hover:text-primary">
                HRM
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Roles & Permissions
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary shrink-0" />
              Roles & Permissions
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage access permissions for predefined ERP roles across all modules.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowResetModal(true)}
              disabled={isSaving}
              className="h-9 px-3 text-xs rounded-xl font-medium border-border/70 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
              Reset Changes
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={saveChanges}
              disabled={!isDirty || isSaving}
              className="h-9 px-4 text-xs rounded-xl font-semibold bg-primary text-primary-foreground gap-1.5 shadow-2xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <SummaryCards
        totalRoles={roles.length}
        protectedRoles={roles.filter((r) => r.isProtected).length}
        permissionAreas={permissions.length}
        lastUpdated="Today, 10:45 AM"
        isLoading={isLoading}
      />

      {/* Search & Module Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/60 shadow-2xs">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <ModuleFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Permission Matrix (Desktop & Tablet Table) */}
      <div className="hidden md:block">
        <RoleTable
          roles={roles}
          permissions={filteredPermissions}
          matrixState={currentMatrix}
          isLoading={isLoading}
          onUpdatePermission={updatePermission}
          onSelectRole={(role) => setSelectedRoleForDrawer(role)}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Permission Matrix (Mobile Accordion Cards) */}
      <div className="block md:hidden">
        <MobileAccordion
          roles={roles}
          permissions={filteredPermissions}
          matrixState={currentMatrix}
          onUpdatePermission={updatePermission}
          onSelectRole={(role) => setSelectedRoleForDrawer(role)}
        />
      </div>

      {/* Role Information Drawer */}
      <RoleDrawer
        role={selectedRoleForDrawer}
        isOpen={!!selectedRoleForDrawer}
        onClose={() => setSelectedRoleForDrawer(null)}
        permissions={permissions}
        matrixState={currentMatrix}
      />

      {/* Sticky Save Bar */}
      <StickySaveBar
        isVisible={isDirty}
        isSaving={isSaving}
        onSave={saveChanges}
        onDiscard={discardChanges}
      />

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetModal} onOpenChange={setShowResetModal}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">
              Reset all changes?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              This will restore all permission access levels back to initial system defaults. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 pt-2">
            <AlertDialogCancel className="h-9 text-xs rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowResetModal(false);
                resetChangesToDefault();
              }}
              className="h-9 text-xs font-medium bg-amber-600 text-white hover:bg-amber-700 rounded-xl"
            >
              Reset to Defaults
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
