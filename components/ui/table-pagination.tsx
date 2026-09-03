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
    <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-3 md:flex-row">
      {/* LEFT */}
      <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
        <div className="flex items-center gap-2">
          <span>Items:</span>

          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1E4637]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <span>
          Showing {startRecord}-{endRecord} of {totalRecords} records
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1">
        {/* First */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Pages */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-10 w-10 rounded-lg text-sm font-bold transition-all ${
                page === currentPage
                  ? "bg-[#1E4637] text-white shadow-lg shadow-green-900/20"
                  : "text-gray-500 hover:bg-gray-100"
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
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>

        {/* Last */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}
