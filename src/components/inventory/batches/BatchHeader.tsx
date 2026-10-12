"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";
import { Plus } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useRouter } from "next/navigation";

interface BatchHeaderProps {
  totalBatches?: number;
  onAddBatch?: () => void;
}

export function BatchHeader({
  // totalBatches = 0,
  onAddBatch,
}: BatchHeaderProps) {
  const { isBangla } = useAppTranslation();
  const router = useRouter();

  return (
    <PageHeader
      title={isBangla ? "ব্যাচ ট্র্যাকিং ও ম্যানেজমেন্ট" : "Batch Management"}
      subtitle={isBangla
        ? "সকল ইনভেন্টরি ব্যাচের মেয়াদ, স্টক পরিমাণ এবং হিস্ট্রি পরিচালনা করুন"
        : "Track product lots, monitor expiries, cost prices, and stock movements"}
      showBack
      fallbackHref="/inventory"
      actions={
        <Button
          size="sm"
          onClick={onAddBatch || (() => router.push("/inventory/new"))}
          className="h-9 text-xs font-bold gap-1.5 cursor-pointer shadow-xs flex"
        >
          <Plus className="h-4 w-4" />
          {isBangla ? "নতুন ব্যাচ" : "Add Batch"}
        </Button>
      }
    />
  );
}

