"use client";

import React from "react";
import { ShieldAlert, Lock, UserX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PermissionOverlayProps {
  children: React.ReactNode;
  hasAccess: boolean;
  onSwitchRoleToOwner?: () => void;
  isBangla?: boolean;
}

export function PermissionOverlay({
  children,
  hasAccess,
  onSwitchRoleToOwner,
  isBangla = false,
}: PermissionOverlayProps) {
  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Blurred & Disabled Content Underneath */}
      <div className="filter blur-md pointer-events-none select-none opacity-30 cursor-not-allowed">
        {children}
      </div>

      {/* Permission Lock Overlay Banner Box */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-background/80 backdrop-blur-md space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-sm">
          <UserX className="h-7 w-7" />
        </div>

        <div className="space-y-1.5 max-w-md">
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px] font-extrabold uppercase px-2.5 py-0.5">
            Access Restricted
          </Badge>
          <h3 className="text-base sm:text-lg font-extrabold text-foreground">
            {isBangla
              ? "শুধুমাত্র ওনার এবং অ্যাকাউন্ট্যান্টরা সেটিংস পরিচালনা করতে পারেন"
              : "Only Owners and Accountants can manage Finance & Accounting settings."}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isBangla
              ? "এই পৃষ্ঠাটিতে কেবল ব্যবসায়ের মূল মালিক ও অ্যাকাউন্ট্যান্টদের প্রবেশাধিকার রয়েছে।"
              : "You do not have administrative permission to modify chart of accounts, VAT configurations, or financial settings."}
          </p>
        </div>

        {onSwitchRoleToOwner && (
          <Button
            type="button"
            onClick={onSwitchRoleToOwner}
            className="h-9 px-4 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 cursor-pointer rounded-lg shadow-xs"
          >
            <span>{isBangla ? "ওনার মোডে পরিবর্তন করুন (Demo)" : "Switch to Owner Role (Demo)"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
