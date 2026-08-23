import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 20, 30, 50],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const getPages = (): Array<number | '...'> => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(event.target.value));
  };

  return (
    <div className="flex flex-col gap-4 border-t border-[#E4E7EC] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Rows per page */}

      <div className="flex items-center gap-2 text-[13px] text-[#475467]">
        <span>Rows per page</span>

        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="h-8 rounded-md border border-[#D0D5DD] bg-white px-2 text-[13px] text-[#344054] outline-none focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF]"
          aria-label="Rows per page"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <span>of {totalItems}</span>
      </div>

      {/* Page navigation */}

      <div className="flex items-center gap-2">
        {/* Previous */}

        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#667085] transition hover:bg-[#F2F4F7] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}

        {getPages().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-[13px] text-[#667085]">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-8 min-w-8 cursor-pointer rounded-md px-2 text-[13px] font-medium transition ${
                currentPage === page
                  ? 'bg-[#F0F4FF] text-[#315BEF]'
                  : 'text-[#475467] hover:bg-[#F2F4F7]'
              }`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#667085] transition hover:bg-[#F2F4F7] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
