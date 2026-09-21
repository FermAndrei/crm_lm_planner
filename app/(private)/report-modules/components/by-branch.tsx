"use client";

import ExpandableRow from "@/components/ui/expandable-row";
import ExpandableDetails from "@/components/ui/expandable-details";
import { cn } from "@/lib/utils";
import { getAllBranchReports } from "@/services/reports/all-loan.services";
import type { AllBranchReport } from "@/services/types/all-branch/all-branch";
import { ChevronDown, Search } from "lucide-react";
import router from "next/router";
import React from "react";
import { useEffect, useMemo, useState } from "react";

const formatCurrency = (value: number) => {
  if (value === 0) return "0";

  return value.toLocaleString("en-US", {
    minimumFractionDigits: value % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  });
};

const formatDate = (value: string) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ByBranch() {
  const [allBranch, setAllBranch] = useState<AllBranchReport[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState("General Santos");
  const [searchQuery, setSearchQuery] = useState("");

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
    return [...new Set(allBranch.map((item) => item.branch))];
  }, [allBranch]);

  const filteredBranches = useMemo(() => {
    if (selectedBranch === "ALL") {
      return allBranch;
    }

    return allBranch.filter((item) => item.branch === selectedBranch);
  }, [allBranch, selectedBranch]);

  const totalOriginalAmount = filteredBranches.reduce(
    (sum, item) => sum + item.originalAmountGranted,
    0,
  );

  const totalDefPrin = filteredBranches.reduce(
    (sum, item) => sum + item.defPrin,
    0,
  );

  const toggleRow = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

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
        <div className="flex flex-wrap items-center gap-2">
          {/* BRANCH SELECTOR */}
          <div className="relative flex items-center">
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setExpandedId(null);
              }}
              className="cursor-pointer appearance-none rounded-full border border-[#191924]/10 bg-[#FAF9FD] py-2 pl-4 pr-9 text-xs font-bold text-[#191924] focus:border-[#356206] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#356206]/20 shadow-xs"
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9ab0]"
            />
          </div>

          <span className="text-xs font-bold text-[#5a5a70] bg-[#FAF9FD] px-3.5 py-1.5 rounded-full border border-[#191924]/8 shadow-xs">
            {filteredBranches.length} accounts
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

      {/* TABLE */}
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
            {filteredBranches.map((item, index) => {
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
                {filteredBranches.length} accounts
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
    </div>
  );
}
