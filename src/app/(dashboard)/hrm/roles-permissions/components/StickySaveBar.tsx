'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Save, Undo2, Loader2 } from 'lucide-react';
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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between p-3.5 sm:px-5 rounded-2xl bg-foreground text-background shadow-xl border border-border/20 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              You have unsaved permission changes.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmModal(true)}
              disabled={isSaving}
              className="h-8 text-xs font-medium border-background/30 text-background hover:bg-background/10 hover:text-background rounded-xl gap-1.5"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Discard
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="h-8 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-1.5 shadow-sm"
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
