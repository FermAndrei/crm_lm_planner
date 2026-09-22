"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getProductType } from "@/services/reports/all-loan.services";
import type { ProductType } from "@/services/types/product-type/product-type";

const formatCurrency = (val: number) => {
  if (val === 0) return "0.00";
  return val.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function ProductTypePage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProductType();
        setProductTypes(response.productType);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }
    fetchData();
  }, []);

  const filteredProductTypes = useMemo(() => {
    if (!searchQuery.trim()) return productTypes;
    const q = searchQuery.toLowerCase();
    return productTypes.filter((item) =>
      item.prodType.toLowerCase().includes(q),
    );
  }, [productTypes, searchQuery]);

  const totalNoOfAcc = filteredProductTypes.reduce(
    (acc, r) => acc + r.noOfAccount,
    0,
  );

  const totalAmountGranted = filteredProductTypes.reduce(
    (acc, r) => acc + r.originalAmountGranted,
    0,
  );

  const totalOutstandingBalance = filteredProductTypes.reduce(
    (acc, r) => acc + r.outstandingBalance,
    0,
  );

  return (
    <div>
      {/* Top Header & Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-72 sm:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search product types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-200/90 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#05512A] shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-md border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            {/* Header */}
            <thead>
              <tr className="bg-[#F8F9FA] text-[#475467] text-xs font-semibold">
                <th className="whitespace-nowrap px-4 py-3.5 text-left first:rounded-l-md">
                  Product Type
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right">
                  No. of Accounts
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right">
                  Original Amount Granted
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right last:rounded-r-md">
                  Outstanding Balance
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {filteredProductTypes.length > 0 ? (
                filteredProductTypes.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className="text-xs sm:text-sm font-bold text-[#191924]">
                        {item.prodType}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right text-xs sm:text-sm font-semibold text-[#191924]">
                      {item.noOfAccount.toLocaleString()}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right text-xs sm:text-sm font-bold text-[#191924]">
                      ₱ {formatCurrency(item.originalAmountGranted)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right text-xs sm:text-sm font-bold text-[#191924]">
                      ₱ {formatCurrency(item.outstandingBalance)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-xs sm:text-sm text-gray-500"
                  >
                    No product types found.
                  </td>
                </tr>
              )}
            </tbody>

            {/* Summary Footer */}
            {filteredProductTypes.length > 0 && (
              <tfoot className="border-t border-gray-200 bg-[#F8F9FA]/60">
                <tr className="text-xs font-bold text-[#191924]">
                  <td className="px-4 py-3.5 uppercase tracking-wider font-extrabold first:rounded-bl-xl">
                    Total
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold">
                    {totalNoOfAcc.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-bold">
                    ₱ {formatCurrency(totalAmountGranted)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-bold last:rounded-br-xl">
                    ₱ {formatCurrency(totalOutstandingBalance)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
