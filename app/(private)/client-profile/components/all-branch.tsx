"use client";

import { cn } from "@/lib/utils";
import { getAllBranchReports } from "@/services/reports/all-loan.services";
import type { AllBranchReport } from "@/services/types/all-branch/all-branch";
import { ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ExpandableDetails from "@/components/ui/expandable-details";
import ExpandableRow from "@/components/ui/expandable-row";
import { TablePagination } from "@/components/ui/table-pagination";

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

export default function AllBranch() {
  const router = useRouter();
  const [allBranches, setAllBranches] = useState<AllBranchReport[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const toggleRow = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllBranchReports();
        setAllBranches(response.allBranch);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }

    fetchData();
  }, []);

  const totalPages = Math.ceil(allBranches.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedBranches = allBranches.slice(startIndex, endIndex);

  const totalOriginalAmount = allBranches.reduce(
    (acc, r) => acc + r.originalAmountGranted,
    0,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setExpandedId(null);
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    setExpandedId(null);
  };

  const totalDefPrin = allBranches.reduce((acc, r) => acc + r.defPrin, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="overflow-hidden -mt-9.5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          {/* <h2 className="text-2xl font-bold text-gray-700">
            All Branch Loan Accounts
          </h2> */}

          {/* <p className="mt-1 text-base font-medium text-gray-400">
            {allBranches.length} loan accounts
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
          {/* HEADER */}
          <thead>
            <tr className="bg-[#05512A] text-white">
              <th className="w-12 rounded-tl-lg px-3 py-3">
                <span className="sr-only">Expand</span>
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Branch
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Client
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Account
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Product Type
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Granted
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Term Window
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                DefPrin
              </th>

              <th className="whitespace-nowrap rounded-tr-lg px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Loan Status
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-100">
            {paginatedBranches.map((item, index) => {
              const rowId = `${item.accountNumber}-${index}`;
              const isExpanded = expandedId === rowId;

              return (
                <React.Fragment key={rowId}>
                  {/* MAIN ROW */}
                  <tr
                    className={cn(
                      "group transition-all",
                      isExpanded ? "bg-[#F3F9F5]" : "bg-white hover:bg-gray-50",
                    )}
                  >
                    {/* Expand */}
                    <td className="border-y border-l border-gray-100 px-3 py-3">
                      <button
                        type="button"
                        onClick={() => toggleRow(rowId)}
                        aria-expanded={isExpanded}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-all hover:bg-[#E5F2EA] hover:text-[#05582E]"
                      >
                        <ChevronDown
                          size={17}
                          className={cn(
                            "transition-transform duration-200",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                    </td>

                    {/* Branch */}
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-semibold text-gray-900">
                        {item.branch}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-gray-400">
                        {item.brCode}
                      </div>
                    </td>

                    {/* Client */}
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div
                        className="max-w-70 truncate font-semibold text-[#05582E]"
                        title={item.clientName}
                      >
                        {item.clientName}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-gray-400">
                        {item.custId}
                      </div>
                    </td>

                    {/* Account */}
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-mono text-[13px] text-gray-900">
                        {item.accountNumber}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="whitespace-nowrap border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-mono text-[13px] text-gray-900">
                        {item.prodType}
                      </div>
                    </td>

                    {/* Granted */}
                    <td className="border-y border-gray-100 px-4 py-3 text-left align-top">
                      <div className="font-mono text-[13px] font-semibold text-gray-900">
                        ₱ {formatCurrency(item.originalAmountGranted)}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-gray-400">
                        {item.interestRate.toFixed(2)}%
                      </div>
                    </td>

                    {/* Term */}
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-mono text-[13px] text-gray-900">
                        {formatDate(item.dateGranted)}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-gray-400">
                        → {formatDate(item.maturityDate)}
                      </div>

                      <div className="mt-0.5 text-xs text-gray-400">
                        {item.term ? `${item.term} months` : "No term"}
                      </div>
                    </td>

                    {/* DefPrin */}
                    <td className="border-y border-gray-100 px-4 py-3 text-left align-top">
                      <div className="font-mono text-[13px] font-semibold text-gray-900">
                        ₱ {formatCurrency(item.defPrin)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="border-y border-r border-gray-100 px-4 py-3 text-center align-top">
                      <span
                        className={cn(
                          "inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          item.loanStatus === "CURRENT"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.loanStatus === "EXPIRED"
                              ? "bg-red-50 text-red-700"
                              : "bg-gray-50 text-gray-600",
                        )}
                      >
                        {item.loanStatus}
                      </span>
                    </td>
                  </tr>

                  {/* EXPANDED ROW */}
                  <ExpandableRow isExpanded={isExpanded} colSpan={9}>
                    <ExpandableDetails
                      title="Loan Account Details"
                      fields={[
                        {
                          label: "BRCode",
                          value: item.brCode,
                        },
                        {
                          label: "Branch",
                          value: item.branch,
                        },
                        {
                          label: "Customer ID",
                          value: item.custId,
                        },
                        {
                          label: "Client Name",
                          value: item.clientName,
                        },
                        {
                          label: "Account Number",
                          value: item.accountNumber,
                        },
                        {
                          label: "Product Type",
                          value: item.prodType,
                        },
                        {
                          label: "Original Amount",
                          value: `₱ ${formatCurrency(item.originalAmountGranted)}`,
                        },
                        {
                          label: "Interest Rate",
                          value: `${item.interestRate.toFixed(2)}%`,
                        },
                        {
                          label: "Term",
                          value: item.term ? `${item.term} months` : "—",
                        },
                        {
                          label: "Date Granted",
                          value: formatDate(item.dateGranted),
                        },
                        {
                          label: "Maturity Date",
                          value: formatDate(item.maturityDate),
                        },
                        {
                          label: "Outstanding Balance",
                          value: `₱ ${formatCurrency(item.outstandingBalance)}`,
                        },
                        {
                          label: "Loan Status",
                          value: item.loanStatus,
                        },
                        {
                          label: "Aging Status",
                          value: item.agingStatus,
                        },
                        {
                          label: "DefPrin",
                          value: `₱ ${formatCurrency(item.defPrin)}`,
                        },
                        {
                          label: "DefInt",
                          value: `₱ ${formatCurrency(item.defInt)}`,
                        },
                        {
                          label: "Days Past Due",
                          value: String(item.noOfDaysPastDue),
                        },
                      ]}
                    />
                  </ExpandableRow>
                </React.Fragment>
              );
            })}
          </tbody>

          {/* FOOTER */}
          <tfoot>
            <tr className="border-t border-gray-200 bg-[#D2E7C4] text-xs font-bold text-[#1D4D3E]">
              <td className="rounded-bl-lg px-3 py-2" />

              <td className="px-4 py-2">
                <span className="font-black">TOTAL</span>
              </td>

              <td className="px-4 py-2" />

              <td className="px-4 py-2 text-left">
                <span className="font-black">
                  {allBranches.length} accounts
                </span>
              </td>

              <td className="px-4 py-2" />

              <td className="px-4 py-2 text-left font-mono text-sm font-black">
                ₱ {formatCurrency(totalOriginalAmount)}
              </td>

              <td className="px-4 py-2" />

              <td className="px-4 py-2 text-left font-mono text-sm font-black">
                ₱ {formatCurrency(totalDefPrin)}
              </td>

              <td className="rounded-br-lg px-4 py-2" />
            </tr>
          </tfoot>
        </table>
      </div>

      <TablePagination
        totalRecords={allBranches.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
