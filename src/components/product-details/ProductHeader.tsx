"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Product } from "./mock-data";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface ProductHeaderProps {
  product: Product;
  onEdit?: () => void;
  onBack?: () => void;
}

export function ProductHeader({ product, onEdit, onBack }: ProductHeaderProps) {
  const router = useRouter();
  const { isBangla } = useAppTranslation();

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/inventory">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground max-w-[200px] truncate">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onBack || (() => router.back())}
        className="h-9 px-3 text-xs font-semibold flex items-center gap-1.5 rounded-xl border-input bg-background hover:bg-muted text-foreground cursor-pointer shrink-0"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{isBangla ? "ফিরে যান" : "Back"}</span>
      </Button>
    </div>
  );
}
