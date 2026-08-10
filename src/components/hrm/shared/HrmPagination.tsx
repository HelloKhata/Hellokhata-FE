// Hello Khata OS - HRM Pagination
// হ্যালো খাতা - এইচআরএম পেজিনেশন

'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export function HrmPagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }: Props) {
  const { isBangla } = useAppTranslation();

  if (totalPages <= 1 && !totalItems) return null;

  const getPages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  const startItem = totalItems ? (currentPage - 1) * (pageSize || 1) + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * (pageSize || 1), totalItems) : 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-3 w-full">
      {totalItems ? (
        <div className="text-xs text-muted-foreground">
          {isBangla ? (
            <>
              দেখানো হচ্ছে{' '}
              <span className="font-semibold text-foreground tabular-nums">
                {startItem}-{endItem}
              </span>{' '}
              (মোট <span className="font-semibold text-foreground tabular-nums">{totalItems}</span>)
            </>
          ) : (
            <>
              Showing{' '}
              <span className="font-semibold text-foreground tabular-nums">
                {startItem}-{endItem}
              </span>{' '}
              of <span className="font-semibold text-foreground tabular-nums">{totalItems}</span>
            </>
          )}
        </div>
      ) : (
        <div />
      )}

      {totalPages > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent className="flex-wrap justify-center">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? 'pointer-events-none opacity-50 select-none' : 'cursor-pointer'
                }
              >
                {isBangla ? 'পূর্ববর্তী' : 'Previous'}
              </PaginationPrevious>
            </PaginationItem>

            {getPages().map((page, idx) =>
              page === 'ellipsis' ? (
                <PaginationItem key={`e-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50 select-none'
                    : 'cursor-pointer'
                }
              >
                {isBangla ? 'পরবর্তী' : 'Next'}
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
