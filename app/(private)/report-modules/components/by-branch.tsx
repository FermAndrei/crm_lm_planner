"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, Eye, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { branchesReportApi } from "@/services/api-manager/reports/branches/branches-report-api";
import {
  BranchReportRecord,
  BranchReportPagination,
  DistinctBranch,
} from "@/services/api-manager/reports/branches/branches-report-type";
import { TablePagination } from "@/components/ui/table-pagination";
import AccountDetailsModal from "./modals/account-details-modal";
import { ApiError } from "@/services/api-manager/baseApiEndpoint";

const formatCurrency = (val: number | undefined | null) => {
  if (val == null || isNaN(val)) return "0.00";
  return val.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (date: string | undefined | null) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const DEFAULT_BRANCH_OPTIONS: DistinctBranch[] = [
  { branch: "General Santos", branch_code: "PH1020017" },
  { branch: "Panabo", branch_code: "PH1020027" },
  { branch: "Lagao", branch_code: "PH1020036" },
  { branch: "Tanauan", branch_code: "PH1020030" },
];

export default function ByBranch() {
  const [branchesList, setBranchesList] = useState<DistinctBranch[]>([]);
  const [selectedBranchCode, setSelectedBranchCode] = useState("PH1020017");

  const [records, setRecords] = useState<BranchReportRecord[]>([]);
  const [pagination, setPagination] = useState<BranchReportPagination>({
    current_page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 0,
  });
  const [selectedItem, setSelectedItem] = useState<BranchReportRecord | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);

  // 1. Fetch distinct branches for the dropdown
  useEffect(() => {
    async function loadBranches() {
      try {
        const response = await branchesReportApi.fetchDistinctBranches();
        if (
          response?.retCode === "200" &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setBranchesList(response.data);

          // Find General Santos by default, or fallback to first option
          const initialBranch =
            response.data.find(
              (b) =>
                b.branch.toLowerCase().includes("general santos") ||
                b.branch_code === "PH1020017",
            ) || response.data[0];

          if (initialBranch) {
            setSelectedBranchCode(initialBranch.branch_code);
          }
        }
      } catch (err) {
        console.error("Failed to load distinct branches:", err);
      }
    }

    loadBranches();
  }, []);

  // 2. Debounce search per keystroke (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 3. Fetch data whenever branch_code, debounced search, page, or itemsPerPage changes
  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      setIsLoading(true);

      try {
        const response = await branchesReportApi.fetchBranchesReport({
          search_key: debouncedSearch.trim(),
          branch_code: selectedBranchCode.trim(),
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
  }, [selectedBranchCode, debouncedSearch, currentPage, itemsPerPage]);

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

  const availableBranches = branchesList;

  return (
    <div>
      {/* Top Filter & Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Branch Dropdown */}

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
          <div className="relative inline-flex items-center">
            <select
              value={selectedBranchCode}
              onChange={(e) => {
                setSelectedBranchCode(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer appearance-none rounded-md border border-gray-200/90 bg-white py-2 pl-4 pr-9 text-xs sm:text-sm font-semibold text-[#191924] shadow-xs focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#05512A]"
            >
              {availableBranches.map((item) => (
                <option key={item.branch_code} value={item.branch_code}>
                  {item.branch}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 text-gray-400"
            />
          </div>
        </div>

        {/* Search Input */}
      </div>

      {/* Table Card */}
      <div className="rounded-md border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="overflow-x-auto min-h-75">
          <table className="w-full border-collapse text-left text-sm">
            {/* Header */}
            <thead>
              <tr className="bg-[#F8F9FA] text-[#475467] text-xs font-semibold">
                <th className="whitespace-nowrap px-4 py-3.5 text-center first:rounded-l-md">
                  Action
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Branch
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Client
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Account
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Product Type
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Granted
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Term Window
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Defprin
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-center last:rounded-r-md">
                  Loan Status
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {isLoading && records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2
                        size={36}
                        className="animate-spin text-[#1E6E25] mb-3"
                      />
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Loading reports data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((item, index) => {
                  const rowId = `${item.account}-${index}`;
                  return (
                    <tr
                      key={rowId}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Action */}
                      <td className="whitespace-nowrap px-4 py-4 text-center align-middle">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#05512A] cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>

                      {/* Branch */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {item.branch || "-"}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          {item.br_code || "-"}
                        </div>
                      </td>

                      {/* Client */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div
                          className="text-xs sm:text-sm font-bold text-[#191924] max-w-60 truncate"
                          title={item.client}
                        >
                          {item.client || "-"}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          {item.customer_id || "-"}
                        </div>
                      </td>

                      {/* Account */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold font-mono text-[#191924]">
                          {item.account || "-"}
                        </div>
                      </td>

                      {/* Product Type */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-medium text-[#344054]">
                          {item.product_type || "-"}
                        </div>
                      </td>

                      {/* Granted */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {formatCurrency(item.original_amount_granted)}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          {(item.interest_rate ?? 0).toFixed(2)}%
                        </div>
                      </td>

                      {/* Term Window */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-medium text-[#191924]">
                          {formatDate(
                            item.term_window_start_date || item.granted,
                          )}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          → {formatDate(item.term_window_end_date)}
                        </div>
                      </td>

                      {/* Defprin */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {formatCurrency(item.defprin)}
                        </div>
                      </td>

                      {/* Loan Status */}
                      <td className="whitespace-nowrap px-4 py-4 text-center align-top">
                        <span
                          className={cn(
                            "inline-block rounded-full px-3 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider",
                            item.loan_status === "CURRENT"
                              ? "bg-[#DCFCE7] text-[#15803D]"
                              : item.loan_status === "EXPIRED"
                                ? "bg-[#FFE4E8] text-[#E11D48]"
                                : "bg-[#F4F2FA] text-[#5a5a70]",
                          )}
                        >
                          {item.loan_status || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* 404 / No Data Available State (matches Client Profile Image 1) */
                <tr>
                  <td colSpan={9} className="py-16">
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

      {/* Account Details Modal */}
      <AccountDetailsModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        data={selectedItem}
      />
    </div>
  );
}
