"use client";

import React, { useEffect, useState } from "react";
import { Eye, Search, Loader2 } from "lucide-react";
import { TablePagination } from "@/components/ui/table-pagination";
import CollateralModal from "./modals/collateral-modal";
import { withCollateralReportApi } from "@/services/api-manager/reports/with-collateral/with-collateral-api";
import {
  WithCollateralRecord,
  WithCollateralPagination,
} from "@/services/api-manager/reports/with-collateral/with-collateral-type";
import { ApiError } from "@/services/api-manager/baseApiEndpoint";

const formatDisplayDate = (date: string | undefined | null) => {
  if (!date || date === "-" || date === "—") return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (val: number | string | undefined | null) => {
  if (val == null || val === "" || val === "-") return "—";
  if (typeof val === "string" && val.includes("₱")) return val;
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return `₱ ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function WithCollateral() {
  const [records, setRecords] = useState<WithCollateralRecord[]>([]);
  const [pagination, setPagination] = useState<WithCollateralPagination>({
    current_page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 0,
  });
  const [selectedItem, setSelectedItem] = useState<WithCollateralRecord | null>(
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
        const response =
          await withCollateralReportApi.fetchWithCollateralReport({
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
                <th className="whitespace-nowrap px-4 py-3.5 text-center first:rounded-l-md">
                  Action
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Branch Booked
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Collateral Type
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Collateral Description
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Sequence
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Borrower / Account
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Date Of Appraisal
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Appraise Value
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left last:rounded-r-md">
                  Loan Value
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
                        Loading collateral data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((item, index) => {
                  const rowId = `${item.account_number}-${item.sequence}-${index}`;
                  const collateralType =
                    item.collateral_type ||
                    item.collateral_information?.collateral_code ||
                    item.collateral_information?.collateral_type ||
                    "-";
                  const collateralDesc =
                    item.collateral_information?.collateral_description ||
                    item.collateral_information?.description ||
                    item.collateral_information?.collateral_code_description ||
                    "-";
                  const borrowerName =
                    item.borrower ||
                    item.account_information?.name_of_borrower ||
                    "-";
                  const accountNumber =
                    item.account_number ||
                    item.account_information?.account_number_of_loan ||
                    "-";
                  const appraisalDate =
                    item.date_of_appraisal ||
                    item.appraisal_details?.date_of_appraisal;
                  const appraiseVal =
                    item.appraisal_value ||
                    item.appraisal_details?.appraisal_value;
                  const loanVal =
                    item.loan_value || item.appraisal_details?.loan_value;

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

                      {/* Branch Booked */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {item.branch_booked ||
                            item.account_information?.branch_booked ||
                            "-"}
                        </div>
                      </td>

                      {/* Collateral Type */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {collateralType}
                        </div>
                      </td>

                      {/* Collateral Description */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div
                          className="text-xs sm:text-sm font-medium text-[#191924] max-w-55 truncate"
                          title={collateralDesc}
                        >
                          {collateralDesc}
                        </div>
                      </td>

                      {/* Sequence */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-mono text-[#5a5a70]">
                          {item.sequence ||
                            item.account_information?.sequence ||
                            "-"}
                        </div>
                      </td>

                      {/* Borrower / Account */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div
                          className="text-xs sm:text-sm font-bold text-[#191924] max-w-60 truncate"
                          title={borrowerName}
                        >
                          {borrowerName}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          {accountNumber}
                        </div>
                      </td>

                      {/* Date Of Appraisal */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm text-[#191924]">
                          {formatDisplayDate(appraisalDate)}
                        </div>
                      </td>

                      {/* Appraise Value */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {formatCurrency(appraiseVal)}
                        </div>
                      </td>

                      {/* Loan Value */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {formatCurrency(loanVal)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* 404 / No Data Available State */
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

      {/* Collateral Modal */}
      <CollateralModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        data={selectedItem}
      />
    </div>
  );
}
