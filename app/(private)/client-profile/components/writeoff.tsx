import { TablePagination } from "@/components/ui/table-pagination";
import { cn } from "@/lib/utils";
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
    <div className="overflow-hidden -mt-9.5">
      {/* <div className="overflow-hidden rounded-lg border border-gray-100 bg-white p-6 shadow-sm"> */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          {/* <h2 className="text-2xl font-bold text-gray-700">
            Charged Off Client
          </h2>
          <p className="mt-1 text-base font-medium text-gray-400">
            {writeOffDate.length} Client
          </p> */}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden lg:block">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-84 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm transition-all focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#3a8b62]"
            />
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {/* Header */}
          <thead>
            <tr className="bg-[#05512A] text-white">
              <th className="rounded-tl-lg whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Branch
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Name / CID
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Account Number
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Product Type
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Term Window
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-black uppercase tracking-wider">
                Principal Released
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-black uppercase tracking-wider">
                Outstanding Principal
              </th>
              <th className="whitespace-nowrap rounded-tr-lg px-4 py-3 text-center text-xs font-black uppercase tracking-wider">
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
                  <tr>
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-semibold text-gray-900">
                        {item.branch}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div
                        className="max-w-70 truncate font-semibold text-[#05582E]"
                        title={item.memberName}
                      >
                        {item.memberName}
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-gray-400">
                        {item.cid}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-mono text-[13px] text-gray-900">
                        {item.accountNumber}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-mono text-[13px] text-gray-900">
                        {item.productType}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-mono text-[13px] text-gray-900">
                        {formatDate(item.dateReleased)}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-gray-400">
                        → {formatDate(item.maturityDate)}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 text-right align-top">
                      <div className="font-mono text-[13px] font-semibold text-gray-900">
                        ₱ {formatCurrency(item.principalReleased)}.00
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 text-right align-top">
                      <div className="font-mono text-[13px] font-semibold text-gray-900">
                        ₱ {formatCurrency(item.outstandingPrincipal)}.00
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-mono text-right text-[13px] text-gray-900">
                        {formatDate(item.dateReleased)}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>

          {/* Footer */}
          <tfoot>
            <tr className="border-t border-gray-200 bg-[#D2E7C4] text-xs font-bold text-[#1D4D3E]">
              <td className="rounded-bl-lg px-3 py-2" />

              <td className="px-4 py-2" />

              <td className="px-4 text-center py-2">
                <span className="font-black">
                  {writeOffDate.length} accounts
                </span>
              </td>
              <td className="px-4 py-2" />

              <td className="px-4 py-2" />

              <td className="px-4 py-2 text-right font-mono text-sm font-black">
                ₱ {formatCurrency(totalPrincipal)}
              </td>
              <td className="px-4 py-2 text-right font-mono text-sm font-black">
                ₱ {formatCurrency(totalOutstandingBalance)}
              </td>
              <td className="px-4 py-2" />
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
