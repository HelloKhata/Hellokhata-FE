import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useCurrency } from '@/hooks/useAppTranslation';

interface PaginationHelperProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isBangla?: boolean;
}

export function PaginationHelper({
  currentPage,
  totalPages,
  onPageChange,
  isBangla = false,
}: PaginationHelperProps) {
  const { formatNumber } = useCurrency();

  if (totalPages <= 1) return null;

  // Generates page numbers to show with ellipsis for large sets
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Middle pages around the current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4 w-full">
      <div className="text-sm text-muted-foreground">
        {isBangla ? (
          <>
            পৃষ্ঠা <span className="font-medium text-foreground">{formatNumber(currentPage)}</span> (মোট <span className="font-medium text-foreground">{formatNumber(totalPages)}</span>)
          </>
        ) : (
          <>
            Page <span className="font-medium text-foreground">{formatNumber(currentPage)}</span> of <span className="font-medium text-foreground">{formatNumber(totalPages)}</span>
          </>
        )}
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={handlePrev}
              className={currentPage === 1 ? 'pointer-events-none opacity-50 select-none' : 'cursor-pointer'}
            >
              {isBangla ? 'পূর্ববর্তী' : 'Previous'}
            </PaginationPrevious>
          </PaginationItem>

          {pages.map((page, idx) => (
            <PaginationItem key={idx}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => handlePageClick(e, page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {formatNumber(page)}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={handleNext}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50 select-none' : 'cursor-pointer'}
            >
              {isBangla ? 'পরবর্তী' : 'Next'}
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
