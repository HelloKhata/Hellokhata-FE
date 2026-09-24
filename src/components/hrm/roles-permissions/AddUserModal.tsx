// Hello Khata OS - Add User Modal Component
// হ্যালো খাতা - নতুন কর্মী যোগ ও অ্যাক্সেস নির্ধারণ মডাল

'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { HRM_BRANCHES } from '@/components/hrm/mock-data';
import { cn } from '@/lib/utils';
import type { BaseRoleDefinition, UserAccessProfile } from './types';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baseRoles: BaseRoleDefinition[];
  onUserCreated: (user: UserAccessProfile) => void;
}

export function AddUserModal({
  open,
  onOpenChange,
  baseRoles,
  onUserCreated,
}: AddUserModalProps) {
  const { isBangla } = useAppTranslation();

  const [newUserData, setNewUserData] = useState<Partial<UserAccessProfile>>({
    name: '',
    email: '',
    phone: '',
    department: 'Sales',
    designation: 'Sales Executive',
    baseRoleId: 'role-sales-person',
    branchScopeMode: 'selected',
    allowedBranchIds: ['branch-1'],
    dataScope: 'own_records',
    isFullSystemAccess: false,
    customGrantedPermissions: [],
    customRevokedPermissions: [],
    status: 'active',
  });

  useEffect(() => {
    if (open) {
      setNewUserData({
        name: '',
        email: '',
        phone: '',
        department: 'Sales',
        designation: 'Sales Executive',
        baseRoleId: baseRoles[0]?.id || 'role-sales-person',
        branchScopeMode: 'selected',
        allowedBranchIds: [HRM_BRANCHES[0]?.id || 'branch-1'],
        dataScope: 'own_records',
        isFullSystemAccess: false,
        customGrantedPermissions: [],
        customRevokedPermissions: [],
        status: 'active',
      });
    }
  }, [open, baseRoles]);

  const handleSubmit = () => {
    if (!newUserData.name?.trim() || !newUserData.email?.trim()) {
      toast.error(isBangla ? 'নাম ও ইমেইল আবশ্যক।' : 'Name and Email are required.');
      return;
    }

    const createdUser: UserAccessProfile = {
      id: `u-${Date.now()}`,
      userId: `usr-${Date.now()}`,
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newUserData.name.trim(),
      nameBn: newUserData.name.trim(),
      email: newUserData.email.trim(),
      phone: newUserData.phone?.trim() || '01700-000000',
      department: newUserData.department || 'Sales',
      designation: newUserData.designation || 'Staff',
      status: 'active',
      isOwner: false,
      isFullSystemAccess: !!newUserData.isFullSystemAccess,
      baseRoleId: newUserData.baseRoleId || baseRoles[0]?.id || 'role-sales-person',
      accessLevel: newUserData.isFullSystemAccess ? 'full_system' : 'custom_access',
      branchScopeMode: newUserData.branchScopeMode || 'selected',
      allowedBranchIds: newUserData.allowedBranchIds || ['branch-1'],
      dataScope: newUserData.dataScope || 'own_records',
      customGrantedPermissions: newUserData.customGrantedPermissions || [],
      customRevokedPermissions: [],
      lastActive: 'Never',
      updatedAt: 'Just now',
      updatedBy: 'Sweet Ali',
    };

    onUserCreated(createdUser);
    onOpenChange(false);
    toast.success(
      isBangla
        ? `নতুন কর্মী ${createdUser.name} তৈরি ও প্রবেশাধিকার সেট করা হয়েছে!`
        : `User ${createdUser.name} created and access permissions assigned!`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl bg-card border-border p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-bold">
            <UserPlus className="w-5 h-5 text-primary" />
            <span>{isBangla ? 'নতুন ব্যবহারকারী যোগ ও প্রবেশাধিকার নির্ধারণ' : 'Add User & Assign Access'}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isBangla
              ? 'কর্মচারীর তথ্য দিন, বেস রোল ও শাখা নির্বাচন করে সহজে অ্যাক্সেস বরাদ্দ করুন।'
              : 'Enter employee profile details, choose a base role template, and select assigned branches.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold">{isBangla ? 'নাম (Full Name)' : 'Full Name'} *</Label>
              <Input
                placeholder="e.g. Rahim Sheikh"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                className="mt-1 h-9 text-xs rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">{isBangla ? 'ইমেইল (Email Address)' : 'Email Address'} *</Label>
              <Input
                placeholder="e.g. rahim@hellokhata.com"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                className="mt-1 h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold">{isBangla ? 'ফোন নম্বর' : 'Phone Number'}</Label>
              <Input
                placeholder="01700-000000"
                value={newUserData.phone}
                onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                className="mt-1 h-9 text-xs rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">{isBangla ? 'পদবী (Designation)' : 'Designation'}</Label>
              <Input
                placeholder="e.g. Sales Executive"
                value={newUserData.designation}
                onChange={(e) => setNewUserData({ ...newUserData, designation: e.target.value })}
                className="mt-1 h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">{isBangla ? 'বেস রোল টেমপ্লেট' : 'Base Role Template'}</Label>
            <select
              value={newUserData.baseRoleId}
              onChange={(e) => setNewUserData({ ...newUserData, baseRoleId: e.target.value })}
              className="w-full mt-1 h-9 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground cursor-pointer focus:outline-none"
            >
              {baseRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {isBangla ? r.nameBn : r.name} ({r.permissionIds.length} Permissions)
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-xs font-semibold mb-1.5 block">{isBangla ? 'শাখা বরাদ্দ (Branch Allocation)' : 'Branch Allocation'}</Label>
            <div className="grid grid-cols-2 gap-2">
              {HRM_BRANCHES.map((b) => {
                const isChecked = newUserData.allowedBranchIds?.includes(b.id);
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      const current = newUserData.allowedBranchIds || [];
                      const updated = isChecked ? current.filter((id) => id !== b.id) : [...current, b.id];
                      setNewUserData({ ...newUserData, allowedBranchIds: updated.length ? updated : [b.id] });
                    }}
                    className={cn(
                      'p-2.5 rounded-xl border flex items-center justify-between cursor-pointer select-none text-xs',
                      isChecked ? 'bg-primary/10 border-primary/40 text-foreground font-bold' : 'bg-muted/20 border-border text-muted-foreground'
                    )}
                  >
                    <span>{b.name}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-primary" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl text-xs cursor-pointer">
            {isBangla ? 'বাতিল' : 'Cancel'}
          </Button>
          <Button onClick={handleSubmit} className="rounded-xl bg-primary text-primary-foreground font-bold text-xs cursor-pointer">
            {isBangla ? 'ব্যবহারকারী তৈরি করুন' : 'Create & Assign Access'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
