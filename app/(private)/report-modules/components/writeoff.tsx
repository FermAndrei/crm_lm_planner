"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TablePagination } from "@/components/ui/table-pagination";
import { getWriteOff } from "@/services/reports/all-loan.services";
import type { WriteOffDate } from "@/services/types/writeoff/writeoff";

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

export default function WriteOff() {
  const [writeOffList, setWriteOffList] = useState<WriteOffDate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getWriteOff();
        setWriteOffList(response.writeOffDate);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }
    fetchData();
  }, []);

  const filteredWriteOff = useMemo(() => {
    if (!searchQuery.trim()) return writeOffList;
    const q = searchQuery.toLowerCase();
    return writeOffList.filter(
      (item) =>
        item.memberName.toLowerCase().includes(q) ||
        item.accountNumber.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q) ||
        item.cid.toLowerCase().includes(q) ||
        item.productType.toLowerCase().includes(q),
    );
  }, [writeOffList, searchQuery]);

  const totalPages = Math.ceil(filteredWriteOff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWriteOff = filteredWriteOff.slice(
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
      {/* Top Header & Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                <th className="whitespace-nowrap px-4 py-3.5 text-left first:rounded-l-xl">
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
                <th className="whitespace-nowrap px-4 py-3.5 text-center last:rounded-r-xl">
                  Write-off Date
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {paginatedWriteOff.length > 0 ? (
                paginatedWriteOff.map((item, index) => {
                  const rowId = `${item.accountNumber}-${index}`;
                  return (
                    <tr
                      key={rowId}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Branch */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          {item.branch}
                        </div>
                      </td>

                      {/* Name / CID */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div
                          className="text-xs sm:text-sm font-bold text-[#191924] max-w-60 truncate"
                          title={item.memberName}
                        >
                          {item.memberName}
                        </div>
                        <div className="mt-0.5 text-xs font-mono text-[#5a5a70]">
                          {item.cid}
                        </div>
                      </td>

                      {/* Account Number */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold font-mono text-[#191924]">
                          {item.accountNumber}
                        </div>
                      </td>

                      {/* Product Type */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-medium text-[#344054]">
                          {item.productType}
                        </div>
                      </td>

                      {/* Term Window */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-medium text-[#191924]">
                          {formatDate(item.dateReleased)}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          → {formatDate(item.maturityDate)}
                        </div>
                      </td>

                      {/* Principal Released */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          ₱ {formatCurrency(item.principalReleased)}
                        </div>
                      </td>

                      {/* Outstanding Principal */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#E11D48]">
                          ₱ {formatCurrency(item.outstandingPrincipal)}
                        </div>
                      </td>

                      {/* Write-off Date */}
                      <td className="whitespace-nowrap px-4 py-4 text-center align-top">
                        <div className="text-xs sm:text-sm text-[#5a5a70]">
                          {formatDate(item.writeoffdate || item.dateReleased)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-xs sm:text-sm text-gray-500"
                  >
                    No charged off accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          totalRecords={filteredWriteOff.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
}
