"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { InventoryItemForm } from "@/components/inventory/InventoryItemForm";

export default function AddProductPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen text-foreground font-sans antialiased">
      <main className="mx-auto space-y-4 sm:space-y-5 pb-24">
        {/* Header Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 mb-1 transition-opacity cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> BACK TO INVENTORY
            </button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Add New Product
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Initialize a new stock item, pricing, stock levels, and accounting settings.
            </p>
          </div>
        </div>

        {/* Reusable Inventory Form */}
        <InventoryItemForm
          onSuccess={() => router.push("/inventory")}
          onCancel={() => router.back()}
        />
      </main>
    </div>
  );
}
