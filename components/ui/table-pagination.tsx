"use client";

import {
  ChevronDown,
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
    <div className="pt-6 flex flex-col items-center justify-between gap-4 md:flex-row text-xs text-[#555555]">
      {/* LEFT */}
      <div className="flex items-center gap-3 text-xs text-[#555555]">
        <div className="flex items-center gap-1.5">
          <span>Items:</span>

          <div className="relative inline-flex items-center">
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="cursor-pointer appearance-none rounded-md border border-gray-200/90 bg-white py-1 pl-2.5 pr-6 text-xs font-medium text-[#191924] focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#05512A] shadow-xs"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-1.5 text-gray-400"
            />
          </div>
        </div>

        <span>
          Showing <span className="font-semibold text-[#191924]">{startRecord}</span>-
          <span className="font-semibold text-[#191924]">{endRecord}</span> of{" "}
          <span className="font-semibold text-[#191924]">{totalRecords}</span> records
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1">
        {/* First */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          title="First page"
        >
          <ChevronsLeft size={15} />
        </button>

        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          title="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Pages */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1.5 text-xs text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-7 w-7 rounded-md text-xs transition-all cursor-pointer ${
                page === currentPage
                  ? "bg-[#05512A] text-white font-semibold shadow-xs"
                  : "text-[#555555] hover:bg-gray-100 hover:text-[#191924] font-medium"
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
          className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          title="Next page"
        >
          <ChevronRight size={15} />
        </button>

        {/* Last */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          title="Last page"
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  );

}
