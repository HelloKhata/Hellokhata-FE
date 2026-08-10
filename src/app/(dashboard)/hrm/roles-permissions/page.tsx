// Hello Khata OS - HRM Roles & Permissions Page
// হ্যালো খাতা - এইচআরএম ভূমিকা ও অনুমতি পেজ

'use client';

import { useMemo, useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Users,
  Save,
  Lock,
  Copy,
  Crown,
  Building2,
  Warehouse,
  UserCog,
  LayoutGrid,
  Settings,
  Check,
  KeyRound,
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, Badge, Input } from '@/components/ui/premium';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { HrmPageHeader } from '@/components/hrm/shared/HrmPageHeader';
import { HrmEmptyState } from '@/components/hrm/shared/HrmEmptyState';
import { HRM_ROLES, ROLE_TEMPLATES } from '@/components/hrm/mock-data';
import type { RolePermission, PermissionFlags } from '@/components/hrm/types';
import { MODULE_KEYS, PERMISSION_ACTIONS } from '@/components/hrm/types';

const MODULE_ICONS: Record<string, { icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  Dashboard: { icon: LayoutGrid, tone: 'text-primary bg-primary-subtle' },
  Sales: { icon: UserCog, tone: 'text-emerald bg-emerald-subtle' },
  Purchases: { icon: Warehouse, tone: 'text-sky-400 bg-sky-400/10' },
  Parties: { icon: Users, tone: 'text-violet-400 bg-violet-400/10' },
  Inventory: { icon: Warehouse, tone: 'text-warning bg-warning-subtle' },
  Finance: { icon: Settings, tone: 'text-emerald bg-emerald-subtle' },
  HRM: { icon: ShieldCheck, tone: 'text-primary bg-primary-subtle' },
  Reports: { icon: LayoutGrid, tone: 'text-rose-400 bg-rose-400/10' },
  Settings: { icon: Settings, tone: 'text-warning bg-warning-subtle' },
};

export default function RolesPermissionsPage() {
  const { isBangla } = useAppTranslation();

  const [roles, setRoles] = useState<RolePermission[]>(HRM_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-hr');
  const [tab, setTab] = useState<'permissions' | 'restrictions'>('permissions');
  const [addOpen, setAddOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) ?? roles[0] ?? HRM_ROLES[0],
    [roles, selectedRoleId]
  );

  const togglePermission = (moduleKey: string, action: keyof PermissionFlags) => {
    if (selectedRole.isSystem && selectedRole.id === 'role-admin') {
      toast.info(isBangla ? 'অ্যাডমিন ভূমিকা সম্পাদনাযোগ্য নয়' : 'The Administrator role is not editable');
      return;
    }
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRole.id) return r;
        const modules = { ...r.modules };
        const current: PermissionFlags = { ...modules[moduleKey] };
        current[action] = !current[action];
        modules[moduleKey] = current;
        return { ...r, modules };
      })
    );
  };

  const setModuleAll = (moduleKey: string, value: boolean) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRole.id) return r;
        const modules = { ...r.modules };
        const flags = { ...modules[moduleKey] };
        PERMISSION_ACTIONS.forEach((a) => {
          flags[a.key] = value;
        });
        modules[moduleKey] = flags;
        return { ...r, modules };
      })
    );
  };

  const handleAddRole = () => {
    const name = newRoleName.trim();
    if (!name) {
      toast.error(isBangla ? 'ভূমিকার নাম লিখুন' : 'Please enter a role name');
      return;
    }
    const id = `role-${Date.now()}`;
    const modules: Record<string, PermissionFlags> = {};
    MODULE_KEYS.forEach((m) => {
      modules[m] = { view: true, create: false, edit: false, delete: false, approve: false, export: false };
    });
    setRoles((prev) => [
      ...prev,
      { id, name, description: isBangla ? 'কাস্টম ভূমিকা' : 'Custom role', employees: 0, modules },
    ]);
    setSelectedRoleId(id);
    setAddOpen(false);
    setNewRoleName('');
    toast.success(isBangla ? 'নতুন ভূমিকা তৈরি হয়েছে' : 'Role created');
  };

  const applyTemplate = (tmplId: string) => {
    setRoles((prev) => {
      const modules: Record<string, PermissionFlags> = {};
      MODULE_KEYS.forEach((m) => {
        modules[m] = {
          view: true,
          create: tmplId === 'tmpl-owner',
          edit: tmplId === 'tmpl-owner',
          delete: tmplId === 'tmpl-owner',
          approve: tmplId === 'tmpl-owner',
          export: tmplId !== 'tmpl-cashier',
        };
      });
      const name = ROLE_TEMPLATES.find((t) => t.id === tmplId)?.name || 'Custom Role';
      return [
        ...prev,
        {
          id: `role-${Date.now()}`,
          name,
          description: isBangla ? 'টেমপ্লেট থেকে তৈরি' : 'Created from template',
          employees: 0,
          modules,
        },
      ];
    });
    toast.success(isBangla ? 'টেমপ্লেট প্রয়োগ করা হয়েছে' : 'Template applied');
  };

  const totalPermissions = MODULE_KEYS.length * PERMISSION_ACTIONS.length;
  const grantedCount = useMemo(() => {
    if (!selectedRole) return 0;
    return MODULE_KEYS.reduce(
      (sum, m) =>
        sum +
        PERMISSION_ACTIONS.filter((a) => selectedRole.modules[m]?.[a.key]).length,
      0
    );
  }, [selectedRole]);

  const [restrictions, setRestrictions] = useState({
    branchAll: true,
    branchMain: true,
    branchDhanmondi: true,
    branchGulshan: true,
    warehouseAll: true,
    employeeAll: true,
    employeeViewSelf: true,
    dailyLimit: '25000',
  });

  return (
    <div className="space-y-6">
      <HrmPageHeader
        title={isBangla ? 'ভূমিকা ও অনুমতি' : 'Roles & Permissions'}
        titleBn="ভূমিকা ও অনুমতি"
        subtitle={isBangla ? 'কর্মচারীদের ভূমিকা, অনুমতি ও সীমাবদ্ধতা নির্ধারণ করুন।' : 'Control what each role can view, create, edit and approve.'}
        subtitleBn="কর্মচারীদের ভূমিকা, অনুমতি ও সীমাবদ্ধতা নির্ধারণ করুন।"
        icon={ShieldCheck}
        breadcrumbs={[{ label: isBangla ? 'ভূমিকা ও অনুমতি' : 'Roles & Permissions', labelBn: 'ভূমিকা ও অনুমতি' }]}
        actions={
          <>
            <Button variant="outline" leftIcon={<Save className="h-4 w-4" />} onClick={() => toast.success(isBangla ? 'পরিবর্তন সংরক্ষিত হয়েছে' : 'Changes saved')}>
              {isBangla ? 'সংরক্ষণ' : 'Save'}
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddOpen(true)}>
              {isBangla ? 'নতুন ভূমিকা' : 'Add Role'}
            </Button>
          </>
        }
      />

      {/* Roles overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {roles.map((r) => {
          const active = r.id === selectedRoleId;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRoleId(r.id)}
              className={`text-left rounded-2xl border p-4 transition-all duration-200 ${
                active
                  ? 'border-primary/50 bg-primary-subtle/40 shadow-premium-default'
                  : 'border-[rgba(255,255,255,0.04)] bg-card hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${r.isSystem ? 'bg-primary-subtle text-primary' : 'bg-muted/40 text-muted-foreground'}`}>
                  {r.isSystem ? <Crown className="h-4 w-4" /> : <UserCog className="h-4 w-4" />}
                </div>
                {active && <Check className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-sm font-semibold text-foreground">{r.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant={r.isSystem ? 'indigo' : 'secondary'} size="sm">
                  <Users className="h-3 w-3 mr-1" />
                  {r.employees} {isBangla ? 'জন' : ''}
                </Badge>
                {r.isSystem && (
                  <Badge variant="outline" size="sm">
                    <Lock className="h-3 w-3 mr-1" />
                    {isBangla ? 'সিস্টেম' : 'System'}
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Permission matrix */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0 px-5 pt-5">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                {selectedRole.name}
                {selectedRole.isSystem && (
                  <Badge variant="indigo" size="sm">
                    <Lock className="h-3 w-3 mr-1" />
                    {isBangla ? 'সিস্টেম' : 'System'}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedRole.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary tabular-nums">
                {grantedCount}
                <span className="text-xs text-muted-foreground font-medium">/{totalPermissions}</span>
              </p>
              <p className="text-[10px] text-muted-foreground">{isBangla ? 'মোট অনুমতি' : 'permissions'}</p>
            </div>
          </CardHeader>

          {selectedRole.isSystem && selectedRole.id === 'role-admin' ? (
            <div className="px-5 pb-5 pt-2">
              <div className="rounded-xl border border-primary/20 bg-primary-subtle/30 p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary-subtle flex items-center justify-center shrink-0">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {isBangla ? 'সম্পূর্ণ অ্যাক্সেস' : 'Full access'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isBangla
                      ? 'অ্যাডমিনিস্ট্রেটর ভূমিকার সব মডিউল ও অনুমতিতে সম্পূর্ণ অ্যাক্সেস রয়েছে এবং এটি সম্পাদনাযোগ্য নয়।'
                      : 'The Administrator role has full access to every module and permission, and is not editable.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-5 pb-5 pt-2 overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[640px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="py-2.5 pr-3 font-semibold">{isBangla ? 'মডিউল' : 'Module'}</th>
                    {PERMISSION_ACTIONS.map((a) => (
                      <th key={a.key} className="py-2.5 px-2 font-semibold text-center">
                        {isBangla ? a.labelBn : a.label}
                      </th>
                    ))}
                    <th className="py-2.5 pl-3 font-semibold text-right">{isBangla ? 'সব' : 'All'}</th>
                  </tr>
                </thead>
                <tbody>
                  {MODULE_KEYS.map((m) => {
                    const meta = MODULE_ICONS[m] || MODULE_ICONS.Dashboard;
                    const flags = selectedRole.modules[m];
                    const allOn = PERMISSION_ACTIONS.every((a) => flags?.[a.key]);
                    const someOn = PERMISSION_ACTIONS.some((a) => flags?.[a.key]);
                    return (
                      <tr key={m} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2.5">
                            <span className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${meta.tone}`}>
                              <meta.icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="font-medium text-foreground whitespace-nowrap">{m}</span>
                          </div>
                        </td>
                        {PERMISSION_ACTIONS.map((a) => (
                          <td key={a.key} className="py-3 px-2 text-center">
                            <Switch
                              checked={!!flags?.[a.key]}
                              onCheckedChange={() => togglePermission(m, a.key)}
                              aria-label={`${m} ${a.label}`}
                            />
                          </td>
                        ))}
                        <td className="py-3 pl-3 text-right">
                          <button
                            onClick={() => setModuleAll(m, !allOn)}
                            className={`h-6 w-6 inline-flex items-center justify-center rounded-md transition-colors ${
                              allOn
                                ? 'bg-primary text-primary-foreground'
                                : someOn
                                  ? 'bg-primary-subtle text-primary'
                                  : 'bg-muted text-muted-foreground'
                            }`}
                            aria-label={`Toggle all for ${m}`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Right column: templates */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="px-5 pt-5">
              <CardTitle className="text-base flex items-center gap-2">
                <Copy className="h-4 w-4 text-primary" />
                {isBangla ? 'টেমপ্লেট' : 'Templates'}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBangla ? 'প্রস্তুত টেমপ্লেট থেকে দ্রুত ভূমিকা তৈরি করুন' : 'Quick-start from a prebuilt template'}
              </p>
            </CardHeader>
            <div className="px-5 pb-5 pt-1 space-y-2">
              {ROLE_TEMPLATES.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.04)] bg-muted/20 p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      {t.tag && <Badge variant="indigo" size="sm">{t.tag}</Badge>}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{t.description}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => applyTemplate(t.id)}>
                    {isBangla ? 'ব্যবহার' : 'Use'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Restrictions */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'permissions' | 'restrictions')}>
        <TabsList>
          <TabsTrigger value="permissions">
            <KeyRound className="h-4 w-4" />
            {isBangla ? 'অনুমতি' : 'Permissions'}
          </TabsTrigger>
          <TabsTrigger value="restrictions">
            <Lock className="h-4 w-4" />
            {isBangla ? 'সীমাবদ্ধতা' : 'Restrictions'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card padding="lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-subtle flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{isBangla ? 'শাখা অ্যাক্সেস' : 'Branch Access'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isBangla
                      ? `${selectedRole.name} ভূমিকার কর্মচারীরা যে শাখাগুলো দেখতে পারবেন তা নির্ধারণ করুন।`
                      : `Control which branches ${selectedRole.name} can access.`}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{isBangla ? 'সব শাখা' : 'All branches'}</Label>
                  <Switch checked={restrictions.branchAll} onCheckedChange={(v) => setRestrictions((s) => ({ ...s, branchAll: v }))} />
                </div>
                <div className="flex items-center justify-between pl-1">
                  <Label className="text-sm text-muted-foreground">Main Branch</Label>
                  <Switch checked={restrictions.branchMain} onCheckedChange={(v) => setRestrictions((s) => ({ ...s, branchMain: v }))} />
                </div>
                <div className="flex items-center justify-between pl-1">
                  <Label className="text-sm text-muted-foreground">Dhanmondi Branch</Label>
                  <Switch checked={restrictions.branchDhanmondi} onCheckedChange={(v) => setRestrictions((s) => ({ ...s, branchDhanmondi: v }))} />
                </div>
                <div className="flex items-center justify-between pl-1">
                  <Label className="text-sm text-muted-foreground">Gulshan Branch</Label>
                  <Switch checked={restrictions.branchGulshan} onCheckedChange={(v) => setRestrictions((s) => ({ ...s, branchGulshan: v }))} />
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-subtle flex items-center justify-center shrink-0">
                  <Warehouse className="h-5 w-5 text-emerald" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{isBangla ? 'গুদাম ও কর্মচারী' : 'Warehouse & Employee'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isBangla
                      ? 'গুদাম ও কর্মচারী তালিকায় অ্যাক্সেসের সীমা নির্ধারণ করুন।'
                      : 'Set access boundaries for warehouses and employee data.'}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{isBangla ? 'সব গুদাম' : 'All warehouses'}</Label>
                  <Switch checked={restrictions.warehouseAll} onCheckedChange={(v) => setRestrictions((s) => ({ ...s, warehouseAll: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{isBangla ? 'সব কর্মচারী' : 'All employees'}</Label>
                  <Switch checked={restrictions.employeeAll} onCheckedChange={(v) => setRestrictions((s) => ({ ...s, employeeAll: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">
                    {isBangla ? 'শুধু নিজের তথ্য' : 'Self view only'}
                  </Label>
                  <Switch checked={restrictions.employeeViewSelf} onCheckedChange={(v) => setRestrictions((s) => ({ ...s, employeeViewSelf: v }))} />
                </div>
                <div className="pt-2 space-y-1.5">
                  <Label className="text-sm">{isBangla ? 'দৈনিক লেনদেন সীমা (৳)' : 'Daily transaction limit (৳)'}</Label>
                  <Input
                    type="number"
                    value={restrictions.dailyLimit}
                    onChange={(e) => setRestrictions((s) => ({ ...s, dailyLimit: e.target.value }))}
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="restrictions" className="mt-4">
          <HrmEmptyState
            icon={ShieldCheck}
            title={isBangla ? 'সীমাবদ্ধতা সেট করুন' : 'Set restrictions'}
            description={isBangla ? 'পারমিশন ট্যাবে শাখা, গুদাম ও কর্মচারী সীমাবদ্ধতা কনফিগার করুন।' : 'Configure branch, warehouse and employee restrictions from the Permissions tab.'}
          />
        </TabsContent>
      </Tabs>

      {/* Add Role Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              {isBangla ? 'নতুন ভূমিকা' : 'Add New Role'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="role-name">{isBangla ? 'ভূমিকার নাম *' : 'Role name *'}</Label>
              <Input
                id="role-name"
                placeholder={isBangla ? 'যেমন: Area Manager' : 'e.g. Area Manager'}
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{isBangla ? 'অনুমতি টেমপ্লেট' : 'Permission template'}</Label>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_TEMPLATES.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setAddOpen(false);
                      applyTemplate(t.id);
                    }}
                    className="text-left rounded-xl border border-[rgba(255,255,255,0.04)] bg-muted/20 p-3 hover:border-primary/30 transition-colors"
                  >
                    <p className="text-xs font-semibold text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">{isBangla ? 'বাতিল' : 'Cancel'}</Button>
            </DialogClose>
            <Button onClick={handleAddRole}>
              <Plus className="h-4 w-4" />
              {isBangla ? 'তৈরি করুন' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
