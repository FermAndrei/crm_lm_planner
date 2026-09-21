"use client";

import ExpandableDetails from "@/components/ui/expandable-details";
import ExpandableRow from "@/components/ui/expandable-row";
import { cn } from "@/lib/utils";
import { getWithCollateral } from "@/services/reports/all-loan.services";
import type { WithCollateral } from "@/services/types/with-collateral/with-collateral";
import { ChevronDown, Search } from "lucide-react";
import router from "next/router";
import React, { useEffect, useState } from "react";

const formatDate = (date: string) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (val: number) => {
  if (val === 0) return "0";

  return val.toLocaleString("en-US", {
    minimumFractionDigits: val % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  });
};

export default function WithCollateral() {
  const [withCollateral, setWithCollateral] = useState<WithCollateral[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleRow = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getWithCollateral();
        setWithCollateral(response.withCollateral);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const totalAppraiseValue = withCollateral.reduce(
    (acc, r) => acc + r.appraiseValue,
    0,
  );

  const totalLoanValue = withCollateral.reduce(
    (acc, r) => acc + r.loanValue,
    0,
  );

  return (
    <div className="overflow-hidden">
      {/* Header Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#5a5a70] bg-[#FCFDFC] px-3.5 py-1.5 rounded-full border border-[#191924]/8 shadow-xs">
            {withCollateral.length} Collateral Records
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
              <th className="w-12 px-3 py-3.5 text-center">
                <span className="sr-only">Expand</span>
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Branch Booked
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Collateral Type
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Collateral Description
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Sequence
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Borrower / Account
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Date Of Appraisal
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider">
                Appraise Value
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider">
                Loan Value
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F1EEF8]">
            {withCollateral.map((item, index) => {
              const rowId = `${item.acctNumberOfLoan}-${index}`;
              const isExpanded = expandedId === rowId;

              return (
                <React.Fragment key={rowId}>
                  <tr
                    className={cn(
                      "group transition-colors",
                      isExpanded ? "bg-[#F3F9F5]" : "bg-white hover:bg-gray-50",
                    )}
                  >
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
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-bold text-[#191924]">
                        {item.branchBooked}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-mono text-xs font-semibold text-[#191924]">
                        {item.collateralCode}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="max-w-70 truncate font-semibold text-[#191924]">
                        {item.collateralDescription}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-mono text-xs text-[#5a5a70]">
                        {item.sequence}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div
                        className="max-w-70 truncate font-bold text-[#191924] transition-colors"
                        title={item.nameOfBorrower}
                      >
                        {item.nameOfBorrower}
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-[#5a5a70]">
                        {item.acctNumberOfLoan}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-mono text-xs text-[#191924]">
                        {formatDate(item.dateOfAppraisal)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right align-top">
                      <div className="font-mono text-xs font-bold text-[#191924]">
                        ₱ {formatCurrency(item.appraiseValue)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right align-top">
                      <div className="font-mono text-xs font-extrabold text-[#191924]">
                        ₱ {formatCurrency(item.loanValue)}
                      </div>
                    </td>
                  </tr>

                  <ExpandableRow isExpanded={isExpanded} colSpan={9}>
                    <ExpandableDetails
                      title="Collateral Details"
                      fields={[
                        {
                          label: "Branch Booked",
                          value: item.branchBooked,
                        },
                        {
                          label: "Collateral Code",
                          value: item.collateralCode,
                        },
                        {
                          label: "Collateral Description",
                          value: item.collateralDescription,
                        },
                        { label: "Sequence", value: item.sequence },
                        {
                          label: "Account Number",
                          value: item.acctNumberOfLoan,
                        },
                        {
                          label: "Name of Borrower",
                          value: item.nameOfBorrower,
                        },
                        {
                          label: "Date of Appraisal",
                          value: formatDate(item.dateOfAppraisal),
                        },
                        {
                          label: "Appraise Value",
                          value: `₱ ${formatCurrency(item.appraiseValue)}`,
                        },
                        {
                          label: "Loan Value",
                          value: `₱ ${formatCurrency(item.loanValue)}`,
                        },
                        {
                          label: "Collateral Code Desc.",
                          value: item.collateralCodeDesc,
                        },
                        { label: "Review Date", value: item.reviewDateFqu },
                        { label: "Value Date", value: item.valueDate },
                        { label: "Expiry Date", value: item.expiryDate },
                        { label: "Address", value: item.address },
                        { label: "Notes", value: item.notes },
                      ]}
                    />
                  </ExpandableRow>
                </React.Fragment>
              );
            })}
          </tbody>

          {/* Footer */}
          <tfoot className="border-t-2 border-[#191924]/10 bg-[#D2E7C4]">
            <tr className="text-xs font-extrabold text-[#1D4D3E]">
              <td className="px-3 py-3.5 text-center" />

              <td className="px-4 py-3.5 uppercase tracking-wider font-extrabold">
                TOTAL
              </td>

              <td colSpan={3} className="px-4 py-3.5" />

              <td className="px-4 py-3.5 font-bold text-[#5a5a70]">
                {withCollateral.length} accounts
              </td>

              <td className="px-4 py-3.5" />

              <td className="px-4 py-3.5 text-right font-mono text-sm font-extrabold text-[#191924]">
                ₱ {formatCurrency(totalAppraiseValue)}
              </td>

              <td className="px-4 py-3.5 text-right font-mono text-sm font-extrabold text-[#191924]">
                ₱ {formatCurrency(totalLoanValue)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
