'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Save, RotateCcw, Loader2 } from 'lucide-react';
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

interface StickySaveBarProps {
  isVisible: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const StickySaveBar: React.FC<StickySaveBarProps> = ({
  isVisible,
  isSaving,
  onSave,
  onDiscard,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed left-0 right-0 bottom-0 z-40 bg-card/90 backdrop-blur-md border-t border-border shadow-[0_-8px_24px_-18px_rgba(0,0,0,0.25)] animate-in slide-in-from-bottom-full duration-300">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,3vw,32px)] py-3 flex items-center justify-between gap-3">
          <div className="text-[13px] text-muted-foreground font-semibold flex items-center gap-2">
            <AlertTriangle className="w-[14px] h-[14px] text-amber-500" />
            <span className="hidden sm:inline">You have unsaved permission changes</span>
            <span className="sm:hidden">Unsaved changes</span>
          </div>
          <div className="flex gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmModal(true)}
              disabled={isSaving}
              className="h-[38px] px-3.5 rounded-[9px] font-semibold text-[13.5px] border-border text-foreground hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Reset
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="h-[38px] px-3.5 rounded-[9px] font-semibold text-[13.5px] bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">
              Discard unsaved changes?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to discard all your modified permissions?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 pt-2">
            <AlertDialogCancel className="h-9 text-xs rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmModal(false);
                onDiscard();
              }}
              className="h-9 text-xs font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
