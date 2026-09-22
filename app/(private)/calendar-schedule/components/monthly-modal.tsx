"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  CalendarEvent,
  formatFullDate,
  formatCurrency,
  formatDateToISO,
} from "../data/calendar-data";

interface MonthlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
}

export function MonthlyModal({
  isOpen,
  onClose,
  date,
  events,
  onSelectEvent,
}: MonthlyModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset page and search when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setCurrentPage(1);
    }
  }, [isOpen, date]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const targetDate = date || new Date(2026, 8, 14);
  const targetDateISO = formatDateToISO(targetDate);

  // Filter events by date and search query
  const dateEvents = useMemo(() => {
    return events.filter((evt) => evt.date === targetDateISO);
  }, [events, targetDateISO]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return dateEvents;
    const q = searchQuery.toLowerCase();
    return dateEvents.filter(
      (evt) =>
        evt.clientName.toLowerCase().includes(q) ||
        evt.productType.toLowerCase().includes(q),
    );
  }, [dateEvents, searchQuery]);

  // Calculate total amount for the filtered items
  const totalAmount = useMemo(() => {
    return filteredEvents.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredEvents]);

  // Pagination calculation
  const totalRecords = filteredEvents.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100/90 relative animate-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close 'X' Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#191924] tracking-tight">
            Loan Payment Schedule
          </h2>
          <p className="text-sm font-medium text-[#737373] mt-1">
            {formatFullDate(targetDate)}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mt-6 mb-5">
          <Search className="size-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search client name..."
            className="w-full sm:w-80 rounded-xl border border-gray-200/90 pl-10 pr-4 py-2 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all"
          />
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100 text-xs font-semibold text-[#555555]">
                <th className="py-3.5 px-4 w-16">No.</th>
                <th className="py-3.5 px-4 w-44">Time</th>
                <th className="py-3.5 px-4">Client Name</th>
                <th className="py-3.5 px-4 text-right w-44">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((item, index) => {
                  const itemNumber = startIndex + index + 1;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectEvent?.(item)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        {itemNumber}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        {item.modalTimeRange ||
                          `${item.startTime} - ${item.endTime}`}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#191924] group-hover:text-[#05512A] transition-colors">
                        {item.clientName}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#05512A]">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-gray-400 text-sm"
                  >
                    No scheduled payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Amount Row */}
        <div className="flex justify-end items-center gap-2 mt-4 pt-2">
          <span className="text-sm font-medium text-[#555555]">
            Total Amount:
          </span>
          <span className="text-lg sm:text-xl font-bold text-[#05512A]">
            {formatCurrency(totalAmount)}
          </span>
        </div>

        {/* Pagination & Actions Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Items per page & Showing text */}
          <div className="flex items-center gap-3 text-xs text-[#555555]">
            <div className="flex items-center gap-1.5">
              <span>Items:</span>
              <div className="relative inline-flex items-center">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-1 pl-2.5 pr-6 text-xs font-medium text-[#191924] focus:border-[#05512A] focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-1.5 text-gray-400"
                />
              </div>
            </div>

            <span>
              Showing{" "}
              <span className="font-semibold text-[#191924]">
                {totalRecords === 0 ? 0 : startIndex + 1}
              </span>
              -<span className="font-semibold text-[#191924]">{endIndex}</span>{" "}
              of{" "}
              <span className="font-semibold text-[#191924]">
                {totalRecords}
              </span>{" "}
              records
            </span>
          </div>

          {/* Right: Pagination buttons and Close button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="First page"
              >
                <ChevronsLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-7 w-7 rounded-md text-xs transition-all cursor-pointer ${
                      page === currentPage
                        ? "bg-[#05512A] text-white font-semibold shadow-2xs"
                        : "text-[#555555] hover:bg-gray-100 hover:text-[#191924] font-medium"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Last page"
              >
                <ChevronsRight size={15} />
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300/90 px-6 py-1.5 text-sm font-semibold text-[#191924] hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
