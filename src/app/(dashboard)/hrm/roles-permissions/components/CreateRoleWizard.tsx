import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Role } from '@/types/role';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CreateRoleWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (roleData: any) => void;
  initialTemplate?: any;
}

export function CreateRoleWizard({ isOpen, onClose, onCreate, initialTemplate }: CreateRoleWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: initialTemplate?.name || '',
    description: initialTemplate?.desc || '',
    code: initialTemplate ? `${initialTemplate.id}_custom` : '',
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  const handleSubmit = () => {
    onCreate(formData);
    setStep(1);
    setFormData({ name: '', description: '', code: '' });
  };

  const steps = [
    { num: 1, label: 'Basics' },
    { num: 2, label: 'Access' },
    { num: 3, label: 'Review' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] p-0 rounded-[18px] gap-0 overflow-hidden border-border/80 shadow-2xl bg-card">
        <DialogHeader className="p-[18px_22px_0]">
          <DialogTitle className="text-[17px] font-bold tracking-[-0.02em]">Create Custom Role</DialogTitle>
          <DialogDescription className="text-[12.5px] text-muted-foreground mt-0.5">
            Define basic details, scope, and initial permissions.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center px-[22px] pt-4 pb-1">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className={cn("flex items-center gap-[7px] transition-colors")}>
                <div className={cn(
                  "w-6 h-6 rounded-full grid place-items-center text-[11.5px] font-bold tabular-nums transition-all duration-150",
                  step > s.num ? "bg-emerald-500 border-emerald-500 text-white" :
                  step === s.num ? "bg-primary border-primary text-primary-foreground shadow-[0_0_0_4px_rgba(var(--primary),0.1)]" :
                  "bg-secondary border border-border text-muted-foreground"
                )}>
                  {step > s.num ? <Check className="w-3 h-3" /> : s.num}
                </div>
                <span className={cn(
                  "text-[11.5px] font-[650]",
                  step >= s.num ? "text-foreground" : "text-muted-foreground"
                )}>{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-px bg-border mx-2.5 min-w-[16px]" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="p-[14px_22px_20px] max-h-[60vh] overflow-y-auto mt-2">
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-[12.5px] font-[650] text-muted-foreground">
                  Role Name <span className="text-primary">*</span>
                </Label>
                <Input 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Senior Accountant"
                  className="rounded-[9px] h-9 border-border/80 bg-card text-[13.5px] focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-[12.5px] font-[650] text-muted-foreground">Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What does this role do?"
                  className="rounded-[9px] min-h-[64px] resize-y border-border/80 bg-card text-[13.5px] focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-[13.5px] text-muted-foreground">Set up the initial data access scope for this role.</p>
              <div className="p-4 border border-border rounded-[10px] bg-secondary/30">
                <p className="text-[13.5px] font-semibold">Access Scope Configuration</p>
                <p className="text-[12.5px] text-muted-foreground mt-1">This will be configured in detail after creation.</p>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-[13.5px] text-muted-foreground">Review the details before creating the role.</p>
              <div className="space-y-0">
                <div className="flex justify-between py-2 border-b border-dashed border-border/80">
                  <span className="text-[12px] text-muted-foreground font-semibold">Name</span>
                  <span className="text-[13px] font-semibold text-right">{formData.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-dashed border-border/80">
                  <span className="text-[12px] text-muted-foreground font-semibold">Description</span>
                  <span className="text-[13px] font-semibold text-right max-w-[200px] truncate">{formData.description || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-[13px_22px] border-t border-border flex items-center justify-between sm:justify-between bg-card rounded-b-[18px]">
          <Button variant="ghost" onClick={onClose} className="h-9 px-4 rounded-[9px] text-[13.5px] font-semibold hover:bg-secondary">
            Cancel
          </Button>
          <div className="flex gap-2.5">
            {step > 1 && (
              <Button variant="outline" onClick={handlePrev} className="h-9 px-4 rounded-[9px] text-[13.5px] font-semibold border-border hover:bg-secondary">
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext} disabled={!formData.name} className="h-9 px-4 rounded-[9px] text-[13.5px] font-semibold bg-primary text-primary-foreground shadow-sm">
                Next Step
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="h-9 px-4 rounded-[9px] text-[13.5px] font-semibold bg-primary text-primary-foreground shadow-sm">
                Create Role
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
