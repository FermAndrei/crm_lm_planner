"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Eye, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllBranchReports } from "@/services/reports/all-loan.services";
import type { AllBranchReport } from "@/services/types/all-branch/all-branch";
import { TablePagination } from "@/components/ui/table-pagination";
import AccountDetailsModal from "./modals/account-details-modal";

const formatCurrency = (val: number) => {
  if (val === 0) return "0.00";
  return val.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (date: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ByBranch() {
  const [allBranch, setAllBranch] = useState<AllBranchReport[]>([]);
  const [selectedItem, setSelectedItem] = useState<AllBranchReport | null>(
    null,
  );
  const [selectedBranch, setSelectedBranch] = useState("General Santos");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllBranchReports();
        setAllBranch(response.allBranch);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }
    fetchData();
  }, []);

  const branches = useMemo(() => {
    return ["ALL", ...new Set(allBranch.map((item) => item.branch))];
  }, [allBranch]);

  const branchFiltered = useMemo(() => {
    if (selectedBranch === "ALL") {
      return allBranch;
    }
    return allBranch.filter((item) => item.branch === selectedBranch);
  }, [allBranch, selectedBranch]);

  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return branchFiltered;
    const q = searchQuery.toLowerCase();
    return branchFiltered.filter(
      (item) =>
        item.clientName.toLowerCase().includes(q) ||
        item.accountNumber.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q) ||
        item.brCode.toLowerCase().includes(q) ||
        item.custId.toLowerCase().includes(q) ||
        item.prodType.toLowerCase().includes(q) ||
        item.loanStatus.toLowerCase().includes(q),
    );
  }, [branchFiltered, searchQuery]);

  const totalPages = Math.ceil(searchFiltered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBranches = searchFiltered.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || (totalPages > 0 && page > totalPages)) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Top Filter & Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Branch Selector */}
          <div className="relative inline-flex items-center">
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer appearance-none rounded-xl border border-gray-200/90 bg-white py-2 pl-4 pr-9 text-xs sm:text-sm font-semibold text-[#191924] shadow-xs focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#05512A]"
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch === "ALL" ? "All Branches" : branch}
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
        <div className="relative w-72 sm:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-gray-200/90 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#05512A] shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            {/* Header */}
            <thead>
              <tr className="bg-[#F8F9FA] text-[#475467] text-xs font-semibold">
                <th className="whitespace-nowrap px-4 py-3.5 text-center first:rounded-l-xl">
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
                <th className="whitespace-nowrap px-4 py-3.5 text-center last:rounded-r-xl">
                  Loan Status
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {paginatedBranches.length > 0 ? (
                paginatedBranches.map((item, index) => {
                  const rowId = `${item.accountNumber}-${index}`;
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
                          {item.branch}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          {item.brCode}
                        </div>
                      </td>

                      {/* Client */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div
                          className="text-xs sm:text-sm font-bold text-[#191924] max-w-60 truncate"
                          title={item.clientName}
                        >
                          {item.clientName}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          {item.custId}
                        </div>
                      </td>

                      {/* Account */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold font-mono text-[#191924]">
                          {item.accountNumber}
                        </div>
                      </td>

                      {/* Product Type */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-medium text-[#344054]">
                          {item.prodType}
                        </div>
                      </td>

                      {/* Granted */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {formatCurrency(item.originalAmountGranted)}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          {item.interestRate.toFixed(2)}%
                        </div>
                      </td>

                      {/* Term Window */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-medium text-[#191924]">
                          {formatDate(item.dateGranted)}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          → {formatDate(item.maturityDate)}
                        </div>
                      </td>

                      {/* Defprin */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {formatCurrency(item.defPrin)}
                        </div>
                      </td>

                      {/* Loan Status */}
                      <td className="whitespace-nowrap px-4 py-4 text-center align-top">
                        <span
                          className={cn(
                            "inline-block rounded-full px-3 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider",
                            item.loanStatus === "CURRENT"
                              ? "bg-[#DCFCE7] text-[#15803D]"
                              : item.loanStatus === "EXPIRED"
                                ? "bg-[#FFE4E8] text-[#E11D48]"
                                : "bg-[#F4F2FA] text-[#5a5a70]",
                          )}
                        >
                          {item.loanStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-xs sm:text-sm text-gray-500"
                  >
                    No accounts found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          totalRecords={searchFiltered.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
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
