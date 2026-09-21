"use client";

import { TablePagination } from "@/components/ui/table-pagination";
import { getWriteOff } from "@/services/reports/all-loan.services";
import { WriteOffDate } from "@/services/types/writeoff/writeoff";
import { Search } from "lucide-react";
import router from "next/router";
import React from "react";
import { useEffect, useState } from "react";

const formatCurrency = (val: number) => {
  if (val === 0) return "0";

  return val.toLocaleString("en-US", {
    minimumFractionDigits: val % 1 !== 0 ? 2 : 0,
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
  const [writeOffDate, setWriteOffDate] = useState<WriteOffDate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getWriteOff();
        setWriteOffDate(response.writeOffDate);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }
    fetchData();
  }, []);

  const totalPages = Math.ceil(writeOffDate.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginationWriteOff = writeOffDate.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    // setExpandedId(null);
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    // setExpandedId(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const totalPrincipal = writeOffDate.reduce(
    (acc, r) => acc + r.principalReleased,
    0,
  );

  const totalOutstandingBalance = writeOffDate.reduce(
    (acc, r) => acc + r.outstandingPrincipal,
    0,
  );

  return (
    <div className="overflow-hidden">
      {/* Header Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#5a5a70] bg-[#FCFDFC] px-3.5 py-1.5 rounded-full border border-[#191924]/8 shadow-xs">
            {writeOffDate.length} Charged Off Accounts
          </span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="block">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9ab0]"
            />

            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 sm:w-80 rounded-full border border-[#191924]/10 bg-[#FAF9FD] py-2 pl-10 pr-4 text-xs font-semibold text-[#191924] placeholder:text-[#9a9ab0] focus:border-[#356206] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#356206]/20 shadow-xs transition-all"
            />
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#191924]/8 bg-white shadow-xs">
        <table className="w-full border-collapse text-sm">
          {/* Header */}
          <thead className="bg-[#05512A] text-white">
            <tr className="bg-[#05512A] text-white">
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Branch
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Name / CID
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Account Number
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Product Type
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Term Window
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider">
                Principal Released
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider">
                Outstanding Principal
              </th>
              <th className="whitespace-nowrap px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider">
                Write-off Date
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            {paginationWriteOff.map((item, index) => {
              const rowId = `${item.accountNumber}-${index}`;
              return (
                <React.Fragment key={rowId}>
                  <tr className="group transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-bold text-[#191924]">
                        {item.branch}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div
                        className="max-w-70 truncate font-bold text-[#191924] transition-colors"
                        title={item.memberName}
                      >
                        {item.memberName}
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-[#5a5a70]">
                        {item.cid}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-mono text-xs font-semibold text-[#191924]">
                        {item.accountNumber}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 align-top">
                      <div className="text-xs font-medium text-[#5a5a70]">
                        {item.productType}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-mono text-xs text-[#191924]">
                        {formatDate(item.dateReleased)}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-[#5a5a70]">
                        → {formatDate(item.maturityDate)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right align-top">
                      <div className="font-mono text-xs font-bold text-[#191924]">
                        ₱ {formatCurrency(item.principalReleased)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right align-top">
                      <div className="font-mono text-xs font-extrabold text-[#E0509A]">
                        ₱ {formatCurrency(item.outstandingPrincipal)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center align-top">
                      <div className="font-mono text-xs text-[#5a5a70]">
                        {formatDate(item.dateReleased)}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>

          {/* Footer */}
          <tfoot className="border-t-2 border-[#191924]/10 bg-[#D2E7C4]">
            <tr className="text-xs font-extrabold text-[#191924]">
              <td className="px-4 py-3.5 uppercase tracking-wider font-extrabold">
                TOTAL
              </td>

              <td className="px-4 py-3.5 font-bold text-[#5a5a70]">
                {writeOffDate.length} accounts
              </td>

              <td colSpan={3} className="px-4 py-3.5" />

              <td className="px-4 py-3.5 text-right font-mono text-sm font-extrabold text-[#191924]">
                ₱ {formatCurrency(totalPrincipal)}
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-sm font-extrabold text-[#191924]">
                ₱ {formatCurrency(totalOutstandingBalance)}
              </td>
              <td className="px-4 py-3.5" />
            </tr>
          </tfoot>
        </table>
      </div>
      <TablePagination
        totalRecords={writeOffDate.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
