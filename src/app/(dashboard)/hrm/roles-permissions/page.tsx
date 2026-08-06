'use client';

import React, { useState, useEffect } from 'react';
import { useRoles } from '@/hooks/useRoles';
import { usePermissions } from '@/hooks/usePermissions';
import { Role } from '@/types/role';
import { RoleSidebar } from './components/RoleSidebar';
import { RoleDetails } from './components/RoleDetails';
import { PageHeader } from './components/PageHeader';
import { RoleTemplatesModal } from './components/RoleTemplatesModal';
import { CreateRoleWizard } from './components/CreateRoleWizard';
import { StickySaveBar } from './components/StickySaveBar';
import { Shield, Loader2 } from 'lucide-react';

export default function RolesPermissionsPage() {
  const { roles, createRole, duplicateRole, deleteRole, isLoading: isRolesLoading } = useRoles();
  const {
    permissions,
    currentMatrix,
    isDirty,
    isSaving,
    updateGranularPermission,
    saveChanges,
    discardChanges,
  } = usePermissions();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Auto-select first role on load
  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    }
  }, [roles, selectedRole]);

  const handleDuplicate = () => {
    if (selectedRole) {
      const newRole = duplicateRole(selectedRole);
      setSelectedRole(newRole);
    }
  };

  const handleDelete = () => {
    if (selectedRole && !selectedRole.isProtected) {
      deleteRole(selectedRole.id);
      setSelectedRole(roles[0] || null);
    }
  };

  const handleCreateWizard = (roleData: any) => {
    const newRole = createRole(roleData);
    setSelectedRole(newRole);
    setIsWizardOpen(false);
  };

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsTemplatesOpen(false);
    setIsWizardOpen(true);
  };

  if (isRolesLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredRoles = roles.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' ? true : (filter === 'active' ? r.status === 'active' : r.status !== 'active');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-[1440px] mx-auto p-[clamp(20px,3vw,36px)_clamp(16px,3vw,32px)_120px] min-h-screen">
      
      <PageHeader 
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenWizard={() => {
          setSelectedTemplate(null);
          setIsWizardOpen(true);
        }}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[292px_minmax(0,1fr)] gap-6 items-start">
        
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <RoleSidebar 
            roles={filteredRoles} 
            selectedRole={selectedRole} 
            onSelectRole={setSelectedRole} 
          />
        </div>

        {/* Right Content */}
        {selectedRole ? (
          <RoleDetails 
            role={selectedRole}
            permissions={permissions}
            matrixState={currentMatrix}
            onUpdatePermission={(id, action, isAllowed) => updateGranularPermission(id, selectedRole.code, action, isAllowed)}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onEdit={() => {}}
          />
        ) : (
          <div className="h-[400px] flex items-center justify-center bg-card rounded-[14px] border border-border">
            <div className="text-center">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No Role Selected</h3>
              <p className="text-sm text-muted-foreground mt-1">Select a role from the list to view details.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <RoleTemplatesModal 
        isOpen={isTemplatesOpen} 
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
      
      <CreateRoleWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onCreate={handleCreateWizard}
        initialTemplate={selectedTemplate}
      />

      <StickySaveBar
        isVisible={isDirty}
        isSaving={isSaving}
        onSave={saveChanges}
        onDiscard={discardChanges}
      />
    </div>
  );
}
