import type { PastDue } from "@/services/types/past-due/past-due";
import { getPastDue } from "@/services/reports/all-loan.services";
import { useEffect, useState } from "react";
import router from "next/router";
import { ChevronDown, Search } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import ExpandableRow from "@/components/ui/expandable-row";
import ExpandableDetails from "@/components/ui/expandable-details";

const formatDate = (value: string) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function PastDue() {
  const [pastDue, setPastDue] = useState<PastDue[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleRow = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getPastDue();
        setPastDue(response.pastDue);
      } catch (error) {
        console.log("Failed to fetch reports:", error);
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

  return (
    <div className="overflow-hidden">
      {/* Header Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#5a5a70] bg-[#FCFDFC] px-3.5 py-1.5 rounded-full border border-[#191924]/8 shadow-xs">
            {pastDue.length} Past Due Accounts
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
                Branch
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                CID
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Member Name
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Account Number
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Product Type
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Date Released
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Maturity Date
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[#F1EEF8]">
            {pastDue.map((item, index) => {
              const rowId = `${item.cid}-${index}`;
              const isExpanded = expandedId === rowId;

              return (
                <React.Fragment key={rowId}>
                  {/* Main Row */}
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

                    {/* Branch */}
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-bold text-[#191924]">
                        {item.branch}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-mono text-xs text-[#5a5a70]">
                        {item.cid}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 align-top">
                      <div
                        className="max-w-70 truncate font-bold text-[#191924] transition-colors"
                        title={item.memberName}
                      >
                        {item.memberName}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 align-top">
                      <span className="font-mono text-xs font-semibold text-[#191924]">
                        {item.accountNumber}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 align-top">
                      <span className="text-xs font-medium text-[#5a5a70]">
                        {item.productType}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 align-top">
                      <div className="font-mono text-xs text-[#191924]">
                        {formatDate(item.dateReleased)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-mono text-xs text-[#5a5a70]">
                        {formatDate(item.maturityDate)}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  <ExpandableRow isExpanded={isExpanded} colSpan={8}>
                    <ExpandableDetails
                      title="Past Due Details"
                      fields={[
                        { label: "Branch", value: item.branch },
                        {
                          label: "CID",
                          value: item.cid,
                        },
                        {
                          label: "Member Name",
                          value: item.memberName,
                        },
                        {
                          label: "Account Number",
                          value: item.accountNumber,
                        },
                        {
                          label: "Product Type",
                          value: item.productType,
                        },
                        {
                          label: "Date Released",
                          value: formatDate(item.dateReleased),
                        },
                        {
                          label: "Maturity Date",
                          value: formatDate(item.maturityDate),
                        },
                        {
                          label: "Principal Release",
                          value: item.principalReleased,
                        },
                        {
                          label: "Outstanding Principal",
                          value: item.outstandingPrincipal,
                        },
                        {
                          label: "Start Arrears",
                          value: item.startArrears,
                        },
                        {
                          label: "Days of Arrears",
                          value: item.daysOfArrears,
                        },
                        {
                          label: "PAR Amount",
                          value: item.parAmount,
                        },
                        {
                          label: "Default Principal",
                          value: item.defaultPrincipal,
                        },
                        {
                          label: "Default Interest",
                          value: item.defaultInterest,
                        },
                        {
                          label: "Date of Last Payment",
                          value: item.dateOfLastPayment,
                        },
                      ]}
                    />
                  </ExpandableRow>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
