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
    <div className="overflow-hidden -mt-9.5">
      {/* <div className="overflow-hidden rounded-lg border border-gray-100 bg-white p-6 shadow-sm"> */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          {/* <h2 className="text-2xl font-bold text-gray-700">By Past Due</h2>
          <p className="mt-1 text-base font medium text-gray-400">
            {pastDue.length} loan accounts
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
                Branch
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Cid
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Member Name
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Account Number
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Product Type
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                Date Released
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider rounded-tr-lg">
                Maturity Date
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            {pastDue.map((item, index) => {
              const rowId = `${item.cid}-${index}`;
              const isExpanded = expandedId === rowId;

              return (
                <React.Fragment key={rowId}>
                  {/* Main Row */}
                  <tr
                    className={cn(
                      "group transition-all",
                      isExpanded ? "bg-[#F3F9F5]" : "bg-white hover:bg-gray=50",
                    )}
                  >
                    <td className="border-y border-l border-gray-100 p-3">
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
                        ></ChevronDown>
                      </button>
                    </td>

                    {/* Branch */}
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-semibold text-gray-900">
                        {item.branch}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div className="font-semibold text-gray-900">
                        {item.cid}
                      </div>
                    </td>

                    <td className="border-y border-gray-100 px-4 py-3 align-top">
                      <div
                        className="maw-w-70 truncate font-semibold text-[#05582E]"
                        title={item.memberName}
                      >
                        {item.memberName}
                      </div>
                    </td>

                    <td className="border-y border-gray-100 px-4 py-3">
                      <span className="font-mono text-[13px]">
                        {item.accountNumber}
                      </span>
                    </td>

                    <td className="border-y border-gray-100 px-4 py-3 whitespace-nowrap">
                      {item.productType}
                    </td>

                    <td className="border-y border-gray-100 px-4 py-3">
                      <div className="font-mono text-[13px]">
                        {formatDate(item.dateReleased)}
                      </div>
                    </td>
                    <td className="border-y border-gray-100 px-4 py-3">
                      <div className="font-mono text-[13px]">
                        {formatDate(item.maturityDate)}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  <ExpandableRow isExpanded={isExpanded} colSpan={9}>
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
                          value: item.dateReleased,
                        },
                        {
                          label: "Maturity Date",
                          value: item.maturityDate,
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
