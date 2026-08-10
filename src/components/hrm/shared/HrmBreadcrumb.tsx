// Hello Khata OS - HRM Breadcrumb
// হ্যালো খাতা - এইচআরএম ব্রেডক্রাম্ব

'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface Crumb {
  label: string;
  labelBn?: string;
  href?: string;
}

export function HrmBreadcrumb({ items }: { items: Crumb[] }) {
  const { isBangla } = useAppTranslation();

  return (
    <Breadcrumb className="mb-1.5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground text-xs">
            {isBangla ? 'ড্যাশবোর্ড' : 'Dashboard'}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/hrm/dashboard" className="text-muted-foreground hover:text-foreground text-xs">
            {isBangla ? 'এইচআরএম' : 'HRM'}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, i) => (
          <span key={i} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href} className="text-muted-foreground hover:text-foreground text-xs">
                  {isBangla && item.labelBn ? item.labelBn : item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-medium text-foreground text-xs">
                  {isBangla && item.labelBn ? item.labelBn : item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
