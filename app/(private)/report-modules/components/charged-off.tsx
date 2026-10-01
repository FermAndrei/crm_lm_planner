"use client";

import React, { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { TablePagination } from "@/components/ui/table-pagination";
import { chargeOffReportApi } from "@/services/api-manager/reports/charge-off/charge-off-api";
import {
  ChargeOffRecord,
  ChargeOffPagination,
} from "@/services/api-manager/reports/charge-off/charge-off-type";
import { ApiError } from "@/services/api-manager/baseApiEndpoint";

const formatCurrency = (val: number | string | undefined | null) => {
  if (val == null || val === "" || val === "-") return "0.00";
  if (typeof val === "string" && val.includes("₱")) return val;
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return `₱ ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDisplayDate = (date: string | undefined | null) => {
  if (!date || date === "-" || date === "—") return date || "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function WriteOff() {
  const [records, setRecords] = useState<ChargeOffRecord[]>([]);
  const [pagination, setPagination] = useState<ChargeOffPagination>({
    current_page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);

  // Debounce search input per keystroke (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch data whenever debounced search, page, or per_page changes
  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      setIsLoading(true);

      try {
        const response = await chargeOffReportApi.fetchChargeOffReport({
          search_key: debouncedSearch.trim(),
          page: currentPage,
          per_page: itemsPerPage,
        });

        if (isCancelled) return;

        if (response?.retCode === "200" && response.data?.records) {
          setRecords(response.data.records);
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          }
          if (response.data.records.length === 0) {
            setNoDataMessage({
              title: "No Data Available",
              subtitle: "There are no records to display at this time.",
            });
          } else {
            setNoDataMessage(null);
          }
        } else {
          setRecords([]);
          setPagination({
            current_page: 1,
            per_page: itemsPerPage,
            total_records: 0,
            total_pages: 0,
          });
          setNoDataMessage({
            title: response?.message || "No Data Available",
            subtitle:
              response?.data?.message ||
              "There are no records to display at this time.",
          });
        }
      } catch (err: unknown) {
        if (isCancelled) return;
        setRecords([]);
        setPagination({
          current_page: 1,
          per_page: itemsPerPage,
          total_records: 0,
          total_pages: 0,
        });

        if (err instanceof ApiError) {
          const errorData = err.data as
            | { message?: string }
            | string
            | undefined;
          const subMsg =
            typeof errorData === "object" && errorData && "message" in errorData
              ? errorData.message
              : typeof errorData === "string"
                ? errorData
                : undefined;

          setNoDataMessage({
            title: err.message || "No Data Available",
            subtitle: subMsg || "There are no records to display at this time.",
          });
        } else {
          setNoDataMessage({
            title: "No Data Available",
            subtitle: "There are no records to display at this time.",
          });
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (
      page < 1 ||
      (pagination.total_pages > 0 && page > pagination.total_pages)
    )
      return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Top Header & Search Bar */}
      <div className="mb-4">
        <div className="relative w-72 sm:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-200/90 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#05512A] shadow-xs transition-all"
          />
          {isLoading && (
            <Loader2
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
            />
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-md border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="overflow-x-auto min-h-75">
          <table className="w-full border-collapse text-left text-sm">
            {/* Header */}
            <thead>
              <tr className="bg-[#F8F9FA] text-[#475467] text-xs font-semibold">
                <th className="whitespace-nowrap px-4 py-3.5 text-left first:rounded-l-md">
                  Branch
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Name / CID
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Account Number
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Product Type
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Term Window
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Principal Released
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Outstanding Principal
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left last:rounded-r-md">
                  Write-off Date
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {isLoading && records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2
                        size={36}
                        className="animate-spin text-[#1E6E25] mb-3"
                      />
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Loading charged off data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((item, index) => {
                  const rowId = `${item.account_number}-${index}`;
                  return (
                    <tr
                      key={rowId}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Branch */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {item.branch || "-"}
                        </div>
                      </td>

                      {/* Name / CID */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div
                          className="text-xs sm:text-sm font-bold text-[#191924] max-w-60 truncate"
                          title={item.member_name}
                        >
                          {item.member_name || "-"}
                        </div>
                        <div className="mt-0.5 text-xs font-mono text-[#5a5a70]">
                          {item.cid || "-"}
                        </div>
                      </td>

                      {/* Account Number */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold font-mono text-[#191924]">
                          {item.account_number || "-"}
                        </div>
                      </td>

                      {/* Product Type */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-medium text-[#344054]">
                          {item.product_type || "-"}
                        </div>
                      </td>

                      {/* Term Window */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-medium text-[#191924]">
                          {formatDisplayDate(item.term_window_start_date)}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          → {formatDisplayDate(item.term_window_end_date)}
                        </div>
                      </td>

                      {/* Principal Released */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {item.formatted_principal_released ||
                            formatCurrency(item.principal_released)}
                        </div>
                      </td>

                      {/* Outstanding Principal */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#E11D48]">
                          {item.formatted_outstanding_principal ||
                            formatCurrency(item.outstanding_principal)}
                        </div>
                      </td>

                      {/* Write-off Date */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm text-[#5a5a70]">
                          {formatDisplayDate(
                            item.write_off_date ||
                              item.write_off_status?.write_off_date,
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* 404 / No Data Available State */
                <tr>
                  <td colSpan={8} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <div className="mb-5 flex items-center justify-center text-[#CBD5E1]">
                        <svg
                          className="w-14.5 h-18"
                          viewBox="0 0 64 76"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M40 6H16C11.5 6 8 9.5 8 14V62C8 66.5 11.5 70 16 70H48C52.5 70 56 66.5 56 62V22L40 6Z" />
                          <path d="M40 6V20C40 21.1 40.9 22 42 22H56" />
                          <line
                            x1="24"
                            y1="46"
                            x2="40"
                            y2="46"
                            strokeWidth="4.5"
                          />
                        </svg>
                      </div>

                      <h3 className="text-xl font-bold text-[#333333]">
                        {noDataMessage?.title || "No Data Available"}
                      </h3>

                      <p className="mt-2 text-sm text-[#7A7A7A]">
                        {noDataMessage?.subtitle ||
                          "There are no records to display at this time."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {records.length > 0 && (
          <TablePagination
            totalRecords={pagination.total_records}
            currentPage={pagination.current_page}
            itemsPerPage={pagination.per_page}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
    </div>
  );
}
