"use client";

import ExpandableRow from "@/components/ui/expandable-row";
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
    <div className="overflow-hidden -mt-9.5">
      {/* <div className="overflow-hidden rounded-lg border border-gray-100 bg-white p-6 shadow-sm"> */}
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          {/* <h2 className="text-2xl font-bold text-gray-700">By Branch</h2> */}

          {/* <p className="mt-1 text-sm font-medium text-gray-400">
            {filteredBranches.length} loan accounts
          </p> */}
        </div>

        <div className="flex gap-2">
          {/* BRANCH SELECTOR */}
          <div className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm font-semibold text-gray-700">
            <span className="whitespace-nowrap">Select Branch:</span>

            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setExpandedId(null);
              }}
              className="cursor-pointer bg-transparent pr-2 font-bold text-gray-900 outline-none"
            >
              {branches.map((branch) => (
                <option key={branch} value={branch} className="pr-2 ">
                  {branch}
                </option>
              ))}
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
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
      </div>

      {/* TABLE */}
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

              <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-black uppercase tracking-wider">
                Granted
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Term Window
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-black uppercase tracking-wider">
                DefPrin
              </th>

              <th className="whitespace-nowrap rounded-tr-lg px-4 py-3 text-right text-xs font-black uppercase tracking-wider">
                Loan Status
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-100">
            {filteredBranches.map((item, index) => {
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
                    {/* EXPAND */}
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

                    {/* BRANCH */}
                    <td className="border-y border-gray-100 px-4 py-3">
                      <div className="font-semibold text-gray-900">
                        {item.branch}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-gray-400">
                        {item.brCode}
                      </div>
                    </td>

                    {/* CLIENT */}
                    <td className="border-y border-gray-100 px-4 py-3">
                      <div className="max-w-70 truncate font-semibold text-[#05582E]">
                        {item.clientName}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-gray-400">
                        {item.custId}
                      </div>
                    </td>

                    {/* ACCOUNT */}
                    <td className="border-y border-gray-100 px-4 py-3">
                      <span className="font-mono text-[13px]">
                        {item.accountNumber}
                      </span>
                    </td>

                    {/* PRODUCT */}
                    <td className="border-y border-gray-100 px-4 py-3 whitespace-nowrap">
                      {item.prodType}
                    </td>

                    {/* GRANTED */}
                    <td className="border-y border-gray-100 px-4 py-3 text-right">
                      <div className="font-mono font-semibold">
                        ₱ {formatCurrency(item.originalAmountGranted)}
                      </div>

                      <div className="text-xs text-gray-400">
                        {item.interestRate.toFixed(2)}%
                      </div>
                    </td>

                    {/* TERM */}
                    <td className="border-y border-gray-100 px-4 py-3">
                      <div className="font-mono text-[13px]">
                        {formatDate(item.dateGranted)}
                      </div>

                      <div className="text-xs text-gray-400">
                        → {formatDate(item.maturityDate)}
                      </div>

                      <div className="text-xs text-gray-400">
                        {item.term ? `${item.term} months` : "No term"}
                      </div>
                    </td>

                    {/* DEFPRIN */}
                    <td className="border-y border-gray-100 px-4 py-3 text-right font-mono">
                      ₱ {formatCurrency(item.defPrin)}
                    </td>

                    {/* STATUS */}
                    <td className="border-y border-r border-gray-100 px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
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

                  {/* EXPANDED DETAILS */}
                  <ExpandableRow
                    isExpanded={isExpanded}
                    colSpan={9}
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
                </React.Fragment>
              );
            })}
          </tbody>

          {/* FOOTER */}
          <tfoot>
            <tr className="border-t border-gray-200 bg-[#D2E7C4] text-xs font-bold text-[#1D4D3E]">
              <td className="rounded-bl-lg px-3 py-2" />

              <td className="px-4 py-2 font-black">TOTAL</td>

              <td className="px-4 py-2">{filteredBranches.length} accounts</td>

              <td colSpan={2} />

              <td className="px-4 py-2 text-right font-mono font-black">
                ₱ {formatCurrency(totalOriginalAmount)}
              </td>

              <td />

              <td className="px-4 py-2 text-right font-mono font-black">
                ₱ {formatCurrency(totalDefPrin)}
              </td>

              <td className="rounded-br-lg px-4 py-2" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
