"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface TablePaginationProps {
  totalRecords: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export function TablePagination({
  totalRecords,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const startRecord =
    totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-[#191924]/8 pt-4 md:flex-row">
      {/* LEFT */}
      <div className="flex items-center gap-4 text-xs font-semibold text-[#5a5a70]">
        <div className="flex items-center gap-2">
          <span>Items per page:</span>

          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-xl border border-[#191924]/10 bg-[#FAF9FD] px-2.5 py-1 text-xs font-bold text-[#191924] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/20 cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <span>
          Showing <span className="font-bold text-[#191924]">{startRecord}</span>-
          <span className="font-bold text-[#191924]">{endRecord}</span> of{" "}
          <span className="font-bold text-[#191924]">{totalRecords}</span> records
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1">
        {/* First */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="rounded-xl p-2 text-[#5a5a70] transition hover:bg-[#FAF9FD] hover:text-[#191924] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          title="First page"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl p-2 text-[#5a5a70] transition hover:bg-[#FAF9FD] hover:text-[#191924] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Pages */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-xs font-bold text-[#9a9ab0]">
              ...
            </span>
          ) : (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                page === currentPage
                  ? "bg-[#191924] text-white shadow-xs"
                  : "text-[#5a5a70] hover:bg-[#FAF9FD] hover:text-[#191924]"
              }`}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="rounded-xl p-2 text-[#5a5a70] transition hover:bg-[#FAF9FD] hover:text-[#191924] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          title="Next page"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="rounded-xl p-2 text-[#5a5a70] transition hover:bg-[#FAF9FD] hover:text-[#191924] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          title="Last page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
