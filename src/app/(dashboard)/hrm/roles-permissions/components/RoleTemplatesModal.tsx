import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LayoutTemplate, Shield, Calculator, Store, Users, ShoppingBag, Truck, HeartHandshake } from 'lucide-react';
import { Role } from '@/types/role';

interface RoleTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
}

const TEMPLATES = [
  { id: 'owner', name: 'Owner', desc: 'Full access to all modules.', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'super_admin', name: 'Super Admin', desc: 'Manage settings, roles, and company data.', icon: Shield, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  { id: 'branch_manager', name: 'Branch Manager', desc: 'Control branch operations.', icon: Store, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'cashier', name: 'Cashier', desc: 'POS operations and sales.', icon: Calculator, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'accountant', name: 'Accountant', desc: 'Financial records and ledgers.', icon: Calculator, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { id: 'hr', name: 'HR Manager', desc: 'Employee and payroll management.', icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  { id: 'warehouse', name: 'Warehouse', desc: 'Stock and inventory control.', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  { id: 'delivery', name: 'Delivery Staff', desc: 'Manage dispatches and orders.', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { id: 'support', name: 'Support Agent', desc: 'Customer queries and tickets.', icon: HeartHandshake, color: 'text-pink-600', bg: 'bg-pink-100 dark:bg-pink-900/30' },
];

export function RoleTemplatesModal({ isOpen, onClose, onSelectTemplate }: RoleTemplatesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden bg-card border-border/60">
        <div className="p-8 pb-6 border-b border-border/40 bg-muted/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              Role Templates
            </DialogTitle>
            <DialogDescription className="text-sm mt-2 max-w-lg leading-relaxed">
              Start with a pre-configured role template based on industry standards, or create a custom role from scratch.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <div 
                key={template.id} 
                className="group relative flex flex-col items-start p-5 rounded-2xl border border-border/50 bg-background hover:bg-muted/30 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectTemplate(template)}
              >
                <div className={`p-3 rounded-xl mb-4 ${template.bg} ${template.color}`}>
                  <template.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{template.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{template.desc}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full h-8 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] bg-background"
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
