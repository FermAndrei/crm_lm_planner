"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import type { PastDue as PastDueType } from "@/services/types/past-due/past-due";
import { getPastDue } from "@/services/reports/all-loan.services";
import { TablePagination } from "@/components/ui/table-pagination";
import PastDueModal from "./modals/past-due-modal";

const formatDate = (value: string) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function PastDue() {
  const [pastDueList, setPastDueList] = useState<PastDueType[]>([]);
  const [selectedItem, setSelectedItem] = useState<PastDueType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getPastDue();
        setPastDueList(response.pastDue);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }
    fetchData();
  }, []);

  const filteredPastDue = useMemo(() => {
    if (!searchQuery.trim()) return pastDueList;
    const q = searchQuery.toLowerCase();
    return pastDueList.filter(
      (item) =>
        item.memberName.toLowerCase().includes(q) ||
        item.accountNumber.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q) ||
        item.cid.toLowerCase().includes(q) ||
        item.productType.toLowerCase().includes(q),
    );
  }, [pastDueList, searchQuery]);

  const totalPages = Math.ceil(filteredPastDue.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPastDue = filteredPastDue.slice(
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
                <th className="whitespace-nowrap px-4 py-3.5 text-center first:rounded-l-xl">
                  Action
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Branch
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">CID</th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Member Name
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Account Number
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Product Type
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left">
                  Date Released
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left last:rounded-r-xl">
                  Maturity Date
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {paginatedPastDue.length > 0 ? (
                paginatedPastDue.map((item, index) => {
                  const rowId = `${item.cid}-${index}`;
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
                      </td>

                      {/* CID */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-mono text-[#5a5a70]">
                          {item.cid}
                        </div>
                      </td>

                      {/* Member Name */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div
                          className="text-xs sm:text-sm font-bold text-[#191924] max-w-[240px] truncate"
                          title={item.memberName}
                        >
                          {item.memberName}
                        </div>
                      </td>

                      {/* Account Number */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <span className="text-xs sm:text-sm font-mono font-bold text-[#191924]">
                          {item.accountNumber}
                        </span>
                      </td>

                      {/* Product Type */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <span className="text-xs sm:text-sm font-medium text-[#344054]">
                          {item.productType}
                        </span>
                      </td>

                      {/* Date Released */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-medium text-[#191924]">
                          {formatDate(item.dateReleased)}
                        </div>
                      </td>

                      {/* Maturity Date */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm text-[#667085]">
                          {formatDate(item.maturityDate)}
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
                    No past due accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          totalRecords={filteredPastDue.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Past Due Modal */}
      <PastDueModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        data={selectedItem}
      />
    </div>
  );
}
