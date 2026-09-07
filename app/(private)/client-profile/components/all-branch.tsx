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
    <div className="overflow-hidden">
      {/* Header Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#5a5a70] bg-[#FCFDFC] px-3.5 py-1.5 rounded-full border border-[#191924]/8 shadow-xs">
            {allBranches.length} Total Accounts
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
          {/* HEADER */}
          <thead className="bg-[#05512A] text-white">
            <tr className="bg-[#05512A] text-white">
              <th className="w-12 px-3 py-3.5 text-center">
                <span className="sr-only">Expand</span>
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Branch
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Client
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Account
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Product Type
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider">
                Granted
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Term Window
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider">
                DefPrin
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider">
                Loan Status
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-[#F1EEF8]">
            {paginatedBranches.map((item, index) => {
              const rowId = `${item.accountNumber}-${index}`;
              const isExpanded = expandedId === rowId;

              return (
                <React.Fragment key={rowId}>
                  {/* MAIN ROW */}
                  <tr
                    className={cn(
                      "group transition-colors",
                      isExpanded ? "bg-[#F3F9F5]" : "bg-white hover:bg-gray-50",
                    )}
                  >
                    {/* Expand */}
                    <td className="px-3 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggleRow(rowId)}
                        aria-expanded={isExpanded}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#9a9ab0] transition-all hover:bg-[#EBFDF4] hover:text-[#5fa53c]"
                      >
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform duration-200",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                    </td>

                    {/* Branch */}
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-bold text-[#191924]">
                        {item.branch}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-[#5a5a70]">
                        {item.brCode}
                      </div>
                    </td>

                    {/* Client */}
                    <td className="px-4 py-3.5 align-top">
                      <div
                        className="max-w-70 truncate font-bold text-[#191924] transition-colors"
                        title={item.clientName}
                      >
                        {item.clientName}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-[#5a5a70]">
                        {item.custId}
                      </div>
                    </td>

                    {/* Account */}
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-mono text-xs font-semibold text-[#191924]">
                        {item.accountNumber}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="whitespace-nowrap px-4 py-3.5 align-top">
                      <div className="text-xs font-medium text-[#5a5a70]">
                        {item.prodType}
                      </div>
                    </td>

                    {/* Granted */}
                    <td className="px-4 py-3.5 text-right align-top">
                      <div className="font-mono text-xs font-bold text-[#191924]">
                        ₱ {formatCurrency(item.originalAmountGranted)}
                      </div>

                      <div className="mt-0.5 font-mono text-[11px] text-[#5a5a70]">
                        {item.interestRate.toFixed(2)}%
                      </div>
                    </td>

                    {/* Term */}
                    <td className="px-4 py-3.5 align-top">
                      <div className="text-xs font-medium text-[#191924]">
                        {formatDate(item.dateGranted)}
                      </div>

                      <div className="mt-0.5 text-xs text-[#5a5a70]">
                        → {formatDate(item.maturityDate)}
                      </div>

                      <div className="mt-0.5 text-[11px] text-[#9a9ab0]">
                        {item.term ? `${item.term} mos` : "—"}
                      </div>
                    </td>

                    {/* DefPrin */}
                    <td className="px-4 py-3.5 text-right align-top">
                      <div className="font-mono text-xs font-bold text-[#191924]">
                        ₱ {formatCurrency(item.defPrin)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-center align-top">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider",
                          item.loanStatus === "CURRENT"
                            ? "bg-[#E2F6ED] text-[#12946a]"
                            : item.loanStatus === "EXPIRED"
                              ? "bg-[#FFE3EE] text-[#E0509A]"
                              : "bg-[#F4F2FA] text-[#5a5a70]",
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
          <tfoot className="border-t-2 border-[#191924]/10 bg-[#D2E7C4]">
            <tr className="text-xs font-extrabold text-[#191924]">
              <td className="px-3 py-3.5 text-center" />

              <td className="px-4 py-3.5 uppercase tracking-wider font-extrabold">
                TOTAL
              </td>

              <td className="px-4 py-3.5 font-bold text-[#5a5a70]">
                {allBranches.length} accounts
              </td>

              <td colSpan={2} className="px-4 py-3.5" />

              <td className="px-4 py-3.5 text-right font-mono text-sm font-extrabold text-[#191924]">
                ₱ {formatCurrency(totalOriginalAmount)}
              </td>

              <td className="px-4 py-3.5" />

              <td className="px-4 py-3.5 text-right font-mono text-sm font-extrabold text-[#191924]">
                ₱ {formatCurrency(totalDefPrin)}
              </td>

              <td className="px-4 py-3.5" />
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
