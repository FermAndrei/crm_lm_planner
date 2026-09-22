"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { getWithCollateral } from "@/services/reports/all-loan.services";
import type { WithCollateral as WithCollateralType } from "@/services/types/with-collateral/with-collateral";
import { TablePagination } from "@/components/ui/table-pagination";
import CollateralModal from "./modals/collateral-modal";

const formatDate = (date: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (val: number) => {
  if (val === 0) return "0.00";
  return val.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function WithCollateral() {
  const [collateralList, setCollateralList] = useState<WithCollateralType[]>(
    [],
  );
  const [selectedItem, setSelectedItem] = useState<WithCollateralType | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getWithCollateral();
        setCollateralList(response.withCollateral);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }
    fetchData();
  }, []);

  const filteredCollateral = useMemo(() => {
    if (!searchQuery.trim()) return collateralList;
    const q = searchQuery.toLowerCase();
    return collateralList.filter(
      (item) =>
        item.nameOfBorrower.toLowerCase().includes(q) ||
        item.acctNumberOfLoan.toLowerCase().includes(q) ||
        item.branchBooked.toLowerCase().includes(q) ||
        item.collateralDescription.toLowerCase().includes(q) ||
        item.collateralCode.toLowerCase().includes(q),
    );
  }, [collateralList, searchQuery]);

  const totalPages = Math.ceil(filteredCollateral.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCollateral = filteredCollateral.slice(
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
            className="w-full rounded-md border border-gray-200/90 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#05512A] shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-md border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="overflow-x-auto">
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
              {paginatedCollateral.length > 0 ? (
                paginatedCollateral.map((item, index) => {
                  const rowId = `${item.acctNumberOfLoan}-${index}`;
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
                          {item.branchBooked}
                        </div>
                      </td>

                      {/* Collateral Type */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-mono font-bold text-[#191924]">
                          {item.collateralCode}
                        </div>
                      </td>

                      {/* Collateral Description */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-medium text-[#191924] max-w-55 truncate">
                          {item.collateralDescription}
                        </div>
                      </td>

                      {/* Sequence */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-mono text-[#5a5a70]">
                          {item.sequence}
                        </div>
                      </td>

                      {/* Borrower / Account */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div
                          className="text-xs sm:text-sm font-bold text-[#191924] max-w-60 truncate"
                          title={item.nameOfBorrower}
                        >
                          {item.nameOfBorrower}
                        </div>
                        <div className="mt-0.5 text-xs text-[#667085]">
                          {item.acctNumberOfLoan}
                        </div>
                      </td>

                      {/* Date Of Appraisal */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm text-[#191924]">
                          {formatDate(item.dateOfAppraisal)}
                        </div>
                      </td>

                      {/* Appraise Value */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          ₱ {formatCurrency(item.appraiseValue)}
                        </div>
                      </td>

                      {/* Loan Value */}
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <div className="text-xs sm:text-sm font-bold text-[#191924]">
                          ₱ {formatCurrency(item.loanValue)}
                        </div>
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
                    No collateral records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          totalRecords={filteredCollateral.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
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
