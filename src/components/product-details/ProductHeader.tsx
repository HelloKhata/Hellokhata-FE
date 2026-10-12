"use client";

import React from "react";
import { PageHeader } from "@/components/common";
import { Product } from "./mock-data";

interface ProductHeaderProps {
  product: Product;
  onEdit?: () => void;
  onBack?: () => void;
}

export function ProductHeader({ product, onBack }: ProductHeaderProps) {
  return (
    <PageHeader
      title={product.name}
      breadcrumbs={[
        { label: "Inventory", labelBn: "ইনভেন্টরি", href: "/inventory" },
        { label: "Products", labelBn: "পণ্য", href: "/inventory" },
        { label: product.name },
      ]}
      showBack
      backAction={onBack}
      fallbackHref="/inventory"
    />
  );
}

