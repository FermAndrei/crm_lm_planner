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
    <div className="overflow-hidden -mt-9.5">
      {/*<div className="overflow-hidden rounded-lg border border-gray-100 bg-white p-6 shadow-sm"> */}

      <div className="mb-4 flex items-center justify-between">
        <div>
          {/* <h2 className="text-2xl font-bold text-gray-700">
            Charge With Collateral
          </h2>

          <p className="mt-1 text-base font-medium text-gray-400">
            {withCollateral.length} loan accounts
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
              <th className="w-12 rounded-tl-lg px-3 py-3">
                <span className="sr-only">Expand</span>
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Branch Booked
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Collateral Type
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Collateral Description
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Sequence
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Name / Acc Number
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Date Of Appraisal
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Appraise Value
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider rounded-tr-lg ">
                Loan Value
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {withCollateral.map((item, index) => {
              const rowId = `${item.acctNumberOfLoan}-${index}`;
              const isExpanded = expandedId === rowId;

              return (
                <React.Fragment key={rowId}>
                  <tr
                    className={cn(
                      "group transition-all",
                      isExpanded ? "bg-[#F3F9F5]" : "bg-white hover:bg-gray-50",
                    )}
                  >
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
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-semibold text-gray-900">
                        {item.branchBooked}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-mono text-[13px] text-gray-900">
                        {item.collateralCode}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="max-w-70 truncate font-semibold text-[#05582E]">
                        {item.collateralDescription}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-mono text-[13px] text-gray-900">
                        {item.sequence}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div
                        className="max-w-70 truncate font-semibold text-[#05582E]"
                        title={item.nameOfBorrower}
                      >
                        {item.nameOfBorrower}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-gray-400">
                        {item.cidNo}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-mono text-[13px] text-gray-900">
                        {formatDate(item.dateOfAppraisal)}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 text-leftf align-top">
                      <div className="font-mono text-[13px] font-semibold text-gray-900">
                        ₱ {formatCurrency(item.appraiseValue)}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 text-leftf align-top">
                      <div className="font-mono text-[13px] font-semibold text-gray-900">
                        ₱ {formatCurrency(item.loanValue)}
                      </div>
                    </td>
                  </tr>

                  <ExpandableRow isExpanded={isExpanded} colSpan={9}>
                    <ExpandableDetails
                      title="Charge W/ Collateral"
                      fields={[
                        { label: "Branch Booked", value: item.branchBooked },
                        {
                          label: "Collateral Type",
                          value: item.collateralType,
                        },
                        {
                          label: "Collateral Description",
                          value: item.collateralDescription,
                        },
                        { label: "Sequence", value: item.sequence },
                        { label: "CID No.", value: item.cidNo },
                        {
                          label: "Account Number",
                          value: item.acctNumberOfLoan,
                        },
                        {
                          label: "Name of Borrower",
                          value: item.nameOfBorrower,
                        },
                        { label: "Description", value: item.description },
                        {
                          label: "Date of Appraisal",
                          value: item.dateOfAppraisal,
                        },
                        { label: "Appraise Value", value: item.appraiseValue },
                        { label: "Loan Value", value: item.loanValue },
                        {
                          label: "Collateral Code",
                          value: item.collateralCode,
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
          <tfoot>
            <tr className="border-t border-gray-200 bg-[#D2E7C4] text-xs font-bold text-[#1D4D3E]">
              <td className="rounded-bl-lg px-3 py-2" />

              <td className="px-3 py-2" />

              <td className="px-4 py-2" />

              <td className="px-4 py-2" />

              <td className="px-4 py-2" />

              <td className="px-4 py-2 text-left">
                <span className="font-black">
                  {withCollateral.length} accounts
                </span>
              </td>

              <td className=" px-4 py-2" />

              <td className="px-4 py-2 text-left font-mono text-sm font-black">
                ₱ {formatCurrency(totalAppraiseValue)}
              </td>

              <td className="px-4 py-2 text-left font-mono text-sm font-black rounded-br-lg">
                ₱ {formatCurrency(totalLoanValue)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
